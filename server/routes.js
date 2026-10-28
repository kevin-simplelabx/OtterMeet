import { Router } from 'express';
import { db } from './db.js';
import { hashPassword, verifyPassword, issueToken, revokeToken, loadHost, requireHost } from './auth.js';

export const api = Router();
api.use(loadHost);

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const FORMATS = ['in_person', 'online', 'hybrid'];
const STATUSES = ['draft', 'published', 'cancelled'];

// ---- Auth ----

api.post('/auth/signup', (req, res) => {
  const name = String(req.body.name || '').trim();
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  if (!name) return res.status(400).json({ error: 'Name is required.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter a valid email.' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  if (db.prepare('SELECT 1 FROM hosts WHERE email = ?').get(email)) {
    return res.status(409).json({ error: 'An account with that email already exists.' });
  }
  const { lastInsertRowid } = db.prepare('INSERT INTO hosts (name, email, password_hash) VALUES (?, ?, ?)')
    .run(name, email, hashPassword(password));
  issueToken(res, Number(lastInsertRowid));
  res.status(201).json({ host: hostById(lastInsertRowid) });
});

api.post('/auth/login', (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();
  const password = String(req.body.password || '');
  const row = db.prepare('SELECT id, password_hash FROM hosts WHERE email = ?').get(email);
  if (!row || !verifyPassword(password, row.password_hash)) {
    return res.status(401).json({ error: 'Email or password is incorrect.' });
  }
  issueToken(res, row.id);
  res.json({ host: hostById(row.id) });
});

api.post('/auth/logout', (req, res) => {
  revokeToken(req, res);
  res.json({ ok: true });
});

api.get('/auth/me', (req, res) => {
  res.json({ host: req.hostUser || null });
});

api.patch('/account', requireHost, (req, res) => {
  const { name, currentPassword, newPassword } = req.body;
  if (name !== undefined) {
    const n = String(name).trim();
    if (!n) return res.status(400).json({ error: 'Name is required.' });
    db.prepare('UPDATE hosts SET name = ? WHERE id = ?').run(n, req.hostUser.id);
  }
  if (newPassword !== undefined) {
    const row = db.prepare('SELECT password_hash FROM hosts WHERE id = ?').get(req.hostUser.id);
    if (!verifyPassword(String(currentPassword || ''), row.password_hash)) {
      return res.status(400).json({ error: 'Current password is incorrect.' });
    }
    if (String(newPassword).length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters.' });
    }
    db.prepare('UPDATE hosts SET password_hash = ? WHERE id = ?').run(hashPassword(String(newPassword)), req.hostUser.id);
  }
  res.json({ host: hostById(req.hostUser.id) });
});

function hostById(id) {
  return db.prepare('SELECT id, name, email, created_at FROM hosts WHERE id = ?').get(id);
}

// ---- Event sessions ----

api.get('/sessions', requireHost, (req, res) => {
  const rows = db.prepare('SELECT * FROM event_sessions WHERE host_id = ? ORDER BY starts_at ASC')
    .all(req.hostUser.id);
  res.json({ sessions: rows });
});

api.post('/sessions', requireHost, (req, res) => {
  const { data, error } = parseSession(req.body);
  if (error) return res.status(400).json({ error });
  const { lastInsertRowid } = db.prepare(`
    INSERT INTO event_sessions (host_id, title, description, starts_at, duration_min, format, location, link, capacity, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(req.hostUser.id, data.title, data.description, data.starts_at, data.duration_min,
      data.format, data.location, data.link, data.capacity, data.status);
  res.status(201).json({ session: sessionFor(req, lastInsertRowid) });
});

api.put('/sessions/:id', requireHost, (req, res) => {
  if (!sessionFor(req, req.params.id)) return res.status(404).json({ error: 'Session not found.' });
  const { data, error } = parseSession(req.body);
  if (error) return res.status(400).json({ error });
  db.prepare(`
    UPDATE event_sessions SET title = ?, description = ?, starts_at = ?, duration_min = ?, format = ?,
      location = ?, link = ?, capacity = ?, status = ?, updated_at = datetime('now')
    WHERE id = ? AND host_id = ?`)
    .run(data.title, data.description, data.starts_at, data.duration_min, data.format,
      data.location, data.link, data.capacity, data.status, req.params.id, req.hostUser.id);
  res.json({ session: sessionFor(req, req.params.id) });
});

api.delete('/sessions/:id', requireHost, (req, res) => {
  const { changes } = db.prepare('DELETE FROM event_sessions WHERE id = ? AND host_id = ?')
    .run(req.params.id, req.hostUser.id);
  if (!changes) return res.status(404).json({ error: 'Session not found.' });
  res.json({ ok: true });
});

function sessionFor(req, id) {
  return db.prepare('SELECT * FROM event_sessions WHERE id = ? AND host_id = ?').get(id, req.hostUser.id);
}

function parseSession(body) {
  const title = String(body.title || '').trim();
  const startsAt = new Date(body.starts_at);
  const duration = Number(body.duration_min);
  const capacity = body.capacity === '' || body.capacity == null ? null : Number(body.capacity);
  const format = FORMATS.includes(body.format) ? body.format : null;
  const status = STATUSES.includes(body.status) ? body.status : null;
  const link = String(body.link || '').trim();

  if (!title) return { error: 'Give your session a title.' };
  if (title.length > 120) return { error: 'Title must be 120 characters or fewer.' };
  if (Number.isNaN(startsAt.getTime())) return { error: 'Pick a start date and time.' };
  if (!Number.isInteger(duration) || duration < 5 || duration > 24 * 60) return { error: 'Duration must be 5–1440 minutes.' };
  if (capacity !== null && (!Number.isInteger(capacity) || capacity < 1)) return { error: 'Capacity must be a whole number above 0.' };
  if (!format) return { error: 'Choose a format.' };
  if (!status) return { error: 'Choose a status.' };
  if (link && !/^https?:\/\//i.test(link)) return { error: 'Links must start with http:// or https://' };

  return {
    data: {
      title,
      description: String(body.description || '').trim().slice(0, 4000),
      starts_at: startsAt.toISOString(),
      duration_min: duration,
      format,
      location: String(body.location || '').trim().slice(0, 200),
      link,
      capacity,
      status,
    },
  };
}

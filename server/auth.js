import { randomBytes, scryptSync, timingSafeEqual, createHash } from 'node:crypto';
import { db } from './db.js';

export const COOKIE = 'om_session';
const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = stored.split(':');
  const expected = Buffer.from(hash, 'hex');
  const actual = scryptSync(password, salt, 64);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

const sha256 = (s) => createHash('sha256').update(s).digest('hex');

export function issueToken(res, hostId) {
  const token = randomBytes(32).toString('base64url');
  const expires = Date.now() + TOKEN_TTL_MS;
  db.prepare('INSERT INTO auth_tokens (token_hash, host_id, expires_at) VALUES (?, ?, ?)')
    .run(sha256(token), hostId, expires);
  res.cookie(COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: TOKEN_TTL_MS,
    path: '/',
  });
}

export function revokeToken(req, res) {
  const token = readCookie(req, COOKIE);
  if (token) db.prepare('DELETE FROM auth_tokens WHERE token_hash = ?').run(sha256(token));
  res.clearCookie(COOKIE, { path: '/' });
}

function readCookie(req, name) {
  const header = req.headers.cookie || '';
  for (const part of header.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

// Attaches req.host (the signed-in host) when a valid cookie is present.
export function loadHost(req, _res, next) {
  const token = readCookie(req, COOKIE);
  if (token) {
    const row = db.prepare(`
      SELECT h.id, h.name, h.email, h.created_at, t.expires_at
      FROM auth_tokens t JOIN hosts h ON h.id = t.host_id
      WHERE t.token_hash = ?`).get(sha256(token));
    if (row && row.expires_at > Date.now()) {
      const { expires_at, ...host } = row;
      req.hostUser = host;
    }
  }
  next();
}

export function requireHost(req, res, next) {
  if (!req.hostUser) return res.status(401).json({ error: 'Please log in.' });
  next();
}

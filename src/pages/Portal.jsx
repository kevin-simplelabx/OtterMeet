import { useEffect, useMemo, useState } from 'react';
import { NavLink, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { useAuth } from '../App.jsx';
import { api } from '../api.js';
import { Button, CrewNote, EmptyState, Icon, KelpTimeline, PebbleBadge } from '../ds/index.js';

export default function Portal() {
  const { host, setHost } = useAuth();
  const navigate = useNavigate();

  async function logout() {
    await api('/auth/logout', { method: 'POST' }).catch(() => {});
    setHost(null);
    navigate('/');
  }

  return (
    <div>
      <header className="portal-head">
        <div className="wrap inner">
          <div className="row" style={{ gap: 24 }}>
            <a href="/" className="wordmark">OtterMeet</a>
            <nav aria-label="Portal" className="tabs">
              <NavLink to="/portal" end className={({ isActive }) => `tab label${isActive ? ' active' : ''}`}>Sessions</NavLink>
              <NavLink to="/portal/account" className={({ isActive }) => `tab label${isActive ? ' active' : ''}`}>Account</NavLink>
            </nav>
          </div>
          <div className="row" style={{ gap: 12 }}>
            <span className="body-sm muted">{host.name}</span>
            <Button variant="quiet" size="sm" onClick={logout}>Log Out</Button>
          </div>
        </div>
      </header>
      <main className="wrap portal-main">
        <Routes>
          <Route index element={<Sessions />} />
          <Route path="account" element={<Account />} />
          <Route path="*" element={<Navigate to="/portal" replace />} />
        </Routes>
      </main>
    </div>
  );
}

/* ---------- Sessions ---------- */

const FILTERS = [
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'draft', label: 'Drafts' },
  { id: 'past', label: 'Past' },
  { id: 'all', label: 'All' },
];
const FORMAT_LABEL = { in_person: 'In person', online: 'Online', hybrid: 'Hybrid' };

const dayFmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
const timeFmt = new Intl.DateTimeFormat(undefined, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
const fmtDay = (iso) => dayFmt.format(new Date(iso));
const fmtTime = (iso) => timeFmt.format(new Date(iso));
const fmtDuration = (m) => (m % 60 === 0 ? `${m / 60} h` : m > 60 ? `${Math.floor(m / 60)} h ${m % 60} min` : `${m} min`);
const endsAt = (s) => new Date(new Date(s.starts_at).getTime() + s.duration_min * 60000);

function Sessions() {
  const [sessions, setSessions] = useState(null);
  const [loadError, setLoadError] = useState('');
  const [filter, setFilter] = useState('upcoming');
  const [editing, setEditing] = useState(null); // null | {} (new) | session
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    api('/sessions').then((d) => setSessions(d.sessions)).catch((e) => setLoadError(e.message));
  }, []);

  const now = Date.now();
  const isPast = (s) => endsAt(s).getTime() < now;

  const visible = useMemo(() => {
    if (!sessions) return [];
    const list = sessions.filter((s) => {
      if (filter === 'upcoming') return !isPast(s) && s.status !== 'cancelled';
      if (filter === 'draft') return s.status === 'draft';
      if (filter === 'past') return isPast(s);
      return true;
    });
    return filter === 'past' ? list.reverse() : list;
  }, [sessions, filter]);

  if (loadError) return <div role="alert" className="alert body">{loadError}</div>;
  if (!sessions) return <p className="body muted">Loading your sessions…</p>;

  const upcoming = sessions.filter((s) => !isPast(s) && s.status !== 'cancelled');
  const stats = [
    { label: 'Upcoming', value: upcoming.length },
    { label: 'Published', value: upcoming.filter((s) => s.status === 'published').length },
    { label: 'Drafts', value: sessions.filter((s) => s.status === 'draft').length },
    { label: 'Seats offered', value: upcoming.reduce((n, s) => n + (s.capacity || 0), 0) },
  ];

  function saved(session) {
    setSessions((list) => {
      const rest = list.filter((s) => s.id !== session.id);
      return [...rest, session].sort((a, b) => a.starts_at.localeCompare(b.starts_at));
    });
    setEditing(null);
  }

  async function confirmDelete() {
    await api(`/sessions/${deleting.id}`, { method: 'DELETE' });
    setSessions((list) => list.filter((s) => s.id !== deleting.id));
    setDeleting(null);
  }

  function duplicate(s) {
    const { id, created_at, updated_at, ...rest } = s;
    setEditing({ ...rest, title: `${s.title} (copy)`, status: 'draft' });
  }

  return (
    <div className="stack" style={{ gap: 32 }}>
      <div className="row" style={{ justifyContent: 'space-between', gap: 16 }}>
        <div className="stack" style={{ gap: 4 }}>
          <h1 className="heading-1 m0">Your sessions</h1>
          <p className="body m0 muted">Plan, publish and keep track of every session you host.</p>
        </div>
        <Button variant="action" icon="calendar" onClick={() => setEditing({})}>New Session</Button>
      </div>

      <div className="stats">
        {stats.map((s) => (
          <div key={s.label} className="card stat">
            <span className="eyebrow muted">{s.label}</span>
            <span className="num">{s.value}</span>
          </div>
        ))}
      </div>

      {sessions.length === 0 ? (
        <div style={{ maxWidth: 560, margin: '0 auto', width: '100%' }}>
          <EmptyState
            title="Your river is quiet."
            illustrationLabel="[Otto illustration: unrolling a blank agenda map]"
            actions={<Button variant="accent" onClick={() => setEditing({})}>Draft a Session</Button>}
          >
            You have no sessions yet. Draft your first one: it stays private until you publish it.
          </EmptyState>
        </div>
      ) : (
        <div className="portal-grid">
          <section className="stack" style={{ gap: 16 }} aria-label="Session list">
            <div className="filters" role="group" aria-label="Filter sessions">
              {FILTERS.map((f) => (
                <button key={f.id} type="button" className="chip label" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)}>
                  {f.label}
                </button>
              ))}
            </div>
            {visible.length === 0 ? (
              <p className="body muted" style={{ padding: '24px 0' }}>No sessions match this filter.</p>
            ) : (
              visible.map((s) => (
                <SessionCard
                  key={s.id}
                  session={s}
                  past={isPast(s)}
                  onEdit={() => setEditing(s)}
                  onDuplicate={() => duplicate(s)}
                  onDelete={() => setDeleting(s)}
                />
              ))
            )}
          </section>
          <ComingUp sessions={upcoming.filter((s) => s.status === 'published')} />
        </div>
      )}

      {editing && <SessionDialog initial={editing} onClose={() => setEditing(null)} onSaved={saved} />}
      {deleting && (
        <ConfirmDialog
          title="Delete this session?"
          confirmLabel="Delete Session"
          onCancel={() => setDeleting(null)}
          onConfirm={confirmDelete}
        >
          “{deleting.title}” on {fmtDay(deleting.starts_at)} will be removed permanently. To keep its details, mark it
          cancelled instead.
        </ConfirmDialog>
      )}
    </div>
  );
}

function StatusBadge({ status, past }) {
  if (status === 'cancelled') return <PebbleBadge tone="action" dot>Cancelled</PebbleBadge>;
  if (status === 'draft') return <PebbleBadge tone="neutral">Draft</PebbleBadge>;
  if (past) return <PebbleBadge tone="neutral" icon="check">Ended</PebbleBadge>;
  return <PebbleBadge tone="success" icon="check">Published</PebbleBadge>;
}

function SessionCard({ session: s, past, onEdit, onDuplicate, onDelete }) {
  const where = s.format === 'online' ? 'Online' : s.location || FORMAT_LABEL[s.format];
  return (
    <article className="card session">
      <div className="row" style={{ justifyContent: 'space-between', gap: 12 }}>
        <span className="eyebrow muted">{fmtDay(s.starts_at)} • {fmtTime(s.starts_at)}</span>
        <StatusBadge status={s.status} past={past} />
      </div>
      <h2 className="title m0">{s.title}</h2>
      {s.description && <p className="body-sm m0 muted" style={{ whiteSpace: 'pre-line' }}>{s.description}</p>}
      <div className="session-meta meta">
        <span><Icon name="clock" size={16} />{fmtDuration(s.duration_min)}</span>
        <span><Icon name={s.format === 'online' ? 'wave' : 'pin'} size={16} />{where}</span>
        {s.format === 'hybrid' && <span><Icon name="wave" size={16} />Hybrid</span>}
        <span><Icon name="people" size={16} />{s.capacity ? `${s.capacity} seats` : 'No seat limit'}</span>
      </div>
      <div className="session-foot">
        {s.link ? <a href={s.link} target="_blank" rel="noreferrer" className="body-sm">Session link</a> : <span />}
        <div className="row" style={{ gap: 4 }}>
          <button type="button" className="icon-btn" onClick={onDuplicate} aria-label={`Duplicate ${s.title}`} title="Duplicate">
            <Icon name="ticket" size={18} />
          </button>
          <button type="button" className="icon-btn" onClick={onDelete} aria-label={`Delete ${s.title}`} title="Delete">
            <Icon name="close" size={18} />
          </button>
          <Button variant="quiet" size="sm" onClick={onEdit}>Edit</Button>
        </div>
      </div>
    </article>
  );
}

function ComingUp({ sessions }) {
  const next = sessions.slice(0, 6);
  const days = [];
  next.forEach((s, i) => {
    const label = fmtDay(s.starts_at);
    let day = days.find((d) => d.label === label);
    if (!day) days.push((day = { label, items: [] }));
    const live = new Date(s.starts_at).getTime() <= Date.now();
    day.items.push({
      time: fmtTime(s.starts_at),
      title: s.title,
      detail: [s.format === 'online' ? 'Online' : s.location, fmtDuration(s.duration_min)].filter(Boolean).join(' · '),
      status: live ? 'now' : undefined,
      badge: !live && i === 0 ? 'Next' : undefined,
      badgeTone: 'accent',
    });
  });

  return (
    <aside className="card stack" style={{ gap: 20, padding: 24, position: 'sticky', top: 96 }}>
      <div className="stack" style={{ gap: 4 }}>
        <span className="eyebrow muted">Kelp Timeline</span>
        <h2 className="heading-3 m0">Coming up</h2>
      </div>
      {days.length ? (
        <>
          <KelpTimeline days={days} />
          <CrewNote character="otto">Otto lined up your next {next.length === 1 ? 'session' : `${next.length} sessions`}!</CrewNote>
        </>
      ) : (
        <p className="body-sm m0 muted">Published upcoming sessions appear here in time order.</p>
      )}
    </aside>
  );
}

/* ---------- Dialogs ---------- */

function Dialog({ title, onClose, size, children }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev; };
  }, [onClose]);

  return (
    <div className="scrim" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div role="dialog" aria-modal="true" aria-labelledby="dialog-title" className={`dialog${size === 'sm' ? ' dialog--sm' : ''}`}>
        <div className="dialog-head">
          <h2 id="dialog-title" className="heading-3 m0">{title}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close"><Icon name="close" size={20} /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ConfirmDialog({ title, confirmLabel, onCancel, onConfirm, children }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  async function go() {
    setBusy(true);
    try { await onConfirm(); } catch (e) { setError(e.message); setBusy(false); }
  }
  return (
    <Dialog title={title} onClose={onCancel} size="sm">
      <p className="body m0 muted">{children}</p>
      {error && <div role="alert" className="alert body-sm">{error}</div>}
      <div className="dialog-foot">
        <Button variant="quiet" onClick={onCancel}>Keep It</Button>
        <Button variant="accent" onClick={go} disabled={busy}>{confirmLabel}</Button>
      </div>
    </Dialog>
  );
}

function toLocalInput(iso) {
  const d = iso ? new Date(iso) : nextHour();
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function nextHour() {
  const d = new Date(Date.now() + 24 * 3600000);
  d.setMinutes(0, 0, 0);
  return d;
}

function SessionDialog({ initial, onClose, onSaved }) {
  const isEdit = Boolean(initial.id);
  const [v, setV] = useState({
    title: initial.title || '',
    description: initial.description || '',
    starts_at: toLocalInput(initial.starts_at),
    duration_min: initial.duration_min ?? 60,
    format: initial.format || 'in_person',
    location: initial.location || '',
    link: initial.link || '',
    capacity: initial.capacity ?? '',
    status: initial.status || 'draft',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const bind = (name) => ({ name, value: v[name], onChange: (e) => setV((x) => ({ ...x, [name]: e.target.value })) });

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const body = {
        ...v,
        starts_at: new Date(v.starts_at).toISOString(),
        duration_min: Number(v.duration_min),
      };
      const { session } = await api(isEdit ? `/sessions/${initial.id}` : '/sessions', { method: isEdit ? 'PUT' : 'POST', body });
      onSaved(session);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  return (
    <Dialog title={isEdit ? 'Edit session' : 'New session'} onClose={onClose}>
      <form className="stack" style={{ gap: 20 }} onSubmit={submit} noValidate>
        {error && <div role="alert" className="alert body-sm">{error}</div>}
        <div className="form-grid">
          <label className="field span-2">
            <span className="label">Title</span>
            <input className="input" maxLength={120} autoFocus {...bind('title')} placeholder="e.g. Facilitation Fundamentals" />
          </label>
          <label className="field span-2">
            <span className="label">Description</span>
            <textarea className="input" maxLength={4000} {...bind('description')} placeholder="What will people do, and who is it for?" />
          </label>
          <label className="field">
            <span className="label">Starts</span>
            <input className="input" type="datetime-local" {...bind('starts_at')} />
          </label>
          <label className="field">
            <span className="label">Run-time (minutes)</span>
            <input className="input" type="number" min={5} max={1440} step={5} {...bind('duration_min')} />
          </label>
          <label className="field">
            <span className="label">Format</span>
            <select className="input" {...bind('format')}>
              <option value="in_person">In person</option>
              <option value="online">Online</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </label>
          <label className="field">
            <span className="label">Seat limit</span>
            <input className="input" type="number" min={1} {...bind('capacity')} placeholder="No limit" />
          </label>
          {v.format !== 'online' && (
            <label className="field span-2">
              <span className="label">Location</span>
              <input className="input" maxLength={200} {...bind('location')} placeholder="Venue, room or address" />
            </label>
          )}
          {v.format !== 'in_person' && (
            <label className="field span-2">
              <span className="label">Online link</span>
              <input className="input" type="url" {...bind('link')} placeholder="https://" />
            </label>
          )}
          <label className="field">
            <span className="label">Status</span>
            <select className="input" {...bind('status')}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
        </div>
        <div className="dialog-foot">
          <Button type="button" variant="quiet" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="action" disabled={busy}>{busy ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Session'}</Button>
        </div>
      </form>
    </Dialog>
  );
}

/* ---------- Account ---------- */

function Account() {
  const { host, setHost } = useAuth();
  const [name, setName] = useState(host.name);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [msg, setMsg] = useState({});

  async function save(kind, body) {
    setMsg({});
    try {
      const { host: next } = await api('/account', { method: 'PATCH', body });
      setHost(next);
      if (kind === 'pw') setPw({ currentPassword: '', newPassword: '' });
      setMsg({ [kind]: { ok: kind === 'pw' ? 'Password updated.' : 'Name saved.' } });
    } catch (e) {
      setMsg({ [kind]: { error: e.message } });
    }
  }

  const Note = ({ m }) => m ? (
    m.error
      ? <div role="alert" className="alert body-sm">{m.error}</div>
      : <p role="status" className="body-sm m0" style={{ color: 'var(--success)' }}>{m.ok}</p>
  ) : null;

  return (
    <div className="stack" style={{ gap: 32, maxWidth: 560 }}>
      <div className="stack" style={{ gap: 4 }}>
        <h1 className="heading-1 m0">Account</h1>
        <p className="body m0 muted">Signed in as {host.email}. Host since {new Date(host.created_at + 'Z').toLocaleDateString()}.</p>
      </div>

      <form className="card stack" style={{ gap: 16, padding: 24 }} onSubmit={(e) => { e.preventDefault(); save('name', { name }); }}>
        <h2 className="title m0">Profile</h2>
        <label className="field">
          <span className="label">Host name</span>
          <input className="input" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <Note m={msg.name} />
        <div><Button type="submit" variant="accent" size="sm">Save Name</Button></div>
      </form>

      <form className="card stack" style={{ gap: 16, padding: 24 }} onSubmit={(e) => { e.preventDefault(); save('pw', pw); }}>
        <h2 className="title m0">Password</h2>
        <label className="field">
          <span className="label">Current password</span>
          <input className="input" type="password" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} />
        </label>
        <label className="field">
          <span className="label">New password</span>
          <input className="input" type="password" autoComplete="new-password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} />
          <span className="hint body-sm">At least 8 characters.</span>
        </label>
        <Note m={msg.pw} />
        <div><Button type="submit" variant="quiet" size="sm">Update Password</Button></div>
      </form>
    </div>
  );
}

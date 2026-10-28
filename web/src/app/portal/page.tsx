'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, CrewNote, EmptyState, Icon } from '@/ds';
import { Alert, Field, inputClass } from '@/components/AuthForm';
import { Dialog } from '@/components/Dialog';
import { StatusBadge } from '@/components/StatusBadge';
import { api } from '@/lib/api';
import { formatMinutes } from '@/lib/blocks';
import type { LiveSession } from '@/lib/types';

export default function SessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<LiveSession[] | null>(null);
  const [error, setError] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    api<{ sessions: LiveSession[] }>('/sessions').then((d) => setSessions(d.sessions), (e) => setError(e.message));
  }, []);

  const live = sessions?.find((s) => s.status === 'LIVE');

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <span className="eyebrow text-ink-muted">Host portal</span>
          <h1 className="heading-1 m-0">Your sessions</h1>
          <p className="body m-0 text-ink-muted">Each session is one room code and a timeline of activity blocks.</p>
        </div>
        <Button variant="action" icon="raft" onClick={() => setCreating(true)}>New Session</Button>
      </div>

      {error && <Alert>{error}</Alert>}

      {live && (
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-lg bg-success-soft border border-border">
          <div className="flex flex-col gap-1">
            <span className="eyebrow text-ink-muted">Live now · room {live.room_code}</span>
            <span className="title">{live.title}</span>
          </div>
          <Button variant="accent" iconEnd="arrow-right" href={`/host/${live.id}`}>Open Cockpit</Button>
        </div>
      )}

      {sessions === null && !error && <p className="body text-ink-muted">Rounding up your sessions…</p>}

      {sessions?.length === 0 && (
        <div className="max-w-[560px] mx-auto w-full">
          <EmptyState title="Your river is quiet." illustrationLabel="[Otto illustration: floating on its back, holding a clicker]">
            Create a session to get a room code, then lay out the timeline your attendees will play through.
          </EmptyState>
        </div>
      )}

      {sessions && sessions.length > 0 && (
        <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(320px,1fr))]">
          {sessions.map((s) => {
            const total = s.blocks.reduce((t, b) => t + b.duration_estimate_sec, 0);
            return (
              <a key={s.id} href={`/portal/sessions/${s.id}`}
                className="group bg-surface-card border border-border rounded-lg shadow-card hover:shadow-float transition-shadow p-5 flex flex-col gap-3 no-underline !text-ink">
                <div className="flex items-center justify-between gap-3">
                  <span className="eyebrow text-ink-muted">Room {s.room_code}</span>
                  <StatusBadge status={s.status} />
                </div>
                <h2 className="title m-0 group-hover:text-accent">{s.title}</h2>
                <div className="flex flex-wrap gap-x-4 gap-y-2 body-sm text-ink-muted">
                  <span className="inline-flex items-center gap-1.5"><Icon name="wave" size={16} />{s.blocks.length} {s.blocks.length === 1 ? 'block' : 'blocks'}</span>
                  <span className="inline-flex items-center gap-1.5"><Icon name="clock" size={16} />{formatMinutes(total)}</span>
                </div>
              </a>
            );
          })}
        </div>
      )}

      {sessions && sessions.length > 0 && !live && (
        <CrewNote character="otto">Otto’s tip: open the stage screen on the projector before you go live, so the QR code is up when people arrive.</CrewNote>
      )}

      {creating && (
        <NewSessionDialog onClose={() => setCreating(false)} onCreated={(s) => router.push(`/portal/sessions/${s.id}`)} />
      )}
    </div>
  );
}

function NewSessionDialog({ onClose, onCreated }: { onClose: () => void; onCreated: (s: LiveSession) => void }) {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { session } = await api<{ session: LiveSession }>('/sessions', { method: 'POST', body: { title } });
      onCreated(session);
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <Dialog title="New session" size="sm" onClose={onClose}>
      <form className="flex flex-col gap-4" onSubmit={submit} noValidate>
        {error && <Alert>{error}</Alert>}
        <Field label="Session title" hint="Attendees see this on their phones and the stage.">
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Q4 Offsite" maxLength={120} required />
        </Field>
        <p className="body-sm m-0 text-ink-muted">We’ll start you with a lobby, a crowd debate, Q&amp;A and a wrap-up survey. Change it however you like.</p>
        <div className="flex flex-wrap justify-end gap-3">
          <Button variant="quiet" onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="action" disabled={busy}>{busy ? 'Creating…' : 'Create Session'}</Button>
        </div>
      </form>
    </Dialog>
  );
}

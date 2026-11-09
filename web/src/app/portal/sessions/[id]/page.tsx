'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button, CrewNote, RaftToggle } from '@/ds';
import { Alert, Field, inputClass } from '@/components/AuthForm';
import { Dialog } from '@/components/Dialog';
import { GroupsEditor } from '@/components/GroupsEditor';
import { SessionTimelineBuilder } from '@/components/SessionTimelineBuilder';
import { StatusBadge } from '@/components/StatusBadge';
import { api } from '@/lib/api';
import type { Group, LiveSession, TimelineBlockItem } from '@/lib/types';

export default function SessionEditor() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<TimelineBlockItem[]>([]);
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const load = (s: LiveSession) => { setSession(s); setTitle(s.title); setBlocks(s.blocks); setDirty(false); };

  useEffect(() => {
    api<{ session: LiveSession }>(`/sessions/${id}`).then((d) => load(d.session), (e) => setError(e.message));
  }, [id]);

  // Warn before leaving with unsaved timeline changes.
  useEffect(() => {
    if (!dirty) return;
    const onBeforeUnload = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [dirty]);

  async function run<T>(fn: () => Promise<T>, done?: string) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await fn();
      if (done) setNotice(done);
      return result;
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const save = () => run(async () => {
    if (title !== session!.title) await api(`/sessions/${id}`, { method: 'PATCH', body: { title } });
    const { session: s } = await api<{ session: LiveSession }>(`/sessions/${id}/blocks`, { method: 'PUT', body: { blocks } });
    load(s);
    return s;
  }, 'Saved.');

  const goLive = () => run(async () => {
    if (dirty && !(await save())) return;
    await api(`/sessions/${id}/go_live`, { method: 'POST' });
    router.push(`/host/${id}`);
  });

  const finish = () => run(async () => {
    const { session: s } = await api<{ session: LiveSession }>(`/sessions/${id}/finish`, { method: 'POST' });
    load(s);
  }, 'Session wrapped. The room code won’t let new people in now.');

  const updateSettings = (settings: Partial<LiveSession['settings']>) => run(async () => {
    const { session: s } = await api<{ session: LiveSession }>(`/sessions/${id}`, { method: 'PATCH', body: { settings } });
    setSession(s);
  });

  if (!session) return error ? <Alert>{error}</Alert> : <p className="body text-ink-muted">Fetching your session…</p>;

  const live = session.status === 'LIVE';

  return (
    <div className="flex flex-col gap-8">
      <Link href="/portal" className="body-sm w-fit">← All sessions</Link>

      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex flex-col gap-3 flex-[1_1_360px] min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <span className="eyebrow text-ink-muted">Room code</span>
            <span className="font-sans font-extrabold text-2xl tracking-[0.2em]">{session.room_code}</span>
            <StatusBadge status={session.status} />
          </div>
          <input aria-label="Session title" className={`${inputClass} heading-2 !text-[28px] !min-h-14`} value={title} maxLength={120}
            onChange={(e) => { setTitle(e.target.value); setDirty(true); }} />
        </div>
        <div className="flex flex-wrap gap-3">
          {live ? (
            <>
              <Button variant="quiet" onClick={finish} disabled={busy}>End Session</Button>
              <Button variant="action" iconEnd="arrow-right" href={`/host/${id}`}>Open Cockpit</Button>
            </>
          ) : (
            <Button variant="action" iconEnd="arrow-right" onClick={goLive} disabled={busy || blocks.length === 0}>Go Live</Button>
          )}
        </div>
      </div>

      {error && <Alert>{error}</Alert>}
      {notice && <p role="status" className="body-sm m-0 text-ink-muted">{notice}</p>}

      <div className="grid gap-8 grid-cols-[minmax(0,1fr)_320px] max-[960px]:grid-cols-1 items-start">
        <section className="flex flex-col gap-6">
          <SessionTimelineBuilder blocks={blocks} activeIndex={live ? session.active_block_index : undefined}
            onChange={(b) => { setBlocks(b); setDirty(true); }} />
          {/* Room for the floating save bar, so it never covers the last block. */}
          {dirty && <div aria-hidden className="h-20" />}
        </section>

        {/* Only shows up when there's something to save, floating over the page rather than inside the timeline. */}
        {dirty && (
          <div role="region" aria-label="Unsaved changes"
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-32px)] max-w-[560px] bg-surface-card border border-border rounded-full shadow-float pl-6 pr-2 py-2 flex items-center justify-between gap-3 animate-[om-pop_200ms_ease-out]">
            <span className="body-sm text-ink">You’ve got unsaved changes.</span>
            <div className="flex gap-2">
              <Button variant="quiet" size="sm" disabled={busy} onClick={() => { setTitle(session.title); setBlocks(session.blocks); setDirty(false); }}>Discard</Button>
              <Button variant="accent" size="sm" onClick={save} disabled={busy}>{busy ? 'Saving…' : 'Save Timeline'}</Button>
            </div>
          </div>
        )}

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
          <div className="bg-surface-card border border-border rounded-lg shadow-card p-5 flex flex-col gap-4">
            <h2 className="title m-0">Room settings</h2>
            <div className="flex flex-col gap-1.5">
              <span className="label">Emoji shower</span>
              <RaftToggle label="Emoji shower" value={session.settings.allow_emoji_shower ? 'on' : 'off'}
                options={[{ value: 'on', label: 'On' }, { value: 'off', label: 'Off' }]}
                onChange={(v: string) => updateSettings({ allow_emoji_shower: v === 'on' })} />
            </div>
            <Field label="Room capacity" hint="Once the raft is this full, new people can’t join.">
              <input type="number" min={2} max={1000} className={inputClass} defaultValue={session.settings.max_participants}
                onBlur={(e) => {
                  const n = Math.max(2, Math.min(1000, Number(e.target.value) || 150));
                  if (n !== session.settings.max_participants) updateSettings({ max_participants: n });
                }} />
            </Field>
          </div>
          <GroupsEditor groups={session.settings.groups ?? []} busy={busy} onSave={(groups: Group[]) => updateSettings({ groups })} />
          <CrewNote character="rue">Rue’s tip: put a Holding Screen block on for talks, so phones can still send reactions.</CrewNote>
          <Button variant="quiet" onClick={() => setConfirmDelete(true)}>Delete Session</Button>
        </aside>
      </div>

      {confirmDelete && (
        <Dialog title="Delete this session?" size="sm" onClose={() => setConfirmDelete(false)}>
          <p className="body m-0 text-ink-muted">“{session.title}”, its timeline and everyone who joined room {session.room_code} will be removed. This can’t be undone.</p>
          <div className="flex flex-wrap justify-end gap-3">
            <Button variant="quiet" onClick={() => setConfirmDelete(false)}>Keep It</Button>
            <Button variant="action" disabled={busy}
              onClick={() => run(async () => { await api(`/sessions/${id}`, { method: 'DELETE' }); router.replace('/portal'); })}>
              Delete Session
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
}

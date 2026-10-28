'use client';
// Host Cockpit (spec 1 / 6): the speaker's laptop. Drives the stage and every phone in the room.
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Button, CrewNote, Icon, PebbleBadge } from '@/ds';
import { Alert } from '@/components/AuthForm';
import { RoomQr, joinUrl } from '@/components/RoomQr';
import { StatusBadge } from '@/components/StatusBadge';
import { StagePreview } from '@/components/host/StagePreview';
import { LiveResults } from '@/components/host/LiveResults';
import { QnAModerationDrawer } from '@/components/host/QnAModerationDrawer';
import { CLICKER_KEYS, useHostClicker } from '@/hooks/useHostClicker';
import { api } from '@/lib/api';
import { useRequireHost } from '@/lib/auth';
import { BLOCK_TYPES, formatMinutes } from '@/lib/blocks';
import { useLiveRoom, useStageHint } from '@/lib/live';
import type { LiveSession, Roster, StageState } from '@/lib/types';

export default function HostCockpit() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const host = useRequireHost();
  const [session, setSession] = useState<LiveSession | null>(null);
  const [initial, setInitial] = useState<StageState | null>(null);
  const [initialRoster, setInitialRoster] = useState<Roster | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [qnaOpen, setQnaOpen] = useState(false);

  const load = useCallback(() => api<{ session: LiveSession; live: StageState; roster: Roster }>(`/sessions/${id}/live`).then((d) => {
    setSession(d.session); setInitial(d.live); setInitialRoster(d.roster);
  }, (e) => setError(e.message)), [id]);

  useEffect(() => { if (host) load(); }, [host, load]);

  const { state, roster, connected, perform, tally, qna, qnaQueue } = useLiveRoom(session?.room_code, { role: 'host', initial });
  const hint = useStageHint(session?.room_code);
  const people = roster ?? initialRoster;
  const blocks = useMemo(() => session?.blocks ?? [], [session]);

  // Tell a stage window on this laptop what to show right away, then ask the server to make it so.
  const goto = useCallback((index: number) => {
    if (!state || !blocks.length) return;
    const i = Math.max(0, Math.min(blocks.length - 1, index));
    const b = blocks[i];
    hint({ ...state, blackout: false, block_index: i, step: 0, activity: null, block: { id: b.id!, block_type: b.block_type, title: b.title, duration_sec: b.duration_estimate_sec } });
    perform('goto_block', { index: i });
  }, [state, blocks, hint, perform]);

  // Next/Back step through a block first (vote, reveal, next question), then move to the next block.
  const step = useCallback((delta: 1 | -1) => {
    if (!state) return;
    const inside = delta > 0 ? state.step + 1 < state.step_count : state.step > 0;
    if (inside) perform(delta > 0 ? 'next_block' : 'prev_block');
    else goto(state.block_index + delta);
  }, [state, perform, goto]);

  const moderate = useCallback((questionId: string, decision: string) => perform('moderate_qna', { question_id: questionId, decision }), [perform]);

  const toggleBlackout = useCallback(() => {
    if (!state) return;
    hint({ ...state, blackout: !state.blackout });
    perform('toggle_blackout', { on: !state.blackout });
  }, [state, hint, perform]);

  useHostClicker({
    next: () => step(1),
    prev: () => step(-1),
    blackout: toggleBlackout,
    stragglers: () => perform('rescue_stragglers'),
  }, state?.status === 'LIVE');

  async function act(path: 'go_live' | 'finish') {
    setBusy(true); setError('');
    try { await api(`/sessions/${id}/${path}`, { method: 'POST' }); await load(); }
    catch (e) { setError((e as Error).message); }
    finally { setBusy(false); }
  }

  const openStage = () => window.open(`/stage/${id}`, `ottermeet-stage-${id}`, 'popup,width=1280,height=720');

  if (!host || (!session && !error)) return <p className="body text-ink-muted p-8">Warming up the cockpit…</p>;
  if (!session || !state) return <div className="p-8"><Alert>{error || 'We couldn’t find that session. It may have drifted off.'}</Alert></div>;

  const live = state.status === 'LIVE';
  const current = blocks[state.block_index];
  const nextBlock = blocks[state.block_index + 1];
  const a = state.activity;
  const moreSteps = state.step + 1 < state.step_count;
  const nextLabel = moreSteps ? stepLabel(a, state.step) : nextBlock ? `Next: ${nextBlock.title}` : 'Last Block';
  const pending = qnaQueue ?? [];

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-surface border-b border-border">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-3 py-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 min-w-0">
            <Link href={`/portal/sessions/${id}`} className="body-sm">← Edit</Link>
            <h1 className="title m-0 truncate">{session.title}</h1>
            <StatusBadge status={state.status} />
            <span className="body-sm text-ink-muted inline-flex items-center gap-1.5" aria-live="polite">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-success' : 'bg-action'}`} aria-hidden />
              {connected ? 'Connected' : 'Paddling back online…'}
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="quiet" size="sm" icon="easel" onClick={() => setQnaOpen(true)}>Q&amp;A Queue{pending.length ? ` (${pending.length})` : ''}</Button>
            <Button variant="accent" size="sm" icon="cabin" onClick={openStage}>Open Stage Screen</Button>
            {live
              ? <Button variant="quiet" size="sm" onClick={() => act('finish')} disabled={busy}>End Session</Button>
              : <Button variant="quiet" size="sm" onClick={() => act('go_live')} disabled={busy}>Go Live</Button>}
          </div>
        </div>
      </header>

      <main className="wrap pt-8 pb-16 grid gap-8 grid-cols-[minmax(0,1fr)_340px] max-[1024px]:grid-cols-1 items-start">
        <div className="flex flex-col gap-6 min-w-0">
          {error && <Alert>{error}</Alert>}
          {!live && (
            <Alert>
              {state.status === 'COMPLETED'
                ? 'This session has wrapped. Go live again to reopen the river.'
                : 'You’re not live yet, so nobody can hop in. Press Go Live when you’re ready.'}
            </Alert>
          )}

          <section aria-label="On stage now" className={`rounded-xl p-6 flex flex-col gap-5 shadow-float ${state.blackout ? 'bg-black' : 'bg-surface-card border border-border'}`}
            data-theme={state.blackout ? 'dark' : undefined}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="eyebrow text-ink-muted">On stage now · block {state.block_index + 1} of {blocks.length}</span>
              {state.blackout && <PebbleBadge tone="action">Stage blacked out</PebbleBadge>}
            </div>
            {current && (
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-accent-soft text-accent flex-none"><Icon name={BLOCK_TYPES[current.block_type].icon} size={28} /></span>
                <div className="flex flex-col gap-1 min-w-0">
                  <span className="eyebrow text-ink-muted">{BLOCK_TYPES[current.block_type].label}</span>
                  <h2 className="heading-2 m-0 text-ink">{current.title}</h2>
                  {!BLOCK_TYPES[current.block_type].ready && <span className="body-sm text-ink-muted">This game is still being built, so the stage shows an “up next” card for now.</span>}
                </div>
              </div>
            )}
            {a && current?.id && !state.blackout && <LiveResults sessionId={id} blockId={current.id} activity={a} tally={tally} rescue={() => perform('rescue_stragglers')} />}
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="quiet" icon="arrow-right" onClick={() => step(-1)} disabled={!live || (state.block_index === 0 && state.step === 0)}
                className="[&_.om-icon]:rotate-180">Previous</Button>
              <Button variant="action" iconEnd="arrow-right" onClick={() => step(1)} disabled={!live || (!moreSteps && !nextBlock)}>
                {nextLabel}
              </Button>
              <Button variant="quiet" onClick={toggleBlackout} disabled={!live}>{state.blackout ? 'Show Stage' : 'Blackout'}</Button>
            </div>
          </section>

          <section aria-label="Timeline" className="flex flex-col gap-3">
            <h2 className="heading-3 m-0">Timeline</h2>
            <ol className="list-none m-0 p-0 flex flex-col gap-2">
              {blocks.map((b, i) => {
                const active = i === state.block_index;
                return (
                  <li key={b.id}>
                    <button type="button" onClick={() => goto(i)} disabled={!live} aria-current={active ? 'step' : undefined}
                      className={`w-full text-left flex items-center gap-3 p-3 rounded-lg border cursor-pointer disabled:cursor-default
                        ${active ? 'border-success bg-success-soft' : i < state.block_index ? 'border-border bg-surface-card opacity-70' : 'border-border bg-surface-card hover:bg-surface-fill'}`}>
                      <span className="tag text-ink-muted w-6 text-right tabular-nums">{i + 1}</span>
                      <Icon name={BLOCK_TYPES[b.block_type].icon} size={20} />
                      <span className="flex-1 min-w-0 flex flex-col">
                        <span className="body text-ink truncate">{b.title}</span>
                        <span className="meta text-ink-muted">{BLOCK_TYPES[b.block_type].label} · {formatMinutes(b.duration_estimate_sec)}</span>
                      </span>
                      {active && <PebbleBadge tone="success">On now</PebbleBadge>}
                    </button>
                  </li>
                );
              })}
            </ol>
          </section>
        </div>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
          <StagePreview sessionId={id} blackout={state.blackout} />
          <div className="bg-surface-card border border-border rounded-lg shadow-card p-5 flex flex-col items-center gap-3 text-center">
            <RoomQr code={state.code} size={180} />
            <span className="font-sans font-extrabold text-4xl tracking-[0.2em]">{state.code}</span>
            <a href={joinUrl(state.code)} target="_blank" rel="noreferrer" className="body-sm break-all">{joinUrl(state.code).replace(/^https?:\/\//, '')}</a>
          </div>

          <div className="bg-surface-card border border-border rounded-lg shadow-card p-5 flex flex-col gap-3">
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="title m-0">In the room</h2>
              <span className="body-sm text-ink-muted tabular-nums">{people?.count ?? 0} here{people && people.total > people.count ? ` · ${people.total - people.count} away` : ''}</span>
            </div>
            {!people?.participants.length
              ? <p className="body-sm m-0 text-ink-muted">The river’s empty for now. Put the stage screen up so people can scan in.</p>
              : (
                <ul className="list-none m-0 p-0 flex flex-col gap-1 max-h-80 overflow-y-auto">
                  {[...people.participants].reverse().map((p) => (
                    <li key={p.id} className={`flex items-center gap-2 body-sm py-1 ${p.is_connected ? '' : 'opacity-50'}`}>
                      <span className="text-xl" aria-hidden>{p.avatar}</span>
                      <span className="flex-1 truncate">{p.nickname}</span>
                      {!p.is_connected && <span className="meta text-ink-muted">away</span>}
                    </li>
                  ))}
                </ul>
              )}
          </div>

          <div className="bg-surface-card border border-border rounded-lg shadow-card p-5 flex flex-col gap-3">
            <h2 className="title m-0">Clicker shortcuts</h2>
            <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 body-sm">
              {CLICKER_KEYS.map(([keys, what]) => (
                <div key={keys} className="contents"><dt className="tag text-ink">{keys}</dt><dd className="m-0 text-ink-muted">{what}</dd></div>
              ))}
            </dl>
          </div>

          <CrewNote character="otto">Drag the stage window onto the projector, press F, then steer the whole raft from here.</CrewNote>
          <Button variant="quiet" onClick={() => router.push('/portal')}>Back to Portal</Button>
        </aside>
      </main>
      <QnAModerationDrawer open={qnaOpen} onClose={() => setQnaOpen(false)} queue={pending} feed={qna} moderate={moderate} />
    </div>
  );
}

/** What the next clicker press does inside a multi-step game. */
function stepLabel(a: StageState['activity'], step: number) {
  switch (a?.kind) {
    case 'THIS_OR_THAT': return a.revealed ? 'Next Question' : 'Reveal Results';
    case 'SPEED_QUIZ': return a.phase === 'question' ? 'Reveal Answer' : a.phase === 'reveal' ? 'Show Leaderboard' : 'Next Question';
    case 'SPLIT_WORDS': return a.phase === 'pairs' ? 'Merge Into Quads' : 'Gather Tribes';
    case 'IMPOSTER': return a.phase === 'words' ? 'Start the Vote' : a.phase === 'vote' ? 'Reveal Imposters' : 'Next Round';
    default: return `Next Step (${step + 2})`;
  }
}

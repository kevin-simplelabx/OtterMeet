'use client';
// Projector views for Speed Quiz, Split Words & Tribes and Imposter.
import { QUIZ_COLORS, useCountdown } from '@/hooks/useCountdown';
import type { Activity, ImposterResult, ImposterTally, QuizTally, SplitTally, Tally } from '@/lib/types';

type Of<K extends Activity['kind']> = Extract<Activity, { kind: K }>;

export function SpeedQuizStage({ activity, tally, stateRev }: { activity: Of<'SPEED_QUIZ'>; tally: Tally | null; stateRev: number }) {
  const left = useCountdown(activity.remaining_ms, `${activity.index}-${stateRev}`);
  const t = (activity.results ?? (tally && 'counts' in tally ? tally : null)) as QuizTally | null;
  const answered = t?.answered ?? 0;

  if (activity.phase === 'leaderboard') {
    const board = activity.leaderboard ?? [];
    return (
      <div className="h-full flex flex-col justify-center gap-[4vh] px-[8vw]">
        <span className="eyebrow text-ink-muted">Speed Quiz · after question {activity.index + 1} of {activity.total}</span>
        <h1 className="display m-0">Top of the river</h1>
        {board.length === 0 && <p className="body-lg m-0 text-ink-muted">No points yet. Everything to play for.</p>}
        <ol className="list-none m-0 p-0 flex flex-col gap-[1.5vh]">
          {board.map((e) => (
            <li key={e.rank} className={`flex items-center gap-[2vw] rounded-lg px-[2vw] py-[1.5vh] bg-surface-card animate-[om-pop_400ms_ease-out_both] ${e.rank === 1 ? 'shadow-float ring-2 ring-kelp-amber' : ''}`}
              style={{ animationDelay: `${(board.length - e.rank) * 180}ms` }}>
              <span className="font-sans font-extrabold text-[clamp(24px,3vw,48px)] w-[3ch] tabular-nums text-ink-muted">{e.rank}</span>
              <span className="text-[clamp(28px,3.5vw,56px)]" aria-hidden>{e.avatar}</span>
              <span className={`${e.rank === 1 ? 'heading-2' : 'title'} flex-1 truncate`}>{e.nickname}</span>
              <span className="font-sans font-extrabold text-[clamp(24px,3vw,48px)] tabular-nums text-accent">{e.score.toLocaleString()}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }

  const revealed = activity.phase === 'reveal';
  const total = Math.max(1, answered);
  const secs = Math.ceil(left / 1000);
  return (
    <div className="h-full flex flex-col justify-center gap-[4vh] px-[6vw]">
      <div className="flex items-center justify-between gap-6">
        <span className="eyebrow text-ink-muted">Speed Quiz · {activity.index + 1} of {activity.total}</span>
        <span className="title text-ink-muted tabular-nums" aria-live="polite">{answered} answered</span>
      </div>
      <div className="flex items-center gap-[3vw]">
        <h1 className="display m-0 text-balance flex-1">{activity.prompt}</h1>
        {!revealed && (
          <span role="timer" aria-label={`${secs} seconds left`}
            className={`flex-none w-[12vh] h-[12vh] min-w-20 min-h-20 rounded-full border-4 flex items-center justify-center font-sans font-extrabold text-[clamp(32px,5vh,64px)] tabular-nums
              ${secs <= 5 ? 'border-action text-action' : 'border-accent text-ink'}`}>
            {secs > 0 ? secs : '0'}
          </span>
        )}
      </div>
      <div className="grid grid-cols-2 gap-[2vw]">
        {activity.options.map((o, i) => {
          const right = revealed && i === activity.correct;
          const count = t?.counts[i] ?? 0;
          return (
            <div key={i} className={`relative overflow-hidden rounded-xl p-[2.5vh] flex items-center gap-[1.5vw] text-white transition-opacity duration-500 ${QUIZ_COLORS[i]}
              ${revealed && !right ? 'opacity-35' : ''} ${right ? 'ring-4 ring-white' : ''}`}>
              <span className="text-[clamp(28px,3.5vw,56px)] leading-none" aria-hidden>{activity.shapes[i]}</span>
              <span className="font-display text-[clamp(22px,2.8vw,44px)] leading-tight flex-1">{o}</span>
              {revealed && <span className="font-sans font-extrabold text-[clamp(22px,2.8vw,44px)] tabular-nums">{count}</span>}
              {revealed && <span aria-hidden className="absolute bottom-0 left-0 h-[0.8vh] bg-white/70 transition-[width] duration-700" style={{ width: `${(count / total) * 100}%` }} />}
            </div>
          );
        })}
      </div>
      <p className="body-lg m-0 text-ink-muted text-center">
        {revealed ? `${t?.counts[activity.correct ?? 0] ?? 0} of ${answered} got it.` : secs > 0 ? 'Tap the shape on your phone. Faster paws, more points.' : 'Time’s up. Pencils down, paws up.'}
      </p>
    </div>
  );
}

export function SplitWordsStage({ activity, tally }: { activity: Of<'SPLIT_WORDS'>; tally: Tally | null }) {
  const t = tally && 'matched_count' in tally ? (tally as SplitTally) : null;
  if (activity.phase === 'pairs') {
    const pct = t && t.total_count ? Math.round((t.matched_count / t.total_count) * 100) : 0;
    return (
      <div className="h-full flex flex-col items-center justify-center gap-[5vh] px-[8vw] text-center">
        <span className="eyebrow text-ink-muted">Split Words · round 1 of 3</span>
        <h1 className="hero m-0 text-balance">Find your other half.</h1>
        <p className="body-lg m-0 text-ink-muted max-w-[60ch]">Your phone has half a word. Wander, ask around, and when you find the other half, type their PIN.</p>
        <div className="w-full max-w-[900px] flex flex-col gap-3">
          <div className="h-[5vh] min-h-8 rounded-full bg-surface-fill overflow-hidden">
            <div className="h-full rounded-full bg-success transition-[width] duration-700 ease-out" style={{ width: `${pct}%` }} />
          </div>
          <span className="title tabular-nums" aria-live="polite">{t ? `${t.matched_count} of ${t.total_count} matched` : 'Dealing words…'}</span>
        </div>
        <p className="body m-0 text-ink-muted">Talk prompt once you’ve found each other: <span className="text-ink">{activity.prompt}</span></p>
      </div>
    );
  }
  const tribes = activity.tribes ?? [];
  return (
    <div className="h-full flex flex-col justify-center gap-[4vh] px-[6vw]">
      <span className="eyebrow text-ink-muted">Split Words · round {activity.phase === 'quads' ? 2 : 3} of 3</span>
      <h1 className="display m-0 text-balance">{activity.phase === 'quads' ? 'Pairs, find your other pair.' : 'Tribes, gather round.'}</h1>
      <p className="title m-0 text-ink-muted text-balance">{activity.prompt}</p>
      <div className="grid gap-[2vw] grid-cols-[repeat(auto-fill,minmax(260px,1fr))]">
        {tribes.map((tr) => (
          <div key={tr.number} className="rounded-lg bg-surface-card p-[2vh] flex flex-col gap-2">
            <span className="title">{tr.name}</span>
            <span className="text-3xl leading-tight" aria-label={`${tr.avatars.length} people`}>{tr.avatars.join(' ')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ImposterStage({ activity, tally }: { activity: Of<'IMPOSTER'>; tally: Tally | null }) {
  const t = tally && 'tables' in tally ? (tally as ImposterTally) : null;
  const results = (t?.results ?? activity.results ?? []) as ImposterResult[];
  const breathLeft = useCountdown(activity.last_breath_ms, `${activity.round}-${activity.phase}`);
  const head = <span className="eyebrow text-ink-muted">Imposter · round {activity.round + 1} of {activity.rounds}</span>;

  const seating = t?.seating ?? activity.seating ?? [];
  if (activity.phase === 'words') {
    return (
      <div className="h-full flex flex-col justify-center gap-[3vh] px-[6vw]">
        {head}
        <h1 className="display m-0 text-balance">Someone at your table is faking it.</h1>
        <p className="body-lg m-0 text-ink-muted max-w-[70ch]">Press and hold your phone to peek at your word. Then go round your table in order, one clue each. Not too obvious.</p>
        <SeatingChart seating={seating} />
      </div>
    );
  }
  if (activity.phase === 'vote') {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-[4vh] px-[8vw] text-center">
        {head}
        <h1 className="hero m-0">Who’s the imposter?</h1>
        <p className="body-lg m-0 text-ink-muted">Vote on your phone. No changing tables.</p>
        <span className="title tabular-nums" aria-live="polite">{t ? `${t.votes_in} of ${t.players} votes in` : ''}</span>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col justify-center gap-[3vh] px-[6vw]">
      <div className="flex items-center justify-between gap-6">
        {head}
        {breathLeft > 0 && results.some((r) => r.breath === 'pending') && (
          <span className="title text-action tabular-nums" role="timer">Last Breath: {Math.ceil(breathLeft / 1000)}s</span>
        )}
      </div>
      <h1 className="display m-0">The masks come off.</h1>
      <div className="grid gap-[2vw] grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
        {results.map((r) => {
          const breath = r.breath === 'pending' && breathLeft <= 0 ? 'missed' : r.breath;
          return (
            <div key={r.number} className={`rounded-lg p-[2.5vh] flex flex-col gap-2 animate-[om-pop_400ms_ease-out_both] ${r.caught ? 'bg-success-soft' : 'bg-action-soft'}`}
              style={{ animationDelay: `${r.number * 150}ms` }}>
              <span className="eyebrow text-ink-muted">{r.name}</span>
              <span className="heading-3">{r.imposter ? `${r.imposter.avatar} ${r.imposter.nickname}` : 'No imposter'}</span>
              <span className="body text-ink">
                {r.caught ? 'Caught.' : 'Got away with it.'} The word was <strong>{r.word}</strong>.
              </span>
              {r.caught && (
                <span className="body-sm text-ink-muted">
                  {breath === 'stolen' ? 'Last Breath: guessed it and stole the points.' : breath === 'missed' ? 'Last Breath: missed it.' : 'Last Breath: guessing…'}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/** Every table with its players in speaking order, so people can find their group in the room. */
function SeatingChart({ seating }: { seating: { number: number; name: string; players: { nickname: string; avatar: string; order: number }[] }[] }) {
  if (seating.length === 0) return null;
  return (
    <div className="grid gap-[1.5vw] grid-cols-[repeat(auto-fill,minmax(240px,1fr))]">
      {seating.map((s) => (
        <div key={s.number} className="rounded-lg bg-surface-card p-[1.8vh] flex flex-col gap-2 min-w-0">
          <span className="title truncate">{s.name}</span>
          <ol className="list-none m-0 p-0 flex flex-col gap-0.5">
            {s.players.map((p) => (
              <li key={p.order} className="body-sm flex items-center gap-2 min-w-0">
                <span className="tag text-ink-muted w-4 text-right tabular-nums">{p.order}</span>
                <span aria-hidden>{p.avatar}</span>
                <span className="truncate">{p.nickname}</span>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}

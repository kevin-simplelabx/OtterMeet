'use client';
// Projector views for the phase 2 activities. Big type, few words, readable from the back of a hall.
import { useEffect, useState } from 'react';
import type { Activity, QnaFeed, Tally, ThisOrThatResults } from '@/lib/types';

type Of<K extends Activity['kind']> = Extract<Activity, { kind: K }>;

// Results stay hidden while the room votes (only the head count moves), then the reveal step fills each
// side's bar from empty with a little spring past its final percentage.
export function ThisOrThatStage({ activity, tally }: { activity: Of<'THIS_OR_THAT'>; tally: Tally | null }) {
  const results = activity.revealed ? activity.results : undefined;
  const total = (results ?? (tally as ThisOrThatResults | null))?.total_votes ?? 0;
  const winner = results && results.votes_a !== results.votes_b ? (results.votes_a > results.votes_b ? 'A' : 'B') : null;

  return (
    <div className="h-full flex flex-col justify-center gap-[4vh] px-[6vw]">
      <div className="flex items-center justify-between gap-6">
        <span className="eyebrow text-ink-muted">This or That · {activity.index + 1} of {activity.total}</span>
        <span className="title text-ink-muted tabular-nums" aria-live="polite">
          {total} {total === 1 ? 'vote' : 'votes'}{results ? '' : ' in'}
        </span>
      </div>
      {activity.prompt && <h1 className="display m-0 text-balance">{activity.prompt}</h1>}
      <div className="grid grid-cols-2 gap-[3vw]">
        {(['A', 'B'] as const).map((side, i) => (
          <div key={side} className={`rounded-xl p-[3vh] flex flex-col gap-[2vh] transition-all duration-500 delay-[1200ms]
            ${side === 'A' ? 'bg-accent-soft' : 'bg-action-soft'} ${winner === side ? 'ring-4 ring-success scale-[1.02]' : ''} ${winner && winner !== side ? 'opacity-60' : ''}`}>
            <span className="eyebrow text-ink-muted">{side === 'A' ? 'This' : 'That'}</span>
            <span className="font-display text-[clamp(28px,4vw,64px)] leading-tight text-ink text-balance">{side === 'A' ? activity.a : activity.b}</span>
            {results && (
              <RevealBar key={`${activity.index}-${side}`} delay={i * 150} tone={side === 'A' ? 'accent' : 'action'}
                pct={side === 'A' ? results.percent_a : results.percent_b} votes={side === 'A' ? results.votes_a : results.votes_b} />
            )}
          </div>
        ))}
      </div>
      <p key={results ? 'revealed' : 'voting'} className="body-lg m-0 text-ink-muted text-center"
        style={results ? { animation: `om-pop 300ms ease-out ${REVEAL_MS}ms both` } : undefined}>
        {results
          ? winner ? `The room picks ${winner === 'A' ? activity.a : activity.b}.${activity.majority_rule ? ' Majority gets +100.' : ''}` : 'Dead heat. The river is split.'
          : 'Tap your side on your phone. Results after the reveal.'}
      </p>
    </div>
  );
}

const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const REVEAL_MS = 1100;

function RevealBar({ pct, votes, tone, delay }: { pct: number; votes: number; tone: 'accent' | 'action'; delay: number }) {
  const [width, setWidth] = useState(0);
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setWidth(pct); setShown(pct); return; }
    // Two frames so the empty bar paints before it starts filling.
    let raf = requestAnimationFrame(() => { raf = requestAnimationFrame(() => setWidth(pct)); });
    const start = performance.now() + delay;
    let counter = 0;
    const tick = (now: number) => {
      const t = Math.min(1, Math.max(0, (now - start) / REVEAL_MS));
      setShown(Math.round(pct * (1 - Math.pow(1 - t, 3))));
      if (t < 1) counter = requestAnimationFrame(tick);
    };
    counter = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); cancelAnimationFrame(counter); };
  }, [pct, delay]);

  return (
    <div className="flex flex-col gap-[1vh]">
      <div className="h-[4vh] min-h-6 rounded-full bg-surface overflow-hidden" role="img" aria-label={`${pct}%, ${votes} ${votes === 1 ? 'vote' : 'votes'}`}>
        <div className={`h-full rounded-full ${tone === 'accent' ? 'bg-accent' : 'bg-action'}`}
          style={{ width: `${width}%`, transition: `width ${REVEAL_MS}ms ${SPRING} ${delay}ms` }} />
      </div>
      <div className="flex items-baseline justify-between gap-3" aria-hidden>
        <span className={`font-sans font-extrabold text-[clamp(32px,5vw,72px)] leading-none tabular-nums ${tone === 'accent' ? 'text-accent' : 'text-action'}`}>{shown}%</span>
        <span className="title text-ink-muted tabular-nums">{votes} {votes === 1 ? 'vote' : 'votes'}</span>
      </div>
    </div>
  );
}

export function WordCloudStage({ activity, tally }: { activity: Of<'WORD_CLOUD'>; tally: Tally | null }) {
  if (activity.mode === 'poll') {
    const votes = tally && 'votes' in tally ? tally.votes : activity.options.map(() => 0);
    const total = votes.reduce((a, b) => a + b, 0);
    const max = Math.max(1, ...votes);
    return (
      <div className="h-full flex flex-col justify-center gap-[4vh] px-[6vw]">
        <div className="flex items-center justify-between gap-6">
          <span className="eyebrow text-ink-muted">Quick poll</span>
          <span className="title text-ink-muted tabular-nums">{total} {total === 1 ? 'vote' : 'votes'}</span>
        </div>
        <h1 className="display m-0 text-balance">{activity.prompt}</h1>
        <ul className="list-none m-0 p-0 flex flex-col gap-[2vh]">
          {activity.options.map((o, i) => {
            const pct = total ? Math.round((votes[i] / total) * 100) : 0;
            return (
              <li key={i} className="flex flex-col gap-1">
                <div className="flex justify-between gap-4 title"><span>{o}</span><span className="tabular-nums text-ink-muted">{pct}%</span></div>
                <div className="h-[4vh] min-h-6 rounded-full bg-surface-fill overflow-hidden">
                  <div className={`h-full rounded-full transition-[width] duration-500 ease-out ${votes[i] === max && total ? 'bg-action' : 'bg-accent'}`}
                    style={{ width: `${(votes[i] / max) * 100}%` }} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  const words = tally && 'words' in tally ? tally.words : [];
  const max = Math.max(1, ...words.map((w) => w.count));
  return (
    <div className="h-full flex flex-col items-center justify-center gap-[5vh] px-[6vw] text-center">
      <span className="eyebrow text-ink-muted">Word cloud · {tally && 'total' in tally ? tally.total : 0} people</span>
      <h1 className="display m-0 text-balance">{activity.prompt}</h1>
      <div className="flex flex-wrap items-center justify-center gap-x-[2.5vw] gap-y-[1.5vh] max-w-[90vw]" aria-live="polite">
        {words.length === 0 && <p className="body-lg text-ink-muted m-0">Words will float in here.</p>}
        {words.map((w, i) => {
          const weight = w.count / max;
          return (
            <span key={w.text} className={`font-display leading-none transition-all duration-500 animate-[om-pop_300ms_ease-out] ${i % 3 === 0 ? 'text-accent' : i % 3 === 1 ? 'text-ink' : 'text-action'}`}
              style={{ fontSize: `clamp(20px, ${2 + weight * 6}vw, 140px)`, opacity: 0.55 + weight * 0.45 }}>
              {w.text}
            </span>
          );
        })}
      </div>
    </div>
  );
}

export function QnaStage({ qna }: { qna: QnaFeed | null }) {
  const questions = (qna?.questions ?? []).filter((q) => q.status === 'APPROVED');
  const spot = qna?.spotlight ? qna.questions.find((q) => q.id === qna.spotlight) : null;
  if (spot) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-[4vh] px-[8vw] text-center">
        <span className="eyebrow text-ink-muted">From the room · ▲ {spot.upvotes}</span>
        <h1 className="display m-0 text-balance">“{spot.content}”</h1>
        <span className="title text-ink-muted">{spot.author}</span>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col justify-center gap-[3vh] px-[6vw]">
      <span className="eyebrow text-ink-muted">Town Hall Q&amp;A · ask and upvote on your phone</span>
      {questions.length === 0 && <h1 className="display m-0">No questions yet. Don’t be shy.</h1>}
      <ol className="list-none m-0 p-0 flex flex-col gap-[2vh]">
        {questions.slice(0, 5).map((q, i) => (
          <li key={q.id} className={`flex items-center gap-[2vw] rounded-lg p-[2vh] bg-surface-card ${i === 0 ? 'shadow-float' : ''}`}>
            <span className="flex flex-col items-center min-w-16 font-sans font-extrabold text-[clamp(24px,3vw,44px)] tabular-nums text-accent">▲<span>{q.upvotes}</span></span>
            <span className="flex flex-col gap-1 min-w-0">
              <span className={`${i === 0 ? 'heading-2' : 'title'} text-ink`}>{q.content}</span>
              <span className="body-sm text-ink-muted">{q.author}</span>
            </span>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Responses stay private: the projector only shows that they're coming in. */
export function FeedbackStage({ tally }: { tally: Tally | null }) {
  const n = tally && 'responses' in tally ? tally.responses : 0;
  return (
    <div className="h-full flex flex-col items-center justify-center gap-6 text-center px-[6vw]">
      <span className="eyebrow text-ink-muted">Before you swim off</span>
      <h1 className="hero m-0 text-balance">Tell us how it went.</h1>
      <p className="body-lg m-0 text-ink-muted">It’s on your phone, and only the host sees it.</p>
      <span className="title text-ink-muted tabular-nums" aria-live="polite">{n} {n === 1 ? 'response' : 'responses'} so far</span>
    </div>
  );
}

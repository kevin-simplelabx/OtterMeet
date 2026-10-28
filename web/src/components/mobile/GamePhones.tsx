'use client';
// Phone views for the phase 2 activities. Big tap targets, one job per screen.
import { useEffect, useState } from 'react';
import { Button } from '@/ds';
import { inputClass } from '@/components/AuthForm';
import { triggerHaptic } from '@/lib/haptics';
import type { Activity, Mine, QnaFeed } from '@/lib/types';

type Of<K extends Activity['kind']> = Extract<Activity, { kind: K }>;
type Respond = (data: Record<string, unknown>) => void;

export function ThisOrThatPhone({ activity, mine, respond }: { activity: Of<'THIS_OR_THAT'>; mine: Mine | null; respond: Respond }) {
  const saved = mine?.answers[`q${activity.index}`] as 'A' | 'B' | undefined;
  const [pick, setPick] = useState<'A' | 'B' | undefined>(saved);
  useEffect(() => setPick(saved), [saved, activity.index]);

  const r = activity.results;
  const won = activity.revealed && r && r.votes_a !== r.votes_b ? (r.votes_a > r.votes_b ? 'A' : 'B') : null;

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <span className="eyebrow text-ink-muted">This or That · {activity.index + 1} of {activity.total}</span>
        {activity.prompt && <h1 className="heading-2 m-0">{activity.prompt}</h1>}
      </div>
      <div className="flex-1 grid grid-rows-2 gap-3 min-h-80">
        {(['A', 'B'] as const).map((side) => {
          const chosen = pick === side;
          const pct = r ? (side === 'A' ? r.percent_a : r.percent_b) : null;
          return (
            <button key={side} type="button" disabled={activity.revealed} aria-pressed={chosen}
              onClick={() => { setPick(side); triggerHaptic('lock'); respond({ choice: side }); }}
              className={`relative overflow-hidden rounded-xl border-2 p-5 flex flex-col items-start justify-end text-left cursor-pointer transition-transform active:scale-[0.98] touch-manipulation
                ${side === 'A' ? 'bg-accent-soft' : 'bg-action-soft'} ${chosen ? (side === 'A' ? 'border-accent' : 'border-action') : 'border-transparent'}`}>
              {pct !== null && <span aria-hidden className={`absolute inset-y-0 left-0 opacity-25 ${side === 'A' ? 'bg-accent' : 'bg-action'}`} style={{ width: `${pct}%` }} />}
              <span className="relative eyebrow text-ink-muted">{side === 'A' ? 'This' : 'That'}{chosen ? ' · your pick' : ''}</span>
              <span className="relative heading-3 text-ink">{side === 'A' ? activity.a : activity.b}</span>
              {pct !== null && <span className="relative title text-ink tabular-nums">{pct}%</span>}
            </button>
          );
        })}
      </div>
      <p className="body m-0 text-ink-muted text-center" aria-live="polite">
        {activity.revealed
          ? !pick ? 'You sat on the log this time.' : won === pick ? `You’re with the majority${activity.majority_rule ? ': +100' : ''}.` : won ? 'Bold. You swam against the current.' : 'Dead heat. The river is split.'
          : pick ? 'Locked in. You can switch sides until the reveal.' : 'Pick a riverbank.'}
      </p>
    </div>
  );
}

export function WordCloudPhone({ activity, mine, respond }: { activity: Of<'WORD_CLOUD'>; mine: Mine | null; respond: Respond }) {
  const [word, setWord] = useState('');
  const sent = Object.entries(mine?.answers ?? {}).filter(([k]) => k.startsWith('word')).map(([, v]) => String(v));
  const choice = mine?.answers.choice as string | undefined;

  if (activity.mode === 'poll') {
    return (
      <div className="flex-1 flex flex-col gap-4">
        <span className="eyebrow text-ink-muted">Quick poll</span>
        <h1 className="heading-2 m-0">{activity.prompt}</h1>
        <div className="flex flex-col gap-3" role="radiogroup" aria-label={activity.prompt}>
          {activity.options.map((o, i) => {
            const on = choice === String(i);
            return (
              <button key={i} type="button" role="radio" aria-checked={on} onClick={() => { triggerHaptic('tap'); respond({ choice: i }); }}
                className={`min-h-14 px-5 rounded-lg border-2 text-left title cursor-pointer touch-manipulation ${on ? 'border-accent bg-accent-soft' : 'border-border bg-surface-card'}`}>
                {o}
              </button>
            );
          })}
        </div>
        <p className="body-sm m-0 text-ink-muted" aria-live="polite">{choice !== undefined ? 'Got it. Watch the big screen.' : 'Tap one. You can change it.'}</p>
      </div>
    );
  }

  const left = activity.max_words - sent.length;
  return (
    <div className="flex-1 flex flex-col gap-4">
      <span className="eyebrow text-ink-muted">Word cloud</span>
      <h1 className="heading-2 m-0">{activity.prompt}</h1>
      {left > 0 ? (
        <form className="flex gap-2" onSubmit={(e) => { e.preventDefault(); if (!word.trim()) return; triggerHaptic('success'); respond({ word }); setWord(''); }}>
          <input className={inputClass} value={word} onChange={(e) => setWord(e.target.value)} maxLength={30} placeholder="A word or two" aria-label="Your word" autoComplete="off" enterKeyHint="send" />
          <Button type="submit" variant="action" disabled={!word.trim()}>Send</Button>
        </form>
      ) : <p className="body m-0">That’s all {activity.max_words} of your words. Look up and watch them grow.</p>}
      {sent.length > 0 && (
        <div className="flex flex-col gap-2">
          <span className="label text-ink-muted">You sent{left > 0 ? ` (${left} left)` : ''}</span>
          <div className="flex flex-wrap gap-2">{sent.map((w) => <span key={w} className="px-3 py-1 rounded-full bg-accent-soft text-accent body-sm">{w}</span>)}</div>
        </div>
      )}
    </div>
  );
}

export function QnaPhone({ qna, upvoted, ask, upvote, askOnly = false }: {
  qna: QnaFeed | null; upvoted: string[]; ask: (content: string, anonymous: boolean) => void; upvote: (id: string) => void; askOnly?: boolean;
}) {
  const [content, setContent] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const questions = (qna?.questions ?? []).filter((q) => q.status === 'APPROVED');

  return (
    <div className="flex flex-col gap-4">
      <form className="bg-surface-card border border-border rounded-xl shadow-card p-4 flex flex-col gap-3"
        onSubmit={(e) => { e.preventDefault(); if (!content.trim()) return; ask(content.trim(), anonymous); setContent(''); }}>
        <label className="flex flex-col gap-1.5">
          <span className="label">Ask the speakers</span>
          <textarea className={`${inputClass} min-h-24 resize-none`} value={content} onChange={(e) => setContent(e.target.value)} maxLength={280} placeholder="What do you want to know?" />
        </label>
        <div className="flex items-center justify-between gap-3">
          <label className="body-sm text-ink-muted flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={anonymous} onChange={(e) => setAnonymous(e.target.checked)} className="w-5 h-5 accent-[var(--accent)]" /> Ask anonymously
          </label>
          <Button type="submit" variant="action" size="sm" disabled={!content.trim()}>Ask</Button>
        </div>
      </form>
      {!askOnly && (
        <div className="flex flex-col gap-2">
          <span className="label text-ink-muted">{questions.length ? 'Upvote the ones you want answered' : 'Approved questions show up here.'}</span>
          <ul className="list-none m-0 p-0 flex flex-col gap-2">
            {questions.map((q) => {
              const on = upvoted.includes(q.id);
              return (
                <li key={q.id} className={`flex items-center gap-3 p-3 rounded-lg border ${q.id === qna?.spotlight ? 'border-accent' : 'border-border'} bg-surface-card`}>
                  <button type="button" aria-pressed={on} aria-label={`Upvote: ${q.content}`} onClick={() => { triggerHaptic('tap'); upvote(q.id); }}
                    className={`flex flex-col items-center justify-center min-w-12 min-h-12 rounded-md border cursor-pointer tabular-nums touch-manipulation ${on ? 'border-accent bg-accent-soft text-accent' : 'border-border-strong text-ink-muted'}`}>
                    ▲<span className="tag">{q.upvotes}</span>
                  </button>
                  <span className="flex flex-col min-w-0">
                    <span className="body text-ink">{q.content}</span>
                    <span className="meta text-ink-muted">{q.author}</span>
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

export function FeedbackPhone({ activity, mine, respond }: { activity: Of<'FEEDBACK'>; mine: Mine | null; respond: Respond }) {
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const done = Boolean(mine?.answers.survey);
  if (done) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-center">
        <span className="text-6xl" aria-hidden>💌</span>
        <h1 className="heading-2 m-0">Thank you, that helps a lot.</h1>
        <p className="body m-0 text-ink-muted">Only your host sees this.</p>
      </div>
    );
  }
  const set = (id: string, v: unknown) => setAnswers((a) => ({ ...a, [id]: v }));
  return (
    <form className="flex flex-col gap-5" onSubmit={(e) => { e.preventDefault(); triggerHaptic('success'); respond({ answers }); }}>
      <div className="flex flex-col gap-1">
        <span className="eyebrow text-ink-muted">Private feedback</span>
        <h1 className="heading-2 m-0">How did it go?</h1>
        <p className="body-sm m-0 text-ink-muted">Only your host sees your answers.</p>
      </div>
      {activity.questions.map((q) => (
        <fieldset key={q.id} className="border border-border rounded-xl bg-surface-card p-4 m-0 flex flex-col gap-3">
          <legend className="sr-only">{q.prompt}</legend>
          <span className="title" aria-hidden>{q.prompt}</span>
          {q.kind === 'rating' && (
            <div className="grid grid-cols-5 gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" aria-pressed={answers[q.id] === n} aria-label={`${n} out of 5`} onClick={() => { triggerHaptic('tap'); set(q.id, n); }}
                  className={`aspect-square rounded-md border-2 title cursor-pointer ${answers[q.id] === n ? 'border-accent bg-accent-soft text-accent' : 'border-border text-ink'}`}>{n}</button>
              ))}
            </div>
          )}
          {q.kind === 'chips' && (
            <div className="flex flex-wrap gap-2">
              {(q.options ?? []).map((o) => {
                const list = (answers[q.id] as string[] | undefined) ?? [];
                const on = list.includes(o);
                return (
                  <button key={o} type="button" aria-pressed={on} onClick={() => set(q.id, on ? list.filter((x) => x !== o) : [...list, o])}
                    className={`min-h-10 px-4 rounded-full border body-sm cursor-pointer ${on ? 'border-accent bg-accent-soft text-accent' : 'border-border-strong text-ink'}`}>{o}</button>
                );
              })}
            </div>
          )}
          {q.kind === 'text' && (
            <textarea className={`${inputClass} min-h-24 resize-none`} maxLength={500} aria-label={q.prompt}
              value={(answers[q.id] as string) ?? ''} onChange={(e) => set(q.id, e.target.value)} />
          )}
        </fieldset>
      ))}
      <Button type="submit" variant="action" size="lg" block disabled={Object.keys(answers).length === 0}>Send Feedback</Button>
    </form>
  );
}

/** Non-blocking 👍 Fun / 👎 Meh toast after each game (spec 2). Dismisses itself after 10 seconds. It sits in the
 *  page flow at the top, so it never covers the next game's buttons. */
export function FeedbackToast({ title, tags, onSend, onClose }: { title: string; tags: string[]; onSend: (rating: 'UP' | 'DOWN', tag?: string) => void; onClose: () => void }) {
  const [down, setDown] = useState(false);
  useEffect(() => { const t = setTimeout(onClose, down ? 15000 : 10000); return () => clearTimeout(t); }, [onClose, down]);
  const send = (rating: 'UP' | 'DOWN', tag?: string) => { triggerHaptic('tap'); onSend(rating, tag); onClose(); };
  return (
    <div role="status" className="bg-surface-card border border-border rounded-xl shadow-card p-4 flex flex-col gap-3 animate-[om-pop_200ms_ease-out]">
      <div className="flex items-center justify-between gap-3">
        <span className="body-sm text-ink">How was <strong>{title}</strong>?</span>
        <button type="button" onClick={onClose} className="body-sm text-ink-muted cursor-pointer px-2" aria-label="Dismiss">✕</button>
      </div>
      {!down ? (
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => send('UP')} className="min-h-12 rounded-lg bg-success-soft title cursor-pointer">👍 Fun</button>
          <button type="button" onClick={() => setDown(true)} className="min-h-12 rounded-lg bg-surface-fill title cursor-pointer">👎 Meh</button>
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {tags.filter((t) => t !== 'Loved it').map((t) => (
            <button key={t} type="button" onClick={() => send('DOWN', t)} className="min-h-10 px-4 rounded-full border border-border-strong body-sm cursor-pointer">{t}</button>
          ))}
          <button type="button" onClick={() => send('DOWN')} className="min-h-10 px-4 rounded-full body-sm text-ink-muted cursor-pointer">Just meh</button>
        </div>
      )}
    </div>
  );
}

'use client';
// What the cockpit shows under "On stage now": live numbers for the current activity, and the private
// survey results the projector never shows.
import { useEffect, useState } from 'react';
import { Button } from '@/ds';
import { api } from '@/lib/api';
import type { Activity, ImposterTally, QuizTally, SplitTally, SurveyQuestion, Tally } from '@/lib/types';
import { StragglerRescuePanel } from './StragglerRescuePanel';

export function LiveResults({ sessionId, blockId, activity, tally, rescue }: {
  sessionId: string; blockId: string; activity: Activity; tally: Tally | null; rescue: () => void;
}) {
  if (activity.kind === 'SPEED_QUIZ') {
    const t = tally && 'counts' in tally ? (tally as QuizTally) : null;
    const phase = { question: 'answers open', reveal: 'answer on screen', leaderboard: 'leaderboard on screen' }[activity.phase];
    return (
      <div className="flex flex-col gap-1 body-sm">
        <span className="text-ink-muted">Question {activity.index + 1} of {activity.total} · {phase} · {t?.answered ?? 0} answered</span>
        <span className="text-ink-muted">Answer: {activity.shapes[activity.correct ?? -1] ?? ''} {activity.phase === 'question' ? '(hidden from the room)' : activity.options[activity.correct ?? 0]}</span>
      </div>
    );
  }
  if (activity.kind === 'SPLIT_WORDS') {
    const t = tally && 'matched_count' in tally ? (tally as SplitTally) : null;
    return (
      <div className="flex flex-col gap-3">
        <span className="body-sm text-ink-muted">Round {['pairs', 'quads', 'squads'].indexOf(activity.phase) + 1} of 3 · {activity.phase}</span>
        {activity.phase === 'pairs' && <StragglerRescuePanel tally={t} rescue={rescue} />}
      </div>
    );
  }
  if (activity.kind === 'IMPOSTER') {
    const t = tally && 'tables' in tally ? (tally as ImposterTally) : null;
    const caught = t?.results?.filter((r) => r.caught).length ?? 0;
    const waiting = t?.unseated ?? [];
    return (
      <div className="flex flex-col gap-3">
        <span className="body-sm text-ink-muted">
          Round {activity.round + 1} of {activity.rounds} · {activity.phase} · {t?.tables ?? 0} tables, {t?.players ?? 0} players
          {activity.phase === 'vote' && ` · ${t?.votes_in ?? 0} votes in`}
          {activity.phase === 'reveal' && ` · ${caught} of ${t?.results?.length ?? 0} imposters caught`}
        </span>
        {waiting.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-md bg-action-soft">
            <span className="body-sm">
              {waiting.map((p) => `${p.avatar} ${p.nickname}`).join(', ')} {waiting.length === 1 ? 'is' : 'are'} waiting for a seat.
              {activity.phase === 'words' ? '' : ' They’ll be dealt in when the next round starts.'}
            </span>
            {activity.phase === 'words' && <Button size="sm" variant="quiet" onClick={rescue}>Seat Them Now (S)</Button>}
          </div>
        )}
      </div>
    );
  }
  if (activity.kind === 'THIS_OR_THAT') {
    const t = tally && 'percent_a' in tally ? tally : activity.results;
    return (
      <div className="flex flex-col gap-2">
        <span className="body-sm text-ink-muted">Question {activity.index + 1} of {activity.total} · {activity.revealed ? 'results on screen' : 'voting open'}</span>
        <div className="grid grid-cols-2 gap-3">
          <Stat label={activity.a} value={`${t?.percent_a ?? 0}%`} sub={votes(t?.votes_a ?? 0)} />
          <Stat label={activity.b} value={`${t?.percent_b ?? 0}%`} sub={votes(t?.votes_b ?? 0)} />
        </div>
      </div>
    );
  }
  if (activity.kind === 'WORD_CLOUD') {
    if (activity.mode === 'poll') {
      const votes = tally && 'votes' in tally ? tally.votes : [];
      return (
        <ul className="list-none m-0 p-0 flex flex-col gap-1 body-sm">
          {activity.options.map((o, i) => <li key={i} className="flex justify-between gap-3"><span>{o}</span><span className="tabular-nums text-ink-muted">{votes[i] ?? 0}</span></li>)}
        </ul>
      );
    }
    const words = tally && 'words' in tally ? tally.words : [];
    return (
      <p className="body-sm m-0 text-ink-muted">
        {words.length ? <>Top words: {words.slice(0, 8).map((w) => `${w.text} (${w.count})`).join(', ')}</> : 'No words yet. They’ll float in soon.'}
      </p>
    );
  }
  if (activity.kind === 'FEEDBACK') return <FeedbackResults sessionId={sessionId} blockId={blockId} count={tally && 'responses' in tally ? tally.responses : 0} />;
  return null;
}

const votes = (n: number) => `${n} ${n === 1 ? 'vote' : 'votes'}`;

function Stat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-lg bg-surface-fill p-3 flex flex-col gap-0.5 min-w-0">
      <span className="body-sm text-ink-muted truncate">{label}</span>
      <span className="heading-3 tabular-nums">{value}</span>
      <span className="meta text-ink-muted">{sub}</span>
    </div>
  );
}

type Result = SurveyQuestion & { count: number; average?: number | null; distribution?: number[]; counts?: number[]; answers?: string[] };

function FeedbackResults({ sessionId, blockId, count }: { sessionId: string; blockId: string; count: number }) {
  const [results, setResults] = useState<Result[] | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    api<{ results: Result[] }>(`/sessions/${sessionId}/blocks/${blockId}/results`).then((d) => setResults(d.results), () => setResults([]));
  }, [open, sessionId, blockId, count]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="body-sm text-ink-muted tabular-nums">{count} {count === 1 ? 'response' : 'responses'} · only you can see them</span>
        <Button size="sm" variant="quiet" onClick={() => setOpen((o) => !o)}>{open ? 'Hide Results' : 'See Results'}</Button>
      </div>
      {open && results?.map((q) => (
        <div key={q.id} className="flex flex-col gap-1">
          <span className="label">{q.prompt}</span>
          {q.kind === 'rating' && <span className="body-sm text-ink-muted">{q.average ?? '–'} / 5 average · {q.distribution?.map((n, i) => `${i + 1}★ ${n}`).join(' · ')}</span>}
          {q.kind === 'chips' && <span className="body-sm text-ink-muted">{q.options?.map((o, i) => `${o} ${q.counts?.[i] ?? 0}`).join(' · ')}</span>}
          {q.kind === 'text' && (
            <ul className="list-disc m-0 pl-5 body-sm text-ink-muted max-h-48 overflow-y-auto">
              {q.answers?.length ? q.answers.map((a, i) => <li key={i}>{a}</li>) : <li>No comments yet.</li>}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

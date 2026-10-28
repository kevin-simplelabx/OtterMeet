'use client';
// What the projector shows for each block type. Games not built yet get a clean "up next" card.
import { useEffect, useState } from 'react';
import { BLOCK_TYPES } from '@/lib/blocks';
import type { QnaFeed, StageState, Tally } from '@/lib/types';
import { RoomQr, joinUrl } from '../RoomQr';
import { FeedbackStage, QnaStage, ThisOrThatStage, WordCloudStage } from './GameStages';
import { ImposterStage, SpeedQuizStage, SplitWordsStage } from './PartyStages';

export interface Crowd { count: number; avatars: string[] }

export function StageBlock({ state, crowd, tally, qna }: { state: StageState; crowd: Crowd; tally: Tally | null; qna: QnaFeed | null }) {
  const block = state.block;
  if (!block) return <Centered><p className="display m-0">{state.title}</p></Centered>;

  const a = state.activity;
  if (a?.kind === 'THIS_OR_THAT') return <ThisOrThatStage activity={a} tally={tally} />;
  if (a?.kind === 'WORD_CLOUD') return <WordCloudStage activity={a} tally={tally} />;
  if (a?.kind === 'QNA') return <QnaStage qna={qna} />;
  if (a?.kind === 'FEEDBACK') return <FeedbackStage tally={tally} />;
  if (a?.kind === 'SPEED_QUIZ') return <SpeedQuizStage activity={a} tally={tally} stateRev={state.rev} />;
  if (a?.kind === 'SPLIT_WORDS') return <SplitWordsStage activity={a} tally={tally} />;
  if (a?.kind === 'IMPOSTER') return <ImposterStage activity={a} tally={tally} />;

  switch (block.block_type) {
    case 'LOBBY':
      return <Lobby state={state} crowd={crowd} />;
    case 'BLACKOUT':
      return null;
    case 'BREAK':
      return <BreakCountdown key={block.id} title={block.title} seconds={block.duration_sec} />;
    case 'HOLDING':
      return (
        <Centered>
          <span className="eyebrow text-ink-muted">{state.title}</span>
          <h1 className="hero m-0 text-balance">{block.title}</h1>
        </Centered>
      );
    default:
      return (
        <Centered>
          <span className="eyebrow text-ink-muted">Up next · {BLOCK_TYPES[block.block_type].label}</span>
          <h1 className="hero m-0 text-balance">{block.title}</h1>
          <p className="body-lg m-0 text-ink-muted">Keep your phone handy, it’s nearly game time.</p>
        </Centered>
      );
  }
}

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="h-full flex flex-col items-center justify-center text-center gap-6 px-[6vw]">{children}</div>;
}

function Lobby({ state, crowd }: { state: StageState; crowd: Crowd }) {
  const url = joinUrl(state.code).replace(/^https?:\/\//, '');
  return (
    <div className="h-full grid grid-cols-[auto_1fr] max-md:grid-cols-1 items-center gap-[5vw] px-[6vw]">
      <RoomQr code={state.code} size={Math.round(Math.min(typeof window === 'undefined' ? 360 : window.innerHeight * 0.5, 480))} />
      <div className="flex flex-col gap-6 min-w-0">
        <span className="eyebrow text-ink-muted">{state.title}</span>
        <h1 className="display m-0">Scan to join, or go to</h1>
        <p className="title m-0 text-ink-muted break-all">{url.replace(`/${state.code}`, '')}</p>
        <div className="flex flex-col gap-1">
          <span className="eyebrow text-ink-muted">Room code</span>
          <span className="font-sans font-extrabold text-[clamp(64px,10vw,160px)] leading-none tracking-[0.18em]">{state.code}</span>
        </div>
        <div className="flex flex-col gap-3">
          <span className="title" aria-live="polite">{crowd.count === 1 ? '1 person is here' : `${crowd.count} people are here`}</span>
          <div className="flex flex-wrap gap-2 text-4xl leading-none" aria-hidden>
            {crowd.avatars.map((a, i) => <span key={i} className="animate-[om-pop_300ms_ease-out]">{a}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

function BreakCountdown({ title, seconds }: { title: string; seconds: number }) {
  const [end] = useState(() => Date.now() + seconds * 1000);
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    const t = setInterval(() => setLeft(Math.max(0, Math.round((end - Date.now()) / 1000))), 250);
    return () => clearInterval(t);
  }, [end]);
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  return (
    <Centered>
      <span className="eyebrow text-ink-muted">{title}</span>
      <span className="font-sans font-extrabold text-[clamp(96px,18vw,280px)] leading-none tabular-nums" role="timer">{mm}:{ss}</span>
      <p className="body-lg m-0 text-ink-muted">{left === 0 ? 'Welcome back.' : 'Stretch your paws. Back soon.'}</p>
    </Centered>
  );
}

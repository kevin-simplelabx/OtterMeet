'use client';
// Real-time plumbing for a room: Action Cable for every device, plus a BroadcastChannel so the cockpit can
// drive a stage window on the same laptop instantly, before the server round trip lands (spec section 6).
import { useCallback, useEffect, useRef, useState } from 'react';
import { createConsumer, type Consumer, type Subscription } from '@rails/actioncable';
import type { EmojiParticle, Mine, QnaFeed, QnaItem, Roster, StageState, Tally } from './types';

function cableUrl(participantToken?: string) {
  const base = process.env.NEXT_PUBLIC_CABLE_URL ?? `${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.hostname}:3001/cable`;
  return participantToken ? `${base}?pt=${encodeURIComponent(participantToken)}` : base;
}

type Role = 'host' | 'stage' | 'participant';

/** Events without their own slot of state; handled by the page (toasts, errors, acks). */
export type RoomEvent =
  | { event: 'FEEDBACK_PROMPT'; block_id: string; title: string; tags: string[] }
  | { event: 'ERROR'; message: string }
  | { event: 'QNA_ASKED' }
  | { event: 'QNA_UPVOTED'; upvoted: string[] };

interface LiveOptions {
  role: Role;
  participantToken?: string;
  initial?: StageState | null;
  onBurst?: (particles: EmojiParticle[]) => void;
  onCrowd?: (crowd: { count: number; avatars: string[] }) => void;
  onEvent?: (e: RoomEvent) => void;
}

/** A local hint from the cockpit: what the stage should show right now, ahead of the server's STATE. */
export interface StageHint {
  type: 'HINT';
  state: StageState;
}

export function useLiveRoom(code: string | undefined, { role, participantToken, initial = null, onBurst, onCrowd, onEvent }: LiveOptions) {
  const [state, setState] = useState<StageState | null>(initial);
  const [roster, setRoster] = useState<Roster | null>(null);
  const [tally, setTally] = useState<Tally | null>(null);
  const [qna, setQna] = useState<QnaFeed | null>(null);
  const [qnaQueue, setQnaQueue] = useState<QnaItem[] | null>(null);
  const [upvoted, setUpvoted] = useState<string[]>([]);
  const [mine, setMine] = useState<Mine | null>(null);
  const [connected, setConnected] = useState(false);
  const subRef = useRef<Subscription | null>(null);
  const handlers = useRef({ onBurst, onCrowd, onEvent });
  handlers.current = { onBurst, onCrowd, onEvent };

  useEffect(() => { if (initial) setState((s) => (!s || initial.rev >= s.rev ? initial : s)); }, [initial]);

  useEffect(() => {
    if (!code || (role === 'participant' && !participantToken)) return;
    const consumer: Consumer = createConsumer(cableUrl(participantToken));
    const sub = consumer.subscriptions.create(
      { channel: 'SessionChannel', room_code: code, role },
      {
        connected: () => setConnected(true),
        disconnected: () => setConnected(false),
        rejected: () => setConnected(false),
        received: (msg: { event: string } & Record<string, unknown>) => {
          switch (msg.event) {
            case 'STATE': {
              const next = msg as unknown as StageState;
              setState((s) => (!s || next.rev >= s.rev ? next : s));
              break;
            }
            case 'ROSTER': setRoster(msg as unknown as Roster); break;
            case 'TALLY': setTally(msg as unknown as Tally); break;
            case 'QNA_FEED':
              setQna(msg as unknown as QnaFeed);
              if (Array.isArray(msg.upvoted)) setUpvoted(msg.upvoted as string[]);
              break;
            case 'QNA_QUEUE': setQnaQueue((msg as unknown as { questions: QnaItem[] }).questions); break;
            case 'QNA_UPVOTED': setUpvoted(msg.upvoted as string[]); handlers.current.onEvent?.(msg as unknown as RoomEvent); break;
            case 'MINE': setMine(msg as unknown as Mine); break;
            case 'EMOJI_BURST': handlers.current.onBurst?.(msg.particles as EmojiParticle[]); break;
            case 'CROWD': handlers.current.onCrowd?.(msg as unknown as { count: number; avatars: string[] }); break;
            default: handlers.current.onEvent?.(msg as unknown as RoomEvent);
          }
        },
      },
    );
    subRef.current = sub;

    // Stage windows also listen for the cockpit's local hints.
    let local: BroadcastChannel | null = null;
    if (role === 'stage' && 'BroadcastChannel' in window) {
      local = new BroadcastChannel(`ottermeet:${code}`);
      local.onmessage = (e: MessageEvent<StageHint>) => {
        if (e.data?.type === 'HINT') setState((s) => ({ ...e.data.state, rev: s?.rev ?? 0 }));
      };
    }

    return () => {
      sub.unsubscribe();
      consumer.disconnect();
      local?.close();
      subRef.current = null;
    };
  }, [code, role, participantToken]);

  const perform = useCallback((action: string, data: Record<string, unknown> = {}) => {
    subRef.current?.perform(action, data);
  }, []);

  // Only show a tally that belongs to what's on screen now.
  const currentTally = tally && state?.block && tally.block_id === state.block.id ? tally : null;

  return { state, setState, roster, tally: currentTally, qna, qnaQueue, upvoted, mine, connected, perform };
}

/** Cockpit side of the local sync. */
export function useStageHint(code: string | undefined) {
  const ref = useRef<BroadcastChannel | null>(null);
  useEffect(() => {
    if (!code || !('BroadcastChannel' in window)) return;
    ref.current = new BroadcastChannel(`ottermeet:${code}`);
    return () => ref.current?.close();
  }, [code]);
  return useCallback((state: StageState) => ref.current?.postMessage({ type: 'HINT', state } satisfies StageHint), []);
}

'use client';
// Clean Stage Canvas (spec 9.6): the projector window. No admin chrome; the cockpit drives it.
// ?preview=1 is the cockpit's miniature copy: same picture, no buttons and no clicker keys.
import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/ds';
import { EmojiShower, type EmojiShowerHandle } from '@/components/stage/EmojiShower';
import { StageBlock, type Crowd } from '@/components/stage/StageBlock';
import { RoomQr } from '@/components/RoomQr';
import { useHostClicker } from '@/hooks/useHostClicker';
import { api } from '@/lib/api';
import { useRequireHost } from '@/lib/auth';
import { useLiveRoom } from '@/lib/live';
import type { Roster, StageState } from '@/lib/types';

export default function StagePage() {
  const { id } = useParams<{ id: string }>();
  const host = useRequireHost();
  const [initial, setInitial] = useState<StageState | null>(null);
  const [crowd, setCrowd] = useState<Crowd>({ count: 0, avatars: [] });
  const [error, setError] = useState('');
  const [isFull, setIsFull] = useState(false);
  const [preview, setPreview] = useState(false);
  useEffect(() => setPreview(new URLSearchParams(location.search).has('preview')), []);
  const shower = useRef<EmojiShowerHandle>(null);

  useEffect(() => {
    if (!host) return;
    api<{ live: StageState; roster: Roster }>(`/sessions/${id}/live`).then((d) => {
      setInitial(d.live);
      const here = d.roster.participants.filter((p) => p.is_connected);
      setCrowd({ count: d.roster.count, avatars: here.slice(-60).map((p) => p.avatar) });
    }, (e) => setError(e.message));
  }, [host, id]);

  const { state, perform, connected, tally, qna } = useLiveRoom(initial?.code, {
    role: 'stage', initial,
    onBurst: (p) => shower.current?.burst(p),
    onCrowd: setCrowd,
  });

  const fullscreen = useCallback(() => {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen().catch(() => {});
  }, []);
  useEffect(() => {
    const on = () => setIsFull(Boolean(document.fullscreenElement));
    document.addEventListener('fullscreenchange', on);
    return () => document.removeEventListener('fullscreenchange', on);
  }, []);

  useHostClicker({
    next: () => perform('next_block'),
    prev: () => perform('prev_block'),
    blackout: () => perform('toggle_blackout'),
    fullscreen,
  }, Boolean(state) && !preview);

  if (error) return <div data-theme="dark" className="min-h-screen bg-surface text-ink p-8 body">{error}</div>;
  if (!state) return <div data-theme="dark" className="min-h-screen bg-surface" />;

  const dark = state.blackout || state.block?.block_type === 'BLACKOUT';
  const showCornerCode = !dark && state.block?.block_type !== 'LOBBY' && state.status === 'LIVE';

  return (
    <div data-theme="dark" className={`fixed inset-0 overflow-hidden ${dark ? 'bg-black' : 'bg-surface'} text-ink ${isFull ? 'cursor-none' : ''}`}>
      {!dark && (
        <div className={`absolute inset-0 transition-opacity duration-300 ${showCornerCode ? 'pb-[136px]' : ''}`}>
          {state.status === 'LIVE'
            ? <StageBlock state={state} crowd={crowd} tally={tally} qna={qna} />
            : <div className="h-full flex flex-col items-center justify-center gap-4 text-center px-8">
                <span className="eyebrow text-ink-muted">{state.status === 'COMPLETED' ? 'That’s a wrap' : 'Starting soon'}</span>
                <h1 className="hero m-0">{state.title}</h1>
              </div>}
        </div>
      )}

      {state.allow_emoji_shower && !dark && <EmojiShower ref={shower} />}

      {showCornerCode && (
        <div className="absolute bottom-6 right-6 flex items-center gap-3 bg-surface-card/90 rounded-lg p-2 pr-4 shadow-float">
          <RoomQr code={state.code} size={96} />
          <div className="flex flex-col">
            <span className="eyebrow text-ink-muted">Join</span>
            <span className="font-sans font-extrabold text-3xl tracking-[0.15em]">{state.code}</span>
          </div>
        </div>
      )}

      {!isFull && !preview && (
        <div className="absolute top-4 right-4 flex items-center gap-3 opacity-60 hover:opacity-100 transition-opacity">
          {!connected && <span className="body-sm text-ink-muted">Paddling back online…</span>}
          <Button variant="quiet" size="sm" onClick={fullscreen}>Full Screen (F)</Button>
        </div>
      )}
    </div>
  );
}

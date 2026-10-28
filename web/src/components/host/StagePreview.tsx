'use client';
// A live miniature of the projector for the cockpit: the real stage page rendered at 1280×720 and scaled
// down to fit, so what you see here is exactly what the room sees (emoji shower included).
import { useEffect, useRef, useState } from 'react';
import { PebbleBadge } from '@/ds';

const W = 1280;
const H = 720;

export function StagePreview({ sessionId, blackout }: { sessionId: string; blackout: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setScale(entry.contentRect.width / W));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="label">Main screen</span>
        {blackout ? <PebbleBadge tone="action">Blacked out</PebbleBadge> : <PebbleBadge tone="success" dot>Live preview</PebbleBadge>}
      </div>
      <div ref={box} className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-card border border-border">
        {scale > 0 && (
          <iframe src={`/stage/${sessionId}?preview=1`} title="Preview of the main screen" tabIndex={-1} aria-hidden
            className="absolute top-0 left-0 border-0 pointer-events-none origin-top-left"
            style={{ width: W, height: H, transform: `scale(${scale})` }} />
        )}
      </div>
    </div>
  );
}

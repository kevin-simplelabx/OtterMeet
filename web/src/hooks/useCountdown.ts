'use client';
// Counts down from a server-sent "ms remaining" (not a timestamp), so phones with a wrong clock still agree.
import { useEffect, useState } from 'react';

export function useCountdown(remainingMs: number | undefined, resetKey: unknown) {
  const [left, setLeft] = useState(remainingMs ?? 0);
  useEffect(() => {
    if (remainingMs === undefined) return;
    const end = performance.now() + remainingMs;
    setLeft(remainingMs);
    const t = setInterval(() => setLeft(Math.max(0, end - performance.now())), 200);
    return () => clearInterval(t);
    // Restart only when the server sends a new countdown, not on every re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, remainingMs === undefined]);
  return left;
}

/** The four quiz shapes, each on its own design-system colour. */
export const QUIZ_COLORS = ['bg-stream-blue', 'bg-kelp-amber', 'bg-moss-green', 'bg-driftwood'] as const;

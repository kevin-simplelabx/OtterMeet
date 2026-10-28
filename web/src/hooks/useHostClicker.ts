'use client';
// Presentation clicker & hotkeys (spec 6 / 9.13). Clickers send PageDown/PageUp or arrows, so these work
// from whichever OtterMeet window has focus: the cockpit or the stage.
import { useEffect, useRef } from 'react';

export interface ClickerActions {
  next: () => void;
  prev: () => void;
  blackout: () => void;
  fullscreen?: () => void;
  stragglers?: () => void;
}

export const CLICKER_KEYS: [string, string][] = [
  ['Space · → · PageDown', 'Next block'],
  ['← · PageUp', 'Previous block'],
  ['B · .', 'Blackout the stage'],
  ['F', 'Full screen (stage)'],
  ['S', 'Rescue Split Words stragglers'],
];

export function useHostClicker(actions: ClickerActions, enabled = true) {
  const ref = useRef(actions);
  ref.current = actions;

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (e.metaKey || e.ctrlKey || e.altKey || t?.closest('input, textarea, select, [contenteditable="true"]')) return;
      if (t?.closest('button, a') && (e.key === ' ' || e.key === 'Enter')) return;
      const a = ref.current;
      switch (e.key) {
        case ' ': case 'ArrowRight': case 'PageDown': a.next(); break;
        case 'ArrowLeft': case 'PageUp': a.prev(); break;
        case 'b': case 'B': case '.': a.blackout(); break;
        case 'f': case 'F': if (!a.fullscreen) return; a.fullscreen(); break;
        case 's': case 'S': if (!a.stragglers) return; a.stragglers(); break;
        default: return;
      }
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled]);
}

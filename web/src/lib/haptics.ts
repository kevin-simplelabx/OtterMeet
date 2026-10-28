// Multi-pattern haptics (spec 9.5). No-op where the Vibration API isn't available (e.g. iOS Safari).
const PATTERNS = {
  tap: [10],
  lock: [20, 40, 20],
  success: [15, 60, 30],
  error: [60, 40, 60],
} satisfies Record<string, number[]>;

export const triggerHaptic = (pattern: keyof typeof PATTERNS) => {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate(PATTERNS[pattern]);
};

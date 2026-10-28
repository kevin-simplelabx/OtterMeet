import type { BlockType } from './types';
import type { IconName } from '@/ds';

/** Activity blocks a host can put on a timeline. `ready` blocks have their live game built; the rest show a holding card. */
export const BLOCK_TYPES: Record<BlockType, { label: string; blurb: string; icon: IconName; minutes: number; ready: boolean }> = {
  LOBBY: { label: 'Lobby', blurb: 'QR code, check-in and the emoji shower while people arrive.', icon: 'people', minutes: 10, ready: true },
  SPLIT_WORDS: { label: 'Split Words', blurb: 'Find the person holding the other half of your word, then merge into squads.', icon: 'raft', minutes: 15, ready: true },
  IMPOSTER: { label: 'Imposter', blurb: 'Squad social deduction: one of you has a different word.', icon: 'search', minutes: 15, ready: true },
  THIS_OR_THAT: { label: 'This or That', blurb: 'Rapid crowd dilemmas with live battle bars.', icon: 'compass', minutes: 5, ready: true },
  WORD_CLOUD: { label: 'Word Cloud & Poll', blurb: 'Open answers that grow on screen, or a quick multiple choice.', icon: 'wave', minutes: 5, ready: true },
  SPEED_QUIZ: { label: 'Speed Quiz', blurb: 'Four-option trivia, scored on speed, with a podium.', icon: 'clock', minutes: 10, ready: true },
  QNA: { label: 'Town Hall Q&A', blurb: 'Questions you approve first, upvoted by the room.', icon: 'easel', minutes: 15, ready: true },
  FEEDBACK: { label: 'Feedback Survey', blurb: 'Private 1–5 ratings and comments, only you see results.', icon: 'check', minutes: 5, ready: true },
  HOLDING: { label: 'Holding Screen', blurb: 'Your title on screen during a talk; phones can still react.', icon: 'cabin', minutes: 20, ready: true },
  BREAK: { label: 'Break', blurb: 'A countdown on screen until you’re back.', icon: 'calendar', minutes: 10, ready: true },
  BLACKOUT: { label: 'Blackout', blurb: 'A black stage, for when the room should look at the speaker.', icon: 'close', minutes: 5, ready: true },
};

export const BLOCK_ORDER = Object.keys(BLOCK_TYPES) as BlockType[];

export function formatMinutes(sec: number) {
  const m = Math.round(sec / 60);
  return m >= 60 ? `${Math.floor(m / 60)} h ${m % 60 ? `${m % 60} min` : ''}`.trim() : `${m} min`;
}

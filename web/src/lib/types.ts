export interface Host {
  id: string;
  name: string;
  email: string;
  tier: string;
}

export type BlockType =
  | 'LOBBY' | 'SPLIT_WORDS' | 'IMPOSTER' | 'THIS_OR_THAT' | 'WORD_CLOUD' | 'SPEED_QUIZ'
  | 'QNA' | 'FEEDBACK' | 'HOLDING' | 'BLACKOUT' | 'BREAK';

export interface TimelineBlockItem {
  id?: string;
  position?: number;
  block_type: BlockType;
  title: string;
  duration_estimate_sec: number;
  config: Record<string, unknown>;
}

export type SessionStatus = 'DRAFT' | 'LIVE' | 'COMPLETED';

export interface LiveSession {
  id: string;
  title: string;
  room_code: string;
  status: SessionStatus;
  active_block_index: number;
  settings: { allow_emoji_shower: boolean; collect_game_feedback: boolean; max_participants: number };
  created_at: string;
  updated_at: string;
  blocks: TimelineBlockItem[];
}

/** What every screen in the room sees: pushed as STATE over the cable, versioned by `rev`. */
export interface StageState {
  code: string;
  title: string;
  status: SessionStatus;
  rev: number;
  blackout: boolean;
  block_index: number;
  block_count: number;
  block: { id: string; block_type: BlockType; title: string; duration_sec: number } | null;
  /** Position inside the block, e.g. This or That question 2 revealed = step 3. */
  step: number;
  step_count: number;
  activity: Activity | null;
  allow_emoji_shower: boolean;
}

export interface ThisOrThatResults { question: number; votes_a: number; votes_b: number; total_votes: number; percent_a: number; percent_b: number }

export type Activity =
  | { kind: 'THIS_OR_THAT'; index: number; total: number; prompt: string; a: string; b: string; revealed: boolean; majority_rule: boolean; results?: ThisOrThatResults }
  | { kind: 'WORD_CLOUD'; mode: 'cloud' | 'poll'; prompt: string; options: string[]; max_words: number }
  | { kind: 'QNA' }
  | { kind: 'FEEDBACK'; questions: SurveyQuestion[] }
  | { kind: 'SPEED_QUIZ'; index: number; total: number; phase: 'question' | 'reveal' | 'leaderboard'; prompt: string; options: string[];
      shapes: string[]; seconds: number; remaining_ms?: number; correct?: number; results?: QuizTally; leaderboard?: LeaderboardEntry[] }
  | { kind: 'SPLIT_WORDS'; phase: 'pairs' | 'quads' | 'squads'; prompt: string; tribes: TribeSummary[] | null }
  | { kind: 'IMPOSTER'; round: number; rounds: number; phase: 'words' | 'vote' | 'reveal'; mode: 'blank' | 'chameleon';
      results?: ImposterResult[]; last_breath_ms?: number };

export interface QuizTally { question: number; answered: number; counts: number[] }
export interface LeaderboardEntry { rank: number; nickname: string; avatar: string; score: number }
export interface TribeSummary { number: number; name: string; avatars: string[] }
export interface Straggler { id: string; nickname: string; avatar: string; word: string | null; connected: boolean }
export interface SplitTally { matched_count: number; total_count: number; stragglers: Straggler[]; dealt: boolean }
export interface ImposterResult {
  number: number; name: string; clue: string; word: string | null; caught: boolean; votes: number; players: number;
  imposter: { id: string; nickname: string; avatar: string } | null; breath: 'stolen' | 'missed' | 'pending' | null;
}
export interface ImposterTally { round: number; phase: string; players: number; votes_in: number; tables: number; results?: ImposterResult[] }

export interface SurveyQuestion { id: string; kind: 'rating' | 'chips' | 'text'; prompt: string; options?: string[] }

/** Live results for the block on screen (stage + cockpit only). */
export type Tally = { block_id: string; step: number } & (
  | ThisOrThatResults
  | { mode: 'poll'; votes: number[]; total: number }
  | { mode: 'cloud'; words: { text: string; count: number }[]; total: number }
  | { responses: number }
  | QuizTally
  | SplitTally
  | ImposterTally
);

export interface QnaItem { id: string; content: string; author: string; upvotes: number; status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'ANSWERED'; avatar?: string | null; created_at?: string }
export interface QnaFeed { questions: QnaItem[]; spotlight: string | null }

/** The attendee's own answers for the current block, sent only to their phone. */
export interface Mine { block_id: string | null; step?: number; answers: Record<string, unknown>; personal?: Personal; score: number }

/** Per-phone data for games that deal each person something different. */
export type Personal = QuizPersonal | SplitPersonal | ImposterPersonal;
export interface QuizPersonal { answered: number | null; correct?: boolean | null; points?: number; rank?: number; of?: number }
export interface SplitPersonal {
  dealt: boolean; word?: string; pin?: string; trio?: boolean; matched?: boolean; confirmed?: boolean;
  partners?: { nickname: string; avatar: string }[]; pair_phrase?: string; quad_phrase?: string | null; tribe?: string; tribe_phrases?: string[];
}
export interface ImposterPersonal {
  seated: boolean; table?: string; order?: number; card?: { imposter: boolean; word?: string | null; clue?: string | null };
  players?: { id: string; nickname: string; avatar: string; order: number }[]; vote?: string | null;
  result?: ImposterResult & { you_were_imposter: boolean; last_breath_ms: number; your_guess: { guess: string; correct: boolean } | null };
}

export interface Participant {
  id: string;
  nickname: string;
  avatar: string;
  total_score: number;
  is_connected: boolean;
}

export interface Roster {
  count: number;
  total: number;
  participants: Participant[];
}

export interface EmojiParticle {
  emoji: string;
  x_percent: number;
  timestamp: number;
}

export const REACTIONS = ['❤️', '🔥', '👏', '🎉', '🚀'] as const;

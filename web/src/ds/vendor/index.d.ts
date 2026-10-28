import type * as React from 'react';

export type IconName = 'pin' | 'calendar' | 'people' | 'arrow-right' | 'pebble' | 'pebble-filled' | 'check' | 'compass' | 'clock' | 'wave' | 'raft' | 'search' | 'close' | 'cabin' | 'easel' | 'ticket';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** action = Kelp Amber (one per view), accent = Stream Blue, quiet = outlined. Default 'action'. */
  variant?: 'action' | 'accent' | 'quiet';
  /** sm 36px, md 44px, lg 52px. Default 'md'. */
  size?: 'sm' | 'md' | 'lg';
  icon?: IconName;
  iconEnd?: IconName;
  /** Renders an <a> instead of a <button>. */
  href?: string;
  block?: boolean;
}
export declare function Button(props: ButtonProps): React.ReactElement;

export interface HoldHandsProps {
  held?: boolean;
  defaultHeld?: boolean;
  onChange?: (held: boolean) => void;
  /** Idle label. Default "Hold Hands". */
  children?: React.ReactNode;
  /** Default "In the raft". */
  heldLabel?: React.ReactNode;
  className?: string;
}
export declare function HoldHands(props: HoldHandsProps): React.ReactElement;

export interface PebbleBadgeProps {
  tone?: 'neutral' | 'accent' | 'action' | 'success' | 'card';
  dot?: boolean;
  icon?: IconName;
  children?: React.ReactNode;
  className?: string;
}
export declare function PebbleBadge(props: PebbleBadgeProps): React.ReactElement;

export interface AnnouncePillProps {
  href?: string;
  /** Default "NEW". */
  label?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}
export declare function AnnouncePill(props: AnnouncePillProps): React.ReactElement;

export interface SearchField { name: string; label: string; placeholder?: string; icon?: IconName; type?: string }
export interface SearchBarProps {
  /** Defaults to Where / Dates / Team size. */
  fields?: SearchField[];
  /** Default "OtterGo". */
  submitLabel?: React.ReactNode;
  onSubmit?: (values: Record<string, string>) => void;
  className?: string;
}
export declare function SearchBar(props: SearchBarProps): React.ReactElement;

export interface RaftOption { value: string; label: React.ReactNode; icon?: IconName }
export interface RaftToggleProps {
  /** Defaults to Team Offsites & Retreats / Public Workshops & Masterclasses. */
  options?: RaftOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  /** Accessible name. Default "Raft Mode". */
  label?: string;
  className?: string;
}
export declare function RaftToggle(props: RaftToggleProps): React.ReactElement;

export interface Attendee { name: string; src?: string }
export interface LinkedRaftProps {
  attendees?: Attendee[];
  claimed?: number;
  capacity?: number;
  /** Avatars shown before "+N others in the raft". Default 3. */
  max?: number;
  className?: string;
}
export declare function LinkedRaft(props: LinkedRaftProps): React.ReactElement;

export interface EventCardProps {
  title: React.ReactNode;
  dates?: string;
  location?: string;
  image?: string;
  imageAlt?: string;
  tag?: React.ReactNode;
  host?: string;
  raft?: LinkedRaftProps;
  price?: React.ReactNode;
  priceUnit?: string;
  /** Default "Grab a Paw". */
  ctaLabel?: React.ReactNode;
  onCta?: () => void;
  href?: string;
  saved?: boolean;
  defaultSaved?: boolean;
  onSaveChange?: (saved: boolean) => void;
  className?: string;
}
export declare function EventCard(props: EventCardProps): React.ReactElement;

export interface TicketStubProps {
  title: React.ReactNode;
  code: React.ReactNode;
  eyebrow?: React.ReactNode;
  holder?: React.ReactNode;
  badge?: React.ReactNode;
  /** Color of the attendee pass. Default 'action'. */
  tone?: 'action' | 'accent' | 'success';
  /** Default "Pass". */
  stubLabel?: React.ReactNode;
  /** false pulls the pass away; set true to snap it in. Default true. */
  snapped?: boolean;
  className?: string;
  style?: React.CSSProperties;
}
export declare function TicketStub(props: TicketStubProps): React.ReactElement;

export interface TicketStackProps { children?: React.ReactNode; className?: string }
export declare function TicketStack(props: TicketStackProps): React.ReactElement;

export interface KelpItem { time: string; title: React.ReactNode; detail?: React.ReactNode; status?: 'done' | 'now'; badge?: React.ReactNode; badgeTone?: PebbleBadgeProps['tone'] }
export interface KelpDay { label: React.ReactNode; items: KelpItem[] }
export interface KelpTimelineProps { days: KelpDay[]; className?: string }
export declare function KelpTimeline(props: KelpTimelineProps): React.ReactElement;

export interface WaveDividerProps { tone?: 'line' | 'accent'; className?: string }
export declare function WaveDivider(props: WaveDividerProps): React.ReactElement;

export interface WaveUnderlineProps { children?: React.ReactNode; className?: string }
export declare function WaveUnderline(props: WaveUnderlineProps): React.ReactElement;

export interface EmptyStateProps {
  title: React.ReactNode;
  children?: React.ReactNode;
  illustration?: React.ReactNode;
  illustrationLabel?: string;
  actions?: React.ReactNode;
  className?: string;
}
export declare function EmptyState(props: EmptyStateProps): React.ReactElement;

export interface RaftConfirmationProps {
  /** Default "You're locked into the raft." */
  title?: React.ReactNode;
  /** Default "Check your inbox!" */
  children?: React.ReactNode;
  pass?: React.ReactNode;
  illustration?: React.ReactNode;
  className?: string;
}
export declare function RaftConfirmation(props: RaftConfirmationProps): React.ReactElement;

export interface PouchItem { id?: string | number; title: React.ReactNode; meta?: React.ReactNode }
export interface PebblePouchProps {
  items?: PouchItem[];
  onRemove?: (item: PouchItem, index: number) => void;
  onClose?: () => void;
  /** Default "Your Pebble Pouch". */
  title?: string;
  emptyText?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}
export declare function PebblePouch(props: PebblePouchProps): React.ReactElement;

export interface CrewNoteProps {
  character?: 'otto' | 'rue' | 'marlo';
  children?: React.ReactNode;
  illustration?: React.ReactNode;
  /** Announce as a status message. */
  live?: boolean;
  className?: string;
}
export declare function CrewNote(props: CrewNoteProps): React.ReactElement;

export interface IconProps {
  name: IconName;
  /** Default 20. */
  size?: number;
  /** Accessible label; omit for decorative icons. */
  label?: string;
  className?: string;
}
export declare function Icon(props: IconProps): React.ReactElement;

declare global {
  interface Window {
    OtterMeet: {
      Button: typeof Button; HoldHands: typeof HoldHands; PebbleBadge: typeof PebbleBadge; AnnouncePill: typeof AnnouncePill;
      SearchBar: typeof SearchBar; RaftToggle: typeof RaftToggle; EventCard: typeof EventCard; LinkedRaft: typeof LinkedRaft;
      TicketStub: typeof TicketStub; TicketStack: typeof TicketStack; KelpTimeline: typeof KelpTimeline;
      WaveDivider: typeof WaveDivider; WaveUnderline: typeof WaveUnderline; EmptyState: typeof EmptyState;
      RaftConfirmation: typeof RaftConfirmation; PebblePouch: typeof PebblePouch; CrewNote: typeof CrewNote; Icon: typeof Icon & { names: IconName[] };
    };
  }
}

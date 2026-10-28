'use client';
// OtterMeet design-system components. The bundle is loaded with this app's React instead of a window global.
import * as React from 'react';
import loadOtterMeet from './bundle.generated.js';
import type * as DS from './vendor/index';

export type * from './vendor/index';

const OM = loadOtterMeet({ React, OtterMeet: {} }) as typeof DS;

export const Button = OM.Button;
export const HoldHands = OM.HoldHands;
export const PebbleBadge = OM.PebbleBadge;
export const AnnouncePill = OM.AnnouncePill;
export const SearchBar = OM.SearchBar;
export const RaftToggle = OM.RaftToggle;
export const EventCard = OM.EventCard;
export const LinkedRaft = OM.LinkedRaft;
export const TicketStub = OM.TicketStub;
export const TicketStack = OM.TicketStack;
export const KelpTimeline = OM.KelpTimeline;
export const WaveDivider = OM.WaveDivider;
export const WaveUnderline = OM.WaveUnderline;
export const EmptyState = OM.EmptyState;
export const RaftConfirmation = OM.RaftConfirmation;
export const PebblePouch = OM.PebblePouch;
export const CrewNote = OM.CrewNote;
export const Icon = OM.Icon;

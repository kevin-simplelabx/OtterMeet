'use client';
import { PebbleBadge } from '@/ds';
import type { SessionStatus } from '@/lib/types';

export function StatusBadge({ status }: { status: SessionStatus }) {
  if (status === 'LIVE') return <PebbleBadge tone="success">Live</PebbleBadge>;
  if (status === 'COMPLETED') return <PebbleBadge tone="neutral" icon="check">Completed</PebbleBadge>;
  return <PebbleBadge tone="neutral">Draft</PebbleBadge>;
}

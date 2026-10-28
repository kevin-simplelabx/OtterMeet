'use client';
// Straggler telemetry & rescue (spec 9.16): who hasn't found their other half yet, and a one-tap fix that slots
// latecomers and people whose partner left into pairs or trios. S does the same from the keyboard.
import { Button } from '@/ds';
import type { SplitTally } from '@/lib/types';

export function StragglerRescuePanel({ tally, rescue }: { tally: SplitTally | null; rescue: () => void }) {
  if (!tally) return null;
  const { matched_count: matched, total_count: total, stragglers } = tally;
  const unplaced = stragglers.filter((s) => !s.word);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="body-sm text-ink-muted tabular-nums">{tally.dealt ? `${matched} of ${total} matched` : 'Words get dealt when the room arrives here.'}</span>
        <Button size="sm" variant="quiet" onClick={rescue}>Rescue Stragglers (S)</Button>
      </div>
      {stragglers.length > 0 && (
        <div className="flex flex-col gap-1">
          <span className="label">Still paddling{unplaced.length ? ` · ${unplaced.length} without a word` : ''}</span>
          <ul className="list-none m-0 p-0 flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {stragglers.map((s) => (
              <li key={s.id} className={`px-3 py-1 rounded-full body-sm ${s.word ? 'bg-surface-fill' : 'bg-action-soft'} ${s.connected ? '' : 'opacity-50'}`}>
                {s.avatar} {s.nickname}{s.word ? ` · ${s.word}` : ' · no word yet'}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

'use client';
// Tables & groups for a session, e.g. project teams assigned before the day. Attendees pick theirs when they
// join, and group games (Imposter) play at these tables.
import { useEffect, useState } from 'react';
import { Button } from '@/ds';
import type { Group } from '@/lib/types';
import { inputClass } from './AuthForm';
import { IconButton } from './Dialog';

const small = `${inputClass} !min-h-9 !py-1.5`;

const numbered = (n: number, from = 1): Group[] =>
  Array.from({ length: n }, (_, i) => ({ code: String(from + i), name: `Table ${from + i}` }));

export function GroupsEditor({ groups, onSave, busy }: { groups: Group[]; onSave: (groups: Group[]) => void; busy?: boolean }) {
  const [draft, setDraft] = useState<Group[]>(groups);
  const [count, setCount] = useState(groups.length || 8);
  useEffect(() => setDraft(groups), [groups]);
  const dirty = JSON.stringify(draft) !== JSON.stringify(groups);
  const update = (i: number, patch: Partial<Group>) => setDraft((d) => d.map((g, j) => (j === i ? { ...g, ...patch } : g)));

  return (
    <div className="bg-surface-card border border-border rounded-lg shadow-card p-5 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="title m-0">Tables &amp; groups</h2>
        <p className="body-sm m-0 text-ink-muted">
          Already split people into teams? Add them here. Attendees pick their table when they join, and group games play at these tables.
        </p>
      </div>

      {draft.length === 0 ? (
        <div className="flex flex-wrap items-end gap-2">
          <label className="flex flex-col gap-1.5">
            <span className="label">How many tables?</span>
            <input type="number" min={1} max={60} className={`${small} !w-24`} value={count}
              onChange={(e) => setCount(Math.max(1, Math.min(60, Number(e.target.value) || 1)))} />
          </label>
          <Button size="sm" variant="quiet" onClick={() => setDraft(numbered(count))}>Add Tables</Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
            {draft.map((g, i) => (
              <div key={i} className="grid grid-cols-[64px_1fr_auto] gap-2 items-center">
                <input className={`${small} text-center tabular-nums`} aria-label={`Table ${i + 1} number`} value={g.code} maxLength={20}
                  onChange={(e) => update(i, { code: e.target.value.trim() })} />
                <input className={small} aria-label={`Table ${i + 1} name`} value={g.name} maxLength={60} placeholder={`Table ${g.code}`}
                  onChange={(e) => update(i, { name: e.target.value })} />
                <IconButton label={`Remove ${g.name || `table ${g.code}`}`} icon="close" onClick={() => setDraft((d) => d.filter((_, j) => j !== i))} />
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button size="sm" variant="quiet" disabled={draft.length >= 60}
              onClick={() => setDraft((d) => [...d, ...numbered(1, Math.max(0, ...d.map((g) => Number(g.code) || 0)) + 1)])}>Add Table</Button>
            <Button size="sm" variant="quiet" onClick={() => setDraft([])}>Clear All</Button>
          </div>
          <span className="body-sm text-ink-muted">The number is what people pick on their phones; the name is what everyone sees.</span>
        </>
      )}

      {dirty && (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="quiet" onClick={() => setDraft(groups)}>Undo</Button>
          <Button size="sm" variant="accent" disabled={busy || draft.some((g) => !g.code)} onClick={() => onSave(draft)}>Save Tables</Button>
        </div>
      )}
    </div>
  );
}

/** The phone's table picker: big number tiles, plus "not sure yet". */
export function GroupPicker({ groups, value, onChange }: { groups: Group[]; value: string | null; onChange: (code: string | null) => void }) {
  return (
    <fieldset className="border-0 p-0 m-0 flex flex-col gap-2">
      <legend className="label mb-2">Which table are you at?</legend>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2">
        {groups.map((g) => {
          const on = value === g.code;
          return (
            <button key={g.code} type="button" aria-pressed={on} onClick={() => onChange(g.code)}
              className={`min-h-16 rounded-md border-2 px-2 py-2 flex flex-col items-center justify-center gap-0.5 cursor-pointer touch-manipulation
                ${on ? 'border-accent bg-accent-soft text-accent' : 'border-border bg-surface-card text-ink'}`}>
              <span className="font-sans font-extrabold text-xl tabular-nums leading-none">{g.code}</span>
              {g.name !== `Table ${g.code}` && <span className="meta text-center leading-tight line-clamp-2">{g.name}</span>}
            </button>
          );
        })}
      </div>
      <button type="button" aria-pressed={value === null} onClick={() => onChange(null)}
        className={`self-start body-sm px-3 py-2 rounded-full border cursor-pointer ${value === null ? 'border-accent bg-accent-soft text-accent' : 'border-border-strong text-ink-muted'}`}>
        Not sure yet
      </button>
    </fieldset>
  );
}

export const groupLabel = (groups: Group[], code: string | null | undefined) =>
  code ? groups.find((g) => g.code === code)?.name ?? `Table ${code}` : null;

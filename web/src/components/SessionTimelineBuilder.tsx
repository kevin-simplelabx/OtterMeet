'use client';
// Drag-and-drop timeline builder (spec 9.14). Reorder by dragging the handle or with the arrow buttons.
import { useState } from 'react';
import { Icon, PebbleBadge } from '@/ds';
import { BLOCK_ORDER, BLOCK_TYPES, formatMinutes } from '@/lib/blocks';
import type { BlockType, TimelineBlockItem } from '@/lib/types';
import { IconButton } from './Dialog';
import { inputClass } from './AuthForm';
import { BlockConfigEditor, hasConfigEditor } from './BlockConfigEditor';

export function SessionTimelineBuilder({ blocks, onChange, activeIndex }: {
  blocks: TimelineBlockItem[];
  onChange: (blocks: TimelineBlockItem[]) => void;
  /** Highlights the block the room is on, when live. */
  activeIndex?: number;
}) {
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [openKey, setOpenKey] = useState<string | null>(null);

  const move = (from: number, to: number) => {
    if (to < 0 || to >= blocks.length || from === to) return;
    const next = [...blocks];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };
  const update = (i: number, patch: Partial<TimelineBlockItem>) => onChange(blocks.map((b, j) => (j === i ? { ...b, ...patch } : b)));
  const remove = (i: number) => onChange(blocks.filter((_, j) => j !== i));
  const add = (type: BlockType) =>
    onChange([...blocks, { block_type: type, title: BLOCK_TYPES[type].label, duration_estimate_sec: BLOCK_TYPES[type].minutes * 60, config: {} }]);

  const total = blocks.reduce((t, b) => t + b.duration_estimate_sec, 0);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="heading-3 m-0">Timeline</h2>
        <span className="body-sm text-ink-muted">{blocks.length} blocks · {formatMinutes(total)}</span>
      </div>

      {blocks.length === 0 && <p className="body text-ink-muted m-0">No blocks yet. Add one below.</p>}

      <ol className="list-none m-0 p-0 flex flex-col gap-3">
        {blocks.map((b, i) => {
          const meta = BLOCK_TYPES[b.block_type];
          const key = b.id ?? `new-${i}`;
          const editing = openKey === key;
          return (
            <li key={key}
              draggable={!editing}
              onDragStart={(e) => { setDragFrom(i); e.dataTransfer.effectAllowed = 'move'; }}
              onDragOver={(e) => { e.preventDefault(); setDragOver(i); }}
              onDragLeave={() => setDragOver((o) => (o === i ? null : o))}
              onDrop={(e) => { e.preventDefault(); if (dragFrom !== null) move(dragFrom, i); setDragFrom(null); setDragOver(null); }}
              onDragEnd={() => { setDragFrom(null); setDragOver(null); }}
              className={`bg-surface-card border rounded-lg shadow-card p-4 flex flex-wrap items-center gap-3 transition-shadow
                ${dragOver === i && dragFrom !== i ? 'border-accent shadow-float' : 'border-border'} ${dragFrom === i ? 'opacity-50' : ''}
                ${activeIndex === i ? 'ring-2 ring-success' : ''}`}>
              <span className="cursor-grab text-ink-muted select-none px-1" aria-hidden title="Drag to reorder">⋮⋮</span>
              <span className="tag text-ink-muted w-6 text-right tabular-nums">{i + 1}</span>
              <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-soft text-accent flex-none"><Icon name={meta.icon} size={20} /></span>
              <div className="flex-[1_1_220px] min-w-0 flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="eyebrow text-ink-muted">{meta.label}</span>
                  {activeIndex === i && <PebbleBadge tone="success">On now</PebbleBadge>}
                  {!meta.ready && <PebbleBadge tone="neutral">Game on the way</PebbleBadge>}
                </div>
                <input aria-label={`Block ${i + 1} title`} className={`${inputClass} !min-h-9 !py-1.5`} value={b.title} maxLength={120}
                  onChange={(e) => update(i, { title: e.target.value })} />
              </div>
              <label className="flex items-center gap-2 body-sm text-ink-muted">
                <input type="number" min={0} max={240} aria-label={`Block ${i + 1} minutes`} className={`${inputClass} !w-20 !min-h-9 !py-1.5 tabular-nums`}
                  value={Math.round(b.duration_estimate_sec / 60)}
                  onChange={(e) => update(i, { duration_estimate_sec: Math.max(0, Math.min(240, Number(e.target.value) || 0)) * 60 })} />
                min
              </label>
              <div className="flex items-center">
                {hasConfigEditor(b) && (
                  <button type="button" aria-expanded={editing} onClick={() => setOpenKey(editing ? null : key)}
                    className="label px-3 min-h-9 rounded-full !text-accent hover:bg-accent-soft cursor-pointer">{editing ? 'Done' : 'Set Up'}</button>
                )}
                <IconButton label="Move up" icon="arrow-right" rotate={-90} onClick={() => move(i, i - 1)} disabled={i === 0} />
                <IconButton label="Move down" icon="arrow-right" rotate={90} onClick={() => move(i, i + 1)} disabled={i === blocks.length - 1} />
                <IconButton label={`Remove ${b.title}`} icon="close" onClick={() => remove(i)} />
              </div>
              {editing && (
                <div className="basis-full pt-3 border-t border-border">
                  <BlockConfigEditor block={b} onChange={(config) => update(i, { config })} />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex flex-col gap-3">
        <span className="label">Add a block</span>
        <div className="flex flex-wrap gap-2">
          {BLOCK_ORDER.map((type) => (
            <button key={type} type="button" onClick={() => add(type)} title={BLOCK_TYPES[type].blurb}
              className="inline-flex items-center gap-2 min-h-9 px-4 rounded-full border border-border-strong bg-surface-card text-ink hover:bg-surface-fill cursor-pointer body-sm">
              <Icon name={BLOCK_TYPES[type].icon} size={16} />{BLOCK_TYPES[type].label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

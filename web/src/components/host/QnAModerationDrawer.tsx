'use client';
// Q&A vetting queue (spec 9.15). Nothing reaches the room until the host approves it. A / R handle the
// oldest pending question from the keyboard.
import { useEffect } from 'react';
import { Button, PebbleBadge } from '@/ds';
import { IconButton } from '@/components/Dialog';
import type { QnaFeed, QnaItem } from '@/lib/types';

type Decision = 'approve' | 'reject' | 'answered' | 'spotlight';

export function QnAModerationDrawer({ open, onClose, queue, feed, moderate }: {
  open: boolean; onClose: () => void; queue: QnaItem[]; feed: QnaFeed | null; moderate: (id: string, decision: Decision) => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest('input, textarea')) return;
      if (e.key === 'Escape') onClose();
      const first = queue[0];
      if (!first) return;
      if (e.key === 'a' || e.key === 'A') { e.preventDefault(); moderate(first.id, 'approve'); }
      if (e.key === 'r' || e.key === 'R') { e.preventDefault(); moderate(first.id, 'reject'); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, queue, moderate]);

  if (!open) return null;
  const approved = (feed?.questions ?? []).filter((q) => q.status === 'APPROVED');

  return (
    <aside aria-label="Q&A moderation" className="fixed inset-y-0 right-0 z-40 w-full max-w-[420px] bg-surface border-l border-border shadow-float flex flex-col">
      <div className="flex items-center justify-between gap-3 p-5 border-b border-border">
        <div className="flex flex-col">
          <h2 className="heading-3 m-0">Q&amp;A queue</h2>
          <span className="meta text-ink-muted">A approves, R rejects the oldest one</span>
        </div>
        <IconButton label="Close Q&A queue" icon="close" onClick={onClose} />
      </div>
      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
        <section className="flex flex-col gap-3">
          <span className="label">Waiting for you <PebbleBadge tone={queue.length ? 'action' : 'neutral'}>{queue.length}</PebbleBadge></span>
          {queue.length === 0 && <p className="body-sm m-0 text-ink-muted">All caught up. New questions land here first.</p>}
          {queue.map((q, i) => (
            <div key={q.id} className={`bg-surface-card border rounded-lg p-4 flex flex-col gap-3 ${i === 0 ? 'border-accent' : 'border-border'}`}>
              <p className="body m-0">{q.content}</p>
              <span className="meta text-ink-muted">{q.avatar ? `${q.avatar} ` : ''}{q.author}</span>
              <div className="flex gap-2">
                <Button size="sm" variant="accent" onClick={() => moderate(q.id, 'approve')}>Approve</Button>
                <Button size="sm" variant="quiet" onClick={() => moderate(q.id, 'reject')}>Reject</Button>
              </div>
            </div>
          ))}
        </section>
        <section className="flex flex-col gap-3">
          <span className="label">In the room, by upvotes</span>
          {approved.length === 0 && <p className="body-sm m-0 text-ink-muted">Approved questions show here.</p>}
          {approved.map((q) => {
            const spot = feed?.spotlight === q.id;
            return (
              <div key={q.id} className={`bg-surface-card border rounded-lg p-4 flex flex-col gap-2 ${spot ? 'border-success' : 'border-border'}`}>
                <div className="flex items-start gap-3">
                  <span className="tag text-accent tabular-nums min-w-8">▲ {q.upvotes}</span>
                  <p className="body m-0 flex-1">{q.content}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant={spot ? 'accent' : 'quiet'} onClick={() => moderate(q.id, 'spotlight')}>{spot ? 'Remove From Stage' : 'Put On Stage'}</Button>
                  <Button size="sm" variant="quiet" onClick={() => moderate(q.id, 'answered')}>Mark Answered</Button>
                </div>
              </div>
            );
          })}
        </section>
      </div>
    </aside>
  );
}

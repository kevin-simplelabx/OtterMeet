'use client';
import { useEffect, useId, useRef } from 'react';
import { Icon } from '@/ds';

export function Dialog({ title, onClose, size = 'md', children }: { title: string; onClose: () => void; size?: 'sm' | 'md'; children: React.ReactNode }) {
  const titleId = useId();
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const el = ref.current;
    (el?.querySelector<HTMLElement>('input, textarea, select') ?? el?.querySelector<HTMLElement>('.dialog-body button'))?.focus();
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = overflow; };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-scrim flex items-start justify-center px-4 py-10 overflow-y-auto"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} role="dialog" aria-modal="true" aria-labelledby={titleId}
        className={`w-full ${size === 'sm' ? 'max-w-[440px]' : 'max-w-[640px]'} p-8 bg-surface-card rounded-xl shadow-float flex flex-col gap-6`}>
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="heading-3 m-0">{title}</h2>
          <IconButton label="Close" icon="close" onClick={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
}

export function IconButton({ label, icon, onClick, disabled, rotate }: {
  label: string; icon: React.ComponentProps<typeof Icon>['name']; onClick: () => void; disabled?: boolean; rotate?: 90 | -90 | 180;
}) {
  return (
    <button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full text-ink-muted hover:bg-surface-fill hover:text-ink disabled:opacity-40 disabled:pointer-events-none cursor-pointer">
      <span className="inline-flex" style={rotate ? { transform: `rotate(${rotate}deg)` } : undefined}><Icon name={icon} size={20} /></span>
    </button>
  );
}

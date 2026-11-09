'use client';

export const inputClass =
  'w-full min-h-11 px-3.5 py-2.5 font-text text-base text-ink bg-surface-card border border-border-strong rounded-md transition-shadow focus:outline-none focus:shadow-[var(--focus-ring)]';

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 min-w-0">
      <span className="label text-ink">{label}</span>
      {children}
      {hint && <span className="body-sm text-ink-muted">{hint}</span>}
    </label>
  );
}

export function Alert({ children }: { children: React.ReactNode }) {
  return <div role="alert" className="body-sm px-4 py-3 rounded-md bg-action-soft text-ink">{children}</div>;
}

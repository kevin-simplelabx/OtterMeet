'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/ds';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Host } from '@/lib/types';
import { Wordmark } from './SiteHeader';

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

export function AuthShell({ title, intro, footer, children }: { title: string; intro: string; footer: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="wrap py-4"><Wordmark /></header>
      <main className="flex-1 flex justify-center px-4 pt-10 pb-16">
        <div className="w-full max-w-[440px] h-fit bg-surface-card border border-border rounded-xl shadow-card p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-ink-muted">Host portal</span>
            <h1 className="heading-2 m-0">{title}</h1>
            <p className="body m-0 text-ink-muted">{intro}</p>
          </div>
          {children}
          <p className="body-sm m-0 text-ink-muted text-center">{footer}</p>
        </div>
      </main>
    </div>
  );
}

type Fields = Record<string, string>;

export function useAuthForm(path: string, initial: Fields) {
  const { setHost } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get('next');
  const [values, setValues] = useState(initial);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const bind = (name: string) => ({
    name,
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [name]: e.target.value })),
  });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const { host } = await api<{ host: Host }>(path, { method: 'POST', body: values });
      setHost(host);
      router.replace(next?.startsWith('/') && !next.startsWith('//') ? next : '/portal');
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return { bind, error, busy, onSubmit };
}

export function LoginForm() {
  const { bind, error, busy, onSubmit } = useAuthForm('/auth/login', { email: '', password: '' });
  return (
    <AuthShell title="Welcome back." intro="Log in to build timelines and run your rooms."
      footer={<>New to OtterMeet? <Link href="/signup">Create a host account</Link></>}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        {error && <Alert>{error}</Alert>}
        <Field label="Email"><input className={inputClass} type="email" autoComplete="email" required {...bind('email')} /></Field>
        <Field label="Password"><input className={inputClass} type="password" autoComplete="current-password" required {...bind('password')} /></Field>
        <Button type="submit" variant="action" block disabled={busy}>{busy ? 'Logging In…' : 'Log In'}</Button>
      </form>
    </AuthShell>
  );
}

export function SignupForm() {
  const { bind, error, busy, onSubmit } = useAuthForm('/auth/signup', { name: '', email: '', password: '' });
  return (
    <AuthShell title="Start hosting." intro="Create your host account and build your first timeline in minutes."
      footer={<>Already hosting? <Link href="/login">Log in</Link></>}>
      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        {error && <Alert>{error}</Alert>}
        <Field label="Your name"><input className={inputClass} autoComplete="name" required {...bind('name')} /></Field>
        <Field label="Email"><input className={inputClass} type="email" autoComplete="email" required {...bind('email')} /></Field>
        <Field label="Password" hint="At least 8 characters.">
          <input className={inputClass} type="password" autoComplete="new-password" minLength={8} required {...bind('password')} />
        </Field>
        <Button type="submit" variant="action" block disabled={busy}>{busy ? 'Creating Account…' : 'Create Host Account'}</Button>
      </form>
    </AuthShell>
  );
}

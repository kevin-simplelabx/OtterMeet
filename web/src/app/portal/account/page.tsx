'use client';
import { useState } from 'react';
import { Button } from '@/ds';
import { Alert, Field, inputClass } from '@/components/AuthForm';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Host } from '@/lib/types';

function useForm<T extends Record<string, string>>(initial: T, submit: (v: T) => Promise<string>) {
  const [values, setValues] = useState(initial);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const bind = (name: keyof T) => ({
    value: values[name],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setValues((v) => ({ ...v, [name]: e.target.value })),
  });
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setError(''); setNotice('');
    try { setNotice(await submit(values)); } catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  }
  return { bind, onSubmit, error, notice, busy, setValues };
}

export default function AccountPage() {
  const { host, setHost } = useAuth();

  const profile = useForm({ name: host?.name ?? '' }, async ({ name }) => {
    const d = await api<{ host: Host }>('/account', { method: 'PATCH', body: { name } });
    setHost(d.host);
    return 'Name saved. Looking good.';
  });

  const password = useForm({ current_password: '', new_password: '' }, async (v) => {
    if (!v.new_password) throw new Error('Type a new password first.');
    await api('/account', { method: 'PATCH', body: v });
    password.setValues({ current_password: '', new_password: '' });
    return 'All set. Your password is changed.';
  });

  const card = 'bg-surface-card border border-border rounded-lg shadow-card p-6 flex flex-col gap-4';

  return (
    <div className="flex flex-col gap-8 max-w-[560px]">
      <div className="flex flex-col gap-2">
        <span className="eyebrow text-ink-muted">Host portal</span>
        <h1 className="heading-1 m-0">Account</h1>
        <p className="body m-0 text-ink-muted">Signed in as {host?.email}.</p>
      </div>

      <form className={card} onSubmit={profile.onSubmit} noValidate>
        <h2 className="title m-0">Profile</h2>
        {profile.error && <Alert>{profile.error}</Alert>}
        <Field label="Your name"><input className={inputClass} autoComplete="name" {...profile.bind('name')} /></Field>
        {profile.notice && <p role="status" className="body-sm m-0 text-ink-muted">{profile.notice}</p>}
        <div><Button type="submit" variant="accent" disabled={profile.busy}>Save Name</Button></div>
      </form>

      <form className={card} onSubmit={password.onSubmit} noValidate>
        <h2 className="title m-0">Password</h2>
        {password.error && <Alert>{password.error}</Alert>}
        <Field label="Current password"><input className={inputClass} type="password" autoComplete="current-password" {...password.bind('current_password')} /></Field>
        <Field label="New password" hint="At least 8 characters."><input className={inputClass} type="password" autoComplete="new-password" {...password.bind('new_password')} /></Field>
        {password.notice && <p role="status" className="body-sm m-0 text-ink-muted">{password.notice}</p>}
        <div><Button type="submit" variant="accent" disabled={password.busy}>Change Password</Button></div>
      </form>
    </div>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuth } from '@/lib/auth';
import type { Host } from '@/lib/types';
import { Otter } from './Site';

type Mode = 'signup' | 'login';

const COPY = {
  signup: { title: 'Make your free account.', sub: 'Free while we’re in alpha. No card needed.', cta: 'Create Account', busy: 'Creating Account…', email: 'Work email' },
  login: { title: 'Welcome back.', sub: 'Log in to your sessions and events.', cta: 'Log In', busy: 'Logging In…', email: 'Email' },
};

const LABEL = 'flex flex-col gap-1.5 font-sans font-bold text-sm';
const FIELD = 'site-field h-[46px] px-3.5 rounded-xl text-base font-text font-normal';

const isEmail = (e: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e.trim());

/** Start Free (/start) and Log In (/login): one screen with a tab for each. */
export function HostAuth({ mode }: { mode: Mode }) {
  const { setHost } = useAuth();
  const router = useRouter();
  const next = useSearchParams().get('next');
  const safeNext = next?.startsWith('/') && !next.startsWith('//') ? next : null;
  const keep = safeNext ? `?next=${encodeURIComponent(safeNext)}` : '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const c = COPY[mode];
  const signup = mode === 'signup';

  const typing = <T,>(set: (v: T) => void) => (v: T) => { set(v); setError(''); };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (signup && !name.trim()) return setError('Type your name.');
    if (!isEmail(email)) return setError('That email doesn’t look right. Check it and try again.');
    if (signup && password.length < 8) return setError('Use 8 characters or more.');
    if (!signup && !password) return setError('Type your password.');
    if (signup && !agree) return setError('Tick the box to agree to the Terms and Privacy policy.');
    setBusy(true);
    try {
      const body = signup ? { name: name.trim(), email: email.trim(), password } : { email: email.trim(), password };
      const { host } = await api<{ host: Host }>(signup ? '/auth/signup' : '/auth/login', { method: 'POST', body });
      setHost(host);
      router.replace(safeNext ?? '/portal');
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className="site min-h-screen flex flex-col">
      <header className="flex items-center justify-between gap-4 px-8 h-[72px] border-b border-sand max-site:px-4">
        <Link href="/" className="font-sans font-extrabold text-[22px] tracking-[-0.3px] !text-navy">OtterMeet</Link>
        <Link href="/" className="font-sans font-bold text-[15px]">← Back to the website</Link>
      </header>

      <div className="flex-auto flex flex-wrap items-stretch">
        <aside className="site-dark flex-[1_1_420px] min-w-0 flex flex-col justify-center gap-5 p-14 bg-navy text-paper max-[860px]:hidden">
          <Otter name="otto-welcome" className="w-[150px]" />
          <p className="m-0 font-sans font-extrabold text-[38px] leading-[44px]">We otter meet.</p>
          <p className="m-0 text-lg leading-7 text-oat max-w-[440px]">Games, polls and Q&amp;A that get the whole room talking, from the first coffee to the last wrap.</p>
          <ul className="m-0 p-0 list-none flex flex-col gap-2.5 text-base">
            {['Ready-made games, polls and Q&A', 'Everyone joins on their phone, with nothing to install', 'A report the moment it ends'].map((t) => (
              <li key={t} className="flex gap-2"><span aria-hidden="true">✓</span>{t}</li>
            ))}
          </ul>
        </aside>

        <main className="flex-[1_1_480px] min-w-0 flex items-center justify-center px-6 py-12">
          <form className="w-full max-w-[440px] flex flex-col gap-[18px]" onSubmit={submit} noValidate>
            <nav aria-label="Account" className="flex p-1 rounded-full bg-sand">
              {(['signup', 'login'] as const).map((m) => (
                <Link key={m} href={`${m === 'signup' ? '/start' : '/login'}${keep}`} replace aria-current={mode === m ? 'page' : undefined}
                  className={`flex-1 flex items-center justify-center min-h-10 rounded-full font-sans font-bold text-[15px] !text-navy ${mode === m ? 'bg-white' : ''}`}>
                  {m === 'signup' ? 'Create Account' : 'Log In'}
                </Link>
              ))}
            </nav>
            <h1 className="site-head text-[32px] leading-10">{c.title}</h1>
            <p className="m-0 text-[15px] text-brown">{c.sub}</p>

            {signup && (
              <label className={LABEL}>Your name
                <input className={FIELD} type="text" autoComplete="name" value={name} onChange={(e) => typing(setName)(e.target.value)} />
              </label>
            )}
            <label className={LABEL}>{c.email}
              <input className={FIELD} type="email" autoComplete="email" value={email} onChange={(e) => typing(setEmail)(e.target.value)} />
            </label>
            <label className={LABEL}>
              <span className="flex justify-between">
                Password
                {!signup && <a href="mailto:hello@ottermeet.io?subject=Reset%20my%20OtterMeet%20password" className="text-sm">Forgot password?</a>}
              </span>
              <input className={FIELD} type="password" autoComplete={signup ? 'new-password' : 'current-password'} value={password}
                onChange={(e) => typing(setPassword)(e.target.value)} />
            </label>
            {signup && (
              <label className="flex items-start gap-2.5 text-[15px] leading-[22px] cursor-pointer">
                <input type="checkbox" checked={agree} onChange={(e) => typing(setAgree)(e.target.checked)} className="w-5 h-5 mt-px flex-none accent-navy" />
                <span>I agree to the <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy</Link> policy.</span>
              </label>
            )}
            {error && <p role="alert" className="m-0 text-[15px] text-[#a3330f]">{error}</p>}
            <button type="submit" disabled={busy} className="site-btn min-h-[52px] text-[17px]">{busy ? c.busy : c.cta}</button>
          </form>
        </main>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ApiError, api } from '@/lib/api';
import { Otter } from '@/components/site/Site';

/** ottermeet.io/join: type the room code from the big screen. The nickname step is the phone app, at /join/[code]. */
export default function EnterCode() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function find(e: React.FormEvent) {
    e.preventDefault();
    if (code.length < 4) return setError('Room codes have 4 to 6 letters. Check the big screen and try again.');
    setBusy(true);
    try {
      await api(`/join/${code}`);
      router.push(`/join/${code}`);
    } catch (err) {
      setError(err instanceof ApiError && err.status === 404
        ? 'That code doesn’t match a room. Check the big screen and try again.'
        : (err as Error).message);
      setBusy(false);
    }
  }

  return (
    <div className="site site-dark min-h-dvh flex flex-col !bg-navy !text-paper">
      <header className="flex items-center justify-between gap-4 px-6 h-[68px] border-b border-paper/12">
        <Link href="/" className="font-sans font-extrabold text-[22px] !text-paper">OtterMeet</Link>
        <Link href="/start" className="font-sans font-bold text-[15px]">Hosting? Start Free</Link>
      </header>
      <main className="flex-auto flex items-center justify-center px-5 py-10">
        <form onSubmit={find} noValidate className="w-full max-w-[420px] flex flex-col items-center gap-[18px] text-center">
          <Otter name="otto-welcome" className="w-[140px]" />
          <h1 className="site-head text-[40px] leading-[46px]">Hop in.</h1>
          <p className="m-0 text-[17px] leading-[26px] text-oat">Type the room code from the big screen.</p>
          <label className="w-full">
            <span className="sr-only">Room code</span>
            <input type="text" inputMode="text" autoComplete="off" autoCapitalize="characters" spellCheck={false} maxLength={6} autoFocus
              value={code} placeholder="ABCD" aria-invalid={!!error}
              onChange={(e) => { setCode(e.target.value.replace(/[^a-z0-9]/gi, '').toUpperCase().slice(0, 6)); setError(''); }}
              className={`site-field h-[76px] border-2 rounded-[18px] text-center font-sans font-extrabold !text-[40px] tracking-[12px] uppercase placeholder:text-stone/50 ${error ? '!border-[#e46a6a]' : ''}`} />
          </label>
          {error && <p role="alert" className="m-0 text-[15px] leading-[22px] text-[#ffb4a1]">{error}</p>}
          <button type="submit" disabled={busy} className="site-btn w-full min-h-14 text-lg !shadow-none">{busy ? 'Finding Your Room…' : 'Find My Room'}</button>
          <p className="m-0 text-sm text-mist">Or scan the QR code on the big screen with your phone’s camera.</p>
        </form>
      </main>
    </div>
  );
}

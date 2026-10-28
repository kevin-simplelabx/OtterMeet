'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/ds';
import { Field, inputClass } from '@/components/AuthForm';
import { Wordmark } from '@/components/SiteHeader';

export default function EnterCode() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const clean = code.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="px-4 py-4"><Wordmark /></header>
      <main className="flex-1 flex justify-center px-4 pt-10 pb-16">
        <form className="w-full max-w-[400px] h-fit bg-surface-card border border-border rounded-xl shadow-card p-8 flex flex-col gap-6"
          onSubmit={(e) => { e.preventDefault(); if (clean.length >= 4) router.push(`/join/${clean}`); }}>
          <div className="flex flex-col gap-2">
            <span className="eyebrow text-ink-muted">Join a room</span>
            <h1 className="heading-2 m-0">What’s the room code?</h1>
            <p className="body m-0 text-ink-muted">It’s on the big screen, under the QR code.</p>
          </div>
          <Field label="Room code">
            <input className={`${inputClass} font-sans font-extrabold !text-3xl tracking-[0.3em] text-center uppercase`} value={clean}
              onChange={(e) => setCode(e.target.value)} autoCapitalize="characters" autoComplete="off" spellCheck={false} inputMode="text" autoFocus />
          </Field>
          <Button type="submit" variant="action" block disabled={clean.length < 4}>Join Room</Button>
        </form>
      </main>
    </div>
  );
}

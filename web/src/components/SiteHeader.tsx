'use client';
import Link from 'next/link';
import { Button } from '@/ds';
import { useAuth } from '@/lib/auth';

export function Wordmark() {
  return (
    <Link href="/" className="font-sans font-extrabold text-[22px] leading-7 py-2 !text-ink no-underline">
      OtterMeet
    </Link>
  );
}

export function SiteHeader({ nav = true }: { nav?: boolean }) {
  const { host } = useAuth();
  return (
    <header className="wrap flex flex-wrap items-center justify-between gap-x-8 gap-y-2 py-4">
      <Wordmark />
      {nav && (
        <nav aria-label="Main" className="flex flex-wrap gap-x-7">
          {[['#games', 'What It Does'], ['#how', 'How It Works'], ['#screens', 'For Hosts']].map(([href, label]) => (
            <a key={href} href={href} className="label py-3 !text-ink no-underline hover:!text-accent">{label}</a>
          ))}
        </nav>
      )}
      <div className="flex flex-wrap items-center gap-3">
        {host ? (
          <Button variant="accent" size="sm" href="/portal">Open Host Portal</Button>
        ) : (
          <>
            <Button variant="quiet" size="sm" href="/join">Join a Room</Button>
            <Button variant="quiet" size="sm" href="/login">Log In</Button>
            <Button variant="accent" size="sm" href="/signup">Start Hosting</Button>
          </>
        )}
      </div>
    </header>
  );
}

'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const NAV = [
  ['/room', 'The room'],
  ['/events', 'Events'],
  ['/about', 'About'],
] as const;

const FOOTER = [
  ['/room', 'The room'],
  ['/events', 'Events'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
  ['/help', 'Help Centre'],
  ['/privacy', 'Privacy'],
  ['/terms', 'Terms'],
] as const;

const jakarta = 'font-sans font-bold text-[15px]';

/** The website's sticky top bar. `dark` is for the navy pages (The room). */
export function SiteHeader({ dark = false }: { dark?: boolean }) {
  const path = usePathname();
  const { host } = useAuth();
  const ink = dark ? '!text-paper' : '!text-navy';

  return (
    <header className={`sticky top-0 z-10 border-b ${dark ? 'site-dark bg-navy/95 border-paper/12' : 'bg-paper/95 border-sand'}`}>
      <div className="site-wrap flex items-center justify-between gap-4 h-[72px]">
        <Link href="/" className={`font-sans font-extrabold text-[22px] tracking-[-0.3px] ${ink}`}>OtterMeet</Link>
        <nav aria-label="Main" className={`flex gap-8 max-site:hidden ${jakarta}`}>
          {NAV.map(([href, label]) => {
            const on = path === href;
            return (
              <Link key={href} href={href} aria-current={on ? 'page' : undefined}
                className={on
                  ? `px-3.5 py-2 -mx-3.5 -my-2 rounded-full ${dark ? 'bg-link-dark/22 !text-white' : 'bg-sky !text-link'}`
                  : ink}>
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/join" className={`${jakarta} ${ink}`}>Join<span className="max-site:hidden"> a session</span></Link>
          {host ? (
            <Link href="/portal" className="site-btn min-h-11 px-5 text-[15px]">Open OtterMeet</Link>
          ) : (
            <>
              <Link href="/login" className={`${jakarta} ${ink}`}>Log In</Link>
              <Link href="/start" className="site-btn min-h-11 px-5 text-[15px]">Start Free</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const path = usePathname();
  return (
    <footer className="site-dark pt-10 pb-12 bg-navy-deep text-mist">
      <div className="site-wrap flex flex-wrap items-center justify-between gap-5">
        <div className="flex items-baseline gap-3.5">
          <span className="font-sans font-extrabold text-xl text-paper">OtterMeet</span>
          <span className="font-sans font-bold text-base">We otter meet.</span>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2.5 text-[15px]">
          {FOOTER.map(([href, label]) => (
            <Link key={href} href={href} aria-current={path === href ? 'page' : undefined}
              className={path === href ? '!text-paper' : '!text-mist hover:!text-paper'}>
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}

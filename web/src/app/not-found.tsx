import Link from 'next/link';
import { Otter } from '@/components/site/Site';

export const metadata = { title: 'Page not found' };

export default function NotFound() {
  return (
    <div className="site min-h-dvh flex flex-col">
      <header className="flex items-center px-6 h-[72px] border-b border-sand">
        <Link href="/" className="font-sans font-extrabold text-[22px] !text-navy">OtterMeet</Link>
      </header>
      <main className="flex-auto flex items-center justify-center px-5 py-12">
        <div className="max-w-[520px] flex flex-col items-center gap-[18px] text-center">
          <Otter name="otto-welcome" className="w-[150px]" />
          <p className="site-eyebrow">Error 404</p>
          <h1 className="site-head text-5xl leading-[54px] tracking-[-0.8px] max-site:!text-[40px] max-site:!leading-[46px]">This page drifted off.</h1>
          <p className="m-0 text-lg leading-7 text-copy">We can’t find that page. If you typed the address, check it and try again.</p>
          <div className="flex flex-wrap justify-center items-center gap-x-[22px] gap-y-3.5 mt-1.5">
            <Link href="/" className="site-btn min-h-[52px] px-[26px] text-[17px]">Go to the Home Page</Link>
            <Link href="/join" className="font-sans font-bold text-base">Joining a session? Type your code</Link>
          </div>
        </div>
      </main>
    </div>
  );
}

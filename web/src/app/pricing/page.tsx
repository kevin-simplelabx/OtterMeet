import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Eyebrow, H1, SitePage } from '@/components/site/Site';
import { flags } from '@/lib/flags';

export const metadata: Metadata = {
  title: 'Pricing',
  description: 'Start free. Pay per host, not per guest: Free, Team and Business plans for OtterMeet.',
  alternates: { canonical: '/pricing' },
};

// Proposed prices (tech spec 4.4). Hidden while the alpha is free: NEXT_PUBLIC_SHOW_PRICING.
const PLANS = [
  {
    name: 'Free', line: 'Try it with a small group.', price: '$0', per: null, cta: ['/start', 'Start Free'], featured: false,
    items: ['1 host', '3 live sessions a month', 'Up to 50 people a session', '5 games', 'Reports kept for 30 days', '100 MB storage'],
  },
  {
    name: 'Team', line: 'For regular team get-togethers and meetups.', price: '$19', per: 'per host a month, billed yearly',
    cta: ['/start', 'Start Free, Upgrade Later'], featured: true,
    items: ['Unlimited live sessions', 'Up to 200 people a session', '10 games', 'Your logo on every screen', 'Reports kept for 12 months', '2 GB storage per host, shared', 'Host levels and perks'],
  },
  {
    name: 'Business', line: 'For town halls and large events.', price: '$39', per: 'per host a month, billed yearly', cta: ['/contact', 'Talk to Us'], featured: false,
    items: ['Everything in Team', 'Up to 1,000 people a session', 'All games', 'Reports kept for 3 years', '5 GB storage per host, shared', 'Admin controls and billing for the whole company'],
  },
] as const;

export default function PricingPage() {
  if (!flags.showPricing) notFound();

  return (
    <SitePage>
      <section className="pt-20 pb-12">
        <div className="site-wrap flex flex-col items-center gap-4 text-center">
          <Eyebrow>Pricing</Eyebrow>
          <H1 className="text-[56px] leading-[62px] max-w-[760px]">Start free. Grow when the room does.</H1>
          <p className="m-0 text-lg leading-7 text-copy max-w-[620px]">Pay per host, not per guest. Guests never need an account.</p>
        </div>
      </section>

      <section className="pb-[88px]">
        <div className="site-wrap grid gap-6 items-stretch grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))]">
          {PLANS.map((p) => (
            <div key={p.name} className={`relative p-8 rounded-[26px] bg-white flex flex-col gap-[18px] ${p.featured
              ? 'border-[2.5px] border-orange shadow-[0_18px_36px_-12px_rgba(13,27,42,0.22)]'
              : 'border-[1.5px] border-sand'}`}>
              {p.featured && (
                <span className="absolute -top-3.5 left-7 px-3 py-1 rounded-full bg-orange font-sans font-extrabold text-xs tracking-[0.6px] uppercase">Most popular</span>
              )}
              <h2 className="site-head text-[26px]">{p.name}</h2>
              <p className="m-0 text-[15px] leading-[23px] text-brown">{p.line}</p>
              <p className="m-0 flex items-baseline gap-2">
                <span className="font-sans font-extrabold text-[46px]">{p.price}</span>
                {p.per && <span className="text-[15px] text-brown">{p.per}</span>}
              </p>
              <Link href={p.cta[0]} className={p.featured
                ? 'site-btn min-h-[50px] text-base'
                : 'site-btn !bg-transparent !shadow-none min-h-[50px] border-2 !border-navy text-base'}>
                {p.cta[1]}
              </Link>
              <ul className="m-0 p-0 list-none flex flex-col gap-2.5 text-[15px] leading-6 text-copy">
                {p.items.map((i) => (
                  <li key={i} className="flex gap-2.5"><span aria-hidden="true" className="flex-[0_0_8px] h-2 mt-[9px] rounded-full bg-orange" />{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="site-wrap mt-7 text-center">
          <p className="m-0 text-[15px] leading-[23px] text-brown">
            Free while we’re in alpha. Prices in US dollars, before tax. Need more than 1,000 people, or single sign-on?{' '}
            <Link href="/contact">Ask about Enterprise</Link>.
          </p>
        </div>
      </section>
    </SitePage>
  );
}

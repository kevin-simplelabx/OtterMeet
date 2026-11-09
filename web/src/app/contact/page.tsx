import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, Otter, SitePage } from '@/components/site/Site';
import { ContactForm } from '@/components/site/ContactForm';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Questions about a session, a bigger plan for your team, or a community you’d like to bring together? Say hello.',
  alternates: { canonical: '/contact' },
};

export default function ContactPage() {
  return (
    <SitePage>
      <section className="pt-20 pb-[104px]">
        <div className="site-wrap flex flex-wrap items-start gap-x-[72px] gap-y-12">
          <div className="flex-[1_1_340px] min-w-0 flex flex-col gap-[18px] max-w-[460px]">
            <Eyebrow>Contact</Eyebrow>
            <h1 className="site-head text-[52px] leading-[58px] tracking-[-1px] max-site:!text-[40px] max-site:!leading-[44px]">Say hello.</h1>
            <p className="m-0 text-lg leading-7 text-copy">
              Questions about a session, a bigger plan for your team, or a community you’d like to bring together. We read
              every message and reply within 2 working days.
            </p>
            <p className="m-0 text-base leading-[25px] text-brown">
              Rather use email? Write to <a href="mailto:hello@ottermeet.io">hello@ottermeet.io</a>. For quick answers, try
              the <Link href="/help">Help Centre</Link>.
            </p>
            <Otter name="otto-welcome" className="w-[150px] mt-3" />
          </div>
          <div className="flex-[1_1_460px] min-w-0 p-9 rounded-[28px] bg-white border-[1.5px] border-sand max-site:p-6">
            <ContactForm />
          </div>
        </div>
      </section>
    </SitePage>
  );
}

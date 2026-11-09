import type { Metadata } from 'next';
import { Eyebrow, H1, H2, Otter, SitePage, StartBand } from '@/components/site/Site';

export const metadata: Metadata = {
  title: 'About',
  description: 'Why we built OtterMeet: to bring people back into the same room, and make it easy for everyone to join in.',
  alternates: { canonical: '/about' },
};

const STORY = [
  'More of our work happens on screens now, with hybrid teams and AI doing more of the work. That’s useful, but it makes time together in the same room rarer, and more valuable.',
  'We think people ought to meet more often, for the human connection and the friendships that come from it. So we built OtterMeet.',
  'It brings people back into the same room, and makes it easy for everyone to join in when they get there. We’d love to see more communities form, and more people get to know each other.',
];

export default function AboutPage() {
  return (
    <SitePage>
      <section className="pt-[88px] pb-[104px]">
        <div className="site-wrap flex flex-wrap items-start gap-x-[72px] gap-y-12">
          <div className="flex-[0_1_300px] min-w-0 flex justify-center">
            <Otter name="otto-offering-paw" className="w-full max-w-[280px]" />
          </div>
          <div className="flex-[1_1_520px] min-w-0 flex flex-col gap-[22px] max-w-[720px]">
            <Eyebrow>About</Eyebrow>
            <H1 className="text-[56px] leading-[62px]">Why we built OtterMeet</H1>
            {STORY.map((p) => <p key={p} className="m-0 text-xl leading-8 text-copy-strong">{p}</p>)}
            <p className="mt-1.5 mb-0 font-sans font-bold text-[21px] text-brown">The OtterMeet team</p>
          </div>
        </div>
      </section>

      <section className="pb-[104px]">
        <div className="site-wrap">
          <div className="flex flex-wrap items-center gap-x-12 gap-y-6 px-12 py-11 rounded-[28px] bg-sand max-site:px-6 max-site:py-8">
            <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-2.5">
              <H2 size={34}>Why otters?</H2>
              <p className="m-0 text-lg leading-7 text-copy-strong">
                Sea otters rest in groups called rafts, and hold paws so nobody drifts away. That’s the feeling we want in
                every room: everyone together, nobody left out.
              </p>
            </div>
            <p className="m-0 flex-[0_1_300px] text-base leading-[25px] text-copy">
              Want to say hello, or tell us about your community? Write to <a href="mailto:hello@ottermeet.io">hello@ottermeet.io</a>.
            </p>
          </div>
        </div>
      </section>

      <StartBand title="Your next get-together starts here."
        otters={[['otto-welcome', '36%'], ['rue-ticking-notebook', '34%'], ['fin-celebrating', '28%']]} />
    </SitePage>
  );
}

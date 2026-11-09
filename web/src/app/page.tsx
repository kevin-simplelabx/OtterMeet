import type { Metadata } from 'next';
import Link from 'next/link';
import { Eyebrow, Feature, FeatureText, H2, Otter, PeekOtter, SampleBadge, Shot, SitePage, StartBand } from '@/components/site/Site';
import { HomeHero } from '@/components/site/HomeHero';

export const metadata: Metadata = {
  title: { absolute: 'OtterMeet · Get-togethers everyone joins in' },
  alternates: { canonical: '/' },
};

const INCLUDED = ['Event page', 'RSVPs and waitlist', 'Check-in', 'Games and polls', 'Q&A', 'Report', 'Follow-up email'];

const PAINS = [
  ['Five tools and a spreadsheet', 'Invites in one app, polls in another, a quiz in a third, and a sign-in sheet at the door.'],
  ['A room that stays quiet', 'The same 3 people talk. Newcomers stand at the edge. Everyone else checks their phone, for the wrong reasons.'],
  ['No idea if it worked', 'Who came, who joined in, and who’ll come back? Someone always asks, and you’re left guessing.'],
];

const AUDIENCES = [
  ['For teams', 'Town halls, offsites, learning weeks and team socials.', [
    'Groups and tables set before the day, mixed across teams',
    'Q&A that shows what people want answered',
    'A report to share with leadership',
    'Your company’s logo on every screen',
  ]],
  ['For communities', 'Meetups, workshops, book clubs and community nights.', [
    'A public organiser page people can follow',
    'RSVPs, a waitlist and check-in at the door',
    'Icebreakers that get strangers talking',
    'A passport and follow-up that bring people back',
  ]],
] as const;

// Placeholders until there are real numbers and quotes, with permission. See the tech spec, 3.7.
const SAMPLE_STATS = [
  ['[00]%', '[Sample stat] of guests took part in at least one activity'],
  ['[0,000]', '[Sample stat] people have joined a session'],
  ['[0.0] / 5', '[Sample stat] average rating from guests'],
];
const SAMPLE_QUOTES = [
  ['[Sample quote] Short line from a team host about how the offsite felt.', '[Host name], [Role], [Company]'],
  ['[Sample quote] Short line from a community organiser about people coming back.', '[Organiser name], [Community]'],
];

const FAQ = [
  ['Do people need an app or an account?', 'No. They scan the code on the big screen, or go to ottermeet.io/join and type the 4-letter room code. Logging in is optional.'],
  ['How many people can join?', 'During the alpha, up to 100 people per session. When paid plans arrive: up to 50 on Free, 200 on Team and 1,000 on Business.'],
  ['Can I use my own slides?', 'Yes. Upload a PDF, PowerPoint or Keynote deck, and your pages sit in between the games and polls.'],
  ['Can I sell tickets?', 'Not yet. Use your ticketing tool for payment, and OtterMeet for RSVPs, check-in and the room.'],
  ['Who sees people’s answers?', 'You and your co-hosts. Every form says exactly who sees it and why, and guests can remove a stamp or delete their passport at any time.'],
  ['What does it cost?', 'Nothing while we’re in alpha, and there’s no card to add. Paid plans come later, and Free stays: 3 live sessions a month and up to 50 people in each.'],
];

const ORGANIZATION_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'OtterMeet',
  url: 'https://ottermeet.io',
  logo: 'https://ottermeet.io/icon-512.png',
  email: 'hello@ottermeet.io',
  slogan: 'We otter meet.',
};

export default function Home() {
  return (
    <SitePage>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_LD) }} />
      <HomeHero />

      <section aria-label="What’s included" className="border-y border-sand bg-white">
        <div className="site-wrap flex flex-wrap justify-center items-center gap-x-7 gap-y-2.5 py-[22px] font-sans font-bold text-[15px] text-copy">
          {INCLUDED.map((item, i) => (
            <span key={item} className="contents">
              {i > 0 && <span aria-hidden="true" className="text-stone max-site:hidden">·</span>}
              <span>{item}</span>
            </span>
          ))}
        </div>
      </section>

      <section className="pt-[104px] pb-[72px]">
        <div className="site-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-3.5 max-w-[760px]">
            <Eyebrow>Sound familiar?</Eyebrow>
            <H2>You’ve been asked to run the get-together. Again.</H2>
          </div>
          <div className="grid gap-5 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
            {PAINS.map(([title, body]) => (
              <div key={title} className="p-7 rounded-[20px] bg-white border-[1.5px] border-sand flex flex-col gap-2.5">
                <h3 className="site-head text-xl leading-7">{title}</h3>
                <p className="m-0 text-base leading-[25px] text-copy">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-[72px] pb-[104px]">
        <div className="site-wrap flex flex-col gap-20">
          <div className="flex flex-col gap-3.5 max-w-[760px]">
            <Eyebrow>What you get</Eyebrow>
            <H2>One place for the whole get-together.</H2>
          </div>

          <Feature media={
            <div className="relative pb-6">
              <Shot src="screen-quiz-reveal" alt="A Speed Quiz answer reveal on the big screen." width={1100} height={619} frame="screen" className="w-[90%]" />
              <PeekOtter name="fin-stretching" className="right-[-10px] w-[22%]" />
            </div>
          }>
            <FeatureText title="Everyone joins in."
              body="Quizzes, polls, icebreakers and Q&A on the big screen, played on every phone. The quiet ones take part too, and strangers end up talking."
              link={['/room', 'See the room']} />
          </Feature>

          <Feature flip media={
            <div className="relative pb-6">
              <Shot src="app-guests" alt="The Guests tab: 70 invited, 55 going, 4 on the waitlist, and groups." width={1600} height={905} frame="app" fade className="w-[90%] ml-auto" />
              <PeekOtter name="rue-ticking-notebook" className="left-[-16px] w-[21%]" />
            </div>
          }>
            <FeatureText title="Nothing falls through the cracks."
              body="The event page, RSVPs, waitlist, groups and check-in all share one guest list. One QR code checks people in and takes them straight into the session."
              link={['/events', 'See events']} />
          </Feature>

          <Feature media={
            <div className="relative pb-6">
              <Shot src="app-report" alt="A session report: people joined, share who took part, feedback and highlights." width={1600} height={1000} frame="app" fade className="w-[90%]" />
              <PeekOtter name="rue-report-ready" className="right-[-10px] w-[19%]" />
            </div>
          }>
            <FeatureText title="Proof it worked."
              body="See who took part, not only who turned up. Feedback, highlights and questions you didn’t get to, with a follow-up email ready to send." />
          </Feature>
        </div>
      </section>

      <section className="py-24 bg-white border-y border-sand">
        <div className="site-wrap flex flex-col gap-10">
          <H2 className="max-w-[800px]">For teams who meet in person, and the communities they build.</H2>
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))]">
            {AUDIENCES.map(([title, line, items]) => (
              <div key={title} className="p-8 rounded-3xl bg-paper border-[1.5px] border-sand flex flex-col gap-3">
                <h3 className="site-head text-[26px] leading-8">{title}</h3>
                <p className="m-0 text-base leading-[25px] text-brown">{line}</p>
                <ul className="site-list">{items.map((i) => <li key={i}>{i}</li>)}</ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="What hosts say (sample)" className="pt-[104px]">
        <div className="site-wrap flex flex-col gap-7">
          <H2>Rooms that join in.</H2>
          <div className="flex flex-wrap gap-5">
            {SAMPLE_STATS.map(([stat, label]) => (
              <div key={label} className="flex-[1_1_200px] min-w-0 px-7 py-6 rounded-[20px] border-2 border-dashed border-[#d6b98f] bg-white flex flex-col gap-1.5">
                <SampleBadge />
                <span className="font-sans font-extrabold text-[44px] leading-[50px]">{stat}</span>
                <span className="text-[15px] leading-[22px] text-brown">{label}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap gap-5">
            {SAMPLE_QUOTES.map(([quote, who]) => (
              <figure key={who} className="flex-[1_1_320px] min-w-0 m-0 px-[30px] py-7 rounded-[22px] border-2 border-dashed border-[#d6b98f] bg-white flex flex-col gap-3.5">
                <SampleBadge />
                <blockquote className="m-0 text-[19px] leading-[29px] text-copy-strong">“{quote}”</blockquote>
                <figcaption className="font-sans font-bold text-[15px] text-brown">{who}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="py-[104px]">
        <div className="site-wrap flex flex-wrap-reverse items-center gap-x-16 gap-y-12">
          <div className="flex-[1_1_420px] min-w-0 flex justify-center items-end gap-6">
            <Shot src="phone-wrap-passport" alt="A phone at the end of a session: Thanks for coming, Sam, and a passport stamp with a Golden mic reward."
              width={504} height={1076} frame="phone" className="flex-[0_0_44%]" />
            <Otter name="fin-offering-pebble" className="flex-none w-[30%]" />
          </div>
          <div className="flex-[1_1_380px] min-w-0 flex flex-col gap-4">
            <Eyebrow>The OtterMeet passport</Eyebrow>
            <H2>So they come back next time.</H2>
            <p className="m-0 text-lg leading-7 text-copy">
              Every check-in and every session adds a stamp to a guest’s passport, with rewards for joining in. It works
              across every host they meet with, so coming back feels like a streak.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-[104px]">
        <div className="site-wrap">
          <div className="flex flex-wrap items-center gap-x-14 gap-y-8 px-14 py-12 rounded-[28px] bg-sand max-site:px-6 max-site:py-8">
            <Otter name="otto-offering-paw" className="flex-none w-[170px]" />
            <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-3.5 max-w-[720px]">
              <H2 size={38}>We think people ought to meet more often.</H2>
              <p className="m-0 text-lg leading-[29px] text-copy-strong">For the human connection, and the friendships that come from it. So we built OtterMeet.</p>
              <Link href="/about" className="font-sans font-bold text-base self-start">Why we built OtterMeet</Link>
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="faq-h" className="pb-[104px]">
        <div className="site-wrap flex flex-wrap gap-x-16 gap-y-8">
          <div className="flex-[1_1_280px] min-w-0 flex flex-col gap-3.5">
            <H2 id="faq-h">Questions</H2>
            <p className="m-0 text-base leading-[25px] text-brown">Something else? Write to <a href="mailto:hello@ottermeet.io">hello@ottermeet.io</a>.</p>
          </div>
          <div className="flex-[2_1_520px] min-w-0 flex flex-col border-t-[1.5px] border-sand">
            {FAQ.map(([q, a]) => (
              <details key={q} className="site-faq border-b-[1.5px] border-sand">
                <summary className="flex justify-between items-center gap-4 min-h-16 py-3.5 font-sans font-bold text-lg leading-[26px]">
                  {q}
                  <svg className="site-plus flex-none transition-transform duration-150" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1d70b8" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
                </summary>
                <p className="mt-0 mb-5 text-base leading-[26px] text-copy max-w-[640px]">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <StartBand title="Your next get-together starts here."
        body="Make your first event or session today. Everything’s included while we’re in alpha."
        otters={[['otto-welcome', '36%'], ['rue-ticking-notebook', '34%'], ['fin-celebrating', '28%']]} />
    </SitePage>
  );
}

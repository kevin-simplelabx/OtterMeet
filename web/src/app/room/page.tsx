import type { Metadata } from 'next';
import { Feature, FeatureText, FreeNote, H1, H2, Otter, PHONE, Shot, SitePage, StartBand, StartLink, Eyebrow } from '@/components/site/Site';

export const metadata: Metadata = {
  title: 'The room',
  description: 'The live part of your get-together: games, polls and Q&A on the big screen, played on every phone, run from one cockpit.',
  alternates: { canonical: '/room' },
};

const ACTIVITIES = [
  ['screen-quiz-reveal', 'Speed Quiz', 'Faster answers score more, with a leaderboard between questions.', 'A Speed Quiz answer reveal on the big screen: A raft, chosen by 18 people.'],
  ['screen-leaderboard', 'Leaderboard', 'Points, climbers and a podium at the end.', 'The quiz leaderboard after question 1.'],
  ['screen-this-or-that', 'This or That', 'The room picks a side, and the majority scores.', 'This or That results: 71% Kayak the river, 29% Picnic on the bank.'],
  ['screen-word-cloud', 'Word Cloud', 'Take the mood of the room in one word.', 'A word cloud: Excited, Caffeinated, Curious, Sleepy and more.'],
  ['screen-poll', 'Poll', 'Let the room decide, live.', 'A poll: What should we order for lunch? Ramen 40%, Salad bowls 40%, Nasi lemak 20%.'],
  ['screen-split-words', 'Split Words', 'Strangers find their other half, then their tribe.', 'Split Words on the big screen: Find your tribe, with 6 tribes gathering.'],
  ['screen-imposter', 'Imposter', 'Each table finds who has a different word.', 'Imposter results: 3 imposters caught, 3 got away.'],
  ['screen-break', 'Breaks', 'A countdown on the big screen, so everyone’s back on time.', 'A coffee break countdown: 9:57.'],
  ['screen-wrap', 'The wrap', 'The session in numbers, and a recap on every phone.', 'That’s a wrap: 86 in the raft, the champion, the top word and the lunch vote.'],
];

export default function RoomPage() {
  return (
    <SitePage dark>
      <section className="pt-20 pb-14">
        <div className="site-wrap flex flex-wrap items-center gap-x-[72px] gap-y-10">
          <div className="flex-[1_1_460px] min-w-0 flex flex-col gap-[18px]">
            <Eyebrow>The room</Eyebrow>
            <H1 className="text-[60px] leading-[64px]">The part people remember.</H1>
            <p className="m-0 text-xl leading-[31px] text-oat max-w-[580px]">
              A session is the live part of your get-together. The big screen shows everyone what’s on, every guest plays
              along on their phone, and you run it all from one cockpit.
            </p>
            <div className="flex flex-wrap items-center gap-x-[22px] gap-y-3.5 mt-1.5">
              <StartLink className="!shadow-none" />
              <FreeNote dark />
            </div>
          </div>
          <div className="flex-[0_1_400px] min-w-0 grid grid-cols-2 gap-4 relative">
            <Otter name="fin-stretching" className="absolute left-[-110px] bottom-[-20px] z-[1] w-[40%] drop-shadow-[0_10px_16px_rgba(0,0,0,0.35)] max-site:!left-[-12px] max-site:!w-[30%]" />
            <Shot src="phone-quiz" alt="A phone during a Speed Quiz, with 4 big answer buttons." {...PHONE} frame="phone-dark" />
            <Shot src="phone-joined" alt="A phone that has joined: You’re in the raft, with reactions to send." {...PHONE} frame="phone-dark" className="mt-10" />
          </div>
        </div>
      </section>

      <section aria-labelledby="act-h" className="pt-12 pb-[104px]">
        <div className="site-wrap flex flex-col gap-10">
          <div className="flex flex-col gap-3 max-w-[720px]">
            <H2 id="act-h" size={42}>Games, polls and icebreakers.</H2>
            <p className="m-0 text-lg leading-7 text-oat">Mix them in between your own slides. Reactions rain onto the big screen as people play.</p>
          </div>
          <div className="grid gap-x-7 gap-y-9 grid-cols-[repeat(auto-fit,minmax(min(320px,100%),1fr))]">
            {ACTIVITIES.map(([src, name, line, alt]) => (
              <figure key={name} className="m-0 flex flex-col gap-3.5">
                <Shot src={src} alt={alt} width={1100} height={619} frame="app" lazy className="!rounded-[14px] !border !border-paper/16 !shadow-none" />
                <figcaption className="flex flex-col gap-1">
                  <span className="font-sans font-extrabold text-[19px]">{name}</span>
                  <span className="text-[15px] leading-[23px] text-mist">{line}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* The light middle: what the host and guests get. */}
      <div className="site-light bg-paper text-navy">
        <section className="py-[104px]">
          <div className="site-wrap flex flex-col gap-24">
            <Feature media={
              <Shot src="app-cockpit" alt="The host cockpit during a Speed Quiz: the big screen, live answers, what’s up next, speaker notes and the slide list."
                width={1600} height={896} frame="app" fade />
            }>
              <FeatureText eyebrow="For the host" title="Run it all from one cockpit."
                body="See the big screen, the live answers and what’s up next in one view, with your speaker notes beside them."
                bullets={[
                  'Next, Back and Blackout from the keyboard',
                  'Q&A you approve before it reaches the screen',
                  'Co-hosts can take the controls from their own laptops',
                  'Music for arrivals, breaks and games',
                ]} />
            </Feature>

            <Feature flip media={
              <div className="grid grid-cols-3 gap-[18px]">
                <Shot src="phone-this-or-that" alt="A phone during This or That: Kayak the river, or Picnic on the bank." {...PHONE} frame="phone" lazy className="!rounded-3xl !border-[6px] !shadow-none" />
                <Shot src="phone-split-words" alt="A phone during Split Words, showing half a word and a PIN to swap." {...PHONE} frame="phone" lazy className="!rounded-3xl !border-[6px] !shadow-none" />
                <Shot src="phone-wrap-passport" alt="A phone at the end: Thanks for coming, Sam, with a recap and a passport stamp." width={504} height={1076} frame="phone" lazy className="!rounded-3xl !border-[6px] !shadow-none" />
              </div>
            }>
              <FeatureText eyebrow="For guests" title="On their phones, in seconds."
                body="People scan the code on the big screen, or type the 4-letter room code at ottermeet.io/join. No app to download, no account to make."
                bullets={[
                  'Big buttons, one question at a time',
                  'A recap of their session at the end',
                  'A full room lets newcomers wait and get in as places open',
                ]} />
            </Feature>

            <Feature mediaClass="flex-[1.3_1_480px]" media={
              <div className="relative">
                <Shot src="screen-break" alt="A coffee break countdown on the big screen: 9:57." width={1100} height={619} frame="screen" className="w-[88%] !rounded-2xl" />
                <Otter name="rue-keeping-time" className="absolute right-[-10px] bottom-[-40px] w-[24%] drop-shadow-[0_10px_14px_rgba(13,27,42,0.25)]" />
              </div>
            }>
              <Eyebrow>Before you go live</Eyebrow>
              <H2 size={42}>Calm, even when it’s live.</H2>
              <ul className="site-list !gap-2 !text-[17px] !leading-[26px]">
                <li>Rehearse with Preview: a pretend room answers and reacts for you</li>
                <li>Upload a PDF, PowerPoint or Keynote deck, and add activities in between</li>
                <li>Your theme, fonts and logo on every slide</li>
                <li>Lose the Wi-Fi for a moment and nothing is lost: phones reconnect by themselves</li>
              </ul>
            </Feature>

            <Feature flip media={
              <Shot src="app-report" alt="A session report: people joined, share who took part, reactions, questions, feedback and highlights."
                width={1600} height={1000} frame="app" fade />
            }>
              <FeatureText eyebrow="After the session" title="A report the moment it ends."
                body="Who took part on each slide, the feedback, the highlights and the questions you didn’t get to."
                bullets={[
                  'A follow-up email with your slides and links, ready to send',
                  'Share a link, or download a PDF or CSV',
                  'Contacts from everyone who asked to stay in touch',
                ]} />
            </Feature>
          </div>
        </section>
      </div>

      <StartBand title="Your next session starts here."
        body="Make your first session today. Everything’s included while we’re in alpha."
        otters={[['otto-celebrating', '38%'], ['fin-juggling', '36%']]} />
    </SitePage>
  );
}

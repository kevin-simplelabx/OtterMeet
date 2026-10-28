import { AnnouncePill, Button, Icon, PebbleBadge, WaveDivider, WaveUnderline, type IconName } from '@/ds';
import { SiteHeader, Wordmark } from '@/components/SiteHeader';

// One playful line per game: sell the fun, not the mechanics.
const GAMES: { icon: IconName; name: string; line: string; live: boolean }[] = [
  { icon: 'people', name: 'Lobby & Emoji Shower', live: true, line: 'Make a splash before the first slide.' },
  { icon: 'raft', name: 'Split Words & Tribes', live: true, line: 'Find your other half and hold paws, otter-style.' },
  { icon: 'search', name: 'Imposter', live: true, line: 'One of you is a mink in otter’s clothing. Sniff them out.' },
  { icon: 'compass', name: 'This or That', live: true, line: 'Pick a riverbank. Nobody gets to sit on the log.' },
  { icon: 'wave', name: 'Word Cloud & Polls', live: true, line: 'Hear the whole raft at once, not just the loudest otter.' },
  { icon: 'clock', name: 'Speed Quiz', live: true, line: 'Fastest paws take the podium. Slow pokes get splashed.' },
  { icon: 'easel', name: 'Town Hall Q&A', live: true, line: 'Ask the big fish anything. The raft votes up the best.' },
  { icon: 'check', name: 'Private Feedback', live: true, line: 'Find out what landed before everyone swims off.' },
];

const STEPS = [
  ['01 • Plan', 'Shape the day in minutes.', 'Line up the moments you want, from the welcome to the wrap. No slide decks to wrangle, no tools to stitch together.'],
  ['02 • Welcome', 'Let people walk straight in.', 'One QR code at the door works all day. No app to download, no account to make, no lost links.'],
  ['03 • Run it', 'Stay with your audience.', 'Your presentation clicker moves the whole room along, so you keep your eyes on people, not a laptop.'],
];

const OUTCOMES: { icon: IconName; title: string; body: string }[] = [
  { icon: 'people', title: 'Everyone takes part', body: 'Not just the front row.' },
  { icon: 'raft', title: 'People mix', body: 'New faces, not the same old cliques.' },
  { icon: 'easel', title: 'You hear the truth', body: 'Honest questions and feedback, in the room.' },
];

export default function Landing() {
  return (
    <div>
      <SiteHeader />

      <main>
        <section className="wrap flex flex-wrap items-center gap-12 pt-12 pb-16">
          <div className="flex-[1_1_480px] min-w-0 flex flex-col items-start gap-6">
            <AnnouncePill href="#games">Built for rooms of 100+</AnnouncePill>
            <h1 className="hero m-0 max-sm:!text-5xl">We <WaveUnderline>otter</WaveUnderline> meet.</h1>
            <p className="body-lg m-0 text-ink-muted max-w-[540px]">
              Big rooms go quiet. The same few people speak while everyone else checks their phone. OtterMeet turns
              that phone into a way in, so your offsite, town hall or workshop feels like one room, not a hundred
              people sitting near each other.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="action" size="lg" iconEnd="arrow-right" href="/signup">Plan My First Event</Button>
              <Button variant="quiet" size="lg" href="#games">See What It Does</Button>
            </div>
            <p className="body-sm m-0 text-ink-muted">Free while we are in early access. No card needed. Attendees never need an app.</p>
          </div>

          <div className="flex-[1_1_400px] min-w-0">
            <div className="bg-surface-card border border-border rounded-xl shadow-float p-6 flex flex-col gap-6">
              <div className="h-56 max-sm:h-44 rounded-lg bg-surface-fill border border-dashed border-border-strong flex items-center justify-center p-6 text-center">
                <span className="body-sm text-ink-muted">[Otto illustration: a packed hall, every hand up, phones glowing like lanterns]</span>
              </div>
              <ul className="list-none m-0 p-0 grid gap-4 grid-cols-[repeat(auto-fit,minmax(150px,1fr))]">
                {OUTCOMES.map((o) => (
                  <li key={o.title} className="flex flex-col gap-2">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-accent-soft text-accent"><Icon name={o.icon} size={20} /></span>
                    <span className="title">{o.title}</span>
                    <span className="body-sm text-ink-muted">{o.body}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <div className="wrap"><WaveDivider tone="accent" /></div>

        <section id="games" className="wrap py-16 flex flex-col gap-10">
          <div className="flex flex-col gap-3 max-w-[720px]">
            <span className="eyebrow text-ink-muted">What your room gets</span>
            <h2 className="display m-0 max-sm:!text-[34px] max-sm:!leading-10">The moments people talk about on the way home.</h2>
            <p className="body-lg m-0 text-ink-muted">
              Every activity is built for one job: getting a big group to open up, mix and remember. Pick the moments
              your day needs.
            </p>
          </div>
          <div className="grid gap-6 grid-cols-[repeat(auto-fill,minmax(280px,1fr))]">
            {GAMES.map((g) => (
              <article key={g.name} className="bg-surface-card border border-border rounded-lg shadow-card p-6 flex flex-col items-start gap-3">
                <div className="flex justify-between w-full gap-3 mb-2">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-soft text-accent"><Icon name={g.icon} size={24} /></span>
                  {g.live
                    ? <PebbleBadge tone="success" icon="check">Live now</PebbleBadge>
                    : <PebbleBadge tone="neutral">On the way</PebbleBadge>}
                </div>
                <h3 className="title m-0">{g.name}</h3>
                <p className="body-lg m-0 text-ink-muted">{g.line}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="wrap"><WaveDivider /></div>

        <section id="how" className="wrap py-16 flex flex-col gap-10">
          <div className="flex flex-col gap-3 max-w-[720px]">
            <span className="eyebrow text-ink-muted">How it works</span>
            <h2 className="display m-0 max-sm:!text-[34px] max-sm:!leading-10">Less wrangling, more room.</h2>
          </div>
          <div className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
            {STEPS.map(([eyebrow, title, body]) => (
              <div key={eyebrow} className="flex flex-col gap-3">
                <span className="eyebrow text-ink-muted">{eyebrow}</span>
                <h3 className="title m-0">{title}</h3>
                <p className="body m-0 text-ink-muted">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="wrap"><WaveDivider /></div>

        <section id="screens" className="wrap py-16 grid gap-6 grid-cols-[repeat(auto-fit,minmax(300px,1fr))]">
          {[
            ['easel', 'You stay in command', 'Move the whole room on with the clicker already in your hand. No fumbling between apps while 150 people wait.'],
            ['cabin', 'The big screen looks like a show', 'Your audience sees the moment, never a settings page, a login or an admin menu.'],
            ['people', 'Nobody gets left at the door', 'Scan, pick a name, play. If a phone locks or the Wi-Fi drops, people land right back where they were.'],
          ].map(([icon, title, body]) => (
            <div key={title} className="flex gap-4 items-start">
              <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-soft text-accent flex-none"><Icon name={icon as IconName} size={24} /></span>
              <div className="flex flex-col gap-2">
                <h3 className="title m-0">{title}</h3>
                <p className="body m-0 text-ink-muted">{body}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="wrap pb-16">
          <div data-theme="dark" className="flex flex-wrap items-center justify-between gap-x-12 gap-y-8 p-[clamp(32px,6vw,64px)] bg-surface text-ink rounded-xl shadow-float">
            <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-4">
              <span className="eyebrow text-ink-muted">Offsites • Town halls • Workshops • Hackathons</span>
              <h2 className="display m-0 max-sm:!text-[34px] max-sm:!leading-10">Give your next event a room that talks back.</h2>
              <p className="body-lg m-0 text-ink-muted">Plan it tonight, run it tomorrow. Free while we are in early access.</p>
            </div>
            <Button variant="action" size="lg" iconEnd="arrow-right" href="/signup">Plan My First Event</Button>
          </div>
        </section>
      </main>

      <footer className="wrap">
        <WaveDivider />
        <div className="flex flex-wrap justify-between gap-x-12 gap-y-8 pt-10 pb-12">
          <div className="flex flex-col gap-3 max-w-[360px]">
            <Wordmark />
            <p className="body-sm m-0 text-ink-muted">Live games and Q&amp;A for workshops, town halls and offsites of 100+.</p>
            <p className="meta m-0 mt-4 text-ink-muted">© 2026 OtterMeet</p>
          </div>
          <nav aria-label="Footer" className="flex flex-col">
            <span className="eyebrow text-ink-muted mb-1">Hosts</span>
            {[['/signup', 'Create Account'], ['/login', 'Log In'], ['/join', 'Join a Room']].map(([href, label]) => (
              <a key={href} href={href} className="body-sm py-3 !text-ink no-underline">{label}</a>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  );
}

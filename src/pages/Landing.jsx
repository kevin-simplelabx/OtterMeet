import { useAuth } from '../App.jsx';
import {
  AnnouncePill, Button, CrewNote, EmptyState, Icon, KelpTimeline, PebbleBadge, WaveDivider, WaveUnderline,
} from '../ds/index.js';

const TOOLS = [
  {
    icon: 'calendar', name: 'Session Builder', live: true,
    body: 'Set the title, start time, run-time and format for each session. In person, online or hybrid, with the room or the link right where people need it.',
  },
  {
    icon: 'clock', name: 'Kelp Timeline', live: true,
    body: 'Every upcoming session moored in order on one timeline, so you can see the whole week at a glance and spot the gaps before your guests do.',
  },
  {
    icon: 'people', name: 'Seat Limits', live: true,
    body: 'Cap each session at the size the room can hold. A 12-person workshop stays a 12-person workshop.',
  },
  {
    icon: 'check', name: 'Drafts & Publishing', live: true,
    body: 'Keep sessions as drafts while you plan, publish them when they are ready, and mark them cancelled without losing the details.',
  },
  {
    icon: 'raft', name: 'Linked Raft RSVPs', live: false,
    body: 'Guests grab a paw to claim a spot, and you see who is in the raft for every session, with seats claimed against capacity.',
  },
  {
    icon: 'compass', name: 'Venue Scouting', live: false,
    body: 'Marlo lines up cabins, barns and sunlit lofts that fit your dates and group size, ready to attach to a session.',
  },
];

const PREVIEW_AGENDA = [
  {
    label: 'Thu, Nov 12',
    items: [
      { time: '09:30', title: 'Facilitation Fundamentals', detail: 'Studio loft · 90 min · 12 seats', status: 'done' },
      { time: '14:00', title: 'Retro Clinic', detail: 'Online · 60 min', status: 'now' },
    ],
  },
  {
    label: 'Sat, Nov 14',
    items: [
      { time: '10:00', title: 'Roadmap Workshop', detail: 'Main hall · 2 h · 24 seats', badge: 'Draft' },
    ],
  },
];

export default function Landing() {
  const { host } = useAuth();
  const signedIn = Boolean(host);

  return (
    <div>
      <header className="wrap site-head">
        <a href="/" className="wordmark">OtterMeet</a>
        <nav aria-label="Main" className="site-nav">
          <a href="#tools" className="label">Host Tools</a>
          <a href="#how" className="label">How It Works</a>
          <a href="#gatherings" className="label">Gatherings</a>
        </nav>
        <div className="row" style={{ gap: 12 }}>
          {signedIn ? (
            <Button variant="accent" size="sm" href="/portal">Open Host Portal</Button>
          ) : (
            <>
              <Button variant="quiet" size="sm" href="/login">Log In</Button>
              <Button variant="accent" size="sm" href="/signup">Start Hosting</Button>
            </>
          )}
        </div>
      </header>

      <main>
        <section className="wrap hero-grid">
          <div className="hero-copy">
            <AnnouncePill href="#tools">Host tools are open for early hosts</AnnouncePill>
            <h1 className="hero m0">We <WaveUnderline>otter</WaveUnderline> meet.</h1>
            <p className="body-lg m0 muted" style={{ maxWidth: 520 }}>
              OtterMeet gives hosts of workshops, team offsites and community gatherings one calm place to plan
              sessions, keep timings honest and get ready for the people coming.
            </p>
            <div className="row" style={{ gap: 12 }}>
              <Button variant="action" size="lg" iconEnd="arrow-right" href={signedIn ? '/portal' : '/signup'}>
                {signedIn ? 'Open Host Portal' : 'Create Host Account'}
              </Button>
              <Button variant="quiet" size="lg" href="#tools">See the Tools</Button>
            </div>
            <p className="body-sm m0 muted">Free while we are in early access. No card needed.</p>
          </div>

          <div className="hero-art">
            <div className="card stack" style={{ gap: 20, padding: 24, borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-float)' }}>
              <div className="row" style={{ justifyContent: 'space-between', gap: 12 }}>
                <div className="stack" style={{ gap: 4 }}>
                  <span className="eyebrow muted">Host portal preview</span>
                  <span className="heading-3">Your sessions</span>
                </div>
                <PebbleBadge tone="accent" icon="calendar">3 this week</PebbleBadge>
              </div>
              <KelpTimeline days={PREVIEW_AGENDA} />
              <CrewNote character="otto">Otto checked your schedule: 0 clashes!</CrewNote>
            </div>
          </div>
        </section>

        <div className="wrap"><WaveDivider tone="accent" /></div>

        <section id="tools" className="wrap band stack" style={{ gap: 40 }}>
          <div className="stack" style={{ gap: 12, maxWidth: 720 }}>
            <span className="eyebrow muted">Tools for hosts</span>
            <h2 className="display m0">Everything you need to run the room.</h2>
            <p className="body-lg m0 muted">
              Built for gatherings of 15 to 50, not conference halls of thousands. Four tools are live in the host
              portal today; the rest are on the way.
            </p>
          </div>
          <div className="tool-grid">
            {TOOLS.map((t) => (
              <article key={t.name} className="card tool">
                <div className="row" style={{ justifyContent: 'space-between', width: '100%', gap: 12, marginBottom: 8 }}>
                  <span className="icon-disc"><Icon name={t.icon} size={24} /></span>
                  {t.live
                    ? <PebbleBadge tone="success" icon="check">Live now</PebbleBadge>
                    : <PebbleBadge tone="neutral">On the way</PebbleBadge>}
                </div>
                <h3 className="title m0">{t.name}</h3>
                <p className="body m0 muted">{t.body}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="wrap"><WaveDivider /></div>

        <section id="how" className="wrap band stack" style={{ gap: 40 }}>
          <div className="stack" style={{ gap: 12, maxWidth: 720 }}>
            <span className="eyebrow muted">How it works</span>
            <h2 className="display m0">From first idea to full raft.</h2>
          </div>
          <div className="steps">
            {[
              ['01 • Sign up', 'Create your host account.', 'A name, an email and a password. You land straight in your host portal.'],
              ['02 • Plan', 'Draft your sessions.', 'Add times, run-times, rooms or links and seat limits. Edit and duplicate as the plan takes shape.'],
              ['03 • Publish', 'Go live when you are ready.', 'Flip a session from draft to published. Cancel one and its details stay on file.'],
            ].map(([eyebrow, title, body]) => (
              <div key={eyebrow} className="stack" style={{ gap: 12 }}>
                <span className="eyebrow muted">{eyebrow}</span>
                <h3 className="title m0">{title}</h3>
                <p className="body m0 muted">{body}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="wrap"><WaveDivider /></div>

        <section id="gatherings" className="wrap band" style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: 560, width: '100%' }}>
            <EmptyState
              title="No public gatherings yet."
              illustrationLabel="[Marlo illustration: scouting the river bank with a brass compass]"
              actions={!signedIn && <Button variant="quiet" href="/signup">Draft a Session</Button>}
            >
              Public event listings open soon. Hosts can start planning sessions now, so they are ready the moment
              discovery goes live.
            </EmptyState>
          </div>
        </section>

        <section className="wrap" style={{ paddingBottom: 'var(--space-16)' }}>
          <div className="cta-band" data-theme="dark">
            <div className="stack" style={{ flex: '1 1 420px', minWidth: 0, gap: 16 }}>
              <span className="eyebrow muted">Workshops • Offsites • Meetups</span>
              <h2 className="display m0">Plan your first session today.</h2>
              <p className="body-lg m0 muted">Your host portal is ready as soon as you sign up.</p>
            </div>
            <Button variant="action" size="lg" iconEnd="arrow-right" href={signedIn ? '/portal' : '/signup'}>
              {signedIn ? 'Open Host Portal' : 'Create Host Account'}
            </Button>
          </div>
        </section>
      </main>

      <footer className="wrap">
        <WaveDivider />
        <div className="footer-cols">
          <div className="stack" style={{ gap: 12, maxWidth: 360 }}>
            <span className="wordmark" style={{ padding: 0 }}>OtterMeet</span>
            <p className="body-sm m0 muted">Tools for hosts of workshops, team offsites and intentional gatherings.</p>
            <p className="meta muted" style={{ margin: '16px 0 0' }}>© 2026 OtterMeet</p>
          </div>
          <nav aria-label="Footer" className="stack">
            <span className="eyebrow muted" style={{ marginBottom: 4 }}>Hosts</span>
            <a href="/signup" className="body-sm">Create Account</a>
            <a href="/login" className="body-sm">Log In</a>
            <a href="#tools" className="body-sm">Host Tools</a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

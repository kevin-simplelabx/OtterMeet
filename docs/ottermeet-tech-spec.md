# OtterMeet technical spec: Rails API and Next.js

For Claude Code, or any engineer, building OtterMeet from this project. Written 9 Nov 2026.

Read it with:

- **What each screen does:** the prototype (https://claude.ai/artifact/4W6uWFtB4d24xCFcU5YxLM) and the product spec (`claude/slide-customisation-spec.md`).
- **How live data and files must move:** `claude/hosting-cost-instructions.md` (the 12 cost rules). This spec doesn't repeat them; where they apply, it points to them.
- **Words on screen:** `claude/voice-guide.md`.
- **The marketing website:** the website canvas (https://claude.ai/artifact/RXKvHPaM7vYK2g3Rj3zbxe).

Where this spec says **Proposed**, it's a sensible default that nobody has signed off yet. Everything else follows decisions already in the product spec.

## 1. The stack

| Part | Choice | Notes |
| --- | --- | --- |
| Every screen | **Next.js** (App Router, TypeScript) on **Vercel** | Website, host app, cockpit, big screen and phone app, in one Next.js app split by route |
| API | **Rails 8**, API-only | JSON over HTTPS, plus Action Cable |
| Realtime | **Action Cable** with **Solid Cable** | No Redis (cost rule 1) |
| Database | **Postgres 16** | Primary database, plus a `cable` database for Solid Cable on the same server |
| Background jobs | **Solid Queue** | Uploads processing, emails, reports, reminders |
| Cache | **Solid Cache** | No Redis anywhere |
| File storage | **Active Storage** on **Cloudflare R2** | Direct uploads, preprocessed variants, CDN domain (cost rules 9 to 12) |
| Image processing | `image_processing` with libvips | Slides from PDF, PowerPoint and Keynote need a converter job (**Proposed:** LibreOffice headless for PowerPoint and Keynote to PDF, then pdftoppm or libvips per page) |
| Email | Action Mailer with a transactional provider | **Proposed:** Postmark or Resend |
| Sign-in | Email and password, or Google | No 2-step in the alpha |
| Rails hosting | **Proposed:** Fly.io or Render, Singapore region | Close to the first users |
| Postgres hosting | **Proposed:** a managed Postgres in Singapore (Neon, Crunchy Bridge or the Rails host's own) | |
| Payments | Not in the alpha | **Proposed:** Stripe Billing when paid plans open |

### Domains (Proposed)

| Domain | Serves |
| --- | --- |
| `ottermeet.io` | Next.js: the website, `/join`, the phone app and the host app |
| `api.ottermeet.io` | Rails API and the Action Cable socket (`wss://api.ottermeet.io/cable`) |
| `cdn.ottermeet.io` | The R2 bucket for public session assets |

Putting the API on a subdomain of the same site lets the host's session cookie be first-party (`Domain=.ottermeet.io`, `SameSite=Lax`, `Secure`, `HttpOnly`).

## 2. Repository layout (Proposed)

One repository, 2 apps:

```
ottermeet/
  apps/
    web/            Next.js (Vercel)
    api/            Rails 8 API
  packages/
    live-protocol/  Message types shared by web and api tests (TypeScript types + JSON fixtures)
  docs/             This spec, the cost rules, the product spec, the voice guide
  README.md
```

`live-protocol` holds the short message envelopes from cost rule 7 (`{"t":"step",...}`), so both sides agree on them. Rails checks its broadcasts against the JSON fixtures in its tests.

## 3. Next.js app

### 3.1 Routes

Route groups keep each audience's code apart, so a phone downloads only the phone app (cost rule 10).

| Route | Who | Rendering | From the prototype or canvas |
| --- | --- | --- | --- |
| `/` | Everyone | Static | Website: Home |
| `/room`, `/events`, `/about`, `/contact`, `/help`, `/help/[slug]` | Everyone | Static (help from MDX or JSON at build time) | Website pages |
| `/privacy`, `/terms` | Everyone | Static | Drafts. Lawyer review before launch |
| `/pricing` | Hidden at launch | Static, behind a flag | Website: Pricing |
| `/explore`, `/explore/[eventSlug]` | Hidden at launch | Server-rendered, cached | Website: Explore |
| `/o/[orgSlug]` | Everyone | Server-rendered, cached | Organiser page |
| `/e/[eventSlug]` | Guests | Server-rendered | Event page and RSVP |
| `/join` | Attendees | Static shell | Website: Join a session |
| `/j/[code]` | Attendees (QR target) | Redirects to `/live/[code]` | |
| `/live/[code]` | Attendees | Client app | Prototype: phone screens |
| `/screen/[code]` | Big screen | Client app | Prototype: big screen |
| `/start`, `/login`, `/reset`, `/verify` | Hosts | Static shell | Website: Start Free, Log In |
| `/app/...` | Signed-in hosts | Client app | Prototype: sessions, events, editor, reports, account |
| `/app/cockpit/[sessionId]` | Host and co-hosts | Client app | Prototype: cockpit |
| `not-found.tsx` | Everyone | Static | Website: 404 page |

### 3.2 Feature flags

Explore and Pricing are built but hidden at launch. Use one env var per flag (`NEXT_PUBLIC_SHOW_EXPLORE`, `NEXT_PUBLIC_SHOW_PRICING`):

- Off: the route returns the 404 page, and the page isn't in the menu, footer or sitemap.
- On: the route works, and the links appear.

### 3.3 Styling and fonts

- Fonts: **Plus Jakarta Sans** (500, 700, 800) for headings and buttons, **Inter** (400, 500, 600) for text. Load them with `next/font/google`, so they're self-hosted with the build. No Fraunces anywhere.
- The slide font choices in the editor ship as WOFF2 from Vercel (cost rule 8). "Friendly" is Nunito.
- Colours (from the canvas):

  | Token | Value | Use |
  | --- | --- | --- |
  | `--ink` | `#0d1b2a` | Text, dark sections |
  | `--paper` | `#faf7f2` | Page background |
  | `--sand` | `#e8d8c3` | Borders, soft panels |
  | `--orange` | `#e58a13` | Main buttons |
  | `--link` | `#1d70b8` | Links (`#8cc1ec` on dark) |
  | `--brown` | `#6b4e3d` | Secondary text |

- Links have no underline; links inside running text are bold. Main buttons are pills in title case ("Start Free").
- Breakpoint at 760 px: the main menu hides, "Join a session" shortens to "Join", padding drops to 16 px. Every page was checked at 390 px with no sideways scroll.
- **Proposed:** Tailwind with these tokens, or CSS Modules. Either is fine; pick one.

### 3.4 Talking to Rails

- REST calls with `fetch` and `credentials: "include"`. **Proposed:** TanStack Query on the client.
- Action Cable from `@rails/actioncable`, one consumer per screen.
- On connect or reconnect, fetch the full state once (`GET /api/live/:code/state`), then apply numbered deltas (cost rule 7).
- Timers count down on the device from `ends` and the server's `now` (cost rule 4).

### 3.5 The phone app

- No account. On joining, Rails returns an attendee token (signed, scoped to that live session). Keep it in `sessionStorage` and a cookie, so a reload or a dropped connection rejoins as the same person.
- Phones never load slides, backgrounds, videos or custom fonts (cost rule 10).
- Reactions show on the phone straight away and are batched once a second (once every 2 seconds on Free) (cost rule 2).

### 3.6 Website: SEO and sharing

- **Titles and descriptions:** each page sets `metadata` (title "Page · OtterMeet", a description under 160 characters).
- **Share image:** export the canvas board "Share image (1200 × 630)" as `public/og.png` and set it as `openGraph.images` and `twitter.images` (`summary_large_image`) for every page. Event and organiser pages can generate their own with `next/og` later.
- **Favicon and app icons (done 9 Nov 2026):** Otto's head and neckerchief on the orange. Put them in `apps/web/app/` so Next.js adds the tags itself: `favicon.ico` (16, 32 and 48 px, a tighter face crop so it reads in a tab), `icon.svg`, `apple-icon.png` (180 px, square; iOS rounds it). In `public/`: `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` (otter inside the safe zone, for Android) and `manifest.webmanifest` (theme colour `#e58a13`). `icon-1024.png` and `icon-rounded-1024.png` are masters for app stores and social profiles.
- **`sitemap.ts`:** the public pages only. Leave out Explore and Pricing while they're hidden, and never list `/app`, `/live`, `/screen` or `/join`.
- **`robots.ts`:** allow the website, disallow `/app`, `/live`, `/screen`, `/api`.
- **Canonical URLs** on every page, on `https://ottermeet.io`.
- **Structured data:** `Organization` on Home. `Event` JSON-LD on public event pages when Explore opens.
- **Analytics (Proposed):** a cookie-free tool (Plausible or Vercel Web Analytics), so no consent banner is needed. If a cookie-based tool is added, ask first, under PDPA.

### 3.7 Website content still to replace before launch

- **Proof on Home:** the stats and quotes are labelled placeholders ("Sample · replace before launch"). Replace them with real numbers and real quotes, with the person's permission, or remove the section.
- **Privacy and Terms:** drafts. They need the company name, date, DPO contact and a lawyer's review.
- **Contact form:** posts to `POST /api/contact_messages`. Rails emails the team and saves the message.

## 4. Rails API

### 4.1 Setup

```bash
rails new api --api --database=postgresql --skip-test   # RSpec (Proposed) or keep Minitest
bundle add solid_cable solid_queue solid_cache image_processing aws-sdk-s3 \
  omniauth-google-oauth2 omniauth-rails_csrf_protection rack-cors rack-attack
```

- `config/cable.yml`: Solid Cable as in cost rule 1.
- `config/storage.yml`: R2 (S3-compatible, region `auto`). Direct uploads on.
- CORS: allow `https://ottermeet.io` (and Vercel preview URLs in staging) with credentials.
- `rack-attack`: limit sign-in, password reset, email-code, join and contact requests.

### 4.2 Sign-in

- **Hosts:** Rails 8's built-in authentication (`bin/rails generate authentication`) for email and password, with an `HttpOnly` session cookie. Google through OmniAuth. Email verification and password reset links last 1 hour.
- **Team invites:** a signed invite token. The invited email is fixed on the join page.
- **Attendees:** no account. `POST /api/live/:code/attendees` with a nickname returns an attendee token.
- **Event guests:** RSVP from a link confirms the email with a 6-digit code.
- Only people 18 and over may make an account (Terms).

### 4.3 Data model

The main tables. Use `jsonb` for per-type settings that the prototype keeps in one object.

**Accounts and plans**

| Table | Key columns |
| --- | --- |
| `organisations` | name, slug, plan (`alpha`, `free`, `team`, `business`, `enterprise`), logo, accent colour, `storage_bytes_used`, reserved room code |
| `users` | name, email, password_digest, google_uid, job_title, time_zone, photo |
| `memberships` | organisation, user, owner?, admin?, status (active, invited) |
| `invitations` | organisation, email, inviter, token, note, accepted_at |
| `host_levels` | user, level, qualifying_sessions, stars, picks (`jsonb`) |

**Events**

| Table | Key columns |
| --- | --- |
| `events` | organisation, name, slug, description, cover, starts_at, ends_at, time_zone, venue, address, online_url, wifi (`jsonb`), visibility (public, link, company, invite), status, guest_limit, when_full (waitlist, closed), registration_closes_at, show_guests (names, count, nothing), tags (up to 3) |
| `agenda_items` | event, title, starts_at, ends_at, place, session (nullable) |
| `registration_questions` | event, kind, label, required?, position |
| `guests` | event, name, email, team, status (invited, going, waitlist, cant_go, no_answer, removed), show_name?, answers (`jsonb`), check_in_code, checked_in_at |
| `organiser_pages` | organisation, slug, image, about, website |
| `follows` | organiser_page, email, confirmed_at |

**Sessions and slides**

| Table | Key columns |
| --- | --- |
| `sessions` | organisation, event (nullable: a standalone session), name, host (user), co_hosts, theme (`jsonb`), room_limit, breakouts (`jsonb`) |
| `slides` | session, position, kind (lobby, deck page, quiz, poll, word cloud, this or that, split words, imposter, Q&A, break, wrap, …), settings (`jsonb`), hidden? |
| Active Storage | Decks, pages, backgrounds, videos, logos, reaction packs, answer pictures, profile photos. Variants as in cost rule 11 |

**Live**

| Table | Key columns |
| --- | --- |
| `live_runs` | session, room_code (4 letters, or the organisation's reserved 4 to 6), status (lobby, live, paused, ended), current_slide, started_at, ended_at, controller (host or co-host) |
| `attendees` | live_run, nickname, avatar, guest (nullable, when they checked in at an event), connected_at, last_seen_at, removed_at, contact_opt_in |
| `responses` | live_run, slide, attendee, value (`jsonb`), answered_at, points |
| `reaction_totals` | live_run, slide, attendee (nullable for room totals), counts (`jsonb`) — written every 5 seconds, never per tap |
| `qa_questions`, `qa_votes` | live_run, attendee, text, status (waiting, approved, answered, hidden), votes |
| `feedback` | live_run, attendee, rating, comment |

**After**

| Table | Key columns |
| --- | --- |
| `reports` | live_run or event, summary (`jsonb`), shared_token, expires_at (by plan: 30 days, 12 months, 3 years) |
| `passports`, `stamps` | email or attendee identity, event or live_run, reward |
| `follow_up_emails` | report, subject, body, send_at, sent_at |
| `contact_messages` | name, email, topic, message (website Contact form) |

### 4.4 Plan limits

Keep every limit in one place (`app/models/plan.rb`) and read it from there, in both Rails and the host app (`GET /api/plan`).

| | Free | Team | Business |
| --- | --- | --- | --- |
| Price (Proposed) | $0 | $19 per host a month, billed yearly | $39 per host a month, billed yearly |
| Live sessions | 3 a month | No monthly limit | No monthly limit |
| Live at once | 1 | 4, or 2 per host if more | 10, or 5 per host if more |
| People per session | 50 | 200 | 1,000 |
| Games | 5 | 10 | All |
| Reports and attachments kept | 30 days | 12 months | 3 years |
| Storage | 100 MB | 2 GB per host, shared | 5 GB per host, shared |
| Deck upload | 10 MB | 50 MB | 100 MB |
| Background photo | 5 MB | 10 MB | 20 MB |
| Picture (answers, reactions, logo) | 2 MB | 5 MB | 10 MB |
| Background video | No | 15 MB | 40 MB |
| Other files | 5 MB | 10 MB | 25 MB |

- The alpha runs everyone on one Alpha plan: everything included, up to 100 people per session.
- A live session ends itself after 4 hours, with a warning 15 minutes before and Keep Going to add an hour.
- At the storage limit, uploads stop with an upgrade prompt; nothing is deleted (Proposed in the product spec).

### 4.5 Endpoints (outline)

All under `/api`. JSON in and out.

| Area | Endpoints |
| --- | --- |
| Auth | `POST /session`, `DELETE /session`, `POST /signups`, `POST /passwords`, `PATCH /passwords/:token`, `GET /auth/google/callback`, `POST /email_verifications/:token` |
| Account | `GET /me`, `PATCH /me`, `GET /organisation`, `PATCH /organisation`, `GET/POST/DELETE /invitations`, `GET /plan` |
| Uploads | `POST /rails/active_storage/direct_uploads` (checks plan limits and storage first) |
| Sessions | `GET/POST /sessions`, `GET/PATCH/DELETE /sessions/:id`, `POST /sessions/:id/slides`, `PATCH /slides/:id`, `POST /sessions/:id/slides/reorder` |
| Going live | `POST /sessions/:id/live_runs` (gets a room code; checks live-at-once and monthly limits), `PATCH /live_runs/:id` (next, previous, blackout, pause, end, give controls) |
| Joining | `GET /live/:code` (session name, status, full or not), `POST /live/:code/attendees`, `GET /live/:code/state` |
| Playing | `POST /live/:code/responses`, `POST /live/:code/qa_questions`, `POST /qa_questions/:id/votes`, `POST /live/:code/feedback` (reactions go over the socket) |
| Events | `GET/POST /events`, `PATCH /events/:id`, `POST /events/:id/post`, `GET/POST /events/:id/guests`, `POST /events/:id/guests/import`, `POST /events/:id/invites`, `POST /events/:id/check_ins` |
| Public events | `GET /public/events` (Explore), `GET /public/events/:slug`, `POST /public/events/:slug/rsvps`, `POST /public/rsvps/:id/confirm` (6-digit code), `GET /public/organisers/:slug`, `POST /public/organisers/:slug/follows` |
| Reports | `GET /reports/:id`, `GET /reports/:id.pdf`, `GET /reports/:id/attendees.csv`, `POST /reports/:id/share`, `POST /reports/:id/follow_up` |
| Website | `POST /contact_messages` |

### 4.6 Action Cable

Follow the stream design and rules 1 to 7 in `hosting-cost-instructions.md` exactly:

- `LiveStageChannel` → `session:<id>:stage` (big screen)
- `LiveHostChannel` → `session:<id>:host` (host and up to 2 co-hosts; checks the user)
- `LiveRoomChannel` → `session:<id>:room` (every phone)
- `AttendeeChannel` → `attendee:<id>` (one phone; checks the attendee token)

Phones send actions with `perform` (or plain POSTs). The server never echoes one phone's action to the other phones.

### 4.7 Background jobs

| Job | When |
| --- | --- |
| `RenderDeckJob` | After a deck upload: convert to pages, make the 1920 px and 480 px versions, update storage used |
| `FlushReactionTotalsJob` | Every 5 seconds during a live run, and at each slide change |
| `TrailingCountBroadcastJob` | 250 ms after a throttled count update (cost rule 6) |
| `BuildReportJob` | When a live run ends |
| `SendInvitesJob`, `EventReminderJob`, `EventChangeJob` | Event emails |
| `SendFollowUpJob` | At the time the host picked |
| `AutoEndLiveRunJob` | 15 minutes before and at the 4-hour limit |
| `PurgeExpiredJob` | Daily: reports, attachments and answers past their plan's retention; answers the host chose to delete |
| `HostLevelJob` | When a live run ends: counts it if it had 20 or more people, ran 45 minutes or more, and is one of the host's first 2 that month |

### 4.8 Emails

Written in the OtterMeet voice. From `hello@ottermeet.io` (Proposed), with SPF, DKIM and DMARC set up for the sending provider.

- Account: verify email, reset password, team invite, email changed.
- Events: invite, RSVP confirmation (with check-in QR, calendar file and Wi-Fi), waitlist place, reminder, change or cancel, follow-up.
- Sessions: report ready, follow-up email to attendees.
- Website: contact message to the team, and a short "we got it" reply.

### 4.9 Privacy and security

- Singapore company; PDPA applies. Minimum age 18 for accounts.
- Attendees give a nickname only; the big screen shows only the nickname.
- Reports, CSVs, PDFs and contact exports go through signed, short-lived URLs with `Cache-Control: private, no-store` (cost rule 12).
- Delete on request: an account, a guest, or an attendee's answers.
- Retention by plan, enforced by `PurgeExpiredJob`.
- Sanitise uploaded SVGs. Check file types by content, not by name.

## 5. Environments

| | Web | API | Database | Storage |
| --- | --- | --- | --- | --- |
| Local | `next dev` on :3000 | `bin/rails s` on :4000 | Local Postgres | Local disk, or an R2 dev bucket |
| Staging (Proposed) | Vercel preview | `staging-api.ottermeet.io` | Staging Postgres | R2 staging bucket |
| Production | `ottermeet.io` | `api.ottermeet.io` | Managed Postgres, Singapore | R2 + `cdn.ottermeet.io` |

Secrets go in Rails credentials and Vercel environment variables, never in the repo.

## 6. Build order (Proposed)

1. Repo, both apps, deploys to staging, sign-in.
2. **The website** (static pages from the canvas) and `/join`. It can ship on its own while the app is built.
3. Sessions and Slides editor, uploads.
4. Live: big screen, phones, cockpit, Action Cable with the cost rules. Load test as in "How to check" in the cost rules.
5. Reports and follow-up.
6. Events phases 1 to 5, then organiser pages; Explore last, behind its flag.
7. Passport and host levels.
8. Paid plans and billing, when pricing is decided.

## 7. Open questions

- Company name, DPO contact and the lawyer's review of Privacy and Terms.
- Monthly prices, if paid plans will offer monthly billing.
- Rails and Postgres host (Proposed: Singapore region).
- Email provider.
- Real proof (numbers and quotes) for Home.

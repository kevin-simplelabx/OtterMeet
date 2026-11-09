# OtterMeet handover

For the developer taking OtterMeet to production. Written 9 Nov 2026.

OtterMeet brings people back into the same room: a big screen, every guest playing along on their phone (no app, no
account), and the host running it all from one cockpit. Start with [docs/product-overview.md](docs/product-overview.md).

## What to read

| Document | What it's for |
| --- | --- |
| [README.md](README.md) | How to run it locally, the pages, and the live protocol as built |
| [docs/ottermeet-tech-spec.md](docs/ottermeet-tech-spec.md) | The target architecture: stack, routes, data model, endpoints, jobs, build order |
| [docs/slide-customisation-spec.md](docs/slide-customisation-spec.md) | Product decisions and why, plus the build log |
| [docs/prototype/OtterMeet.html](docs/prototype/OtterMeet.html) | The clickable prototype: what every screen does. Open it in a browser |
| [web/.env.example](web/.env.example) | Settings the web app reads |

**Still to add to `docs/`.** The specs point to 4 documents that live in the OtterMeet Claude project and aren't in
this repo yet. Ask Timothy for them:

- `hosting-cost-instructions.md`: the 12 cost rules for anything live, uploaded or cached. Not urgent for the alpha,
  but they set how the live code should be built (and the hosting bill), so follow them in anything new.
- `voice-guide.md`: how every word on screen should sound
- `characters.md`: Otto, Rue and Fin
- `events-research.md`

The design links in the specs (claude.ai artifacts) are private to Timothy's account. Use the prototype file and
what's built as the design reference.

## Where things stand

### Built and working

- **The live product**, on Rails 8.1 + Next.js 15 (see README): host accounts, the sessions portal and timeline
  builder, the cockpit, the big screen (`/stage/:id`), and the phone app (`/join/:code`). There are 7 live
  activities: Lobby with emoji shower, This or That, Word Cloud and Polls, Speed Quiz, Split Words, Imposter, Q&A,
  and private feedback. Groups and seating are in progress in the working tree.
- **The marketing website**, matching the website design: Home, The room, Events, About, Contact, the Help Centre
  (`/help` and an SSG page per article), Privacy and Terms (drafts), Start Free (`/start`), Log In, Join, the 404 page,
  and Pricing behind `NEXT_PUBLIC_SHOW_PRICING`. It includes the share image (`web/public/og.png`), the favicon and
  app icons, `sitemap.ts`, `robots.ts` and page metadata. Code is in `web/src/app/` and `web/src/components/site/`.
  Every page was checked at 1440 px and 390 px.

Sign-up, log-in and Join were tested end to end against the local API on 9 Nov 2026.

### Where the code differs from the tech spec

The app was built before the tech spec was final, so these need a decision, and most need work:

| Area | As built | Tech spec |
| --- | --- | --- |
| Realtime, jobs, cache | **Redis** (`api/config/cable.yml`), live tallies flushed by an in-process thread (`LiveTicker`) | Solid Cable, Solid Queue and Solid Cache. **No Redis** (cost rule 1) |
| Live ticker | Runs inside each Puma server process | With more than one process or machine, make sure exactly one flusher runs per live session, e.g. a Solid Queue job |
| Repo layout | `api/`, `web/` | `apps/api`, `apps/web`, `packages/live-protocol` |
| Routes | `/portal`, `/host/:id`, `/stage/:id`, `/join/:code` | `/app/...`, `/app/cockpit/:id`, `/screen/:code`, `/live/:code` (`/j/:code` already redirects) |
| Data model | `sessions` + `timeline_blocks`, `participants`, `responses` | `sessions`, `slides`, `live_runs`, `attendees`, plus events, guests, reports, passports |
| Sign-in | Own token cookie (`om_session`), email and password | Rails 8 authentication, plus Google, email verification and password reset |
| Files | None | Active Storage on Cloudflare R2, direct uploads, deck rendering |
| Tests | **None** (`api/test/` has folders but no tests; `web/` has none) | — |
| Deploy | No Dockerfile, Kamal or CI | Vercel for web, Fly.io or Render (Singapore) for Rails |

### Not built yet

From the website:

- `POST /api/contact_messages`: the Contact form already posts here. Until it exists, the form shows "write to hello@ottermeet.io".
- Password reset: "Forgot password?" opens an email to hello@ottermeet.io for now.
- Continue with Google.
- Email verification and the onboarding questions after sign-up (organisation, what they'll run, group size).
- Explore (`/explore`): designed, hidden at launch, needs a public-events API.

From the tech spec's build order (section 6): the slide editor and uploads, events (pages, RSVPs, guest list,
check-in), reports and follow-up emails, the passport and host levels, emails, and later paid plans.

## Before launch

- **Proof on Home**: the stats and quotes are labelled placeholders ("Sample · replace before launch",
  `web/src/app/page.tsx`). Replace them with real ones, with permission, or remove the section.
- **Privacy and Terms** (`web/src/app/privacy`, `web/src/app/terms`): drafts. They need the company name, date, DPO
  contact and a lawyer's review.
- **Email provider**: not chosen yet (Postmark or Resend proposed). Connect one, with SPF, DKIM and DMARC for
  hello@ottermeet.io. Contact, password reset and verification depend on it.
- **Analytics**: a cookie-free tool, so no consent banner is needed under PDPA.
- **Hosting and domains**: `ottermeet.io` (web), `api.ottermeet.io` (API and `wss://api.ottermeet.io/cable`),
  `cdn.ottermeet.io` (R2).
- **Production settings in Rails** (`api/config/environments/production.rb`): mailer host (still `example.com`),
  `config.hosts`, and the database settings (`OTTERMEET_DATABASE_PASSWORD`, or switch to `DATABASE_URL`).
- **Web settings** in Vercel: see `web/.env.example`. `NEXT_PUBLIC_CABLE_URL` is required in production. Without
  it, phones try `:3001` on the website's own host.

## Secrets

`api/config/master.key` is not in git or in the handover zip, on purpose. It decrypts `api/config/credentials.yml.enc`.
Timothy sends it separately. Or generate new credentials for production
(`bin/rails credentials:edit`). Never commit `.env` files.

## Running it locally

Follow the README. One thing to know on Windows: if `http://localhost:3001/up` doesn't answer from Windows while
Rails is running in WSL, localhost forwarding is off. Set `networkingMode=mirrored` in `%UserProfile%\.wslconfig`
and run `wsl --shutdown`. Or point `API_ORIGIN` and `NEXT_PUBLIC_CABLE_URL` at the WSL address, which is what the
`web-wsl-ip` entry in `.claude/launch.json` does. Local test host: `host@ottermeet.test` / `otter-test-2026`
(local seed data only).

## Rules that apply to all of it

From the product overview: the prototype is the source of truth for what a screen does. Follow the 12 cost rules for
anything live, uploaded or cached. Write every word in the OtterMeet voice (British spelling, short sentences,
title-case buttons). Use Plus Jakarta Sans and Inter, and keep phones light: no slides, backgrounds or custom fonts
on phones.

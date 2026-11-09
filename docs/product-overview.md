# OtterMeet

OtterMeet brings people back into the same room, and makes it easy for everyone to join in when they get there.

- **Sessions** are the live part: a big screen, every guest playing along on their phone (no app, no account), and the host running it all from one cockpit. Games, polls, Q&A, icebreakers and the host's own slides.
- **Events** are the whole get-together: the event page, RSVPs and the guest list, check-in at the door, and the follow-up after.
- **After:** a report on who took part, a follow-up email, and a passport that brings guests back.

For teams who meet in person (town halls, offsites, learning weeks) and community builders (meetups, workshops, book clubs). Built by SimpleLabx in Singapore. Alpha: free, up to 100 people per session.

*We otter meet.*

## Status

Design is done and the build is starting. Nothing in this repository runs yet.

| Thing | Where | State |
| --- | --- | --- |
| Product prototype | https://claude.ai/artifact/4W6uWFtB4d24xCFcU5YxLM | Every screen, clickable (v43) |
| Website design | https://claude.ai/artifact/RXKvHPaM7vYK2g3Rj3zbxe | 13 pages, checked at phone width |
| Product spec | `docs/slide-customisation-spec.md` | Decisions and build log |
| Tech spec | `docs/ottermeet-tech-spec.md` | Rails API + Next.js |
| Cost rules | `docs/hosting-cost-instructions.md` | 12 rules for cheap live sessions |
| Voice guide | `docs/voice-guide.md` | How every word on screen should sound |
| Characters | `docs/characters.md` | Otto, Rue and Fin |
| Events research | `docs/events-research.md` | |

The docs live in the OtterMeet Claude project. Copy them into `docs/` when the repo is created.

## Stack

- **Next.js** (App Router, TypeScript) on **Vercel**: the website and every app screen (host app, cockpit, big screen, phone).
- **Rails 8** API with **Action Cable** on **Solid Cable**, **Solid Queue** and **Solid Cache**. No Redis.
- **Postgres** for everything.
- **Active Storage** on **Cloudflare R2**, with direct uploads and a CDN domain.

Details, data model, endpoints and build order are in the tech spec.

## Layout (planned)

```
apps/web/              Next.js
apps/api/              Rails 8 API
packages/live-protocol Live message types shared by both
docs/                  Specs and guides
```

## Getting started (once the apps exist)

```bash
# API
cd apps/api
bundle install
bin/rails db:prepare
bin/rails s -p 4000

# Web
cd apps/web
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev                  # http://localhost:3000
```

Feature flags: `NEXT_PUBLIC_SHOW_EXPLORE` and `NEXT_PUBLIC_SHOW_PRICING` stay off at launch.

## Rules for anyone building this (people or Claude Code)

1. **The prototype is the source of truth for what a screen does.** The product spec says why. If they disagree, ask.
2. **Follow the 12 cost rules** for anything live, uploaded or cached. Audit first, then change.
3. **Write every word in the OtterMeet voice.** British spelling, short sentences, title-case buttons ("Start Free"), errors that say what to do.
4. **Fonts:** Plus Jakarta Sans for headings and buttons, Inter for text. Slide fonts ship as WOFF2.
5. **Phones stay light:** no slides, backgrounds or custom fonts on phones, ever.
6. **No made-up proof goes live.** The Home page's stats and quotes are labelled placeholders; replace them with real ones, with permission, or remove them.
7. **Legal pages are drafts.** Privacy and Terms need the company name, a DPO contact and a lawyer's review before launch.

## Hidden at launch

- **Explore** (public events near you): built, hidden until a city has enough public events.
- **Pricing**: built with the proposed plans (Free; Team $19 and Business $39 per host a month, billed yearly), hidden while the alpha is free.

## Contact

hello@ottermeet.io

# OtterMeet

Live audience engagement for workshops, town halls and offsites of 100+ people: one QR code, attendees play
from their phones, the host runs the room from a laptop while a clean stage screen runs on the projector.

| Folder | What | Stack |
| --- | --- | --- |
| `api/` | API, live channel, reaction batching | Rails 8.1 (API mode, Action Cable), PostgreSQL 16, Redis 7, Ruby 3.4 |
| `web/` | Landing page, host portal, cockpit, stage, attendee pages | Next.js 15, React 19, TypeScript, Tailwind 4, OtterMeet design system |
| `scripts/` | One-time WSL setup and a Ruby runner | bash |

## Running it (Windows + WSL2 Ubuntu 24.04)

One-time setup, from PowerShell in this folder:

```bash
wsl -d Ubuntu-24.04 -- bash scripts/setup-wsl-system.sh   # build tools, PostgreSQL, Redis (asks for your Ubuntu password)
wsl -d Ubuntu-24.04 -- bash scripts/setup-wsl-ruby.sh     # rbenv, Ruby 3.4.9, Rails 8
wsl -d Ubuntu-24.04 --cd api -- bash ../scripts/wsl-ruby.sh bash -c "bundle install && bin/rails db:prepare"
npm install --prefix web
```

Then two terminals:

```bash
wsl -d Ubuntu-24.04 --cd api -- bash ../scripts/wsl-ruby.sh bin/rails server -b 0.0.0.0 -p 3001
npm run dev --prefix web
```

Open http://localhost:3000. Next.js proxies `/api/*` to Rails on :3001; the live channel connects straight to
`ws://localhost:3001/cable`. Local test host: `host@ottermeet.test` / `otter-test-2026`.

## Pages

| Who | Path |
| --- | --- |
| Everyone | `/` landing, `/join` enter a room code |
| Hosts | `/signup`, `/login`, `/portal` sessions, `/portal/sessions/:id` timeline builder, `/portal/account` |
| Host laptop | `/host/:id` cockpit (clicker keys: Space/→/PageDown next, ←/PageUp back, B or . blackout) |
| Projector | `/stage/:id` stage canvas (F for full screen) |
| Attendees | `/join/:code` nickname, avatar, reactions; rejoins automatically after a lock or drop |

## Live protocol

Channel `SessionChannel`, `{ room_code, role }`. Hosts are identified by the `om_session` cookie, attendees by
the participant token their phone keeps in localStorage (`?pt=`).

- Room stream `ottermeet:session:<CODE>`: `STATE` (current block, step within it, the activity on screen,
  blackout; versioned by `rev`), `QNA_FEED`, `FEEDBACK_PROMPT` (the 👍/👎 toast after each game).
- Stage stream `ottermeet:stage:<CODE>`: `EMOJI_BURST` (batched every 100 ms), `TALLY` (live results, at most
  ~3 a second), `CROWD`.
- Host stream `ottermeet:host:<id>`: `ROSTER`, `QNA_QUEUE`.
- Participant stream `ottermeet:participant:<id>` (one phone only): `MINE` (its own answers, score and, for
  Split Words / Imposter / Speed Quiz, its own word, PIN, role or result), `ERROR`.
- Every (re)connect gets the current `STATE`, so a phone or laptop that dropped off catches up.
- Attendee actions: `send_reaction` (6/s), `respond` (vote, word, poll pick, survey), `ask_qna` (3/min),
  `upvote_qna`, `submit_feedback`. Host actions: `goto_block`, `next_block`, `prev_block` (these walk through a
  block's steps first, e.g. vote → reveal → next question), `toggle_blackout`, `moderate_qna`, `rescue_stragglers` (S key).
- A stage window on the same laptop also gets the cockpit's block changes instantly through `BroadcastChannel`.

Game logic lives in `api/app/services/activities.rb` (Split Words, Imposter and Speed Quiz in
`api/app/services/activities/`). Answers are one row per attendee, block and key in `responses`; Split Words
pairs and Imposter tables use `squads` / `squad_memberships`. Content: the 100 This or That dilemmas in
`api/config/content/this_or_that.yml`, and the 5 word packs (400 pairs plus trio words) in
`api/config/content/word_packs.yml`.

## Status against the spec

Built: accounts, sessions with one room code, the timeline builder with per-block setup, the single-live-session
rule, the cockpit (clicker steps, live results, Q&A queue with A/R keys), the stage canvas, attendee join and
rejoin, the emoji shower, and all 7 activities:
- This or That (hidden results, spring reveal, Majority Rule +100), Word Cloud and polls (with a word filter),
  Town Hall Q&A (vetting, upvotes, spotlight) and the private feedback survey.
- Speed Quiz: server-side timer, 1000→500 points for speed (banked at the reveal), top-5 leaderboard.
- Split Words & Tribes: half-words and personal PINs, pairs → quads → tribes of 8, trios for odd numbers,
  straggler rescue for latecomers.
- Imposter: tables from the Split Words tribes (or about 6), hold-to-reveal cards, blank or chameleon imposter,
  votes, and a 15-second Last Breath steal.
Plus the 👍/👎 toast after each game.

Next: the end-of-event summary report with CSV export.

## Voice

Every line people read sounds like OtterMeet: warm, playful, a little otter (rafts, paws, floating, rivers).

- Attendee screens get the most personality: "Float on your back and enjoy the talk."
- Host controls stay clear first: buttons keep plain Title Case labels ("Reveal Results"), while their helper
  text, empty states and errors stay friendly.
- Errors say what to do next, kindly, with no blame and no exclamation marks. API errors are shown to people
  as-is, so write them in this voice too, including the validation messages in `api/config/locales/en.yml`.
- Don't promise what the app doesn't do.

## Design system

`web/src/ds/vendor/` holds the OtterMeet Design System artifact's files unchanged. `web/scripts/build-ds.mjs`
(run before `dev` and `build`) wraps `bundle.js` so it renders with the app's React on the server and in the
browser. The DS tokens back the Tailwind theme (`bg-surface`, `text-ink`, `rounded-lg`, `shadow-card`, ...).
To update, replace the files in `vendor/` with the artifact's latest.

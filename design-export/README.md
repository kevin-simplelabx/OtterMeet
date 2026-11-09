# OtterMeet screens for a design pass

Every screen of the app as it works today, captured from a live demo session (room HQ8R, 8 players).

- `html/` holds one file per screen: the real markup with all of its CSS and the OtterMeet design-system classes
  embedded. These are static snapshots, with no scripts, live updates or animations. Open them in a browser
  next to the `fonts/` folder, which they link to as `../fonts/`.
- `screens/` holds a matching screenshot of each, for reference: `.jpg` for laptop and projector screens, and
  cropped `.png` files for phones (they're small). `phone-05-this-or-that-vote` has HTML only.
- `fonts/` holds Fraunces, Plus Jakarta Sans and Inter from the OtterMeet Design System.

**Suggested prompt:** attach the HTML files for the screens you want changed, plus their screenshots, and ask for
a redesign that keeps the OtterMeet design system (tokens, fonts, components) and the friendly otter voice.
Ask for the result back as HTML, so it can be mapped onto the real components.

## The three surfaces

| Surface | Size captured | Where it runs |
| --- | --- | --- |
| `host-*` | 1440×900 (the wide cockpit at 1720) | The host's laptop: portal, session editor, cockpit |
| `stage-*` | 1280×720, dark theme | The projector, full screen |
| `phone-*` | 375×812 | Attendees' phones, no app or login |

## Screens

**Host:** 01 landing, 02 sign up, 03 log in, 04 sessions list, 05 session editor, 06–11 the setup panels (This or
That, poll, Speed Quiz, Split Words, Imposter, feedback survey), 12 account, 13 cockpit, 14 cockpit with the Q&A
drawer, 15 wide cockpit with the Q&A column, 16 cockpit during Split Words (straggler rescue), 17 cockpit with
private survey results.

**Stage:** 01 lobby (QR code and crowd), 02 holding screen during a talk, 03–04 This or That while voting and
revealed, 05 word cloud, 06 poll, 07 Q&A list, 08 one question put on stage, 09–11 Speed Quiz question, answer
reveal and leaderboard, 12–15 Split Words (pairs, progress, quads, tribes), 16–18 Imposter (cards and seating
chart, vote, reveal with Last Breath), 19 break countdown, 20 feedback survey (neutral slide).

**Phone:** 01 enter the room code, 02 join form (nickname, avatar, table), 03 lobby with reactions, 04 during a
talk (ask a question), 05–07 This or That (pick, locked in, result), 08 word cloud with the after-game feedback
toast, 09 poll, 10 Q&A with upvotes, 11–14 Speed Quiz (shapes, locked in, result, rank), 15–18 Split Words (your
word and PIN, matched, find your other pair, your tribe), 19–22 Imposter (card hidden, card held, vote, result),
23 break, 24 feedback survey, 25 feedback sent.

## Things that move (not visible in a snapshot)

- This or That reveal: each bar fills from empty with a small spring past its final percentage, and the number
  counts up. The winning card's highlight and the result line appear after about a second.
- Stage emoji shower: reactions float up from the bottom and fade out between 40% and 50% of the screen height.
  Phones show the same effect for the person's own taps.
- Countdowns: Speed Quiz (it turns amber in the last 5 seconds), Imposter's 15-second Last Breath, and breaks.
- Word cloud words and leaderboard rows pop in; the cockpit shows a live miniature of the stage.

## Known issues worth designing around

- The Speed Quiz leaderboard (`stage-11`) is too tall at 1280×720: its heading is pushed off the top.
- Poll bars (`stage-06`) are sized against the leading option, so 50% fills the whole bar.
- Phones don't show the Imposter's own Last Breath guess screen here, because the demo phone wasn't the imposter.
- Logo and character art (Otto, Rue, Marlo) are still placeholders.

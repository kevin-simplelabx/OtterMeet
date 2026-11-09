# Slide customisation: agreed spec

Agreed with Timothy on 29 Oct 2026. Numbers match the review list. Everything below is built in the prototype as of v88 (1 Nov 2026).

**Where the prototype lives (decided 3 Nov 2026):** the source is now the published **OtterMeet** artifact (https://claude.ai/artifact/4W6uWFtB4d24xCFcU5YxLM), not the standalone Claude Design project. It was published from the v88 export and has every change since (version 5 on 3 Nov 2026). To change it, read the artifact's current HTML, edit that, and republish to the same link. Don't republish from an older Claude Design export, which would undo those changes. Standalone Claude Design closes on 14 Dec 2026, so keep its project archive export as a backup. The attendee passport and host levels are proposals, prototyped so they can be tested. The list of everything in a session, in order, is called **Slides** in the product (it was the "running order" until v62).

All product copy follows the OtterMeet voice guide (claude/voice-guide.md in this project).

For engineering: the stack, data model, endpoints and build order are in claude/ottermeet-tech-spec.md (Rails API and Next.js, 9 Nov 2026). How live sessions move data and serve files to stay cheap to host (Solid Cable, who gets which updates, timers, uploads, caching) is in claude/hosting-cost-instructions.md. Follow it when building from this spec.

## Events and sessions: the words we use (decided 2 Nov 2026)

OtterMeet is getting a second module, Events. Events and Sessions each work on their own, and work better together. We use the words the event world already uses, where a session is one block of the programme.

- **Event:** the occasion, such as the Riverbank Offsite or Kelp & Co Learning Week. It holds the date, venue, agenda and guest list. An event can run with no sessions at all.
- **Session:** one block in an event's agenda, such as the opening keynote, a team quiz or a town hall Q&A. A session holds its Slides (activities, stage moments and the host's own deck) and gets a room code when it goes live. An agenda block with no Slides, such as lunch, is an agenda item, not a session.
- **Standalone session:** a session with no event, such as a team huddle or a lunch quiz. Every session works this way today, and it keeps working the same way.
- **Room code** stays. It reads as a code, not a place.

Words we don't use for the live layer:
- **Room** on its own: at events it means a physical space ("Breakout · Room 3"), and agendas will show it next to room codes. Room code, room limit and "the room" (the people in it) stay.
- **Presentation:** it sounds like a deck only, and undersells the games and Q&A.
- **Activity:** it's already the word for games and polls in Slides.

The full Events flow (posting, registration, waitlist, emails, check-in, after the event) is drafted in the “OtterMeet Events spec” doc (https://claude.ai/artifact/22AYyVBdx5APibyiqocwgj), 3 Nov 2026.

**Events build phases (agreed 5 Nov 2026):** 1 Create and post · 2 Guests and RSVP · 3 Emails and changes · 4 Event day · 5 After the event · 6 Organiser pages and Explore. The plan preview switch (backlog item 4) comes before phase 2. Guest names, when the host shows them, are visible only to guests who are going (Timothy, 5 Nov 2026).

**Events phase 1, built in artifact version 15 (5 Nov 2026), merged onto version 14's art and Slide View changes:** an Events tab in the header; Your events, with upcoming cards (cover, status, date, place, visibility and linked sessions) and a collapsed Past section; New Event (name, date, start and end, where, who can see it) that opens the draft; the event page with Details (name, description, 6 covers, topic, date and times in the host's time zone, venue and address with a map link, online link, Wi-Fi, dress code, what to bring, and the 4 visibility levels) and Agenda (blocks with times, title and place; Add a Session or link an existing one; blocks at the same time sit side by side as breakouts, with a note on live slots; Guests see the agenda on or off). Registration, Guests and Emails tabs say which phase brings them. Preview Event Page shows the guest page on a phone or laptop, with the RSVP box (not working yet). Post Event checks for a name, date, times and a venue or link first; posted events get Copy Event Link and Cancel Event (with an optional message); drafts can be deleted. Linked sessions say "Part of Riverbank Offsite" on their card and Slides page. Samples: Riverbank Offsite (invite only, today, Welcome linked to the live session, 2 breakouts), River Labs Book Club (public draft) and Year-End Splash (past).

**Events phase 2, built in artifact version 16 (5 Nov 2026):**
- **Mascots:** event covers and the empty state use Otto, Fin and Rue from the character art, as do the phone's Removed, Paused and Room full screens. The host's dress-up otter on Host Level still uses the old drawing, because its picks are drawn onto it.
- **Wi-Fi** is a network name (SSID), password, security (WPA or WPA2, WEP, or No password) and a hidden-network tick, with a live scan-to-connect QR code. Guests who are going get the QR in their confirmation.
- **Registration tab:** guest limit (empty allows the plan's most; can't go below the number going; raising it lets the waitlist in, in order); when it's full, Waitlist or Closed; when registration closes (empty means when the event starts); up to 5 questions (dietary needs, access needs, table or team preference, T-shirt size, Anything we should know?, or your own), each Optional or Required; Showing who's going (Count and names, Count only, Nothing), suggested by visibility.
- **Guests tab:** counts (invited, going of the limit, waitlist, can't go, no answer, not invited yet); Add Guests by pasting or a CSV (name, email, team), with bad lines, duplicates and the 100-guest alpha cap called out; Send Invites (asks first, posts a draft, nobody gets the same invite twice); the answers added up (“Vegetarian 12 · Halal 5”) and short answers listed; Download CSV; a searchable list with status filters, and a menu per guest: See It as This Guest, Confirm Their Place (from the waitlist, raising the limit by 1 if needed) and Remove (asks first, and the place goes to the waitlist).
- **The guest's page (Preview Event Page, once posted):** See It As switches between someone with the link and any guest on the list. Invite only asks for the invited email first. Company only accepts only the company's domain. People RSVPing from the link confirm their email with a 6-digit code (482913 in the prototype). The RSVP box has the questions, and the “Show my name” switch with Count and names. Going shows the check-in QR, the date and place, Add to Calendar (Google, Outlook; Apple .ics explains the prototype can't save it), the online link and the Wi-Fi card. The waitlist shows the guest's place in line, Can't go thanks the host, and Change My Answer works until registration closes. When full, the button becomes Join the Waitlist, or with Closed the page says “This event is full.” A place freed up goes to the next person on the waitlist, who sees “A place opened up.”
- **Event statuses** now include Full and Closed. Cards and the event header show the RSVP counts.
- Prototype only: Guests Reply makes invited guests answer, and Paste a Sample fills the Add Guests box.
- Sample: Riverbank Offsite has 68 guests, a limit of 55 (full), 4 on the waitlist, and dietary, access and note questions.

**Built in artifact version 17 (5 Nov 2026):**
- **The host's otter is our 4th otter** (no name yet; Timothy, 5 Nov 2026). It's drawn in the same hand-inked style as Otto, Fin and Rue, but it's a rounder, sitting otter with a pale face, a tuft of fur on top, freckles and rosy cheeks, so it never reads as one of the 3. Every pick is redrawn in that style: 5 furs, 6 hats, 5 neckerchiefs and the bow tie, 6 things to hold, 5 chest pins, 5 ear items, 5 wrist items and the Super Host cape. The 4 pebble backgrounds are unchanged. It's drawn in code (SVG), so every combination works at any size, on the Host Level tab, the Lobby slide, reactions and the account button. **Timothy, 5 Nov 2026: the code drawing doesn't match the illustration style, so it's a stand-in.** The real art is briefed in the "Host otter art brief" doc (https://claude.ai/artifact/HZfMYQLsERuStsDSTSR1Gg): one standing pose on a 1000 × 1400 canvas, every pick as its own transparent layer, 50 files, named to match the prototype's items, so they drop straight in.
- **Waitlist workflow** (Registration tab, under When it's full → Waitlist). When a place opens up:
  - **Give It to the Next Person** (the default): the next person is confirmed straight away, with an email.
  - **Offer It First:** the next person has 2, 12 or 24 hours to Take the Place or Pass; if they don't, it goes to the person after them. The guest's page shows "A place is yours if you want it." with the deadline. The host sees "Offered a place · until 3:00 pm".
  - **Tell Me, and I'll Choose:** nobody moves up by themselves; the host gets an email and the Guests tab says how many places are open. The host uses Give Them a Place on anyone on the waitlist.
  - A tick for the default: in the last 24 hours, offer places first instead.
  - The host can also move people up and down the waitlist.
  - Offer It First, I'll Choose and reordering come with Business, and are included in the alpha. The prototype has Let the Offer Run Out.
- **Registration opens and closes:** an opening date and time (empty means as soon as it's posted or invited). Until then the event shows "Opening Soon", and the page says "Registration opens Wed 18 Nov at 9:00 am." with no RSVP buttons. It must open before it closes.
- **Showing who's going** explains why it helps: people say yes more when they see others are going, and friends can arrange to come together. Each option has a Why line.

**Events phase 3, built in artifact version 17 (5 Nov 2026):** the Emails tab.
- **Your emails:** what's left this week, with a bar, when it resets, and the 2 kinds of email (sent by you, which pause when the allowance runs out; needed by a guest, which always go). The alpha has 5,000 a week, as on Team. A banner shows at 80% and at 100%, on the Emails and Guests tabs.
- **Over the allowance:** Send Invites says how many emails it sends and how many are left. If that's more than is left, it offers Send to the First N, Copy the Event Link (it costs no emails) or See Plans.
- **Reminders:** 1 day before at 9:00 am is suggested, and the host can pick 1 week, 2 days, 2 hours or 1 hour before. There can be a second reminder. Each says when it goes and to how many, and whether it'll wait for the allowance. The invite reminder can be off, 2 or 4 days after the invites, or 1 week before the event.
- **Send a note to guests:** for anything that isn't a change of date, time or place. It goes to everyone going or on the waitlist.
- **Every email** (invite, invite reminder, confirmation, waitlist, a place opened up, reminder, update, cancelled, follow-up): who it goes to, when, its kind, and how many have been sent. Opening one shows a live preview with the sender, subject, the host's line, details, buttons and the "why you got this" line. The invite, confirmation, waitlist and reminder have an editable subject and a line from the host. Send a Test doesn't count.
- **Updates:** changing the date, time, venue, address or online link after people have replied shows "You changed the time. Send an update to 57 people?" with Send Update or Not Now.
- Cancelling emails everyone invited, with the host's message. Every RSVP, offer, removal and update counts towards the allowance as a needed email.
- Prototype only: Use Up Most of It, Fill It Up Again, and Send It Now on reminders.

**Changes in artifact version 18 (Timothy, 5 Nov 2026):**
- **For the alpha, the host chooses who gets an open place (Timothy, 5 Nov 2026; artifact version 22).** Automatic filling and Offer It First are parked (`WL_AUTO` off in the prototype code, not deleted), until alpha hosts say they want them. This follows research on 5 Nov 2026: Luma, Eventbrite and Tito release places by hand; Meetup confirms the next person automatically; Hi.Events and Accelevents send a timed offer to the next person; Universe emails everyone. Nobody widens an offer.
  - The Registration tab says "When a place opens up, you get an email and choose who gets it, on the Guests tab."
  - The Guests tab shows "2 places are open", with Give Them to the Next 2 (or Give It to *name*). Give Them a Place is still on anyone on the waitlist, in any order.
  - Guests on the waitlist see "We'll email you if the host gives you a place."
  - The parked designs below stay as the spec for later.
- **Giving a place to a specific guest (Timothy, 5 Nov 2026; artifact version 23):**
  - **Give a Place** is on each row of the Waitlist order list, as well as in each guest's menu (Give Them a Place). If no place is open, the guest limit goes up by 1.
  - **Invite to a Place** is for guests who haven't answered, said Can't Go, or haven't been invited yet. It saves a place for that guest (status "Place saved"; it counts as taken) and emails them "Jamie Koh saved you a place at …" with Going and Can't Go. Their page says "Jamie Koh saved a place for you. Say if you're going, and it's yours.", with the usual questions. Going confirms them, with no waitlist. Can't Go frees the place, and the host is told.
- **Each guest's answers:** click a guest's name in the guest list (or See Their Answers in their menu) to open a side panel. It shows:
  - their status and team, and each question with their answer ("Not answered" if they skipped an optional one);
  - whether their name shows on the guest list;
  - what's happened (invited, said Going, got a place from the waitlist, place saved);
  - actions: Give Them a Place, Invite to a Place, See It as Them and Remove.

  The panel repeats the privacy line for dietary and access needs. Since version 24, it opens as a dialog in the middle of the screen (Timothy, 5 Nov 2026).
- **Version 24 (Timothy, 5 Nov 2026):**
  - **The host's own questions:** as many as they like, up to 10 questions in all. Each has an answer type: Short answer, Paragraph, Pick one, Pick any (2 to 12 options, added and removed in place) or Yes or no. Pick-one and pick-any answers are added up in Answers and show in the CSV.
  - **On a phone, the RSVP box** (the form, the invite-only email step, the email code, or the guest's own answer) sits straight after the date, time and place, in the first screen.
  - **Voice check of the Events copy (version 25, 6 Nov 2026), against claude/voice-guide.md:**
    - Time ranges say "to" ("9:00 am to 5:30 pm").
    - Things you press are Title Case: Company Only, Invite Only, Count and Names, Count Only, and the dietary chips No Pork, No Nuts and Gluten-Free. The same words in sentences and tags stay sentence case ("Invite only", "invite-only events").
    - The status tag reads "Opening soon".
    - "just" is gone ("Guests only say whether they're going.").
    - There's no comma before "and" in lists.
    - The required-answer error says what to do: "Answer this one to say you're going."
    - The heading "Send a note to guests" is now "A note to guests".
    - The "who's going" intro and the waitlist-order note are 2 sentences each, and the saved-place toast is shorter.
    - No problems found with exclamation marks, "&", otter wordplay, avoided words (attendees, users, click, sign in) or digits for counts.
  - **Wi-Fi on the guest's phone appears only once they're checked in.** It shows the network name and the password with **Copy Password**, and "Open your Wi-Fi settings, pick the network and paste the password." There's no QR code on their own screen, since a phone can't scan itself. Before check-in, nothing about Wi-Fi shows (Timothy, 6 Nov 2026). A web page can't join a Wi-Fi network by itself on iPhone or Android, so Copy Password is as close to one tap as the web allows. The QR code is for a screen or printed sign at the venue. Prototype only: "Check Me In" on the guest's page, until check-in arrives in phase 4. The answers are also summed in Answers, shown in short on each row, and in the CSV.
- **Version 26: Events phase 4, the day itself (Timothy asked, 6 Nov 2026):**
  - **Status:** on the day, the event shows Today, and the header says "It's on today. Check people in, and see what's on, in the Check In and Today tabs."
  - **Check In tab:**
    - It shows "Checked in X of Y going · N walk-ins", with a bar. Co-hosts check people in from their own phones, on the same list.
    - **Scan:** the host's camera reads the guest's QR code. The result shows the name, "Checked in" or "Already checked in at 8:52 am", their team, their breakout and their answer notes (for example, dietary needs). The prototype has "Scan the Next Guest" instead of a camera.
    - **Find someone:** search by name or email. Then Check In, or Let Them In for someone who isn't going yet (it gives them a place). Undo is available.
    - **Add a walk-in:** a name and an optional email. If the email is already on the list, that guest is checked in instead. Walk-ins may go over the guest limit, and a toast says so. Walk-ins have their own status, tile and filter.
    - **Self check-in (on or off):** a QR code at the door. Guests scan it and type the email they RSVP'd with. The error if it doesn't match: "That isn't the email you RSVP'd with. Check it, or ask at the door."
    - **Latest check-ins**
  - **Today tab:**
    - The heading says what's on now, what's next, or that the day is over.
    - Each agenda slot shows Done, On now or Next, with breakout counts.
    - A slot linked to a session shows its status, room code and co-hosts, with Open Its Cockpit and Edit Slides.
    - The prototype has "Pretend It's" to move the clock.
  - **Breakouts (Guests tab):**
    - Blocks at the same time in the agenda are breakouts.
    - Split Evenly shares everyone going between them, keeping teams together where they fit. Clear Breakouts undoes it.
    - Each guest row has a breakout picker.
    - A guest who says yes after a split joins the breakout with the most room.
  - **Guest's page on the day:**
    - "Your breakout, 11:00 am to 12:15 pm: Product roadmap · Room 3".
    - A Today card shows On now (with Join Now when the linked session is live) and Next.
    - Joining needs no room code, because their QR code did it. They see "Your table: <team>".
    - Wi-Fi with Copy Password appears after check-in.
  - **Sample:** Riverbank Offsite is under way, with 30 people checked in from 8:48 am, 2 walk-ins, breakouts assigned by team and self check-in on. It's today until 5:30 pm, then moves to tomorrow, so in the evening the Today view only shows on the next day.
  - **Not built yet:** teams becoming session tables automatically (the guest page shows the team as the table); a real camera scanner. (Both built later, in versions 34 and 37.)
- **Version 27: Events phase 5, after the event (Timothy asked, 6 Nov 2026):**
  - **Report tab:** an ended event opens on it. On the day it's there too, marked as the numbers so far.
  - **Summary:**
    - A funnel: Invited, Said Going, Checked in (with walk-ins) and Took part in a session.
    - No-shows ("8 people said Going and didn't check in."), the feedback score from any session survey, and up to 6 highlights from the linked sessions.
    - How long it's kept, by plan.
  - **Sessions:** a card per linked session with what it pulled in and how many guests joined it. Each card has View Report, or Open Its Cockpit if the session is live.
  - **Guests:**
    - Search, sort (name, check-in time, sessions joined) and Download CSV.
    - Each row shows the RSVP, check-in time, sessions joined and answers, with Remove This Person (for deletion requests).
    - **Delete Answers After the Event** clears every RSVP answer, including dietary and access needs, for the whole event. Names, RSVPs and check-ins stay.
  - **Follow-up:**
    - One email for the event. Send it to everyone who checked in, or everyone going. Keep in Touch sign-ups and survey contacts from every session can be added, with nobody getting it twice.
    - It goes when the event ends, on Send Now (asks once) or at a set time.
    - Subject, heading, message, each session's slides and the host's links, with a live preview that includes the passport line. Send a Test is there too.
    - Below it: the session contacts, de-duplicated, with CSV.
  - **Share Report:** a link that can be turned on or off, and Include Names and Emails (off by default). Viewers see Summary and Sessions; with names on, they also see Guests, but never the answers. See What They See shows the host that view.
  - **Guest page after the event:**
    - A checked-in guest sees their passport stamp (1 per event, listing the sessions they joined) and Open Your Passport.
    - A guest who didn't check in is told there's no stamp.
    - On a phone, this box sits in the first screen.
  - **Sample:** Year-End Splash (20 Nov 2025) now has 62 invited, 44 checked in (2 walk-ins) and its follow-up waiting for Send Now.
  - **Not built yet:** event stamps in the passport screen itself (Open Your Passport is a stand-in); a PDF of the event report. (Both built later, in versions 34 and 37.)
- **Version 28: Events phase 6, listings and organisers (Timothy asked, 8 Nov 2026):**
  - **Your organiser page (Events list):**
    - It shows the page address (ottermeet.io/@kelpco), how many public events are listed and the follower count ("214 people follow Kelp & Co. You see how many, not who.").
    - View Page, Edit Page and See Explore.
    - Edit Page changes the address (3 to 30 lowercase letters, numbers or hyphens; a taken address is refused), About (up to 300 characters) and the website.
  - **Organiser page:**
    - Banner in the organiser's colour, initials, name, address, followers, About and website.
    - Upcoming public events, and past ones with how many came.
    - **Follow:** Continue with Google, or Email Me a Link (the email must be valid). Following shows Unfollow and "You'll get one email when … posts a new public event." The host's own page says it's what visitors see, with Edit Page.
  - **Explore** (ottermeet.io/events):
    - Upcoming public events, soonest first.
    - Search by event or organiser; Where (Anywhere, Singapore, Kuala Lumpur, Online); Any Time, Next 7 Days or Next 30 Days; and topic.
    - Cards show the cover, topic, date and time, place, organiser (links to their page) and "38 going". A card opens the event page.
    - Only public, posted events with a description and a date are listed, and never one taken down after a report. The listing rules are shown at the bottom.
  - **Posting a public event** emails the followers (counted towards weekly emails, as this draft proposes) and says so.
  - **Report This Event:** on every public event page.
    - Pick what's wrong: Spam or a scam; Paid ads or selling something; Adult content; Breaks the law; Hate, harassment or danger; Something else (needs a few words). Details are optional.
    - Then: "Thanks. OtterMeet will look at it within 2 working days."
    - The host sees a report count. If OtterMeet takes the event off Explore, the host sees why, can still share the link, and can Ask for a Review.
  - **Samples:**
    - 5 other organisers (River Labs, Pebble Bank, Otterly Studio, Driftwood Coffee, Splash Travel) with 8 upcoming and 2 past public events, dated from today.
    - Posting River Labs Book Club puts it on Kelp & Co's page and Explore.
    - Other organisers' event pages say "Hosted by Nadia Lim · River Labs", with a link to their page.
  - **Still open (left as in the draft):** Explore at launch or organiser pages first; whether follower emails count towards the allowance; who reviews reports. Followed organisers don't show in the passport yet, and there's no real logo upload on the page yet.
- **Version 29: organiser logo and page image (Timothy asked, 9 Nov 2026):**
  - Edit Page has Upload a Logo and Upload a Page Image, each with a preview, Remove and an upload rule:
    - Logo: square PNG, SVG, JPG or WebP, 400 × 400 px or bigger, up to 2 MB.
    - Page image: JPG, PNG or WebP, 1600 × 400 px or bigger, up to 10 MB.
    Both apply on Save Changes.
  - Where they show:
    - The organiser page: the page image across the top (otherwise the organiser's colour), and the logo in place of the initials.
    - Explore and organiser-page cards: the logo beside the organiser's name.
    - Your organiser page card on the Events list: the logo.
  - Plans: Team and up, so in the alpha too. On Free, the page shows initials in OtterMeet's colours, and the form says the logo and page image come with Team.
  - Samples: River Labs and Driftwood Coffee have logos, so Explore shows both kinds of card.
- **Version 30: admin role, and the company logo moves to Account (Timothy, 9 Nov 2026):**
  - **Roles:**
    - **Owner (1):** everything, including the plan and billing.
    - **Admins (any number):** invite and remove people, make others admins or hosts, rename the organisation, change the company logo and the organiser page. They can't see the Plan tab.
    - **Hosts:** make and run sessions and events. They can't change the team, the brand or the organiser page, and are told who can.
  - **Team tab:**
    - An Admin tag on admins.
    - A Host or Admin picker on each row (owners and admins only).
    - **Make Owner** (owner only, asks first): the old owner becomes an admin.
    - Remove now needs an owner or admin.
    - The roles card is now "Who can do what", with Admins and The owner.
    - "Prototype: See this as" switches between owner, admin and host.
  - **Company logo** (Account, Team tab):
    - A light-background and a dark-background version.
    - Used on the organiser page, Explore and organiser-page cards, and every session's big screen and phones, unless a session uploads its own (the session's logo help says so).
    - Owners and admins change it; hosts see it read-only. On Free it shows initials.
  - **Edit Page (Events)** no longer uploads a logo: it shows the company logo with Change It in Account. The page image, About, address and website stay there. Hosts don't see Edit Page.
  - Sample: Mei Lin Tan is an admin.
- **Version 31 (Timothy, 9 Nov 2026):**
  - **Billing:** admins handle the plan and billing too, and see the Plan tab. The owner only adds handing over ownership. Hosts still can't see it.
  - **A session or event can add its own logo** (a campaign or partner logo), and choose what to show: Company Logo, This Session's Logo (or Event Logo), or Both Side by Side.
    - Uploading the first own logo picks Both when there's a company logo.
    - Both sits side by side with a thin line between them. It's drawn into one picture, so the big screen, phones, lobby and every other place show the pair.
    - A logo that only has the other background's version keeps its contrast chip.
  - **Event Details:** a new Logo section shows the company logo, Upload an Event Logo, the Show choice and a preview. The event page shows the chosen logo above the event name.
  - **Session Settings, Theme tab:** the same choice above the session's logo uploads, with help text for each choice.
  - Not yet: an event's logo choice isn't passed down to its linked sessions automatically; logos in emails and the report PDF.
- **Version 32: light and dark mode (Timothy, 9 Nov 2026):**
  - A sun or moon button sits at the top right, next to Help, and switches the whole app between light (cream) and dark (navy).
  - It's remembered in that browser. Light is the default.
  - Slide previews, the big screen, the cockpit stage and phones keep their session theme in either mode, because they show what the room will see.
  - Dropdown arrows turn light in dark mode.
- **Version 34 (Timothy, 9 Nov 2026):**
  - **Teams are tables:**
    - A session linked to an event uses the guest list's teams as its tables, one per team, biggest first. In Session Settings, Room, Tables: "Use Riverbank Offsite's teams as tables" (on by default) shows them as chips, and the number and names of tables follow the teams.
    - People who check in with their QR code sit at their team's table without picking. Walk-ins and people with no team pick one.
    - Games played at tables (Imposter) and the session report use the team names. Turning it off brings back the usual table count and names.
  - **Event report PDF:**
    - Download PDF beside Share Report (viewers with the link get it too).
    - One A4 page: logo, event name, date and place, the 4 funnel tiles and bars, no-shows, feedback, highlights and sessions.
    - No names, emails or RSVP answers. On the day it says "So far".
  - **Event logo on its sessions (the host is asked):**
    - When an event has its own logo and linked sessions, Details asks "Show the same logo on its session…?" with Use It on the Sessions or Not Now.
    - Sessions get a fourth logo choice, Same as the Event, which follows the event's choice: company, event or both.
  - **Logos in emails and PDFs:**
    - Event emails (invite, confirmation and so on) and the event follow-up preview show the event's logo choice.
    - The session follow-up already used the session's logo, which now falls back to the company logo.
    - The session report PDF shows the logo in place of the OtterMeet wordmark.
    - Email previews and PDF pages stay light in dark mode.
  - **Appearance:**
    - Account, Profile, Appearance: Light, Dark or Match My Device. It's saved, and in the prototype it's remembered in the browser.
    - The sun and moon button at the top only switches it until the next visit, and the first use says so. Profile shows "Go Back to My Setting" while it's switched.
  - **Decisions:**
    - Follower emails are free and don't count towards weekly emails.
    - Reported events are reviewed by OtterMeet's team (OtterMeet admins); the copy now says so.
    - Organiser pages come first, and Explore waits until a city has enough events. Explore is still built in the prototype until we agree how people find events.
- **Version 35 (Timothy, 9 Nov 2026):**
  - **Teams and groups are now separate.** A team is where someone works (from the guest list). A group is for the day, such as a workshop table.
    - Session tables follow the event's groups, not its teams: "Use Riverbank Offsite's groups as tables". Without groups, the session says to make them in the Guests tab.
    - The QR join message says "Your table: Group 3". The check-in result shows the team and the group.
  - **Groups card (Guests tab):**
    - Make Groups (6 to start), How Many (2 to 50, from −/+ or by typing) and Name the Groups.
    - Each group shows how many people are in it, plus a count of people without a group.
    - **Put people in groups for me:** Mix the Teams (spreads each team across the groups), Keep Teams Together (each team in one group, so sizes may differ) and Fill In the Rest (only people without a group).
    - Also Clear Everyone's Group and Remove the Groups.
    - Anyone who says Going later joins the smallest group.
  - **Manual groups:** each guest row has a group picker.
  - **Select many guests:**
    - A checkbox on each row, and Select All Shown (works with search and filters).
    - A sticky bar appears: "N selected", Move to a Group…, a breakout picker for each breakout slot, and Clear Selection. Guests who aren't going are skipped, and the toast says how many.
  - **Wider Events:**
    - The Events list and event pages go up to 1,480 px.
    - On screens 1,180 px or wider, Details and Registration flow into 2 columns.
    - Guests puts the guest list on the left, with Groups, Breakouts, Waitlist order and Answers on the right.
  - Sample: Riverbank Offsite has 6 mixed groups, and Jon Reyes (a walk-in) has none yet.
- **Version 36: tags instead of a topic (Timothy, 9 Nov 2026):**
  - **Up to 3 tags per event.** Details shows the chosen tags with ×. The full list is grouped, and opens with Change Tags (it's already open when there are none). A 4th pick says "Pick up to 3 tags. Remove one to add …".
  - **43 tags in 8 groups:**
    - **Work:** Business, Startups, Leadership, Marketing, Sales, Product, Careers, Money and Finance, People and Culture, Networking
    - **Tech:** Tech, AI, Coding, Data, Design
    - **Learning:** Learning, Workshops, Talks, Books, Languages, Science
    - **Wellbeing:** Wellbeing, Fitness, Outdoors, Mindfulness
    - **Social:** Social, Food and Drink, Coffee, Games, Music, Parties, Travel
    - **Arts and culture:** Arts, Crafts, Photography, Film
    - **Community:** Community, Volunteering, Sustainability, Family-Friendly
    - **Other:** Other
  - The 7 old topics are kept as tags, so existing events keep theirs.
  - **Explore:** the filter shows only tags used by upcoming events, most used first, plus All Tags. An event matches if it has the tag. Cards show all of an event's tags.
  - All samples have tags.
- **Version 37 (Timothy, 9 Nov 2026):**
  - **Organiser pages first; Explore is parked.**
    - The Events list loses See Explore, keeping only a prototype link. Explore says it opens city by city once there's enough to fill it.
    - People find events through:
      - **Follow** on every public event page, with the follower count. A guest the page knows follows in one tap; anyone else uses Continue with Google or Email Me a Link.
      - **"Want to hear about …'s next event?"** on the "You're going" screen.
      - **More from [organiser]**: up to 3 of their other upcoming public events at the bottom of the event page.
      - **A follow line** in the event follow-up email for public events.
    - The organiser page's breadcrumb goes back to wherever you came from.
  - **Passport:**
    - Open Your Passport opens the guest's passport: event stamps (1 per event they checked in to, listing the sessions they joined), session stamps with rewards, and Organisers you follow (with the next event and Unfollow).
    - In OtterMeet it's its own page at ottermeet.io/passport.
  - **Door camera:**
    - Check In, Scan has **Use the Camera**: the browser camera reads the guest's QR code (ottermeet.io/t/<event>/<guest>). It uses the built-in barcode reader, or jsQR where there isn't one.
    - On a scan it checks the guest in, shows "Already checked in at …", or says the code is for another event or isn't a guest code. The same code is ignored for 3 seconds, and the phone vibrates where it can. Stop the Camera ends it.
    - If the camera can't open (blocked, or the view doesn't allow it), it says so and points to Find Someone. Inside the claude.ai preview the camera usually isn't allowed, so this is for testing in OtterMeet or a browser.
  - **Plan preview switch:** a Plan picker in the prototype bar (Alpha, Free, Team, Business).
  - **Free plan rules:**
    - 1 upcoming event at a time. Posting a second says "Free has 1 upcoming event at a time" and offers See Plans.
    - 50 guests per event; no co-hosts; Company Only and Invite Only locked, with a toast.
    - Initials instead of logos, and no session logo uploads.
    - Session and event reports kept 30 days.
    - Up to 5 games, polls and Q&As per session (the counter and upgrade prompt follow).
    - Not enforced yet: the 3 live sessions a month and the 50 people in a room.
  - **Plan and Billing:**
    - Free shows its limits with bars (live sessions this month, upcoming events) and Upgrade buttons; the upgrade asks for a card next.
    - Team and Business show billing details, invoices and Cancel Plan.
    - Owners and admins see the tab.
  - **Q&A:** questions don't carry over. When a live session ends, the cockpit shows "N questions from the room" with Review the Questions: each question with its upvotes, who asked, and Spotlighted, On screen, Not answered or Hidden. The answers aren't shown.
- **Version 38 (Timothy, 9 Nov 2026):**
  - **Teams can be edited:** a Team field (with the event's teams suggested) and a Group picker in a guest's details. With guests selected, Set the Team… offers the existing teams, A New Team… or No Team.
  - **Guest rows on one line:** answers sit under the name, and the pickers are narrower.
  - **By Group view (Guests tab):** a List / By Group switch. Each group card shows its count, how many checked in, the team mix, and each person's group picker. "No group yet" comes last.
  - **Event report:** Guests shows team and group; the host can change the group there, and it sorts by Group. The guest CSV has Team and Group columns. Viewers of a shared report see the group as text.
  - **Explore** keeps the wide layout (1,480 px) while it's hidden.
  - **Passport:**
    - Each stamp shows the host and their level ("Hosted by Jamie Koh · 💦 Level 3, Splasher").
    - Remove This Stamp asks first, and its rewards go too.
    - Delete My Passport asks first, then removes every stamp, reward and follow. A new passport starts on the next check-in or session.
  - **Help Centre:** 14 new articles drafted. 8 in a new Events topic: make an event, tags and finding events, guests and invites, groups, waitlist, check-in, report and follow-up, organiser page. Also roles, company logo, light and dark mode, removing stamps, questions at the end of a session, and what Free includes. The Help panel shows the Events articles on event screens.
- **Version 39 (Timothy, 9 Nov 2026):**
  - **Breakout picker:** when an event has more than 1 breakout slot, each guest row shows 1 button, "Breakouts · N of M set ▾". It opens a panel under the row with a labelled picker per time slot. With 1 slot, the row keeps a single dropdown. Not built yet (offered): guests choosing their own breakouts at RSVP, and a capacity per breakout ("N places left" / "Full", respected by Split Evenly).
  - **Smaller uploads:** pictures are downscaled and re-encoded in the browser before they're stored (WebP at 0.82; JPEG if the browser can't make WebP). SVG and GIF are left alone. Pictures that are already small and under 300 KB are kept as they are. A toast reports savings over 1 MB. Longest-side caps:
    - Backgrounds and slide images: 1920 px.
    - Covers and event photos: 1600 px.
    - Page images: 2000 px.
    - Pictures and quiz or This or That images: 1200 px.
    - Logos: 800 to 1200 px.
    - Answer, poll and speaker photos: 600 px.
    - Reactions: 512 px.
  - **Lower upload limits:**
    - Background video: 15 MB, 1280 × 720 px, 10 to 20 seconds, MP4 or WebM (was 50 MB).
    - Decks: 50 MB (was 100 MB). Pages are stored as compressed 1920 px pictures, and the original file isn't kept.
    - Follow-up attachments: 10 MB (was 25 MB).
- **Version 40 (Timothy, 9 Nov 2026):** follow-up attachments are hosted for as long as reports are kept: 30 days on Free, 12 months on Team, 3 years on Business, and at least 12 months in the alpha. The upload note and the "Uploaded" message say how long the link works.
- **Version 43 (Timothy, 10 Nov 2026):** Fraunces is gone, because of its F and J. Display text (hero, display, pull quote) now uses Plus Jakarta Sans at 800, so the product and the website share one family. The slide font called Friendly is now Nunito, built into the prototype. Slide titles default to Semibold (600); Bold is 800.
- **Version 41 (Timothy, 9 Nov 2026):**
  - **Guests pick their own breakout:**
    - On by default, with a switch in the Guests tab's Breakouts card.
    - The RSVP form shows each breakout time slot, with No preference, which leaves it to the host, and each breakout with its room and "N places left" or "Full". A full breakout can't be picked.
    - Guests can change their pick until registration closes.
    - If a breakout fills while someone is RSVPing, they're told the host will place them.
  - **Breakout places:** each breakout has a Places box ("No limit" when it's empty). The card shows "12 of 20 places", "Full" or "over by N". The guest-row pickers show places as (12/20). The host can still place someone in a full breakout.
  - **Split Evenly:**
    - Keeps guests' own picks.
    - Never goes over a breakout's places.
    - Says how many people didn't fit.
    - A guest who RSVPs after a split joins the breakout with the most room that isn't full.
  - **Upload limits by plan** (Free / Team and the alpha / Business). Pictures are shrunk for every plan.
    | Upload | Free | Team and the alpha | Business |
    |---|---|---|---|
    | Photos, backgrounds, covers, page images and slide images | 5 MB | 10 MB | 20 MB |
    | Smaller pictures (quiz, This or That, answers, slide pictures) | 2 MB | 5 MB | 10 MB |
    | Background video | Not on Free | 15 MB | 40 MB |
    | Decks | 20 MB | 50 MB | 100 MB |
    | Follow-up attachments | 5 MB | 10 MB | 25 MB |

    Logos, fonts, reactions and speaker photos stay the same on every plan. A file that's too big on Free says what Team allows. Proposed for engineering, not built: storage per account of 500 MB on Free, 20 GB per host on Team and 100 GB per host on Business.
  - **Free limits now enforced:**
    - 50 people in a session room. Session caps above 50 are flagged.
    - 3 live sessions a month. Opening a 4th live cockpit shows the upgrade prompt, and the count resets on the 1st.
    - Sessions record when they went live, and the Plan & Billing bar counts this month only.
    - Picture upload limits stay as they were, since what we store is the shrunk copy.
- **Decided 9 Nov 2026:**
  - **Help Centre:** Claude drafts the first articles; OtterMeet admins add more over time.
  - **Host levels:** attendees see a host's level outside the lobby, on passport stamps.
  - **Passport:** attendees can remove a stamp or delete their whole passport.
  - **4th otter's neckerchief:** Coral for now, a soft pink coral clearly pinker than Otto's Buoy Red. The art brief is updated.
  - **Illustration** waits: the 4th otter, the 12 stickers, and art for rewards, level badges and the captain's hat. Stand-ins stay for now.
- **Offer It First (decided by Timothy, 5 Nov 2026; built in version 20; parked in version 22):** the offer widens over time. The host picks a window: 2, 4, 6, 12 or 24 hours.
  - When a place opens, the first person on the waitlist is offered it.
  - If nobody confirms within the window, the next person gets the offer too, and both can confirm. Each window adds one more person. Whoever confirms first gets the place.
  - Example with 2 hours: 1st at 0h, 1st and 2nd at 2h, 1st to 3rd at 4h.
  - **Safeguards:**
    - At most 3 people have the offer at once. After that, the place waits for the host: the Guests tab says "A place needs you", and those with the offer can still confirm.
    - The clock stops from 10 pm to 8 am in the event's time zone.
    - There's no "sorry, it's gone" email. People who missed out see "Someone took it first. You're still on the waitlist, in the same place." and keep their place in line.
    - The email says how many others have the offer: "It's also been offered to 1 other person, so the first to confirm gets it."
    - Each guest gets at most one offer email a day.
  - Each person costs 1 email when they're added, so one place usually costs 1 to 3 emails.
  - If someone passes and nobody else has that offer, the next person gets it straight away.
  - Prototype only: "Let the Window Run Out" on an offered guest.
  - **One shared offer for all open places (Timothy, 5 Nov 2026; version 21):**
    - Every open place sits in one offer, and anyone with it can take any open place. With 2 places open, the first 2 to confirm get them.
    - A place that opens mid-offer (someone else drops out, or the host raises the limit) goes to the next person on the waitlist straight away. It doesn't wait for the clock, and it doesn't reset anyone's window.
    - The cap is the open places plus 2, so 3 people for 1 place, as before.
    - When the last place is taken, anyone still holding the offer sees "Someone took it first." and keeps their place on the waitlist.
    - Someone who said Can't Go and switches back is treated as a new RSVP. Lowering the limit below the places on offer stays blocked. Switching away from Offer It First ends the offer, and those holding it go back to the waitlist.
    - Their page says how many places and people: "2 places opened up. They've been offered to 3 people on the waitlist, so the first 2 to confirm get them."
- **Guests never see their place on the waitlist.** Their page and the waitlist email just say "You're on the waitlist." The host still sees the order.
- **Waitlist order:** the Guests tab has a Waitlist order list. The host drags people to reorder it, or uses the up and down arrows. This comes with Business, and is included in the alpha.
- **Setting when registration opens comes with Team,** and is included in the alpha.
- **On a phone, the guest's own RSVP** (going, the waitlist, can't go, or an offer) sits straight after the date, time and place, in the first screen. The questions form for a new RSVP stays at the bottom.
- **Pictures on the event page:**
  - The host can upload a cover photo (JPG, PNG or WebP, 1600 × 900 or bigger, up to 10 MB). It replaces the drawn cover on the page and its card, and Remove Photo brings the drawn cover back.
  - The host can add up to 8 photos with captions (1200 px or bigger on the longest side, up to 10 MB each). Guests see them in a grid under the description.

**One session per agenda block.** When a Q&A runs across several blocks, such as an all-day track, the host carries the questions still waiting into the next session (to design). Each session keeps its own report, and the event report rolls them up.

The voice guide's “Words we use” table has the same definitions (updated 2 Nov 2026).

## Principles

- **Theme, then override.** One session theme sets the look of every slide and phone. Any slide can override it.
- **Constrained layouts on activity screens.** Activity screens are live and data-driven, so hosts pick from layouts instead of free-dragging elements. Free text boxes and images are allowed on the host's own slides and stage moments. On activity screens they sit only in protected zones (header strip, corners).
- **Customisation is a tier lever.** Deeper branding (brand kit, custom fonts, custom uploads, more otters) belongs to higher plans.

## Common tools (every slide)

1. **Session theme:** lives in **Session Settings** (a button beside Open Cockpit), not in a slide's Design tab. Session Settings is a side panel with 5 tabs: Room (capacity, tables, emoji shower and reactions, leaderboard, banned words), Theme, Sound, Join Badge and Sponsors. The old Room settings strip above the slides is gone. It leaves the big-screen preview in view, so changes show straight away. The slide Design tab keeps only per-slide settings, plus a card with shortcuts to each tab. Theme covers presets (OtterMeet Dark, OtterMeet Light, event styles); brand kit (logo, primary and accent colours, background and text colours); curated font pairing (heading plus body). Phones inherit logo and colours. Brand kit and custom font upload are for higher tiers.
2. **Background:** solid colour, gradient or image, with focal point, dim and blur. Automatic contrast warning. Looping video.
3. **Text:** edit titles and subtitles directly on the preview; size, weight, alignment, colour; auto-fit; a minimum readable size for projectors.
4. **Join badge (QR):** on by default. Big on Lobby, small corner badge elsewhere, hidden on Blackout, toggle per slide. Position: 4 corners or a bottom strip. Size: S, M or L. Style: QR plus room code, code only, or link only. Optional: hide once most of the expected room has joined.
5. **Extra elements:** text box, image or logo, otter character sticker, sponsor logo strip (protected zones only on activity screens). **Add Sample Sponsors** (under Show the sponsor strip in a slide's Extras) loads 6 made-up otter-world sponsors and turns the strip on for that slide in 1 click, so the preview shows it straight away; **Try Sample Logos** in Session Settings, under Sponsors, does the same without turning the strip on. The samples are Kelp & Co, River Labs, Otterly Studio, Driftwood Coffee, Pebble Bank and Splash Travel. When the strip sits at the bottom centre, the footer status line steps aside.
6. **Layout:** layout picker per screen type, projector-safe-area guide, 16:9 or 4:3 output.
7. **Motion and sound:** slide transitions (fade, slide, zoom, none); reactions; background music and sound effects with volume. **Background music has 8 original loops** (Lagoon Lo-fi, Riverbank Sunrise, Kelp Forest Groove, Upbeat Rapids, Splash Party, Driftwood Jazz, Calm Current, Moonlit Raft), each with a mood line. In the prototype the browser composes them live from simple chords, so there are no recordings and no licence to clear. **Music levels:** every slide plays at 1 of 4 levels: Announcements (20%), Ambient (50%), Activity (80%) and Speeches (0%). The host can adjust each level's volume in Session Settings, under Sound (Back to 20 · 50 · 80 · 0 resets them). Each slide picks its level in its Design tab, with a default by slide type. **The cockpit has a track picker, the 4 level buttons, a volume slider and Pause**, in both the live cockpit and a preview. With no track yet, it offers the 8 tracks so the host can start music live. A track picked in the cockpit lasts for that run and doesn't change the session's setting. On narrow cockpits the picker gives way to the track name, then to just ♪, so everything stays on 1 row. A level button changes the level for that slide; the slider changes the current level's volume. Both last for that run. Every change fades up or down in about 1.5 seconds; Speeches fades out completely, and the next louder level fades back in. These replace v56's Play Here / Quiet Here, which turned music on or off for 1 slide during a rehearsal.
8. **Host only:** speaker notes and Up Next in the cockpit (see Live cockpit below); preview as big screen, phone or cockpit; Apply to All Slides, Copy Style From, Reset to Theme.
9. **Upload requirements:** every upload area states the file types, the size in pixels and the file size limit, under its button. Files over the limit are turned away with a toast that names the file and the limit. Pictures smaller than the minimum still go in, with a toast saying they may look soft on the big screen. SVGs skip the pixel check.

| Upload | Types | Pixels | Max file size |
|---|---|---|---|
| Slide background photo | JPG, PNG, WebP | 1920 × 1080 or bigger (1600 × 1200 for 4:3) | 10 MB |
| Background video | MP4, WebM, MOV | 1920 × 1080 or smaller | 50 MB |
| Extras picture | PNG, JPG, SVG, WebP | 800 on the longest side | 5 MB |
| Brand logo (dark and light) | PNG or SVG, transparent | 600 × 200 or bigger, wider than tall | 2 MB each |
| Headline font | WOFF2, WOFF, TTF, OTF | – | 2 MB |
| Sponsor logos | PNG or SVG, transparent | 400 × 160 or bigger | 2 MB each, 6 max |
| Reactions | Square PNG, SVG, WebP, GIF | 256 × 256 or bigger | 1 MB each, 8 max |
| Slides and decks | PDF, PowerPoint, Keynote; or JPG, PNG | Images 1920 × 1080 or bigger (1600 × 1200 for 4:3) | 100 MB (images 10 MB) |
| Word pack | CSV, TXT | – | 1 MB |
| Quiz pictures | JPG, PNG, WebP | Question 1200 × 800, answers 400 × 400 square | 5 MB each |
| This or That pictures | JPG, PNG, WebP | 1200 × 800, landscape | 5 MB each |
| Poll option pictures | JPG, PNG, WebP | 400 × 400 square | 2 MB each |
| Speaker photo | JPG, PNG | 400 × 400 square, face centred (shown in a circle) | 2 MB |
| Email attachment | Any | – | 25 MB |

### Reactions (emoji shower), decided

- **Per-slide control is On or Off, and it's a higher-tier feature** (decided 29 Oct 2026). Every plan keeps the session-wide On/Off. On higher plans each slide can be Default (follows the session), On or Off. When it's off, phones hide the reaction buttons. This replaces the earlier idea of Off, Calm and Lively levels.
- **The default reaction set on every plan is 4 otters plus 4 everyday emoji** (decided 30 Oct 2026): **4 otter stickers** in the brand illustration style (clapping, heart, mind blown, party) and 👍 ❤️ 😂 🔥. Phones show up to 8 reactions, in 2 rows of 4 when there are more than 5.
- **Higher tiers** get **12 otters**, plus custom uploads (company logo or mascot; square PNG or SVG with a size limit).
- A wider library of about 30 standard emojis for the host to choose from. Hosts pick up to 8 reactions for phones from otters, emoji and their own uploads.
- **Default off on Video and your own slides** (decided 3 Nov 2026). The emoji shower starts off on Video slides and on the host's own deck slides, where a long talk means a steady trickle of taps for little value. It starts on everywhere else. On higher plans a slide can still be turned on; on every plan the session-wide On/Off stays. In the published OtterMeet artifact (version 5): a slide's Design tab says “Default here is off, so people can watch and listen.”, and the cockpit notes the shower is off.
- **Load:** phones send reaction counts at most once a second (every 2 seconds on Free), and the server keeps running totals in memory instead of storing each tap. See rule 2 in claude/hosting-cost-instructions.md.
- **The reaction set is a session setting** (decided 29 Oct 2026): it's picked once, under Choose Reactions next to Emoji shower in room settings, not per slide. Each slide only decides whether the emoji shower is on.
- Dependency: the otter stickers need new character illustrations; the design system has no character art yet. The prototype uses sketch otters as placeholders.

## Activity-specific tools

All agreed and built.

**9. Lobby:** 9a welcome line and join instructions · 9b big QR size and position · 9c avatar wall on or off, counter style · 9d lobby music · 9e sponsor logos · **9f "Show how to join" toggle, on by default (the 2 join steps; the room code always shows)** · **9g "More details": up to 3 extra lines under the join steps (lunch times, where the toilets are) that never replace them** · **9h Wi-Fi for guests: network name, password, security type and hidden network; the big screen shows a card with a real Wi-Fi QR code (scan to join the network, no typing) and phones show the name and password** (9f–h added by Timothy, built in v52)

**10. Holding screen:** 10a speaker name, role and photo · 10b subtitle · 10c live Q&A ticker

**11. Break:** 11a countdown style (big digits, ring or bar) · 11b clock time instead of countdown · 11c end-of-break message · 11d show what's up next · 11e move on by itself at zero

**12. Blackout:** 12a pure black, or dark with logo

**13. Your slides:** 13a fit (show all, fill or crop) · 13b letterbox fill colour · 13c import speaker notes from the deck · 13d join badge and reactions per slide

**14. Speed Quiz:** 14a image per question and per answer · 14b timer style and position · 14c answer colours (shapes stay, for colour-blind players) · 14d leaderboard frequency (every question, every 3, end only) · 14e leaderboard length · 14f podium style · 14g tick and reveal sound effects

**15. This or That:** 15a image per side · 15b side colours · 15c percentages or vote counts · 15d reveal animation · **15e a new This or That starts with a random dilemma from our bank, not always the same one** · **15f Majority Rule points are editable, starting at 10** · **15g optional How to Play slide before the first dilemma** (15e–g added by Timothy, built in v38; How to Play then extended to every activity in v39)

**16. Word Cloud and Poll:** 16a cloud palette · 16b cloud or ranked list · 16c max words · 16d hide a word live · 16e filter strictness · 16f poll as bars or donut · 16g live or hidden until reveal · 16h image per option · 16i multiple answers · **16j host's own banned words list (added by Timothy), applied session-wide: Word Cloud, Poll, Q&A questions and nicknames**

**17. Town Hall Q&A:** 17a names or anonymous only · 17b spotlight card style · 17c how many on screen · 17d sort by votes or newest

**18. Split Words:** 18a own tribe names and colours · 18b own word pairs · 18c progress bar on or off · **18d upload your own word pack as a CSV, higher tiers only** (added by Timothy, built in v38). Format: 1 row per pair with tribe, quad word, half 1 and half 2. Each tribe needs 2 quad words with 2 pairs each (8 people). Incomplete tribes and bad rows are skipped with a warning. We also warn when the room cap needs more tribes than the pack has.

**19. Imposter:** 19a own word list · 19b who plays together (see Decided) · 19c guess time for a caught imposter

**20. Feedback Survey:** 20a big-screen message · 20b show response count or not · 20c progress bar or dots on phones · **20d question types: Rating, Pick 1, Pick many, Comment** · **20e each rating question picks its own scale (1–3 up to 1–6) and icon (stars, hearts, thumbs up, faces, otters, flames, claps or numbers)** · **20f what the ends mean, for example 1 = “Not useful” and 6 = “Very useful”, shown under the scale** · **20g optional contact details as a last step: name, email, phone, role, company, each Off, Optional or Required; company can be picked from the host's list (plus “Other”)** · **20h signed-in guests see their name and email filled in** (20d–h added by Timothy, built in v53)

**21. Leaderboard (all games):** 21a how many places · 21b nicknames only, or hide names for privacy

**22. Keep in Touch (new stage moment, added by Timothy):** 22a heading and message · 22b up to 4 links (website, LinkedIn, Instagram, email, newsletter, other), shown as icon plus address with no extra label · 22c which link the QR code opens (a normal QR code: scanning it opens that link in the phone's browser, nothing more) · 22d contact card with Save Contact on phones · 22e email sign-up on phones, landing in the session report · **22f the sign-up fills in the email the person already gave (feedback survey first, then their account), so it's 1 tap** · **22g the follow-up email: the host writes 1 email (from name, reply address, subject, heading, message) with attachments and links (uploaded files we host, share links from Drive, Dropbox or OneDrive, recordings, the Keep in Touch links), sees a live preview, sends a test, and picks when it goes out (when the session ends, when they press Send in the report, or at a set time). It goes to Keep in Touch sign-ups and, optionally, survey emails, with nobody getting it twice** (22f–g added by Timothy, built in v53)

**23. Wrap (new stage moment, split out from the survey by Timothy):** 23a title and thank-you line · 23b up to 6 highlights that pop up one by one and fill themselves in from the session (head count, reactions, game champion, top word, poll winner, biggest debate, questions asked, tribes formed; only the ones the session has are offered) · 23c confetti · 23d a personal recap on each phone (points and place, reactions sent, questions asked)

**24. Video (new stage moment, added by Timothy):** 24a paste a link from YouTube, Vimeo, Google Drive, Loom, OneDrive, Dropbox or a direct .mp4, and the big screen streams it (nothing to upload); the setup says which service it spotted and warns when a Drive, OneDrive or Dropbox file needs “Anyone with the link” sharing · 24b start time (a YouTube link with a time fills it in) and play as soon as the slide opens, or wait for Play · 24c position Left, Centre, Right or Full Screen, and size (40–100% of the width) · 24d an optional heading and a few words beside or above the video · 24e the cockpit has Play/Pause, Restart and the time; sound comes from the host laptop; phones say “Eyes up front” and keep reactions · 24f the join badge hides on Full Screen. The prototype shows a stand-in player; the live product embeds the real one.

**Lighter, roomier big screen (asked by Timothy, built in v53, taken further in v55):** titles default to Regular weight (Semibold and Bold are still in the Design tab) and are about 20% smaller; labels and status lines drop to medium weight; big numbers (countdowns, percentages, room code tiles, scores) are smaller and less heavy. Everything stays at or above the room-size floor. Side margins grow from 64 to 96px on 16:9 (72px on 4:3), content starts lower, and quiz answers and This or That cards stop stretching to fill the screen, with bigger gaps between them.

**Preview in 1 window (asked by Timothy, built in v55; called Test Run until v60):** when the window is at least 1180 × 680, the big screen, both phones, the host cockpit and the Slides list fit without scrolling: big screen with the cockpit under it on the left, phones with Slides under them on the right. Everything sizes itself to the window, the cockpit and Slides scroll inside their own boxes, and Slides keeps the on-stage item in view. Smaller windows fall back to the scrolling layout.

**Live cockpit as a presenter view (asked by Timothy, built in v60):** Open Cockpit shows the big screen with the host cockpit under it on the left. The right column holds 3 things, always in view without scrolling:
- **Up Next:** a real, still copy of exactly what the big screen will show after the host presses Next. It covers the next step inside an activity too, for example "Speed Quiz · Question 2 · Answers open". On the last slide it shows the closing screen.
- **Speaker notes:** the notes for the slide on stage, at 18px by default, with A / A buttons from 14 to 28px.
- **Slides:** click any slide to jump to it.

The Up Next preview stays about 70% of the big screen's width (the column is 320 to 520px wide). The cockpit's own controls fold "On stage · Lobby · 1 of 14" under the title, so Next, the hint and the shortcuts stay in view. Everything fits on 1 screen from 1280 × 800 to 1920 × 1080. Preview keeps its phones on the right, and its notes and a small Up Next stay inside the cockpit. In the prototype, every Riverbank Offsite slide has sample notes. Build note: the Up Next copy of the big screen is generated from the big-screen markup, so the 2 can't drift apart.

**Animated How to Play (added by Timothy):** each of the 3 How to Play cards on the big screen opens with a short looping scene of what happens, with the brand otter as "you" and animal avatars as the other players (for example, the otter and a fox swap PINs, the bigger This or That side gets its points, the otter climbs the quiz leaderboard). Scenes follow the slide's settings: fixed scoring, Majority Rule off, the points value, poll or word cloud. The Slide View preview shows the same scenes. Text never drops below the room-size floor; on 4:3 or Hall the scene shrinks first.

**Setup tooltips (added by Timothy):** every setting in every activity's Setup tab has an ⓘ. Hover or click it for a looping mini-screen of the big screen or phone showing what each option does, with a plain description and where it shows.

## Session report (asked by Timothy, built in v61)

**Where it opens.** Finished sessions open on their report from the Sessions list, which says "Report ready". The Slides page of a finished session has a View Report button, and the report has an Edit Session button to get back. When a live session ends, the cockpit offers View Report. A preview never makes a report: its cockpit says so when it ends.

**What a report reads.** Ending a live session files the run with the session: when it started and ended, the biggest crowd, reactions, every answer, the Q&A queue, which slides were reached and how long each was on screen. The report shows exactly that. Slides the session never reached say "Not reached". Sessions that finished before the prototype show sample results that follow their own questions, with a note saying so. In the prototype the room is simulated, so names are samples.

**Header:** session name, room code, status, and the date, start and end time and length. Buttons: Edit Session, Share Report, Download PDF and Download CSV (every result, 1 row per answer).

**5 tabs:**
- **Summary:** up to 6 numbers: people joined (and the most in the room at once), took part (anyone who answered, voted or asked), reactions, questions asked, the feedback score and sign-ups. Then "Who took part, slide by slide" (a bar per answering slide) and up to 6 highlights: the most upvoted question, the points leader, the feedback score, the top word, poll and debate winners, and the slide most people joined in.
- **Slides:** a card per slide, in order, with its time on screen and how many took part:
  - This or That shows the split per dilemma.
  - Speed Quiz shows each question's answers with the correct one marked, the % who got it right, the fastest correct answer and the top 3.
  - Word clouds show the top 12 words (and how many the host hid).
  - Polls show bars with the leader marked.
  - Q&A lists questions by upvotes, marked Spotlighted, On screen or Waiting, with how many were rejected.
  - Split Words, Imposter, the survey and Keep in Touch show their key numbers.
  - Stage moments are compact cards.
- **People:** everyone who joined. Click a name to see what that person did, slide by slide: their This or That picks (with Majority Rule points), quiz answers marked Right or Wrong with points, poll votes, words, questions asked and upvoted, Split Words and Imposter. Survey answers and anonymous questions stay anonymous. Previous Person and Next Person follow the list. Each person's answers add up exactly to the slide totals. The list shows with their table (when Imposter uses tables), when they joined, how much they answered, points (when there were games) and email (only when they shared it). Ranked by points, or sorted by most answers, name or joined first. It has search and a CSV. Names are what people typed when they joined; anonymous questions aren't linked to anyone.
- **Feedback:** responses, average and contact details. Each rating question shows its average and spread, with the end labels. Pick questions show bars, and comments show 6 at a time.
- **Follow-up:**
  - The follow-up email shows its subject, sender, recipients and status. "Sent" follows the session's setting; "Ready to send" means it waits for Send Now, which asks once before it goes ("Send to 27 people"). Edit Email and Send a Test are there too.
  - Questions still waiting (never approved or rejected), with Copy Questions.
  - Contacts: Keep in Touch sign-ups and survey emails, de-duplicated, with a CSV.

**Sharing (decided by Timothy, 30 Oct 2026).** The host can share a report link. Share Report makes the link (for example ottermeet.io/r/HRQE-…) the first time. In the Share dialog, the host can:
- copy the link;
- turn it off and on again (it stays the same link);
- choose whether viewers see names and emails. Off by default: viewers see Summary, Slides and Feedback, and Q&A askers' names are hidden. On: they also see People and Follow-up.

Viewers don't need an OtterMeet account. They can download the PDF but not the CSVs, and they don't see the follow-up email controls. See What They See shows the host exactly that view.

**How long reports are kept (decided by Timothy, 30 Oct 2026).** Reports are kept in the host's account for a time set by their plan. The prototype uses example limits: 12 months on Team, and no limit while testing. Higher plans keep reports longer. The plan card on the Sessions page shows "Reports kept". The report footer and the Share dialog give the date it will be kept until.

**PDF summary (asked by Timothy, built in v62).** Download PDF previews 2 A4 pages for people who won't open a spreadsheet:
- **Page 1:** the session and date, the headline numbers, who took part slide by slide, and the highlights.
- **Page 2:** results by slide, up to 4 lines each.

Askers' names are left out. In the prototype, Save as PDF uses the browser's print window; the product would download the file directly.

**Sample data.** Year-End Splash is now a full sample session (keynote, debate, word cloud, poll, Q&A, quiz, break, survey with contact details, Keep in Touch, wrap), and its follow-up waits for Send Now. River Labs Town Hall shows a session with no games and no Keep in Touch.

## Accounts (asked by Timothy, built in v63)

The host in the prototype is Jamie Koh, People & Culture Lead at Kelp & Co (it was "Test Host").

**Getting in.** A split page: the OtterMeet story on the left ("We otter meet.") and the form on the right. Every field has a label, and errors sit under the field (ink text with an orange "!" and a thicker orange border, since there's no red in the palette). Typing clears an error.
- **Sign-in options (decided 31 Oct 2026):** Google, or email and password. Both stay.
- **No 2-step verification in the alpha (Timothy, 31 Oct 2026; removed in v86).** Logging in is Google, or email and password, and nothing else. Teammates who join by invite pick a password and they're in. The 2-step setup, code step and account row built in v71 are gone; revisit after the alpha.
- **Log In:** Continue with Google, or email and password with Show/Hide. Forgot password? sits beside the label. In the prototype any password works except "wrong", which shows "That email and password don't match. Try again, or reset your password."
- **Create Account:** Google, or name, work email, password (a live "8 characters or more" check) and agreeing to the Terms and Privacy Policy.
- **Check your email:** names the address, with Resend Email and Use a Different Email. A dashed prototype box opens the link.
- **Welcome:** 2 optional questions, the organisation and what they'll run (and how many usually come), then Let's Go or Skip for Now.
- **Forgot password:** Send Reset Link, then "Check your email" (the link works for 1 hour), then Set a New Password (twice, must match), then back to Log In with "Password changed."
- **Logged out:** "You're logged out." with Log In and a link to ottermeet.io. After deleting an account it says so instead.
- **Joining a team:** the page an invited teammate sees ("Jamie Koh invited you to Kelp & Co."): what they'll be able to do, the email fixed, name and password or Google, and Join Kelp & Co.

**Account menu.** The header shows the host's initials (or photo) and name. The menu shows their email, organisation and plan, then Profile, Team, Plan & Billing, Help Centre and Log Out. Escape or a click outside closes it. The Account link in the header opens Profile.

**Account page, 3 tabs:**
- **Profile:** photo (with the usual upload rules), name, job title, email (a new email waits until they tap a confirm link), time zone (used for report times and when follow-up emails go out), Save Changes only once something changes, and Cancel. **Logging in:** Change Password (current, new, again) and whether Google is connected. **Delete account** asks for a tick ("I understand…") and warns owners to hand over ownership first.
- **Team (no roles since v80):** organisation name, how many hosts ("3 hosts on your team, and 1 invited"; no limit in the alpha), and teammates with status (Active or Invited) and actions (Resend, See their invite, Remove or Cancel Invite, each asking first). The owner has an Owner tag and can't be removed. Invite People takes several emails and an optional note, and checks bad addresses, people already on the team and free seats. "Hosts and co-hosts" explains: everyone on the team is a host who makes and runs sessions; co-hosts are invited to one session or event, from inside or outside the team, and can run it but not edit it; the owner also looks after the plan, billing and the team. (Co-host wording changed 3 Nov 2026; see Co-hosts under "Decided 31 Oct 2026".)
- **Plan:** during the alpha there's 1 plan. "Alpha · Current plan · Free while we test · Everything included", with usage (sessions, hosts, people per session and games per session, all with no limit; reports kept at least 12 months), and "You're one of our first hosts. Everything in OtterMeet is included while we test it with a small group of hosts. There's nothing to pay and no card to add. We'll tell you well before anything changes." with Tell Us What You Think (a feedback form).

**Plans (decided 30 Oct 2026):** a single free Alpha tier while OtterMeet is tested with users. Everything is unlocked: all 12 otters, the brand kit, custom fonts, word packs and reactions. The one limit is up to 100 people per session (Timothy, 31 Oct 2026): the plan card says "Up to 100", Session Settings caps the room capacity at 100 ("The alpha allows up to 100 people per session."), and at 100 the room is full even with no limit set, so the waiting list takes over. Alpha hosts are told at least 2 months before paid plans start. The sessions page says "Alpha plan · Free while we test", the account menu says "Kelp & Co · Alpha", and the prototype bar no longer switches plans (just Reset).

**Parked for later:** the paid-plan screens from v63 (4 plans, upgrade and switch, card, billing details, invoices, Cancel Plan, and the See Plans upgrade prompts) are still in the prototype's code but hidden, ready when pricing is decided. The example tiers were Starter (free, 1 session, 50 people), Team ($29 per host a month, 5 sessions, 150 people), Business ($79, 500 people, brand kit) and Enterprise.

## Running the room and managing sessions (built in v64–v66)

**Big Screen.** In the live cockpit, a Big Screen button in the header opens "Show the big screen", which asks "Where's the big screen coming from?":
- **This Laptop:** "This laptop is plugged into the projector or TV." 3 steps: connect the laptop and set the displays to **Extend**, not Mirror; press Open Big Screen (View Big Screen once it's open) and a window opens with just the big screen; drag it to the projector and press Full Screen, so the cockpit and speaker notes stay on the laptop. Mirroring works too, but then the room sees the cockpit and notes. The window has its own keys (→, Space or Page Down for next; ← or Page Up for back; B for blackout; Esc back to the cockpit) and a small bar with Full Screen and Back to Cockpit that fades after 4 seconds and comes back on hover. In the prototype the big screen opens over the page.
- **Another Device (parked until after the alpha, 31 Oct 2026; hidden in the prototype from v71):** "A venue PC, a smart TV's web browser or a second laptop shows the big screen. This laptop stays yours, with your cockpit and notes." 3 steps: on that device open **ottermeet.io/screen** in Chrome, Edge or Safari, which shows a 6-character code; type the code in the cockpit; click once on that screen so it can play sound, then make it full screen. Wrong codes get "That code doesn't match a screen. Check the screen and try again." A dashed prototype box shows what the venue screen displays (K7P 4QX) with Use This Code.
- Once a screen is connected, the header shows "● 1 screen connected". That opens **Big screens**: each screen with Connected or Reconnecting…, what it's showing, and Disconnect; **Sound plays from** Big Screen or This Laptop (the first connected screen takes the sound, because venue PCs are usually wired to the room's speakers); See the Big Screen; Add a Screen (up to 4). A prototype link drops the connection: the chip turns orange ("Screen reconnecting…") and the screen comes back by itself a few seconds later.

**Session actions.** Every card on the sessions page has a More menu:
- **Edit Slides** (finished sessions only, since they open on their report).
- **Duplicate:** a draft called "… (copy)" with its own room code, the same slides and settings, and no results. Undo removes it.
- **Archive:** moves it to an Archived section at the bottom (collapsed, with a count). Archived sessions keep their reports and don't count towards the plan's sessions. Each has Restore, View Report and Delete. Undo puts it back.
- **Delete…** asks first: "Its slides and its report go too, and room code X stops working. This can't be undone." Keep It or Delete Session.
- A session that's live can't be archived or deleted until the host ends it; it can still be duplicated.
- On Team, Duplicate and Restore at 5 sessions offer the upgrade instead.

**Room limit and waiting list.** Room capacity (Session Settings, under Room; empty means no limit) is enforced. Once a limit is set, Session Settings asks **When the room's full**: Waiting List (the default) or Turn Away.
- **Waiting list:** a newcomer's phone says "You're next in line." (or "You're 3rd in line.") and "Riverbank Offsite is full right now (40 people). Keep this page open and you'll get in as soon as a spot opens.", with Leave the Line. When someone leaves or the host raises the limit, people get in in the order they arrived. Their phone goes to the nickname step with "A spot opened up, so you're in. Pick a name and join.", and their spot is held while they do.
- **Turn away:** the phone says "This room's full." and "N people are already in X. That's as many as the host allowed.", with Try Again.
- **In the cockpit**, the header shows "Room limit 40", or "Room's full · 3 waiting" (and "· 2 turned away") in orange. Clicking it opens **Room limit**: how many are in and waiting, "Let in up to" with +10 and +25, When it's full (Waiting List or Turn Away), Remove the Limit, and Raise to 50. The new limit can't be lower than the number already in. Raising it lets the waiting list in straight away ("Room limit is now 50. 3 from the waiting list are in."). The live cockpit's simulated room fills to the limit, so a queue builds and people leave now and then.

**Logging in on a phone (optional).** Joining never needs an account. Above the nickname there's "Have an OtterMeet account? Log in": Continue with Google or Email Me a Link (then "Check your email on this phone"), and Not Now. Logging in fills in the name, and their results stay in their account after the session. Once signed in the phone shows "Signed in as Aisha Rahman · aisha.rahman@riverlabs.sg" with "Not you?" to sign out. Sam's test phone starts signed in; Aisha's doesn't.

## Attendee passport (proposal, prototyped in v67)

From a brainstorm with Timothy on 30 Oct 2026. Attendees are usually different people at each event, but the same person goes to many events in a year (town halls, trainings, offsites, conferences), often run by different hosts. So the part that lasts belongs to the attendee and works across hosts. Rewards are for pride and fun, not real value.

**What attendees get**
- **A stamp from every session:** the event, host organisation, date and how many people were there. With it come the keepsakes they'd otherwise screenshot: links from the host, the host's slides if the host shares them (Session Settings → Your slides, off by default; Timothy, 31 Oct 2026), their own questions and their scores.
- **Small rewards for standout moments,** each labelled with the room it was won in:
  - Crown: top of the leaderboard ("beat 83 people").
  - Silver and bronze medals: 2nd and 3rd ("Finished 2nd of 38").
  - Mic: the most upvoted question ("12 upvotes").
- **Something to wear next time:** they pick 1 reward, and their avatar wears it on their phone when they join their next session.
- **Run your own session:** every passport ends with "Games, polls and Q&A for your own team. Free while we test." and Start Hosting.

**The keep moment.** On the Wrap slide and the end screen, each phone shows "Your OtterMeet passport": today's stamp, what they earned and what comes with it.
- People not signed in see "Keep today in your passport." with Keep It with Google or Email Me a Link, and "Otherwise it's gone when you close this page."
- People already signed in see "Stamped and saved, Sam." with Open My Passport.
- The passport page lists the stamps, newest first. Tapping a keepsake opens it, and Back to the Session returns to the live session.

**Rules, so it can't be gamed and stays fair**
- Crowns, medals and mics need at least 20 people in the room, the same as host levels.
- **Pebbles for smaller rooms (v77):** in a room of 5 to 19 people, topping the leaderboard or asking the most upvoted question earns a pebble instead, labelled with the room size ("Pebble · Top of the leaderboard · beat 11 people"). At most 1 pebble per person per session. Pebbles show on the stamp and in the passport's count ("5 stamps · 2 rewards · 1 pebble"), but they aren't something to wear. Under 5 people there are no rewards, only the stamp ("Rewards start when 5 or more people take part.").
- From 50 people the reward is the gold version (Gold crown, Golden mic). Bigger rooms make a bigger moment, not stricter rules.
- Every reward says how big the room was, so a win against 3 people looks like what it is.
- Hosts and co-hosts never earn rewards in their own sessions.
- At most 1 reward of each kind per person per session.
- Previews never stamp passports.
- No public profiles, global leaderboards, rarity or trading: the passport is a memory book, so faking a reward gets you nothing.
- The host can turn it off: Session Settings, Passport (on by default), for formal or confidential sessions. Off means no stamps, rewards or keepsakes from that session.

**In the prototype.** Sam starts signed in, wearing the golden mic he won at another host's session, and his passport has 4 older sample stamps from Pebble Bank, Splash Travel, River Labs (a pebble from a 9-person book club) and Otterly Studio. Preview's Simulated crowd has Big, Small (12 people, to see pebbles) and Off. Aisha starts new. A preview that skips the games hands out sample rewards, with a note saying so. Jump to the Wrap slide in Preview to try it.

**What to test first (the riskiest assumption).** Will people log in at the end of a session, while they're packing up? In the alpha, count how many people tap Keep It on the wrap screen, against how many were in the room. Set the bar before testing (for example, 1 in 10). If it's well under, the passport isn't worth building further yet.

**Parked:** levels, points and anything that needs frequent use; rewards on the big-screen podium (the bigger moment for 50+ rooms); anything with real-world value (training certificates, prizes), which would need verified organisations first.

## Host levels (asked by Timothy, prototyped in v68, revised in v69)

Hosts earn levels too, from Pup up to Super Host, so OtterMeet rewards the people who choose it. Only 2 sessions a month count, and only sessions with 20 or more people that run at least 45 minutes, so levels can't be rushed or gamed. That also nudges hosts towards bigger, better get-togethers (Timothy, 30 Oct 2026).

**The levels.** Perks confirmed by Timothy, 9 Nov 2026. In the alpha everything is already included, so perks are fun and recognition, not features held back.

| Level | Name | Sessions that counted | Perk (proposal) | Your otter's pick |
|---|---|---|---|---|
| 1 | 🦦 Pup | 0, where everyone starts | Host badge on your account and report links | Its fur colour |
| 2 | 🛶 Paddler | 1 | The Party reaction pack (🎈 🪩 🥳 🎊) | A hat |
| 3 | 💦 Splasher | 4 | 3 extra lobby music tracks | Something for its neck |
| 4 | 🪵 Raft Builder | 9 | The Golden Hour session theme | Something to hold |
| 5 | 🧭 River Guide | 16 | Winner’s celebration: gold confetti and a short fanfare when a game reveals its winners (replaces early access, v42) | Another hat |
| 6 | 🌊 Current Rider | 25 | Your otter on the Lobby slide | Another thing for its neck |
| 7 | 🌿 Kelp Keeper | 36 | Your otter as a reaction in your sessions (replaces the LinkedIn certificate, v77) | Another thing to hold |
| 8 | 🌙 Tide Turner | 50 | 6 extra otter sticker poses | Anything, from any place |
| 9 | ⚓ Raft Captain | 70 | A reserved room code of 4 to 6 letters, like KELP: 1 per account (the team shares it on Team and Business; the first level 9 host picks it, and an admin can change it). Kept while the account is open; if 2 sessions are live at once, the second gets a usual code (v42) | Anything, from any place |
| 10 | 🏆 Super Host | 100 | Golden fur for your otter, and a Super Host badge on your big screen, report links and organiser page. No plush (v42) | The Super Host cape (no choice) |

After Super Host, every 25 more sessions add a star (Super Host ★★). At 2 sessions a month the top levels take years, but the product never says how long a level takes: hosts see sessions, not months (Timothy, 31 Oct 2026). Higher-level hosts will also hear from the OtterMeet team offline, as a community, so that isn't a product perk.

**What counts**
- A live session the host ran and ended. Previews never count.
- 20 or more people joined on their own phones. Small groups are too easy to count.
- It ran at least 45 minutes, from opening the cockpit to ending the session.
- The first 2 sessions to end each calendar month, in the host's time zone. More sessions are welcome, but they don't count.
- The host and up to 2 co-hosts earn it. Co-hosts have to open the cockpit while it runs, and it uses one of their own 2 a month (decided 31 Oct 2026).
- A run only counts once, however many times the report is opened.
- Levels never go down.

**Where it shows**
- **Live cockpit:** nothing about levels while the session runs, so the host stays focused on the room (Timothy, 30 Oct 2026). The prototype has a small Skip Ahead 45 Minutes link so the 45-minute rule can be tried; it isn't part of the product.
- **Sessions page:** nothing about levels (the card was removed in v77, Timothy, 31 Oct 2026). The way in is the account menu.
- **Account menu:** "Host level 3 · Splasher", and a Host Level item.
- **Account, Host Level tab:**
  - The current level, with the host's otter, progress and what the next level unlocks.
  - **Your otter:** a large preview and 5 rows to dress it: Fur, Round its neck, Hat, Glasses and In its paw. Locked items show what unlocks them ("Level 6", "3 pebbles") and say so when tapped.
  - **Pebbles from smaller sessions:** the count, this month's pebbles (up to 4) and the 4 pebble rewards.
  - **This month:** 2 slots, each either a session that counted or "Open: your next live session with 20 or more people that runs 45 minutes or longer counts". Once both are used: "Sessions count again from 1 Nov."
  - **What counts:** the rules above.
  - **The levels:** all 10 with their perks, the session count each starts from, and status (Unlocked, You're here, or N more sessions). No months or years.
  - **Sessions that counted:** the history.
- **Session report:** a banner for the host (never for people viewing a shared link). It says one of:
  - "Level up! You're now Level 4 · Raft Builder." with the unlocked perk.
  - "This session counted towards your host level. That's 2 of 2 this month."
  - "Only 2 sessions a month count… Sessions count again from 1 Nov."
  - "A session needs to run at least 45 minutes to count. This one ran 12 minutes."
  - "You earned a pebble. Sessions under 20 people earn pebbles instead of counting towards your level. You have 3 pebbles. That unlocks the spotty neckerchief for your otter."
  - "Sessions need 5 or more people to earn a pebble, and 20 or more to count towards your level. This one had 3."
  - "Smaller sessions need to run at least 20 minutes to earn a pebble." · "You've had your 4 pebbles this month."

**Perks (built in v71).** Each perk lives where it's used, and Account → Host Level has **Your perks**: all 10, marked Yours or "Level N", with where to find each and a button where there's something to do.
- **Host badge:** "Hosted by Jamie Koh · host level 3, Splasher" under the title of every report, including shared links.
- **Party reaction pack:** a Party tab in Choose Reactions with 🎈 🪩 🥳 🎊.
- **3 extra lobby tracks:** Lantern Swing, Bubble Pop and Campfire Glow, original loops in the music menu on slides and in the cockpit (marked "host perk").
- **Golden Hour theme:** a warm amber preset in Session Settings → Theme, shown with a lock and "Host level 4 perk" until then.
- **Early access to new games:** new games reach these hosts' libraries first, marked Early access (next up: Two Truths and a Lie).
- **Your otter on the Lobby slide:** the host's otter, dressed their way, with "Your host · Jamie · Current Rider" in the Lobby slide's bottom bar. It can be turned off.
- **Your otter as a reaction:** phones in the host's sessions get one more reaction, the host's own otter ("Send Jamie's otter"), which floats up the big screen like the others. It can be turned off.
- **6 extra otter sticker poses:** arrive with the illustrated otter set.
- **Your own room code:** Pick Your Code, for a 4-letter code like KELP when nobody else is using it (a toast in the prototype).
- **Super Host:** Send My Plush (asks for a postal address), and the lobby chip says "🏆 Super Host".

Each perk card also says which pick comes with its level ("For your otter: another hat").

**Your otter (v77, picks revised in v78 and v79).** Every host has an otter that grows into its own character (Timothy, 31 Oct 2026).
- A few places only: head, neck and paw, plus 2 open picks. Level 1 is its fur and level 10 is the Super Host cape; levels 2 to 9 go hat, neck, paw, hat, neck, paw, open, open (reordered in v80).
- Each pick is from the items in that place the host doesn't have yet, and it's theirs for good.
  - Fur: Chestnut, Cocoa, Sandy, Silver, Ginger.
  - Head: Straw Sun Hat, Beanie, Bucket Hat, Hard Hat, Party Hat, Captain's Hat.
  - Neck: Blue, Amber, Green, Coral or Spotty Neckerchief, Bow Tie.
  - Paw: Paddle, Microphone, Coffee Cup, Notebook, Shell, Favourite Pebble.
  - Open picks can be anything from any place, including places only open picks reach: a chest pin (Anchor, Ship's Wheel, Compass, Lighthouse, Star), something for its ear (Flower, Feather, Bow, Star Clip, Leaf) or its wrist (Kelp Band, Friendship Bracelet, Watch, Sweatband, Shell Bracelet).
- Picks stay with the host for good, but the otter wears one thing per place and the host can change or remove it any time: "What it's wearing" switches between their own picks in each place, or nothing, the Super Host cape included.
- No tail, feet or eyewear items. Everything can be made for a soft toy, so picks can become swag as the community grows, and the level 10 plush comes wearing them.
- On the Host Level tab, "Your otter" shows the whole otter and a row per level: picked ("Beanie · Yours for good"), waiting (options to try on, then Keep the Captain's Hat), or later ("At level 4: something for its neck."). After a level up the report says "Your otter's new pick is waiting under Host Level."
- The Lobby slide (level 6) and reactions (level 7) use the otter's head and shoulders. Picks are kept if a host's level is shown lower, and come back with the level. The prototype has Clear Otter Picks to try again.
- Drawn in the prototype's sketch style until the illustrated otter set arrives.

**Pebbles: minor wins for smaller sessions (v77, rewards revised in v78).** So smaller get-togethers aren't left out, with smaller rewards (Timothy, 31 Oct 2026).
- A live session with 5 to 19 people that runs at least 20 minutes earns the host a pebble. Up to 4 pebbles a month. Pebbles never count towards levels.
- Pebbles unlock what sits behind the otter, so they never take one of the otter's places: Sunny River at 3, Kelp Forest at 6, Pebble Beach at 10, Starry Night at 15. Hosts can switch backgrounds any time.
- Attendees in rooms of 5 to 19 get pebbles too (see the passport).
- The prototype's Host Level tab has Add a Small Session, which ends a 12-person, 30-minute session. Jamie starts with 2 pebbles, so the first one unlocks Sunny River.

There's no discount for higher levels when paid plans arrive (Timothy, 31 Oct 2026). The prototype's Host Level tab has "Prototype: preview a level" to see any level's perks; Reset puts Jamie back.

**In the prototype.** Jamie starts at Level 3 · Splasher, with 8 sample sessions over 6 months (1 this month) and 2 pebbles. His otter has Chestnut fur and a beanie, and his level 3 pick (something for its neck) is waiting. Open the cockpit for Riverbank Offsite, press the prototype's Skip Ahead 45 Minutes, run it to the end and press View Report: it counts as 2 of 2 and levels Jamie up to Raft Builder. A 2nd live session in the same month shows the "didn't count" banner.

## New hosts and smaller screens (built in v71)

**Empty sessions page (copy revised 2 Nov 2026).** A host with no sessions sees a dashed card: "Your first session starts here." and "A session is one part of your get-together, like the welcome, a team quiz or the Q&A. It holds the games, polls and Q&A, your own slides, and the room code people join with. Most hosts build their first one in about 15 minutes.", with Create Your First Session and "New to OtterMeet? Read the 5-minute guide". The prototype bar has New Host View to see it (Reset brings the samples back).
- Why it changed: with Events coming, the get-together is the event, and a session is one part of it. The old line ("A session is everything for one get-together") would contradict that.
- When Events ships, add a second link under the button: "Planning a whole day? Start with an event". The button stays the one action.
- The published OtterMeet artifact has the new line. The design file still has the old one.

**Phones and tablets for hosts.** Every host screen works from 390px (phones) and 820px (tablets) with no sideways scrolling. On narrow screens the account button shows initials only, Slide View stacks the slide list above the slide, and the team table scrolls inside its box. The cockpit stacks the big screen, controls, notes and Slides in one column.

**Room codes (decided 31 Oct 2026, built in v80):** a session gets its 4-character room code when it goes live, so nobody can hold codes they aren't using. The code is the session's until it ends. Drafts and finished sessions show no code: every session card shows its created date ("Created 27 Oct 2026"), and only a live one shows "Room K7PX". The session header says "Room code when you go live", and editor previews show •••• where the code goes. A Preview of a session that isn't live uses the code TEST. Going live says "You're live. Your room code is K7PX. It's yours until the session ends."

**Tables (31 Oct 2026):** assigning seats ahead of time needs a guest list, which waits for the Events module. For launch, seating is arranged offline and each phone asks for "Your table · the number on your table" when someone joins (or Not sure yet), as built. The host sets how many tables there are, and can name them, in Session Settings → Room.

**Follow-up email sender (decided 31 Oct 2026):** hello@ottermeet.io, shown as "Jamie Koh via OtterMeet", with replies going to the host.

## Decided 31 Oct 2026, built in v81 to v85

Timothy agreed these on 31 Oct 2026, in the "OtterMeet: decisions to make" doc. All are in the prototype except the emails, which are listed here for engineering. Still open: who writes the help articles.

**Co-hosts (built in v80 and v81; rules changed 3 Nov 2026. The new rules are in the published OtterMeet artifact, version 3, but not yet in the Claude Design file)**
- **Hosts and co-hosts.** Everyone on the team is a host: a paid seat that makes sessions and events and edits their slides. Any host can open and edit a teammate's session. A co-host is free, and belongs to one session or event, not to the team, so there are still no team roles.
- **Who can co-host:** anyone with an email address, inside or outside the organisation (a manager from another team, an event agency). Up to 2 per session, invited in Session Settings → Room → Host and co-hosts. An event can invite co-hosts to help with check-in.
- **What a co-host can do:** take the controls in the cockpit; approve, reject and spotlight questions; see people and remove someone; see speaker notes and Up Next; see the report and download its PDF. On an event: check people in and see the guest list.
- **What a co-host can't do:** edit slides or session settings; edit an event's agenda, guest list or emails; create sessions or events; download CSVs or contacts; send the follow-up email. Because co-hosts can't make or change content, one paid seat can't be shared to build a company's sessions.
- **Joining without an account:** the invite email (“Jamie Koh invited you to co-host Riverbank Offsite”) has a link tied to that address. It opens “Co-host Riverbank Offsite” with Continue with Google or Email Me a Link, which makes a free co-host account in one step, with no password. Someone who already has an OtterMeet account logs in. A forwarded link doesn't work for anyone else, because they must log in with the invited address. The cockpit always needs a login, never just a link, because it shows unapproved questions, names and speaker notes.
- **How long it lasts:** co-host access ends when the session ends (for an event, when the event ends), and they can still see the report for 30 days. The host can remove a co-host at any time. If a co-host wants to build their own sessions later, the same account can start a free plan.
- **In the artifact (3 Nov 2026):** Session Settings → Room → Host and co-hosts has Add a Teammate and “Invite someone by email” (Send Invite, with errors for a bad address, your own email or someone already invited). Invited people show “Invited · hasn’t joined yet” with See Their Invite, which opens the co-host invite page; Continue with Google or Email Me a Link marks them “Joined”. The hidden paid-plan screens now use Free, Team ($19), Business ($39) and Enterprise (Contact us), with no session or game limits on paid plans, 200 and 1,000 people, and every host a paid seat. The Alpha plan is still what hosts see. The co-host cockpit is in version 5: in a live cockpit, “Prototype: See This as a Co-host” shows the same cockpit as the co-host (titled Co-host cockpit, with a Co-host tag and banner). Edit Session becomes Leave Cockpit, the host starts with the controls, and Next, Previous and Blackout wait until the co-host presses Take the Controls. Version 6 (3 Nov 2026) adds: Team gets the logo and accent colour (fonts stay Business); “Prototype: See the Report as a Co-host” on the report shows the whole report with the PDF but no CSVs, contacts, sharing, follow-up sending or removing people; and downloads work in the artifact through its downloads capability (CSVs, and a real 2-page A4 PDF made in the page). Contact cards (.vcf) can't be saved from an artifact, so Save Contact explains what happens on a phone.
- **Pricing:** co-hosts are free on Team, Business and Enterprise. The Free plan has no co-hosts, since it's for small sessions and events (Timothy, 4 Nov 2026). See the “OtterMeet pricing proposal” doc (https://claude.ai/artifact/6o7TuMvNVkYFfGVRCfVVbH).
- **Co-hosts earn too:** the host and both co-hosts earn host levels (and pebbles from smaller sessions) from a session that counts, on the same rules. A co-host earns only if they opened that session's cockpit while it ran, and it uses one of their own 2 sessions a month. The report says "Mei Lin Tan earned it too. It didn't count for Farid Rahman, who didn't open the cockpit."
- **One person has the controls:** the host starts with them. Anyone else in the cockpit sees "Mei Lin Tan has the controls. You can still approve questions and watch the room." with Take the Controls. Without the controls, Next, Previous and Blackout don't work, and ending the session is the last Next. The prototype has "Prototype: Mei takes the controls".
- Co-hosts can see the report, which says "Hosted by Jamie Koh with Mei Lin Tan". They get an email when they're added (see Emails).

**Reports and people's data (built in v82)**
- **Remove This Person**, in a person's answers on the People tab: "Remove Ravi H.? Their name, email and answers are cleared from this report and its downloads for good. The totals stay the same." They show as "Removed person", drop out of contacts and the CSVs, and still count in every total. Viewers of a shared link can't remove anyone.
- **Took part** counts answers, votes and questions: "62 of 68 people answered, voted or asked". Reactions keep their own number: "About 11 per person. They don't count as taking part."
- **Who waited**, under the summary numbers when the room filled: "The room was full at 60 people. 12 people waited for a spot: 9 got in and 3 were still waiting at the end." With Turn Away: "3 people were turned away."
- **Kept for 12 months:** "Alpha reports are kept in your account for at least 12 months, until Sat 12 Dec 2026 or later." The plan page says "At least 12 months".

**Phone edge cases (built in v83; all 8)**
- **Lost signal:** a strip across the top, "Reconnecting. Your answers are saved." Then "You're back. Nothing was lost."
- **Reopened tab or locked phone:** the browser remembers them for the session: "Welcome back, Sam. You're still in, with your 2,690 points."
- **Joined late:** mid-quiz "You joined partway through the quiz. Your points start from the next question."; mid-Imposter "You joined partway through. Watch this round, and you're in the next one."; otherwise "You joined partway through. Here's what's on now."
- **Host's laptop drops:** phones say "The host is reconnecting. Hang tight. You won't lose your place."; the cockpit says "Reconnecting. The room stays on this slide, and phones say “The host is reconnecting.”" Next and Previous wait until it's back.
- **Session ended:** the end screen with the passport card stays 24 hours ("This page stays here for 24 hours."), then "This session has ended."
- **Same nickname:** "Someone's already Sam. How about Sam T?" with a Use Sam T button. Logged-in people get their surname initial, others their animal ("Sam Fox"), then a number.
- **The host removes someone:** See People, next to the room count in the cockpit, lists everyone with search and Remove: "Remove Aisha? They can't rejoin, and their phone will say “The host removed you from this session.”" Removed people are listed under Removed, with Let Back In.
- **2 tabs:** "You're already in on another tab. OtterMeet runs in one tab at a time, so your answers don't get mixed up." with Use This Tab.
- The prototype tries these with "Prototype, what if:" buttons under each test phone (Lose Signal, Close and Reopen, Open a 2nd Tab) and "Prototype: Lose the Cockpit's Connection".

**Passport (built in v84; more rewards after the alpha; the host's level stays off stamps)**
- ottermeet.io/passport (Google or an email link), and "Your passport" in the follow-up email. The passport says "Open your passport any time at ottermeet.io/passport."
- **Remove This Stamp** on each stamp: "Remove the Pebble Bank Town Hall stamp and what you earned there? You can't get it back."
- **Delete My Passport:** "Delete your passport, with every stamp and reward? This can't be undone. To come off a session's report as well, ask that session's host." Afterwards: "Your passport is deleted. If you keep a stamp from your next session, it starts a new one."
- The report shows "Kept their passport: 21 of 68" (logged in to keep today's stamp), the alpha's main measure. It's hidden when the session's passport is off.
- More rewards (20+ people, 1 of each per session): ⚡ Fastest correct answer, 🗣️ Biggest word, 🕵️ Caught the imposter, 🎭 Fooled everyone, 🤝 First pair found, 💌 Told us how it went (everyone who finishes the feedback survey).

**Emails (agreed, including Your report is ready)** (from hello@ottermeet.io, 1 button each, with a "why you got this" line)
- Hosts: confirm your email, reset password, new sign-in or password changed, team invite, co-host invite (with the log-in link), your report is ready (3 headline numbers), level up, alpha notices (paid plans 2 months ahead, reminder 2 weeks before).
- Attendees: passport sign-in link, the host's follow-up ("Jamie Koh via OtterMeet", replies to Jamie), and a stamp email with keepsakes (folded into the follow-up when the host sends one).
- No marketing without opt-in.

**Help (built in v85; who writes the articles is open)**
- A Help button in the header of every host screen, and in the live view next to Restart. It opens a panel with articles for that screen first ("For your sessions", "For the live session"), search, all topics, Ask Us (emails hello@ottermeet.io) and "Status: All systems normal" (status.ottermeet.io).
- Topics: Getting started, Building slides, Each game, Running the room, Phones and joining, Passport, Reports, Account and team, Alpha and plans, Privacy. The prototype has 24 short draft articles.
- **Day-of checklist**, to tick off or print. The day before: run a preview, check videos play, charge the laptop and pack an adapter. 30 minutes before: venue Wi-Fi, Extend displays (not Mirror), Open Big Screen on the projector, a sound check, join from your own phone, Do Not Disturb.

**Small ones (built in v85, all 7)**
- **Save Contact** downloads a real contact card (jamie-koh.vcf) with name, role, email and links.
- **Video links test-play** when added ("YouTube video. It plays: we test-played it just now.", or "This video can't be shown here. Use another link, or a link to the video file.") and again when the cockpit opens ("It played when we tested it as the cockpit opened."). Changed from "Upload the file", since video slides stream from a link and have nothing to upload. In the prototype, a link with "private" in it fails.
- **Music keys:** 1 to 4 set the level for the slide on stage, M mutes. The cockpit's shortcut line shows them when music is on.
- **Title styles stay off phones:** "For the big screen. Phones keep their own easy-to-read titles, in the theme colour."
- **Video backgrounds:** "It fills the screen from the centre, so keep what matters in the middle."
- **Contact details privacy line:** "Only Jamie Koh at Kelp & Co sees this, to follow up on this session." on the Keep in Touch email and the survey's contact step, plus an optional Privacy policy section in Session Settings whose link shows underneath.
- **Music:** "Every track is composed for OtterMeet, so it's cleared to play at any event."
- **After-session page: Later.** Room codes are handed back when a session ends, so it would need its own lasting link (ottermeet.io/s/riverbank-offsite-x7k2). Add it if alpha testing shows people asking for the slides. When it's built, the link stays open for 30 days after the session (Timothy, 31 Oct 2026).

## Big screen on another device: requirements (draft, 30 Oct 2026; parked until after the alpha)

Timothy asked what supporting venue PCs and smart TVs would need. This is the proposal; the prototype shows the host's side.

**Pairing**
- The device opens a short address, ottermeet.io/screen, with no login. Screens never log in, because venue PCs are shared and someone else may use them next.
- It shows a 6-character code (letters and numbers, leaving out look-alikes such as 0 and O, 1 and I) and a QR code. A code lasts 10 minutes and works once.
- The host types the code in the cockpit. Later, they could scan the QR code with a phone they're signed in on.
- Pairing gives the screen a display-only pass for that 1 session. It shows the big screen and nothing else: no speaker notes, no cockpit, no editing, and no names except what the big screen shows. The pass ends when the session ends or the host disconnects it, and the screen goes back to showing a new code.
- Up to 4 screens per session: the main projector, side screens and an overflow room.

**Staying in step with the cockpit**
- Slide changes reach the screen in under half a second on ordinary venue Wi-Fi. Reactions, votes and word clouds stream in as they happen.
- Works on locked-down company and hotel networks: outbound HTTPS on port 443 only, using WebSockets, with a fallback (server-sent events or long polling) where a proxy blocks them.
- If the connection drops, the screen keeps the last slide and shows a small "Reconnecting…" badge in a corner, never a blank or error page. When it's back, it jumps to the slide the host is on. The cockpit shows "Screen reconnecting…" so the host knows.
- The screen stays awake (the browser's Screen Wake Lock) and hides the mouse pointer.

**Sound**
- Browsers block sound until someone clicks the page once. The screen shows "Click to turn on sound" until it gets that click, and the cockpit warns if sound is set to come from a screen that hasn't been clicked.
- The host picks where sound plays: the big screen (usually wired to the room's speakers) or the laptop. Only 1 plays, so there's no echo.

**Devices and browsers**
- **Must work in the alpha:** current Chrome and Edge on Windows and macOS (venue PCs and second laptops), and Safari on macOS.
- **Should work:** Chrome on Google TV and Android TV boxes, and sharing the big screen window from Zoom Rooms or Microsoft Teams Rooms.
- **Best effort:** the built-in browsers on Samsung and LG smart TVs. They're slow, short on memory and awkward to type into with a remote, so screens need a light mode: a still frame instead of video backgrounds, fewer emoji in showers, simpler transitions, and fallback fonts.
- **Not in the alpha:** TV apps, and Chromecast or AirPlay receivers built for OtterMeet. Casting a Chrome tab or AirPlay mirroring already works like any window, but it's mirroring, so hosts should send the big screen window, not the whole display.
- **Output:** any size from 1280 × 720 to 4K, 16:9 or 4:3 (the existing 4:3 option), with the projector-safe area.

**Worth adding:** a "Test this screen" check on ottermeet.io/screen that tests the connection, plays a sound and shows the safe area, so a host can check the venue the day before.

## Marketing website (9 Nov 2026)

The website design is the canvas artifact "OtterMeet landing page" (https://claude.ai/artifact/RXKvHPaM7vYK2g3Rj3zbxe), version 42. How to build it is in `claude/ottermeet-tech-spec.md` (Next.js on Vercel, section 3).

**Pages (Timothy cut it down to these on 7 Nov 2026):**
- **Home:** benefits and value. Hero with a For teams / For communities switch, the problem, what you get, teams and communities, a sample proof section, the passport, the "ought to meet" note linking to About, questions, and Start Free.
- **The room:** what sessions do (games, the cockpit, phones, calm when live, the report). Dark theme.
- **Events:** the event page, guest list, one QR code from door to room, organiser page, after.
- **About:** "Why we built OtterMeet", signed "The OtterMeet team" (no personal name), and "Why otters?". The 3 characters are not explained on the site.
- **Help Centre:** topics, search and articles.
- **Contact:** name, email, topic and message, with a thank-you state. Linked from every footer.
- **Join a session:** room code (4 to 6 letters, since reserved codes can be up to 6), then nickname, then "You're in the raft." Linked as "Join a session" in every header ("Join" on phones).
- **Start Free and Log In:** sign up, log in, reset password, check your email, and the 2 welcome questions.
- **404 page:** "This page drifted off." with Otto.
- **Share image:** a 1200 × 630 board for link previews.
- **Privacy and Terms:** drafts for Singapore, minimum age 18 and PDPA. Company name, date, DPO, under-18 sessions and liability are still blank. Timothy, 9 Nov 2026: leave them for now.

**Hidden at launch (not in the menu, footer or sitemap):**
- **Explore:** public events near you, with filters and an event view. Turn on when a city has enough public events.
- **Pricing:** Free, Team ($19) and Business ($39) per host a month billed yearly, plus Enterprise. Hidden while the alpha is free.

**Decisions:**
- Fonts: Plus Jakarta Sans for headings and buttons (Fraunces removed for its F and J, 8 Nov 2026), Inter for text. Same change in the prototype (v43).
- Links have no underline; links in running text are bold. Calendar and Maps links are pill chips.
- Full-body art of Otto, Rue and Fin from the pose sheets.
- Proof: Timothy, 9 Nov 2026: use placeholder numbers and quotes for now. They are labelled "Sample · replace before launch" with bracketed names, so they can't be mistaken for real ones. Replace with real numbers and quotes, with permission, before launch.
- Every page checked at 390 px wide: no sideways scroll. Fixes: the separator dots in the "What's included" strip hide on phones, the hero otters move in from the edge, and the hero caption sits between the otter and the phone.
- Favicon and app icons (9 Nov 2026): Otto's head and neckerchief on the orange, in the `ottermeet-icons` set (favicon.ico, icon.svg, apple-icon.png, 192 and 512 px, maskable, web manifest).
- Before the move to Claude Code: a README and the technical spec (Rails API, Next.js) were written on 9 Nov 2026.

## Build log

All built in the prototype on 29 Oct 2026.

- **v37:** Setup / Design / Notes tabs in Slide View. Theme presets (OtterMeet Dark, OtterMeet Light, Kelp Forest, Sunset Social); brand kit (logo, accent, headline font), locked on the Team plan; per-slide background with a readability check; join badge rules plus per-slide Default/Show/Hide; Apply to All Slides (with Undo) and Reset to Theme; speaker notes in the cockpit.
- **v38:** light and dark logo versions; per-slide emoji shower (higher plans); This or That 15e–g; Split Words pack upload (18d).
- **v39:** How to Play slide for every activity (big screen and phones). Lobby, Holding, Break, Blackout and Your Slides options (9–13).
- **v40:** Speed Quiz, This or That and Leaderboard options (14, 15, 21), with sound effects.
- **v41:** Word Cloud, Poll and Q&A options (16, 17), including the session banned words list.
- **v42:** Split Words, Imposter and Survey options (18–20).
- **v43:** extras (text box, picture or otter sticker, sponsor strip) in safe zones; transitions; background music and sound effect volumes; projector-safe-area guide.
- **v44:** reactions: otter pack, emoji library, custom uploads, up to 5 on phones.
- **v45:** looping video backgrounds; custom font upload (higher plans); rotating sponsor logos; 4:3 output; layout picker for Holding, Lobby, Speed Quiz and This or That.
- **v74:** our 3 characters, as set out in the voice guide: crew cards say "Otto · Raft leader", "Rue · Raft keeper" and "Pip · Helper"; Rue keeps the time (break screen, the cockpit's break hint, the Q&A queue) and sends test emails; Otto welcomes the room on the big screen ("Otto is ready to welcome the first arrival."); Pip appears at the first question of a quiz ("Pip is stretching for the quiz. He's never stretched before.") and when a break ends ("Pip saved you a seat. He's sitting in it."). Plain Words hides all three.
- **v75:** copy checked line by line against the voice guide. "Paws" is gone (only raft, hop in and swim off are playful words), durations are in words ("Answers open in 4 seconds"), "one" is a word when it means a single or any, times say am or pm, our own names use "and" ("Word Cloud and Poll"), errors say how to fix it, "Continue with Google" on Create Account, "Click the cockpit, then use…" in the cockpit, and "You came 1st!" is the plain twin of "You're the top otter!". The full list is in section 13 of the voice guide.
- **v76:** paws and float joined the playful words, so "Get your paws ready.", "Faster paws score more", "Link Paws", "Paws linked.", "Stretch those paws.", "Quick paws win." and "we'll float you on to the next one" are back. Each has a plain twin that Plain Words switches to.
- **v77:** the host level card is off Your sessions; the levels never say how many months or years a level takes; hosts dress their own otter, and every level unlocks an item for it; "Your otter as a reaction" replaces the LinkedIn certificate at level 7 and "Your own room code" replaces the host council call at level 9; pebbles reward sessions of 5 to 19 people for hosts (avatar extras) and attendees (a pebble on the stamp); Preview's Simulated crowd has a Small option. The canvas lost the "Creating a session" page and the redesign screens, which the prototype replaces; the 3 "as it ships today" boards stay on a page called "Before: the product today".
- **v78:** otter picks reworked with Timothy: each level from 1 to 9 offers 5 things for one place on the otter (fur, neck, paw, head, ear, tail, wrist, feet, chest pin), picked once and for good; level 10 is the Super Host cape alone; no place repeats; no eyewear; everything can be made for a soft toy. The whole otter is drawn on the Host Level tab, with head and shoulders on the Lobby slide and in reactions. Pebbles now unlock backgrounds behind the otter instead of neckerchiefs.
- **v79:** otter picks simplified with Timothy: levels 2 to 9 go hat, hat, neck, neck, paw, paw, open, open, each picked from the items in that place the host doesn't have yet; open picks reach any place, including chest pins, ears and wrists; tail and feet items are gone; hosts switch which of their picks the otter wears. New items: Party Hat, Bow Tie, Notebook.
- **v80:** built on Timothy's canvas edits (Slide View before Grid View; no Move Earlier or Move Later). Room codes are handed out when a session goes live, and session cards show their created date. Otter picks go hat, neck, paw, hat, neck, paw, open, open, and the cape can come off. "Your slides" in Session Settings decides whether people can keep the slides (off by default). No backup codes: "No phone? Email me a code instead". No team roles: everyone hosts, and teammates are added to a session as co-hosts in Session Settings.
- **v81:** co-hosts, as agreed in the decisions doc: up to 2 per session; they earn host levels and pebbles if they opened the cockpit; one person has the controls, with Take the Controls; the report credits them ("Hosted by Jamie Koh with Mei Lin Tan").
- **v82:** reports and people's data: Remove This Person, "Took part" without reactions, who waited when the room was full, and the 12-month promise for alpha reports.
- **v83:** phone edge cases: lost signal, coming back, late joins, the host reconnecting, the 24-hour end screen, nickname clashes, 2 tabs, and See People in the cockpit to remove someone (with Let Back In).
- **v84:** the passport page: Remove This Stamp, Delete My Passport, the ottermeet.io/passport line, and "Kept their passport" in the report.
- **v85:** Help in every header, with articles for each screen, search, topics, the day-of checklist, Ask Us and the status link; and the 7 small items (.vcf contact cards, video test-play, music keys, title styles and video backgrounds notes, the privacy line and link, composed music).
- **v86:** no 2-step verification in the alpha: Log In goes straight in after the password, the email link after sign-up goes straight to Welcome, and the account page has no 2-step row.
- **v87:** pre-launch polish review (1 Nov 2026; the "OtterMeet: pre-launch polish review" doc has the full list and 5 open calls). Phones: compact sign-in, one-row header, wrapping tabs, scaled previews, a scroll cue on wide tables. The preview cockpit keeps Previous and Blackout in view at 1440 × 900 and can scroll. A finished preview shows Back to Editing. The room limit dialog flags a number over the plan as it's typed. The join badge is hidden on Keep in Touch and after the session ends. Editor previews use the slide's name as the small heading, as the big screen does. A slide with nothing uploaded says "Upload a slide". Session names are capped at 60 characters and wrap. Copy fixes from the voice guide, accessibility fixes (reduced motion, focus rings, contrast, keyboard-scrollable regions), matching dropdown chevrons and a browser tab title for each screen.
- **v88:** checked against the hosting cost rules in `claude/hosting-cost-instructions.md`. Phones no longer show a live headcount on the join screen, since they don't get join and leave updates. The deck upload hint says every page is resized for the big screen.
- **v72:** copy brought in line with the voice guide: "Pick one"; no exclamation marks in Rue's lines; "3 hosts on your team"; "log in" everywhere; crew cards say "Rue · Raft guide" and "Otto · Timekeeper"; no wordplay on the account-deleted page; plain twins for every playful line, previewed with the prototype bar's Plain Words button.
- **v71:** alpha limit of 100 people per session (plan card, Session Settings, room limit dialog, full at 100) and 2 months' notice before paid plans; 2-step verification for password logins (setup, backup codes, code on Log In, account controls); host level perks built where they live (report badge, Party reactions, 3 lobby tracks, Golden Hour theme, lobby otter, certificate, council, plush) with Your Perks and a level preview; empty sessions page with New Host View; host screens checked and fixed at phone and tablet widths; follow-up email from hello@ottermeet.io; Another Device hidden until after the alpha.
- **v70:** attendee rewards also need 20 or more people; the host-level line in the live cockpit is gone (the prototype keeps a Skip Ahead 45 Minutes link).
- **v69:** host levels revised: sessions need 20 or more people and at least 45 minutes to count; Super Host at 100 sessions, with levels at 1, 4, 9, 16, 25, 36, 50, 70 and 100, and a star every 25 after that; the live cockpit shows progress towards counting, with a prototype Skip Ahead 45 Minutes.
- **v68:** host levels: 10 levels from Pup to Super Host (stars after), only the first 2 qualifying sessions a month count; a level card on the sessions page, a Host Level tab and menu line in the account, and a report banner (level up, counted, or why it didn't count).
- **v67:** attendee passport, as a proposal to test: the keep card on the Wrap and end screens (Keep It with Google or an email link), the passport page with stamps from different hosts, keepsakes, rewards labelled with the room size and Run Your Own Session; the avatar wears the chosen reward; Passport on or off in Session Settings.
- **v66:** single free Alpha plan (paid-plan screens hidden, prototype plan switch removed); Google is the only social sign-in, for hosts and on phones; a waiting list for full rooms (default) with Turn Away as the alternative, and a Room limit dialog in the cockpit to raise it; Big Screen on another device: pair a venue PC, smart TV browser or second laptop with a code, see its status, choose where sound plays, and reconnect by itself. Fixed: the phone sign-in sheet sat between the nickname label and its field.
- **v64–v65:** Open on Projector (a setup guide, then a projector window with its own keys); session More menu with Duplicate, Archive (an Archived section with Restore) and Delete (asks first); live sessions can't be archived or deleted; room capacity enforced, with a "This room's full." phone screen and a turned-away count in the cockpit; optional sign-in on phones (Google, Microsoft or an email link).
- **v63:** accounts: Log In, Create Account, Check Your Email, Welcome, Forgot and Set a New Password, Logged Out, and the invited teammate's Join page; account menu with Log Out; Account page with Profile, Team (invites, roles, seats) and Plan & Billing (4 plans, upgrade, switch down, cancel, card, billing details, invoices); See Plans upgrade prompts wherever a Team limit bites; Business added to the prototype bar.
- **v62:** "Running order" renamed Slides everywhere (the report's Activities tab too); click a person in the report to see their answers, which add up to the slide totals; Share Report dialog (link on or off, include names and emails or not, See What They See); reports kept by plan (12 months on Team in the prototype), shown on the plan card, report and Share dialog; 2-page PDF summary that prints to A4.
- **v61:** Session Report, with Summary, Activities, People, Feedback and Follow-up tabs, built from the live run (or sample results for older sessions); finished sessions open on their report; the live cockpit ends on View Report; Send Now for the follow-up email, with a confirm step; CSV downloads; Year-End Splash is a full sample session. Fixed: room code labels lost their space ("RoomHQ8R").
- **v60:** the live cockpit is a presenter view: Up Next (a real copy of the next screen) and Speaker Notes (adjustable text size) are always in view beside the big screen, above the running order; sample notes on every Riverbank Offsite slide; Test Run renamed Preview, and Test From Here renamed Preview From Here.
- **v59:** Open Cockpit is the live session (no test phones); Test Run and Test From Here are the rehearsal; room settings moved into Session Settings as a Room tab; tables from 1 to 50, with a dropdown on phones above 12; track picker in the cockpit.
- **v58:** upload requirements at every upload area, with size checks; music levels (Announcements, Ambient, Activity, Speeches) per slide, adjustable per session and switchable live from the cockpit, with fades; Session Settings side panel for theme, sound, join badge and sponsor logos, so the slide Design tab is per-slide only; the cockpit keeps Next in view at narrow widths. Fixed: test-run music and sound effects never actually played in the browser (the canvas runtime doesn't pass the previous state to componentDidUpdate, so the change check failed silently).
- **v57:** Add Sample Sponsors in a slide's Extras: 6 sample logos and the strip on, in 1 click.
- **v56:** Slide View is the default for the running order; the Add Activity and How It Plays pages keep a sticky bar with a Back button; headline font tiles are centred; 8 original music loops and live music controls in the cockpit; Try Sample Logos for the sponsor strip; a brand-voice copy pass (otter-world demo content, digits for numbers, “·” separators, character lines from Otto and Rue).
- **v55:** default reactions are 4 otters plus 👍 ❤️ 😂 🔥 (up to 8 on phones); Test Run fits big screen, phones, cockpit and running order in 1 window; second, lighter type pass on the big screen; This or That shows the dilemma as the big-screen title, matching the preview; fixed the preview on large monitors (text drifted because padding was a percentage of the outer frame).
- **v53:** lighter, roomier big screen; feedback survey question types, per-question rating scale (up to 1–6), icon and end labels, and optional contact details with account prefill; Video slide streamed from a link; Keep in Touch email prefill and the follow-up email composer; 17 new setting tooltips.
- **v52:** animated How to Play scenes with otter and animal players; Lobby join-steps toggle, More details (up to 3 lines) and Wi-Fi QR; QR size and side now update the preview; all QR codes are real, scannable codes (join link, Keep in Touch link, Wi-Fi); roomier Slide View (wider settings column, more padding and gaps).
- **v48:** text no longer spills out of option buttons at narrow widths (1440-wide canvas); 4:3 fixes for the tribe and imposter tiles and the Wrap; Keep in Touch links show icon plus address, and the default message explains the QR ("Scan the code, or tap any link on your phone.").
- **v47:** setup tooltips on all 70 settings; Wrap and Keep in Touch slides; reaction picker moved to room settings; table names moved to room settings; quick poll fits 5 or 6 options (2 columns); copy fixes on the poll, Imposter and survey slides.
- **v46:** title text per slide (size S–XL, weight, alignment, colour, shrink to fit) with a readability check; Room size sets the smallest text on the big screen; edit titles and subtitles by clicking them on the preview; Copy Style From; focal point for photo backgrounds.

## Decided

- Banned words (16j) apply session-wide: Word Cloud, Poll, Q&A questions and nicknames. The list lives in Session Settings, under Room, next to the leaderboard settings (21a, 21b).
- A quiz's own leaderboard length (14e) overrides the session setting (21a) for that quiz.
- How to Play is an option on every activity, off by default.
- Otter pack: 4 otters on every plan; 12 on higher tiers.
- Join badge defaults: hidden on Lobby (it has its own big QR), Blackout, and the quiz leaderboard and podium; shown everywhere else.
- Logos: the brand kit takes 2 versions, one for dark slides and one for light slides. Each slide uses the one that matches. If only one is uploaded, slides that need the other show it on a small contrasting chip. Phones use the light-slide version.
- Emoji shower per slide: On or Off, higher plans only (replaces the Calm and Lively levels).
- Music levels by slide type (each slide can change its own): **Ambient** for the Lobby, Breaks, Word Cloud and Poll, Feedback Survey and Keep in Touch; **Activity** for Split Words, Speed Quiz, This or That and the Wrap; **Announcements** for the Holding Screen and Imposter; **Speeches** for Q&A, Video, your own slides and Blackout. Older slides set to On or Off map to Ambient and Speeches.
- Session-wide settings (theme, sound, join badge defaults, sponsor logos) live in Session Settings, not the slide Design tab (Timothy, 30 Oct).
- Finished sessions open on their report, not their slides (30 Oct 2026). Only live sessions make reports; previews never do.
- The report shows what the run recorded. Slides it never reached say "Not reached" rather than showing made-up results.
- The running order is called Slides in the product (Timothy, 30 Oct 2026).
- An event is the occasion and a session is one block of it, as event planners use the words. A session can also stand alone. See "Events and sessions: the words we use" (Timothy, 2 Nov 2026).
- Activities per session (games, polls, Q&A, word clouds and surveys; stage moments and your own slides don't count): up to 5 on Free, 10 on Team, no limit on Business and Enterprise (Timothy, 3 Nov 2026). The prototype's hidden Team plan uses 10.
- A co-host's cockpit is the host's live cockpit, with the controls when they take them, minus any way into editing slides or Session Settings. Co-hosts can raise the room limit live, because that's running the room (3 Nov 2026).
- No co-hosts on the Free plan (Timothy, 4 Nov 2026).
- Sessions live at once, across the organisation and including breakouts: 1 on Free; 4 on Team, or 2 per host if that's more; 10 on Business, or 5 per host if that's more. No monthly session limit on paid plans. A live session ends itself after 4 hours, with a warning 15 minutes before and Keep Going to add an hour (Timothy, 4 Nov 2026). Built in prototype version 8: the plan card shows "Live at once"; Open Cockpit is blocked when the slots are full, with a dialog listing each live session and who runs it (Open Its Cockpit, Preview Instead); the prototype bar's "Teammates Go Live" fills the slots to test it. In the cockpit, "Prototype: Skip to 15 Minutes Before the 4-Hour Limit" shows the warning banner with Keep Going. During the alpha the prototype uses Team's rule (4, or 2 per host).
- Co-hosts are free, invited by email to one session or event, log in with Google or an email link, and run the room without editing it. Hosts are the paid seats (Timothy, 3 Nov 2026).
- Shared report links hide names and emails unless the host includes them, and survey answers are never linked to a person.
- Sending the follow-up email from the report asks once before it goes, because it can’t be unsent.
- Sign-in: Google, or email and password. No 2-step verification in the alpha (Timothy, 31 Oct 2026).
- Alpha: up to 100 people per session, and at least 2 months' notice before paid plans start (Timothy, 31 Oct 2026).
- Big screen on another device (venue PCs, smart TVs) is not in the alpha (Timothy, 31 Oct 2026).
- Follow-up emails send from hello@ottermeet.io (Timothy, 31 Oct 2026).
- Host levels don't come with a discount on paid plans (Timothy, 31 Oct 2026).
- Hosts earn levels, from Pup to Super Host. Only 2 sessions a month count, so nobody can rush or game them (Timothy, 30 Oct 2026). Sessions need 20 or more people and at least 45 minutes to count, and Super Host is at 100 sessions (Timothy, 30 Oct 2026). Attendee rewards need 20 or more people too, to keep it consistent. Over 4 years to Super Host is fine: let it grow slowly. The live cockpit doesn't show host-level progress.
- Alpha: 1 free tier with everything included while OtterMeet is tested with users. Pricing and paid tiers come later (Timothy, 30 Oct 2026).
- Sign-in: Google for now, for hosts and attendees; Microsoft is dropped (Timothy, 30 Oct 2026). Email stays for now; see Open questions.
- A full room has a waiting list by default, and the host can raise the limit from the cockpit (Timothy, 30 Oct 2026).
- The big screen can run on another device. Screens pair with a short code typed into the cockpit and never log in, because venue PCs are shared (30 Oct 2026).
- Archived sessions keep their reports and don't count towards the plan's session limit. Delete asks first; Archive and Duplicate have Undo instead (30 Oct 2026).
- A duplicate is a draft with a new room code and no results. A live session can't be archived or deleted until it ends.
- People never need an account to join. Logging in on the phone is optional and offered once, on the nickname step.
- Room capacity is a hard limit: the next person sees "This room's full." and the host sees how many were turned away.
- Survey and Wrap are separate slides. The survey's default name is Feedback survey, and its big-screen subtitle avoids numbers and the host: "Grab your phone and tell us how it went. Be honest: it helps make the next one even better."
- When a session ends on a Wrap, the end screen says "See you next time." so it doesn't repeat "That's a wrap."
- The big screen doesn't announce that results are hidden until the reveal. The cockpit still tells the host.
- Imposter's "just the topic" hint lives on the imposter's phone, not the big screen. In Similar Word mode the imposter isn't told.
- Tables: Imposter is played in groups of about 6. If Split Words runs earlier in the slides, its tribes are the tables. Otherwise people play at the table they picked on join. The host sets how many tables there are (1 to 50, default 6) and can name them, in Session Settings, under Room. With 1 table nobody is asked to pick; up to 12 tables show as buttons on the phone, more as a dropdown. Imposter's reveal shows up to 6 tables on the big screen ("Showing 6 of 20 tables") and counts all of them. Imposter's setup just says which applies.
- Quick poll: 5 or 6 options sit in 2 columns on the big screen and preview, so nothing runs off the slide.
- Title text follows "theme, then override". Apply to All Slides turns the slide's background and title style into the theme.
- Room size sets the floor for text on the big screen: Small Room 36px titles and 20px other text, Big Room (default) 44px and 24px, Hall 52px and 28px (on a 1280 × 720 stage). Shrink to fit never goes below it; long titles get a warning instead.
- On Holding and Lobby, title alignment follows the layout picker, so there's no separate alignment control.
- Copy Style From copies the background, title text, join badge, emoji shower, transition and music level. It copies the layout only between slides of the same type. Extras stay with their slide.
- Wrap highlights use sample numbers when a preview skips earlier slides. Fine for testing (Timothy, 30 Oct).
- Lobby Wi-Fi QR uses the standard Wi-Fi format, so iPhone and Android cameras offer to join the network. WPA passwords under 8 characters get a warning. Open networks need no password.
- Rating settings are per question, so the old survey-wide “Ratings as” control is gone. Older surveys keep their look: Numbers, Stars and Faces map onto each question's icon.
- Single-choice questions are labelled “Pick one”: digits are for counts, and “one” meaning a single answer is a word (voice guide, 31 Oct 2026).
- What a phone already knows is filled in, never sent for them: the person still taps Send. The feedback survey answer wins over the account, because it's the newer one.
- This or That: the dilemma is the big-screen title in every phase, as in the preview. “This or That”, “Drumroll…”, “The room has spoken” and “Dead even” move to the eyebrow.
- Slides opens in Slide View by default (Grid View is 1 click away).
- Demo and sample content lives in an otter world: sessions Riverbank Offsite, Driftwood Coffee Launch, Year-End Splash, River Labs Town Hall and Kelp & Co Town Hall; companies Kelp & Co, River Labs, Otterly Studio, Driftwood Coffee, Pebble Bank and Splash Travel; the Boathouse as the venue. The demo This or That is “Offsite afternoon: Kayak the river or Picnic on the bank”. Instructions, settings and privacy lines stay literal.
- Edit on preview covers host-written titles and subtitles only. Fixed game lines (for example Split Words rounds) aren't editable.

- Preview (called Test Run until v60; renamed by Timothy, 30 Oct 2026) stays in the real product (decided 30 Oct 2026: it helps hosts picture the presentation). It's a rehearsal mode: The host runs the session with a simulated room and phone previews; nothing reaches real phones and nothing goes into the session report. **Open Cockpit is the real session** (decided 30 Oct 2026): a Live badge, the big screen, the cockpit and Slides, with no test phones, no simulated-crowd switch, no Join Both Phones and no Restart, and nothing in the cockpit mentions test phones. **Preview** (a button beside Open Cockpit) and Preview From Here (on any slide) open the rehearsal with the 2 test phones. In the prototype the live cockpit's room is still simulated so the numbers move. The prototype bar at the bottom (Reset) is prototype-only.

## Open questions


**Reports and people's data:** built in v82, see "Decided 31 Oct 2026" above. The report limit per paid plan is set with pricing.

**Parked until paid plans**
- Tiers and prices are proposed in the “OtterMeet pricing proposal” doc (3 Nov 2026): Free, Team at $19 and Business at $39 a month per host billed yearly, Enterprise, and event passes. Earlier candidates for paid features: the 30-emoji library, sponsor logos, video backgrounds, keeping a custom accent with presets, bigger uploads, follow-up email from the host's own domain.

**For engineering**
- Storage per account (decided by Timothy, 9 Nov 2026; shown on Plan & Billing in v42): Free 100 MB; Team 2 GB per host, pooled; Business 5 GB per host, pooled. Free decks are capped at 10 MB to fit. Engineering: enforce it, and decide what happens at the limit (proposal: uploads stop with an upgrade prompt, and nothing is deleted). Confirm them with engineering (storage, processing and streaming costs), and decide whether higher plans get bigger limits.

**Dependencies**
- **Decided 9 Nov 2026 (Timothy):** the rest of the artwork waits for later phases. The 5 host otter colours (Chestnut, Cocoa, Sandy, Silver, Ginger) arrived as a picture and were traced into SVGs for the prototype. The final versions should come from the illustrator as layered vectors.
- Dependency: the illustrated otter set (12 stickers) to replace the sketch placeholders.
- Artwork for attendee rewards, host level badges and the captain's hat (emoji and a simple drawing stand in today).

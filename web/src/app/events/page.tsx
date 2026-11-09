import type { Metadata } from 'next';
import { Feature, FeatureText, FreeNote, H1, Otter, PeekOtter, Shot, SitePage, StartBand, StartLink, Eyebrow } from '@/components/site/Site';

export const metadata: Metadata = {
  title: 'Events',
  description: 'The whole get-together in one place: an event page, RSVPs and a waitlist, check-in with one QR code, and the follow-up.',
  alternates: { canonical: '/events' },
};

const PHONE_PAIR = 'flex-[0_0_40%]';

export default function EventsPage() {
  return (
    <SitePage>
      <section className="pt-[72px] pb-[88px]">
        <div className="site-wrap flex flex-wrap items-center gap-x-16 gap-y-12">
          <div className="flex-[1_1_440px] min-w-0 flex flex-col gap-5">
            <Eyebrow>Events</Eyebrow>
            <H1 className="text-[60px] leading-[64px]">Everything before and after the room.</H1>
            <p className="m-0 text-xl leading-[31px] text-copy max-w-[560px]">
              An event is the whole get-together: the page, the guest list, the day and the follow-up. Its sessions are the
              live parts, all sharing one guest list.
            </p>
            <div className="flex flex-wrap items-center gap-x-[22px] gap-y-3.5 mt-1.5">
              <StartLink />
              <FreeNote />
            </div>
          </div>
          <div className="flex-[1_1_520px] min-w-0 relative pb-8">
            <Shot src="app-guests" alt="The Guests tab for Riverbank Offsite: 70 invited, 55 going, 4 on the waitlist."
              width={1600} height={905} frame="app" fade className="w-[84%]" />
            <Shot src="phone-event-page" alt="A public event page on a phone: River Labs Book Club, with Are you going?"
              width={480} height={999} frame="phone" className="absolute right-0 bottom-0 w-[30%] !shadow-[0_20px_40px_-10px_rgba(13,27,42,0.45)]" />
          </div>
        </div>
      </section>

      <section className="pt-8 pb-[104px]">
        <div className="site-wrap flex flex-col gap-24">
          <Feature mediaClass="flex-[1.4_1_480px]" media={
            <div className="flex justify-center items-end gap-6">
              <Shot src="phone-event-page" alt="A public event page on a phone: River Labs Book Club." width={480} height={999} frame="phone" className={PHONE_PAIR} />
              <Shot src="phone-rsvp-confirmed" alt="A guest’s confirmation: You’re going to Riverbank Offsite, with a QR code." width={480} height={1004} frame="phone" className={`${PHONE_PAIR} mb-10`} />
            </div>
          }>
            <FeatureText eyebrow="The event page" title="A page people want to say yes to."
              body="Date, place, agenda and photos in one page that works on any phone. People RSVP in a few taps and add it to their calendar."
              bullets={[
                'Public, company only, or invite only',
                'Your own questions, like dietary and access needs',
                'A waitlist when it’s full, and you choose who gets a place that opens',
                'Up to 3 tags, so the right people find it',
              ]} />
          </Feature>

          <Feature flip media={
            <div className="relative pb-6">
              <Shot src="app-guests" alt="The guest list with statuses, groups and breakouts." width={1600} height={905} frame="app" fade className="w-[90%] ml-auto" />
              <PeekOtter name="rue-ticking-notebook" className="left-[-16px] w-[21%]" />
            </div>
          }>
            <FeatureText eyebrow="The guest list" title="Invites, groups and breakouts, sorted."
              body="Add people from a paste or a CSV and send the invites. Everyone’s answers sit in one list, ready for the day."
              bullets={[
                'Groups mixed across teams, or teams kept together, at the press of a button',
                'Breakouts with places, which guests can pick themselves',
                'Select several people and change them together',
                'Reminders and updates, and a confirmation with a calendar file',
              ]} />
          </Feature>

          <Feature media={
            <div className="relative pb-6">
              <Shot src="app-check-in" alt="The Check In tab: 30 of 55 checked in, a scanner, and Find someone." width={1600} height={905} frame="app" fade className="w-[90%]" />
              <PeekOtter name="otto-welcome" className="right-[-16px] w-[21%]" />
            </div>
          }>
            <FeatureText eyebrow="On the day" title="One QR code, from the door to the room."
              body="Every confirmation carries one code. At the door, it checks people in. Inside, it puts them straight into the session that’s on, with their name already filled in."
              bullets={[
                'Scan at the door, or find someone by name',
                'Check-in helpers on their own phones',
                'Walk-ins added in seconds',
                'Self check-in when you’d rather not staff a desk',
              ]} />
          </Feature>

          <Feature flip media={
            <Shot src="app-organiser-page" alt="An organiser page for Kelp & Co, with 214 followers and a Follow button." width={1200} height={571} frame="app" className="bg-white" />
          }>
            <FeatureText eyebrow="Your organiser page" title="A home for your community."
              body="Show who you are and what’s coming up. People follow your page, and hear from you each time you post an event."
              bullets={['Your logo, page image and words', 'Your team runs events under one name']} />
          </Feature>

          <Feature mediaClass="flex-[1.4_1_480px]" media={
            <div className="flex justify-center items-end gap-6">
              <Shot src="phone-wrap-passport" alt="A phone at the end of a session: Thanks for coming, Sam, and a passport stamp with a Golden mic reward."
                width={504} height={1076} frame="phone" className={PHONE_PAIR} />
              <Otter name="rue-handing-over" className="flex-none w-[34%]" />
            </div>
          }>
            <FeatureText eyebrow="After" title="Know who came, and bring them back."
              body="The event report adds it all up: invited, registered, checked in, and who took part in each session, with the feedback."
              bullets={[
                'A follow-up email to everyone who came',
                'A passport stamp for every guest, with rewards for joining in',
                'Delete people’s answers after the event, if you’d like',
              ]} />
          </Feature>
        </div>
      </section>

      <section className="pb-24">
        <div className="site-wrap">
          <p className="m-0 px-8 py-7 rounded-[20px] bg-white border-[1.5px] border-sand text-[17px] leading-[27px] text-copy">
            <strong className="font-sans">Selling tickets?</strong> Keep your ticketing tool for payment, and use OtterMeet for
            RSVPs, check-in and the room.
          </p>
        </div>
      </section>

      <StartBand title="Your next event starts here."
        body="Make your first event today. Everything’s included while we’re in alpha."
        otters={[['rue-watching-queue', '36%'], ['otto-offering-paw', '38%']]} />
    </SitePage>
  );
}

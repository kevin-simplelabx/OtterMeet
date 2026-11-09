import type { Metadata } from 'next';
import { Blank, LegalDoc } from '@/components/site/LegalDoc';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What OtterMeet collects, why, who sees it and how long we keep it.',
  alternates: { canonical: '/privacy' },
};

// Draft written from how OtterMeet works. Not legal advice: needs the company name, DPO contact and a lawyer's review.
export default function PrivacyPage() {
  return (
    <LegalDoc title="Privacy">
      <p>
        OtterMeet helps people get together: hosts make events and sessions, and guests join in on their phones. This page
        explains what we collect, why, who sees it and how long we keep it. OtterMeet is run by <Blank>[COMPANY NAME]</Blank>, Singapore.
      </p>

      <h2>Hosts and guests</h2>
      <p>
        Hosts are the people with an OtterMeet account who run events and sessions. Guests are the people they invite, and
        everyone who joins a session. When a guest gives information to a host through OtterMeet, such as an RSVP answer,
        it’s collected for that host, and the host decides how it’s used. We handle it on their behalf.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li><strong>From hosts:</strong> name, email, team and role, the events and sessions you make, and files you upload, like slides, photos and logos. When paid plans arrive, a payment provider handles card details, and we don’t store full card numbers.</li>
        <li><strong>From guests at an event:</strong> name, email, RSVP status, answers to the host’s questions (which may include dietary or access needs), group or breakout, and check-in time.</li>
        <li><strong>From people in a session:</strong> the nickname you choose, your answers, votes, reactions and questions. You don’t need an account to join. If the host allows it, questions and survey answers can be anonymous.</li>
        <li><strong>Your passport:</strong> if you log in, the stamps and rewards you collect across sessions and events.</li>
        <li><strong>Technical details:</strong> what we need to keep your phone connected to the room, such as your browser type and a session identifier.</li>
        <li><strong>On this website:</strong> we’ll list any analytics or cookies here before we start using them.</li>
      </ul>

      <h2>How we use it</h2>
      <ul>
        <li>To run events and sessions: RSVPs, check-in, the live room and the report afterwards.</li>
        <li>To send emails you’d expect: confirmations, reminders, updates from a host and follow-ups. People who follow an organiser hear about that organiser’s new public events.</li>
        <li>To keep OtterMeet safe, fix problems and improve it.</li>
      </ul>
      <p>We don’t sell personal information, and we don’t use it for advertising.</p>

      <h2>Who sees what</h2>
      <ul>
        <li>The host and their co-hosts see guests’ names, emails and answers, to plan and follow up. Every form says who sees it and why.</li>
        <li>Other guests see your nickname in the room. On an event’s guest list, they see your first name and last initial only if you choose to show it.</li>
        <li>Anonymous questions and survey answers aren’t linked to your name, even for the host.</li>
        <li>Service providers that help us run OtterMeet, such as hosting and email, under contract and only to provide their service to us.</li>
      </ul>

      <h2>How long we keep it</h2>
      <p>
        Reports, and what guests gave in an event or session, are kept for as long as the host’s plan keeps reports: at
        least 12 months during the alpha; 30 days on Free, 12 months on Team and 3 years on Business. Files attached to
        follow-up emails are kept for the same time. Hosts can delete people’s answers after an event, and remove someone
        from a report. Guests can remove a stamp or delete their whole passport at any time. When a host deletes their
        account, their events, sessions and reports go too.
      </p>

      <h2>Your choices and rights</h2>
      <p>
        You can ask to see, correct or delete your information, or tell us to stop using it. For anything a host collected,
        we’ll pass your request to that host, or you can contact them directly. Under Singapore’s Personal Data Protection
        Act (PDPA), you can ask to access or correct your personal data, and withdraw your consent. Write to our Data
        Protection Officer at <a href="mailto:hello@ottermeet.io">hello@ottermeet.io</a>.
      </p>

      <h2>Security</h2>
      <p>
        We protect information in transit and at rest, and limit who on our team can see it. No service can promise perfect
        security, so we’ll tell affected hosts and guests if something goes wrong, as the law requires.
      </p>

      <h2>Children</h2>
      <p>OtterMeet accounts are for people aged 18 and over.</p>

      <h2>Where data is stored</h2>
      <p>Our service providers may store data outside Singapore. When they do, we make sure it’s protected to a standard comparable to the PDPA.</p>

      <h2>Changes and contact</h2>
      <p>
        We’ll update this page when things change, and tell hosts by email about important changes. Questions? Write to{' '}
        <a href="mailto:hello@ottermeet.io">hello@ottermeet.io</a>.
      </p>
    </LegalDoc>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { Blank, LegalDoc } from '@/components/site/LegalDoc';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'The agreement for using OtterMeet: your account, the alpha, your content and using OtterMeet well.',
  alternates: { canonical: '/terms' },
};

// Draft written from how OtterMeet works. Not legal advice: needs the company name and a lawyer's review before launch.
export default function TermsPage() {
  return (
    <LegalDoc title="Terms">
      <p>
        These terms are an agreement between you and <Blank>[COMPANY NAME]</Blank> (“OtterMeet”, “we”) for using
        OtterMeet. If you use OtterMeet for your company or community, you agree for them too. Joining a session as a guest
        doesn’t need an account, and only the parts about acceptable use apply.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>You need to be 18 or older to make an account.</li>
        <li>Keep your login details safe. You’re responsible for what happens in your account and your team.</li>
        <li>Owners and admins decide who joins the team and what they can change.</li>
      </ul>

      <h2>The alpha and plans</h2>
      <ul>
        <li>While we’re in alpha, OtterMeet is free and there’s no card to add. Features and limits may change as we learn.</li>
        <li>When paid plans arrive, we’ll tell you the price and what each plan includes before you’re charged. Plans are per host, billed yearly, and you can cancel before the next renewal. Free stays, with its own limits.</li>
        <li>There’s nothing to pay during the alpha. We’ll set out refunds and taxes here before paid plans start.</li>
      </ul>

      <h2>Your content and your guests</h2>
      <ul>
        <li>What you make and upload stays yours: slides, photos, questions and reports. You let us store and show it so OtterMeet can work for you and your guests.</li>
        <li>Only upload what you have the right to use, including logos, fonts, music and photos of people.</li>
        <li>When you invite people or collect their answers, you’re responsible for having a good reason to, and for using what they tell you fairly. Our <Link href="/privacy">privacy page</Link> explains how we handle it on your behalf.</li>
      </ul>

      <h2>Using OtterMeet well</h2>
      <p>Keep get-togethers safe and kind. Don’t use OtterMeet to:</p>
      <ul>
        <li>harass, threaten or embarrass anyone, or post hateful or adult content;</li>
        <li>send spam, run scams, or mislead people about who you are;</li>
        <li>break the law, or someone else’s rights;</li>
        <li>break, overload or get around how OtterMeet works.</li>
      </ul>
      <p>Anyone can report a public event. Our team reviews reports and may remove content, hide an event or suspend an account.</p>

      <h2>Public events and organiser pages</h2>
      <p>
        When you post a public event, anyone can see it, follow your organiser page and RSVP. Selling tickets isn’t part of
        OtterMeet yet. If you charge through another service, its terms apply to that payment.
      </p>

      <h2>Changes and availability</h2>
      <p>
        We’re improving OtterMeet all the time, so features may change. We aim to keep it running smoothly, especially
        during live sessions, but we can’t promise it will always be available. We’ll give notice before changes that take
        something important away.
      </p>

      <h2>Ending</h2>
      <p>
        You can delete your account at any time from Account settings. We may suspend or close an account that breaks these
        terms, and we’ll tell you why unless the law or safety stops us.
      </p>

      <h2>Liability</h2>
      <p>
        During the alpha, OtterMeet is free and provided as it is, without promises about how well it will work for a
        particular purpose, as far as the law allows. <Blank>[LIMITS OF LIABILITY, TO BE WRITTEN WITH COUNSEL BEFORE PAID PLANS]</Blank>
      </p>

      <h2>The law and contact</h2>
      <p>These terms are governed by the laws of Singapore. Questions? Write to <a href="mailto:hello@ottermeet.io">hello@ottermeet.io</a>.</p>
    </LegalDoc>
  );
}

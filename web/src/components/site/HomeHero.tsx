'use client';
/* eslint-disable @next/next/no-img-element -- pre-sized WebP screenshots */
import { useState } from 'react';
import Link from 'next/link';
import { FreeNote, H1, Otter, StartLink } from './Site';

const AUDIENCES = {
  teams: {
    label: 'For teams',
    line: 'For town halls, offsites and team socials: invites and RSVPs, games and Q&A on the big screen, and a report on who took part.',
    screen: ['screen-lobby', 'The big screen before a session starts: Grab your phone and hop in, with a QR code, room code HQ8R and 86 people in.'],
    phone: ['phone-joined', 'A phone that has joined: You’re in the raft, with reactions to send to the big screen.'],
  },
  communities: {
    label: 'For communities',
    line: 'For meetups, workshops and community nights: an event page people can follow, icebreakers that get strangers talking, and a passport that brings them back.',
    screen: ['screen-split-words', 'The big screen during Split Words: Find your tribe, with 6 tribes gathering.'],
    phone: ['phone-split-words', 'A phone showing half a word to match with a stranger, and a PIN to swap.'],
  },
} as const;

type Audience = keyof typeof AUDIENCES;

export function HomeHero() {
  const [who, setWho] = useState<Audience>('teams');
  const a = AUDIENCES[who];

  return (
    <section className="pt-[72px] pb-[88px]">
      <div className="site-wrap flex flex-wrap items-center gap-14">
        <div className="flex-[1_1_420px] min-w-0 flex flex-col gap-[22px]">
          <div role="group" aria-label="Who it’s for" className="inline-flex self-start p-1 rounded-full bg-sand">
            {(Object.keys(AUDIENCES) as Audience[]).map((k) => (
              <button key={k} type="button" aria-pressed={who === k} onClick={() => setWho(k)}
                className={`min-h-10 px-[18px] rounded-full font-sans font-bold text-sm cursor-pointer ${who === k ? 'bg-white text-navy' : 'bg-transparent text-brown'}`}>
                {AUDIENCES[k].label}
              </button>
            ))}
          </div>
          <H1 className="text-[68px] leading-[70px]">Get-togethers everyone joins in.</H1>
          <p className="m-0 text-xl leading-[31px] text-copy max-w-[540px]">
            Send the invites, get everyone talking on the big screen, and see who comes back. People join on their phones:
            no app, no account.
          </p>
          <p className="m-0 text-base leading-6 text-brown max-w-[520px]">{a.line}</p>
          <div className="flex flex-wrap items-center gap-x-[22px] gap-y-3.5 mt-1.5">
            <StartLink>
              Start Free
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </StartLink>
            <Link href="/room" className="font-sans font-bold text-base">See the room</Link>
          </div>
          <p className="m-0"><FreeNote /></p>
        </div>

        <div className="flex-[1_1_560px] min-w-0 relative pb-12">
          <div className="rounded-[22px] overflow-hidden bg-navy border-[10px] border-navy shadow-[0_4px_10px_rgba(107,78,61,0.10),0_28px_60px_-12px_rgba(13,27,42,0.35)]">
            <img className="site-shot" src={`/site/shots/${a.screen[0]}.webp`} alt={a.screen[1]} width={1600} height={900} />
          </div>
          <div className="absolute right-[-18px] bottom-0 w-[34%] rounded-[30px] overflow-hidden border-[7px] border-navy bg-paper shadow-[0_20px_40px_-10px_rgba(13,27,42,0.45)] max-site:!w-[30%] max-site:!right-[-4px]">
            <img className="site-shot" src={`/site/shots/${a.phone[0]}.webp`} alt={a.phone[1]} width={480} height={1020} />
          </div>
          <Otter name="otto-welcome" className="absolute left-[-58px] bottom-[26px] w-[22%] drop-shadow-[0_10px_14px_rgba(13,27,42,0.25)] max-site:!left-[-6px]" />
          <p className="mt-3.5 mb-0 pl-[16%] text-[13px] text-brown max-site:!pl-[24%] max-site:pr-[38%] max-site:!mt-4">
            Example screens from OtterMeet, with sample names.
          </p>
        </div>
      </div>
    </section>
  );
}

/* eslint-disable @next/next/no-img-element -- static website art: SVG otters and pre-sized WebP screenshots */
import Link from 'next/link';
import { SiteFooter, SiteHeader } from './SiteChrome';

/** The crew poses used on the website, with their drawn sizes (for aspect ratio). */
const OTTERS = {
  'otto-welcome': [535, 687],
  'otto-offering-paw': [502, 637],
  'otto-celebrating': [484, 538],
  'rue-ticking-notebook': [529, 691],
  'rue-keeping-time': [544, 683],
  'rue-handing-over': [593, 679],
  'rue-report-ready': [430, 558],
  'rue-watching-queue': [444, 549],
  'fin-stretching': [463, 663],
  'fin-juggling': [545, 703],
  'fin-celebrating': [439, 553],
  'fin-offering-pebble': [439, 535],
} as const;

export type OtterName = keyof typeof OTTERS;

export function Otter({ name, className = '', style }: { name: OtterName; className?: string; style?: React.CSSProperties }) {
  const [w, h] = OTTERS[name];
  return <img src={`/site/otters/${name}.svg`} alt="" aria-hidden="true" width={w} height={h} className={`h-auto ${className}`} style={style} />;
}

/** An otter that peeks over the corner of a screenshot. */
export function PeekOtter({ name, className }: { name: OtterName; className: string }) {
  return <Otter name={name} className={`absolute bottom-[-6px] drop-shadow-[0_10px_14px_rgba(13,27,42,0.25)] ${className}`} />;
}

type Frame = 'screen' | 'app' | 'phone' | 'phone-dark';

const FRAMES: Record<Frame, string> = {
  /** The big screen: a thick navy bezel. */
  screen: 'rounded-[18px] border-8 border-navy shadow-[0_16px_36px_-8px_rgba(13,27,42,0.3)]',
  /** The host app in a browser: a light sand edge. */
  app: 'rounded-[18px] border-[1.5px] border-sand shadow-[0_16px_36px_-8px_rgba(13,27,42,0.22)]',
  phone: 'rounded-[28px] border-[7px] border-navy shadow-[0_20px_40px_-10px_rgba(13,27,42,0.35)]',
  'phone-dark': 'rounded-3xl border-[6px] border-navy-line',
};

/**
 * A screenshot from /public/site/shots in a device frame. `fade` softens the bottom edge of a tall app screen.
 */
export function Shot({ src, alt, width, height, frame, fade = false, className = '', lazy = false }: {
  src: string; alt: string; width: number; height: number; frame: Frame; fade?: boolean; className?: string; lazy?: boolean;
}) {
  return (
    <div className={`overflow-hidden ${FRAMES[frame]} ${fade ? '!border-b-transparent !shadow-none' : ''} ${className}`}>
      <img className={`site-shot ${fade ? 'site-fade' : ''}`} src={`/site/shots/${src}.webp`} alt={alt} width={width} height={height}
        loading={lazy ? 'lazy' : undefined} />
    </div>
  );
}

export const PHONE = { width: 480, height: 1020 } as const;

/** Page shell: sticky header, the page, and the footer. */
export function SitePage({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`site min-w-0 ${dark ? 'site-dark !bg-navy !text-paper' : ''}`}>
      <SiteHeader dark={dark} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function StartLink({ size = 'lg', children = 'Start Free', className = '' }: { size?: 'sm' | 'md' | 'lg'; children?: React.ReactNode; className?: string }) {
  const sizes = { sm: 'min-h-11 px-5 text-[15px]', md: 'min-h-[52px] px-[26px] text-[17px]', lg: 'min-h-14 px-[30px] text-lg' };
  return <Link href="/start" className={`site-btn ${sizes[size]} ${className}`}>{children}</Link>;
}

export function FreeNote({ dark = false }: { dark?: boolean }) {
  return <span className={`text-sm ${dark ? 'text-mist' : 'text-brown'}`}>Free while we’re in alpha · No card needed</span>;
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="site-eyebrow">{children}</p>;
}

/** Section heading at the website's h2 sizes, dropping to 32/38 px on phones. */
export function H2({ children, size = 46, className = '', id }: { children: React.ReactNode; size?: 34 | 38 | 42 | 46 | 52; className?: string; id?: string }) {
  const sizes = {
    34: 'text-[34px] leading-10',
    38: 'text-[38px] leading-[44px]',
    42: 'text-[42px] leading-[48px]',
    46: 'text-[46px] leading-[52px] tracking-[-0.5px]',
    52: 'text-[52px] leading-[58px] tracking-[-0.5px]',
  };
  return <h2 id={id} className={`site-head ${sizes[size]} max-site:!text-[32px] max-site:!leading-[38px] ${className}`}>{children}</h2>;
}

export function H1({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <h1 className={`site-head tracking-[-1px] max-site:!text-[44px] max-site:!leading-[48px] ${className}`}>{children}</h1>;
}

/**
 * One "what you get" row: words on one side, screenshots on the other. `flip` puts the media first on wide screens
 * and keeps the words on top when they stack.
 */
export function Feature({ media, flip = false, mediaClass = 'flex-[1.6_1_520px]', children }: {
  media: React.ReactNode; flip?: boolean; mediaClass?: string; children: React.ReactNode;
}) {
  const words = <div className="flex-[1_1_340px] min-w-0 flex flex-col gap-3.5">{children}</div>;
  const art = <div className={`${mediaClass} min-w-0`}>{media}</div>;
  return (
    <div className={`flex items-center gap-x-14 gap-y-10 ${flip ? 'flex-wrap-reverse' : 'flex-wrap'}`}>
      {flip ? <>{art}{words}</> : <>{words}{art}</>}
    </div>
  );
}

export function FeatureText({ eyebrow, title, body, bullets, link }: {
  eyebrow?: string; title: string; body?: string; bullets?: string[]; link?: [string, string];
}) {
  return (
    <>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      {eyebrow
        ? <H2 size={42}>{title}</H2>
        : <h3 className="site-head text-[30px] leading-[38px]">{title}</h3>}
      {body && <p className="m-0 text-[17px] leading-[27px] text-copy">{body}</p>}
      {bullets && <ul className="site-list">{bullets.map((b) => <li key={b}>{b}</li>)}</ul>}
      {link && <Link href={link[0]} className="font-sans font-bold text-base self-start">{link[1]}</Link>}
    </>
  );
}

/** The navy "starts here" band at the bottom of most pages. */
export function StartBand({ title, body, otters }: { title: string; body?: string; otters: [OtterName, string][] }) {
  return (
    <section id="start" className="site-dark py-24 bg-navy text-paper overflow-hidden">
      <div className="site-wrap flex flex-wrap items-center justify-between gap-10">
        <div className="flex-[1_1_460px] min-w-0 flex flex-col gap-[18px]">
          <H2 size={52}>{title}</H2>
          {body && <p className="m-0 text-lg leading-7 text-oat max-w-[520px]">{body}</p>}
          <div className="flex flex-wrap items-center gap-x-[22px] gap-y-3.5 mt-1.5">
            <StartLink className="!shadow-[0_3px_0_rgba(0,0,0,0.3)]" />
            <FreeNote dark />
          </div>
        </div>
        <div aria-hidden="true" className="flex-[0_1_420px] flex items-end justify-center gap-1">
          {otters.map(([name, width]) => <Otter key={name} name={name} style={{ width }} />)}
        </div>
      </div>
    </section>
  );
}

/** A dashed card that marks content which must be replaced before launch. */
export function SampleBadge() {
  return (
    <span className="self-start px-2.5 py-[3px] rounded-full bg-[#fff1d6] text-[#8a4b00] font-sans font-extrabold text-[11px] tracking-[0.8px] uppercase">
      Sample · replace before launch
    </span>
  );
}

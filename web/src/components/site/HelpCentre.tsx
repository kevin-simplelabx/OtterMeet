'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { HELP_ARTICLES, HELP_TOPICS, snippet, type HelpArticle } from '@/lib/help';
import { Otter } from './Site';

const EYEBROW_SM = 'font-sans font-extrabold text-xs tracking-[1px] uppercase !text-link';

/**
 * The Help Centre: search and topics on the left, and either the list of articles or one article.
 * Topics live in the URL (?topic=), so an article page's topic links land on the filtered list.
 */
export function HelpCentre({ article }: { article?: HelpArticle }) {
  const params = useSearchParams();
  const topic = article ? null : params.get('topic');
  const [q, setQ] = useState(article ? '' : params.get('q') ?? '');

  const query = q.trim().toLowerCase();
  const list = HELP_ARTICLES.filter((a) =>
    (!topic || a.topic === topic) && (!query || `${a.title} ${a.paras.join(' ')}`.toLowerCase().includes(query)));
  const current = article ? article.topic : topic ?? 'all';

  const topics: [string, string, number][] = [
    ['all', 'All articles', HELP_ARTICLES.length],
    ...HELP_TOPICS.map((t): [string, string, number] => [t, t, HELP_ARTICLES.filter((a) => a.topic === t).length]),
  ];

  return (
    <>
      <section className="pt-14 pb-8 bg-sand">
        <div className="site-wrap flex flex-wrap items-end justify-between gap-x-10 gap-y-6">
          {/* A plain GET form: from an article page, Enter goes back to the list with the search filled in. */}
          <form action="/help" onSubmit={(e) => { if (!article) e.preventDefault(); }}
            className="flex-[1_1_560px] min-w-0 flex flex-col gap-4 pb-6">
            <h1 className="site-head text-[50px] leading-[56px] tracking-[-1px] max-site:!text-[40px] max-site:!leading-[46px]">How can we help?</h1>
            <label className="flex flex-col gap-1.5 max-w-[640px]">
              <span className="font-sans font-bold text-[13px]">Search the Help Centre</span>
              <input type="search" name="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Room code, waitlist, report…"
                className="site-field h-[52px] px-[18px] rounded-[14px] text-[17px]" />
            </label>
          </form>
          <Otter name="rue-watching-queue" className="w-[170px]" />
        </div>
      </section>

      <section className="pt-10 pb-[88px]">
        <div className="site-wrap flex flex-wrap items-start gap-x-12 gap-y-8">
          <nav aria-label="Topics" className="flex-[0_1_240px] min-w-0 flex flex-col gap-1">
            {topics.map(([id, name, n]) => {
              const on = current === id;
              return (
                <Link key={id} href={id === 'all' ? '/help' : `/help?topic=${encodeURIComponent(id)}`} scroll={false}
                  aria-current={on ? 'page' : undefined}
                  className={`flex justify-between items-center gap-2.5 min-h-10 px-3 rounded-[10px] font-sans text-[15px] !text-navy ${on ? 'bg-white font-extrabold' : 'font-semibold hover:bg-white/60'}`}>
                  <span>{name}</span><span className="text-[13px] font-semibold text-brown">{n}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex-[1_1_560px] min-w-0 flex flex-col gap-4">
            {article ? (
              <article className="flex flex-col gap-3.5 p-8 rounded-[22px] bg-white border-[1.5px] border-sand max-site:p-6">
                <Link href="/help" className="self-start font-sans font-bold text-[15px] min-h-8 inline-flex items-center">← All articles</Link>
                <p className={`m-0 ${EYEBROW_SM}`}>{article.topic}</p>
                <h2 className="site-head text-[32px] leading-10">{article.title}</h2>
                {article.paras.map((p) => <p key={p} className="m-0 text-[17px] leading-7 text-copy-strong max-w-[680px]">{p}</p>)}
                <p className="mt-3 mb-0 pt-4 border-t border-sand text-[15px] text-brown">
                  Still stuck? Write to <a href="mailto:hello@ottermeet.io">hello@ottermeet.io</a>, and we’ll get back to you.
                </p>
              </article>
            ) : (
              <>
                <p role="status" className="m-0 text-[15px] text-brown">{list.length === 1 ? '1 article' : `${list.length} articles`}</p>
                {list.map((a) => (
                  <Link key={a.id} href={`/help/${a.id}`}
                    className="flex flex-col gap-1.5 px-[22px] py-5 rounded-[18px] bg-white border-[1.5px] border-sand !text-navy hover:border-stone">
                    <span className={EYEBROW_SM}>{a.topic}</span>
                    <span className="font-sans font-extrabold text-[19px] leading-[26px]">{a.title}</span>
                    <span className="text-[15px] leading-[23px] font-normal text-copy">{snippet(a)}</span>
                  </Link>
                ))}
                {list.length === 0 && (
                  <div className="p-8 rounded-[18px] bg-white border-[1.5px] border-dashed border-stone flex flex-col gap-2">
                    <p className="m-0 font-sans font-extrabold text-[19px]">No articles match that yet.</p>
                    <p className="m-0 text-base text-copy">Try another word, or write to <a href="mailto:hello@ottermeet.io">hello@ottermeet.io</a>.</p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

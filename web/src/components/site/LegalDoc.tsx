import { SitePage } from './Site';

/** A gap the lawyer or the company still has to fill in, like [COMPANY NAME]. */
export function Blank({ children }: { children: React.ReactNode }) {
  return <span className="site-blank">{children}</span>;
}

/** Privacy and Terms are drafts until a lawyer has reviewed them (tech spec 3.7), and say so at the top. */
export function LegalDoc({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <SitePage>
      <section className="pt-14 pb-24">
        <div className="site-wrap">
          <article className="site-doc max-w-[760px]">
            <p className="!inline-block !mb-4 px-3 py-1.5 rounded-full bg-cream font-sans font-bold !text-sm !leading-5 !text-brown">
              Draft for review · not yet in force
            </p>
            <h1 className="site-head mb-2 text-[46px] leading-[52px] tracking-[-1px] max-site:!text-[40px] max-site:!leading-[46px]">{title}</h1>
            <p className="!text-brown">Last updated <Blank>[DATE]</Blank></p>
            {children}
          </article>
        </div>
      </section>
    </SitePage>
  );
}

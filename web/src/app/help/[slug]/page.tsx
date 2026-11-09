import type { Metadata } from 'next';
import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { SitePage } from '@/components/site/Site';
import { HelpCentre } from '@/components/site/HelpCentre';
import { HELP_ARTICLES, findArticle, snippet } from '@/lib/help';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return HELP_ARTICLES.map((a) => ({ slug: a.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const article = findArticle((await params).slug);
  if (!article) return {};
  return { title: article.title, description: snippet(article), alternates: { canonical: `/help/${article.id}` } };
}

export default async function HelpArticlePage({ params }: Params) {
  const article = findArticle((await params).slug);
  if (!article) notFound();
  return (
    <SitePage>
      <Suspense><HelpCentre article={article} /></Suspense>
    </SitePage>
  );
}

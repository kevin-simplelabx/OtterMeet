import type { MetadataRoute } from 'next';
import { flags } from '@/lib/flags';
import { HELP_ARTICLES } from '@/lib/help';

const SITE = 'https://ottermeet.io';

/** Public website pages only: never /portal, /host, /stage or /join, and no hidden pages. */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ['/', '/room', '/events', '/about', '/contact', '/help', '/privacy', '/terms', '/start', '/login'];
  if (flags.showPricing) pages.push('/pricing');
  return [
    ...pages.map((p) => ({ url: `${SITE}${p === '/' ? '' : p}` })),
    ...HELP_ARTICLES.map((a) => ({ url: `${SITE}/help/${a.id}` })),
  ];
}

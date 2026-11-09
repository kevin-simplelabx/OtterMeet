/**
 * Website pages that are built but hidden at launch (tech spec 3.2). Off: the route 404s and isn't linked or in the
 * sitemap. Set the env var to "true" to turn one on.
 */
export const flags = {
  showPricing: process.env.NEXT_PUBLIC_SHOW_PRICING === 'true',
  showExplore: process.env.NEXT_PUBLIC_SHOW_EXPLORE === 'true',
};

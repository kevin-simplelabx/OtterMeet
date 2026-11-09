import articles from '@/content/help-articles.json';

export interface HelpArticle {
  id: string;
  topic: string;
  title: string;
  paras: string[];
}

export const HELP_ARTICLES = articles as HelpArticle[];

/** Topics in the order their first article appears. */
export const HELP_TOPICS = [...new Set(HELP_ARTICLES.map((a) => a.topic))];

export const findArticle = (id: string) => HELP_ARTICLES.find((a) => a.id === id);

export function snippet(a: HelpArticle) {
  const s = a.paras[0] ?? '';
  return s.length > 150 ? `${s.slice(0, 147).replace(/\s+\S*$/, '')}…` : s;
}

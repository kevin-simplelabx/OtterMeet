import type { Metadata } from 'next';
import { Suspense } from 'react';
import { SitePage } from '@/components/site/Site';
import { HelpCentre } from '@/components/site/HelpCentre';

export const metadata: Metadata = {
  title: 'Help Centre',
  description: 'Answers about sessions, games, joining, events, reports, the passport and your account.',
  alternates: { canonical: '/help' },
};

export default function HelpPage() {
  return (
    <SitePage>
      <Suspense><HelpCentre /></Suspense>
    </SitePage>
  );
}

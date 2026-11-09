import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HostAuth } from '@/components/site/HostAuth';

export const metadata: Metadata = {
  title: 'Start Free',
  description: 'Make your free OtterMeet account. Free while we’re in alpha, no card needed.',
  alternates: { canonical: '/start' },
};

export default function StartPage() {
  return <Suspense><HostAuth mode="signup" /></Suspense>;
}

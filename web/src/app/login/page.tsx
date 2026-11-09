import type { Metadata } from 'next';
import { Suspense } from 'react';
import { HostAuth } from '@/components/site/HostAuth';

export const metadata: Metadata = {
  title: 'Log In',
  description: 'Log in to your OtterMeet sessions and events.',
  alternates: { canonical: '/login' },
};

export default function LoginPage() {
  return <Suspense><HostAuth mode="login" /></Suspense>;
}

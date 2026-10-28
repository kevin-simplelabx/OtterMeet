import { Suspense } from 'react';
import { SignupForm } from '@/components/AuthForm';

export const metadata = { title: 'Start hosting · OtterMeet' };

export default function SignupPage() {
  return <Suspense><SignupForm /></Suspense>;
}

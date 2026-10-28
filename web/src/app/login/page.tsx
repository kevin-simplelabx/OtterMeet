import { Suspense } from 'react';
import { LoginForm } from '@/components/AuthForm';

export const metadata = { title: 'Log in · OtterMeet' };

export default function LoginPage() {
  return <Suspense><LoginForm /></Suspense>;
}

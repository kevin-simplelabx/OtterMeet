import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/lib/auth';
import './globals.css';

export const metadata: Metadata = {
  title: 'OtterMeet: live games and Q&A for big rooms',
  description:
    'Run workshops, town halls and offsites for 100+ people. Attendees join from their phones with one QR code: icebreakers, crowd debates, quizzes, Q&A and feedback.',
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

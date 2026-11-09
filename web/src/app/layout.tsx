import type { Metadata, Viewport } from 'next';
import { AuthProvider } from '@/lib/auth';
import './globals.css';

const description = 'Send the invites, get everyone talking on the big screen, and see who comes back. People join on their phones: no app, no account.';

export const metadata: Metadata = {
  metadataBase: new URL('https://ottermeet.io'),
  title: { default: 'OtterMeet · Get-togethers everyone joins in', template: '%s · OtterMeet' },
  description,
  manifest: '/manifest.webmanifest',
  openGraph: {
    siteName: 'OtterMeet',
    type: 'website',
    locale: 'en_GB',
    description,
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'OtterMeet: Get-togethers everyone joins in. We otter meet.' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, themeColor: '#e58a13' };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}

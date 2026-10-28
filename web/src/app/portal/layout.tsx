'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/ds';
import { Wordmark } from '@/components/SiteHeader';
import { api } from '@/lib/api';
import { useAuth, useRequireHost } from '@/lib/auth';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const host = useRequireHost();
  const { setHost } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await api('/auth/logout', { method: 'POST' }).catch(() => {});
    setHost(null);
    router.replace('/');
  }

  if (!host) return <p className="body text-ink-muted p-8" aria-live="polite">Loading…</p>;

  const tabs = [['/portal', 'Sessions'], ['/portal/account', 'Account']] as const;
  const isActive = (href: string) => (href === '/portal' ? pathname === '/portal' || pathname.startsWith('/portal/sessions') : pathname === href);

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-10 bg-surface border-b border-border">
        <div className="wrap flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3">
          <div className="flex items-center gap-6">
            <Wordmark />
            <nav aria-label="Portal" className="flex gap-1">
              {tabs.map(([href, label]) => (
                <Link key={href} href={href} aria-current={isActive(href) ? 'page' : undefined}
                  className={`label px-4 py-2 rounded-full no-underline ${isActive(href) ? 'bg-accent-soft !text-accent' : '!text-ink hover:bg-surface-fill'}`}>
                  {label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="body-sm text-ink-muted max-sm:hidden">{host.name}</span>
            <Button variant="quiet" size="sm" onClick={logout}>Log Out</Button>
          </div>
        </div>
      </header>
      <main className="wrap pt-10 pb-16">{children}</main>
    </div>
  );
}

'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { api } from './api';
import type { Host } from './types';

interface AuthValue {
  /** undefined while loading, null when signed out */
  host: Host | null | undefined;
  setHost: (host: Host | null) => void;
}

const AuthContext = createContext<AuthValue>({ host: undefined, setHost: () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [host, setHost] = useState<Host | null | undefined>(undefined);
  useEffect(() => {
    api<{ host: Host | null }>('/auth/me').then((d) => setHost(d.host), () => setHost(null));
  }, []);
  return <AuthContext.Provider value={{ host, setHost }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);

/** Sends signed-out visitors to /login and back again afterwards. */
export function useRequireHost() {
  const { host } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (host === null) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
  }, [host, router, pathname]);
  return host;
}

'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, setAuth, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        setIsRestoring(true);
        try {
          const { data } = await api.post('/auth/refresh');
          if (data.user && data.accessToken) {
            setAuth(data.user, data.accessToken);
          } else {
            throw new Error('No session');
          }
        } catch (error) {
          await api.post('/auth/logout').catch(() => {});
          logout();
          router.push('/login');
        } finally {
          setIsRestoring(false);
          setMounted(true);
        }
      } else {
        setMounted(true);
      }
    };

    checkAuth();
  }, [isAuthenticated, router, setAuth, logout]);

  if (!mounted || isRestoring || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#04060c] flex items-center justify-center text-[#F4C430] font-bebas text-2xl tracking-widest animate-pulse">
        VERIFYING CLEARANCE...
      </div>
    );
  }

  return <>{children}</>;
}

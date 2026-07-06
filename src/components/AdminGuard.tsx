'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import api from '@/lib/axios';

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user, setAuth, logout } = useAuthStore();
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
            if (data.user.role !== 'ADMIN') {
              router.push('/profile');
              return;
            }
          } else {
            throw new Error('No session');
          }
        } catch {
          await api.post('/auth/logout').catch(() => {});
          logout();
          router.push('/login');
        } finally {
          setIsRestoring(false);
          setMounted(true);
        }
      } else {
        if (user && user.role !== 'ADMIN') {
          router.push('/profile');
          return;
        }
        setMounted(true);
      }
    };
    checkAuth();
  }, [isAuthenticated, user, router, setAuth, logout]);

  if (!mounted || isRestoring || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#04060c] flex items-center justify-center text-[#F4C430] font-bebas text-2xl tracking-widest animate-pulse">
        VERIFYING CLEARANCE...
      </div>
    );
  }

  return <>{children}</>;
}

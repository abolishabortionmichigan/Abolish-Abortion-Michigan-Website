'use client';

import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';
import { useUserStore } from '@/store/use-user';
import { getAuthToken, verifyToken } from '@/lib/actions/auth-actions';
import { Loader2 } from 'lucide-react';
import AppSidebar from '../components/layout/app-sidebar';
import AppHeader from '../components/layout/app-header';
import Footer from '@/components/Footer';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { token, setToken, logout, setUser } = useUserStore();

  useEffect(() => {
    const checkAuth = async () => {
      setIsCheckingAuth(true);
      try {
        const cookieToken = await getAuthToken();

        if (cookieToken && !token) {
          setToken(cookieToken);
        }

        const tokenToVerify = token || cookieToken;

        if (tokenToVerify) {
          const res = await verifyToken(tokenToVerify);

          if (res.authorized) {
            if (!token) {
              setToken(tokenToVerify);
            }
            if (res.user) {
              setUser(res.user);
            }
            if (res.user?.role !== 'admin') {
              router.push('/login');
            }
          } else {
            await logout();
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth error:', error);
        await logout();
        router.push('/login');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-red-600" />
          <p className="text-gray-500">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex-1 overflow-hidden flex flex-col">
        <AppHeader />
        <div className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-[calc(100vh-200px)]">
            {children}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
}

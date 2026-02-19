'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useUserStore } from '@/store/use-user';
import { checkAuthStatus } from '@/lib/actions/auth-actions';
import { Loader2 } from 'lucide-react';
import AppSidebar from '../components/layout/app-sidebar';
import AppHeader from '../components/layout/app-header';


export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const { logout, setUser } = useUserStore();

  useEffect(() => {
    const doCheck = async () => {
      setIsCheckingAuth(true);
      try {
        const res = await checkAuthStatus();

        if (res.authorized) {
          if (res.user) {
            setUser(res.user);
          }
          if (res.user?.role !== 'admin') {
            router.push('/manage-7x9k');
          }
        } else {
          await logout();
          router.push('/manage-7x9k');
        }
      } catch {
        await logout();
        router.push('/manage-7x9k');
      } finally {
        setIsCheckingAuth(false);
      }
    };

    doCheck();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [pathname]);

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
        <div ref={scrollRef} className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto p-4 md:p-6 min-h-[calc(100vh-200px)]">
            {children}
          </div>

        </div>
      </div>
    </div>
  );
}

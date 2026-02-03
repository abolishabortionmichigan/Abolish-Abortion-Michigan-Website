'use client';

import { useUserStore } from '@/store/use-user';

export default function AppHeader() {
  const { user } = useUserStore();

  return (
    <div className="border-b bg-white h-14 px-4 flex items-center justify-between">
      <h1 className="text-lg font-semibold">Admin Dashboard</h1>
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-500">
          {user?.email || 'Admin'}
        </span>
        <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center text-sm font-medium">
          {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
        </div>
      </div>
    </div>
  );
}

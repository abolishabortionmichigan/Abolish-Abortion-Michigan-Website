import { create } from 'zustand';
import { persist, PersistOptions } from 'zustand/middleware';
import { User } from '@/types';

interface UserState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => Promise<void>;
}

type UserPersist = Pick<UserState, 'user'>;

const persistConfig: PersistOptions<UserState, UserPersist> = {
  name: 'aam-user-data',
  partialize: (state) => ({
    user: state.user,
  }),
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      logout: async () => {
        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
          console.error('Logout error:', error);
        }
        set({ user: null, token: null });
      },
    }),
    persistConfig
  )
);

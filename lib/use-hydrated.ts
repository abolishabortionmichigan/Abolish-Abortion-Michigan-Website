'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * False during SSR and the hydration render, true afterwards. Use it to gate
 * anything read from localStorage (the cart count) so server and first client
 * render agree.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

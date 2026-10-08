'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart, cartCount } from '@/store/cart';
import { useHydrated } from '@/lib/use-hydrated';

/**
 * Cart link for the header.
 *
 * The cart used to be reachable only from the "added to your cart" message,
 * so once that faded there was no way back to it without adding something
 * else - a buyer told us so. This keeps it one click away from every page.
 *
 * The count is read from localStorage, so it is gated on hydration: rendering
 * it during SSR would not match the first client render.
 */
export default function CartLink({ className = '' }: { className?: string }) {
  const lines = useCart((s) => s.lines);
  const hydrated = useHydrated();
  const n = hydrated ? cartCount(lines) : 0;

  return (
    <Link
      href="/store/cart"
      aria-label={n > 0 ? `Cart, ${n} item${n === 1 ? '' : 's'}` : 'Cart'}
      className={`relative inline-flex items-center justify-center p-2 text-white transition-colors hover:text-red-500 ${className}`}
    >
      <ShoppingBag className="h-5 w-5" aria-hidden="true" />
      {n > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white"
        >
          {n > 99 ? '99+' : n}
        </span>
      )}
    </Link>
  );
}

'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useCart, cartCount, cartSubtotal } from '@/store/cart';
import { formatMoney } from '@/lib/format';
import { useHydrated } from '@/lib/use-hydrated';

/**
 * A plain "View cart" link for store pages.
 *
 * The header has a cart icon, but an icon alone is easy to miss - the first
 * customer said getting to the cart was hard. This spells it out in words on
 * the pages where someone is actually shopping, and shows what is in it so
 * there is a reason to click.
 *
 * Renders nothing until hydrated, and nothing when the cart is empty, so it
 * never shows "View cart (0)".
 */
export default function ViewCartBar() {
  const lines = useCart((s) => s.lines);
  const hydrated = useHydrated();
  if (!hydrated) return null;
  const n = cartCount(lines);
  if (n === 0) return null;

  return (
    <div className="border-b border-gray-200 bg-gray-50">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <p className="text-sm text-gray-700">
          <ShoppingBag className="mr-2 inline h-4 w-4 align-text-bottom" aria-hidden="true" />
          {n} item{n === 1 ? '' : 's'} in your cart
          <span className="hidden sm:inline"> · {formatMoney(cartSubtotal(lines))}</span>
        </p>
        <Link
          href="/store/cart"
          className="shrink-0 rounded bg-red-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-red-700"
        >
          View cart
        </Link>
      </div>
    </div>
  );
}

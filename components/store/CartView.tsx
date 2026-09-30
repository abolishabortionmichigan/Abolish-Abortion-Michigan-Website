'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ImageOff, Lock, Trash2 } from 'lucide-react';
import { useCart, cartSubtotal, lineKey, MAX_LINE_QTY } from '@/store/cart';
import { useHydrated } from '@/lib/use-hydrated';
import { startCheckout } from '@/lib/actions/checkout-actions';
import { formatMoney } from '@/lib/format';
import { capture } from '@/lib/analytics';

/**
 * Cart contents and order summary.
 *
 * The totals shown here are a local preview. startCheckout() re-prices the
 * whole cart from the database, and settleOrder() then verifies Stripe's
 * reported total against that server-side price before marking anything paid,
 * so a tampered localStorage changes what the customer *sees* and nothing else.
 */
export default function CartView({
  checkoutOpen,
  shippingFlatCents,
  freeOverCents,
  cancelled,
}: {
  checkoutOpen: boolean;
  shippingFlatCents: number;
  freeOverCents: number;
  cancelled: boolean;
}) {
  const hydrated = useHydrated();
  const { lines, setQuantity, remove } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The cart lives in localStorage, so the server render has no idea what is
  // in it. Render a placeholder until hydration to avoid a mismatch.
  if (!hydrated) {
    return <div className="h-40 animate-pulse rounded-lg bg-gray-100" aria-busy="true" />;
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 px-6 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-gray-600">
          Find clothing, stickers, signs and materials for a bolder witness.
        </p>
        <Link
          href="/store"
          className="mt-6 inline-block rounded bg-red-600 px-6 py-3 font-bold text-white transition-colors hover:bg-red-700"
        >
          Visit the store
        </Link>
      </div>
    );
  }

  const subtotal = cartSubtotal(lines);
  const shipping = freeOverCents > 0 && subtotal >= freeOverCents ? 0 : shippingFlatCents;

  const checkout = async () => {
    setBusy(true);
    setError(null);
    capture('store_checkout_started', { lines: lines.length, subtotal_cents: subtotal });
    const r = await startCheckout({
      lines: lines.map((l) => ({ productId: l.productId, variantId: l.variantId, quantity: l.quantity })),
    });
    if (r.ok) {
      window.location.assign(r.url);
    } else {
      setError(r.error);
      setBusy(false);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
      <ul className="divide-y divide-gray-200 rounded-lg border border-gray-200">
        {lines.map((l) => {
          const key = lineKey(l);
          return (
            <li key={key} className="flex gap-4 px-4 py-4 md:px-5">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded bg-gray-100">
                {l.image ? (
                  <Image src={l.image} alt="" fill sizes="80px" className="object-cover" />
                ) : (
                  <ImageOff className="absolute inset-0 m-auto h-6 w-6 text-gray-400" aria-hidden="true" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <Link
                  href={`/store/product/${l.slug}`}
                  className="font-semibold text-gray-900 hover:text-red-700 hover:underline"
                >
                  {l.name}
                </Link>
                {l.variantLabel && <p className="text-sm text-gray-500">{l.variantLabel}</p>}
                <div className="mt-2 flex items-center gap-3">
                  <label className="sr-only" htmlFor={`qty-${key}`}>
                    Quantity for {l.name}
                  </label>
                  <select
                    id={`qty-${key}`}
                    className="w-20 rounded border border-gray-300 px-2 py-1.5 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={l.quantity}
                    onChange={(e) => setQuantity(key, Number(e.target.value))}
                  >
                    {Array.from({ length: MAX_LINE_QTY }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => remove(key)}
                    className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" /> Remove
                  </button>
                </div>
              </div>
              <p className="shrink-0 font-semibold text-gray-900">
                {formatMoney(l.unitPriceCents * l.quantity)}
              </p>
            </li>
          );
        })}
      </ul>

      <aside className="h-fit rounded-lg border border-gray-200 px-5 py-6">
        <h2 className="text-xl font-bold text-gray-900">Order summary</h2>
        <dl className="mt-4 space-y-2">
          <div className="flex justify-between">
            <dt className="text-gray-600">Subtotal</dt>
            <dd className="text-gray-900">{formatMoney(subtotal)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-gray-600">Shipping</dt>
            <dd className="text-gray-900">{shipping === 0 ? 'Free' : formatMoney(shipping)}</dd>
          </div>
          <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
            <dt className="text-gray-900">Total</dt>
            <dd className="text-gray-900">{formatMoney(subtotal + shipping)}</dd>
          </div>
        </dl>
        {freeOverCents > 0 && shipping > 0 && (
          <p className="mt-2 text-sm text-gray-500">
            Free shipping on orders of {formatMoney(freeOverCents)} or more.
          </p>
        )}
        <p className="mt-2 text-sm text-gray-500">
          Most items are printed to order.{' '}
          <Link href="/shipping-returns" className="underline underline-offset-2 hover:text-red-700">
            Shipping and returns
          </Link>
        </p>

        <div className="mt-5 space-y-3">
          {cancelled && (
            <p role="status" className="rounded border border-amber-300 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              Checkout was cancelled. Your cart is still here.
            </p>
          )}
          {error && (
            <p role="alert" className="rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </p>
          )}
          {checkoutOpen ? (
            <button
              type="button"
              onClick={checkout}
              disabled={busy}
              className="inline-flex w-full items-center justify-center gap-2 rounded bg-red-600 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Lock className="h-4 w-4" aria-hidden="true" />
              {busy ? 'Opening secure checkout...' : 'Check out securely'}
            </button>
          ) : (
            <p className="rounded bg-gray-100 px-3 py-3 text-sm text-gray-600">
              Online checkout opens soon. Your cart will be saved on this device until then.
            </p>
          )}
          {checkoutOpen && (
            <p className="text-xs leading-snug text-gray-500">
              Payment is handled by Stripe. You will enter your shipping address and payment details on the next page.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}

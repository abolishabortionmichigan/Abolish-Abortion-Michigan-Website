'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useCart, MAX_LINE_QTY } from '@/store/cart';
import { formatMoney } from '@/lib/format';
import { capture } from '@/lib/analytics';

interface Variant {
  id: string;
  label: string;
  price_cents: number | null;
  stock: number | null;
}

/**
 * Variant picker, quantity and add-to-cart.
 *
 * Prices shown here are for DISPLAY ONLY. startCheckout() re-reads every
 * product and variant from the database and prices the order server-side, so
 * an edited localStorage cart cannot change what anyone is charged.
 */
export default function AddToCart({
  product,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    price_cents: number;
    image: string | null;
    options_label: string | null;
    variants: Variant[];
  };
}) {
  const add = useCart((s) => s.add);
  const hasVariants = product.variants.length > 0;
  const [variantId, setVariantId] = useState<string>('');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const variant = product.variants.find((v) => v.id === variantId) ?? null;
  const price = variant?.price_cents ?? product.price_cents;
  const soldOut = (v: Variant) => v.stock !== null && v.stock <= 0;
  const allSoldOut = hasVariants && product.variants.every(soldOut);

  const onAdd = () => {
    setError(null);
    if (hasVariants && !variant) {
      setError(`Please choose a ${product.options_label?.toLowerCase() || 'option'}.`);
      return;
    }
    if (variant && soldOut(variant)) {
      setError('That option is sold out.');
      return;
    }
    add({
      productId: product.id,
      variantId: variant?.id ?? null,
      slug: product.slug,
      name: product.name,
      variantLabel: variant?.label ?? null,
      unitPriceCents: price,
      image: product.image,
      quantity: qty,
    });
    capture('store_add_to_cart', { product: product.slug, variant: variant?.label ?? null, qty });
    setAdded(true);
  };

  return (
    <div className="space-y-5">
      <p className="text-3xl font-bold text-gray-900">{formatMoney(price)}</p>

      {hasVariants && (
        <fieldset>
          <legend className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-700">
            {product.options_label || 'Option'}
          </legend>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((v) => {
              const out = soldOut(v);
              const selected = v.id === variantId;
              return (
                <button
                  key={v.id}
                  type="button"
                  disabled={out}
                  aria-pressed={selected}
                  onClick={() => {
                    setVariantId(v.id);
                    setAdded(false);
                  }}
                  className={`min-w-14 rounded border px-3 py-2 text-sm font-semibold transition-colors ${
                    selected
                      ? 'border-red-600 bg-red-600 text-white'
                      : 'border-gray-300 bg-white text-gray-900 hover:border-red-600'
                  } disabled:cursor-not-allowed disabled:line-through disabled:opacity-40`}
                >
                  {v.label}
                  {v.price_cents !== null && v.price_cents !== product.price_cents && (
                    <span className="ml-1 text-xs opacity-80">({formatMoney(v.price_cents)})</span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="flex items-end gap-3">
        <div>
          <label htmlFor="qty" className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
            Quantity
          </label>
          <select
            id="qty"
            className="w-24 rounded border border-gray-300 px-3 py-2.5 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-500"
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
          >
            {Array.from({ length: Math.min(MAX_LINE_QTY, 10) }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={onAdd}
          disabled={allSoldOut}
          className="flex-1 rounded bg-red-600 px-6 py-3 text-lg font-bold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {allSoldOut ? 'Sold out' : 'Add to cart'}
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm font-semibold text-red-700">
          {error}
        </p>
      )}
      {added && (
        <p role="status" className="rounded border border-green-300 bg-green-50 px-3 py-2 text-sm text-green-900">
          Added to your cart.{' '}
          <Link href="/store/cart" className="font-semibold underline underline-offset-2">
            View cart and check out
          </Link>
        </p>
      )}
    </div>
  );
}

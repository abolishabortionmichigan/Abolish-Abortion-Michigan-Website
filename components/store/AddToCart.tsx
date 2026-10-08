'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useCart, MAX_LINE_QTY } from '@/store/cart';
import { formatMoney } from '@/lib/format';
import { capture } from '@/lib/analytics';
import { isPhoneList, phoneBrand, splitAxes } from '@/lib/store-variants';

// Carried across products: toggling an add-on loads a different product, and
// being sent back to "Choose a size" every time makes comparing them tedious.
const SIZE_KEY = 'aam-store-size';

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
  imageKey,
  onImageKey,
}: {
  // Whatever decides how the product LOOKS - the shirt colour, the phone
  // model. The parent holds it so the gallery can follow it AND so it survives
  // moving to another slogan or front, which is a different page.
  imageKey?: string;
  onImageKey?: (key: string) => void;
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
  // A printed-to-order mug has exactly one variant ("11oz"). Preselecting it
  // keeps the price and the Add button honest instead of making the shopper
  // click a single-option picker to get past "Please choose a size".
  const axes = splitAxes(product.variants);
  const [ownColour, setOwnColour] = useState<string>(axes ? axes.colours[0] : '');
  // A sticker is two sizes in one colour. Preselect an axis that has only one
  // value so the shopper is not asked to choose from a list of one.
  const [ownSize, setOwnSize] = useState<string>(axes && axes.sizes.length === 1 ? axes.sizes[0] : '');

  // Restore the last size on a product that offers it. Read after mount, so
  // the server render and the first client render still agree.
  const sizeList = (axes?.sizes ?? []).join('');
  useEffect(() => {
    if (!sizeList) return;
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(SIZE_KEY);
    } catch {
      saved = null;
    }
    if (saved && sizeList.split('').includes(saved)) setOwnSize(saved);
  }, [sizeList]);
  const [ownVariantId, setOwnVariantId] = useState<string>(
    product.variants.length === 1 ? product.variants[0].id : ''
  );

  // When the parent is tracking the selection it wins, so a colour carried
  // over from the last product shows in the picker and not just the photos.
  const colour = axes && imageKey && axes.colours.includes(imageKey) ? imageKey : ownColour;
  // On a car magnet it is the SIZE that changes the shape, so the tracked
  // option can be either axis - whichever one the photos follow.
  const size = axes && imageKey && axes.sizes.includes(imageKey) ? imageKey : ownSize;
  const carried = !axes && imageKey ? product.variants.find((v) => v.label === imageKey) : undefined;
  const variantId = carried?.id ?? ownVariantId;

  const chooseColour = (c: string) => {
    setOwnColour(c);
    onImageKey?.(c);
    setAdded(false);
    setError(null);
  };
  const chooseSize = (z: string) => {
    setOwnSize(z);
    try {
      sessionStorage.setItem(SIZE_KEY, z);
    } catch {
      /* private browsing; the size just will not carry over */
    }
    onImageKey?.(z);
    setAdded(false);
    setError(null);
  };
  const chooseVariant = (id: string) => {
    setOwnVariantId(id);
    const v = product.variants.find((x) => x.id === id);
    if (v) onImageKey?.(v.label);
    setAdded(false);
    setError(null);
  };
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const picked = axes && colour && size ? axes.find(colour, size) : null;
  const variant = (axes ? picked : product.variants.find((v) => v.id === variantId)) ?? null;
  const price = variant?.price_cents ?? product.price_cents;
  const soldOut = (v: Variant) => v.stock !== null && v.stock <= 0;

  // Thirty-four phone models in one flat list is a wall of text, so split it
  // under Apple / Samsung headings. The order itself comes from the import.
  const byBrand = isPhoneList(product.variants.map((v) => v.label))
    ? [
        ...product.variants.reduce((m, v) => {
          const b = phoneBrand(v.label) ?? 'Other';
          return m.set(b, [...(m.get(b) ?? []), v]);
        }, new Map<string, Variant[]>()),
      ]
    : null;
  const allSoldOut = hasVariants && product.variants.every(soldOut);

  const onAdd = () => {
    setError(null);
    if (hasVariants && !variant) {
      setError(axes ? 'Please choose a colour and a size.'
        : `Please choose a ${product.options_label?.toLowerCase() || 'option'}.`);
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

      {hasVariants && axes && (
        <div className={`grid gap-4 ${axes.colours.length > 1 && axes.sizes.length > 1 ? 'sm:grid-cols-2' : ''}`}>
          {axes.colours.length > 1 && (
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">Colour</span>
            <select
              value={colour}
              onChange={(e) => chooseColour(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 focus:border-red-600 focus:outline-none"
            >
              {axes.colours.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </label>
          )}
          {axes.sizes.length > 1 && (
          <label className="block">
            <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">Size</span>
            <select
              value={size}
              onChange={(e) => chooseSize(e.target.value)}
              className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 focus:border-red-600 focus:outline-none"
            >
              <option value="">Choose a size</option>
              {axes.sizes.map((z) => {
                const v = axes.find(colour, z);
                return (
                  <option key={z} value={z} disabled={!v || soldOut(v)}>
                    {z}
                    {v && v.price_cents !== null && v.price_cents !== product.price_cents
                      ? `  (${formatMoney(v.price_cents)})` : ''}
                  </option>
                );
              })}
            </select>
          </label>
          )}
        </div>
      )}

      {/* One axis with a long list - 34 phone models - reads better as a menu. */}
      {hasVariants && !axes && product.variants.length > 8 && (
        <label className="block">
          <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
            {product.options_label || 'Option'}
          </span>
          <select
            value={variantId}
            onChange={(e) => chooseVariant(e.target.value)}
            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 focus:border-red-600 focus:outline-none"
          >
            <option value="">Choose {(product.options_label || 'an option').toLowerCase()}</option>
            {byBrand
              ? byBrand.map(([brand, items]) => (
                  <optgroup key={brand} label={brand}>
                    {items.map((v) => (
                      <option key={v.id} value={v.id} disabled={soldOut(v)}>
                        {v.label}
                        {v.price_cents !== null && v.price_cents !== product.price_cents
                          ? `  (${formatMoney(v.price_cents)})` : ''}
                      </option>
                    ))}
                  </optgroup>
                ))
              : product.variants.map((v) => (
                  <option key={v.id} value={v.id} disabled={soldOut(v)}>
                    {v.label}
                    {v.price_cents !== null && v.price_cents !== product.price_cents
                      ? `  (${formatMoney(v.price_cents)})` : ''}
                  </option>
                ))}
          </select>
        </label>
      )}

      {hasVariants && !axes && product.variants.length <= 8 && (

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
                  onClick={() => chooseVariant(v.id)}
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

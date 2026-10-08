'use client';

import { useEffect, useState, type ReactNode } from 'react';
import AddToCart from './AddToCart';
import ProductGallery from './ProductGallery';
import { imageAxis } from '@/lib/store-variants';

const CARRIED = 'aam-store-option';
const SEP = '';

interface Variant {
  id: string;
  label: string;
  price_cents: number | null;
  stock: number | null;
}

/**
 * The two-column product layout, client-side only so the gallery can follow
 * the picker: choose Charcoal and the photos change to the Charcoal shirt,
 * choose an iPhone 15 and you see that case. `imagesByColour` is built on the
 * server from the variant id in each mockup URL; anything with no photos of
 * its own falls back to the full set.
 *
 * `header` and `footer` are server-rendered (title, design pickers, copy) and
 * passed straight through, so only the interactive parts ship as client code.
 */
export default function ProductDetail({
  images,
  imagesByColour,
  product,
  groupKey,
  header,
  footer,
}: {
  images: string[];
  imagesByColour: Record<string, string[]>;
  groupKey?: string;
  product: {
    id: string;
    slug: string;
    name: string;
    price_cents: number;
    image: string | null;
    options_label: string | null;
    variants: Variant[];
  };
  header: ReactNode;
  footer: ReactNode;
}) {
  const axis = imageAxis(product.variants);
  const keyList = (axis?.keys ?? []).join(SEP);
  const [key, setKey] = useState<string>(axis ? axis.keys[0] : '');

  // Carry the choice across products. Switching slogan or front loads another
  // page, and arriving back on the default colour every time means re-picking
  // it to compare two designs.
  useEffect(() => {
    const keys = keyList ? keyList.split(SEP) : [];
    if (!keys.length) return;
    let saved: string | null = null;
    try {
      saved = sessionStorage.getItem(CARRIED);
    } catch {
      saved = null;
    }
    if (saved && keys.includes(saved)) setKey(saved);
  }, [keyList]);

  const choose = (k: string) => {
    // Both pickers report in; only the one the photos follow counts.
    if (!(axis?.keys ?? []).includes(k)) return;
    setKey(k);
    try {
      sessionStorage.setItem(CARRIED, k);
    } catch {
      /* private browsing; the choice just will not carry over */
    }
  };
  const mine = (key && imagesByColour[key]) || [];
  // Fall back to the whole set only when this option has no photos of its
  // own; topping up a thin one mixes in photos of a different colour, which
  // is the thing this is meant to stop.
  const shown = mine.length ? mine : images;

  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
      {/* Keyed on the colour so the active thumbnail resets to the first shot
          of the colour just picked, rather than keeping a stale index. */}
      <ProductGallery key={key} images={shown} name={product.name} />

      <div>
        {header}
        <AddToCart
          product={product}
          groupKey={groupKey}
          imageKey={axis ? key : undefined}
          onImageKey={axis ? choose : undefined}
        />
        {footer}
      </div>
    </div>
  );
}

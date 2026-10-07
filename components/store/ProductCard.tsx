'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { formatPriceRange } from '@/lib/format';

/**
 * Grid tile for a product. Styled to match NewsCard: dark #1a1a1a card, white
 * title, gray-400 secondary text, red on hover.
 *
 * Client component only because Printify's CDN occasionally 404s a mockup and
 * a broken <Image> renders as a torn-icon box; the same onError fallback
 * NewsCard uses keeps the grid tidy.
 */
export default function ProductCard({
  slug,
  name,
  image,
  priceFrom,
  priceTo,
  soldOut,
  designCount,
}: {
  slug: string;
  name: string;
  image: string | null;
  priceFrom: number;
  priceTo: number;
  soldOut: boolean;
  /** How many designs this tile stands for, when it represents a group. */
  designCount?: number;
}) {
  const [imageError, setImageError] = useState(false);
  const hasImage = Boolean(image) && !imageError;

  return (
    <Link
      href={`/store/product/${slug}`}
      className="group flex flex-col overflow-hidden rounded-lg bg-[#1a1a1a] transition-shadow hover:shadow-lg"
    >
      <div className="relative aspect-square bg-[#2a2a2a]">
        {hasImage ? (
          <Image
            src={image as string}
            alt=""
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <ImageOff className="h-12 w-12 text-gray-600" aria-hidden="true" />
          </div>
        )}
        {soldOut && (
          <span className="absolute left-3 top-3 rounded bg-black/80 px-2 py-1 text-[0.7rem] font-bold uppercase tracking-wide text-white">
            Sold out
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 line-clamp-2 text-lg font-bold text-white group-hover:text-red-500">{name}</h3>
        <p className="text-sm text-gray-400">{formatPriceRange(priceFrom, priceTo)}
          {designCount && designCount > 1 ? (
            <span className="ml-2 text-xs font-normal text-gray-400">{designCount} designs</span>
          ) : null}</p>
      </div>
    </Link>
  );
}

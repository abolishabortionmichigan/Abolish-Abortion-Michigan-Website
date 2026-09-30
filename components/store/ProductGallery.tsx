'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Main product image with thumbnail strip. Red ring marks the active one. */
export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState<Set<number>>(new Set());

  const usable = images.filter((_, i) => !failed.has(i));
  if (images.length === 0 || usable.length === 0) {
    return (
      <div className="grid aspect-square place-items-center rounded-lg bg-[#2a2a2a]">
        <ImageOff className="h-16 w-16 text-gray-600" aria-hidden="true" />
      </div>
    );
  }

  const activeIdx = failed.has(active) ? images.findIndex((_, i) => !failed.has(i)) : active;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-lg bg-[#2a2a2a]">
        <Image
          src={images[activeIdx]}
          alt={name}
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
          onError={() => setFailed((s) => new Set(s).add(activeIdx))}
        />
      </div>
      {images.length > 1 && (
        <ul className="mt-3 grid grid-cols-5 gap-2">
          {images.map((src, i) =>
            failed.has(i) ? null : (
              <li key={src}>
                <button
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`Show image ${i + 1} of ${images.length}`}
                  aria-pressed={i === activeIdx}
                  className={cn(
                    'relative block aspect-square w-full overflow-hidden rounded border-2 transition-colors',
                    i === activeIdx ? 'border-red-600' : 'border-transparent hover:border-gray-500'
                  )}
                >
                  <Image src={src} alt="" fill sizes="120px" className="object-cover" />
                </button>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}

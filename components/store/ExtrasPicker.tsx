'use client';

import { useRouter } from 'next/navigation';
import { formatMoney } from '@/lib/format';

/**
 * How much decoration goes on the garment.
 *
 * Printify charges per print placement, so the sleeve marks and neck label
 * genuinely cost more - enough that they belong behind a choice rather than
 * on every shirt by default. Each level is a separate Printify product, so
 * picking one navigates, and the price is shown because it is the whole point.
 */
export default function ExtrasPicker({
  current,
  options,
}: {
  current: string;
  options: { id: string; slug: string; extra: string; price_cents: number }[];
}) {
  const router = useRouter();
  const cheapest = Math.min(...options.map((o) => o.price_cents));
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
        Extras
      </span>
      <select
        value={current}
        onChange={(e) => router.push(`/store/product/${e.target.value}`)}
        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 focus:border-red-600 focus:outline-none"
      >
        {options.map((o) => {
          const extra = o.price_cents - cheapest;
          return (
            <option key={o.id} value={o.slug}>
              {o.extra.replace(/^./, (c) => c.toUpperCase())}
              {extra > 0 ? `  (+${formatMoney(extra)})` : ''}
            </option>
          );
        })}
      </select>
    </label>
  );
}

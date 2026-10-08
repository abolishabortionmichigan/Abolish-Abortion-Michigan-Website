'use client';

import { useRouter } from 'next/navigation';
import { formatMoney } from '@/lib/format';

export interface ExtraOption {
  id: string;
  slug: string;
  /** Which decorations this product carries. */
  decorations: string[];
  price_cents: number;
}

/** What each decoration is, in plain words. */
const DESCRIBE: Record<string, string> = {
  'left sleeve': 'AHA mark on the left sleeve',
  'right sleeve': 'Exodus 20:13 on the right sleeve',
  neck: 'AHA mark at the neck',
};
const ORDER = ['left sleeve', 'right sleeve', 'neck'];

/**
 * Add-ons as checkboxes rather than one long menu.
 *
 * Printify charges per print placement, so each combination of the three is a
 * separate product with its own price. Eight permutations in a dropdown is
 * unreadable; three checkboxes say the same thing and let someone take only
 * the sleeve they want. Ticking one navigates to the product that matches.
 */
export default function ExtrasPicker({
  current,
  options,
}: {
  current: string;
  options: ExtraOption[];
}) {
  const router = useRouter();
  const here = options.find((o) => o.slug === current);
  if (!here) return null;
  const base = Math.min(...options.map((o) => o.price_cents));

  // Which product you land on if you flip one decoration on or off.
  const toggleTo = (d: string) => {
    const want = here.decorations.includes(d)
      ? here.decorations.filter((x) => x !== d)
      : [...here.decorations, d];
    const key = [...want].sort().join('|');
    return options.find((o) => [...o.decorations].sort().join('|') === key) ?? null;
  };

  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-2 text-sm font-bold uppercase tracking-wide text-gray-700">
        Add-ons
      </legend>
      <div className="space-y-2">
        {ORDER.map((d) => {
          const target = toggleTo(d);
          const on = here.decorations.includes(d);
          const delta = target ? target.price_cents - here.price_cents : 0;
          return (
            <label
              key={d}
              className={`flex items-center gap-3 rounded border px-3 py-2 text-sm ${
                target ? 'cursor-pointer border-gray-300 hover:border-red-600' : 'cursor-not-allowed border-gray-200 opacity-50'
              }`}
            >
              <input
                type="checkbox"
                checked={on}
                disabled={!target}
                onChange={() => target && router.push(`/store/product/${target.slug}`)}
                className="h-4 w-4 accent-red-600"
              />
              <span className="flex-1 text-gray-800">{DESCRIBE[d] ?? d}</span>
              {target && delta !== 0 && (
                <span className={`font-semibold ${delta > 0 ? 'text-gray-600' : 'text-green-700'}`}>
                  {delta > 0 ? '+' : '−'}
                  {formatMoney(Math.abs(delta))}
                </span>
              )}
            </label>
          );
        })}
      </div>
      {here.price_cents > base && (
        <p className="mt-2 text-xs text-gray-500">
          Plain is {formatMoney(base)}; add-ons are priced per print placement.
        </p>
      )}
    </fieldset>
  );
}

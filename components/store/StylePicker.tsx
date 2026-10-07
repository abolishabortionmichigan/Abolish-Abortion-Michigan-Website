'use client';

import { useRouter } from 'next/navigation';

/**
 * Choose which front goes on this product - the chest mark or the full AHA
 * front, the map travel mug or the mark one.
 *
 * Like the design, the front is baked into the artwork of a separate Printify
 * product, so picking one navigates. The options come from the trailing
 * parenthetical in "<design> - <type> (<front>)".
 */
export default function StylePicker({
  current,
  options,
}: {
  current: string;
  options: { id: string; slug: string; style: string }[];
}) {
  const router = useRouter();
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
        Front
      </span>
      <select
        value={current}
        onChange={(e) => router.push(`/store/product/${e.target.value}`)}
        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 focus:border-red-600 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.id} value={o.slug}>
            {o.style.replace(/^./, (c) => c.toUpperCase())}
          </option>
        ))}
      </select>
    </label>
  );
}

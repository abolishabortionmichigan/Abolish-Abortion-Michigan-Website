'use client';

import { useRouter } from 'next/navigation';

/**
 * Choose which design goes on this product.
 *
 * Each design is a separate Printify product with its own artwork baked in, so
 * picking one navigates to that product rather than switching a variant. The
 * grouping comes from the naming convention "<design> - <type>".
 */
export default function DesignPicker({
  current,
  options,
}: {
  current: string;
  options: { id: string; slug: string; design: string }[];
}) {
  const router = useRouter();
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold uppercase tracking-wide text-gray-700">
        Design
      </span>
      <select
        value={current}
        onChange={(e) => router.push(`/store/product/${e.target.value}`)}
        className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-900 focus:border-red-600 focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.id} value={o.slug}>
            {o.design}
          </option>
        ))}
      </select>
    </label>
  );
}

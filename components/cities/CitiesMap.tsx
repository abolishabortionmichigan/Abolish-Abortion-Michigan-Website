'use client';

import Link from 'next/link';
import type { CityConfig } from '@/lib/data/cities';
import { US_STATE_PATHS } from '@/lib/data/us-map-paths';

/**
 * SVG map of Michigan with a pin per covered city. Uses the real MI
 * path from VictorCazanave/svg-maps (via our existing us-map-paths
 * table), so the outline is a proper Michigan silhouette — both
 * peninsulas rendered accurately.
 *
 * Projection: the source SVG uses an approximately-linear
 * lng/lat → (x,y) mapping across the US bounding box
 * (parent viewBox: 192 9 1028 746, covering lng -125..-66,
 * lat 24..49). We reproduce that transform for city dots so pins
 * land where they should on the MI path. The map itself is
 * viewBox-cropped to the MI-only region.
 */

// Parent US SVG bbox (from us-map-paths.ts header comment).
const US_VIEWBOX = { x: 192, y: 9, w: 1028, h: 746 };
// The lng/lat range that the parent viewBox represents.
const US_LNG_RANGE = { min: -125, max: -66 };
const US_LAT_RANGE = { min: 24, max: 49 };
// Michigan crop within that parent — chosen to frame both peninsulas
// with a little padding.
const MI_VIEWBOX = { x: 820, y: 65, w: 210, h: 240 };

function project(lat: number, lng: number): { x: number; y: number } {
  const x =
    US_VIEWBOX.x +
    ((lng - US_LNG_RANGE.min) / (US_LNG_RANGE.max - US_LNG_RANGE.min)) * US_VIEWBOX.w;
  const y =
    US_VIEWBOX.y +
    ((US_LAT_RANGE.max - lat) / (US_LAT_RANGE.max - US_LAT_RANGE.min)) * US_VIEWBOX.h;
  return { x, y };
}

// Michigan + neighbor-state paths for context (light gray so MI stands out).
const MI_PATH = US_STATE_PATHS.find((s) => s.id === 'MI');
const NEIGHBOR_IDS = ['OH', 'IN', 'IL', 'WI', 'MN'];
const NEIGHBOR_PATHS = US_STATE_PATHS.filter((s) => NEIGHBOR_IDS.includes(s.id));

export default function CitiesMap({ cities }: { cities: CityConfig[] }) {
  if (!MI_PATH) return null;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 overflow-hidden">
      <svg
        viewBox={`${MI_VIEWBOX.x} ${MI_VIEWBOX.y} ${MI_VIEWBOX.w} ${MI_VIEWBOX.h}`}
        className="w-full h-auto max-h-[600px]"
        role="img"
        aria-label="Map of Michigan with pins marking cities Abolish Abortion Michigan covers"
      >
        {/* Great Lakes / neighbor-state context */}
        {NEIGHBOR_PATHS.map((s) => (
          <path
            key={s.id}
            d={s.d}
            fill="#f3f4f6"
            stroke="#d1d5db"
            strokeWidth={0.6}
          />
        ))}
        {/* Michigan itself */}
        <path
          d={MI_PATH.d}
          fill="#e5e7eb"
          stroke="#6b7280"
          strokeWidth={0.8}
        />

        {/* Numbered city pins — no inline labels because SE Michigan's
            cluster of six cities crushes together at this scale. The
            numbered legend beside the map does the naming. */}
        {cities.map((c, i) => {
          const { x, y } = project(c.latitude, c.longitude);
          const r = Math.max(3, Math.min(6, 3 + Math.sqrt(c.population) / 260));
          return (
            <a key={c.slug} href={`/cities/${c.slug}`} className="cursor-pointer">
              <circle
                cx={x}
                cy={y}
                r={r}
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth={1.1}
                className="hover:opacity-80 transition-opacity"
              >
                <title>{`${i + 1}. ${c.name} — ${c.populationLabel}`}</title>
              </circle>
              <text
                x={x}
                y={y + 1.5}
                fontSize={4}
                fontWeight={700}
                fill="#ffffff"
                textAnchor="middle"
                className="select-none pointer-events-none"
              >
                {i + 1}
              </text>
            </a>
          );
        })}
      </svg>
      <p className="text-xs text-gray-500 mt-3 text-center">
        Click any red pin — or a city in the legend — to open that city&apos;s page.
      </p>

      {/* Numbered legend — visible on all breakpoints, matches map pins */}
      <ol className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-1 text-sm">
        {cities.map((c, i) => (
          <li key={c.slug} className="flex items-baseline gap-2">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-600 text-white text-xs font-bold flex-shrink-0">
              {i + 1}
            </span>
            <Link
              href={`/cities/${c.slug}`}
              className="text-gray-800 hover:text-red-700 hover:underline truncate"
            >
              {c.name}
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}

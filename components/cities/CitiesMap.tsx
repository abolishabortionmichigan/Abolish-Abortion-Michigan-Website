'use client';

import Link from 'next/link';
import type { CityConfig } from '@/lib/data/cities';
import { US_STATE_PATHS } from '@/lib/data/us-map-paths';

/**
 * SVG map of Michigan with a pin per covered city.
 *
 * Projection: svg-maps' source SVG uses geoAlbersUsa (non-linear),
 * so a naive linear US-bbox projection puts MI pins tens of SVG
 * units off. Instead we calibrate against the MI path's actual
 * measured bbox (852-987 × 83-224) mapped to Michigan's real
 * geographic bbox (lat 41.7-48.3, lng -90.5 to -82.4). Within a
 * single state this bbox mapping is accurate enough that every
 * covered city (Detroit, Grand Rapids, Ann Arbor, Traverse City,
 * Sault Ste Marie, Marquette, etc.) lands squarely on land.
 */

// MI path bbox measured via headless-browser getBBox().
const MI_BBOX_SVG = { x: 852.2, y: 83.7, w: 134.9, h: 140.6 };
// Michigan's geographic bounding box (matches the shape's extents).
const MI_BBOX_GEO = { minLat: 41.7, maxLat: 48.3, minLng: -90.5, maxLng: -82.4 };
// SVG viewBox with a little padding around the MI shape.
const MI_VIEWBOX = { x: 848, y: 80, w: 143, h: 149 };

function project(lat: number, lng: number): { x: number; y: number } {
  const x =
    MI_BBOX_SVG.x +
    ((lng - MI_BBOX_GEO.minLng) / (MI_BBOX_GEO.maxLng - MI_BBOX_GEO.minLng)) * MI_BBOX_SVG.w;
  const y =
    MI_BBOX_SVG.y +
    ((MI_BBOX_GEO.maxLat - lat) / (MI_BBOX_GEO.maxLat - MI_BBOX_GEO.minLat)) * MI_BBOX_SVG.h;
  return { x, y };
}

const MI_PATH = US_STATE_PATHS.find((s) => s.id === 'MI');

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
        {/* Michigan */}
        <path
          d={MI_PATH.d}
          fill="#e5e7eb"
          stroke="#374151"
          strokeWidth={0.6}
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

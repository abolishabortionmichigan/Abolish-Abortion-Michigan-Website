'use client';

import Link from 'next/link';
import type { CityConfig } from '@/lib/data/cities';

/**
 * Simple, no-dependency SVG map of Michigan with a pin per covered
 * city. Avoids Leaflet + tile providers (which cost bandwidth + trip
 * up our Artifact-style CSP) — an SVG with a rough MI outline plus
 * mercator-projected dots is enough for the "here's where we cover"
 * signal we need on /cities.
 *
 * Projection: Web-Mercator, clipped to MI's bounding box:
 *   lat 41.7 – 48.3, lng -90.5 – -82.4
 */

const MI_BBOX = { minLat: 41.7, maxLat: 48.3, minLng: -90.5, maxLng: -82.4 };
const MAP_W = 800;
const MAP_H = 720;

function project(lat: number, lng: number): { x: number; y: number } {
  const x = ((lng - MI_BBOX.minLng) / (MI_BBOX.maxLng - MI_BBOX.minLng)) * MAP_W;
  // y is inverted (SVG origin top-left)
  const y = ((MI_BBOX.maxLat - lat) / (MI_BBOX.maxLat - MI_BBOX.minLat)) * MAP_H;
  return { x, y };
}

// Rough Michigan outline (lower + upper peninsula), digitized loosely
// from Census TIGER at low resolution — enough for a recognizable
// silhouette without shipping a 200KB SVG.
const LOWER_PENINSULA_PATH =
  'M 620 450 L 600 435 L 580 425 L 555 415 L 530 405 L 510 400 L 495 405 L 485 415 L 480 430 L 480 450 L 475 470 L 465 490 L 455 510 L 440 530 L 425 545 L 415 555 L 405 570 L 395 590 L 390 610 L 388 630 L 385 650 L 380 670 L 375 685 L 370 695 L 365 700 L 360 705 L 355 710 L 350 715 L 355 720 L 370 720 L 390 715 L 410 710 L 430 705 L 450 700 L 470 695 L 490 690 L 510 685 L 525 680 L 535 670 L 545 655 L 555 640 L 565 620 L 575 600 L 585 580 L 595 560 L 605 540 L 615 520 L 625 500 L 630 480 L 628 465 L 622 455 Z';
const UPPER_PENINSULA_PATH =
  'M 100 240 L 130 235 L 165 232 L 200 232 L 235 232 L 270 232 L 305 232 L 340 235 L 375 240 L 405 245 L 435 250 L 465 258 L 490 268 L 510 280 L 525 295 L 535 315 L 540 335 L 535 355 L 525 370 L 510 380 L 490 385 L 465 385 L 435 383 L 400 380 L 365 378 L 330 375 L 295 373 L 260 370 L 225 368 L 190 365 L 160 360 L 130 353 L 105 345 L 95 330 L 90 310 L 90 290 L 92 270 L 96 255 Z';

export default function CitiesMap({ cities }: { cities: CityConfig[] }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <svg
        viewBox={`0 0 ${MAP_W} ${MAP_H}`}
        className="w-full h-auto"
        role="img"
        aria-label="Map of Michigan with pins marking cities Abolish Abortion Michigan covers"
      >
        <path d={LOWER_PENINSULA_PATH} fill="#e5e7eb" stroke="#9ca3af" strokeWidth={1.5} />
        <path d={UPPER_PENINSULA_PATH} fill="#e5e7eb" stroke="#9ca3af" strokeWidth={1.5} />

        {cities.map((c) => {
          const { x, y } = project(c.latitude, c.longitude);
          // Dot radius scales gently with population (5–14 px).
          const r = Math.max(5, Math.min(14, 5 + Math.sqrt(c.population) / 130));
          return (
            <a key={c.slug} href={`/cities/${c.slug}`} className="cursor-pointer">
              <circle
                cx={x}
                cy={y}
                r={r}
                fill="#dc2626"
                stroke="#ffffff"
                strokeWidth={2}
                className="hover:opacity-80 transition-opacity"
              >
                <title>{c.name} — {c.populationLabel} — click to open city page</title>
              </circle>
              <text
                x={x + r + 4}
                y={y + 4}
                fontSize={14}
                fontWeight={600}
                fill="#111827"
                className="select-none"
              >
                {c.name}
              </text>
            </a>
          );
        })}
      </svg>
      <p className="text-xs text-gray-500 mt-3 text-center">
        Click a red dot to open that city&apos;s page. Dot size reflects population.
      </p>
      {/* SEO-friendly link-list fallback for search crawlers that don't
          traverse the SVG's <a> children. */}
      <ul className="sr-only">
        {cities.map((c) => (
          <li key={c.slug}>
            <Link href={`/cities/${c.slug}`}>{c.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import type { Partner } from '@/lib/data/partners';
import { US_MAP_VIEWBOX, US_STATE_PATHS } from '@/lib/data/us-map-paths';

/**
 * Real geographic SVG US map — each state is a proper path from the
 * VictorCazanave/svg-maps dataset (MIT). States are clickable and colored
 * by partner status:
 *   Red   = us (Michigan)
 *   Green = active partner coalition, clickable → jumps to state entry
 *   Gray  = no partner yet
 *
 * The SVG is 100% inline so it works without any JS and stays crisp at
 * any zoom. Total added weight ~35KB gzipped for all 51 paths.
 */

const STATE_NAME_TO_ABBREV: Record<string, string> = {
  Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA',
  Colorado: 'CO', Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA',
  Hawaii: 'HI', Idaho: 'ID', Illinois: 'IL', Indiana: 'IN', Iowa: 'IA',
  Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA', Maine: 'ME', Maryland: 'MD',
  Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN', Mississippi: 'MS', Missouri: 'MO',
  Montana: 'MT', Nebraska: 'NE', Nevada: 'NV', 'New Hampshire': 'NH', 'New Jersey': 'NJ',
  'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH',
  Oklahoma: 'OK', Oregon: 'OR', Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
  'South Dakota': 'SD', Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT',
  Virginia: 'VA', Washington: 'WA', 'West Virginia': 'WV', Wisconsin: 'WI', Wyoming: 'WY',
};

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function colorFor(state: { id: string; name: string }, partner: Partner | undefined): string {
  if (state.name === 'Michigan') return '#dc2626'; // red-600 — us
  if (partner) return '#16a34a'; // green-600 — active partner
  return '#d1d5db'; // gray-300 — no partner
}

export default function UsStatesMap({
  partnersByState,
}: {
  partnersByState: Map<string, Partner>;
}) {
  // Build abbrev → partner map for O(1) lookup during render
  const partnerByAbbrev = new Map<string, Partner>();
  for (const [stateName, partner] of partnersByState) {
    const abbrev = STATE_NAME_TO_ABBREV[stateName];
    if (abbrev) partnerByAbbrev.set(abbrev, partner);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <svg
        viewBox={US_MAP_VIEWBOX}
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Map of US states with abolitionist partner coverage"
      >
        {US_STATE_PATHS.map((state) => {
          const partner = partnerByAbbrev.get(state.id);
          const isUs = state.name === 'Michigan';
          const fill = colorFor(state, partner);
          const title = isUs
            ? 'Abolish Abortion Michigan (us)'
            : partner
              ? `${state.name} — ${partner.name} (click to view)`
              : `${state.name} — no partner yet`;
          const anchor = partner ? `#${slugify(state.name)}` : undefined;

          const path = (
            <path
              d={state.d}
              fill={fill}
              stroke="#ffffff"
              strokeWidth={1}
              className={
                partner && !isUs
                  ? 'cursor-pointer hover:opacity-80 transition-opacity'
                  : ''
              }
            >
              <title>{title}</title>
            </path>
          );

          if (anchor) {
            return (
              <a key={state.id} href={anchor} aria-label={title}>
                {path}
              </a>
            );
          }
          return <g key={state.id} aria-label={title}>{path}</g>;
        })}
      </svg>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-red-600 rounded" /> Abolish Abortion Michigan
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-green-600 rounded" /> Active partner coalition
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-gray-300 rounded" /> No partner yet
        </span>
      </div>
    </div>
  );
}

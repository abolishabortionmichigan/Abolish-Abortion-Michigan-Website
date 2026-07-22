import type { Partner } from '@/lib/data/partners';

/**
 * Tile-grid US map (cartogram) — each state is one uniformly-sized tile,
 * arranged in an approximation of US geography. Uses CSS Grid so it's
 * fully responsive and requires no SVG dependency.
 *
 * This layout is a common convention in political data viz (FiveThirtyEight,
 * Bloomberg, statebins) because it fixes two problems of a real map: tiny
 * northeastern states become hard to click, and Alaska/Hawaii need special
 * treatment. Every tile is the same size + tap target here.
 *
 * The colours flow from the caller-supplied Map of partners so no state
 * knowledge lives inside the component.
 */

// (row, col) positions on a 10x11 grid. Origin top-left; MI is our
// visual center. Not a strict geographic projection — states are placed
// so their neighbors are approximately correct.
const TILE_POSITIONS: Record<string, [number, number]> = {
  ME: [1, 11],
  VT: [2, 10], NH: [2, 11],
  WI: [3, 6], MI: [3, 7], NY: [3, 10], MA: [3, 11],
  WA: [4, 1], MT: [4, 2], ND: [4, 3], MN: [4, 5], IL: [4, 6], IN: [4, 7], OH: [4, 8], PA: [4, 9], NJ: [4, 10], CT: [4, 11],
  ID: [5, 2], SD: [5, 3], IA: [5, 5], MO: [5, 6], KY: [5, 7], WV: [5, 8], VA: [5, 9], MD: [5, 10], DE: [5, 11],
  OR: [6, 1], WY: [6, 2], NE: [6, 4], KS: [6, 5], AR: [6, 6], TN: [6, 7], NC: [6, 8], SC: [6, 9], DC: [6, 10], RI: [6, 11],
  CA: [7, 1], NV: [7, 2], UT: [7, 3], CO: [7, 4], OK: [7, 5], LA: [7, 6], MS: [7, 7], AL: [7, 8], GA: [7, 9], FL: [7, 10],
  AZ: [8, 2], NM: [8, 3], TX: [8, 5],
  HI: [9, 1],
  AK: [9, 11],
};

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

const ABBREV_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_NAME_TO_ABBREV).map(([n, a]) => [a, n]),
);

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export default function StateTileMap({ partnersByState }: { partnersByState: Map<string, Partner> }) {
  const OUR_STATE = 'Michigan';
  return (
    <div className="max-w-3xl mx-auto">
      <div
        className="grid gap-1"
        style={{
          gridTemplateColumns: 'repeat(11, minmax(0, 1fr))',
          gridTemplateRows: 'repeat(9, minmax(0, 1fr))',
        }}
      >
        {Object.entries(TILE_POSITIONS).map(([abbrev, [row, col]]) => {
          const stateName = ABBREV_TO_NAME[abbrev];
          const partner = partnersByState.get(stateName);
          const isUs = stateName === OUR_STATE;
          const hasPartner = Boolean(partner);
          const bg = isUs
            ? 'bg-red-600 text-white ring-2 ring-red-800 hover:bg-red-700'
            : hasPartner
              ? 'bg-green-600 text-white hover:bg-green-700'
              : 'bg-gray-200 text-gray-500';
          const title = isUs
            ? 'Abolish Abortion Michigan (us)'
            : partner
              ? `${stateName} — ${partner.name}`
              : `${stateName} — no partner yet`;
          const cell = (
            <div
              className={`aspect-square flex items-center justify-center rounded text-xs font-bold uppercase tracking-wide transition-colors ${bg}`}
              title={title}
              aria-label={title}
            >
              {abbrev}
            </div>
          );
          return (
            <div
              key={abbrev}
              style={{ gridColumnStart: col, gridRowStart: row }}
            >
              {isUs ? (
                cell
              ) : partner ? (
                <a href={`#${slugify(stateName)}`}>{cell}</a>
              ) : (
                cell
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-600">
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-red-600 rounded" /> Abolish Abortion Michigan
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-green-600 rounded" /> Active partner coalition
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 bg-gray-200 rounded" /> No partner yet
        </span>
      </div>
    </div>
  );
}

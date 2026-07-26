// Per-county contextual data loaded from data/*.json and looked up
// by the CityConfig.region string (e.g. "Wayne County"). Both source
// files use the bare county name as the key ("Wayne", "Kent") — this
// module strips the " County" suffix before lookup so callers can
// pass the raw region string.
import abortionStatsFile from '@/data/mi-county-abortion-stats.json';
import urHistoryFile from '@/data/mi-underground-railroad-history.json';

type AbortionStatsFile = {
  _meta: {
    source: string;
    sourceUrl: string;
    year: number;
    statewideTotal: number;
    note: string;
    refreshedOn: string;
  };
  counties: Record<string, number>;
};

type UrHistoryEntry = {
  headline: string;
  paragraph: string;
};

type UrHistoryFile = {
  _meta: {
    source: string;
    note: string;
    refreshedOn: string;
  };
  counties: Record<string, UrHistoryEntry>;
};

const stats = abortionStatsFile as AbortionStatsFile;
const urHistory = urHistoryFile as UrHistoryFile;

function normalizeCounty(region: string): string {
  return region.replace(/\s+County$/i, '').trim();
}

export function getCountyAbortionStats(region: string): {
  county: string;
  count: number;
  year: number;
  statewideTotal: number;
  source: string;
  sourceUrl: string;
} | null {
  const county = normalizeCounty(region);
  const count = stats.counties[county];
  if (count === undefined) return null;
  return {
    county,
    count,
    year: stats._meta.year,
    statewideTotal: stats._meta.statewideTotal,
    source: stats._meta.source,
    sourceUrl: stats._meta.sourceUrl,
  };
}

export function getCountyUrHistory(region: string): UrHistoryEntry | null {
  const county = normalizeCounty(region);
  return urHistory.counties[county] ?? null;
}

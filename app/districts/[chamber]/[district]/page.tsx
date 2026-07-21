import { permanentRedirect, notFound } from 'next/navigation';
import { getLegislators, getLegislatorByDistrict, type Chamber } from '@/lib/data/legislators';

/**
 * District URL → canonical legislator profile 301-redirect.
 *
 * Google penalizes keyword cannibalization when two URLs target the same
 * entity. Each MI legislative district has exactly one seat at a time, so
 * `/districts/house/29` and `/legislators/james-desana` are competing for
 * the same searches. We keep one canonical URL (the legislator page) and
 * this route permanently redirects to it. When a legislator eventually
 * leaves office, we only need to regenerate the JSON — the district URL
 * automatically redirects to the successor.
 *
 * Statically generated at build time via generateStaticParams so the
 * redirect is honored even before the page is dynamically requested.
 */

const CHAMBERS: Record<string, Chamber> = { house: 'House', senate: 'Senate' };

export function generateStaticParams() {
  return getLegislators().map((l) => ({
    chamber: l.chamber.toLowerCase(),
    district: String(l.district),
  }));
}

export default async function DistrictRedirectPage({
  params,
}: {
  params: Promise<{ chamber: string; district: string }>;
}) {
  const { chamber, district } = await params;
  const canonicalChamber = CHAMBERS[chamber.toLowerCase()];
  const districtNum = Number.parseInt(district, 10);
  if (!canonicalChamber || Number.isNaN(districtNum)) notFound();

  const leg = getLegislatorByDistrict(canonicalChamber, districtNum);
  if (!leg) notFound();

  permanentRedirect(`/legislators/${leg.slug}`);
}

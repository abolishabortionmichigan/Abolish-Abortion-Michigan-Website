/**
 * Typed access to the enriched Michigan-legislator dataset.
 *
 * The JSON at data/legislators.json is generated from the research pipeline
 * at C:/Users/Dustina/Research/michigan-legislators/output. The set of
 * columns is stable across regenerations; anything shipped publicly stays
 * additive.
 *
 * Everything here is read-only + build-time. Static pages call
 * `getLegislators()` / `getLegislatorBySlug()` in generateStaticParams and
 * page bodies.
 */

import raw from '@/data/legislators.json';

export type Chamber = 'House' | 'Senate';
export type Stance = 'Abolitionist' | 'Incrementalist (Pro-Life)' | 'Pro-Choice' | 'Unknown';
export type VoteValue = 'Yea' | 'Nay' | 'Excused' | 'NotVoting' | null;
export type YesNo = 'Yes' | 'No' | null;
export type DistrictLean =
  | 'Safe R'
  | 'Safe D'
  | 'Lean R'
  | 'Lean D'
  | 'Tossup'
  | null;
export type TenureClass = 'Freshman' | 'Sophomore' | 'Veteran' | 'Long-term' | 'Unknown';

export interface Legislator {
  slug: string;
  name: string;
  chamber: Chamber;
  district: number;
  party: 'R' | 'D' | string;
  stance: Stance;

  // Voting record on tracked abortion bills. `null` = did not vote on this
  // bill (either not seated at the time, or bill died in committee).
  vote_HB4949: VoteValue;
  vote_HB4951: VoteValue;
  vote_HR0072: VoteValue;
  vote_SB0147: VoteValue;
  vote_SB0474: VoteValue;
  vote_SB0476: VoteValue;

  official_website: string | null;
  bill_sponsorships_count: number | null;
  cosponsorships_count: number | null;

  // Interest-group endorsements
  rtl_endorsed: YesNo;
  pp_advocates_endorsed: YesNo;
  ctv_endorsed: YesNo;

  // Abortion-adjacent PAC dollars (2022 + 2024 cycles, FTM data)
  ppac_donations_total: number;
  rtl_donations_total: number;
  abortion_related_pac_total: number;

  committees: string | null; // semicolon-joined
  email: string | null;
  capitol_phone: string | null;
  capitol_office_address: string | null;
  district_phone: string | null;
  district_office_address: string | null;
  openstates_url: string | null;

  // Bill-sponsorship signals
  sponsored_current_abolition_bill: YesNo; // 2025-HB-4670 or 4671
  sponsored_HB4683: YesNo;
  sponsored_HB4684_86: YesNo;
  sponsored_HB6270_total_ban: YesNo;
  sponsored_heartbeat_ban: YesNo;
  sponsored_HB4652: YesNo;
  sponsored_viability_ban: YesNo;
  sponsored_prc_funding: YesNo;

  twitter_handle: string | null;
  facebook_url: string | null;

  tenure_class: TenureClass;
  winner_margin: number | null;
  district_lean: DistrictLean;

  // Recent news — semicolon-joined `date  headline` strings + parallel links
  news_summary: string | null;
  news_links: string | null;
}

const LEGISLATORS = raw as Legislator[];

export function getLegislators(): Legislator[] {
  return LEGISLATORS;
}

export function getLegislatorBySlug(slug: string): Legislator | undefined {
  return LEGISLATORS.find((l) => l.slug === slug);
}

export function getLegislatorByDistrict(chamber: Chamber, district: number): Legislator | undefined {
  return LEGISLATORS.find((l) => l.chamber === chamber && l.district === district);
}

export function getAllSlugs(): string[] {
  return LEGISLATORS.map((l) => l.slug);
}

// --- Formatting helpers used by both the scorecard and profile pages ---

export function stanceBadgeClass(stance: Stance): string {
  switch (stance) {
    case 'Abolitionist':
      return 'bg-red-600 text-white';
    case 'Incrementalist (Pro-Life)':
      return 'bg-orange-500 text-white';
    case 'Pro-Choice':
      return 'bg-blue-600 text-white';
    default:
      return 'bg-gray-400 text-white';
  }
}

export function partyLabel(party: string): string {
  if (party === 'R') return 'Republican';
  if (party === 'D') return 'Democrat';
  return party;
}

export function chamberLabel(chamber: Chamber): string {
  return chamber === 'House' ? 'Representative' : 'Senator';
}

// Tracked abortion-related bills — kept in one place so the profile page,
// scorecard hub, and future bill pages all reference the same metadata.
export interface TrackedBill {
  key: 'HB4949' | 'HB4951' | 'HR0072' | 'SB0147' | 'SB0474' | 'SB0476';
  title: string;
  description: string;
  proChoicePosition: 'Yea' | 'Nay';
  session: '2023-2024';
}

export const TRACKED_BILLS: TrackedBill[] = [
  {
    key: 'HB4949',
    title: 'HB 4949 — Reproductive Health Act',
    description:
      'Repeals pre-Roe Michigan abortion restrictions and codifies expansive abortion access. A Yea vote is the pro-abortion-access position.',
    proChoicePosition: 'Yea',
    session: '2023-2024',
  },
  {
    key: 'HB4951',
    title: 'HB 4951 — Sentencing guideline reflect repeal',
    description:
      'Companion to HB 4949; strikes references to repealed abortion crimes from the sentencing guidelines statute.',
    proChoicePosition: 'Yea',
    session: '2023-2024',
  },
  {
    key: 'SB0474',
    title: 'SB 0474 — Public health code repeal',
    description:
      'Repeals the TRAP (Targeted Regulation of Abortion Providers) laws from the Michigan public health code.',
    proChoicePosition: 'Yea',
    session: '2023-2024',
  },
  {
    key: 'SB0476',
    title: 'SB 0476 — Definition of abortion',
    description: 'Updates the statutory definition of abortion in the Born Alive Infant Protection Act.',
    proChoicePosition: 'Yea',
    session: '2023-2024',
  },
  {
    key: 'SB0147',
    title: 'SB 0147 — Pregnancy discrimination',
    description:
      'Amends the Elliott-Larsen civil rights act to remove references to nontherapeutic abortions.',
    proChoicePosition: 'Yea',
    session: '2023-2024',
  },
  {
    key: 'HR0072',
    title: 'HR 0072 — Condemning the mifepristone ban',
    description:
      'House resolution condemning federal restrictions on mifepristone, a common medication-abortion drug.',
    proChoicePosition: 'Yea',
    session: '2023-2024',
  },
];

export function parseNewsList(l: Legislator): { date: string; title: string; link: string }[] {
  if (!l.news_summary || !l.news_links) return [];
  const summaries = l.news_summary.split(';').map((s) => s.trim()).filter(Boolean);
  const links = l.news_links.split(';').map((s) => s.trim()).filter(Boolean);
  const out: { date: string; title: string; link: string }[] = [];
  for (let i = 0; i < summaries.length; i++) {
    // Summary format: "2024-02-20  Reproductive rights ..." (two-space split)
    const m = summaries[i].match(/^(\d{4}-\d{2}-\d{2})\s+(.+)$/);
    if (!m) continue;
    out.push({ date: m[1], title: m[2], link: links[i] || '' });
  }
  return out;
}

export function parseCommittees(l: Legislator): { name: string; role: string }[] {
  if (!l.committees) return [];
  return l.committees.split(';').map((c) => {
    const s = c.trim();
    const m = s.match(/^(.+?)\s*\(([^)]+)\)$/);
    if (m) return { name: m[1].trim(), role: m[2].trim() };
    return { name: s, role: 'Member' };
  });
}

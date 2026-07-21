import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ContactBlock from '@/components/legislators/ContactBlock';
import SponsorshipSignals from '@/components/legislators/SponsorshipSignals';
import StanceBadge from '@/components/legislators/StanceBadge';
import VotingRecord from '@/components/legislators/VotingRecord';
import {
  chamberLabel,
  getAllSlugs,
  getLegislatorBySlug,
  getLegislators,
  parseCommittees,
  parseNewsList,
  partyLabel,
} from '@/lib/data/legislators';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abolishabortionmichigan.com';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> | Metadata {
  return params.then(({ slug }) => {
    const leg = getLegislatorBySlug(slug);
    if (!leg) return { title: 'Legislator not found' };
    const chamberWord = chamberLabel(leg.chamber);
    return {
      title: `${leg.name} — ${chamberWord}, District ${leg.district}`,
      description: `${leg.name}'s Michigan ${leg.chamber.toLowerCase()} record on abortion — stance, voting record, sponsorships, endorsements, campaign finance, and contact info.`,
      alternates: { canonical: `/legislators/${slug}` },
    };
  });
}

export default async function LegislatorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const legislator = getLegislatorBySlug(slug);
  if (!legislator) notFound();

  const committees = parseCommittees(legislator);
  const news = parseNewsList(legislator);
  const chamberWord = chamberLabel(legislator.chamber);

  // Person schema — helps Google present a Knowledge Panel and gives the
  // page rich-result eligibility for name searches.
  const personSchema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: legislator.name,
    jobTitle: `Michigan State ${chamberWord}`,
    memberOf: {
      '@type': 'GovernmentOrganization',
      name: `Michigan State ${legislator.chamber}`,
    },
    affiliation: {
      '@type': 'PoliticalParty',
      name: partyLabel(legislator.party),
    },
    url: `${BASE_URL}/legislators/${slug}`,
  };
  if (legislator.email) {
    personSchema.email = legislator.email;
  }
  if (legislator.capitol_phone) {
    personSchema.telephone = legislator.capitol_phone;
  }
  const sameAs = [legislator.official_website, legislator.openstates_url, legislator.facebook_url]
    .filter(Boolean);
  if (legislator.twitter_handle) {
    sameAs.push(`https://x.com/${legislator.twitter_handle.replace(/^@/, '')}`);
  }
  if (sameAs.length) personSchema.sameAs = sameAs;

  const districtLeanTag = legislator.district_lean
    ? `${legislator.district_lean} district`
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />

      {/* Header */}
      <section className="bg-[#1a1a1a] text-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <Breadcrumbs
            items={[
              { label: 'Legislators', href: '/legislators' },
              { label: legislator.name },
            ]}
          />
          <div className="mt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-5xl font-black mb-2">{legislator.name}</h1>
              <p className="text-gray-300 text-sm md:text-base">
                {partyLabel(legislator.party)} · Michigan {legislator.chamber}, District{' '}
                {legislator.district}
                {districtLeanTag && <> · {districtLeanTag}</>}
                {legislator.tenure_class !== 'Unknown' && (
                  <> · {legislator.tenure_class}</>
                )}
              </p>
            </div>
            <StanceBadge stance={legislator.stance} className="self-start md:self-auto" />
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="max-w-5xl mx-auto px-4 space-y-10">
          <ContactBlock legislator={legislator} />

          <section>
            <h2 className="text-2xl font-bold mb-4">Voting Record</h2>
            <VotingRecord legislator={legislator} />
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Bill Sponsorships</h2>
            <SponsorshipSignals legislator={legislator} />
            {(legislator.bill_sponsorships_count !== null ||
              legislator.cosponsorships_count !== null) && (
              <p className="text-sm text-gray-500 mt-4">
                Overall legislative activity (all subjects, all sessions tracked):{' '}
                {legislator.bill_sponsorships_count ?? 0} primary sponsorships,{' '}
                {legislator.cosponsorships_count ?? 0} cosponsorships.
              </p>
            )}
          </section>

          {committees.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Committee Assignments</h2>
              <ul className="space-y-2">
                {committees.map((c) => (
                  <li key={c.name} className="text-gray-800">
                    <span className="font-semibold">{c.name}</span>
                    {c.role !== 'Member' && (
                      <span className="text-gray-500 text-sm"> — {c.role}</span>
                    )}
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-3">Source: Open States.</p>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-bold mb-4">Endorsements</h2>
            <ul className="space-y-1 text-gray-800">
              <li>
                Right to Life of Michigan (2024):{' '}
                {legislator.rtl_endorsed === 'Yes' ? (
                  <strong>Endorsed</strong>
                ) : (
                  <span className="text-gray-500">Not endorsed</span>
                )}
              </li>
              <li>
                Planned Parenthood Advocates of Michigan:{' '}
                {legislator.pp_advocates_endorsed === 'Yes' ? (
                  <strong>Endorsed</strong>
                ) : (
                  <span className="text-gray-500">Not among Ballotpedia-tracked endorsements</span>
                )}
              </li>
              <li>
                Citizens for Traditional Values:{' '}
                {legislator.ctv_endorsed === 'Yes' ? (
                  <strong>Endorsed</strong>
                ) : (
                  <span className="text-gray-500">Not endorsed</span>
                )}
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Campaign Finance (Abortion-Related PACs)</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <FinanceCard label="Right to Life of Michigan PAC" amount={legislator.rtl_donations_total} />
              <FinanceCard
                label="Planned Parenthood affiliates"
                amount={legislator.ppac_donations_total}
              />
              <FinanceCard
                label="Combined abortion-related PACs"
                amount={legislator.abortion_related_pac_total}
              />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              Source: FollowTheMoney.org itemized contributions, 2022 + 2024 election cycles. Only
              itemized direct contributions are captured — independent expenditures (which are how
              RTL of Michigan does most of its political spending) are not included here.
            </p>
          </section>

          {news.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4">Recent News Coverage</h2>
              <ul className="space-y-3">
                {news.map((item) => (
                  <li key={item.link} className="border-l-4 border-gray-200 pl-3">
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-red-700 underline hover:no-underline"
                    >
                      {item.title}
                    </a>
                    <p className="text-xs text-gray-500">{item.date}</p>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-3">
                Source: Google News, scoped to Michigan-local outlets and abortion-related queries.
              </p>
            </section>
          )}

          <section className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Data compiled from Michigan Legislature roll-call PDFs, Open States API, Right to Life
              of Michigan endorsement list, Ballotpedia, and FollowTheMoney.org.{' '}
              <Link href="/legislators" className="text-red-700 underline hover:no-underline">
                Back to the full scorecard
              </Link>
              .
            </p>
          </section>
        </div>
      </section>
    </>
  );
}

function FinanceCard({ label, amount }: { label: string; amount: number }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded p-4">
      <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">
        {amount > 0 ? `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—'}
      </p>
    </div>
  );
}


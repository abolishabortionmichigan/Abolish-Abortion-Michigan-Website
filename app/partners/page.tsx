import type { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import {
  ALL_STATES,
  getNationalPartners,
  getStatePartners,
  partnersByState,
} from '@/lib/data/partners';

export const metadata: Metadata = {
  title: 'Allied Abolition Groups Across America',
  description:
    'A directory of Christian abolitionist organizations working to end abortion in the United States — state-by-state contacts, websites, and outreach opportunities.',
  alternates: { canonical: '/partners' },
};

export default function PartnersPage() {
  const national = getNationalPartners();
  const states = getStatePartners();
  const byState = partnersByState();
  const coverage = states.length;

  // ItemList schema — one page listing many organizations = eligible for
  // list-style SERP treatments + gives Google clear entity data.
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: national.length + states.length,
    itemListElement: [...national, ...states].map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: p.url,
      name: p.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* Hero */}
      <section className="bg-[#1a1a1a] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            Allied Abolition Groups Across America
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-gray-300 max-w-3xl mx-auto">
            Christian abolitionists in {coverage} states working alongside Abolish Abortion
            Michigan for the immediate and total end of abortion in the United States. Find your
            state&apos;s coalition, share resources, and get connected.
          </p>
        </div>
      </section>

      {/* State coverage grid */}
      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-2 text-center">Coverage Map</h2>
          <p className="text-center text-gray-600 mb-8">
            Green states have an active abolitionist coalition. Gray states are opportunities to
            plant one.
          </p>
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 max-w-4xl mx-auto">
            {ALL_STATES.map((state) => {
              const partner = byState.get(state);
              const isUs = state === 'Michigan';
              const hasPartner = Boolean(partner);
              const anchor = partner ? `#${slugify(state)}` : undefined;
              const box = (
                <div
                  className={`aspect-square flex flex-col items-center justify-center text-center rounded p-1 text-[10px] font-semibold uppercase tracking-wide ${
                    isUs
                      ? 'bg-red-600 text-white ring-2 ring-red-800'
                      : hasPartner
                        ? 'bg-green-600 text-white hover:bg-green-700 transition-colors'
                        : 'bg-gray-200 text-gray-500'
                  }`}
                  title={isUs ? 'Abolish Abortion Michigan (us)' : partner?.name || `${state} — no partner yet`}
                >
                  {stateAbbrev(state)}
                </div>
              );
              return (
                <div key={state}>
                  {anchor ? <a href={anchor}>{box}</a> : box}
                </div>
              );
            })}
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 bg-red-600 rounded" /> Abolish Abortion Michigan
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 bg-green-600 rounded" /> Active partner
              coalition
            </span>
            <span className="flex items-center gap-1">
              <span className="inline-block w-3 h-3 bg-gray-200 rounded" /> No partner yet
            </span>
          </div>
        </div>
      </section>

      {/* National network */}
      <section className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">National Network</h2>
          <p className="text-gray-700 mb-8">
            The organizations coordinating the abolitionist movement at the national level.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            {national.map((p) => (
              <PartnerCard key={p.url} partner={p} />
            ))}
          </div>
        </div>
      </section>

      {/* State-by-state */}
      <section className="bg-white py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">State-by-State Coalitions</h2>
          <p className="text-gray-700 mb-8">
            Every allied abolitionist coalition with a real live website. Click through, get
            connected, share resources.
          </p>
          <div className="space-y-6">
            {states.map((p) => (
              <div key={p.url} id={slugify(p.state)}>
                <PartnerCard partner={p} showState />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reach out */}
      <section className="bg-gray-50 py-12 border-t border-gray-200">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-3">Missing from this list?</h2>
          <p className="text-gray-700 mb-6">
            If your organization is a Christian abolitionist coalition with a live website and
            we&apos;ve missed you, reach out — we&apos;ll add you here and ask you to link back
            to us. Backlinks between allied sites strengthen the whole movement&apos;s reach.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-[#1a1a1a] text-white font-bold hover:bg-black transition-colors"
          >
            Contact us to be added
          </Link>
        </div>
      </section>

      <CTABanner
        title="STAND WITH US"
        subtitle="Every dollar directly supports abolition work in Michigan"
        buttonText="DONATE NOW"
        buttonLink="/donate"
      />
    </>
  );
}

function PartnerCard({
  partner,
  showState = false,
}: {
  partner: { name: string; url: string; blurb: string; state?: string };
  showState?: boolean;
}) {
  const host = partner.url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
  return (
    <div className="border border-gray-200 rounded-lg p-5 bg-white hover:border-red-600 transition-colors">
      {showState && partner.state && (
        <p className="text-xs uppercase tracking-wide text-red-700 font-bold mb-1">
          {partner.state}
        </p>
      )}
      <h3 className="font-bold text-lg text-gray-900 mb-1">
        <a
          href={partner.url}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-700 transition-colors"
        >
          {partner.name}
        </a>
      </h3>
      <p className="text-xs text-gray-500 mb-3 font-mono">{host}</p>
      <p className="text-gray-700 text-sm">{partner.blurb}</p>
    </div>
  );
}

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function stateAbbrev(state: string): string {
  const map: Record<string, string> = {
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
  return map[state] ?? state.slice(0, 2).toUpperCase();
}


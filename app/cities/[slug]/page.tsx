import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import { getCityBySlug, getAllCitySlugs } from '@/lib/data/cities';
import {
  getLegislators,
  grade,
  gradeBadgeClass,
  partyLabel,
} from '@/lib/data/legislators';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abolishabortionmichigan.com';

export function generateStaticParams() {
  return getAllCitySlugs().map((slug) => ({ slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> | Metadata {
  return params.then(({ slug }) => {
    const city = getCityBySlug(slug);
    if (!city) return { title: 'City not found' };
    return {
      title: `Abolish Abortion in ${city.name} — Take Action`,
      description: `Christian abolitionists in ${city.name}, Michigan working to end abortion. Meet your ${city.name}-area state representative and senator, see their voting record, and join the movement to abolish abortion in Michigan.`,
      alternates: { canonical: `/cities/${slug}` },
      openGraph: {
        title: `Abolish Abortion in ${city.name}`,
        description: `${city.name}, MI abolition — legislator scorecard, action steps, and how to get involved.`,
        type: 'website',
        url: `${BASE_URL}/cities/${slug}`,
      },
    };
  });
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) notFound();

  const legs = getLegislators();
  const houseReps = city.houseDistricts
    .map((d) => legs.find((l) => l.chamber === 'House' && l.district === d))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));
  const senateReps = city.senateDistricts
    .map((d) => legs.find((l) => l.chamber === 'Senate' && l.district === d))
    .filter((l): l is NonNullable<typeof l> => Boolean(l));
  const allReps = [...houseReps, ...senateReps];
  const passCount = allReps.filter((l) => grade(l) === 'Pass').length;
  const failCount = allReps.length - passCount;

  // Schema.org: WebPage + BreadcrumbList + FAQPage. Using WebPage
  // over LocalBusiness because AAM isn't a business with a Detroit
  // storefront — it's an organization whose message covers Detroit.
  // AreaServed on the parent NGO schema (root layout) already ties
  // the org to Michigan; this page adds the city-scoped WebPage +
  // FAQ markup so search can surface the FAQ as rich results.
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `Abolish Abortion in ${city.name}`,
    url: `${BASE_URL}/cities/${slug}`,
    about: {
      '@type': 'Place',
      name: `${city.name}, Michigan`,
      containedInPlace: { '@type': 'AdministrativeArea', name: city.region },
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/` },
        { '@type': 'ListItem', position: 2, name: 'Cities', item: `${BASE_URL}/cities` },
        { '@type': 'ListItem', position: 3, name: city.name, item: `${BASE_URL}/cities/${slug}` },
      ],
    },
  };
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: city.faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">
            {city.region} · {city.populationLabel}
          </p>
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Abolish Abortion in</span>{' '}
            <span className="font-black">{city.name.toUpperCase()}</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">
            Immediate, total abolition — no exceptions
          </p>
        </div>
      </section>

      <Breadcrumbs
        items={[{ label: 'Cities', href: '/cities' }, { label: city.name }]}
      />

      {/* At-a-glance scorecard box */}
      <section className="bg-white pt-10 pb-4">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatBox label="Local legislators" value={allReps.length} />
            <StatBox label="Passing on abolition" value={passCount} tone={passCount > 0 ? 'green' : 'neutral'} />
            <StatBox label="Failing" value={failCount} tone="red" />
            <StatBox label="House districts" value={city.houseDistricts.length} />
          </div>
        </div>
      </section>

      {/* History section — grounds the page in real, local, factual content
          that isn't duplicated on any other city page. Also good for E-E-A-T. */}
      <section className="bg-white py-10">
        <div className="max-w-3xl mx-auto px-4 prose prose-gray">
          <h2 className="text-3xl">{city.name}&apos;s abolitionist inheritance</h2>
          {city.historyParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-10 border-y border-gray-200">
        <div className="max-w-3xl mx-auto px-4 prose prose-gray">
          <h2 className="text-3xl">Abortion in {city.name} today</h2>
          {city.abortionLandscapeParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </section>

      {/* Legislator list — the load-bearing local-SEO block. Each rep links
          to their full scorecard profile, which is itself a static SSG page. */}
      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            {city.name}&apos;s Michigan legislators
          </h2>
          <p className="text-gray-600 mb-6 text-sm">
            The MI state representatives and senators whose districts cover
            {' '}{city.name}. Click a name to see their full record, contact info,
            and abolition-related votes.
          </p>

          <RepGroup title="State House" reps={houseReps} />
          <div className="mt-8">
            <RepGroup title="State Senate" reps={senateReps} />
          </div>

          <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-5">
            <h3 className="font-bold text-gray-900 mb-1">Not sure which district you&apos;re in?</h3>
            <p className="text-sm text-gray-700 mb-3">
              Enter your {city.name} ZIP code (or full address) on the scorecard
              and we&apos;ll show you your exact House and Senate representative.
            </p>
            <Link
              href="/legislators"
              className="inline-block px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700"
            >
              Find my representative &rarr;
            </Link>
          </div>
        </div>
      </section>

      {/* Take-action block */}
      <section className="bg-gray-50 py-12 border-y border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Take action in {city.name}</h2>
          <ol className="space-y-4 list-decimal pl-6 text-gray-800">
            <li>
              <strong>Sign the petition.</strong>{' '}
              Michigan needs a public record of its citizens who reject the
              pretense that abortion access is settled law.{' '}
              <Link href="/the-petition" className="text-red-700 underline">Add your name.</Link>
            </li>
            <li>
              <strong>Contact your {city.name}-area legislator.</strong>{' '}
              Every rep above has their capitol email on file — a two-minute
              email is more than most constituents ever send. Use the
              pre-drafted template on each legislator&apos;s profile page.
            </li>
            <li>
              <strong>Bring the resolution to your church.</strong>{' '}
              If you attend a {city.name}-area church, ask your pastor to
              consider signing the abolitionist resolution.{' '}
              <Link href="/contact" className="text-red-700 underline">
                Contact us
              </Link>
              {' '}for the model text and to walk through it with your pastor.
            </li>
            <li>
              <strong>Give.</strong>{' '}
              The work — legislative research, petition drives, church
              outreach, this website — runs on the sacrificial giving of
              ordinary abolitionists.{' '}
              <Link href="/donate" className="text-red-700 underline">Support the mission.</Link>
            </li>
          </ol>
        </div>
      </section>

      {/* FAQ — powers the FAQPage schema above; kept as real <details>
          so it works without JS and gets crawled by search. */}
      <section className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            {city.name} FAQ
          </h2>
          <div className="space-y-3">
            {city.faqs.map((f) => (
              <details
                key={f.q}
                className="border border-gray-200 rounded-lg p-4 group"
              >
                <summary className="cursor-pointer font-semibold text-gray-900 list-none flex justify-between items-center">
                  <span>{f.q}</span>
                  <span className="text-red-600 group-open:rotate-45 transition-transform text-xl leading-none">+</span>
                </summary>
                <p className="text-gray-700 mt-3">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

function StatBox({
  label,
  value,
  tone = 'neutral',
}: {
  label: string;
  value: number;
  tone?: 'green' | 'red' | 'neutral';
}) {
  const border =
    tone === 'green'
      ? 'border-green-700'
      : tone === 'red'
        ? 'border-red-600'
        : 'border-gray-300';
  return (
    <div className={`bg-white border-l-4 ${border} p-4 rounded-r shadow-sm`}>
      <div className="text-3xl font-black tabular-nums text-gray-900">{value}</div>
      <div className="text-xs uppercase tracking-wide text-gray-500 mt-1 font-semibold">
        {label}
      </div>
    </div>
  );
}

function RepGroup({
  title,
  reps,
}: {
  title: string;
  reps: ReturnType<typeof getLegislators>;
}) {
  if (reps.length === 0) return null;
  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-3 border-b border-gray-200 pb-2">
        {title}
      </h3>
      <ul className="grid sm:grid-cols-2 gap-3">
        {reps.map((l) => {
          const g = grade(l);
          return (
            <li key={l.slug}>
              <Link
                href={`/legislators/${l.slug}`}
                className="block border border-gray-200 rounded-lg p-3 hover:border-red-600 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500 font-semibold">
                      District {l.district} · {partyLabel(l.party)[0]}
                    </p>
                    <p className="font-semibold text-gray-900">{l.name}</p>
                  </div>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide ${gradeBadgeClass(g)}`}
                  >
                    {g}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

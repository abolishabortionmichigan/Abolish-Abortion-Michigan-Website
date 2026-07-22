import type { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import { CITIES } from '@/lib/data/cities';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abolishabortionmichigan.com';

export const metadata: Metadata = {
  title: 'Michigan Cities — Abolition Work Where You Live',
  description:
    'Local abolition landing pages for Michigan cities. Meet your city\'s state representatives and senators, see their abortion voting records, and find out how to get involved.',
  alternates: { canonical: '/cities' },
};

export default function CitiesIndexPage() {
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: CITIES.length,
    itemListElement: CITIES.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/cities/${c.slug}`,
      name: c.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section className="bg-[#1a1a1a] text-white py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            Abolition in Your Michigan City
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-gray-300 max-w-2xl mx-auto">
            City-specific pages with your local Michigan legislators, their
            abortion voting record, and concrete steps to take where you live.
          </p>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4">
          <ul className="grid sm:grid-cols-2 gap-4">
            {CITIES.map((c) => (
              <li key={c.slug}>
                <Link
                  href={`/cities/${c.slug}`}
                  className="block border border-gray-200 rounded-lg p-5 hover:border-red-600 transition-colors"
                >
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{c.name}</h2>
                  <p className="text-sm text-gray-500 mb-2">
                    {c.region} · {c.populationLabel}
                  </p>
                  <p className="text-red-700 font-semibold text-sm">
                    View {c.name} page &rarr;
                  </p>
                </Link>
              </li>
            ))}
          </ul>
          {CITIES.length === 1 && (
            <p className="text-sm text-gray-500 mt-8 text-center">
              More Michigan cities coming soon. If you&apos;d like your city
              prioritized, <Link href="/contact" className="text-red-700 underline">let us know</Link>.
            </p>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}

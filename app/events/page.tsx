import type { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import { getAllEvents, getEventsRefreshedOn, toEventJsonLd } from '@/lib/data/events';
import { socialLinks } from '@/lib/content';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abolishabortionmichigan.com';

export const metadata: Metadata = {
  title: 'Michigan Abolition Calendar — Events & Observances',
  description:
    'Recurring Michigan abolition observances: statewide days of prayer, lament, and lawful witness. Host or join the observance in your city.',
  alternates: { canonical: '/events' },
  openGraph: {
    title: 'Michigan Abolition Calendar',
    description: 'Recurring Michigan-abolition observances — prayer, lament, and witness.',
    type: 'website',
    url: `${BASE_URL}/events`,
  },
};

// Human-readable date without needing a specific locale — used in the
// visible card copy. The Event JSON-LD keeps the ISO startDate.
function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${monthNames[m - 1]} ${d}, ${y}`;
}

export default function EventsPage() {
  const events = getAllEvents();
  const refreshedOn = getEventsRefreshedOn();

  return (
    <>
      {events.map((e) => (
        <script
          key={e.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(toEventJsonLd(e, BASE_URL)) }}
        />
      ))}

      <section className="relative text-white py-20 md:py-28 bg-gradient-to-br from-[#1a1a1a] via-[#1c1618] to-[#2a1010] overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-30 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 20%, rgba(220,38,38,0.15), transparent 55%), radial-gradient(circle at 80% 80%, rgba(220,38,38,0.10), transparent 55%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-gray-400 mb-3">
            Statewide observances
          </p>
          <h1 className="text-4xl md:text-6xl font-black mb-6">
            Michigan Abolition Calendar
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-base md:text-lg text-gray-300 max-w-2xl mx-auto">
            Recurring days of prayer, lament, teaching, and lawful witness that
            Abolish Abortion Michigan calls its network to keep. Host or join
            the observance in your city.
          </p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Michigan Abolition Calendar' }]} />

      {events.length === 0 ? (
        <section className="bg-white py-16">
          <div className="max-w-2xl mx-auto px-4 text-center">
            <p className="text-gray-700">
              No statewide observances are currently on the calendar.{' '}
              <Link href="/contact" className="text-red-700 underline">
                Contact us
              </Link>
              {' '}if you know of one that should be listed.
            </p>
          </div>
        </section>
      ) : (
        <section className="bg-white py-12">
          <div className="max-w-4xl mx-auto px-4 space-y-8">
            {events.map((e) => (
              <article
                key={e.id}
                id={e.id}
                className="border border-gray-200 rounded-lg p-6 md:p-8 bg-white shadow-sm scroll-mt-24"
              >
                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-4">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {e.name}
                  </h2>
                  <div className="text-sm text-gray-500 font-semibold tabular-nums flex-shrink-0">
                    {e.recurringDate ? (
                      <span>Every year, {e.recurringDate}</span>
                    ) : (
                      <span>{formatDate(e.startDate)}</span>
                    )}
                  </div>
                </div>
                <p className="text-gray-800 mb-4">{e.shortDescription}</p>
                <p className="text-gray-700 mb-4 text-[0.95rem] leading-relaxed">
                  {e.longDescription}
                </p>

                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-sm mb-5 bg-gray-50 border border-gray-200 rounded p-4">
                  <div>
                    <dt className="text-xs uppercase tracking-wide font-bold text-gray-500 mb-0.5">
                      Next occurrence
                    </dt>
                    <dd className="text-gray-800">{formatDate(e.startDate)}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wide font-bold text-gray-500 mb-0.5">
                      Where
                    </dt>
                    <dd className="text-gray-800">{e.location.name}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs uppercase tracking-wide font-bold text-gray-500 mb-0.5">
                      Audience
                    </dt>
                    <dd className="text-gray-800">{e.audience}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-xs uppercase tracking-wide font-bold text-gray-500 mb-0.5">
                      How to join or host
                    </dt>
                    <dd className="text-gray-800">{e.howToJoin}</dd>
                  </div>
                </dl>

                <div className="flex flex-wrap gap-3">
                  <a
                    href={socialLinks.signalGroup}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors text-sm"
                  >
                    Join the Signal group
                  </a>
                  <Link
                    href="/contact"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-800 font-semibold rounded hover:border-red-600 hover:text-red-700 transition-colors text-sm"
                  >
                    Contact us to host
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="bg-gray-50 py-10 border-y border-gray-200">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-xl md:text-2xl font-bold mb-3">
            Know of a Michigan event that should be here?
          </h2>
          <p className="text-gray-800 mb-4">
            Rallies at the Capitol, hearings on abolition legislation, local
            church-hosted teaching series — if it&apos;s open to the Michigan
            abolition network and it has a date, we want it on the calendar.
          </p>
          <Link
            href="/contact"
            className="inline-block px-5 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 transition-colors"
          >
            Send us the details &rarr;
          </Link>
        </div>
      </section>

      <CTABanner />

      <div className="bg-gray-50 py-3 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Calendar last updated {refreshedOn}
        </p>
      </div>
    </>
  );
}

import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import InfoTip from '@/components/legislators/InfoTip';
import LegislatorTable from './legislator-table';
import { getLegislators } from '@/lib/data/legislators';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abolishabortionmichigan.com';

export const metadata: Metadata = {
  title: 'Michigan Legislator Scorecard on Abortion',
  description:
    'Every Michigan state legislator ranked by their record on abortion — votes, sponsorships, endorsements, and donations from abortion-related PACs. Search all 149 members.',
  alternates: { canonical: '/legislators' },
};

export default function LegislatorsHubPage() {
  const legislators = getLegislators();

  const counts = {
    Incrementalist: legislators.filter((l) => l.stance === 'Incrementalist (Pro-Life)').length,
    ProChoice: legislators.filter((l) => l.stance === 'Pro-Choice').length,
    Unknown: legislators.filter((l) => l.stance === 'Unknown').length,
  };

  // ItemList schema — makes this page eligible for list-format SERPs and
  // supports the sitelinks structure Google sometimes surfaces for
  // scorecard-style pages.
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    numberOfItems: legislators.length,
    itemListElement: legislators.map((l, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: `${BASE_URL}/legislators/${l.slug}`,
      name: l.name,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      <section className="bg-[#1a1a1a] text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black mb-3">Michigan Legislator Scorecard</h1>
            <p className="text-gray-300 max-w-3xl">
              Where every Michigan state {legislators.length}-member Legislature stands on abortion —
              voting record, bills sponsored, endorsements from Right to Life of Michigan and
              Planned Parenthood, and donations from abortion-related PACs. Independently compiled
              from Michigan Legislature roll-call journals, Open States, and FollowTheMoney.org.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 max-w-3xl">
            <StatBox label="Pro-Life (Incrementalist)" count={counts.Incrementalist} tone="orange" />
            <StatBox label="Pro-Choice" count={counts.ProChoice} tone="blue" />
            <StatBox label="Unknown record" count={counts.Unknown} tone="gray" />
          </div>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="max-w-6xl mx-auto px-4">
          <Suspense fallback={<p className="text-gray-500">Loading legislators...</p>}>
            <LegislatorTable legislators={legislators} />
          </Suspense>
        </div>
      </section>

      <section className="bg-gray-50 py-10 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 prose prose-gray">
          <h2 className="text-2xl font-bold mb-4">How we categorize</h2>
          <p>
            Legislators are grouped by their public record on abortion — voting record, bills
            sponsored, endorsements, and campaign finance. We do not personally label legislators
            beyond these categories.
          </p>
          <dl className="not-prose space-y-4 mt-6">
            <div className="border-l-4 border-red-600 bg-white p-4 rounded-r">
              <dt className="font-bold text-gray-900">Abolition of abortion</dt>
              <dd className="text-gray-700 mt-1">
                The immediate, total end of abortion — criminalized as homicide, no exceptions,
                from the moment of fertilization. Rejects the incrementalist strategy of gradual
                restrictions. This is the position Abolish Abortion Michigan advocates.{' '}
                <Link
                  href="/what-we-believe/abolitionist-not-pro-life"
                  className="text-red-700 underline"
                >
                  Learn more &rarr;
                </Link>
              </dd>
            </div>
            <div className="border-l-4 border-orange-500 bg-white p-4 rounded-r">
              <dt className="font-bold text-gray-900">
                Pro-Life (Incrementalist)
                <InfoTip label="What Incrementalist means">
                  <p className="mb-2">
                    <strong>Incrementalism</strong>
                    {' '}is the mainstream pro-life strategy: reduce abortion gradually through
                    restrictions, waiting periods, viability limits, rape/incest exceptions, and
                    pregnancy-resource-center funding — but not outright abolition.
                  </p>
                  <p>
                    Organizations in this camp include{' '}
                    <strong>Right to Life of Michigan</strong>, Susan B. Anthony Pro-Life
                    America, and the National Right to Life Committee.
                  </p>
                </InfoTip>
              </dt>
              <dd className="text-gray-700 mt-1">
                Has voted, sponsored, or been endorsed in a pattern consistent with restricting
                or opposing abortion access.
              </dd>
            </div>
            <div className="border-l-4 border-blue-600 bg-white p-4 rounded-r">
              <dt className="font-bold text-gray-900">
                Pro-Choice
                <InfoTip label="Pro-Choice organizations tracked">
                  <p>
                    Support for abortion access, generally endorsed by organizations like{' '}
                    <strong>Planned Parenthood Advocates of Michigan (PPAMI)</strong>,
                    Reproductive Freedom for All, and EMILY&apos;s List.
                  </p>
                </InfoTip>
              </dt>
              <dd className="text-gray-700 mt-1">
                Has voted, sponsored, or been endorsed in a pattern consistent with supporting
                abortion access.
              </dd>
            </div>
            <div className="border-l-4 border-gray-400 bg-white p-4 rounded-r">
              <dt className="font-bold text-gray-900">Unknown record</dt>
              <dd className="text-gray-700 mt-1">
                Insufficient public record for classification — usually a legislator sworn in too
                recently to have any tracked votes or endorsements.
              </dd>
            </div>
          </dl>
        </div>
      </section>
    </>
  );
}

function StatBox({
  label,
  count,
  tone,
}: {
  label: string;
  count: number;
  tone: 'red' | 'orange' | 'blue' | 'gray';
}) {
  const cls = {
    red: 'bg-red-600',
    orange: 'bg-orange-500',
    blue: 'bg-blue-600',
    gray: 'bg-gray-500',
  }[tone];
  return (
    <div className={`${cls} text-white rounded p-4`}>
      <div className="text-3xl font-black tabular-nums">{count}</div>
      <div className="text-xs uppercase tracking-wide mt-1 opacity-90">{label}</div>
    </div>
  );
}

import type { Metadata } from 'next';
import { Suspense } from 'react';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
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
          <Breadcrumbs items={[{ label: 'Legislators' }]} />
          <div className="mt-6">
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
            beyond these categories; a legislator&apos;s specific stance (abolitionist vs.
            incrementalist within the pro-life camp, for example) is a matter of self-identification
            that a bill sponsorship alone cannot determine.
          </p>
          <ul>
            <li>
              <strong>Pro-Life (Incrementalist)</strong> — has voted, sponsored, or been endorsed
              in a pattern consistent with restricting or opposing abortion access.
            </li>
            <li>
              <strong>Pro-Choice</strong> — has voted, sponsored, or been endorsed in a pattern
              consistent with supporting abortion access.
            </li>
            <li>
              <strong>Unknown record</strong> — insufficient public record for classification.
            </li>
          </ul>
          <p>
            Each profile shows the specific bills a legislator sponsored so you can judge for
            yourself. Bills that establish equal protection from fertilization (like HB 4671, the
            &ldquo;Justice for Babies in the Womb Act&rdquo;) are noted with the bill&apos;s
            actual language, without attaching a personal label.
          </p>
          <p>
            <Link href="/what-we-believe/abolitionist-not-pro-life" className="text-red-700 underline">
              Why abolitionists distinguish themselves from incrementalist pro-lifers &rarr;
            </Link>
          </p>
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

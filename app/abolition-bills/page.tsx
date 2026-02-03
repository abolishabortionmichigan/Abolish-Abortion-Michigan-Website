import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'Abolition Bills - Abolish Abortion Michigan',
  description: 'Information about abolition bills in Michigan, including HB 4671 and other legislation to end abortion.',
};

export default function AbolitionBillsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">ABOLITION BILLS</h1>
          <p className="text-gray-400">Legislative efforts to abolish abortion in Michigan</p>
        </div>
      </section>

      {/* What is an Abolition Bill */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">What is an Abolition Bill?</h2>
          <p className="text-gray-700 mb-4">
            An abolition bill is legislation that treats abortion as what it is: <span className="text-red-600 font-semibold">murder</span>. Unlike incremental pro-life bills that regulate abortion while leaving it legal, an abolition bill calls for the immediate and total end of abortion.
          </p>
          <p className="text-gray-700 mb-6">
            Key characteristics of a true abolition bill:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-8">
            <li><strong>Equal Protection:</strong> Extends the same legal protections to preborn children as to born children</li>
            <li><strong>No Exceptions:</strong> Does not permit abortion for rape, incest, or any other circumstance</li>
            <li><strong>Criminalization:</strong> Treats abortion as homicide under the law</li>
            <li><strong>Defiance of Unjust Federal Law:</strong> Nullifies any federal law or court opinion that purports to permit abortion</li>
          </ul>
        </div>
      </section>

      {/* HB 4671 */}
      <section id="hb4671" className="bg-gray-100 py-16 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">HB 4671 - Michigan Abolition Bill</h2>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-500">Bill Number</p>
                <p className="font-semibold">HB 4671</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-semibold text-red-600">Awaiting Support</p>
              </div>
            </div>

            <h3 className="text-xl font-bold mb-3">Summary</h3>
            <p className="text-gray-700 mb-4">
              House Bill 4671 would establish equal protection under the law for all human beings from the moment of fertilization. The bill would:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>Define &ldquo;person&rdquo; to include all human beings from fertilization</li>
              <li>Extend all laws protecting persons to include preborn human beings</li>
              <li>Treat abortion as homicide under Michigan law</li>
              <li>Contain no exceptions that would permit the killing of preborn children</li>
            </ul>
          </div>

          <h3 className="text-2xl font-bold mb-4">How You Can Help</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-2 text-red-600">Contact Your Representative</h4>
              <p className="text-gray-700 mb-4">
                Call and email your state representative and ask them to co-sponsor HB 4671.
              </p>
              <a
                href="https://www.house.mi.gov/AllRepresentatives"
                target="_blank"
                rel="noopener noreferrer"
                className="text-red-600 font-semibold hover:text-red-700"
              >
                Find Your Representative &rarr;
              </a>
            </div>
            <div className="bg-white p-6 rounded-lg">
              <h4 className="font-bold text-lg mb-2 text-red-600">Share With Your Church</h4>
              <p className="text-gray-700 mb-4">
                Ask your pastor to encourage the congregation to contact their representatives about this bill.
              </p>
              <Link href="/media" className="text-red-600 font-semibold hover:text-red-700">
                Get Resources &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Current Legislation */}
      <section id="current" className="bg-white py-16 scroll-mt-20">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-6">Current Legislative Landscape</h2>

          <div className="bg-red-50 border-l-4 border-red-600 p-6 mb-8">
            <h3 className="font-bold text-lg mb-2">Prop 3 - Michigan&apos;s Abortion Amendment</h3>
            <p className="text-gray-700">
              In November 2022, Michigan voters passed Proposal 3, which enshrined a &ldquo;right&rdquo; to abortion in the state constitution. This makes the work of abolition more challenging but not impossible. We continue to call upon legislators to uphold God&apos;s law and protect the preborn regardless of this unjust amendment.
            </p>
          </div>

          <h3 className="text-2xl font-bold mb-4">Why We Don&apos;t Support Incremental Bills</h3>
          <p className="text-gray-700 mb-4">
            You may wonder why we don&apos;t support bills that restrict abortion—heartbeat bills, 20-week bans, etc. Here&apos;s why:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-gray-700">
            <li>They concede that some abortions are acceptable</li>
            <li>They treat some children as less worthy of protection than others</li>
            <li>They have failed for 50 years to end abortion</li>
            <li>They violate the principle of equal protection under the law</li>
            <li>They are morally inconsistent—we would never accept incremental abolition of any other form of murder</li>
          </ul>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}

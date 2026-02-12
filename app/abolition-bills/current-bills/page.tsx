import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Current Abolition Bills - Abolish Abortion Michigan',
  description: 'View current abolition bills being supported across the United States.',
};

export default function CurrentBillsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Current</span>{' '}
            <span className="font-black">ABOLITION BILLS</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Abolition Bills', href: '/abolition-bills' }, { label: 'Current Abolition Bills' }]} />

      <section className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-gray-700 text-lg mb-8">
            Current abolition bills being supported across the United States are tracked by Free the States, an allied abolitionist organization.
          </p>
          <a
            href="https://freethestates.org/bills-we-support/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-8 py-4 bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-colors"
          >
            View Bills on Free the States &rarr;
          </a>
          <p className="text-sm text-gray-500 mt-4">
            You will be taken to freethestates.org, an external website.
          </p>
          <div className="mt-12">
            <Link href="/abolition-bills" className="text-red-700 font-semibold hover:text-red-800">
              &larr; Back to Abolition Bills
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

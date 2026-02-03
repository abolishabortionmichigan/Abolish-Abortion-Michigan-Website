import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'Ignore Roe - Abolish Abortion Michigan',
  description: 'The Supreme Court is not the supreme law of the land. Roe v. Wade was legally null and void from its inception.',
};

export default function IgnoreRoePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold mb-4">WHAT WE BELIEVE</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">IGNORE ROE</h1>
          <p className="text-xl text-gray-300 italic">&ldquo;The Supreme Court is not the supreme law of the land.&rdquo;</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-red-600 mb-6">The Court Is Not Supreme</h2>

            <p>
              The Supreme Court&apos;s authority over constitutional matters is not absolute. Roe v. Wade was legally null and void from its inception, and states should refuse to comply with unconstitutional rulings.
            </p>

            <p>
              Thomas Jefferson warned against treating judges as &ldquo;ultimate arbiters of all constitutional&rdquo; matters, cautioning this would create &ldquo;despotism of an oligarchy.&rdquo;
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Legal Foundation</h3>

            <p>
              Multiple legal scholars, including those on the left, acknowledge that Roe lacked solid constitutional grounding. The decision was judicial overreach, not legitimate constitutional interpretation.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Nullification and Interposition</h3>

            <p>
              Throughout American history, states have resisted federal mandates they deemed unconstitutional. Wisconsin, Michigan, Vermont, New York, and Massachusetts all nullified the Fugitive Slave Act as a matter of conscience.
            </p>

            <p>
              This historical precedent establishes that states have both the right and the duty to interpose against unjust federal laws and court rulings when human lives are at stake.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Our Moral Obligation</h3>

            <p>
              Biblical references (Proverbs 24:10, Isaiah 1:17, Matthew 22:39) are central to our argument that preventing abortion is a moral and religious obligation superseding unjust legal doctrines.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Our Mission</h3>
              <p>
                We seek to end abortion through non-violent agitation, preaching, pleading, and information dissemination. When man&apos;s law conflicts with God&apos;s law, we obey God.
              </p>
            </div>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>&ldquo;If you faint in the day of adversity, your strength is small. Rescue those who are being taken away to death; hold back those who are stumbling to the slaughter.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— Proverbs 24:10-11</cite>
            </blockquote>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/what-we-believe/no-exceptions" className="text-red-600 font-semibold hover:underline">
              &larr; No Exceptions
            </Link>
            <Link href="/what-we-believe/criminalization" className="text-red-600 font-semibold hover:underline">
              Criminalization &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

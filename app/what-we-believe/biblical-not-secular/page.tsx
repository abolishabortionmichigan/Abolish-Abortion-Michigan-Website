import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'Biblical, Not Secular - Abolish Abortion Michigan',
  description: 'Our opposition to abortion is grounded in biblical principles, not secular arguments. The duty is ours, the results belong to God.',
};

export default function BiblicalNotSecularPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold mb-4">WHAT WE BELIEVE</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">BIBLICAL, NOT SECULAR</h1>
          <p className="text-xl text-gray-300 italic">&ldquo;The duty is ours. The results belong to God.&rdquo;</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Grounded in Scripture</h2>

            <p>
              Abolitionism differs from pro-life activism by grounding opposition to abortion in biblical principles rather than secular arguments. Abortion is fundamentally wrong because human beings are created in the image of God.
            </p>

            <p>
              The Scriptures command us to rescue those being led to slaughter (Proverbs 24:11) and warn against those who decree unjust laws (Isaiah 10:1). When presented with the choice between obeying God or obeying man, we obey God (Acts 5:29).
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Historical Precedent</h3>

            <p>
              Like the abolitionists who fought against slavery, we understand that lasting change comes through the application of biblical truth to social evils. William Lloyd Garrison, a leader in the slavery abolition movement, sought to make &ldquo;Christianity the enemy of all that is sinful.&rdquo;
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">No Compromise</h3>

            <p>
              We reject incremental approaches to abortion restrictions. Such compromises violate biblical principles by implicitly accepting that some abortions are permissible. We advocate for immediate abolition without exceptions.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Our Commitment</h3>
              <p>
                We are committed to non-violent agitation, preaching, pleading, and information dissemination through community outreach and social media to abolish abortion and proclaim the gospel.
              </p>
            </div>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>&ldquo;Rescue those who are being taken away to death; hold back those who are stumbling to the slaughter.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— Proverbs 24:11</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>&ldquo;We must obey God rather than men.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— Acts 5:29</cite>
            </blockquote>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/what-we-believe/abolitionist-not-pro-life" className="text-red-600 font-semibold hover:underline">
              &larr; Abolitionist, Not Pro-Life
            </Link>
            <Link href="/what-we-believe/immediate-not-gradual" className="text-red-600 font-semibold hover:underline">
              Immediate, Not Gradual &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

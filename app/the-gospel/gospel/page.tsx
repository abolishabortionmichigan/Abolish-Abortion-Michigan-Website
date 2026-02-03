import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'The Gospel - Abolish Abortion Michigan',
  description: 'The Gospel is the power of God for salvation to everyone who believes.',
};

export default function GospelPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold mb-4">THE GOSPEL</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">THE GOSPEL</h1>
          <p className="text-xl text-gray-300 italic">&ldquo;The power of God for salvation to everyone who believes.&rdquo;</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic bg-red-50 py-4 pr-4">
              <p>&ldquo;I am not ashamed of the gospel, for it is the power of God for salvation to everyone who believes, to the Jew first and also to the Greek.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— Romans 1:16</cite>
            </blockquote>

            <h2 className="text-2xl font-bold text-red-600 mb-6">The Crisis We Face</h2>

            <p>
              Since 1973, approximately 63 million preborn children have been killed through abortion in the United States alone, with thousands more dying each day. This is nothing less than genocide—the systematic destruction of an entire class of human beings.
            </p>

            <p>
              Scripture is clear about God&apos;s view of innocent bloodshed. Proverbs 6:16-17 tells us that &ldquo;hands that shed innocent blood&rdquo; are among the things the Lord hates.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">The Penalty of Sin</h3>

            <p>
              The Bible teaches that all have sinned and fall short of the glory of God (Romans 3:23). The wages of sin is death (Romans 6:23), and we all justly deserve eternal separation from God because of our rebellion against Him.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">God&apos;s Provision Through Christ</h3>

            <p>
              But God, in His great mercy, provided a way of reconciliation through the substitutionary sacrifice of His Son, Jesus Christ. Christ lived a perfect life, died on the cross bearing our sins, and rose again on the third day.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg my-8">
              <p className="text-lg">
                &ldquo;God shows his love for us in that while we were still sinners, Christ died for us.&rdquo;
              </p>
              <p className="text-gray-600 mt-2">— Romans 5:8</p>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">The Call to Repentance and Faith</h3>

            <p>
              God commands all people everywhere to repent (Acts 17:30). Through repentance toward God and faith in the Lord Jesus Christ (Acts 20:21), we receive forgiveness of sins and the gift of eternal life.
            </p>

            <p>
              &ldquo;Repent therefore, and turn back, that your sins may be blotted out&rdquo; (Acts 3:19).
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Living Out Our Faith</h3>

            <p>
              Those who have been saved by grace through faith are called to &ldquo;walk in newness of life&rdquo; (Romans 6:4) and conduct themselves in a manner worthy of the gospel (Philippians 1:27).
            </p>

            <p>
              This includes loving our neighbors as ourselves (Matthew 22:39) and caring for the most vulnerable among us (James 1:27). The preborn are our neighbors, and we are called to defend them.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Our Mission</h3>
              <p>
                We are committed to showing mercy and establishing justice for preborn individuals through gospel proclamation, community outreach, and non-violent agitation to abolish abortion in Michigan and throughout our nation.
              </p>
            </div>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>&ldquo;Learn to do good; seek justice, correct oppression; bring justice to the fatherless, plead the widow&apos;s cause.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— Isaiah 1:17</cite>
            </blockquote>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/the-gospel" className="text-red-600 font-semibold hover:underline">
              &larr; Back to The Gospel
            </Link>
            <Link href="/the-gospel/kingdom-of-god" className="text-red-600 font-semibold hover:underline">
              The Kingdom of God &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

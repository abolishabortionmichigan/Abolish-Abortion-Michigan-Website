import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'The Answer to Abortion - Abolish Abortion Michigan',
  description: 'The Gospel of Jesus Christ is the key to abolishing abortion.',
};

export default function AnswerToAbortionPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold mb-4">THE GOSPEL</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">THE ANSWER TO ABORTION</h1>
          <p className="text-xl text-gray-300 italic">&ldquo;The Gospel of Jesus Christ is the key to abolishing abortion.&rdquo;</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-red-600 mb-6">The Gospel of Jesus as King</h2>

            <p>
              The Gospel of the Lord Jesus Christ as King is the answer to abortion and the key to abolition. Only through the transforming power of the Gospel can hearts be changed and a culture of death be overturned.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Beyond Intellectual Agreement</h3>

            <p>
              There is a crucial distinction between intellectual agreement that abortion is wrong and genuine moral transformation. Many people will say they oppose abortion, but without Christ&apos;s transforming power and God&apos;s grace, their moral convictions become vulnerable to personal circumstances.
            </p>

            <p>
              A woman who intellectually opposes abortion may still choose it when faced with an unplanned pregnancy. A man who claims to be pro-life may pressure his girlfriend to abort when confronted with the consequences of his sin. Only the Gospel changes hearts at the deepest level.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">The Abolitionist Distinction</h3>

            <p>
              Abolitionists differ from the mainstream pro-life movement in our understanding of the Gospel&apos;s role. We believe the call to repentance and the Gospel of Christ&apos;s Kingdom must be preached not only to individuals but to nations.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg my-8">
              <p className="text-lg">
                Some argue that &ldquo;the Gospel is the antidote to sin in a believer&apos;s life; it is not the key to reformation of society.&rdquo; We respectfully but firmly disagree.
              </p>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">National Repentance</h3>

            <p>
              Nations that practice child sacrifice will face divine judgment. Throughout Scripture, God holds nations accountable for their collective sins, particularly the shedding of innocent blood. The Gospel can and must reform societies—not just individuals.
            </p>

            <p>
              We believe that if the Church would faithfully proclaim the Gospel and call our nation to repentance, abortion could be abolished. The Gospel is God&apos;s ordained means for transforming both hearts and cultures.
            </p>

            <div className="bg-[#1a1a1a] text-white p-8 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Christ&apos;s Authority</h3>
              <p className="mb-4">
                &ldquo;All authority in heaven and on earth has been given to me&rdquo; (Matthew 28:18). Jesus Christ is Lord over all—including governments and nations.
              </p>
              <p>
                &ldquo;His dominion is an everlasting dominion, which shall not pass away, and his kingdom one that shall not be destroyed&rdquo; (Daniel 7:14).
              </p>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">The Light Has Come</h3>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>&ldquo;The people who walked in darkness have seen a great light; those who dwelt in a land of deep darkness, on them has light shone... For to us a child is born, to us a son is given; and the government shall be upon his shoulder.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— Isaiah 9:2, 6</cite>
            </blockquote>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Our Conviction</h3>
              <p>
                We are convinced that the Gospel alone—not political strategies, not incremental legislation, not compromise—is the answer to abortion. We proclaim Christ as King and call all people, from the individual to the nation, to bow before Him in repentance and faith.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/the-gospel/message-of-reconciliation" className="text-red-600 font-semibold hover:underline">
              &larr; Message of Reconciliation
            </Link>
            <Link href="/the-gospel/incarnation" className="text-red-600 font-semibold hover:underline">
              The Incarnation &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

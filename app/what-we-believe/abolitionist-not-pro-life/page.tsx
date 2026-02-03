import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'Abolitionist, Not Pro-Life - Abolish Abortion Michigan',
  description: 'Being pro-life is not the same as seeking to abolish abortion. Learn the difference between abolitionism and the pro-life movement.',
};

export default function AbolitionistNotProLifePage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold mb-4">WHAT WE BELIEVE</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">ABOLITIONIST, NOT PRO-LIFE</h1>
          <p className="text-xl text-gray-300 italic">&ldquo;We refuse to go with the multitude to do evil.&rdquo;</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Being Pro-Life Is Not The Same As Seeking To Abolish Abortion</h2>

            <h3 className="text-xl font-bold mt-8 mb-4">We Are Abolitionists</h3>

            <p>
              While both abolitionists and pro-lifers oppose abortion, we differ fundamentally in our approach. Abolitionists view abortion as murder requiring immediate criminalization, not mere regulation. The pro-life political establishment has not opposed abortion in a manner consistent with its being murder.
            </p>

            <p>
              For decades, the pro-life strategy has sought compromise and accepted court rulings permitting abortion as settled law. Christian opposition has been inadequate because leaders deferred to secular pro-life strategists rather than applying Scripture to anti-abortion arguments.
            </p>

            <p>
              Abolitionists bring the Gospel of the Kingdom of Jesus Christ into conflict with the culture of death. We oppose both pro-abortion arguments and enabling legislation while confronting church apathy.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Core Abolitionist Positions</h3>

            <ul className="list-disc pl-6 space-y-2">
              <li>No exceptions or compromises on abortion</li>
              <li>Total and immediate criminalization, not regulation</li>
              <li>Rejecting incremental approaches (heartbeat bills, pain-capable bills)</li>
              <li>Moral persuasion and assistance to reduce abortions while pursuing complete abolition</li>
              <li>Application of consistent biblical Christianity</li>
            </ul>

            <p className="mt-6">
              Incremental legislation undermines the abolitionist message by normalizing abortion under certain conditions. A law that bans abortion after twenty weeks implicitly permits it before that point.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Our Mission</h3>
              <p className="mb-4">
                Abolitionists in Michigan are devoted to showing mercy and establishing justice for our preborn neighbors being led to the slaughter.
              </p>
              <p>
                We are committed to non-violent agitation, gospel proclamation, preaching, and community outreach to bring an end to abortion in Michigan and throughout the world.
              </p>
            </div>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>&ldquo;You shall love your neighbor as yourself.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— Mark 12:31</cite>
            </blockquote>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>&ldquo;Learn to do good; seek justice, correct oppression; bring justice to the fatherless, plead the widow&apos;s cause.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— Isaiah 1:17</cite>
            </blockquote>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/what-we-believe" className="text-red-600 font-semibold hover:underline">
              &larr; Back to What We Believe
            </Link>
            <Link href="/what-we-believe/biblical-not-secular" className="text-red-600 font-semibold hover:underline">
              Biblical, Not Secular &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

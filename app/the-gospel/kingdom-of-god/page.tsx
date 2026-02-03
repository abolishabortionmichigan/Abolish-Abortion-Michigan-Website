import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'The Kingdom of God - Abolish Abortion Michigan',
  description: 'Abolitionism and the Kingdom of God are inseparably connected. His Kingdom is one that shall not be destroyed.',
};

export default function KingdomOfGodPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold mb-4">THE GOSPEL</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">THE KINGDOM OF GOD</h1>
          <p className="text-xl text-gray-300 italic">&ldquo;His Kingdom is one that shall not be destroyed.&rdquo;</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic bg-red-50 py-4 pr-4">
              <p>&ldquo;The time is fulfilled, and the kingdom of God is at hand; repent and believe in the gospel.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— Mark 1:15</cite>
            </blockquote>

            <h2 className="text-2xl font-bold text-red-600 mb-6">Gospel-Centered Abolition</h2>

            <p>
              Abolitionists reject widely-accepted injustices and bring darkness into the light. We are driven by the reality that the Kingdom of God has come in Christ, and His reign demands that we pursue justice, love mercy, and walk humbly with our God.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">The Foundation of Human Dignity</h3>

            <p>
              Two core propositions underpin our abolitionist convictions: First, that humans are made in the image of God, giving every human being inherent dignity and worth. Second, that Christ became human to rescue mankind from self-destruction and eternal separation from God.
            </p>

            <p>
              Christian morality, centered on God as the source of all truth and goodness, leads to the recognition of human dignity. In contrast, humanistic approaches that reject God&apos;s authority inevitably lead to the devaluation of human life and enable inhumane treatment of the most vulnerable.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">A Clash of Absolutes</h3>

            <p>
              The kingdom of God stands in direct opposition to the kingdom of darkness. When we proclaim the Gospel and call for the abolition of abortion, we are bringing about a clash of absolutes—the truth of God&apos;s Word against the lies of a culture that has embraced death.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg my-8">
              <p className="text-lg">
                &ldquo;He has told you, O man, what is good; and what does the LORD require of you but to do justice, and to love kindness, and to walk humbly with your God?&rdquo;
              </p>
              <p className="text-gray-600 mt-2">— Micah 6:8</p>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Faith in Action</h3>

            <p>
              Our faith compels us to action. We are called to &ldquo;learn to do good; seek justice, correct oppression; bring justice to the fatherless, plead the widow&apos;s cause&rdquo; (Isaiah 1:17).
            </p>

            <p>
              We are to &ldquo;abhor what is evil; hold fast to what is good&rdquo; (Romans 12:9) and &ldquo;take no part in the unfruitful works of darkness, but instead expose them&rdquo; (Ephesians 5:11).
            </p>

            <div className="bg-[#1a1a1a] text-white p-8 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Words from the Abolitionists</h3>
              <blockquote className="border-l-4 border-red-500 pl-4">
                <p className="mb-4">
                  &ldquo;Christianity asks us not merely to be generally religious and moral, but to believe specifically the doctrines, to consume the principles, and to practice the precepts of Christ.&rdquo;
                </p>
                <cite className="text-gray-400">— William Wilberforce</cite>
              </blockquote>
              <blockquote className="border-l-4 border-red-500 pl-4 mt-6">
                <p className="mb-4">
                  &ldquo;Silence in the face of evil is itself evil: God will not hold us guiltless. Not to speak is to speak.&rdquo;
                </p>
                <cite className="text-gray-400">— Dietrich Bonhoeffer</cite>
              </blockquote>
            </div>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Our Guiding Principle</h3>
              <p>
                &ldquo;Repent for the Kingdom of God is at Hand&rdquo; drives our work. We pursue justice, mercy, and humility before God as we seek to abolish abortion and call our nation to repentance.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/the-gospel/gospel" className="text-red-600 font-semibold hover:underline">
              &larr; The Gospel
            </Link>
            <Link href="/the-gospel/great-commission" className="text-red-600 font-semibold hover:underline">
              The Great Commission &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

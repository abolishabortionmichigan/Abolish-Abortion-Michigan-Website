import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'The Incarnation - Abolish Abortion Michigan',
  description: 'The Word became flesh and dwelt among us. The Son of God appeared to destroy the works of the devil.',
};

export default function IncarnationPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold mb-4">THE GOSPEL</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">THE INCARNATION</h1>
          <p className="text-xl text-gray-300 italic">&ldquo;The Word became flesh and dwelt among us.&rdquo;</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic bg-red-50 py-4 pr-4">
              <p>&ldquo;The reason the Son of God appeared was to destroy the works of the devil.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— 1 John 3:8</cite>
            </blockquote>

            <h2 className="text-2xl font-bold text-red-600 mb-6">The Word Became Flesh</h2>

            <p>
              Jesus Christ, the Son of God, entered the womb to redeem the world, to forgive sinners, reconcile humanity to God, and make all things new. The incarnation—God becoming man—is the foundation of our salvation and the basis for the dignity of all human life.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Christ in the Womb</h3>

            <p>
              The Creator of the cosmos came down among us and began His earthly existence as a human zygote no larger than a single cell. Christ experienced prenatal development like all humans—growing from conception through every stage of life in Mary&apos;s womb.
            </p>

            <p>
              This profound truth demonstrates that human life is sacred from its very beginning. If the Son of God Himself passed through every stage of human development, how can we say that any stage is less than fully human?
            </p>

            <div className="bg-gray-50 p-6 rounded-lg my-8">
              <p className="text-lg">
                &ldquo;Since therefore the children share in flesh and blood, he himself likewise partook of the same things, that through death he might destroy the one who has the power of death, that is, the devil.&rdquo;
              </p>
              <p className="text-gray-600 mt-2">— Hebrews 2:14</p>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Christ&apos;s Solidarity with Humanity</h3>

            <p>
              The incarnation demonstrates Christ&apos;s complete solidarity with humanity. He became like us in all things—except sin—in order that He might live as we live, suffer as we suffer, and ultimately die in our place.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">The Purpose of the Incarnation</h3>

            <p>
              Christ came for many redemptive purposes:
            </p>

            <ul className="list-disc pl-6 space-y-2 my-6">
              <li>To give light to those who sit in darkness (Luke 1:78-79)</li>
              <li>To bring life and immortality to light through the Gospel (2 Timothy 1:10)</li>
              <li>To free people from slavery to sin</li>
              <li>To reconcile the world to God (2 Corinthians 5:18-21)</li>
              <li>To abolish death (1 Corinthians 15:26)</li>
              <li>To destroy the works of the devil (1 John 3:8)</li>
            </ul>

            <h3 className="text-xl font-bold mt-8 mb-4">The Incarnation and Abortion</h3>

            <p>
              The truth of the incarnation stands in direct conflict with all forms of child sacrifice. If the eternal Son of God took on human nature at conception, then every conceived child bears the image of God and possesses inherent dignity.
            </p>

            <p>
              Abortion is not merely a political issue—it is an assault on the very image of God and a denial of the truth that Christ has sanctified every stage of human life by passing through it Himself.
            </p>

            <div className="bg-[#1a1a1a] text-white p-8 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">The Full Scope of Redemption</h3>
              <p>
                &ldquo;For in him all the fullness of God was pleased to dwell, and through him to reconcile to himself all things, whether on earth or in heaven, making peace by the blood of his cross&rdquo; (Colossians 1:19-20).
              </p>
            </div>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>&ldquo;And the Word became flesh and dwelt among us, and we have seen his glory, glory as of the only Son from the Father, full of grace and truth.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— John 1:14</cite>
            </blockquote>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Our Response</h3>
              <p>
                In light of the incarnation, we are called to love our neighbors—including the smallest and most vulnerable. We seek justice for the preborn because Christ Himself was once a preborn child in Mary&apos;s womb.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/the-gospel/answer-to-abortion" className="text-red-600 font-semibold hover:underline">
              &larr; The Answer to Abortion
            </Link>
            <Link href="/the-gospel" className="text-red-600 font-semibold hover:underline">
              Back to The Gospel &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

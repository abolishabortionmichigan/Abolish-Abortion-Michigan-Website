import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'No Exceptions - Abolish Abortion Michigan',
  description: 'Abortion is murder, always and everywhere. There are no circumstances that justify the killing of an innocent child.',
};

export default function NoExceptionsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold mb-4">WHAT WE BELIEVE</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">NO EXCEPTIONS</h1>
          <p className="text-xl text-gray-300 italic">&ldquo;Abortion is murder. Always and everywhere murder.&rdquo;</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Murder Without Exception</h2>

            <p>
              Abortion must be completely abolished without any exceptions. If abortion constitutes murder, then no circumstances—including rape, fetal disability, or maternal danger—should permit it.
            </p>

            <p>
              Compromising on child sacrifice fundamentally weakens moral arguments against abortion. As British abolitionist Elizabeth Heyrick wrote regarding concessions on slavery: &ldquo;The abolitionists have lost, rather than gained ground by it.&rdquo;
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Children Conceived in Rape</h3>

            <p>
              Children conceived in rape represent society&apos;s most vulnerable members. Laws allowing abortion in such cases create &ldquo;iniquitous decrees&rdquo; that prey upon the defenseless. The child is innocent regardless of the circumstances of conception.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Disability Exceptions</h3>

            <p>
              Disability-based abortion exceptions are evil, absurd, and heartless toward both preborn and disabled individuals. Every human being has inherent worth and dignity regardless of physical or mental abilities.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Maternal Health</h3>

            <p>
              Even when mothers face danger, intentional abortion is not justified. We advocate for early delivery when necessary while maintaining that doctors should be healers, not killers. There is always an ethical path that does not require the intentional killing of the child.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Our Position</h3>
              <p>
                We seek to demonstrate mercy and establish justice for preborn individuals through gospel proclamation, community outreach, and non-violent agitation to end abortion in Michigan and globally. No exceptions. No compromise.
              </p>
            </div>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>&ldquo;You shall not murder.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— Exodus 20:13</cite>
            </blockquote>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/what-we-believe/immediate-not-gradual" className="text-red-600 font-semibold hover:underline">
              &larr; Immediate, Not Gradual
            </Link>
            <Link href="/what-we-believe/ignore-roe" className="text-red-600 font-semibold hover:underline">
              Ignore Roe &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

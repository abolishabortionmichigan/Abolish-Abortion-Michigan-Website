import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'Immediate, Not Gradual - Abolish Abortion Michigan',
  description: 'Abortion cannot be abolished by allowing it all along the way. The time for justice is always now.',
};

export default function ImmediateNotGradualPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold mb-4">WHAT WE BELIEVE</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">IMMEDIATE, NOT GRADUAL</h1>
          <p className="text-xl text-gray-300 italic">&ldquo;Abortion cannot be abolished by allowing it all along the way.&rdquo;</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-red-600 mb-6">We Are Immediatists</h2>
            <p className="text-xl font-semibold">THE TIME FOR JUSTICE IS ALWAYS NOW</p>

            <p className="mt-6">
              Abolitionists and pro-lifers differ fundamentally in their ultimate authority. Abolitionists answer to God, while pro-lifers have historically submitted to the Supreme Court&apos;s authority regarding abortion policy.
            </p>

            <p>
              The abolitionist stance toward court rulings permitting abortion is one of defiance, in contrast to the pro-life movement&apos;s posture of submission to judicial decisions and cultural trends.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Constitutional Grounds</h3>

            <p>
              The Constitution mandates equal legal protection, meaning states cannot permit the killing of certain groups of human beings. Roe v. Wade violated constitutional principles, making defiance of that ruling both morally and legally justified.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">The Problem with Incrementalism</h3>

            <p>
              The pro-life strategy emphasizes incremental regulation rather than abolition, accepting abortion&apos;s continued legality while seeking restrictions. This approach codifies acceptance of child murder through laws like those banning abortion after twenty weeks—which explicitly permit earlier abortions.
            </p>

            <p>
              We reject moral relativism that accepts lesser iniquity as progress. Incrementalism and immediatism cannot coexist; incrementalism undermines immediate abolition efforts.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">The Contrast</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-red-600">Abolitionists Demand:</h4>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Immediate, complete abolition</li>
                    <li>View Roe as illegitimate and non-binding</li>
                    <li>Frame abortion as murder requiring criminal prohibition</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-gray-600">Pro-Lifers Pursue:</h4>
                  <ul className="list-disc pl-6 mt-2">
                    <li>Incremental regulation</li>
                    <li>Submission to judicial decisions</li>
                    <li>Gradual restrictions over time</li>
                  </ul>
                </div>
              </div>
            </div>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>
                &ldquo;Gradualism in theory is perpetuity in practice.&rdquo;
              </p>
              <cite className="text-gray-600 not-italic">— William Lloyd Garrison</cite>
            </blockquote>

            <p>
              Comprehensive Christian mobilization demanding abortion&apos;s outright prohibition would end the practice, whereas accepting regulatory increments perpetuates complacency and tacitly affirms abortion&apos;s legitimacy.
            </p>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/what-we-believe/biblical-not-secular" className="text-red-600 font-semibold hover:underline">
              &larr; Biblical, Not Secular
            </Link>
            <Link href="/what-we-believe/no-exceptions" className="text-red-600 font-semibold hover:underline">
              No Exceptions &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'Criminalization - Abolish Abortion Michigan',
  description: 'Establishing justice for the preborn requires criminalization. If abortion is murder, it should be treated as such.',
};

export default function CriminalizationPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold mb-4">WHAT WE BELIEVE</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">CRIMINALIZATION</h1>
          <p className="text-xl text-gray-300 italic">&ldquo;If abortion is murder, it should be treated as such.&rdquo;</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-red-600 mb-6">Justice Requires Criminalization</h2>

            <p>
              Establishing justice for the preborn requires criminalization. Our central thesis contends that if abortion constitutes murder, it should be legally treated as such.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">The Problem with Parental Exemptions</h3>

            <p>
              We critique the pro-life movement&apos;s standard practice of granting automatic immunity to parents who procure abortions. There are several objections to this approach:
            </p>

            <div className="space-y-4 my-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold">1. DIY Abortion Rights</h4>
                <p className="mt-2">
                  Parental immunity creates a legal pathway for self-induced abortions. Pro-life regulations may inadvertently accelerate the abortion industry&apos;s evolution toward self-managed methods using mail-order pills and online services.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold">2. Deterrent Effect</h4>
                <p className="mt-2">
                  Criminal penalties deter crime. Many have testified: &ldquo;If we knew we would have been facing homicide charges, we would never have aborted that child.&rdquo; Removing parental immunity would prevent most abortions through legal deterrence rather than through prosecution.
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-bold">3. Historical Legal Precedent</h4>
                <p className="mt-2">
                  Roe v. Wade relied partly on inconsistencies in pro-life laws. Justice Blackmun&apos;s reasoning questioned why preborn persons wouldn&apos;t receive equal legal protection if truly considered persons.
                </p>
              </div>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Equal Protection</h3>

            <p>
              True justice requires equal protection for all human beings from the moment of conception. This means treating the intentional killing of a preborn child with the same legal seriousness as the killing of any other human being.
            </p>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Our Mission</h3>
              <p>
                We are devoted to establishing justice for preborn individuals through non-violent agitation, community outreach, and gospel proclamation, seeking to abolish abortion entirely through proper criminalization.
              </p>
            </div>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>&ldquo;You shall do no injustice in court. You shall not be partial to the poor or defer to the great, but in righteousness shall you judge your neighbor.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— Leviticus 19:15</cite>
            </blockquote>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/what-we-believe/ignore-roe" className="text-red-600 font-semibold hover:underline">
              &larr; Ignore Roe
            </Link>
            <Link href="/what-we-believe" className="text-red-600 font-semibold hover:underline">
              Back to What We Believe &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

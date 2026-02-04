import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'The Gospel - Abolish Abortion Michigan',
  description: 'The Gospel is the power of God for salvation to everyone who believes. Romans 1:16.',
};

export default function GospelPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold mb-4">THE GOSPEL</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">THE GOSPEL</h1>
          <p className="text-xl text-gray-300">THE GOSPEL IS THE POWER OF GOD FOR SALVATION TO EVERYONE WHO BELIEVES</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none space-y-6">

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>I am not ashamed of the gospel, for it is the power of God for salvation to everyone who believes, to the Jew first and also to the Greek</p>
              <cite className="text-gray-600 not-italic">&mdash; Romans 1:16</cite>
            </blockquote>

            <p>
              The reality of abortion is that 57 million babies have been recorded killed since 1973 and that number is rising as 3,500 &ndash; 4,000 babies continue to be murdered daily. We are living in the midst of a genocide and God hates the hands that shed innocent blood (Prov. 6:17). We must not neglect the children being abandoned and led to their deaths.
            </p>

            <p>
              God has provided a way we can be reconciled to a right relationship with Him so that we don&apos;t have to indulge in bloodshed. Being guilty of sin before a holy and just God, we all deserve the penalty of sin &ndash; death (Romans 6:23). However, out of the abundance of God&apos;s mercy, He sent His Son to take upon our sins on Himself so that He would receive the penalty we rightly deserve. As Jesus became the substitute for sin on our behalf, &ldquo;God demonstrated His righteousness so that He might be just and the justifier of the one who has faith in Jesus&rdquo; (Romans 3:26). God then raised Jesus from the dead, giving the Father the ability to reconcile and declare righteous those who repent and trust in Christ alone to free them from the condemnation of sin. That same power that raised Christ from the dead is now at work in those who believe. &ldquo;Therefore, repent and turn back, so that your sins may be wiped out&rdquo; (Acts 3:19).
            </p>

            <p>
              Part of living a life in accordance to repentance is placing your full faith in Jesus and continually abiding in Him and persevering until death. So &ldquo;just as Christ was raised from the dead by the glory of the Father, we too should walk in newness of life&rdquo; (Romans 6:2,4).
            </p>

            <p>
              Having been made a new creation in Christ, &ldquo;conduct yourself in a manner worthy of the gospel of Christ&rdquo; (Phil 1:27). by loving your [preborn] neighbors as yourselves (Matt 22:39) and visiting orphans in their time of distress (James 1:27). Now&apos;s the time to stand up against the injustice of the preborn genocide!
            </p>

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/gospel.png"
              alt="The Gospel"
              className="w-full my-8 rounded-lg"
            />

            <div className="my-10">
              <Link
                href="/the-gospel/kingdom-of-god"
                className="inline-block px-8 py-4 bg-red-600 text-white font-bold text-sm tracking-wide hover:bg-red-700 transition-colors no-underline"
              >
                Read More &#10148; ABOLITIONISM &amp; THE KINGDOM OF GOD
              </Link>
            </div>

            <p className="text-sm text-gray-400 italic">
              This content was originally published by Abolish Abortion California, and is used by permission. Abolish Abortion Michigan is not formally affiliated with Abolish Abortion California, but shares its abolitionist mission and principles.
            </p>
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

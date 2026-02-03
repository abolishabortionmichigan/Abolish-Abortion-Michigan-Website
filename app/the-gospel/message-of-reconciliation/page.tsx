import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'Message of Reconciliation - Abolish Abortion Michigan',
  description: 'We are ambassadors of Christ, imploring you to be reconciled to God.',
};

export default function MessageOfReconciliationPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold mb-4">THE GOSPEL</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">MESSAGE OF RECONCILIATION</h1>
          <p className="text-xl text-gray-300 italic">&ldquo;We implore you on behalf of Christ, be reconciled to God.&rdquo;</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-red-600 mb-6">We Are Ambassadors of Christ</h2>

            <p>
              As abolitionists, we are ambassadors of Christ, offering the message of reconciliation to a world lost in sin. We seek to transform culture through Jesus&apos;s teachings, His law, and the promise of forgiveness for all who repent and trust in Him.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">The Problem: Human Sinfulness</h3>

            <div className="bg-gray-50 p-6 rounded-lg my-6">
              <p className="text-lg">
                &ldquo;For all have sinned and fall short of the glory of God.&rdquo;
              </p>
              <p className="text-gray-600 mt-2">— Romans 3:23</p>
            </div>

            <p>
              Every human being has rebelled against God. We have violated His holy law and stand guilty before Him. Scripture tells us that &ldquo;it is appointed for man to die once, and after that comes judgment&rdquo; (Hebrews 9:27).
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">God&apos;s Provision: The Gift of His Son</h3>

            <div className="bg-gray-50 p-6 rounded-lg my-6">
              <p className="text-lg">
                &ldquo;For God so loved the world, that he gave his only Son, that whoever believes in him should not perish but have eternal life.&rdquo;
              </p>
              <p className="text-gray-600 mt-2">— John 3:16</p>
            </div>

            <p>
              Christ&apos;s death on the cross provides the acceptable payment for sin. He bore the wrath of God that we deserved, so that through faith in Him we might be declared righteous.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Salvation Through Faith</h3>

            <p>
              God calls us to &ldquo;repentance toward God and faith toward our Lord Jesus Christ&rdquo; (Acts 20:21). Salvation comes through grace alone, by faith alone, in Christ alone.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg my-6">
              <p className="text-lg">
                &ldquo;For we hold that one is justified by faith apart from works of the law.&rdquo;
              </p>
              <p className="text-gray-600 mt-2">— Romans 3:28</p>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Faith Demonstrated by Action</h3>

            <p>
              While salvation is by grace through faith and not by works, genuine faith will produce fruit. As James writes, &ldquo;faith by itself, if it does not have works, is dead&rdquo; (James 2:17). True belief in Christ produces moral transformation and a desire to obey God&apos;s commands.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">The Gift of the Holy Spirit</h3>

            <p>
              Upon conversion, believers receive the Holy Spirit as a seal and guarantee of their salvation. The Spirit confirms our adoption as children of God and empowers us to live in obedience to Christ.
            </p>

            <div className="bg-[#1a1a1a] text-white p-8 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">A Call to Repentance</h3>
              <p className="mb-4">
                If you have never turned from your sins and trusted in Christ, we urge you to do so today. The Gospel offers not only salvation from future judgment but also liberation from sin&apos;s present power.
              </p>
              <p>
                &ldquo;Repent and be baptized every one of you in the name of Jesus Christ for the forgiveness of your sins, and you will receive the gift of the Holy Spirit&rdquo; (Acts 2:38).
              </p>
            </div>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>&ldquo;Therefore, we are ambassadors for Christ, God making his appeal through us. We implore you on behalf of Christ, be reconciled to God.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— 2 Corinthians 5:20</cite>
            </blockquote>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/the-gospel/great-commission" className="text-red-600 font-semibold hover:underline">
              &larr; The Great Commission
            </Link>
            <Link href="/the-gospel/answer-to-abortion" className="text-red-600 font-semibold hover:underline">
              The Answer to Abortion &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

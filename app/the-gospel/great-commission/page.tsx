import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'The Great Commission - Abolish Abortion Michigan',
  description: 'If faith without works is dead, what kind of faith refuses to help end the murder of preborn children?',
};

export default function GreatCommissionPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-red-500 font-semibold mb-4">THE GOSPEL</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">THE GREAT COMMISSION</h1>
          <p className="text-xl text-gray-300 italic">&ldquo;Go therefore and make disciples of all nations.&rdquo;</p>
        </div>
      </section>

      {/* Content */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="prose prose-lg max-w-none">
            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic bg-red-50 py-4 pr-4">
              <p>&ldquo;All authority in heaven and on earth has been given to me. Go therefore and make disciples of all nations, baptizing them in the name of the Father and of the Son and of the Holy Spirit, teaching them to observe all that I have commanded you.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— Matthew 28:18-20</cite>
            </blockquote>

            <h2 className="text-2xl font-bold text-red-600 mb-6">The Great Commission Without Abolition is Dead</h2>

            <p>
              Churches that emphasize evangelism while neglecting action against abortion misunderstand the Great Commission. The command to make disciples includes teaching them to observe all that Christ commanded—and Christ commanded us to love our neighbors as ourselves.
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">If Faith Without Works is Dead...</h3>

            <p>
              What kind of faith refuses to help end the murder of preborn children? James tells us that &ldquo;faith by itself, if it does not have works, is dead&rdquo; (James 2:17). A faith that acknowledges abortion is wrong but does nothing to stop it is not the faith that saves.
            </p>

            <div className="bg-gray-50 p-6 rounded-lg my-8">
              <p className="text-lg">
                &ldquo;You shall love the Lord your God with all your heart and with all your soul and with all your mind. This is the great and first commandment. And a second is like it: You shall love your neighbor as yourself.&rdquo;
              </p>
              <p className="text-gray-600 mt-2">— Matthew 22:37-39</p>
            </div>

            <h3 className="text-xl font-bold mt-8 mb-4">Beyond Token Opposition</h3>

            <p>
              Is attending an annual rally sufficient? Is voting every few years enough? Is simply listening to sermons about the sanctity of life an adequate response to the daily slaughter of thousands of children?
            </p>

            <p>
              We must ask ourselves: Does our minimal effort adequately reflect Christ&apos;s greatest commandments? Does it demonstrate genuine love for our preborn neighbors?
            </p>

            <h3 className="text-xl font-bold mt-8 mb-4">Making True Disciples</h3>

            <p>
              Faithful Great Commission work must produce disciples who actively oppose abortion—not merely acknowledge its wrongfulness. Discipleship requires teaching obedience to Christ&apos;s commands, which necessarily includes defending the defenseless and speaking for those who cannot speak for themselves.
            </p>

            <blockquote className="border-l-4 border-red-600 pl-6 my-8 italic">
              <p>&ldquo;Learn to do good; seek justice, correct oppression; bring justice to the fatherless, plead the widow&apos;s cause.&rdquo;</p>
              <cite className="text-gray-600 not-italic">— Isaiah 1:17</cite>
            </blockquote>

            <div className="bg-gray-100 p-6 rounded-lg my-8">
              <h3 className="text-xl font-bold mb-4">Our Mission</h3>
              <p>
                Abolish Abortion Michigan aims to demonstrate mercy and establish justice for our preborn neighbors through gospel proclamation, community outreach, and non-violent agitation to end abortion. We call the Church to fulfill the Great Commission by making disciples who love their neighbors—including the smallest and most vulnerable among us.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex justify-between">
            <Link href="/the-gospel/kingdom-of-god" className="text-red-600 font-semibold hover:underline">
              &larr; The Kingdom of God
            </Link>
            <Link href="/the-gospel/message-of-reconciliation" className="text-red-600 font-semibold hover:underline">
              Message of Reconciliation &rarr;
            </Link>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

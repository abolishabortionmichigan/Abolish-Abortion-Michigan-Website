import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import CTABanner from '@/components/CTABanner';
import NewsCard from '@/components/NewsCard';
import { statistics } from '@/lib/content';
import { getAllNewsArticles } from '@/lib/data/news-store';

export const metadata: Metadata = {
  title: 'Abolish Abortion Michigan - Equal Protection for the Preborn',
  description: 'Abolitionists in Michigan devoted to establishing justice and equal protection for our preborn neighbors. Join the movement to abolish abortion.',
};

export const revalidate = 300; // ISR: revalidate every 5 minutes

export default async function HomePage() {
  let latestNews: Awaited<ReturnType<typeof getAllNewsArticles>> = [];
  try {
    const articles = await getAllNewsArticles(true);
    latestNews = articles.slice(0, 3);
  } catch {
    // Database unavailable at build time; ISR will populate on first request
  }

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Abolish Abortion Michigan',
    url: 'https://abolishabortionmichigan.com',
    logo: 'https://abolishabortionmichigan.com/images/aa-logo.webp',
    description: 'Abolitionists in Michigan devoted to establishing justice and equal protection for our preborn neighbors.',
    sameAs: [
      'https://facebook.com/abolishabortionmichigan',
      'https://twitter.com/abolishabortionmi',
      'https://instagram.com/abolishabortionmichigan',
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />

      {/* Hero Section */}
      <section className="relative bg-[#1a1a1a] text-white py-20 md:py-32">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/60" />
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <Image
            src="/images/aa-logo.webp"
            alt="Abolish Abortion Michigan"
            width={176}
            height={176}
            className="h-32 md:h-44 w-auto mx-auto mb-6 invert"
            priority
          />
          <h1 className="sr-only">Abolish Abortion Michigan</h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            We are dedicated to the immediate and total abolition of human abortion in the state of Michigan.
            Not regulation. Not reduction. <span className="text-red-500 font-semibold">Abolition.</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/the-petition"
              className="inline-block px-8 py-4 bg-red-600 text-white font-bold text-lg hover:bg-red-700 transition-colors"
            >
              SIGN THE PETITION
            </Link>
            <Link
              href="/who-we-are"
              className="inline-block px-8 py-4 border-2 border-white text-white font-bold text-lg hover:bg-white hover:text-[#1a1a1a] transition-colors"
            >
              WHO WE ARE
            </Link>
          </div>
        </div>
      </section>

      {/* Statistics Counter */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4">The Reality in Michigan</h2>
          <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Every statistic represents a precious life lost to abortion. These are not just numbers—they are our neighbors, created in the image of God.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-red-700 mb-2">{statistics.totalAbortions}</div>
              <div className="text-gray-600 text-sm md:text-base">Total Abortions Since 1973</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-red-700 mb-2">{statistics.yearlyAbortions}</div>
              <div className="text-gray-600 text-sm md:text-base">Abortions Per Year</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-red-700 mb-2">{statistics.dailyAbortions}</div>
              <div className="text-gray-600 text-sm md:text-base">Abortions Per Day</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-4xl md:text-5xl font-bold text-red-700 mb-2">{statistics.sinceRoeOverturned}</div>
              <div className="text-gray-600 text-sm md:text-base">Since Prop 3 Passed</div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Statement */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            <span className="text-red-700 font-semibold">Abortion is the intentional killing of the human fetus, or the performance of a procedure intentionally designed to kill the human fetus.</span>
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Abortion is the murder, the sacrifice, of tiny neighbors who have not yet been born. This great atrocity must be abolished.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            We believe that every human being bears the image of God from the moment of conception and deserves equal protection under the law. We call upon the State of Michigan to recognize the God-given right to life for all human beings and to abolish the practice of abortion entirely.
          </p>
        </div>
      </section>

      {/* What is Abolition */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">What is Abolition?</h2>
              <p className="text-gray-700 mb-4">
                Abolition is the immediate and unconditional end to abortion. It stands in contrast to the incremental approach that has dominated the pro-life movement for 50 years.
              </p>
              <p className="text-gray-700 mb-4">
                While incrementalism seeks to regulate and restrict abortion, abolition demands its total criminalization as the murder that it is. We do not accept any exceptions—not for rape, incest, or any other circumstance.
              </p>
              <p className="text-gray-700 mb-6">
                Just as William Wilberforce and others worked to abolish the slave trade, we work to abolish abortion—not to make it rarer, safer, or more regulated, but to end it completely.
              </p>
              <Link
                href="/what-we-believe"
                className="inline-block px-6 py-3 bg-[#1a1a1a] text-white font-semibold hover:bg-gray-800 transition-colors"
              >
                WHAT WE BELIEVE
              </Link>
            </div>
            <div className="bg-gray-100 p-8 rounded-lg">
              <h3 className="text-xl font-bold mb-4 text-red-700">Key Principles</h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-700 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>Human life begins at conception</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-700 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>All human beings deserve equal protection under the law</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-700 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>Abortion is murder and must be treated as such</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-700 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>No exceptions—all children deserve protection</span>
                </li>
                <li className="flex items-start">
                  <svg className="w-5 h-5 text-red-700 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  <span>The Gospel offers forgiveness for all sins, including abortion</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="bg-gray-100 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Latest News</h2>
            <Link href="/news" className="text-red-700 font-semibold hover:text-red-800 transition-colors">
              View All &rarr;
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestNews.map((article) => (
              <NewsCard
                key={article.slug}
                title={article.title}
                excerpt={article.excerpt}
                date={article.created_at ? new Date(article.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                }) : ''}
                slug={article.slug}
                image={article.image}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Get Involved */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Get Involved</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Sign the Petition</h3>
              <p className="text-gray-600 mb-4">
                Add your name to the growing list of Michiganders calling for the abolition of abortion.
              </p>
              <Link href="/the-petition" className="text-red-700 font-semibold hover:text-red-800">
                Sign Now &rarr;
              </Link>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Spread the Word</h3>
              <p className="text-gray-600 mb-4">
                Share our message with your church, community, and elected officials.
              </p>
              <Link href="/media" className="text-red-700 font-semibold hover:text-red-800">
                Get Resources &rarr;
              </Link>
            </div>
            <div className="text-center p-6 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Donate</h3>
              <p className="text-gray-600 mb-4">
                Support our efforts to abolish abortion in Michigan through your generous giving.
              </p>
              <Link href="/donate" className="text-red-700 font-semibold hover:text-red-800">
                Give Now &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}

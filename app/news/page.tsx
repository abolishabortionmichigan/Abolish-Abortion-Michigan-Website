import { Metadata } from 'next';
import NewsCard from '@/components/NewsCard';
import CTABanner from '@/components/CTABanner';
import { getAllNewsArticles } from '@/lib/data/news-store';

export const metadata: Metadata = {
  title: 'News - Abolish Abortion Michigan',
  description: 'Latest news and updates from Abolish Abortion Michigan.',
};

// Ensure page is dynamically rendered to show latest articles
export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  // Get published articles only
  const articles = await getAllNewsArticles(true);

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">NEWS</h1>
        </div>
      </section>

      {/* News Grid */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          {articles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article) => (
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
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Nothing Found</h2>
              <p className="text-gray-600">It seems we can&apos;t find any posts. Perhaps searching will help.</p>
            </div>
          )}
        </div>
      </section>

      {/* Sidebar Info */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-600">no announcements at this time.</p>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}

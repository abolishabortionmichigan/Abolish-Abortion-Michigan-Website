import { Metadata } from 'next';
import CTABanner from '@/components/CTABanner';
import { getAllNewsArticles } from '@/lib/data/news-store';
import NewsSearch from './news-search';

export const metadata: Metadata = {
  title: 'News - Abolish Abortion Michigan',
  description: 'Latest news and updates from Abolish Abortion Michigan.',
};

// Ensure page is dynamically rendered to show latest articles
export const dynamic = 'force-dynamic';

export default async function NewsPage() {
  // Get published articles only
  const articles = await getAllNewsArticles(true);

  // Serialize for client component
  const serialized = articles.map((a) => ({
    title: a.title,
    excerpt: a.excerpt,
    slug: a.slug,
    image: a.image,
    created_at: a.created_at ? new Date(a.created_at).toISOString() : undefined,
  }));

  return (
    <>
      {/* Hero Section */}
      <section className="bg-[#1a1a1a] text-white py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold">NEWS</h1>
        </div>
      </section>

      {/* News Grid with Search */}
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <NewsSearch articles={serialized} />
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}

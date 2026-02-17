import { Metadata } from 'next';
import CTABanner from '@/components/CTABanner';
import { getAllNewsArticles } from '@/lib/data/news-store';
import NewsSearch from './news-search';

export const metadata: Metadata = {
  title: 'News - Abolish Abortion Michigan',
  description: 'Latest news and updates from Abolish Abortion Michigan.',
};

// ISR: revalidate every 5 minutes
export const revalidate = 300;

const HTML_TAG_REGEX = /<[^>]*>/g;
const WHITESPACE_REGEX = /\s+/;

function getReadingTime(html: string): string {
  const text = html.replace(HTML_TAG_REGEX, '');
  const words = text.split(WHITESPACE_REGEX).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default async function NewsPage() {
  let serialized: { title: string; excerpt: string; slug: string; image?: string; created_at?: string; readingTime: string }[] = [];
  try {
    const articles = await getAllNewsArticles(true);
    serialized = articles.map((a) => ({
      title: a.title,
      excerpt: a.excerpt,
      slug: a.slug,
      image: a.image || undefined,
      created_at: a.created_at ? new Date(a.created_at).toISOString() : undefined,
      readingTime: getReadingTime(a.content),
    }));
  } catch {
    // Database unavailable at build time; ISR will populate on first request
  }

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

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CTABanner from '@/components/CTABanner';
import ShareButtons from '@/components/ShareButtons';
import NewsCard from '@/components/NewsCard';
import { getNewsArticleBySlug, getAllNewsArticles } from '@/lib/data/news-store';
import { sanitizeHtml } from '@/lib/sanitize';

const HTML_TAG_REGEX = /<[^>]*>/g;
const WHITESPACE_REGEX = /\s+/;

function getReadingTime(html: string): string {
  const text = html.replace(HTML_TAG_REGEX, '');
  const words = text.split(WHITESPACE_REGEX).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abolishabortionmichigan.com';

// ISR: revalidate every hour (individual articles change less frequently)
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  if (!article || !article.published) {
    notFound();
  }

  return {
    title: `${article.title} - Abolish Abortion Michigan`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: 'article',
      publishedTime: article.created_at ? new Date(article.created_at).toISOString() : undefined,
      images: article.image ? [article.image] : undefined,
    },
  };
}

export default async function NewsArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  // Only show published articles to public
  if (!article || !article.published) {
    notFound();
  }

  const formattedDate = article.created_at
    ? new Date(article.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  const readingTime = getReadingTime(article.content);

  // Get related articles (other published articles, excluding current)
  const allArticles = await getAllNewsArticles(true);
  const relatedArticles = allArticles
    .filter((a) => a.slug !== slug)
    .slice(0, 3);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    ...(article.image ? { image: [article.image] } : {}),
    datePublished: article.created_at ? new Date(article.created_at).toISOString() : undefined,
    dateModified: article.updated_at
      ? new Date(article.updated_at).toISOString()
      : article.created_at
        ? new Date(article.created_at).toISOString()
        : undefined,
    author: {
      '@type': 'Organization',
      name: 'Abolish Abortion Michigan',
      url: BASE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Abolish Abortion Michigan',
      url: BASE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/news/${slug}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section with Image */}
      <section className="relative bg-[#1a1a1a] text-white py-16 md:py-24">
        {article.image && (
          <div className="absolute inset-0 hidden md:block">
            <Image
              src={article.image}
              alt={article.title}
              fill
              priority
              className="object-contain opacity-30"
            />
          </div>
        )}
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <p className="text-gray-400 mb-4">{formattedDate} &middot; {readingTime}</p>
          <h1 className="text-3xl md:text-5xl font-bold">{article.title}</h1>
        </div>
      </section>

      {/* Article Image (mobile) */}
      {article.image && (
        <div className="md:hidden relative w-full aspect-video bg-[#1a1a1a]">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-contain"
          />
        </div>
      )}

      {/* Article Content */}
      <section className="bg-white py-12">
        <div className="max-w-3xl mx-auto px-4">
          <article
            className="prose prose-lg max-w-none prose-headings:text-[#1a1a1a] prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-img:max-w-full prose-img:h-auto prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
          />

          {/* Share + Back to News */}
          <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4">
            <Link
              href="/news"
              className="text-red-600 font-semibold hover:text-red-700 transition-colors"
            >
              &larr; Back to News
            </Link>
            <ShareButtons
              url={`${BASE_URL}/news/${slug}`}
              title={article.title}
              description={article.excerpt}
            />
          </div>
        </div>
      </section>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center mb-8">More News</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((related) => (
                <NewsCard
                  key={related.slug}
                  title={related.title}
                  excerpt={related.excerpt}
                  date={
                    related.created_at
                      ? new Date(related.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : ''
                  }
                  slug={related.slug}
                  image={related.image}
                  readingTime={getReadingTime(related.content)}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}

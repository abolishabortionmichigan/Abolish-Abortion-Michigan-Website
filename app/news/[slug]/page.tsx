import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CTABanner from '@/components/CTABanner';
import ShareButtons from './share-buttons';
import { getNewsArticleBySlug } from '@/lib/data/news-store';
import { sanitizeHtml } from '@/lib/sanitize';

interface Props {
  params: Promise<{ slug: string }>;
}

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abolishabortionmichigan.com';

export const dynamic = 'force-dynamic';

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
      ...(article.image ? { images: [{ url: article.image }] } : {}),
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
          <p className="text-gray-400 mb-4">{formattedDate}</p>
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
              url={`https://abolishabortionmichigan.com/news/${slug}`}
              title={article.title}
            />
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <CTABanner />
    </>
  );
}

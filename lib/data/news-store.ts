// Shared news articles store - in production, replace with database
// This file is shared between API routes and server actions

import { NewsArticle } from '@/types';

export type NewsArticleData = NewsArticle;

// In-memory store for demo - replace with Prisma database in production
export const newsArticles: NewsArticleData[] = [
  {
    id: '1',
    title: 'Abolitionists of Michigan Launch a Website',
    slug: 'abolitionists-of-michigan-launch-a-website',
    excerpt: 'Abolish Abortion Michigan is proud to announce the launch of our website. Hooray, and congrats! We hope to continue improving the website and adding content for many years from now.',
    content: '<p>Abolish Abortion Michigan is proud to announce the launch of our website. Hooray, and congrats!</p><p>We hope to continue improving the website and adding content for many years from now. Hopefully this will help outsiders understand who we are, and help insiders in some other way.</p><p>Thanks to Abolish Abortion North Carolina for the hard work they put into their website, which we were able to derive much of our content and design from.</p>',
    image: '/images/news-launch.jpg',
    published: true,
    created_at: '2024-11-09T00:00:00.000Z',
    updated_at: '2024-11-09T00:00:00.000Z',
  },
];

// Helper functions for news operations
export function getAllNewsArticles(publishedOnly = false): NewsArticleData[] {
  if (publishedOnly) {
    return newsArticles.filter((a) => a.published);
  }
  return [...newsArticles];
}

export function getNewsArticleBySlug(slug: string): NewsArticleData | undefined {
  return newsArticles.find((a) => a.slug === slug || a.id === slug);
}

export function createNewsArticle(data: Omit<NewsArticleData, 'id' | 'created_at' | 'updated_at'>): NewsArticleData {
  const newArticle: NewsArticleData = {
    id: Date.now().toString(),
    title: data.title,
    slug: data.slug,
    excerpt: data.excerpt,
    content: data.content,
    image: data.image || '',
    published: data.published || false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  newsArticles.unshift(newArticle);
  return newArticle;
}

export function updateNewsArticle(id: string, data: Partial<NewsArticleData>): NewsArticleData | null {
  const index = newsArticles.findIndex((a) => a.id === id || a.slug === id);
  if (index === -1) return null;

  newsArticles[index] = {
    ...newsArticles[index],
    ...data,
    updated_at: new Date().toISOString(),
  };

  return newsArticles[index];
}

export function deleteNewsArticle(id: string): boolean {
  const index = newsArticles.findIndex((a) => a.id === id || a.slug === id);
  if (index === -1) return false;

  newsArticles.splice(index, 1);
  return true;
}

export function slugExists(slug: string, excludeId?: string): boolean {
  return newsArticles.some((a) => a.slug === slug && a.id !== excludeId);
}

// News articles store - in-memory for now
// TODO: Connect to database for persistence

import { NewsArticle } from '@/types';

export type NewsArticleData = NewsArticle;

// In-memory store with default article
const memoryStore: NewsArticleData[] = [
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

export async function getAllNewsArticles(publishedOnly = false): Promise<NewsArticleData[]> {
  const articles = [...memoryStore].sort((a, b) =>
    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
  );
  if (publishedOnly) {
    return articles.filter((a) => a.published);
  }
  return articles;
}

export async function getNewsArticleBySlug(slug: string): Promise<NewsArticleData | undefined> {
  return memoryStore.find((a) => a.slug === slug || a.id === slug);
}

export async function createNewsArticle(data: Omit<NewsArticleData, 'id' | 'created_at' | 'updated_at'>): Promise<NewsArticleData> {
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
  memoryStore.unshift(newArticle);
  return newArticle;
}

export async function updateNewsArticle(id: string, data: Partial<NewsArticleData>): Promise<NewsArticleData | null> {
  const index = memoryStore.findIndex((a) => a.id === id || a.slug === id);
  if (index === -1) return null;

  memoryStore[index] = {
    ...memoryStore[index],
    ...data,
    updated_at: new Date().toISOString(),
  };
  return memoryStore[index];
}

export async function deleteNewsArticle(id: string): Promise<boolean> {
  const index = memoryStore.findIndex((a) => a.id === id || a.slug === id);
  if (index === -1) return false;
  memoryStore.splice(index, 1);
  return true;
}

export async function slugExists(slug: string, excludeId?: string): Promise<boolean> {
  return memoryStore.some((a) => a.slug === slug && a.id !== excludeId);
}

'use server';

import { getAuthToken, verifyToken } from './auth-actions';
import { NewsArticle } from '@/types';
import {
  getAllNewsArticles,
  getNewsArticleBySlug,
  createNewsArticle as createArticle,
  updateNewsArticle as updateArticle,
  deleteNewsArticle as deleteArticle,
  slugExists,
} from '@/lib/data/news-store';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function fetchNewsArticles(publishedOnly = false) {
  try {
    // If requesting all articles (admin view), verify auth
    if (!publishedOnly) {
      const admin = await isAdmin();
      if (!admin) {
        // Return only published for non-admins
        return await getAllNewsArticles(true);
      }
    }

    return await getAllNewsArticles(publishedOnly);
  } catch (error) {
    return { error: 'Failed to fetch news' };
  }
}

export async function fetchNewsArticle(slug: string) {
  try {
    const article = await getNewsArticleBySlug(slug);

    if (!article) {
      return { error: 'Article not found' };
    }

    // If not published, require admin auth
    if (!article.published) {
      const admin = await isAdmin();
      if (!admin) {
        return { error: 'Article not found' };
      }
    }

    return article;
  } catch (error) {
    return { error: 'Failed to fetch article' };
  }
}

export async function createNewsArticle(data: Omit<NewsArticle, 'id' | 'created_at' | 'updated_at'>) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    // Validate required fields
    if (!data.title || !data.slug || !data.excerpt || !data.content) {
      return { error: 'Title, slug, excerpt, and content are required' };
    }

    // Check for duplicate slug
    if (await slugExists(data.slug)) {
      return { error: 'Slug already exists' };
    }

    const newArticle = await createArticle({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      image: data.image || '',
      published: data.published || false,
    });

    return newArticle;
  } catch (error) {
    return { error: 'Failed to create article' };
  }
}

export async function updateNewsArticle(id: string, data: Partial<NewsArticle>) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    // If updating slug, check for duplicates
    if (data.slug && await slugExists(data.slug, id)) {
      return { error: 'Slug already exists' };
    }

    const updated = await updateArticle(id, data);

    if (!updated) {
      return { error: 'Article not found' };
    }

    return updated;
  } catch (error) {
    return { error: 'Failed to update article' };
  }
}

export async function deleteNewsArticle(id: string) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const deleted = await deleteArticle(id);

    if (!deleted) {
      return { error: 'Article not found' };
    }

    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete article' };
  }
}

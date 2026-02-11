import { NextRequest, NextResponse } from 'next/server';
import {
  getNewsArticleBySlug,
  updateNewsArticle,
  deleteNewsArticle,
  slugExists,
} from '@/lib/data/news-store';
import { getAuthToken, verifyToken } from '@/lib/actions/auth-actions';
import { sanitizeHtml } from '@/lib/sanitize';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;
  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const article = await getNewsArticleBySlug(slug);

    if (!article) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // If not published, require admin auth
    if (!article.published) {
      if (!await isAdmin()) {
        return NextResponse.json({ error: 'Article not found' }, { status: 404 });
      }
    }

    return NextResponse.json(article);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch article' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const data = await request.json();

    const existingArticle = await getNewsArticleBySlug(slug);
    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // If updating slug, check for duplicates
    if (data.slug && data.slug !== existingArticle.slug && await slugExists(data.slug)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Sanitize content if provided
    if (data.content) {
      data.content = sanitizeHtml(data.content);
    }

    const updated = await updateNewsArticle(slug, data);

    if (!updated) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: 'Failed to update article' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const deleted = await deleteNewsArticle(slug);

    if (!deleted) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Failed to delete article' }, { status: 500 });
  }
}

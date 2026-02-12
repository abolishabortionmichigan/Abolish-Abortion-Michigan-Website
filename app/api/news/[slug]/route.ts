import { NextRequest, NextResponse } from 'next/server';
import {
  getNewsArticleBySlug,
  updateNewsArticle,
  deleteNewsArticle,
  slugExists,
} from '@/lib/data/news-store';
import { getAuthToken, verifyToken } from '@/lib/actions/auth-actions';
import { sanitizeHtml } from '@/lib/sanitize';
import { validateCsrf } from '@/lib/csrf';

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
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { slug } = await params;
    const data = await request.json();

    // Only allow updating known fields
    const allowedFields = ['title', 'slug', 'excerpt', 'content', 'image', 'published'];
    const filtered: Record<string, unknown> = {};
    for (const key of allowedFields) {
      if (key in data) filtered[key] = data[key];
    }

    // Validate field lengths
    if (typeof filtered.title === 'string' && filtered.title.length > 200) {
      return NextResponse.json({ error: 'Title must be 200 characters or less' }, { status: 400 });
    }
    if (typeof filtered.slug === 'string' && filtered.slug.length > 200) {
      return NextResponse.json({ error: 'Slug must be 200 characters or less' }, { status: 400 });
    }
    if (typeof filtered.excerpt === 'string' && filtered.excerpt.length > 1000) {
      return NextResponse.json({ error: 'Excerpt must be 1000 characters or less' }, { status: 400 });
    }
    if (typeof filtered.content === 'string' && filtered.content.length > 50000) {
      return NextResponse.json({ error: 'Content must be 50000 characters or less' }, { status: 400 });
    }
    if (filtered.published !== undefined && typeof filtered.published !== 'boolean') {
      return NextResponse.json({ error: 'Published must be a boolean' }, { status: 400 });
    }

    const existingArticle = await getNewsArticleBySlug(slug);
    if (!existingArticle) {
      return NextResponse.json({ error: 'Article not found' }, { status: 404 });
    }

    // If updating slug, check for duplicates
    if (filtered.slug && filtered.slug !== existingArticle.slug && await slugExists(filtered.slug as string)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Sanitize content if provided
    if (filtered.content) {
      filtered.content = sanitizeHtml(filtered.content as string);
    }

    const updated = await updateNewsArticle(slug, filtered);

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
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

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

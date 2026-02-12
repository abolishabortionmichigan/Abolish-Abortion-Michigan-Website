import { NextRequest, NextResponse } from 'next/server';
import {
  getAllNewsArticles,
  createNewsArticle,
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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const publishedOnly = searchParams.get('published') === 'true';

  if (publishedOnly) {
    return NextResponse.json(await getAllNewsArticles(true));
  }

  // For admin view, verify auth
  if (!await isAdmin()) {
    // Return only published articles for non-admins
    return NextResponse.json(await getAllNewsArticles(true));
  }

  return NextResponse.json(await getAllNewsArticles(false));
}

export async function POST(request: NextRequest) {
  const csrfError = validateCsrf(request);
  if (csrfError) return csrfError;

  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const data = await request.json();

    if (!data.title || !data.slug || !data.excerpt || !data.content) {
      return NextResponse.json({ error: 'Title, slug, excerpt, and content are required' }, { status: 400 });
    }

    // Check for duplicate slug
    if (await slugExists(data.slug)) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    const newArticle = await createNewsArticle({
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: sanitizeHtml(data.content),
      image: data.image || '',
      published: data.published || false,
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

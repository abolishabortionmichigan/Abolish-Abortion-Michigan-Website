import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import {
  getAllNewsArticles,
  createNewsArticle,
  slugExists,
} from '@/lib/data/news-store';

const JWT_SECRET = process.env.JWT_SECRET || '***REDACTED***';

function verifyAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return null;
  }

  try {
    const token = authHeader.split(' ')[1];
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const publishedOnly = searchParams.get('published') === 'true';

  if (publishedOnly) {
    return NextResponse.json(await getAllNewsArticles(true));
  }

  // For admin view, verify auth
  const user = verifyAuth(request);
  if (!user || user.role !== 'admin') {
    // Return only published articles for non-admins
    return NextResponse.json(await getAllNewsArticles(true));
  }

  return NextResponse.json(await getAllNewsArticles(false));
}

export async function POST(request: NextRequest) {
  const user = verifyAuth(request);
  if (!user || user.role !== 'admin') {
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
      content: data.content,
      image: data.image || '',
      published: data.published || false,
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create article' }, { status: 500 });
  }
}

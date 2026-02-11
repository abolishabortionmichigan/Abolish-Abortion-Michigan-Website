import { ImageResponse } from 'next/og';
import { getNewsArticleBySlug } from '@/lib/data/news-store';

export const alt = 'Abolish Abortion Michigan';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OGImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);

  const title = article?.title || 'News Article';
  const date = article?.created_at
    ? new Date(article.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '';

  return new ImageResponse(
    (
      <div
        style={{
          background: '#1a1a1a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px',
        }}
      >
        {/* Top: Branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '8px',
              height: '32px',
              background: '#dc2626',
              borderRadius: '4px',
            }}
          />
          <span
            style={{
              color: '#9ca3af',
              fontSize: '24px',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}
          >
            Abolish Abortion Michigan
          </span>
        </div>

        {/* Middle: Title */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          <h1
            style={{
              color: 'white',
              fontSize: title.length > 60 ? '42px' : '54px',
              fontWeight: 700,
              lineHeight: 1.2,
              margin: 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {title}
          </h1>
        </div>

        {/* Bottom: Date + NEWS label */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span style={{ color: '#9ca3af', fontSize: '20px' }}>{date}</span>
          <span
            style={{
              color: '#dc2626',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            NEWS
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}

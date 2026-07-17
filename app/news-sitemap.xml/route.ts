import { getAllNewsArticles } from '@/lib/data/news-store';

// Google News Sitemap format — separate from the main sitemap.xml because
// Google News wants only articles from the last 48 hours. Older articles
// silently drop out of this sitemap but keep working in the main sitemap.
//
// After submitting the site to Google Publisher Center + this sitemap URL in
// Search Console, fresh news articles become eligible for the Top Stories
// carousel and google.com/news surfaces.
//
// Reference: https://developers.google.com/search/docs/crawling-indexing/sitemaps/news-sitemap

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abolishabortionmichigan.com';
const PUBLICATION_NAME = 'Abolish Abortion Michigan';
const PUBLICATION_LANGUAGE = 'en';
const FORTY_EIGHT_HOURS_MS = 48 * 60 * 60 * 1000;

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  let recentArticles: Awaited<ReturnType<typeof getAllNewsArticles>> = [];
  try {
    const all = await getAllNewsArticles(true);
    const cutoff = Date.now() - FORTY_EIGHT_HOURS_MS;
    recentArticles = all.filter((a) => {
      if (!a.created_at) return false;
      return new Date(a.created_at).getTime() >= cutoff;
    });
  } catch (error) {
    console.error('news-sitemap: failed to load articles, serving empty sitemap:', error instanceof Error ? error.message : 'Unknown error');
  }

  const items = recentArticles.map((article) => {
    const pubDate = article.created_at
      ? new Date(article.created_at).toISOString()
      : new Date().toISOString();
    return `  <url>
    <loc>${BASE_URL}/news/${escapeXml(article.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(PUBLICATION_NAME)}</news:name>
        <news:language>${PUBLICATION_LANGUAGE}</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
    </news:news>
  </url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${items.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      // Fresh — Google News should re-crawl often
      'Cache-Control': 'public, max-age=600, s-maxage=600',
    },
  });
}

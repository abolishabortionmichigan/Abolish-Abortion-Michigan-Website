import { getAllNewsArticles } from '@/lib/data/news-store';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abolishabortionmichigan.com';

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

export async function GET() {
  const articles = await getAllNewsArticles(true);

  const items = articles.map((article) => {
    const pubDate = article.created_at
      ? new Date(article.created_at).toUTCString()
      : new Date().toUTCString();

    return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${BASE_URL}/news/${escapeXml(article.slug)}</link>
      <guid isPermaLink="true">${BASE_URL}/news/${escapeXml(article.slug)}</guid>
      <description>${escapeXml(article.excerpt)}</description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Abolish Abortion Michigan - News</title>
    <link>${BASE_URL}/news</link>
    <description>Latest news and updates from Abolish Abortion Michigan.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}

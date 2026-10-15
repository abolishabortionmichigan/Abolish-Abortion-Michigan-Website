import { MetadataRoute } from 'next';
import { getAllNewsArticles } from '@/lib/data/news-store';
import { getLegislators } from '@/lib/data/legislators';
import { CITIES } from '@/lib/data/cities';
import { STORE_CATEGORIES, getActiveProducts } from '@/lib/store';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.abolishabortionmichigan.com';

/*
 * lastModified is set ONLY where a real content-change date exists.
 *
 * Every entry used to carry `new Date()`, so 331 of the 1,046 URLs claimed to
 * have changed at the moment the sitemap was regenerated — which, on a 24h
 * revalidate, means claiming a fresh change every single day. Google discounts
 * a lastmod it finds unreliable, so that spent the signal on exactly the city
 * and legislator pages that most needed recrawling.
 *
 * News articles, products and the store listings derive their dates from row
 * timestamps, so those are exact and need no maintenance. The three constants
 * below date the sections that render a checked-in data file instead.
 *
 * >>> BUMP THE MATCHING CONSTANT WHEN YOU EDIT ONE OF THOSE DATA FILES. <<<
 *
 * Evergreen pages get no lastModified at all rather than an invented one. An
 * absent date leaves Google to its own crawl heuristics — which is what a date
 * it distrusts does anyway, without tainting the rest of the file.
 */
const LEGISLATOR_DATA_UPDATED = new Date('2026-10-01'); // data/legislators.json
const MILLS_DATA_UPDATED = new Date('2026-09-02'); // data/abortion-mills.json
// City pages render both their own copy and the mill data, so they are as
// fresh as the later of the two.
const CITY_CONTENT_UPDATED = new Date('2026-07-31'); // lib/data/cities.ts, app/cities/[slug]
const CITY_PAGES_UPDATED = new Date(
  Math.max(CITY_CONTENT_UPDATED.getTime(), MILLS_DATA_UPDATED.getTime()),
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    // Trailing slash matters here — must match the homepage canonical (see
    // app/page.tsx). Without it, Google inspects the no-slash URL and reports
    // "Duplicate, Google chose different canonical" against the with-slash form.
    { url: `${BASE_URL}/`, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${BASE_URL}/the-petition`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/contact`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/donate`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE_URL}/who-we-are`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/faq`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/media`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/non-violence-statement`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${BASE_URL}/financial-transparency`, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy-policy`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/delete-my-data`, changeFrequency: 'yearly', priority: 0.3 },
    // The Gospel section
    { url: `${BASE_URL}/the-gospel`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/the-gospel/gospel`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/the-gospel/great-commission`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/the-gospel/incarnation`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/the-gospel/kingdom-of-god`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/the-gospel/message-of-reconciliation`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/the-gospel/answer-to-abortion`, changeFrequency: 'yearly', priority: 0.5 },
    // What We Believe section
    { url: `${BASE_URL}/what-we-believe`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/what-we-believe/abolitionist-not-pro-life`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/what-we-believe/biblical-not-secular`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/what-we-believe/criminalization`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/what-we-believe/ignore-roe`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/what-we-believe/immediate-not-gradual`, changeFrequency: 'yearly', priority: 0.5 },
    { url: `${BASE_URL}/what-we-believe/no-exceptions`, changeFrequency: 'yearly', priority: 0.5 },
    // Abolition Bills section
    { url: `${BASE_URL}/abolition-bills`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE_URL}/abolition-bills/components`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/abolition-bills/current-bills`, changeFrequency: 'monthly', priority: 0.5 },
    // Legislator scorecard hub — high priority, refreshed weekly
    {
      url: `${BASE_URL}/legislators`,
      lastModified: LEGISLATOR_DATA_UPDATED,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Allied abolition groups directory — backlink hub
    { url: `${BASE_URL}/partners`, changeFrequency: 'monthly', priority: 0.6 },
    // City landing pages — local-SEO surface
    {
      url: `${BASE_URL}/cities`,
      lastModified: CITY_PAGES_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    // Statewide abortion-facility map. Earns more search impressions than any
    // other page on the site (146 in the 90 days to 2026-10-14) and was missing
    // from this file entirely until then — Google found it via the nav instead.
    {
      url: `${BASE_URL}/abortion-mills`,
      lastModified: MILLS_DATA_UPDATED,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // Per-city landing pages
  const cityPages: MetadataRoute.Sitemap = [
    ...CITIES.map((c) => ({
      url: `${BASE_URL}/cities/${c.slug}`,
      lastModified: CITY_PAGES_UPDATED,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
    // Detroit long-form sub-pages
    {
      url: `${BASE_URL}/cities/detroit/underground-railroad`,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    },
  ];

  // 149 individual legislator profile pages — the SEO long-tail workhorse.
  // District redirect URLs (`/districts/[chamber]/[N]`) are intentionally
  // NOT in the sitemap since they 301-redirect to the canonical
  // /legislators/[slug] URL — Google indexes the canonical, not the
  // redirect source.
  const legislatorPages: MetadataRoute.Sitemap = getLegislators().map((l) => ({
    url: `${BASE_URL}/legislators/${l.slug}`,
    lastModified: LEGISLATOR_DATA_UPDATED,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Add dynamic news article URLs
  let newsPages: MetadataRoute.Sitemap = [];
  let newestArticle: Date | undefined;
  try {
    const articles = await getAllNewsArticles(true);
    newsPages = articles.map((article) => ({
      url: `${BASE_URL}/news/${article.slug}`,
      lastModified: article.updated_at ? new Date(article.updated_at) : new Date(article.created_at || ''),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
    const stamps = newsPages
      .map((p) => (p.lastModified ? new Date(p.lastModified).getTime() : NaN))
      .filter((t) => Number.isFinite(t));
    if (stamps.length) newestArticle = new Date(Math.max(...stamps));
  } catch {
    // If news fetch fails, just skip dynamic pages
  }

  // The news index is exactly as fresh as its newest article.
  const newsIndex: MetadataRoute.Sitemap = [
    {
      url: `${BASE_URL}/news`,
      ...(newestArticle ? { lastModified: newestArticle } : {}),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ];

  /*
   * Store. The index and the four category pages are always listed; product
   * URLs are pulled from the database so a new product is discoverable without
   * a code change. Cart and order pages are deliberately absent -- both are
   * noindex, and an order URL is private to the buyer who holds its session id.
   */
  let products: Awaited<ReturnType<typeof getActiveProducts>> = [];
  try {
    products = await getActiveProducts();
  } catch {
    // Store unreachable: list the fixed pages and skip the products.
  }

  // The listings change when a product does, so the newest product dates them.
  const productStamps = products
    .map((p) => (p.updated_at ? new Date(p.updated_at).getTime() : NaN))
    .filter((t) => Number.isFinite(t));
  const storeUpdated = productStamps.length ? new Date(Math.max(...productStamps)) : undefined;
  const dated = storeUpdated ? { lastModified: storeUpdated } : {};

  const storePages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/store`, ...dated, changeFrequency: 'weekly', priority: 0.6 },
    ...STORE_CATEGORIES.map((c) => ({
      url: `${BASE_URL}/store/${c.slug}`,
      ...dated,
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    })),
    { url: `${BASE_URL}/shipping-returns`, changeFrequency: 'yearly' as const, priority: 0.3 },
    // Terms of sale. Linked from every product page but, like /abortion-mills,
    // was never listed here.
    { url: `${BASE_URL}/terms`, changeFrequency: 'yearly' as const, priority: 0.3 },
  ];

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${BASE_URL}/store/product/${p.slug}`,
    ...(p.updated_at ? { lastModified: p.updated_at } : {}),
    changeFrequency: 'weekly' as const,
    priority: 0.5,
  }));

  return [
    ...staticPages,
    ...newsIndex,
    ...legislatorPages,
    ...cityPages,
    ...newsPages,
    ...storePages,
    ...productPages,
  ];
}

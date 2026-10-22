import { MetadataRoute } from 'next';
import { STORE_HIDDEN } from '@/lib/store-visibility';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.abolishabortionmichigan.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Note: /manage-7x9k intentionally NOT listed here — the admin login page
        // sets `robots: { index: false }` on its own metadata instead, so we don't
        // disclose the obscured URL through a publicly-readable robots.txt.
        // While the store is hidden every /store URL answers with the same
        // holding page, so keep crawlers off it entirely rather than letting
        // them walk ~700 identical pages. Removing the flag restores them.
        disallow: ['/admin/', '/api/', '/unsubscribe', ...(STORE_HIDDEN ? ['/store'] : [])],
      },
    ],
    sitemap: [
      `${BASE_URL}/sitemap.xml`,
      `${BASE_URL}/news-sitemap.xml`,
    ],
  };
}

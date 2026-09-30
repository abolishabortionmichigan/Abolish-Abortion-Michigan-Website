/**
 * Canonical site origin and org naming, in one place.
 *
 * Most of this repo reads `process.env.NEXT_PUBLIC_SITE_URL` inline with a
 * hard-coded fallback. That works because AAM's domain is stable, but the
 * store needs the origin in Stripe success/cancel URLs and in Printify
 * callbacks, where a wrong origin silently sends a paying customer to the
 * wrong host. Resolving it once here keeps those consistent.
 *
 * Order of preference:
 *   1. NEXT_PUBLIC_SITE_URL — what Vercel has set for production.
 *   2. NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL — injected by Vercel at build
 *      time (custom domain if attached, otherwise the *.vercel.app host).
 *   3. The known apex, matching the fallback used elsewhere in this repo.
 */
function resolveSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/+$/, '');
  const vercel = process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL;
  if (vercel) return `https://${vercel.replace(/\/+$/, '')}`;
  return 'https://www.abolishabortionmichigan.com';
}

export const SITE_URL = resolveSiteUrl();

export const SITE_NAME = 'Abolish Abortion Michigan';
export const ORG_NAME = 'Abolish Abortion Michigan';

/** Where store and order mail should tell people to reply. */
export const SUPPORT_EMAIL = 'admin@abolishabortionmichigan.com';

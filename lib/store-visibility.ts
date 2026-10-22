/*
 * One switch for taking the storefront off the public site.
 *
 * Set NEXT_PUBLIC_STORE_HIDDEN=true and the public gets a "not open yet" page
 * on every storefront URL, the Store nav item and cart icon disappear, the
 * store drops out of the sitemap, and robots.txt stops crawlers walking it.
 * Anyone logged into the admin still sees the real store, so testing carries
 * on as normal -- the gate lives in proxy.ts, which already verifies that JWT
 * for /admin.
 *
 * NEXT_PUBLIC_ because the header is a client component and has to know
 * whether to render the Store link. Nothing here is a secret -- it only says
 * whether the shop is open, which every visitor can see anyway. On Vercel it
 * must be added with --no-sensitive or it never reaches the browser bundle,
 * and because it is inlined at build time, flipping it needs a fresh build
 * rather than just a redeploy.
 *
 * To reopen the store: remove the variable (or set it to anything but "true")
 * and rebuild. No code change is needed, and none of the crawlability work
 * from 948f410 is undone by hiding it -- the internal links are still there,
 * they just are not reachable while the gate is up.
 */

export const STORE_HIDDEN = process.env.NEXT_PUBLIC_STORE_HIDDEN === 'true';

/** Any storefront route, open or gated. */
export function isStorePath(pathname: string): boolean {
  return pathname === '/store' || pathname.startsWith('/store/');
}

/**
 * Storefront routes the public loses while the store is hidden.
 *
 * `/store/order/<number>` is deliberately NOT gated. It is the URL Stripe
 * returns a buyer to after payment, and the browser-side half of settleOrder
 * runs there -- gating it would break the checkout being tested, and strand
 * anyone who has already paid. It is noindex and needs the order number, so
 * leaving it open exposes nothing.
 */
export function isGatedStorePath(pathname: string): boolean {
  if (!isStorePath(pathname)) return false;
  if (pathname.startsWith('/store/order/')) return false;
  return true;
}

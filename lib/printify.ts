import 'server-only';
import { variantIdOfImage } from './store-variants';
import type { StoreCategory } from './store-categories';
import { createHash, createHmac, timingSafeEqual } from 'crypto';

/*
 * Printify (print-on-demand), server side only.
 *
 * The store stays ours: products live in our database, Stripe takes the
 * payment. Printify is only the print shop behind it —
 *   1. "Sync from Printify" (admin → Products) copies the client's Printify
 *      products and variants into our Product/ProductVariant rows;
 *   2. when an order containing those items is paid, lib/printify-fulfillment
 *      sends it to Printify and into production;
 *   3. Printify's webhooks (/api/printify/webhook) report production and
 *      shipping, and a shipment marks the order shipped + emails the buyer.
 *
 * Everything is dormant until PRINTIFY_API_TOKEN and PRINTIFY_SHOP_ID are set
 * (DEPLOYMENT.md §4b). API reference: https://developers.printify.com/
 */

const API_BASE = (process.env.PRINTIFY_API_BASE || 'https://api.printify.com/v1').replace(/\/$/, '');

export const isPrintifyConfigured = () => Boolean(process.env.PRINTIFY_API_TOKEN && process.env.PRINTIFY_SHOP_ID);

/** Hosts Printify serves product mockups from (also allowed in next.config.ts). */
export const PRINTIFY_IMAGE_HOSTS = ['images.printify.com', 'images-api.printify.com'];

export class PrintifyError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

async function api<T>(
  path: string,
  init: { method?: 'GET' | 'POST'; body?: unknown; timeoutMs?: number } = {},
): Promise<T> {
  const token = process.env.PRINTIFY_API_TOKEN;
  if (!token) throw new PrintifyError('Printify is not connected (PRINTIFY_API_TOKEN is not set).', 0);
  const res = await fetch(`${API_BASE}/${path}`, {
    method: init.method ?? 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'User-Agent': 'AbolishAbortionMichigan-Store/1.0',
      ...(init.body !== undefined ? { 'Content-Type': 'application/json' } : {}),
    },
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
    cache: 'no-store',
    signal: AbortSignal.timeout(init.timeoutMs ?? 20_000),
  });
  const text = await res.text();
  if (!res.ok) {
    // Printify explains validation failures in the body; keep it short and
    // never include request headers (the token).
    let detail = text.slice(0, 400);
    try {
      const j = JSON.parse(text);
      detail = [j.message, j.errors && JSON.stringify(j.errors)].filter(Boolean).join(' ').slice(0, 400) || detail;
    } catch {}
    throw new PrintifyError(`Printify ${res.status}: ${detail || res.statusText}`, res.status);
  }
  return (text ? JSON.parse(text) : {}) as T;
}

/**
 * Exposed for lib/printify-shipping.ts, which quotes shipping on the checkout
 * path and so needs a much shorter timeout than the default.
 */
export const printifyApi = api;

const shop = () => process.env.PRINTIFY_SHOP_ID;

/**
 * When the API token stops working. Printify personal tokens always expire a
 * year after they're generated (there is no never-expiring kind), so the admin
 * pages warn and /api/cron/printify-token emails a reminder ahead of time.
 * Reads the JWT's `exp` claim; no signature check is needed for that.
 */
export function printifyTokenExpiry(): Date | null {
  const payload = process.env.PRINTIFY_API_TOKEN?.split('.')[1];
  if (!payload) return null;
  try {
    const { exp } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return typeof exp === 'number' ? new Date(exp * 1000) : null;
  } catch {
    return null;
  }
}

export const daysUntil = (when: Date, now: Date = new Date()) => Math.ceil((when.getTime() - now.getTime()) / 86_400_000);

// ── products ────────────────────────────────────────────────────────────────

export interface PrintifyVariant {
  id: number;
  title: string;
  price: number; // retail price in cents, set in Printify
  cost?: number;
  is_enabled: boolean;
  is_available: boolean;
  is_default?: boolean;
}

export interface PrintifyProduct {
  id: string;
  title: string;
  blueprint_id?: number;
  description: string;
  tags?: string[];
  options?: { name: string; type: string }[];
  variants: PrintifyVariant[];
  images: { src: string; variant_ids: number[]; position?: string; is_default?: boolean }[];
  print_areas?: { placeholders?: { position?: string; images?: unknown[] }[] }[];
  visible?: boolean;
}

export async function listPrintifyProducts(): Promise<PrintifyProduct[]> {
  const all: PrintifyProduct[] = [];
  for (let page = 1; page <= 40; page++) {
    // A bulk read off the user-facing path, and Printify is slow on it once a
    // shop has a few dozen products - it timed out at the 20s default with 70.
    const r = await api<{ current_page: number; last_page: number; data: PrintifyProduct[] }>(
      `shops/${shop()}/products.json?page=${page}&limit=50`,
      { timeoutMs: 60_000 },
    );
    all.push(...(r.data ?? []));
    if (!r.last_page || r.current_page >= r.last_page) break;
  }

  // Printify pages by offset, so a product created or renamed mid-read shifts
  // the window and the same id comes back on two pages. The importer then
  // tries to create it twice and hits the unique constraint on
  // printify_product_id, failing the whole sync. Last one wins: later pages
  // are the fresher read.
  const byId = new Map<string, PrintifyProduct>();
  for (const p of all) byId.set(p.id, p);
  return [...byId.values()];
}

/** Printify descriptions are HTML; the store shows plain paragraphs. */
export function descriptionToText(html: string): string {
  return (html || '')
    .replace(/<\s*br\s*\/?>/gi, '\n')
    .replace(/<\s*\/\s*(p|div|h[1-6])\s*>/gi, '\n\n')
    .replace(/<\s*li[^>]*>/gi, '• ')
    .replace(/<\s*\/\s*li\s*>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&rsquo;/g, '’')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
    .slice(0, 5000);
}

/** Up to 8 mockups: the default first, then front views of enabled variants. */
/*
 * Which mockup leads, per product.
 *
 * Printify names the view in the URL, not in `position`, and offers dozens of
 * them. Left to its own order a rack of tees all show the same blank front,
 * and a mug shows the handle. So:
 *
 *   garment  message on the back -> back first, then front
 *            blank back          -> front first
 *   ceramic  side first; the handle is on the back and the art is on the side
 *   travel   slogan -> back first, otherwise front
 *
 * Front and back are always both pulled in before the filler views, because
 * there are so many back-ish shots (person-6-back, back-collar-closeup) that
 * they would otherwise crowd the front out of the first eight.
 */
const GARMENTS = new Set([6, 77, 157, 33]);

const cameraLabel = (src: string) => /[?&]camera_label=([^&]+)/.exec(src)?.[1] ?? '';

/** Is there artwork at any of these positions? */
function hasArtAt(p: PrintifyProduct, positions: string[]): boolean {
  return (p.print_areas ?? []).some((g) =>
    (g.placeholders ?? []).some((ph) => positions.includes(ph.position ?? '') && (ph.images?.length ?? 0) > 0),
  );
}

/** Does anything actually print on the back? */
function hasBackArt(p: PrintifyProduct): boolean {
  if ((p.print_areas ?? []).some((g) => (g.placeholders ?? []).some((ph) => ph.position === 'back' && (ph.images?.length ?? 0) > 0))) {
    return true;
  }
  // A travel mug is one wrap-around image, so the slogan never shows up as a
  // separate back placeholder. The named variants are the ones that carry one.
  return / — Travel Mug \(/.test(p.title);
}

type Mockup = PrintifyProduct['images'][number];

/**
 * A short fingerprint of the artwork currently on a product.
 *
 * Printify re-renders a mockup IN PLACE when the artwork changes - same URL,
 * different picture - so Vercel's image cache happily serves the old render
 * for ages. Stripping the sleeve prints left shoppers looking at sleeve marks
 * on a garment that no longer had them, and no amount of clearing their own
 * browser cache could fix it, because the staleness was at the edge.
 *
 * Appending this to each URL means the artwork changing changes the URL, so
 * the cache simply misses. Printify ignores the extra parameter.
 */
function artworkVersion(p: PrintifyProduct): string {
  const parts: string[] = [];
  for (const g of p.print_areas ?? []) {
    for (const ph of g.placeholders ?? []) {
      for (const img of ph.images ?? []) {
        const i = img as { id?: string; scale?: number; x?: number; y?: number; angle?: number };
        parts.push(`${ph.position}:${i.id}:${i.scale}:${i.x}:${i.y}:${i.angle}`);
      }
    }
  }
  return createHash('sha1').update(parts.sort().join('|')).digest('hex').slice(0, 8);
}

/** Order one set of mockups so the view that shows the art comes first. */
function orderViews(p: PrintifyProduct, imgs: Mockup[], caps: [number, number, number]): Mockup[] {
  const by = (re: RegExp) => imgs.filter((i) => re.test(cameraLabel(i.src)));
  const front = by(/^front(-\d+)?$/);
  const back = by(/^back(-\d+)?$/);
  const sides = by(/^(left|right)$/);
  const bp = p.blueprint_id ?? 0;
  const cap = (arr: Mockup[], n: number) => arr.slice(0, n);

  // Cap each view before moving on. A six-colour tee has eight back shots, so
  // an uncapped "back first" fills the whole gallery and the front never
  // appears at all - which is exactly what happened.
  if (bp === 478) return [...cap(sides, caps[0]), ...cap(front, caps[1]), ...cap(back, caps[2])];
  if (bp === 70 || GARMENTS.has(bp)) {
    const [first, second] = hasBackArt(p) ? [back, front] : [front, back];
    // A sleeve or neck print has its own mockup angle. Without this the
    // gallery is all front and back shots and the sleeve never shows.
    //
    // Both sleeve angles are kept: with different art on each sleeve, one shot
    // only ever shows one of them. Closeups come first - a sleeve print is
    // small, and a full-length shot of a model barely reads.
    const taken = new Set<string>();
    const sleeves = [...by(/sleeve.*close.?up/), ...by(/sleeve/)].filter(
      (i) => !taken.has(i.src) && taken.add(i.src) !== undefined,
    );
    const extra = hasArtAt(p, ['left_sleeve', 'right_sleeve', 'neck'])
      ? [...cap(sleeves, 2), ...cap(by(/collar/), 1)]
      : [];
    // Alternate sides rather than grouping them. Two back shots in a row read
    // as "same design on both sides" - a buyer told us exactly that, because
    // the second back shot has the hood UP and looks like a front. Leading
    // back, front, back, front makes the difference obvious at a glance.
    const alternate: Mockup[] = [];
    for (let i = 0; i < Math.max(caps[0], caps[1]); i++) {
      if (i < caps[0] && first[i]) alternate.push(first[i]);
      if (i < caps[1] && second[i]) alternate.push(second[i]);
    }
    return [...alternate, ...extra, ...cap(sides, caps[2])];
  }
  // Anything else - a phone case, a magnet - has its own camera names
  // (front-and-side, close-up, context-1), and Printify already lists them
  // in a sensible order, so take them as they come after the front shot.
  return [
    ...cap(imgs.filter((i) => i.is_default), 1),
    ...cap(front, 1),
    ...cap(imgs, caps[0] + caps[1]),
  ];
}

/*
 * `colourOf` turns the gallery from one strip of photos into one strip PER
 * COLOUR: the shopper picks Charcoal and sees the Charcoal shirt. Without it
 * the eight-image cap meant a six-colour tee only ever showed two of them, and
 * never the colour you had selected. Pass it for anything with a colour axis.
 */
export function pickImages(
  p: PrintifyProduct,
  enabledIds: Set<number>,
  colourOf?: Map<number, string>,
  max = 8,
): string[] {
  const version = artworkVersion(p);
  const stamp = (src: string) => `${src}${src.includes('?') ? '&' : '?'}v=${version}`;
  const usable = p.images.filter(
    (i) => isPrintifyImage(i.src) && (i.variant_ids ?? []).some((id) => enabledIds.has(id)),
  );

  if (!colourOf || colourOf.size < 2) {
    const lead = orderViews(p, usable, [4, 3, 1]);
    const seen = new Set(lead.map((i) => i.src));
    const rest = usable.filter((i) => !seen.has(i.src));
    return [...new Set([...lead, ...rest].map((i) => i.src))].slice(0, max).map(stamp);
  }

  // Seed the groups in VARIANT order, so the gallery opens on the same colour
  // the picker does. Printify lists its images starting from the product's
  // default variant, which on the baseball cap is Red - that is why the
  // listing led with a red cap no matter how the variants were sorted.
  const groups = new Map<string, Mockup[]>();
  for (const colour of colourOf.values()) if (!groups.has(colour)) groups.set(colour, []);

  const spare: Mockup[] = [];
  for (const img of usable) {
    const vid = variantIdOfImage(img.src);
    const colour = vid === null ? null : (colourOf.get(vid) ?? null);
    if (colour === null || !groups.has(colour)) spare.push(img);
    else groups.get(colour)!.push(img);
  }

  const out: string[] = [];
  let filled = 0;
  for (const imgs of groups.values()) {
    if (!imgs.length) continue;
    filled += 1;
    for (const i of orderViews(p, imgs, [2, 2, 1])) out.push(i.src);
  }
  for (const i of spare) out.push(i.src);
  // Four views x six colours. Anything past that is filler nobody scrolls to,
  // and every URL is a row in Product.images.
  return [...new Set(out)].slice(0, Math.max(max, filled * 6)).map(stamp);
}

export function isPrintifyImage(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && PRINTIFY_IMAGE_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

type CategoryRule = [RegExp, StoreCategory];

/*
 * Whole words only, title before tags.
 *
 * Both details are load-bearing. Printify's tags are marketing noise as much as
 * description -- a plain Gildan tee carries "Simple designs on large
 * embroidery", whose "designs" matched an unanchored /sign/ and filed all 30
 * tees under Signs & Activism Gear. The title is what a human wrote, so it wins.
 */
const CATEGORY_RULES: CategoryRule[] = [
  [/\bmugs?\b|\bdrinkware\b|\btumblers?\b|\bwater bottles?\b|\bcoffee cups?\b/, 'drinkware'],
  [/\bstickers?\b|\bdecals?\b|\bmagnets?\b|\bpins?\b|\bpatch(es)?\b|\bwristbands?\b/, 'stickers'],
  [/\bposters?\b|\bsigns?\b|\bbanners?\b|\bflags?\b|\bcanvas\b|\blic[es]nce plate\b/, 'signs'],
  // Things that are none of the above and would otherwise fall through to the
  // clothing default: a phone case is not a shirt.
  [/\bphone cases?\b|\bbible covers?\b|\bbookmarks?\b|\bkey ?rings?\b|\bkey ?chains?\b|\blanyards?\b|\btote bags?\b/, 'accessories'],
  // The 'materials' rule lived here; it returns with the department.
  [/\bt-?shirts?\b|\btees?\b|\bhoodies?\b|\bsweat(shirts?)?\b|\bclothing\b|\bapparel\b|\bhats?\b|\bcaps?\b|\bbeanies?\b/, 'clothing'],
];

export function guessCategory(p: PrintifyProduct): StoreCategory {
  const title = p.title.toLowerCase();
  for (const [re, category] of CATEGORY_RULES) if (re.test(title)) return category;
  const tags = (p.tags ?? []).join(' ').toLowerCase();
  for (const [re, category] of CATEGORY_RULES) if (re.test(tags)) return category;
  return 'clothing';
}

// ── orders ──────────────────────────────────────────────────────────────────

export interface PrintifyAddress {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  country: string;
  region: string;
  address1: string;
  address2?: string;
  city: string;
  zip: string;
}

export interface PrintifyOrderInput {
  external_id: string;
  label: string;
  line_items: { product_id: string; variant_id: number; quantity: number; external_id?: string }[];
  address_to: PrintifyAddress;
}

export async function createPrintifyOrder(input: PrintifyOrderInput): Promise<{ id: string }> {
  return api<{ id: string }>(`shops/${shop()}/orders.json`, {
    method: 'POST',
    body: {
      ...input,
      shipping_method: 1, // standard
      is_printify_express: false,
      is_economy_shipping: false,
      // We email the buyer ourselves when the shipment webhook arrives.
      send_shipping_notification: false,
    },
  });
}

export async function sendPrintifyOrderToProduction(orderId: string): Promise<void> {
  await api(`shops/${shop()}/orders/${encodeURIComponent(orderId)}/send_to_production.json`, { method: 'POST' });
}

export async function getPrintifyOrder(orderId: string): Promise<{ id: string; status: string; shipments?: { carrier: string; number: string; url?: string }[] }> {
  return api(`shops/${shop()}/orders/${encodeURIComponent(orderId)}.json`);
}

// ── webhooks ────────────────────────────────────────────────────────────────

export const PRINTIFY_WEBHOOK_TOPICS = [
  'order:updated',
  'order:sent-to-production',
  'order:shipment:created',
  'order:shipment:delivered',
] as const;

/**
 * Printify signs each webhook body: header `X-Pfy-Signature: sha256=<hex
 * HMAC-SHA256 of the raw body, keyed with the webhook's secret>`.
 */
export function verifyPrintifySignature(rawBody: string, header: string | null): boolean {
  const secret = process.env.PRINTIFY_WEBHOOK_SECRET;
  if (!secret || !header) return false;
  const expected = Buffer.from(`sha256=${createHmac('sha256', secret).update(rawBody, 'utf8').digest('hex')}`);
  const given = Buffer.from(header.trim());
  return expected.length === given.length && timingSafeEqual(expected, given);
}

import 'server-only';
import { createHmac, timingSafeEqual } from 'crypto';

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
  description: string;
  tags?: string[];
  options?: { name: string; type: string }[];
  variants: PrintifyVariant[];
  images: { src: string; variant_ids: number[]; position?: string; is_default?: boolean }[];
  visible?: boolean;
}

export async function listPrintifyProducts(): Promise<PrintifyProduct[]> {
  const all: PrintifyProduct[] = [];
  for (let page = 1; page <= 40; page++) {
    const r = await api<{ current_page: number; last_page: number; data: PrintifyProduct[] }>(
      `shops/${shop()}/products.json?page=${page}&limit=50`,
    );
    all.push(...(r.data ?? []));
    if (!r.last_page || r.current_page >= r.last_page) break;
  }
  return all;
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
export function pickImages(p: PrintifyProduct, enabledIds: Set<number>, max = 8): string[] {
  const usable = p.images.filter((i) => isPrintifyImage(i.src) && (i.variant_ids ?? []).some((id) => enabledIds.has(id)));
  const ordered = [
    ...usable.filter((i) => i.is_default),
    ...usable.filter((i) => !i.is_default && (i.position ?? 'front') === 'front'),
    ...usable.filter((i) => !i.is_default && (i.position ?? 'front') !== 'front'),
  ];
  return [...new Set(ordered.map((i) => i.src))].slice(0, max);
}

export function isPrintifyImage(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'https:' && PRINTIFY_IMAGE_HOSTS.includes(u.hostname);
  } catch {
    return false;
  }
}

/** Best guess at the store department; the admin can change it after import. */
export function guessCategory(p: PrintifyProduct): 'clothing' | 'stickers' | 'signs' | 'materials' {
  const hay = `${p.title} ${(p.tags ?? []).join(' ')}`.toLowerCase();
  if (/sticker|decal|magnet/.test(hay)) return 'stickers';
  if (/poster|sign|banner|flag|canvas/.test(hay)) return 'signs';
  if (/book|card|tract|journal|notebook/.test(hay)) return 'materials';
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

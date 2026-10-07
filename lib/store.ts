import 'server-only';
import { randomInt } from 'crypto';
import prisma from './prisma';
import { imageAxis, variantIdOfImage } from './store-variants';

export { STORE_CATEGORIES, isStoreCategory, storeCategory, type StoreCategory } from './store-categories';
import type { StoreCategory } from './store-categories';

const productInclude = {
  variants: { where: { active: true }, orderBy: [{ sort: 'asc' as const }, { label: 'asc' as const }] },
};

export async function getProductsByCategory(category: StoreCategory) {
  return prisma.product.findMany({
    where: { category, active: true },
    orderBy: [{ featured: 'desc' }, { sort: 'asc' }, { created_at: 'desc' }],
    include: productInclude,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findFirst({ where: { slug, active: true }, include: productInclude });
}

/** Slugs of every live product, for the sitemap. */
export async function getActiveProducts() {
  return prisma.product.findMany({
    where: { active: true },
    select: { slug: true, updated_at: true },
    orderBy: { created_at: 'desc' },
  });
}

/** First image of the most prominent product in each category, for the /store cards. */
export async function getCategoryCovers(): Promise<Record<string, { image: string; count: number }>> {
  const products = await prisma.product.findMany({
    where: { active: true },
    orderBy: [{ featured: 'desc' }, { sort: 'asc' }, { created_at: 'desc' }],
    select: { category: true, images: true, name: true },
  });
  const out: Record<string, { image: string; count: number; from: string }> = {};
  for (const p of products) {
    const entry = out[p.category] ?? { image: '', count: 0, from: '' };
    entry.count += 1;
    // Same rule as the listing cards, so a department cover matches the first
    // product inside it.
    if (p.images[0] && (!entry.image || beatsAsLead(p, { name: entry.from }))) {
      entry.image = p.images[0];
      entry.from = p.name;
    }
    out[p.category] = entry;
  }
  return out;
}

/*
 * Every product is named "<design> - <type>", e.g.
 * "No Compromise On Abortion - Tee (chest mark)". That lets the shop show ONE
 * card per TYPE with a design picker on the page, instead of ~390 near
 * identical listings. Anything not following the convention (Dustin's own
 * Printify-titled products) stands alone as its own group, which is correct.
 */
const DASH = '—';

/** The design every grouped listing leads with. */
const HOUSE_DESIGN = 'Abolish Abortion Michigan';

/**
 * Which of a group's products should be its face.
 *
 * The shop should open on the design that says who we are, and on the plain
 * version of the item rather than one of its variations. Fronts are compared
 * by name as a last resort purely so the card does not move around between
 * imports.
 */
function beatsAsLead(
  a: { name: string },
  b: { name: string },
  common?: Map<string, number>,
): boolean {
  const rank = (n: string) => {
    const { design, style } = splitName(n);
    return (design === HOUSE_DESIGN ? 2 : 0) + (style ? 0 : 1);
  };
  const ra = rank(a.name);
  const rb = rank(b.name);
  if (ra !== rb) return ra > rb;
  const sa = splitName(a.name).style;
  const sb = splitName(b.name).style;
  if (ra < 2 || !sa || !sb) return false;
  // Of the house design's fronts, lead with the one the whole range shares -
  // the chest mark every slogan comes in, not a one-off like the map tee.
  const na = common?.get(sa) ?? 0;
  const nb = common?.get(sb) ?? 0;
  if (na !== nb) return na > nb;
  return sa.localeCompare(sb) < 0;
}

export function splitName(name: string): {
  design: string;
  type: string | null;
  baseType: string | null;
  style: string | null;
} {
  const i = name.lastIndexOf(` ${DASH} `);
  if (i < 0) return { design: name, type: null, baseType: null, style: null };
  const type = name.slice(i + 3).trim();
  // A trailing parenthetical is a front-design choice, not a different
  // product: "Tee (chest mark)" and "Tee (AHA front)" are one Tee.
  const m = /^(.*?)\s*\(([^)]+)\)$/.exec(type);
  return {
    design: name.slice(0, i).trim(),
    type,
    baseType: m ? m[1].trim() : type,
    style: m ? m[2].trim() : null,
  };
}

export type ProductGroup = {
  key: string;
  type: string;
  count: number;
  lead: Awaited<ReturnType<typeof getProductsByCategory>>[number];
};

/** One entry per product type, newest-leading product as the cover. */
export async function getGroupsByCategory(category: StoreCategory): Promise<ProductGroup[]> {
  const products = await getProductsByCategory(category);
  const keyOf = (name: string, slug: string) => splitName(name).baseType ?? slug;

  // How many products in each group carry each front, so the lead can be the
  // standard one rather than whichever happened to sort first.
  const fronts = new Map<string, Map<string, number>>();
  for (const p of products) {
    const { style } = splitName(p.name);
    if (!style) continue;
    const k = keyOf(p.name, p.slug);
    const m = fronts.get(k) ?? new Map<string, number>();
    m.set(style, (m.get(style) ?? 0) + 1);
    fronts.set(k, m);
  }

  const groups = new Map<string, ProductGroup>();
  for (const p of products) {
    const key = keyOf(p.name, p.slug);
    const g = groups.get(key);
    if (!g) {
      groups.set(key, { key, type: splitName(p.name).baseType ?? p.name, count: 1, lead: p });
      continue;
    }
    g.count += 1;
    if (beatsAsLead(p, g.lead, fronts.get(key))) g.lead = p;
  }
  return [...groups.values()];
}

/**
 * Group a product's photos by what they show - the shirt colour, the phone
 * model.
 *
 * The variant is in the mockup URL (see variantIdOfImage), so no extra table
 * is needed: match it against the variant rows and the gallery can show the
 * colour the shopper picked. Returns {} for anything without a colour axis.
 */
export function imagesByColour(product: {
  images: string[];
  variants: { label: string; printify_variant_id: number | null }[];
}): Record<string, string[]> {
  const axis = imageAxis(product.variants.map((v, i) => ({ id: String(i), label: v.label })));
  if (!axis) return {};
  const keyFor = new Map<number, string>();
  for (const v of product.variants) {
    const k = axis.keyOf(v.label);
    if (k && v.printify_variant_id !== null) keyFor.set(v.printify_variant_id, k);
  }
  const out: Record<string, string[]> = {};
  for (const src of product.images) {
    const vid = variantIdOfImage(src);
    const k = vid === null ? null : keyFor.get(vid);
    if (k) (out[k] ??= []).push(src);
  }
  return out;
}

/**
 * The fronts this same slogan is available on - chest mark vs AHA, the map mug
 * vs the layered one.
 *
 * A title with no parenthetical is the plain version of the item, so it is
 * offered as "Standard" rather than being left out of the picker: the mug
 * range is one plain mug plus four variations of it.
 */
export async function getStyles(product: { name: string; category: string }) {
  const { design, baseType } = splitName(product.name);
  if (!baseType) return [];
  const rows = await prisma.product.findMany({
    where: { active: true, category: product.category, name: { startsWith: `${design} ${DASH} ${baseType}` } },
    select: { id: true, slug: true, name: true },
    orderBy: { name: 'asc' },
  });
  const mine = rows
    .map((r) => ({ ...r, parts: splitName(r.name) }))
    .filter((r) => r.parts.baseType === baseType);
  if (!mine.some((r) => r.parts.style)) return [];
  return mine.map((r) => ({ id: r.id, slug: r.slug, style: r.parts.style ?? 'Standard' }));
}

/**
 * Every design available on this product type, for the picker.
 *
 * Grouped on the type WITHOUT its front - "Tee", not "Tee (chest mark)" - so
 * the list is every slogan that comes on a tee. A slogan that exists in the
 * front you are currently looking at links to that one; the rest link to
 * whichever front they do come in, and the Front picker then shows what else
 * that slogan is available in.
 */
export async function getSiblings(product: { id: string; name: string; category: string }) {
  const { baseType, style } = splitName(product.name);
  if (!baseType) return [];
  const rows = await prisma.product.findMany({
    where: { active: true, category: product.category, name: { contains: `${DASH} ${baseType}` } },
    select: { id: true, slug: true, name: true },
    orderBy: { name: 'asc' },
  });
  const byDesign = new Map<string, { id: string; slug: string; design: string }>();
  for (const r of rows) {
    const parts = splitName(r.name);
    if (parts.baseType !== baseType) continue;
    const entry = { id: r.id, slug: r.slug, design: parts.design };
    if (!byDesign.has(parts.design) || parts.style === style) byDesign.set(parts.design, entry);
  }
  return [...byDesign.values()];
}

export function priceRange(p: { price_cents: number; variants: { price_cents: number | null }[] }): [number, number] {
  const prices = [p.price_cents, ...p.variants.map((v) => v.price_cents ?? p.price_cents)];
  return [Math.min(...prices), Math.max(...prices)];
}

/** AAM-XXXXXX, no ambiguous characters (no 0/O, 1/I). */
export function newOrderNumber(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += alphabet[randomInt(alphabet.length)];
  return `AAM-${s}`;
}

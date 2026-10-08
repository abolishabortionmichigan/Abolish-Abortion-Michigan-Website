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
 * Parentheticals that describe decoration rather than which artwork.
 *
 * Any combination of the three, joined with " + " in a fixed order:
 * "(left sleeve + neck)", "(right sleeve)", "(left sleeve + right sleeve +
 * neck)". Eight products per design and front, one per combination.
 */
export const DECORATIONS = ['left sleeve', 'right sleeve', 'neck'] as const;
export type Decoration = (typeof DECORATIONS)[number];

/** Is this parenthetical a decoration list rather than a front design? */
function isExtra(label: string): boolean {
  const parts = label.toLowerCase().split('+').map((x) => x.trim());
  return parts.length > 0 && parts.every((x) => (DECORATIONS as readonly string[]).includes(x));
}

/** The decorations named in an extra, e.g. "left sleeve + neck" -> both. */
export function decorationsOf(extra: string | null): Decoration[] {
  if (!extra) return [];
  const want = extra.toLowerCase().split('+').map((x) => x.trim());
  return DECORATIONS.filter((d) => want.includes(d));
}

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
  extra: string | null;
} {
  const i = name.lastIndexOf(` ${DASH} `);
  if (i < 0) return { design: name, type: null, baseType: null, style: null, extra: null };
  const type = name.slice(i + 3).trim();

  // Trailing parentheticals, outermost last: "Tee (chest mark) (sleeve prints)"
  // is the chest-mark front with the sleeve and neck decoration added. One
  // parenthetical is just the front; none is a plain product.
  let rest = type;
  const parts: string[] = [];
  for (;;) {
    const m = /^(.*?)\s*\(([^()]+)\)$/.exec(rest);
    if (!m) break;
    parts.unshift(m[2].trim());
    rest = m[1].trim();
  }
  // The last parenthetical is the decoration level when it names one. Without
  // this, a hoodie - which has no front choice - reads "Hoodie (sleeve prints)"
  // as a FRONT called "sleeve prints" and offers it in the wrong picker.
  const extra = parts.length && isExtra(parts[parts.length - 1]) ? parts.pop()! : null;
  return {
    design: name.slice(0, i).trim(),
    type,
    baseType: rest || type,
    style: parts[0] ?? null,
    extra,
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
 * vs the layered one. The decoration level is held steady.
 *
 * A title with no parenthetical is the plain version of the item, so it is
 * offered as "Standard" rather than being left out of the picker.
 */
export async function getStyles(product: { name: string; category: string }) {
  const { design, baseType, extra } = splitName(product.name);
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

  // One entry per front, preferring the one at the decoration level we are
  // already looking at so switching front does not silently drop the sleeves.
  const byStyle = new Map<string, { id: string; slug: string; style: string }>();
  for (const r of mine) {
    const style = r.parts.style ?? 'Standard';
    if (!byStyle.has(style) || r.parts.extra === extra) {
      byStyle.set(style, { id: r.id, slug: r.slug, style });
    }
  }
  return [...byStyle.values()];
}

/**
 * The decoration levels this exact design and front comes in - plain, or with
 * the sleeve prints and neck label. Printify prices per print placement, so
 * these are separate products with genuinely different prices.
 */
export async function getExtras(product: { name: string; category: string }) {
  const { design, baseType, style } = splitName(product.name);
  if (!baseType) return [];
  const prefix = style ? `${design} ${DASH} ${baseType} (${style})` : `${design} ${DASH} ${baseType}`;
  const rows = await prisma.product.findMany({
    where: { active: true, category: product.category, name: { startsWith: prefix } },
    select: { id: true, slug: true, name: true, price_cents: true },
    orderBy: { name: 'asc' },
  });
  const mine = rows
    .map((r) => ({ ...r, parts: splitName(r.name) }))
    .filter((r) => r.parts.baseType === baseType && (r.parts.style ?? null) === (style ?? null));
  if (mine.length < 2) return [];
  return mine.map((r) => ({
    id: r.id,
    slug: r.slug,
    decorations: decorationsOf(r.parts.extra) as string[],
    price_cents: r.price_cents,
  }));
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

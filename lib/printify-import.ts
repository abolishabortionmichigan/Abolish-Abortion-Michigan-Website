import 'server-only';
import prisma from './prisma';
import {
  descriptionToText,
  guessCategory,
  isPrintifyConfigured,
  listPrintifyProducts,
  pickImages,
  type PrintifyProduct,
  type PrintifyVariant,
} from './printify';
import { colourOf, comparePhones, imageAxis, isPhoneList, isSizeList, sizeOf } from './store-variants';

/*
 * Printify -> Product / ProductVariant.
 *
 * Printify is the source of truth for what the store sells: titles, prices,
 * colours, sizes, mockups and descriptions are all edited there, and this
 * copies them into our tables so the site can render a page and price a cart
 * without calling Printify on every request.
 *
 * Deliberate choices:
 *
 *  - Nothing is ever deleted. A product pulled from Printify is flagged
 *    active: false, because OrderItem rows point at it and an old order has to
 *    keep rendering. Same for variants.
 *  - Slugs are assigned once and then frozen. They are public URLs and sit in
 *    the sitemap, so renaming a product in Printify must not 404 the old link.
 *  - `featured` and `sort` are never overwritten on an existing row. Those are
 *    merchandising decisions made in the admin, not in Printify.
 *  - Prices come from Printify's retail price, per variant. A tee costs more in
 *    2XL/3XL, so the variant carries the override and the product carries the
 *    cheapest.
 */

export type ImportAction = 'created' | 'updated' | 'unchanged' | 'deactivated' | 'skipped';

export interface ImportedProduct {
  action: ImportAction;
  printify_product_id: string;
  name: string;
  slug: string;
  category: string;
  price_cents: number;
  variants: number;
  images: number;
  reason?: string;
}

export interface ImportReport {
  ok: boolean;
  dryRun: boolean;
  error?: string;
  fetched: number;
  created: number;
  updated: number;
  unchanged: number;
  deactivated: number;
  skipped: number;
  products: ImportedProduct[];
  warnings: string[];
}

/*
 * Printify products we do NOT sell. Listed by id rather than matched on a title
 * pattern so nothing is ever excluded by accident.
 */
/*
 * Kept in Printify, kept out of the public store.
 *
 * Nothing here is deleted - the products stay in the Printify shop exactly as
 * they are, and any past order still resolves. They simply import as
 * active: false, so the site does not list or sell them. Remove a name from
 * these sets and the next sync puts it back.
 */
const DASH = '—';

function titleParts(title: string): { design: string; baseType: string | null } {
  const i = title.lastIndexOf(` ${DASH} `);
  if (i < 0) return { design: title.trim(), baseType: null };
  const type = title.slice(i + 3).trim();
  const m = /^(.*?)\s*\(([^)]+)\)$/.exec(type);
  return { design: title.slice(0, i).trim(), baseType: m ? m[1].trim() : type };
}

// Matched exactly, so "You Need The Gospel Too" is unaffected.
const HIDDEN_DESIGNS = new Map<string, string>([
  ['Fags Need The Gospel Too', 'not listed publicly'],
  ['Trump Is Gay For Abortion', 'not listed publicly'],
  ['Trump Is Gay On Abortion', 'not listed publicly'],
]);

// The Comfort Colors samples, until they are approved for the shop.
const HIDDEN_TYPES = new Map<string, string>([
  ['Cotton Tee', 'sample, not public yet'],
  ['Cotton Hoodie', 'sample, not public yet'],
  ['Kids Cotton Tee', 'sample, not public yet'],
]);

const EXCLUDE = new Map<string, string>([
  // Printify's own sample product, never priced (still at the $8.38 default).
  ['6abc886f10f7e77d320e26df', 'Printify sample product, not ours'],
  // Superseded by the Mark & Map mug (6abdb0340da5712f29028c4c), same artwork.
  ['6abd54ba88eaf67a370f246e', 'duplicate of the Mark & Map mug'],
]);

/** URL-safe, stable and readable. Em dashes drop out, "&" is spelled out. */
export function slugifyProduct(title: string): string {
  const s = title
    .toLowerCase()
    .replace(/[–—]/g, ' ')
    .replace(/&/g, ' and ')
    .replace(/['‘’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70)
    .replace(/-+$/, '');
  return s || 'product';
}

const SIZE_ORDER = ['XXS', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL', '6XL'];

/**
 * Printify returns variants in its own order ("Charcoal / L" before
 * "Charcoal / M"). Sort so the picker reads colour by colour, small to large.
 */
function sortVariants(variants: PrintifyVariant[]): PrintifyVariant[] {
  // Phone cases have no colour or size, just a model, and want their own order.
  if (isPhoneList(variants.map((v) => v.title))) {
    return [...variants].sort((a, b) => comparePhones(a.title, b.title));
  }

  // Two axes: colour first, black leading where it is offered, then sizes in
  // size order. The first colour is what the listing photo and the picker both
  // open on, and black is the one we want on the shelf.
  if (variants.length && variants.every((v) => v.title.includes(' / '))) {
    const sizeFirst = isSizeList([...new Set(variants.map((v) => v.title.split(' / ')[0].trim()))]);
    const colourSeen = new Map<string, number>();
    const sizeSeen = new Map<string, number>();
    for (const v of variants) {
      const c = colourOf(v.title, sizeFirst) ?? '';
      const z = sizeOf(v.title, sizeFirst) ?? '';
      if (!colourSeen.has(c)) colourSeen.set(c, colourSeen.size);
      if (!sizeSeen.has(z)) sizeSeen.set(z, sizeSeen.size);
    }
    // Black leads. Comfort Colors has no black, so its near-black Pepper
    // stands in rather than whichever colour Printify happens to list first.
    const PREFERRED = ['black', 'pepper'];
    const cRank = (c: string) => {
      const i = PREFERRED.indexOf(c.toLowerCase());
      return i >= 0 ? i - PREFERRED.length : (colourSeen.get(c) ?? 0);
    };
    const zRank = (z: string) => {
      const i = SIZE_ORDER.indexOf(z.toUpperCase());
      return i >= 0 ? i : 1000 + (sizeSeen.get(z) ?? 0);
    };
    return [...variants].sort((a, b) => {
      const ca = colourOf(a.title, sizeFirst) ?? '';
      const cb = colourOf(b.title, sizeFirst) ?? '';
      return cRank(ca) - cRank(cb) || zRank(sizeOf(a.title, sizeFirst) ?? '') - zRank(sizeOf(b.title, sizeFirst) ?? '');
    });
  }

  const headSeen = new Map<string, number>();
  const tailSeen = new Map<string, number>();
  const split = (title: string) => {
    const parts = title.split(' / ');
    return parts.length > 1
      ? { head: parts.slice(0, -1).join(' / '), tail: parts[parts.length - 1] }
      : { head: '', tail: title };
  };
  for (const v of variants) {
    const { head, tail } = split(v.title);
    if (!headSeen.has(head)) headSeen.set(head, headSeen.size);
    if (!tailSeen.has(tail)) tailSeen.set(tail, tailSeen.size);
  }
  const rank = (t: string) => {
    const i = SIZE_ORDER.indexOf(t.toUpperCase());
    return i >= 0 ? i : 1000 + (tailSeen.get(t) ?? 0);
  };
  return [...variants].sort((a, b) => {
    const A = split(a.title);
    const B = split(b.title);
    const byHead = (headSeen.get(A.head) ?? 0) - (headSeen.get(B.head) ?? 0);
    return byHead !== 0 ? byHead : rank(A.tail) - rank(B.tail);
  });
}

/**
 * The legend above the variant picker. Printify's own option names are
 * supplier-speak ("Gildan Colors", "Clothing sizes"), so normalise them.
 */
function optionsLabel(p: PrintifyProduct): string | null {
  const types = (p.options ?? []).map((o) => o.type);
  const hasColor = types.includes('color');
  const hasSize = types.includes('size');
  if (hasColor && hasSize) return 'Color and size';
  if (hasColor) return 'Color';
  // Printify files a phone case's model list under "size", so the picker read
  // "Size" above a list of iPhones.
  if (hasSize && p.variants.some((v) => /\b(iPhone|Galaxy|Pixel)\b/i.test(v.title))) {
    return 'Phone model';
  }
  if (hasSize) return 'Size';
  const first = (p.options ?? [])[0]?.name;
  return first ? first.replace(/\b\w/, (c) => c.toUpperCase()) : null;
}

const sameList = (a: string[], b: string[]) => a.length === b.length && a.every((x, i) => x === b[i]);

export async function syncPrintifyCatalogue({ dryRun = false } = {}): Promise<ImportReport> {
  const report: ImportReport = {
    ok: false,
    dryRun,
    fetched: 0,
    created: 0,
    updated: 0,
    unchanged: 0,
    deactivated: 0,
    skipped: 0,
    products: [],
    warnings: [],
  };

  if (!isPrintifyConfigured()) {
    return { ...report, error: 'Printify is not connected (PRINTIFY_API_TOKEN / PRINTIFY_SHOP_ID).' };
  }

  let remote: PrintifyProduct[];
  try {
    remote = await listPrintifyProducts();
  } catch (e) {
    return { ...report, error: `Could not reach Printify: ${e instanceof Error ? e.message : String(e)}` };
  }
  report.fetched = remote.length;
  if (remote.length === 0) {
    // A paging bug or a revoked token both look like "no products". Bailing out
    // beats deactivating the entire store.
    return { ...report, error: 'Printify returned no products. Refusing to deactivate the whole store.' };
  }

  const existing = await prisma.product.findMany({
    where: { printify_product_id: { not: null } },
    include: { variants: true },
  });
  const byPrintifyId = new Map(existing.map((p) => [p.printify_product_id!, p]));

  // Every slug already taken, so a new product can never collide - including
  // with products AAM ships itself, which have no printify_product_id.
  const takenSlugs = new Set((await prisma.product.findMany({ select: { slug: true } })).map((p) => p.slug));

  let nextSort = Math.max(0, ...existing.map((p) => p.sort));

  for (const p of remote) {
    const parts = titleParts(p.title);
    const excluded =
      EXCLUDE.get(p.id) ??
      HIDDEN_DESIGNS.get(parts.design) ??
      (parts.baseType ? HIDDEN_TYPES.get(parts.baseType) : undefined);
    const enabled = p.variants.filter((v) => v.is_enabled && v.is_available);
    const current = byPrintifyId.get(p.id);

    if (excluded || p.visible === false || enabled.length === 0) {
      const reason =
        excluded ?? (p.visible === false ? 'hidden in Printify' : 'no variants enabled and available');

      // It was live before, so take it down rather than leave a dead listing.
      if (current?.active) {
        if (!dryRun) {
          await prisma.product.update({ where: { id: current.id }, data: { active: false } });
          await prisma.productVariant.updateMany({ where: { product_id: current.id }, data: { active: false } });
        }
        report.deactivated++;
        report.products.push({
          action: 'deactivated',
          printify_product_id: p.id,
          name: p.title,
          slug: current.slug,
          category: current.category,
          price_cents: current.price_cents,
          variants: 0,
          images: 0,
          reason,
        });
      } else {
        report.skipped++;
        report.products.push({
          action: 'skipped',
          printify_product_id: p.id,
          name: p.title,
          slug: current?.slug ?? slugifyProduct(p.title),
          category: current?.category ?? guessCategory(p),
          price_cents: 0,
          variants: 0,
          images: 0,
          reason,
        });
      }
      continue;
    }

    const ordered = sortVariants(enabled);
    const enabledIds = new Set(enabled.map((v) => v.id));
    const price = Math.min(...enabled.map((v) => v.price));
    const override = (v: PrintifyVariant) => (v.price === price ? null : v.price);
    // Which photo set each Printify variant belongs to, so the gallery can
    // follow the colour (or the phone model) the shopper picks. Undefined when
    // every variant looks the same, e.g. an 11oz mug or sticker sizes.
    const axis = imageAxis(ordered.map((v) => ({ id: String(v.id), label: v.title })));
    const colours = axis
      ? new Map(
          ordered.flatMap((v): [number, string][] => {
            const k = axis.keyOf(v.title);
            return k ? [[v.id, k]] : [];
          }),
        )
      : undefined;
    const images = pickImages(p, enabledIds, colours);
    const description = descriptionToText(p.description);
    const category = guessCategory(p);
    const label = optionsLabel(p);

    if (images.length === 0) report.warnings.push(`${p.title}: no usable mockup images`);
    if (!description) report.warnings.push(`${p.title}: no description set in Printify`);

    let slug = current?.slug;
    if (!slug) {
      const base = slugifyProduct(p.title);
      slug = base;
      for (let n = 2; takenSlugs.has(slug); n++) slug = `${base}-${n}`;
      takenSlugs.add(slug);
    }

    const fields = {
      name: p.title,
      category,
      description,
      price_cents: price,
      images,
      options_label: label,
      active: true,
    };

    let productId = current?.id ?? '';
    let action: ImportAction;

    if (!current) {
      action = 'created';
      report.created++;
      if (!dryRun) {
        const made = await prisma.product.create({
          data: { ...fields, slug, printify_product_id: p.id, sort: ++nextSort },
          select: { id: true },
        });
        productId = made.id;
      }
    } else {
      const productChanged =
        current.name !== fields.name ||
        current.category !== fields.category ||
        current.description !== fields.description ||
        current.price_cents !== fields.price_cents ||
        current.options_label !== fields.options_label ||
        !current.active ||
        !sameList(current.images, images);

      // Variant drift counts too: a new colour, or a price bump on 3XL, leaves
      // the product row itself identical.
      const liveVariants = current.variants.filter((v) => v.active);
      const variantsChanged =
        liveVariants.length !== ordered.length ||
        ordered.some((v, i) => {
          const row = current.variants.find((x) => x.printify_variant_id === v.id);
          return !row || !row.active || row.label !== v.title || row.price_cents !== override(v) || row.sort !== i;
        });

      action = productChanged || variantsChanged ? 'updated' : 'unchanged';
      if (action === 'updated') {
        report.updated++;
        if (!dryRun) await prisma.product.update({ where: { id: current.id }, data: fields });
      } else {
        report.unchanged++;
      }
    }

    if (!dryRun && productId && action !== 'unchanged') {
      for (const [i, v] of ordered.entries()) {
        const data = {
          label: v.title,
          price_cents: override(v),
          stock: null, // printed to order, never counted
          active: true,
          sort: i,
        };
        const row = current?.variants.find((x) => x.printify_variant_id === v.id);
        if (row) await prisma.productVariant.update({ where: { id: row.id }, data });
        else
          await prisma.productVariant.create({
            data: { ...data, product_id: productId, printify_variant_id: v.id },
          });
      }
      // Colours and sizes switched off in Printify stop being orderable but stay
      // attached to the old orders that bought them.
      const gone = (current?.variants ?? []).filter(
        (x) => x.printify_variant_id !== null && !enabledIds.has(x.printify_variant_id),
      );
      if (gone.length) {
        await prisma.productVariant.updateMany({
          where: { id: { in: gone.map((x) => x.id) } },
          data: { active: false },
        });
      }
    }

    report.products.push({
      action,
      printify_product_id: p.id,
      name: p.title,
      slug,
      category,
      price_cents: price,
      variants: ordered.length,
      images: images.length,
    });
  }

  // Anything in our table that Printify no longer lists at all.
  const remoteIds = new Set(remote.map((p) => p.id));
  for (const row of existing) {
    if (remoteIds.has(row.printify_product_id!) || !row.active) continue;
    if (!dryRun) {
      await prisma.product.update({ where: { id: row.id }, data: { active: false } });
      await prisma.productVariant.updateMany({ where: { product_id: row.id }, data: { active: false } });
    }
    report.deactivated++;
    report.products.push({
      action: 'deactivated',
      printify_product_id: row.printify_product_id!,
      name: row.name,
      slug: row.slug,
      category: row.category,
      price_cents: row.price_cents,
      variants: 0,
      images: 0,
      reason: 'no longer in Printify',
    });
  }

  report.ok = true;
  return report;
}

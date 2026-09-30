import 'server-only';
import { randomInt } from 'crypto';
import prisma from './prisma';

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
    select: { category: true, images: true },
  });
  const out: Record<string, { image: string; count: number }> = {};
  for (const p of products) {
    const entry = out[p.category] ?? { image: '', count: 0 };
    entry.count += 1;
    if (!entry.image && p.images[0]) entry.image = p.images[0];
    out[p.category] = entry;
  }
  return out;
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

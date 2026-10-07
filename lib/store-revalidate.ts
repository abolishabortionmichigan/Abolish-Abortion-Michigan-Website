import 'server-only';
import { revalidatePath } from 'next/cache';
import { STORE_CATEGORIES } from './store-categories';

/**
 * The store pages are ISR with `revalidate = 3600`, so a catalogue change is
 * invisible for up to an hour unless the paths are purged. Call this after any
 * write that changes what a shopper sees.
 */
export function revalidateStore(slugs: string[] = []) {
  revalidatePath('/store');
  for (const c of STORE_CATEGORIES) revalidatePath(`/store/${c.slug}`);
  for (const slug of new Set(slugs)) revalidatePath(`/store/product/${slug}`);
  revalidatePath('/sitemap.xml');
}

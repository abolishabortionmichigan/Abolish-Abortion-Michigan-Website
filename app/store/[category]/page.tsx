import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ViewCartBar from '@/components/store/ViewCartBar';
import CTABanner from '@/components/CTABanner';
import ProductCard from '@/components/store/ProductCard';
import {
  STORE_CATEGORIES,
  getGroupsByCategory,
  isStoreCategory,
  priceRange,
  storeCategory,
} from '@/lib/store';

export const revalidate = 3600;

export function generateStaticParams() {
  return STORE_CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const c = storeCategory(category);
  if (!c) return { title: 'Not found' };
  return {
    title: c.title,
    description: c.body,
    alternates: { canonical: `/store/${c.slug}` },
  };
}

export default async function StoreCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  if (!isStoreCategory(category)) notFound();
  const c = storeCategory(category)!;
  const groups = await getGroupsByCategory(category);

  return (
    <>
      <section className="bg-[#1a1a1a] text-white py-20 md:py-28">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black mb-4">{c.title}</h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.2em] uppercase text-gray-300">{c.tagline}</p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Store', href: '/store' }, { label: c.title }]} />
      <ViewCartBar />

      <section className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <p className="mb-10 max-w-3xl text-lg text-gray-700">{c.body}</p>

          {groups.length === 0 ? (
            <div className="rounded-lg border border-gray-200 px-6 py-12 text-center">
              <h2 className="text-xl font-bold text-gray-900">Nothing here yet</h2>
              <p className="mt-2 text-gray-600">
                We are still adding to this section. Check back soon, or{' '}
                <Link href="/store" className="text-red-700 underline">
                  browse the rest of the store
                </Link>
                .
              </p>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-5 lg:grid-cols-4">
              {groups.map((g) => {
                const p = g.lead;
                const [from, to] = priceRange(p);
                // Only a variant with tracked stock can be sold out. Untracked
                // (null) stock means print-on-demand, which never runs out.
                const soldOut =
                  p.variants.length > 0 && p.variants.every((v) => v.stock !== null && v.stock <= 0);
                return (
                  <li key={g.key}>
                    <ProductCard
                      slug={p.slug}
                      name={g.type}
                      image={p.images[0] ?? null}
                      priceFrom={from}
                      priceTo={to}
                      soldOut={soldOut}
                      designCount={g.count}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      <CTABanner />
    </>
  );
}

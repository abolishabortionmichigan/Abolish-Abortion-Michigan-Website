import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ImageOff } from 'lucide-react';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import { STORE_CATEGORIES, getCategoryCovers } from '@/lib/store';
import { isStripeConfigured } from '@/lib/stripe';

export const metadata: Metadata = {
  title: 'Store',
  description:
    'Clothing, stickers, signs and materials to help Michigan Christians speak plainly about abolition. Every purchase supports the work.',
  alternates: { canonical: '/store' },
};

// Products change rarely and are edited through the admin, which revalidates.
export const revalidate = 3600;

export default async function StorePage() {
  const covers = await getCategoryCovers();
  const open = isStripeConfigured();

  return (
    <>
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">AAM</span>{' '}
            <span className="font-black">STORE</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">
            Wear it. Post it. Hand it to someone.
          </p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Store' }]} />

      <section className="bg-white py-12">
        <div className="max-w-5xl mx-auto px-4">
          <p className="text-lg text-gray-700 mb-10 max-w-3xl">
            Every item here exists to start a conversation. Most are printed to order, so they ship
            directly from the printer to you. Purchases support the work of abolishing abortion in
            Michigan.
          </p>

          {!open && (
            <p className="mb-8 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900">
              The store is not open for orders yet. You can browse what is coming.
            </p>
          )}

          <ul className="grid gap-6 sm:grid-cols-2">
            {STORE_CATEGORIES.map((c) => {
              const cover = covers[c.slug];
              return (
                <li key={c.slug}>
                  <Link
                    href={`/store/${c.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-lg bg-[#1a1a1a] transition-shadow hover:shadow-lg"
                  >
                    <div className="relative aspect-[16/9] bg-[#2a2a2a]">
                      {cover?.image ? (
                        <Image
                          src={cover.image}
                          alt=""
                          fill
                          sizes="(min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center">
                          <ImageOff className="h-12 w-12 text-gray-600" aria-hidden="true" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <h2 className="text-2xl font-bold text-white group-hover:text-red-500">
                        {c.title}
                      </h2>
                      <p className="mt-1 text-sm uppercase tracking-wide text-red-500">{c.tagline}</p>
                      <p className="mt-3 flex-1 text-gray-300">{c.body}</p>
                      <p className="mt-4 font-semibold text-white">
                        {c.cta}{' '}
                        <span aria-hidden="true">&rarr;</span>
                        {cover?.count ? (
                          <span className="ml-2 text-sm font-normal text-gray-400">
                            {cover.count} item{cover.count === 1 ? '' : 's'}
                          </span>
                        ) : null}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

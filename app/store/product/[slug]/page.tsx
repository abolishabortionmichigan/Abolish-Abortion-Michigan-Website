import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';
import AddToCart from '@/components/store/AddToCart';
import ProductGallery from '@/components/store/ProductGallery';
import { getProductBySlug, priceRange, storeCategory } from '@/lib/store';
import { SITE_URL } from '@/lib/site';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProductBySlug(slug);
  if (!p) return { title: 'Not found' };
  return {
    title: p.name,
    description: p.description.slice(0, 160),
    alternates: { canonical: `/store/product/${p.slug}` },
    openGraph: {
      title: p.name,
      description: p.description.slice(0, 160),
      type: 'website',
      url: `${SITE_URL}/store/product/${p.slug}`,
      ...(p.images[0] ? { images: [p.images[0]] } : {}),
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = storeCategory(product.category);
  const [from, to] = priceRange(product);
  const inStock =
    product.variants.length === 0 || product.variants.some((v) => v.stock === null || v.stock > 0);

  // Product schema. offers uses a range when variants are priced differently.
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    ...(product.images.length ? { image: product.images } : {}),
    brand: { '@type': 'Brand', name: 'Abolish Abortion Michigan' },
    offers:
      from === to
        ? {
            '@type': 'Offer',
            price: (from / 100).toFixed(2),
            priceCurrency: 'USD',
            availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `${SITE_URL}/store/product/${product.slug}`,
          }
        : {
            '@type': 'AggregateOffer',
            lowPrice: (from / 100).toFixed(2),
            highPrice: (to / 100).toFixed(2),
            priceCurrency: 'USD',
            offerCount: product.variants.length,
            availability: inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
            url: `${SITE_URL}/store/product/${product.slug}`,
          },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Store', href: '/store' },
          ...(category ? [{ label: category.title, href: `/store/${category.slug}` }] : []),
          { label: product.name },
        ]}
      />

      <section className="bg-white py-10 md:py-14">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2">
          <ProductGallery images={product.images} name={product.name} />

          <div>
            <h1 className="mb-4 text-3xl font-black text-gray-900 md:text-4xl">{product.name}</h1>

            <AddToCart
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price_cents: product.price_cents,
                image: product.images[0] ?? null,
                options_label: product.options_label,
                variants: product.variants.map((v) => ({
                  id: v.id,
                  label: v.label,
                  price_cents: v.price_cents,
                  stock: v.stock,
                })),
              }}
            />

            <div className="mt-8 border-t border-gray-200 pt-6">
              <h2 className="mb-2 text-lg font-bold text-gray-900">About this item</h2>
              <p className="whitespace-pre-line text-gray-700">{product.description}</p>
            </div>

            <p className="mt-6 text-sm text-gray-500">
              Most items are printed to order and ship directly from the printer.{' '}
              <Link href="/shipping-returns" className="underline underline-offset-2 hover:text-red-700">
                Shipping and returns
              </Link>
            </p>
          </div>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

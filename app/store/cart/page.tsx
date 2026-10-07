import type { Metadata } from 'next';
import Breadcrumbs from '@/components/Breadcrumbs';
import CartView from '@/components/store/CartView';
import { isStripeConfigured, SHIPPING } from '@/lib/stripe';

export const metadata: Metadata = {
  title: 'Your cart',
  description: 'Review the items in your cart and check out securely.',
  alternates: { canonical: '/store/cart' },
  // A personal cart has nothing to index and should never appear in search.
  robots: { index: false, follow: true },
};

export default async function CartPage({
  searchParams,
}: {
  searchParams: Promise<{ cancelled?: string }>;
}) {
  const { cancelled } = await searchParams;

  return (
    <>
      <Breadcrumbs items={[{ label: 'Store', href: '/store' }, { label: 'Cart' }]} />

      <section className="bg-white py-10 md:py-14">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="mb-8 text-3xl font-black text-gray-900 md:text-4xl">Your cart</h1>
          <CartView
            checkoutOpen={isStripeConfigured()}
            shippingFlatCents={SHIPPING.flatCents}
            freeOverCents={SHIPPING.freeOverCents}
            cancelled={cancelled === '1'}
          />
        </div>
      </section>
    </>
  );
}

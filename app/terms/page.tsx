import { Metadata } from 'next';
import Link from 'next/link';
import Breadcrumbs from '@/components/Breadcrumbs';
import CTABanner from '@/components/CTABanner';

export const metadata: Metadata = {
  title: 'Terms of Sale',
  description:
    'The terms you agree to when you buy from the Abolish Abortion Michigan store — pricing, payment, print-to-order fulfilment, delivery, returns and contact.',
  alternates: { canonical: '/terms' },
};

/*
 * Terms of Sale for the store. Uses .article-body, not the prose-* classes:
 * @tailwindcss/typography is NOT installed, so every prose-* class on this
 * site is a silent no-op and the page would render unstyled.
 */
export default function TermsPage() {
  return (
    <>
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Terms of</span>{' '}
            <span className="font-black">SALE</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">
            Last updated: October 2026
          </p>
        </div>
      </section>

      <Breadcrumbs items={[{ label: 'Terms of Sale' }]} />

      <section className="bg-white py-16">
        <div className="article-body max-w-3xl mx-auto px-4">
          <p>
            These terms apply to orders placed through the Abolish Abortion Michigan store. By
            placing an order you agree to them. They sit alongside our{' '}
            <Link href="/privacy-policy">Privacy Policy</Link> and{' '}
            <Link href="/shipping-returns">Shipping &amp; Returns</Link> page.
          </p>

          <h2>Who you are buying from</h2>
          <p>
            The store is operated by Abolish Abortion Michigan, a Michigan non-profit. Purchases
            support the work of abolishing abortion in Michigan. A purchase is not a tax-deductible
            donation; if you want to give, use the{' '}
            <Link href="/donate">donate page</Link> instead.
          </p>

          <h2>Prices and payment</h2>
          <p>
            Prices are in US dollars and are shown before tax and delivery. Michigan sales tax is
            calculated at checkout where it applies. Payment is taken by Stripe; we never see or
            store your card details.
          </p>
          <p>
            We try to keep prices accurate, but if an item is listed at the wrong price we will
            contact you before charging you and you may cancel.
          </p>

          <h2>Printed to order</h2>
          <p>
            Almost everything in the store is printed to order by a print partner and shipped
            directly to you. Nothing is held in stock. Because each item is made for you after you
            order, production usually takes two to five business days before dispatch, and we
            cannot cancel or change an order once it has gone into production.
          </p>
          <p>
            Printed colours can differ slightly from what you see on screen, and garment sizing
            follows the manufacturer&apos;s own size chart rather than ours.
          </p>

          <h2>Delivery</h2>
          <p>
            Delivery costs are calculated at checkout from the real rate for your order. Delivery
            estimates are estimates, not guarantees. Risk passes to you on delivery. We currently
            ship within the United States only.
          </p>

          <h2>Damaged, faulty or wrong items</h2>
          <p>
            If an item arrives damaged, faulty, or is not what you ordered, email us within 30 days
            of delivery with your order number and a photograph and we will replace it or refund
            it. You do not need to return a faulty item unless we ask.
          </p>
          <p>
            Because items are made to order, we cannot accept returns simply because you changed
            your mind or ordered the wrong size. Please check the size chart before ordering. Full
            detail is on the <Link href="/shipping-returns">Shipping &amp; Returns</Link> page.
          </p>

          <h2>Your order</h2>
          <p>
            An order is an offer to buy. We accept it when we email your confirmation. We may
            decline an order — for example if an item is unavailable or we cannot ship to your
            address — and if we do, you will not be charged.
          </p>

          <h2>Designs and copyright</h2>
          <p>
            The designs, marks and wording on these products belong to Abolish Abortion Michigan or
            are used with permission. Buying an item does not transfer any right to reproduce the
            design. Please do not resell our products or reproduce the artwork commercially.
          </p>

          <h2>Limits</h2>
          <p>
            Nothing here limits any right you have under Michigan or federal consumer law. Beyond
            those rights, our liability for any order is limited to what you paid for it.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about an order, or anything on this page, go through the{' '}
            <Link href="/contact">contact page</Link>. Quote your order number
            (it looks like AAM-XXXXXX) and we will get back to you.
          </p>

          <p className="text-sm text-gray-500">
            These terms are governed by the laws of the State of Michigan.
          </p>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

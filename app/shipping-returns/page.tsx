import { Metadata } from 'next';
import Link from 'next/link';
import CTABanner from '@/components/CTABanner';
import { SHIPPING } from '@/lib/stripe';
import { formatMoney } from '@/lib/format';

export const metadata: Metadata = {
  title: 'Shipping & Returns',
  description:
    'How orders from the Abolish Abortion Michigan store are printed, shipped, and returned, and how to reach us about a problem with an order.',
  alternates: { canonical: '/shipping-returns' },
};

/*
 * Linked from every product page and the cart, so it must exist before the
 * store goes live. The shipping figures are read from the same SHIPPING
 * constant checkout uses, so this page cannot drift from what buyers are
 * actually charged.
 */
export default function ShippingReturnsPage() {
  const flat = formatMoney(SHIPPING.flatCents);
  const freeOver = formatMoney(SHIPPING.freeOverCents);

  return (
    <>
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Shipping &amp;</span>{' '}
            <span className="font-black">RETURNS</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">
            Last Updated: September 2026
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-3xl mx-auto px-4 article-body">
          <h2>How your order is made</h2>
          <p>
            Almost everything in our store is printed to order. Nothing sits in a warehouse
            waiting: when you place an order, the item is produced for you by our print
            partner and shipped directly from their facility. That keeps our costs down so
            more of what you spend goes toward the work of abolition, and it means we are
            never sitting on unsold stock.
          </p>
          <p>
            It also means orders take a little longer to arrive than they would from a large
            retailer, because the item has to be made first.
          </p>

          <h2>Shipping costs</h2>
          <ul>
            <li>
              Flat rate of <strong>{flat}</strong> per order, however many items it contains.
            </li>
            {SHIPPING.freeOverCents > 0 && (
              <li>
                <strong>Free shipping</strong> on orders of {freeOver} or more.
              </li>
            )}
            <li>We currently ship within the United States only.</li>
          </ul>
          <p>
            The exact shipping charge is shown in your cart and again on the payment page
            before you are charged. There are no handling fees or surcharges added afterward.
          </p>

          <h2>How long it takes</h2>
          <p>
            Two separate steps, and the total is the sum of both:
          </p>
          <ul>
            <li>
              <strong>Production</strong> — typically 2 to 7 business days for the item to be
              printed and packed.
            </li>
            <li>
              <strong>Delivery</strong> — typically 3 to 7 business days in transit once it
              has shipped.
            </li>
          </ul>
          <p>
            These are estimates from our print partner, not guarantees. Orders placed around
            major holidays, and larger orders, can take longer. As soon as your order ships we
            will email you a tracking number.
          </p>

          <h2>Tracking your order</h2>
          <p>
            You will get two emails: one confirming your order, and one when it ships, with
            tracking. The confirmation email also contains a link to your order, where the
            current status and any tracking number are shown. If the shipping email has not
            arrived and it has been more than ten business days, contact us and we will find
            out what happened.
          </p>

          <h2>Damaged, defective, or wrong items</h2>
          <p>
            If your order arrives damaged, misprinted, or is simply not what you ordered, we
            will put it right — a replacement or a refund, whichever you prefer. There is no
            charge to you and you do not need to ship the item back.
          </p>
          <p>
            Please contact us <strong>within 30 days of delivery</strong> and include your
            order number and a photograph of the problem. The photograph matters: it is what
            our print partner needs to approve a reprint, and it means we can usually resolve
            it the same day.
          </p>

          <h2>Returns and exchanges</h2>
          <p>
            Because each item is printed specifically for you, we cannot accept returns or
            exchanges for a change of mind, or because a garment did not fit the way you
            expected. Nothing we could do with a returned item would recover the cost, and we
            would rather be plain about that than quietly refuse you later.
          </p>
          <p>
            So please check the size guide on the product page before ordering. If you are
            between sizes or unsure, email us first and we will help you choose — we would far
            rather spend five minutes on that than have you end up with something you cannot
            wear.
          </p>

          <h2>Wrong address</h2>
          <p>
            If an order is returned to our print partner because the address was incomplete or
            incorrect, we will contact you and can reship it once you confirm the correct
            address. Reshipping costs the flat shipping rate again, since the first shipment
            was already paid for and sent.
          </p>
          <p>
            If you spot a mistake in your address, contact us immediately. Before the item
            goes into production we can usually correct it; once it has shipped we cannot.
          </p>

          <h2>Cancelling an order</h2>
          <p>
            Contact us as soon as you can. If the item has not yet gone into production we can
            cancel it and refund you in full. Once printing has started the item exists and
            cannot be unmade, so at that point the damaged-or-defective terms above are what
            apply.
          </p>

          <h2>Where your money goes</h2>
          <p>
            Store purchases are <strong>not tax-deductible donations</strong>. You are buying a
            product, and you receive goods in exchange, so the payment does not qualify as a
            charitable contribution. Any surplus after production and shipping costs supports
            our work in Michigan.
          </p>
          <p>
            If you want to give rather than buy, the{' '}
            <Link href="/donate">donate page</Link> is the place to do it, and those gifts are
            tax-deductible to the fullest extent allowed by law. Our{' '}
            <Link href="/financial-transparency">financial disclosures</Link> are public.
          </p>

          <h2>Contact us</h2>
          <p>
            Email{' '}
            <a href="mailto:admin@abolishabortionmichigan.com">
              admin@abolishabortionmichigan.com
            </a>{' '}
            or use the <Link href="/contact">contact form</Link>. Please include your order
            number — it starts with <strong>AAM-</strong> and is in your confirmation email —
            so we can find your order straight away.
          </p>
          <p>
            Abolish Abortion Michigan
            <br />
            3665 S Lakeshore Dr, Suite 4
            <br />
            St Joseph, MI 49085
          </p>
        </div>
      </section>

      <CTABanner />
    </>
  );
}

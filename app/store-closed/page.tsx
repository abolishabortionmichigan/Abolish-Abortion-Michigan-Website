import { Metadata } from 'next';
import Link from 'next/link';

/*
 * The holding page the public gets on storefront URLs while
 * NEXT_PUBLIC_STORE_HIDDEN is set. proxy.ts REWRITES to it, so a visitor keeps
 * the URL they asked for and gets a 200 rather than a redirect.
 *
 * noindex because the same body answers for all ~700 storefront URLs and none
 * of them should be in an index under this content. robots.txt also disallows
 * /store while hidden, which is what actually keeps crawlers off; this is the
 * backstop for anything that fetches a store URL anyway.
 *
 * Not linked from anywhere -- it is only ever reached through that rewrite.
 */
export const metadata: Metadata = {
  title: 'Store Opening Soon',
  robots: { index: false, follow: true },
};

export default function StoreClosedPage() {
  return (
    <>
      <section className="bg-[#1a1a1a] text-white py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl mb-6">
            <span className="font-light">Store</span>{' '}
            <span className="font-black">OPENING SOON</span>
          </h1>
          <div className="w-12 h-[3px] bg-red-600 mx-auto mb-6" />
          <p className="text-sm md:text-base tracking-[0.3em] uppercase text-gray-300">
            Final Testing
          </p>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-lg text-gray-700">
            We&apos;re putting the finishing touches on the shop. It isn&apos;t open to orders
            yet — check back shortly.
          </p>
          <p className="mt-4 text-gray-700">
            In the meantime, the work itself doesn&apos;t wait. Sign the petition calling for
            equal protection for the preborn in Michigan, or see where your own lawmakers stand.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/the-petition"
              className="w-full sm:w-auto bg-red-700 px-8 py-4 text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-red-800"
            >
              Sign the Petition
            </Link>
            <Link
              href="/legislators"
              className="w-full sm:w-auto border-2 border-[#1a1a1a] px-8 py-4 text-sm font-bold uppercase tracking-widest text-[#1a1a1a] transition-colors hover:bg-[#1a1a1a] hover:text-white"
            >
              Legislator Scorecard
            </Link>
          </div>

          <p className="mt-10 text-sm text-gray-500">
            Already placed an order? Your confirmation link still works, and your order is
            unaffected.{' '}
            <Link href="/contact" className="underline underline-offset-2 hover:text-red-700">
              Get in touch
            </Link>{' '}
            if you need anything.
          </p>
        </div>
      </section>
    </>
  );
}

import Script from 'next/script';

/**
 * Loads the Google Ads global site tag (gtag.js) if NEXT_PUBLIC_GOOGLE_ADS_ID
 * is configured in Vercel. No-op otherwise, so the site is unaffected before
 * Ad Grants is activated.
 *
 * Uses next/script with `strategy="afterInteractive"` so it never blocks
 * page LCP — same principle as the PostHog lazy init.
 *
 * Conversion events are fired via `fireAdsConversion(action)` from
 * lib/google-ads.ts at each conversion touchpoint.
 */
export default function GoogleAdsScript() {
  const adsId = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;
  if (!adsId) return null;

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${adsId}`}
      />
      <Script id="google-ads-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${adsId}');
        `}
      </Script>
    </>
  );
}

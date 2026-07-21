import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PostHogProvider } from "@/components/PostHogProvider";
import GoogleTagScript from "@/components/GoogleTagScript";
import { socialLinks } from "@/lib/content";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://abolishabortionmichigan.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Abolish Abortion Michigan",
    template: "%s | Abolish Abortion Michigan",
  },
  description: "Abolish Abortion Michigan — Christian abolitionists working for the immediate and total end of abortion in the state. No exceptions, no compromise, no delay.",
  keywords: ["abolish abortion", "Michigan", "pro-life", "abolition", "end abortion"],
  verification: {
    // Set NEXT_PUBLIC_GSC_VERIFICATION in Vercel to the code Google Search
    // Console provides. Falsy value → verification meta tag simply omitted.
    google: process.env.NEXT_PUBLIC_GSC_VERIFICATION || undefined,
    // Bing Webmaster Tools: same idea, `msvalidate.01` meta tag.
    // Set NEXT_PUBLIC_BING_VERIFICATION to the code Bing provides.
    other: process.env.NEXT_PUBLIC_BING_VERIFICATION
      ? { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_VERIFICATION }
      : undefined,
  },
  openGraph: {
    // No static `title` here — Next merges per-page `title` (plus template)
    // into openGraph.title automatically, so /donate shares as "Donate | ..."
    // rather than the generic site name.
    description: "Dedicated to the immediate and total abolition of human abortion in Michigan.",
    type: "website",
    locale: "en_US",
    siteName: "Abolish Abortion Michigan",
  },
  twitter: {
    card: "summary_large_image",
    description: "Dedicated to the immediate and total abolition of human abortion in Michigan.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">

      <head>
        <link rel="alternate" type="application/rss+xml" title="Abolish Abortion Michigan - News" href="/feed.xml" />
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://www.zeffy.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://www.zeffy.com" />
        {/* rel=me identity verification — tells Google/Mastodon/etc. that AAM
            owns these social profiles. Backs the Knowledge Panel `sameAs`. */}
        <link rel="me" href={socialLinks.facebook} />
        <link rel="me" href={socialLinks.x} />
        <link rel="me" href={socialLinks.instagram} />
      </head>
      <body className={`${montserrat.variable} font-sans antialiased min-h-screen flex flex-col`}>
        <PostHogProvider>
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-red-600 focus:text-white focus:font-bold focus:rounded"
          >
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer />
          <Analytics />
          <SpeedInsights />
          <GoogleTagScript />
        </PostHogProvider>
      </body>
    </html>
  );
}

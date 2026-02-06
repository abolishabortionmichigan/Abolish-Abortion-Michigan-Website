import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
  description: "Abolish Abortion Michigan is dedicated to the immediate and total abolition of human abortion in the state of Michigan.",
  keywords: ["abolish abortion", "Michigan", "pro-life", "abolition", "end abortion"],
  openGraph: {
    title: "Abolish Abortion Michigan",
    description: "Dedicated to the immediate and total abolition of human abortion in Michigan.",
    type: "website",
    locale: "en_US",
    siteName: "Abolish Abortion Michigan",
  },
  twitter: {
    card: "summary_large_image",
    title: "Abolish Abortion Michigan",
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
        <link rel="preconnect" href="https://www.youtube.com" />
        <link rel="preconnect" href="https://www.zeffy.com" />
        <link rel="dns-prefetch" href="https://www.youtube.com" />
        <link rel="dns-prefetch" href="https://www.zeffy.com" />
      </head>
      <body className={`${montserrat.variable} font-sans antialiased min-h-screen flex flex-col`}>
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
      </body>
    </html>
  );
}

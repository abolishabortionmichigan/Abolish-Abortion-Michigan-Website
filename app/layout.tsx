import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Abolish Abortion Michigan",
  description: "Abolish Abortion Michigan is dedicated to the immediate and total abolition of human abortion in the state of Michigan.",
  keywords: ["abolish abortion", "Michigan", "pro-life", "abolition", "end abortion"],
  openGraph: {
    title: "Abolish Abortion Michigan",
    description: "Dedicated to the immediate and total abolition of human abortion in Michigan.",
    type: "website",
    locale: "en_US",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

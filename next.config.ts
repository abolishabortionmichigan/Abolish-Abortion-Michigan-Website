import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const securityHeaders = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
  {
    key: 'Content-Security-Policy',
    // connect-src includes both self (for the PostHog /ingest rewrite) and
    // Sentry's ingest hosts. script/img/font retain their previous scope.
    value: "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https: https://*.ingest.sentry.io https://*.ingest.us.sentry.io; frame-src 'self' https://www.youtube.com https://www.zeffy.com; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
  },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'same-origin' },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // PostHog's `/decide` and other endpoints use trailing slashes that Next
  // would otherwise 308 to a non-trailing form, breaking the client.
  skipTrailingSlashRedirect: true,
  async redirects() {
    return [
      { source: '/petition', destination: '/the-petition', permanent: true },
    ];
  },
  async rewrites() {
    // PostHog reverse-proxy so its script/api load from our origin (dodges
    // most ad-blockers, keeps CSP tight, and lets us cache the static
    // recorder bundle for a year — same pattern as MRA).
    return [
      { source: '/ingest/static/:path*', destination: 'https://us-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/array/:path*', destination: 'https://us-assets.i.posthog.com/array/:path*' },
      { source: '/ingest/:path*', destination: 'https://us.i.posthog.com/:path*' },
    ];
  },
  async headers() {
    return [
      {
        // PostHog's proxied static assets are version-pinned via ?v=, so safe
        // to cache immutably for a year; a PostHog upgrade busts the URL.
        source: '/ingest/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'abolishabortionmichigan.com',
      },
      {
        protocol: 'https',
        hostname: '*.abolishabortionmichigan.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '*.googleapis.com',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default withSentryConfig(nextConfig, {
  // Sentry org/project. Update these to your Sentry project once created.
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  // Only log source-map upload output in CI (Vercel build)
  silent: !process.env.CI,
  // Widen source-map upload so stack traces resolve to real code
  widenClientFileUpload: true,
  webpack: {
    // Strip Sentry's own debug logger calls from client bundles
    treeshake: { removeDebugLogging: true },
  },
});

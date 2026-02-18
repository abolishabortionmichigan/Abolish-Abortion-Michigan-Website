import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
  process.env.NEXT_PUBLIC_SITE_URL || 'https://abolishabortionmichigan.com',
  'http://localhost:3000',
  'http://localhost:3001',
];

/**
 * Validates the Origin header on state-changing requests (POST, PATCH, DELETE, PUT).
 * Returns a 403 response if the origin is invalid, or null if the request is allowed.
 * GET/HEAD requests are always allowed (they should be idempotent).
 */
export function validateCsrf(request: NextRequest): NextResponse | null {
  const method = request.method.toUpperCase();

  // Safe methods don't need CSRF validation
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return null;
  }

  const origin = request.headers.get('origin');

  // If no origin header, check referer as fallback
  if (!origin) {
    const referer = request.headers.get('referer');
    if (referer) {
      try {
        const refererOrigin = new URL(referer).origin;
        if (ALLOWED_ORIGINS.some((allowed) => refererOrigin === new URL(allowed).origin)) {
          return null;
        }
      } catch {
        // Invalid referer URL
      }
    }
    // No origin or referer — allow for non-browser clients (curl, mobile apps)
    // SameSite cookies already block cross-site browser requests
    return null;
  }

  // Check if origin is allowed
  if (ALLOWED_ORIGINS.some((allowed) => {
    try {
      return origin === new URL(allowed).origin;
    } catch {
      return false;
    }
  })) {
    return null;
  }

  // Vercel preview deployments (project-specific only)
  if (
    origin.endsWith('.vercel.app') &&
    new URL(origin).hostname.includes('abolish-abortion-michigan')
  ) {
    return null;
  }

  return NextResponse.json(
    { error: 'Forbidden: invalid origin' },
    { status: 403 }
  );
}

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { STORE_HIDDEN, isStorePath, isGatedStorePath } from '@/lib/store-visibility';

export const config = {
  matcher: ['/admin/:path*', '/store', '/store/:path*'],
};

/** True only for a valid, unexpired admin token. Fails closed. */
function hasAdminToken(request: NextRequest): boolean {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) return false;
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) return false;
    const decoded = jwt.verify(token, secret) as { role?: string };
    return decoded.role === 'admin';
  } catch {
    return false;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  /*
   * Storefront. Rewritten rather than redirected, so the URL the visitor
   * typed stays put and the response is a plain 200 holding page instead of a
   * bounce to the homepage. Admins fall straight through to the real store.
   *
   * Handled before the admin branch below and always returns, because a store
   * path must never reach that branch -- it would send shoppers to the admin
   * login page.
   */
  if (isStorePath(pathname)) {
    if (!STORE_HIDDEN) return NextResponse.next();
    if (!isGatedStorePath(pathname)) return NextResponse.next();
    if (hasAdminToken(request)) return NextResponse.next();
    return NextResponse.rewrite(new URL('/store-closed', request.url));
  }

  const token = request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/manage-7x9k', request.url));
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret || secret.length < 32) {
      return NextResponse.redirect(new URL('/manage-7x9k', request.url));
    }

    const decoded = jwt.verify(token, secret) as { role?: string };
    if (decoded.role !== 'admin') {
      return NextResponse.redirect(new URL('/manage-7x9k', request.url));
    }

    return NextResponse.next();
  } catch {
    // Token is invalid or expired - clear it and redirect
    const response = NextResponse.redirect(new URL('/manage-7x9k', request.url));
    response.cookies.set('auth_token', '', {
      path: '/',
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
    });
    return response;
  }
}

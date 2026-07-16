'use server';

import { headers } from 'next/headers';
import { getAuthToken, verifyToken } from './auth-actions';
import { checkRateLimitStrict } from '@/lib/rate-limit';
import { getClientIpFromHeaders } from '@/lib/client-ip';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function verifyPin(
  pin: string
): Promise<{ valid: true } | { valid: false; error: string }> {
  const admin = await isAdmin();
  if (!admin) {
    return { valid: false, error: 'Authentication required' };
  }

  const adminPin = process.env.ADMIN_PIN;
  if (!adminPin) {
    return { valid: false, error: 'Admin PIN is not configured. Set ADMIN_PIN in environment variables.' };
  }

  const hdrs = await headers();
  const ip = getClientIpFromHeaders(hdrs);
  const limit = await checkRateLimitStrict(`pin:${ip}`, 5);
  if (!limit.allowed) {
    return { valid: false, error: `Too many attempts. Try again in ${limit.retryAfterSeconds} seconds.` };
  }

  if (pin === adminPin) {
    return { valid: true };
  }

  return { valid: false, error: 'Incorrect PIN' };
}

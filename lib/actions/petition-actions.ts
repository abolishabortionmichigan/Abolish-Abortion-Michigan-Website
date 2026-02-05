'use server';

import { PetitionSignature } from '@/types';
import {
  getAllSignatures,
  getSignatureCount,
  createSignature,
  hasAlreadySigned,
  deleteSignature as deleteSignatureData,
} from '@/lib/data/petition-store';
import { headers } from 'next/headers';
import { getAuthToken, verifyToken } from './auth-actions';
import { checkRateLimit } from '@/lib/rate-limit';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function getPublicSignatureCount(): Promise<number> {
  return await getSignatureCount();
}

export async function fetchSignatures() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    return await getAllSignatures();
  } catch (error) {
    return { error: 'Failed to fetch signatures' };
  }
}

export async function signPetition(data: {
  name: string;
  email: string;
  city?: string;
  state?: string;
  zipcode?: string;
  subscribed?: boolean;
  website?: string;
}): Promise<PetitionSignature | { error: string }> {
  try {
    // Rate limit form submissions (10 per 15 min per IP)
    const hdrs = await headers();
    const ip = hdrs.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const limit = checkRateLimit(`petition:${ip}`, 10);
    if (!limit.allowed) {
      return { error: `Too many submissions. Try again in ${limit.retryAfterSeconds} seconds.` };
    }

    // Check honeypot field
    if (data.website) {
      // Silently pretend to succeed
      return {
        id: 'ok',
        name: data.name,
        email: data.email,
        state: data.state || 'MI',
        subscribed: data.subscribed || false,
        signed_at: new Date().toISOString(),
      } as PetitionSignature;
    }

    // Validate required fields
    if (!data.name || !data.email) {
      return { error: 'Name and email are required' };
    }

    // Validate input lengths
    if (data.name.length > 100) {
      return { error: 'Name must be 100 characters or less' };
    }
    if (data.email.length > 254) {
      return { error: 'Email must be 254 characters or less' };
    }
    if (data.city && data.city.length > 100) {
      return { error: 'City must be 100 characters or less' };
    }
    if (data.zipcode && data.zipcode.length > 10) {
      return { error: 'Zip code must be 10 characters or less' };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { error: 'Invalid email format' };
    }

    // Check if already signed
    if (await hasAlreadySigned(data.email)) {
      return { error: 'This email has already signed the petition' };
    }

    const newSignature = await createSignature({
      name: data.name,
      email: data.email,
      city: data.city,
      state: data.state || 'MI',
      zipcode: data.zipcode,
      subscribed: data.subscribed || false,
    });

    return newSignature;
  } catch (error) {
    return { error: 'Failed to sign petition' };
  }
}

export async function deleteSignature(id: string) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const deleted = await deleteSignatureData(id);

    if (!deleted) {
      return { error: 'Signature not found' };
    }

    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete signature' };
  }
}

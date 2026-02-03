'use server';

import { PetitionSignature } from '@/types';
import {
  getAllSignatures,
  getSignatureCount,
  createSignature,
  hasAlreadySigned,
  deleteSignature as deleteSignatureData,
} from '@/lib/data/petition-store';
import { getAuthToken, verifyToken } from './auth-actions';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function getPublicSignatureCount(): Promise<number> {
  return getSignatureCount();
}

export async function fetchSignatures() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    return getAllSignatures();
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
}): Promise<PetitionSignature | { error: string }> {
  try {
    // Validate required fields
    if (!data.name || !data.email) {
      return { error: 'Name and email are required' };
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      return { error: 'Invalid email format' };
    }

    // Check if already signed
    if (hasAlreadySigned(data.email)) {
      return { error: 'This email has already signed the petition' };
    }

    const newSignature = createSignature({
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

    const deleted = deleteSignatureData(id);

    if (!deleted) {
      return { error: 'Signature not found' };
    }

    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete signature' };
  }
}

'use server';

import {
  getSubscribedEmails,
  updateSubscriptionStatus,
  deleteSignature,
} from '@/lib/data/petition-store';
import { getAuthToken, verifyToken } from './auth-actions';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function fetchSubscribers() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    return await getSubscribedEmails();
  } catch (error) {
    return { error: 'Failed to fetch subscribers' };
  }
}

export async function unsubscribeUser(email: string) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const updated = await updateSubscriptionStatus(email, false);
    if (!updated) {
      return { error: 'Subscriber not found' };
    }

    return { success: true };
  } catch (error) {
    return { error: 'Failed to unsubscribe user' };
  }
}

export async function deleteSubscriber(id: string) {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const deleted = await deleteSignature(id);
    if (!deleted) {
      return { error: 'Subscriber not found' };
    }

    return { success: true };
  } catch (error) {
    return { error: 'Failed to delete subscriber' };
  }
}

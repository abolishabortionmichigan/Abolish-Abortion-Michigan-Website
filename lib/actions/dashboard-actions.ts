'use server';

import { getAuthToken, verifyToken } from './auth-actions';
import { getAllInquiries } from '@/lib/data/inquiry-store';
import { getAllNewsArticles } from '@/lib/data/news-store';
import { getSignatureCount } from '@/lib/data/petition-store';
import { DashboardStats } from '@/types';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function getDashboardStats(): Promise<DashboardStats | { error: string }> {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const inquiries = getAllInquiries();
    const newsArticles = getAllNewsArticles(false);
    const signatureCount = getSignatureCount();

    const stats: DashboardStats = {
      totalInquiries: inquiries.length,
      pendingInquiries: inquiries.filter((i) => i.status === 'pending').length,
      totalNews: newsArticles.length,
      totalSignatures: signatureCount,
    };

    return stats;
  } catch (error) {
    return { error: 'Failed to fetch dashboard stats' };
  }
}

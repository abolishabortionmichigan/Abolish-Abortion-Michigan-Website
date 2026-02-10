'use server';

import { getAuthToken, verifyToken } from './auth-actions';
import { getAllInquiries } from '@/lib/data/inquiry-store';
import { getAllNewsArticles } from '@/lib/data/news-store';
import { getAllSignatures, getSignatureCount, getSubscriberCount } from '@/lib/data/petition-store';
import { getAllGalleryPhotos, getGalleryPhotoCount } from '@/lib/data/gallery-store';
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

    const inquiries = await getAllInquiries();
    const newsArticles = await getAllNewsArticles(false);
    const signatureCount = await getSignatureCount();
    const photoCount = await getGalleryPhotoCount();
    const subscriberCount = await getSubscriberCount();

    const stats: DashboardStats = {
      totalInquiries: inquiries.length,
      pendingInquiries: inquiries.filter((i) => i.status === 'pending').length,
      totalNews: newsArticles.length,
      totalSignatures: signatureCount,
      totalPhotos: photoCount,
      totalSubscribers: subscriberCount,
    };

    return stats;
  } catch (error) {
    return { error: 'Failed to fetch dashboard stats' };
  }
}

export async function exportAllData() {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    const [inquiries, articles, signatures, photos] = await Promise.all([
      getAllInquiries(),
      getAllNewsArticles(false),
      getAllSignatures(),
      getAllGalleryPhotos(),
    ]);

    return { inquiries, articles, signatures, photos };
  } catch (error) {
    return { error: 'Failed to export data' };
  }
}

'use server';

import { getAuthToken, verifyToken } from './auth-actions';
import { getSubscribedEmails } from '@/lib/data/petition-store';
import { sendBroadcastToAll } from '@/lib/email';
import { sanitizeHtml } from '@/lib/sanitize';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;

  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function sendBroadcast(data: {
  subject: string;
  body: string;
}): Promise<{ sent: number; failed: number } | { error: string }> {
  try {
    const admin = await isAdmin();
    if (!admin) {
      return { error: 'Authentication required' };
    }

    if (!data.subject || !data.body) {
      return { error: 'Subject and body are required' };
    }

    if (data.subject.length > 200) {
      return { error: 'Subject must be 200 characters or less' };
    }

    const subscribers = await getSubscribedEmails();

    if (subscribers.length === 0) {
      return { error: 'No subscribers to send to' };
    }

    // Sanitize the HTML body
    const sanitizedBody = sanitizeHtml(data.body);

    const result = await sendBroadcastToAll(data.subject, sanitizedBody, subscribers);

    return result;
  } catch (error) {
    console.error('Error sending broadcast:', error);
    return { error: 'Failed to send broadcast' };
  }
}

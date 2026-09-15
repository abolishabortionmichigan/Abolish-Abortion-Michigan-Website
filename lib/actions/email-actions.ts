'use server';

import { getAuthToken, verifyToken } from './auth-actions';
import { getBulkEmailAudience, applyDailyCap } from '@/lib/data/audience';
import { sendBroadcastToAll, sendBroadcastNotification } from '@/lib/email';
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

    // Shared audience resolver: deduplicated union of petition opt-ins and
    // footer newsletter subscribers. Previously duplicated here and in
    // news-actions.ts, where the two implementations had drifted apart.
    const audience = await getBulkEmailAudience();

    if (audience.length === 0) {
      return { error: 'No subscribers to send to' };
    }

    // Resend's free plan caps sending at 100/day and transactional mail draws
    // from the same quota, so a full-list blast can silently break petition
    // and contact confirmations for the rest of the day.
    const { batch, deferred, capped, cap, total } = applyDailyCap(audience);
    if (capped) {
      console.warn(`[broadcast] Daily cap reached: sending to ${batch.length} of ${total}; ${deferred.length} deferred (cap=${cap}).`);
    }
    const subscribers = batch.map((m) => ({ name: m.name, email: m.email }));


    // Sanitize the HTML body
    const sanitizedBody = sanitizeHtml(data.body);

    const result = await sendBroadcastToAll(data.subject, sanitizedBody, subscribers);
    const failed = result.failed + deferred.length;
    await sendBroadcastNotification(data.subject, result.sent, failed);

    return { sent: result.sent, failed };
  } catch (error) {
    console.error('Error sending broadcast:', error instanceof Error ? error.message : 'Unknown error');
    return { error: 'Failed to send broadcast' };
  }
}

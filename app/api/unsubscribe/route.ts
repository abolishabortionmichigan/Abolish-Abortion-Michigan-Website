import { NextRequest, NextResponse } from 'next/server';
import { verifyUnsubscribeToken } from '@/lib/email';
import { updateSubscriptionStatus } from '@/lib/data/petition-store';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');
  const token = searchParams.get('token');

  if (!email || !token) {
    return NextResponse.json({ error: 'Missing email or token' }, { status: 400 });
  }

  if (!verifyUnsubscribeToken(email, token)) {
    return NextResponse.json({ error: 'Invalid or expired unsubscribe link' }, { status: 403 });
  }

  const updated = await updateSubscriptionStatus(email, false);

  if (!updated) {
    return NextResponse.json({ error: 'Email not found' }, { status: 404 });
  }

  // Redirect to the unsubscribe confirmation page
  const url = new URL('/unsubscribe', request.url);
  url.searchParams.set('success', 'true');
  return NextResponse.redirect(url);
}

import { NextResponse } from 'next/server';
import { getAuthToken, verifyToken } from '@/lib/actions/auth-actions';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;
  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

export async function GET() {
  if (!await isAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // In production, these would be database counts
  const stats = {
    totalInquiries: 1,
    pendingInquiries: 1,
    totalNews: 1,
    totalSignatures: 0,
  };

  return NextResponse.json(stats);
}

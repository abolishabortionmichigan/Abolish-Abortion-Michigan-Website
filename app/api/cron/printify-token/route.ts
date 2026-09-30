import { NextRequest, NextResponse } from 'next/server';
import { daysUntil, isPrintifyConfigured, printifyTokenExpiry } from '@/lib/printify';
import { sendPrintifyTokenReminder } from '@/lib/email';

/*
 * Daily Vercel Cron (vercel.json). Emails a reminder to renew the Printify API
 * token 30, 14, 7, 3 and 1 days before it expires, then every Monday while it
 * stays expired. Vercel sends `Authorization: Bearer $CRON_SECRET`.
 *
 * Deliberately touches no database: a daily DB query would wake Neon for
 * nothing (see /api/health).
 */

export const dynamic = 'force-dynamic';

const MILESTONES = new Set([30, 14, 7, 3, 1]);

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const expires = printifyTokenExpiry();
  if (!isPrintifyConfigured() || !expires) return NextResponse.json({ checked: false, reason: 'Printify not connected' });

  const daysLeft = daysUntil(expires);
  const due = MILESTONES.has(daysLeft) || (daysLeft <= 0 && new Date().getUTCDay() === 1);
  const sent = due ? (await sendPrintifyTokenReminder({ daysLeft, expiresOn: expires })).success : false;
  return NextResponse.json({ checked: true, expiresOn: expires.toISOString().slice(0, 10), daysLeft, due, sent });
}

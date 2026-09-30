import { NextRequest, NextResponse } from 'next/server';
import { daysUntil } from '@/lib/printify';
import { sendSalesTaxLicenseReminder } from '@/lib/email';

/*
 * Daily Vercel Cron (vercel.json). Emails a reminder to renew the Michigan
 * sales tax licence 60, 30, 14, 7, 3 and 1 days before it expires, then every
 * Monday once it has lapsed.
 *
 * Michigan licences always run to 31 December of the year they are issued
 * for, so this comes round every single year. Lapsing matters more than it
 * looks: the store keeps charging 6% at checkout regardless, so an expired
 * licence means collecting tax without the authority to, which is a worse
 * position than never having collected at all.
 *
 * Longer lead time than the Printify reminder (60 days, not 30) because this
 * one falls at the turn of the year, when nobody is reading email.
 *
 * Set SALES_TAX_LICENSE_EXPIRES=YYYY-MM-DD in Vercel. Unset = feature off, so
 * this stays silent for anyone running the site without a licence.
 *
 * Deliberately touches no database, matching /api/cron/printify-token: a daily
 * query would wake Neon for nothing.
 */

export const dynamic = 'force-dynamic';

const MILESTONES = new Set([60, 30, 14, 7, 3, 1]);

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const raw = process.env.SALES_TAX_LICENSE_EXPIRES;
  if (!raw) return NextResponse.json({ checked: false, reason: 'No licence expiry configured' });

  // Parse as midnight UTC so the countdown does not drift with the server's zone.
  const expires = /^\d{4}-\d{2}-\d{2}$/.test(raw) ? new Date(`${raw}T00:00:00Z`) : new Date(raw);
  if (Number.isNaN(expires.getTime())) {
    return NextResponse.json({ checked: false, reason: 'SALES_TAX_LICENSE_EXPIRES is not a date' }, { status: 500 });
  }

  const daysLeft = daysUntil(expires);
  const due = MILESTONES.has(daysLeft) || (daysLeft <= 0 && new Date().getUTCDay() === 1);
  const sent = due ? (await sendSalesTaxLicenseReminder({ daysLeft, expiresOn: expires })).success : false;

  return NextResponse.json({
    checked: true,
    expiresOn: expires.toISOString().slice(0, 10),
    daysLeft,
    due,
    sent,
  });
}

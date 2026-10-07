import { NextRequest, NextResponse } from 'next/server';
import { syncPrintifyCatalogue } from '@/lib/printify-import';
import { revalidateStore } from '@/lib/store-revalidate';

/*
 * Pulls the Printify catalogue into Product / ProductVariant.
 *
 * Runs nightly on Vercel Cron (vercel.json), which sends
 * `Authorization: Bearer $CRON_SECRET`, so a price change or a new design made
 * in Printify reaches the site on its own. The admin "Sync from Printify"
 * button calls the same code when it is wanted immediately.
 *
 * `?dryRun=1` reports what would change and writes nothing.
 */

export const dynamic = 'force-dynamic';
// A full first import is ~390 products and measured 54s locally; production
// Neon is slower per write, so 60s would time out on the very first run.
// Vercel clamps this to the plan maximum rather than failing the build.
export const maxDuration = 300;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const dryRun = req.nextUrl.searchParams.get('dryRun') === '1';
  const report = await syncPrintifyCatalogue({ dryRun });

  if (!report.ok) return NextResponse.json(report, { status: 502 });
  if (!dryRun && report.created + report.updated + report.deactivated > 0) {
    revalidateStore(report.products.map((p) => p.slug));
  }
  return NextResponse.json(report);
}

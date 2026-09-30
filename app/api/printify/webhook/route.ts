import { NextRequest, NextResponse } from 'next/server';
import { verifyPrintifySignature } from '@/lib/printify';
import { handlePrintifyEvent, type PrintifyEvent } from '@/lib/printify-fulfillment';

/*
 * Printify webhook: production status and shipments for orders we sent there
 * (lib/printify-fulfillment.ts). Registered by scripts/printify-setup.mjs for
 *   order:updated, order:sent-to-production,
 *   order:shipment:created, order:shipment:delivered
 * with the secret in PRINTIFY_WEBHOOK_SECRET. Every request must carry a valid
 * X-Pfy-Signature (HMAC-SHA256 of the raw body).
 */

export async function POST(req: NextRequest) {
  if (!process.env.PRINTIFY_WEBHOOK_SECRET) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const raw = await req.text();
  if (!verifyPrintifySignature(raw, req.headers.get('x-pfy-signature'))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: PrintifyEvent;
  try {
    event = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: 'Bad JSON' }, { status: 400 });
  }

  try {
    const outcome = await handlePrintifyEvent(event);
    return NextResponse.json({ received: true, outcome });
  } catch (e) {
    // A 500 makes Printify retry, which is what we want for transient DB errors.
    console.error(`Printify webhook ${event.type} failed:`, e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }
}

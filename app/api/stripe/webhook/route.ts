import { NextRequest, NextResponse } from 'next/server';
import type Stripe from 'stripe';
import prisma from '@/lib/prisma';
import { getStripe } from '@/lib/stripe';
import { settleSession } from '@/lib/settlement';

/*
 * Stripe webhook for STORE ORDERS.
 *
 * The order page settles payments too, but a buyer can close the tab before
 * returning, so this endpoint is what makes those land. It is the backstop,
 * not the primary path -- both call the same idempotent settleSession().
 *
 * Register it in the Stripe Dashboard under Developers -> Webhooks for:
 *   checkout.session.completed
 *   checkout.session.async_payment_succeeded
 *   checkout.session.async_payment_failed
 *   checkout.session.expired
 * and put the signing secret in STRIPE_WEBHOOK_SECRET.
 *
 * No donation events are handled: AAM takes gifts through Zeffy, not Stripe.
 */

export async function POST(req: NextRequest) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) return NextResponse.json({ error: 'Not configured' }, { status: 503 });

  const signature = req.headers.get('stripe-signature');
  if (!signature) return NextResponse.json({ error: 'Missing signature' }, { status: 400 });

  let event: Stripe.Event;
  try {
    // Signature verification needs the exact raw body, so read it as text.
    event = await stripe.webhooks.constructEventAsync(await req.text(), signature, secret);
  } catch (e) {
    console.error('Stripe webhook signature failed:', e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
      case 'checkout.session.async_payment_succeeded': {
        const session = event.data.object;
        if (session.payment_status === 'paid') {
          const r = await settleSession(session);
          if (!r.ok) console.warn(`Webhook settle ${session.id}: ${r.error}`);
        }
        break;
      }

      case 'checkout.session.async_payment_failed':
      case 'checkout.session.expired': {
        const session = event.data.object;
        const note = event.type === 'checkout.session.expired' ? 'Checkout expired' : 'Bank payment failed';
        if (session.metadata?.kind === 'order' && session.metadata.order_id) {
          await prisma.order.updateMany({
            where: { id: session.metadata.order_id, status: 'pending' },
            data: { status: 'cancelled', admin_note: note },
          });
        }
        break;
      }
    }
  } catch (e) {
    // A 500 makes Stripe retry, which is what we want for transient DB errors.
    console.error(`Stripe webhook ${event.type} failed:`, e instanceof Error ? e.message : e);
    return NextResponse.json({ error: 'Handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

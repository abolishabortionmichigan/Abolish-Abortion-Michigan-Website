import 'server-only';
import type Stripe from 'stripe';
import prisma from './prisma';
import { getStripe } from './stripe';
import {
  sendNewOrderNotification,
  sendOrderConfirmationEmail,
  type OrderEmailData,
} from './email';
import { submitOrderToPrintify } from './printify-fulfillment';

/*
 * Turning a completed Stripe Checkout Session into a paid order.
 *
 * Called from two places -- the browser's return to the order page, and the
 * Stripe webhook -- and safe to call any number of times: the status moves
 * pending -> paid with a conditional update, so only the first caller wins,
 * and only that caller sends email.
 *
 * The Made Alive original also settled donations here. This site does not:
 * donations go through Zeffy, so there is no donation path to settle.
 */

type SettleResult = { ok: true; changed: boolean } | { ok: false; error: string };

export async function retrieveSession(sessionId: string): Promise<Stripe.Checkout.Session | null> {
  const stripe = getStripe();
  if (!stripe || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) return null;
  try {
    return await stripe.checkout.sessions.retrieve(sessionId);
  } catch (e) {
    console.error('Stripe session retrieve failed:', e instanceof Error ? e.message : e);
    return null;
  }
}

const isPaid = (s: Stripe.Checkout.Session) => s.status === 'complete' && s.payment_status === 'paid';

export async function settleOrder(session: Stripe.Checkout.Session): Promise<SettleResult> {
  const orderId = session.metadata?.order_id;
  if (session.metadata?.kind !== 'order' || !orderId) return { ok: false, error: 'Not an order session' };

  const order = await prisma.order.findUnique({ where: { id: orderId }, include: { items: true } });
  if (!order) return { ok: false, error: 'Order not found' };
  if (order.stripe_session_id && order.stripe_session_id !== session.id) return { ok: false, error: 'Session mismatch' };
  if (order.status !== 'pending') return { ok: true, changed: false };
  if (!isPaid(session)) return { ok: false, error: 'Payment not completed' };

  // The amount Stripe collected must be exactly what we priced, plus whatever
  // tax Stripe Tax added. Anything else is refused and logged rather than
  // quietly accepted.
  const tax = session.total_details?.amount_tax ?? 0;
  const expected = order.subtotal_cents + order.shipping_cents + tax;
  if (session.amount_total !== expected) {
    console.error(`Order ${order.order_number}: Stripe total ${session.amount_total} != expected ${expected}`);
    return { ok: false, error: 'Amount mismatch' };
  }

  const ship = session.collected_information?.shipping_details ?? null;
  const address = ship?.address
    ? {
        line1: ship.address.line1,
        line2: ship.address.line2,
        city: ship.address.city,
        state: ship.address.state,
        postal_code: ship.address.postal_code,
        country: ship.address.country,
      }
    : null;
  const email = session.customer_details?.email || order.email;
  const name = session.customer_details?.name || ship?.name || order.name;

  const transitioned = await prisma.order.updateMany({
    where: { id: order.id, status: 'pending' },
    data: {
      status: 'paid',
      paid_at: new Date(),
      email,
      name,
      tax_cents: tax,
      total_cents: expected,
      stripe_session_id: session.id,
      stripe_payment_intent:
        typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null,
      shipping_name: ship?.name ?? name,
      ...(address ? { shipping_address: address } : {}),
    },
  });
  if (transitioned.count === 0) return { ok: true, changed: false };

  // Decrement tracked stock. Untracked variants (stock = null, i.e. made to
  // order) are skipped.
  for (const item of order.items) {
    if (!item.variant_id) continue;
    await prisma.productVariant.updateMany({
      where: { id: item.variant_id, stock: { not: null } },
      data: { stock: { decrement: item.quantity } },
    });
  }

  const emailData: OrderEmailData = {
    order_number: order.order_number,
    email,
    name,
    subtotal_cents: order.subtotal_cents,
    shipping_cents: order.shipping_cents,
    tax_cents: tax,
    total_cents: expected,
    shipping_name: ship?.name ?? name,
    shipping_address: address,
    items: order.items,
  };
  await Promise.all([sendOrderConfirmationEmail(emailData), sendNewOrderNotification(emailData)]);
  // Print-on-demand items go straight to Printify. It records its own failures
  // on the order and never throws, so the sale always stands even if Printify
  // is down.
  await submitOrderToPrintify(order.id);
  return { ok: true, changed: true };
}

/*
 * Admin debit-card top-up of the Stripe balance.
 *
 * Same shape as settleOrder and safe to call repeatedly: the pending->paid
 * move is a conditional update, so only the first caller wins. There is no
 * email and no fulfilment -- the money arriving in the balance IS the whole
 * effect, and the row is the bookkeeping record of it.
 */
export async function settleFunding(session: Stripe.Checkout.Session): Promise<SettleResult> {
  const fundingId = session.metadata?.funding_id;
  if (session.metadata?.kind !== 'funding' || !fundingId) return { ok: false, error: 'Not a funding session' };

  const funding = await prisma.funding.findUnique({ where: { id: fundingId } });
  if (!funding) return { ok: false, error: 'Funding record not found' };
  if (funding.stripe_session_id && funding.stripe_session_id !== session.id) {
    return { ok: false, error: 'Session mismatch' };
  }
  if (funding.status !== 'pending') return { ok: true, changed: false };
  if (!isPaid(session)) return { ok: false, error: 'Payment not completed' };

  // The amount Stripe collected must be exactly what the admin asked for. No
  // tax and no shipping here, so this is a straight equality.
  if (session.amount_total !== funding.amount_cents) {
    console.error(`Funding ${funding.reference}: Stripe total ${session.amount_total} != expected ${funding.amount_cents}`);
    return { ok: false, error: 'Amount mismatch' };
  }

  const intentId =
    typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id ?? null;

  const transitioned = await prisma.funding.updateMany({
    where: { id: funding.id, status: 'pending' },
    data: {
      status: 'paid',
      paid_at: new Date(),
      stripe_session_id: session.id,
      ...(intentId ? { stripe_payment_intent: intentId } : {}),
    },
  });
  if (transitioned.count === 0) return { ok: true, changed: false };

  /*
   * What actually reached the balance. A card top-up is a normal charge, so
   * Stripe takes its percentage: the gross is what the card paid and the net
   * is what AAM can spend. Recording both is the point of this table -- it is
   * the only place the cost of funding this way is visible.
   *
   * Best-effort on purpose. The money has already landed and the row already
   * says paid; a failed lookup here must not undo that, so it only logs.
   */
  const stripe = getStripe();
  if (stripe && intentId) {
    try {
      const intent = await stripe.paymentIntents.retrieve(intentId, {
        expand: ['latest_charge.balance_transaction'],
      });
      const charge = intent.latest_charge;
      const txn =
        charge && typeof charge !== 'string' && charge.balance_transaction && typeof charge.balance_transaction !== 'string'
          ? charge.balance_transaction
          : null;
      if (txn) {
        await prisma.funding.update({
          where: { id: funding.id },
          data: { fee_cents: txn.fee, net_cents: txn.net },
        });
      }
    } catch (e) {
      console.error(`Funding ${funding.reference}: fee lookup failed:`, e instanceof Error ? e.message : e);
    }
  }

  return { ok: true, changed: true };
}

export async function settleSession(session: Stripe.Checkout.Session): Promise<SettleResult> {
  if (session.metadata?.kind === 'order') return settleOrder(session);
  if (session.metadata?.kind === 'funding') return settleFunding(session);
  return { ok: false, error: 'Unknown session kind' };
}

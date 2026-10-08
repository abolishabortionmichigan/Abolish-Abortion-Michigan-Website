import 'server-only';
import prisma from './prisma';
import {
  createPrintifyOrder,
  isPrintifyConfigured,
  sendPrintifyOrderToProduction,
  type PrintifyAddress,
} from './printify';
import {
  sendOrderShippedEmail,
  sendPrintifyProblemNotification,
  sendPrintifyShipmentNotification,
} from './email';

/*
 * Paid order → Printify → shipped. Called once per order from settleOrder
 * (after the pending→paid transition) and from the admin "Send to Printify"
 * button; Printify's webhooks come back through handlePrintifyEvent.
 *
 * Never throws: the customer has already paid, so a Printify problem is
 * recorded on the order (fulfillment_error), emailed to the admin, and left
 * for a retry — it must not undo or block the sale.
 *
 * PRINTIFY_HOLD_ORDERS=true leaves new orders "on hold" in Printify for the
 * client to approve there instead of sending them straight to production.
 */

type Result = { ok: true; note?: string } | { ok: false; error: string };
type Address = { line1?: string | null; line2?: string | null; city?: string | null; state?: string | null; postal_code?: string | null; country?: string | null };

const loadOrder = (id: string) =>
  prisma.order.findUnique({ where: { id }, include: { items: { include: { variant: true, product: true } } } });
type LoadedOrder = NonNullable<Awaited<ReturnType<typeof loadOrder>>>;

const isPod = (i: LoadedOrder['items'][number]) =>
  Boolean(i.product?.printify_product_id) && i.variant?.printify_variant_id != null;

const message = (e: unknown) => (e instanceof Error ? e.message : String(e)).slice(0, 500);

async function fail(order: LoadedOrder, problem: string): Promise<Result> {
  await prisma.order.update({ where: { id: order.id }, data: { printify_status: 'failed', fulfillment_error: problem } });
  await sendPrintifyProblemNotification({ order_number: order.order_number, problem });
  return { ok: false, error: problem };
}

function addressFor(order: LoadedOrder): PrintifyAddress | null {
  const a = (order.shipping_address ?? null) as Address | null;
  if (!a?.line1 || !a.city || !a.postal_code) return null;
  const words = (order.shipping_name || order.name || '').trim().split(/\s+/).filter(Boolean);
  const last = words.length > 1 ? words.pop()! : '';
  return {
    first_name: words.join(' ') || 'Customer',
    last_name: last,
    email: order.email,
    country: a.country || 'US',
    region: a.state || '',
    address1: a.line1,
    ...(a.line2 ? { address2: a.line2 } : {}),
    city: a.city,
    zip: a.postal_code,
  };
}

/** Send a paid order's print-on-demand items to Printify. Safe to call twice. */
export async function submitOrderToPrintify(orderId: string): Promise<Result> {
  try {
    const order = await loadOrder(orderId);
    if (!order) return { ok: false, error: 'Order not found.' };
    const lines = order.items.filter(isPod);
    if (lines.length === 0) return { ok: true, note: 'No print-on-demand items.' };
    if (order.status !== 'paid') return { ok: false, error: 'Only paid orders are sent to Printify.' };
    if (!isPrintifyConfigured()) {
      return fail(order, 'Printify is not connected, so this order was not sent to be printed. Connect Printify and press "Send to Printify", or fulfil it yourself.');
    }

    // Claim the order so a double click / concurrent call cannot submit twice.
    const claimed = await prisma.order.updateMany({
      where: { id: order.id, printify_order_id: null, OR: [{ printify_status: null }, { printify_status: 'failed' }] },
      data: { printify_status: 'submitting', fulfillment_error: null },
    });
    if (claimed.count === 0) return { ok: true, note: 'Already sent to Printify.' };

    const address = addressFor(order);
    if (!address) return fail(order, 'This order has no complete shipping address, so it could not be sent to Printify.');

    let printifyId: string;
    try {
      const created = await createPrintifyOrder({
        external_id: order.order_number,
        label: order.order_number,
        line_items: lines.map((i) => ({
          product_id: i.product!.printify_product_id!,
          variant_id: i.variant!.printify_variant_id!,
          quantity: i.quantity,
          external_id: i.id,
        })),
        address_to: address,
      });
      printifyId = created.id;
    } catch (e) {
      return fail(
        order,
        `Printify refused the order: ${message(e)}. Check the Printify dashboard first — if the order is already there, don't send it again.`,
      );
    }
    await prisma.order.update({ where: { id: order.id }, data: { printify_order_id: printifyId, printify_status: 'on-hold' } });

    if (process.env.PRINTIFY_HOLD_ORDERS === 'true') {
      return { ok: true, note: 'Created in Printify and left on hold for approval there.' };
    }
    return sendToProduction(order.id);
  } catch (e) {
    console.error('Printify submit failed:', message(e));
    return { ok: false, error: 'Could not send the order to Printify.' };
  }
}

/** Push an order already created in Printify into production. */
async function sendToProduction(orderId: string): Promise<Result> {
  const order = await loadOrder(orderId);
  if (!order?.printify_order_id) return { ok: false, error: 'This order is not in Printify yet.' };
  try {
    // Printify creates an order as "pending" and refuses production until it
    // has finished validating, which takes a few seconds - so submitting
    // straight after creating fails every time (code 8502). Give it a couple
    // of short retries. Bounded on purpose: this runs inside the Stripe
    // webhook, which must still answer quickly.
    for (let attempt = 1; ; attempt++) {
      try {
        await sendPrintifyOrderToProduction(order.printify_order_id);
        break;
      } catch (e) {
        const stillPending = /8502|with status pending/i.test(message(e));
        if (!stillPending || attempt >= 3) throw e;
        await new Promise((r) => setTimeout(r, attempt * 2500));
      }
    }
    await prisma.order.update({ where: { id: order.id }, data: { printify_status: 'sent', fulfillment_error: null } });
    return { ok: true, note: 'Sent to Printify for printing.' };
  } catch (e) {
    const problem = `The order is in Printify but was not sent to production: ${message(e)}. Press "Send to Printify" to try again, or send it from the Printify dashboard. (Printify charges the card on file in your Printify account at this step.)`;
    await prisma.order.update({ where: { id: order.id }, data: { fulfillment_error: problem } });
    await sendPrintifyProblemNotification({ order_number: order.order_number, problem });
    return { ok: false, error: problem };
  }
}

/** Admin "Send to Printify": create it if it never got there, else push it to production. */
export async function retryPrintifyOrder(orderId: string): Promise<Result> {
  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) return { ok: false, error: 'Order not found.' };
  if (order.status !== 'paid') return { ok: false, error: 'Only paid orders are sent to Printify.' };
  if (!order.printify_order_id) return submitOrderToPrintify(orderId);
  return sendToProduction(orderId);
}

// ── webhooks ────────────────────────────────────────────────────────────────

export interface PrintifyEvent {
  id?: string;
  type?: string;
  resource?: { id?: string; type?: string; data?: Record<string, unknown> | null };
}

// Printify statuses that need a person. "on-hold" only counts once the order
// had already gone to production (it is also the normal state right after we
// create it).
const PROBLEM = new Set(['canceled', 'has-issues', 'payment-not-received', 'unfulfillable', 'source-check-failed']);
const IN_PRODUCTION = new Set(['sent', 'sending-to-production', 'in-production']);

function appendNote(existing: string | null, line: string): string {
  return [existing, line].filter(Boolean).join('\n').slice(-1000);
}

export async function handlePrintifyEvent(event: PrintifyEvent): Promise<string> {
  const printifyId = event.resource?.id;
  if (!printifyId || event.resource?.type !== 'order') return 'ignored (not an order event)';
  const order = await prisma.order.findUnique({
    where: { printify_order_id: printifyId },
    include: { items: { include: { variant: true, product: true } } },
  });
  if (!order) return 'ignored (unknown order)';
  const data = (event.resource.data ?? {}) as Record<string, unknown>;

  switch (event.type) {
    case 'order:updated': {
      const status = typeof data.status === 'string' ? data.status : '';

      // Safety net if the retries above still lost the race: Printify is
      // telling us the order has left "pending", so push it now. This has to
      // come before the no-change return - our record already says on-hold,
      // and that early exit is why a stuck order never healed itself.
      if (
        status === 'on-hold' &&
        order.fulfillment_error &&
        process.env.PRINTIFY_HOLD_ORDERS !== 'true' &&
        !IN_PRODUCTION.has(order.printify_status ?? '')
      ) {
        const retried = await sendToProduction(order.id);
        if (retried.ok) return 'sent to production on retry';
      }

      if (!status || status === order.printify_status) return 'no change';
      await prisma.order.update({ where: { id: order.id }, data: { printify_status: status } });
      if (PROBLEM.has(status) || (status === 'on-hold' && IN_PRODUCTION.has(order.printify_status ?? ''))) {
        await sendPrintifyProblemNotification({
          order_number: order.order_number,
          problem: `Printify now lists this order as "${status}". Open it in the Printify dashboard to see why.${status === 'canceled' ? ' If it stays cancelled, refund the customer in Stripe.' : ''}`,
        });
      }
      return `status ${status}`;
    }

    case 'order:sent-to-production':
      if (!['shipped', 'delivered'].includes(order.printify_status ?? '')) {
        await prisma.order.update({ where: { id: order.id }, data: { printify_status: 'in-production' } });
      }
      return 'in production';

    case 'order:shipment:created': {
      const carrierInfo = (data.carrier ?? {}) as { code?: string; tracking_number?: string };
      const carrier = carrierInfo.code ? String(carrierInfo.code).toUpperCase() : null;
      const tracking = carrierInfo.tracking_number ? String(carrierInfo.tracking_number) : null;
      const manual = order.items.filter((i) => !isPod(i));

      if (manual.length > 0) {
        // Mixed order: Printify only shipped its part. The admin ships the
        // rest and marks the order shipped, which emails the buyer.
        await prisma.order.update({
          where: { id: order.id },
          data: {
            printify_status: 'shipped',
            admin_note: appendNote(order.admin_note, `Printify shipped its items${tracking ? ` — ${carrier ?? ''} ${tracking}`.trimEnd() : ''}.`),
          },
        });
        await sendPrintifyShipmentNotification({
          order_number: order.order_number,
          carrier,
          tracking,
          manual: manual.map((i) => `${i.name}${i.variant_label ? ` (${i.variant_label})` : ''} × ${i.quantity}`),
        });
        return 'partial shipment recorded';
      }

      const shipped = await prisma.order.updateMany({
        where: { id: order.id, status: 'paid' },
        data: { status: 'shipped', shipped_at: new Date(), carrier, tracking_number: tracking, printify_status: 'shipped' },
      });
      if (shipped.count === 0) {
        // Already shipped (a second parcel, or marked by hand): keep the extra tracking.
        if (tracking && tracking !== order.tracking_number) {
          await prisma.order.update({
            where: { id: order.id },
            data: { admin_note: appendNote(order.admin_note, `Printify sent another parcel — ${carrier ?? ''} ${tracking}`.trim()) },
          });
        }
        return 'already shipped';
      }
      const updated = await prisma.order.findUnique({ where: { id: order.id }, include: { items: true } });
      if (updated?.email) await sendOrderShippedEmail({ ...updated, shipping_address: updated.shipping_address as never });
      return 'marked shipped';
    }

    case 'order:shipment:delivered':
      await prisma.order.update({ where: { id: order.id }, data: { printify_status: 'delivered' } });
      return 'delivered';
  }
  return 'ignored (topic)';
}

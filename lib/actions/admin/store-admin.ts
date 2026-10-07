'use server';

/*
 * Admin actions for the store.
 *
 * Every export is gated on the same admin check the rest of the dashboard
 * uses (auth-actions -> JWT -> role === 'admin'), and every one returns
 * { error } rather than throwing, because the dashboard renders the message
 * inline.
 *
 * Deliberately NOT here: deleting an order. An order is the record of a real
 * payment; cancelling or refunding changes its status and keeps the history.
 */

import { getAuthToken, verifyToken } from '../auth-actions';
import prisma from '@/lib/prisma';
import { sendOrderShippedEmail, type OrderEmailData } from '@/lib/email';
import { retryPrintifyOrder } from '@/lib/printify-fulfillment';
import { printifyTokenExpiry, daysUntil, isPrintifyConfigured } from '@/lib/printify';
import { syncPrintifyCatalogue } from '@/lib/printify-import';
import { revalidateStore } from '@/lib/store-revalidate';
import { miTaxBand } from '@/lib/mi-sales-tax';

async function isAdmin(): Promise<boolean> {
  const token = await getAuthToken();
  if (!token) return false;
  const result = await verifyToken(token);
  return result.authorized && result.user?.role === 'admin';
}

const ORDER_SELECT = {
  id: true,
  order_number: true,
  email: true,
  name: true,
  status: true,
  subtotal_cents: true,
  shipping_cents: true,
  tax_cents: true,
  total_cents: true,
  shipping_name: true,
  shipping_address: true,
  carrier: true,
  tracking_number: true,
  admin_note: true,
  printify_order_id: true,
  printify_status: true,
  fulfillment_error: true,
  paid_at: true,
  shipped_at: true,
  created_at: true,
  items: {
    select: {
      id: true,
      name: true,
      variant_label: true,
      quantity: true,
      unit_price_cents: true,
      image: true,
    },
  },
} as const;

export type AdminOrder = Awaited<
  ReturnType<typeof prisma.order.findFirstOrThrow<{ select: typeof ORDER_SELECT }>>
>;

/**
 * Orders newest first. `status` is one of the Order.status values, or 'all'.
 *
 * Pending orders are abandoned checkouts, so they are excluded from 'all' and
 * only visible under their own tab. Otherwise the list fills up with carts
 * nobody ever paid for and the real orders get lost in them.
 */
export async function listOrders(status = 'all') {
  try {
    if (!(await isAdmin())) return { error: 'Authentication required' };

    const where = status === 'all' ? { status: { not: 'pending' } } : { status };

    const orders = await prisma.order.findMany({
      where,
      select: ORDER_SELECT,
      orderBy: { created_at: 'desc' },
      take: 500,
    });
    return { orders };
  } catch {
    return { error: 'Failed to load orders' };
  }
}

/** Counts for the tab bar, so a tab can show how much is waiting in it. */
export async function orderCounts() {
  try {
    if (!(await isAdmin())) return { error: 'Authentication required' };
    const rows = await prisma.order.groupBy({ by: ['status'], _count: { _all: true } });
    const counts: Record<string, number> = {};
    for (const r of rows) counts[r.status] = r._count._all;
    counts.all = Object.entries(counts)
      .filter(([s]) => s !== 'pending')
      .reduce((n, [, c]) => n + c, 0);
    return { counts };
  } catch {
    return { error: 'Failed to load counts' };
  }
}

/*
 * Michigan sales-tax exposure for the current calendar year.
 *
 * Thresholds and bands live in lib/mi-sales-tax.ts.
 *
 * The point of this is that the crossing is otherwise invisible. Nothing else
 * in the app would tell anyone it had happened until a return was due.
 *
 * Counted: goods + shipping on orders that actually sold (paid or shipped).
 *
 * Shipping is included here deliberately, NOT because it is taxable -- it is
 * not. Michigan PA 20 and 21 of 2023 exclude separately stated delivery
 * charges from the tax base, and this store states shipping separately
 * everywhere (cart, Stripe, order page, emails), so Stripe correctly charges
 * 0% on it. It is counted toward the threshold anyway because overstating can
 * only make the warning fire early, and firing late is the failure that costs
 * money.
 *
 * Tax already collected is excluded, and cancelled and refunded orders are
 * not sales. The card shows goods and shipping separately so the split is
 * visible.
 *
 * These are thresholds to watch, not tax advice; the filing decision is AAM's
 * accountant's.
 */
export async function salesYearToDate() {
  try {
    if (!(await isAdmin())) return { error: 'Authentication required' };

    const year = new Date().getUTCFullYear();
    const rows = await prisma.order.aggregate({
      where: {
        status: { in: ['paid', 'shipped'] },
        created_at: { gte: new Date(Date.UTC(year, 0, 1)), lt: new Date(Date.UTC(year + 1, 0, 1)) },
      },
      _sum: { subtotal_cents: true, shipping_cents: true, tax_cents: true },
      _count: { _all: true },
    });

    const goods = rows._sum.subtotal_cents ?? 0;
    const shipping = rows._sum.shipping_cents ?? 0;
    const retail = goods + shipping;

    return {
      year,
      orders: rows._count._all,
      goodsCents: goods,
      shippingCents: shipping,
      retailCents: retail,
      taxCollectedCents: rows._sum.tax_cents ?? 0,
      band: miTaxBand(retail),
    };
  } catch {
    return { error: 'Failed to total this year’s sales' };
  }
}

function toEmailData(o: {
  order_number: string;
  email: string;
  name: string | null;
  subtotal_cents: number;
  shipping_cents: number;
  tax_cents: number;
  total_cents: number;
  shipping_name: string | null;
  shipping_address: unknown;
  carrier: string | null;
  tracking_number: string | null;
  items: {
    name: string;
    variant_label: string | null;
    quantity: number;
    unit_price_cents: number;
  }[];
}): OrderEmailData {
  return {
    order_number: o.order_number,
    email: o.email,
    name: o.name,
    subtotal_cents: o.subtotal_cents,
    shipping_cents: o.shipping_cents,
    tax_cents: o.tax_cents,
    total_cents: o.total_cents,
    shipping_name: o.shipping_name,
    shipping_address: (o.shipping_address as OrderEmailData['shipping_address']) ?? null,
    carrier: o.carrier,
    tracking_number: o.tracking_number,
    items: o.items.map((i) => ({
      name: i.name,
      variant_label: i.variant_label,
      quantity: i.quantity,
      unit_price_cents: i.unit_price_cents,
    })),
  };
}

/**
 * Mark an order shipped and, optionally, tell the buyer.
 *
 * The email goes out AFTER the write and its failure is swallowed: the order
 * really did ship, and losing that fact because Resend was down would be worse
 * than a missing notification. The admin sees the send result either way.
 */
export async function markOrderShipped(input: {
  id: string;
  carrier: string;
  tracking: string;
  notify: boolean;
}) {
  try {
    if (!(await isAdmin())) return { error: 'Authentication required' };

    const carrier = input.carrier.trim().slice(0, 60);
    const tracking = input.tracking.trim().slice(0, 120);
    if (!tracking) return { error: 'A tracking number is required.' };

    const order = await prisma.order.findUnique({ where: { id: input.id }, select: ORDER_SELECT });
    if (!order) return { error: 'Order not found.' };
    if (order.status === 'cancelled' || order.status === 'refunded') {
      return { error: `This order is ${order.status}. Reopen it before marking it shipped.` };
    }

    const updated = await prisma.order.update({
      where: { id: input.id },
      data: {
        status: 'shipped',
        carrier: carrier || null,
        tracking_number: tracking,
        shipped_at: order.shipped_at ?? new Date(),
      },
      select: ORDER_SELECT,
    });

    let emailed = false;
    let emailError: string | null = null;
    if (input.notify) {
      try {
        await sendOrderShippedEmail(toEmailData(updated));
        emailed = true;
      } catch (e) {
        emailError = e instanceof Error ? e.message : 'Email failed to send.';
      }
    }

    return { order: updated, emailed, emailError };
  } catch {
    return { error: 'Failed to update the order' };
  }
}

/**
 * Cancel, refund, or reopen an order.
 *
 * This only records the decision. Moving the money is done in Stripe: doing it
 * from here would need write access to payments, which this dashboard
 * deliberately does not have.
 */
export async function setOrderStatus(input: {
  id: string;
  status: 'paid' | 'cancelled' | 'refunded';
}) {
  try {
    if (!(await isAdmin())) return { error: 'Authentication required' };
    if (!['paid', 'cancelled', 'refunded'].includes(input.status)) {
      return { error: 'Unknown status.' };
    }

    const order = await prisma.order.update({
      where: { id: input.id },
      data: { status: input.status },
      select: ORDER_SELECT,
    });
    return { order };
  } catch {
    return { error: 'Failed to change the status' };
  }
}

export async function saveOrderNote(input: { id: string; note: string }) {
  try {
    if (!(await isAdmin())) return { error: 'Authentication required' };
    const order = await prisma.order.update({
      where: { id: input.id },
      data: { admin_note: input.note.trim().slice(0, 2000) || null },
      select: ORDER_SELECT,
    });
    return { order };
  } catch {
    return { error: 'Failed to save the note' };
  }
}

/** "Send to Printify": create the order there, or push an existing one to production. */
export async function sendOrderToPrintify(id: string) {
  try {
    if (!(await isAdmin())) return { error: 'Authentication required' };
    const r = await retryPrintifyOrder(id);
    if (!r.ok) return { error: r.error };

    const order = await prisma.order.findUnique({ where: { id }, select: ORDER_SELECT });
    return { order, note: r.note ?? 'Sent to Printify.' };
  } catch {
    return { error: 'Failed to contact Printify' };
  }
}

/**
 * Printify personal access tokens expire one year after they are issued and
 * there is no refresh: fulfilment simply stops. The dashboard warns well ahead
 * of that so the token can be replaced before an order is lost.
 */
export async function printifyTokenStatus() {
  try {
    if (!(await isAdmin())) return { error: 'Authentication required' };
    if (!isPrintifyConfigured()) return { configured: false as const };
    const expiresOn = printifyTokenExpiry();
    if (!expiresOn) return { configured: true as const, expiresOn: null, daysLeft: null };
    return { configured: true as const, expiresOn, daysLeft: daysUntil(expiresOn) };
  } catch {
    return { error: 'Failed to read the Printify token status' };
  }
}

/**
 * Pull the Printify catalogue into Product / ProductVariant on demand. The same
 * code runs nightly on cron; this is the button for when a new design should
 * appear on the site now. `dryRun` reports what would change and writes nothing.
 */
export async function syncPrintifyProducts(dryRun = false) {
  try {
    if (!(await isAdmin())) return { error: 'Authentication required' };
    const report = await syncPrintifyCatalogue({ dryRun });
    if (!report.ok) return { error: report.error ?? 'The Printify sync failed.' };
    if (!dryRun && report.created + report.updated + report.deactivated > 0) {
      revalidateStore(report.products.map((p) => p.slug));
    }
    return { report };
  } catch (e) {
    console.error('syncPrintifyProducts', e);
    return { error: 'Failed to sync the Printify catalogue' };
  }
}

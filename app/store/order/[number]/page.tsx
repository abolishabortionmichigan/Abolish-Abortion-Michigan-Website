import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { retrieveSession, settleOrder } from '@/lib/settlement';
import { formatMoney, formatOrderDate, ORDER_STATUS_LABEL } from '@/lib/format';
import ClearCartOnMount from '@/components/store/ClearCartOnMount';

export const metadata: Metadata = {
  title: 'Your order',
  robots: { index: false, follow: false },
};

/*
 * Stripe returns the buyer here with ?session_id=.
 *
 * ACCESS CONTROL: the order is shown only to someone holding the matching
 * Stripe session id — the buyer who just paid. An order number on its own
 * reveals nothing, which matters because order numbers are short and
 * guessable. The Made Alive original also allowed the signed-in member who
 * owns the order; this site has no member accounts, so session id is the only
 * key.
 */
export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ number: string }>;
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { number } = await params;
  const { session_id } = await searchParams;

  let order = await prisma.order.findUnique({
    where: { order_number: number },
    include: { items: true },
  });
  if (!order) notFound();

  const holdsSession = Boolean(session_id && order.stripe_session_id === session_id);
  if (!holdsSession) notFound();

  // Settle on return. The webhook does the same thing; whichever arrives
  // first wins, and settleOrder() is idempotent so the second is a no-op.
  if (order.status === 'pending') {
    const session = await retrieveSession(session_id!);
    if (session) {
      await settleOrder(session);
      order = await prisma.order.findUnique({ where: { id: order.id }, include: { items: true } });
      if (!order) notFound();
    }
  }

  const paid = order.status !== 'pending' && order.status !== 'cancelled';
  const addr = order.shipping_address as {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postal_code?: string;
  } | null;

  const heading = paid
    ? 'Thank you for your order'
    : order.status === 'cancelled'
      ? 'This order was cancelled'
      : 'Your payment is processing';

  const blurb = paid
    ? `A confirmation is on its way to ${order.email}. We will email you again when your order ships.`
    : order.status === 'cancelled'
      ? 'No payment was taken. Your cart is still saved on this device.'
      : 'Bank payments can take a few business days to clear. We will email you as soon as it does.';

  return (
    <div className="bg-white px-5 py-12">
      {paid && <ClearCartOnMount orderNumber={order.order_number} totalCents={order.total_cents} />}

      <div className="mx-auto max-w-3xl">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Order {order.order_number}</p>
        <h1 className="mt-2 text-3xl font-black text-gray-900 md:text-4xl">{heading}</h1>
        <div className="mt-3 h-[3px] w-16 bg-red-600" />
        <p className="mt-4 text-lg text-gray-700">{blurb}</p>

        <div className="mt-8 rounded-lg border border-gray-200 px-6 py-6">
          <div className="flex flex-wrap justify-between gap-2 text-sm text-gray-500">
            <span>Status: {ORDER_STATUS_LABEL[order.status] ?? order.status}</span>
            <span>Placed {formatOrderDate(order.created_at)}</span>
          </div>

          <ul className="mt-4 divide-y divide-gray-200 border-t border-gray-200">
            {order.items.map((i) => (
              <li key={i.id} className="flex justify-between gap-4 py-3">
                <span className="text-gray-900">
                  {i.name}
                  {i.variant_label ? <span className="text-gray-500"> ({i.variant_label})</span> : null}
                  {' '}&times;{' '}{i.quantity}
                </span>
                <span className="shrink-0 text-gray-900">
                  {formatMoney(i.unit_price_cents * i.quantity)}
                </span>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-gray-200 pt-4">
            <div className="flex justify-between">
              <dt className="text-gray-600">Subtotal</dt>
              <dd className="text-gray-900">{formatMoney(order.subtotal_cents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-600">Shipping</dt>
              <dd className="text-gray-900">
                {order.shipping_cents === 0 ? 'Free' : formatMoney(order.shipping_cents)}
              </dd>
            </div>
            {order.tax_cents > 0 && (
              <div className="flex justify-between">
                <dt className="text-gray-600">Tax</dt>
                <dd className="text-gray-900">{formatMoney(order.tax_cents)}</dd>
              </div>
            )}
            <div className="flex justify-between border-t border-gray-200 pt-2 font-bold">
              <dt className="text-gray-900">Total</dt>
              <dd className="text-gray-900">{formatMoney(order.total_cents)}</dd>
            </div>
          </dl>

          {addr && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h2 className="mb-1 font-bold text-gray-900">Shipping to</h2>
              <p className="text-gray-700">
                {[order.shipping_name, addr.line1, addr.line2, [addr.city, addr.state, addr.postal_code].filter(Boolean).join(', ')]
                  .filter(Boolean)
                  .map((part, i) => (
                    <span key={i}>
                      {part}
                      <br />
                    </span>
                  ))}
              </p>
            </div>
          )}

          {order.tracking_number && (
            <div className="mt-6 border-t border-gray-200 pt-4">
              <h2 className="mb-1 font-bold text-gray-900">Tracking</h2>
              <p className="text-gray-700">
                {order.carrier ? `${order.carrier} ` : ''}
                <strong>{order.tracking_number}</strong>
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-sm text-gray-500">
          Questions about this order? Reply to your confirmation email or{' '}
          <Link href="/contact" className="underline underline-offset-2 hover:text-red-700">
            contact us
          </Link>
          .
        </p>

        <p className="mt-8">
          <Link href="/store" className="font-semibold text-red-700 underline underline-offset-2">
            Back to the store
          </Link>
        </p>
      </div>
    </div>
  );
}

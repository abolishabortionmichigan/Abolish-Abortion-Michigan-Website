/**
 * Shared formatters. Safe to import from client components.
 *
 * Money is stored in integer cents everywhere in the store (never floats), so
 * every display path goes through here rather than dividing inline.
 */

export function formatMoney(cents: number): string {
  return (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

/** "$18.00" for a single price, "$18.00 – $24.00" for a range. */
export function formatPriceRange(from: number, to: number): string {
  return from === to ? formatMoney(from) : `${formatMoney(from)} – ${formatMoney(to)}`;
}

export function formatOrderDate(d: Date | string): string {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** Human labels for Order.status. Keep in sync with the schema comment. */
export const ORDER_STATUS_LABEL: Record<string, string> = {
  pending: 'Awaiting payment',
  paid: 'Paid',
  shipped: 'Shipped',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

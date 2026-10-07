'use client';

import { useEffect } from 'react';
import { useCart } from '@/store/cart';
import { capture } from '@/lib/analytics';

/** Rendered only on a confirmed-paid order page: empties the local cart once. */
export default function ClearCartOnMount({
  orderNumber,
  totalCents,
}: {
  orderNumber: string;
  totalCents: number;
}) {
  const clear = useCart((s) => s.clear);
  useEffect(() => {
    clear();
    capture('store_order_paid', { order: orderNumber, total_cents: totalCents });
  }, [clear, orderNumber, totalCents]);
  return null;
}

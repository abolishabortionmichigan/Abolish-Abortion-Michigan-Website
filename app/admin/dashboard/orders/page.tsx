'use client';

import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertTriangle,
  Loader2,
  Package,
  RefreshCw,
  Search,
  Truck,
} from 'lucide-react';
import {
  listOrders,
  markOrderShipped,
  orderCounts,
  printifyTokenStatus,
  saveOrderNote,
  sendOrderToPrintify,
  setOrderStatus,
  type AdminOrder,
} from '@/lib/actions/admin/store-admin';
import { formatMoney, formatOrderDate, ORDER_STATUS_LABEL } from '@/lib/format';

const TABS = [
  { key: 'all', label: 'All orders' },
  { key: 'paid', label: 'To ship' },
  { key: 'shipped', label: 'Shipped' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'refunded', label: 'Refunded' },
  { key: 'pending', label: 'Unpaid carts' },
] as const;

const STATUS_VARIANT: Record<string, 'pending' | 'success' | 'completed' | 'cancelled' | 'secondary'> = {
  pending: 'pending',
  paid: 'success',
  shipped: 'completed',
  cancelled: 'cancelled',
  refunded: 'secondary',
};

/*
 * Printify's production status, in words an admin can act on. These come from
 * Printify's webhooks (lib/printify-fulfillment.ts); the first few are ours,
 * set while we are still talking to them.
 */
const PRINTIFY_LABEL: Record<string, string> = {
  submitting: 'sending to Printify…',
  sent: 'sent to Printify for printing',
  'on-hold': 'in Printify, on hold (not printing yet)',
  'sending-to-production': 'sent to Printify for printing',
  'in-production': 'being printed by Printify',
  shipped: 'shipped by Printify',
  fulfilled: 'shipped by Printify',
  'partially-fulfilled': 'partly shipped by Printify',
  failed: 'NOT sent to Printify',
  canceled: 'cancelled in Printify',
  'has-issues': 'has a problem in Printify',
  'payment-not-received': 'Printify could not charge the card on file',
  unfulfillable: 'Printify cannot make it',
};

const PRINTIFY_PROBLEM = new Set([
  'failed',
  'has-issues',
  'payment-not-received',
  'unfulfillable',
  'canceled',
]);

const printifyLabel = (s: string) => PRINTIFY_LABEL[s] ?? `Printify: ${s}`;

const hasPrintifyTrouble = (o: AdminOrder) =>
  Boolean(o.fulfillment_error) || PRINTIFY_PROBLEM.has(o.printify_status ?? '');

type Address = {
  line1?: string | null;
  line2?: string | null;
  city?: string | null;
  state?: string | null;
  postal_code?: string | null;
};

export default function OrdersAdminPage() {
  const [tab, setTab] = useState<string>('all');
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [tokenWarning, setTokenWarning] = useState<string | null>(null);

  // Detail dialog
  const [open, setOpen] = useState<AdminOrder | null>(null);
  const [carrier, setCarrier] = useState('');
  const [tracking, setTracking] = useState('');
  const [notify, setNotify] = useState(true);
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [dialogError, setDialogError] = useState<string | null>(null);

  /*
   * Fetching is driven by [tab, reloadKey] rather than by calling a loader
   * directly, so no state is set synchronously inside the effect (which would
   * cascade renders). The spinner is turned on by whatever event asked for the
   * data -- a tab click, Refresh, or a mutation -- and turned off here.
   */
  const [reloadKey, setReloadKey] = useState(0);
  const reload = useCallback(() => {
    setLoading(true);
    setReloadKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let alive = true;
    Promise.all([listOrders(tab), orderCounts()]).then(([res, countRes]) => {
      if (!alive) return;
      if ('error' in res) {
        setError(res.error ?? 'Something went wrong.');
        setOrders([]);
      } else {
        setError(null);
        setOrders(res.orders);
      }
      if (!('error' in countRes)) setCounts(countRes.counts);
      setLoading(false);
    });
    return () => {
      alive = false;
    };
  }, [tab, reloadKey]);

  useEffect(() => {
    printifyTokenStatus().then((r) => {
      if ('error' in r || !r.configured) return;
      if (r.daysLeft !== null && r.daysLeft <= 45) {
        setTokenWarning(
          `The Printify API token expires in ${r.daysLeft} day${r.daysLeft === 1 ? '' : 's'} (${formatOrderDate(r.expiresOn!)}). Fulfilment stops when it does — generate a new one in Printify and update PRINTIFY_API_TOKEN.`
        );
      }
    });
  }, []);

  const openOrder = (o: AdminOrder) => {
    setOpen(o);
    setCarrier(o.carrier ?? '');
    setTracking(o.tracking_number ?? '');
    setNote(o.admin_note ?? '');
    setNotify(o.status !== 'shipped');
    setNotice(null);
    setDialogError(null);
  };

  // Replace the order in place so the list reflects the change without a reload.
  const applyUpdate = (updated: AdminOrder) => {
    setOpen(updated);
    setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
  };

  const doShip = async () => {
    if (!open) return;
    setBusy(true);
    setNotice(null);
    setDialogError(null);
    const r = await markOrderShipped({ id: open.id, carrier, tracking, notify });
    if ('error' in r) {
      setDialogError(r.error ?? 'Something went wrong.');
    } else {
      applyUpdate(r.order);
      setNotice(
        r.emailed
          ? 'Marked shipped and the buyer has been emailed.'
          : r.emailError
            ? `Marked shipped, but the email failed: ${r.emailError}`
            : 'Marked shipped. No email was sent.'
      );
      reload();
    }
    setBusy(false);
  };

  const doPrintify = async () => {
    if (!open) return;
    setBusy(true);
    setNotice(null);
    setDialogError(null);
    const r = await sendOrderToPrintify(open.id);
    if ('error' in r) {
      setDialogError(r.error ?? 'Something went wrong.');
    } else {
      if (r.order) applyUpdate(r.order);
      setNotice(r.note);
    }
    setBusy(false);
  };

  const doStatus = async (status: 'paid' | 'cancelled' | 'refunded') => {
    if (!open) return;
    setBusy(true);
    setNotice(null);
    setDialogError(null);
    const r = await setOrderStatus({ id: open.id, status });
    if ('error' in r) {
      setDialogError(r.error ?? 'Something went wrong.');
    } else {
      applyUpdate(r.order);
      setNotice(`Order marked ${ORDER_STATUS_LABEL[status]?.toLowerCase() ?? status}.`);
      reload();
    }
    setBusy(false);
  };

  const doSaveNote = async () => {
    if (!open) return;
    setBusy(true);
    setDialogError(null);
    const r = await saveOrderNote({ id: open.id, note });
    if ('error' in r) setDialogError(r.error ?? 'Something went wrong.');
    else {
      applyUpdate(r.order);
      setNotice('Note saved.');
    }
    setBusy(false);
  };

  const term = search.trim().toLowerCase();
  const visible = term
    ? orders.filter(
        (o) =>
          o.order_number.toLowerCase().includes(term) ||
          o.email.toLowerCase().includes(term) ||
          (o.shipping_name ?? '').toLowerCase().includes(term) ||
          (o.name ?? '').toLowerCase().includes(term)
      )
    : orders;

  const addr = (open?.shipping_address ?? null) as Address | null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-sm text-gray-500">
            Store orders, fulfilment status, and shipping notifications.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={reload} disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {tokenWarning && (
        <div className="flex items-start gap-3 rounded-md border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-900">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{tokenWarning}</p>
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => {
              setLoading(true);
              setTab(t.key);
            }}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {t.label}
            {counts[t.key] ? (
              <span className={tab === t.key ? 'ml-2 text-red-100' : 'ml-2 text-gray-500'}>
                {counts[t.key]}
              </span>
            ) : null}
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search order number, email, or name"
          className="pl-9"
        />
      </div>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16 text-gray-500">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Loading orders…
        </div>
      ) : visible.length === 0 ? (
        <div className="rounded-lg border border-gray-200 px-6 py-16 text-center">
          <Package className="mx-auto mb-3 h-8 w-8 text-gray-300" />
          <p className="font-semibold text-gray-900">
            {term ? 'No orders match that search' : 'No orders here yet'}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {term
              ? 'Try the order number, the buyer email, or their name.'
              : tab === 'pending'
                ? 'Unpaid carts appear here when someone starts checkout and does not finish.'
                : 'Orders appear here as soon as a payment completes.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3 font-semibold">Order</th>
                <th className="px-4 py-3 font-semibold">Buyer</th>
                <th className="px-4 py-3 font-semibold">Placed</th>
                <th className="px-4 py-3 font-semibold">Total</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {visible.map((o) => (
                <tr key={o.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-4 py-3 font-mono font-semibold text-gray-900">
                    {o.order_number}
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-gray-900">{o.shipping_name || o.name || '—'}</div>
                    <div className="text-xs text-gray-500">{o.email}</div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                    {formatOrderDate(o.created_at)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-900">
                    {formatMoney(o.total_cents)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge variant={STATUS_VARIANT[o.status] ?? 'secondary'}>
                        {ORDER_STATUS_LABEL[o.status] ?? o.status}
                      </Badge>
                      {hasPrintifyTrouble(o) && (
                        <Badge variant="destructive">Printify problem</Badge>
                      )}
                    </div>
                    {o.printify_status && !hasPrintifyTrouble(o) && (
                      <div className="mt-1 text-xs text-gray-500">
                        {printifyLabel(o.printify_status)}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    <Button variant="outline" size="sm" onClick={() => openOrder(o)}>
                      Open
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={Boolean(open)} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          {open && (
            <>
              <DialogHeader>
                <DialogTitle className="flex flex-wrap items-center gap-3">
                  <span className="font-mono">{open.order_number}</span>
                  <Badge variant={STATUS_VARIANT[open.status] ?? 'secondary'}>
                    {ORDER_STATUS_LABEL[open.status] ?? open.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>

              {notice && (
                <p className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
                  {notice}
                </p>
              )}
              {dialogError && (
                <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                  {dialogError}
                </p>
              )}

              <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Buyer</p>
                    <p className="text-gray-900">{open.shipping_name || open.name || '—'}</p>
                    <p className="text-sm text-gray-600">{open.email}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Placed</p>
                    <p className="text-gray-900">{formatOrderDate(open.created_at)}</p>
                    {open.paid_at && (
                      <p className="text-sm text-gray-600">
                        Paid {formatOrderDate(open.paid_at)}
                      </p>
                    )}
                  </div>
                </div>

                {addr && (
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">Ship to</p>
                    <p className="text-gray-900">
                      {[
                        addr.line1,
                        addr.line2,
                        [addr.city, addr.state, addr.postal_code].filter(Boolean).join(', '),
                      ]
                        .filter(Boolean)
                        .map((line, i) => (
                          <span key={i}>
                            {line}
                            <br />
                          </span>
                        ))}
                    </p>
                  </div>
                )}

                <div>
                  <p className="mb-2 text-xs uppercase tracking-wide text-gray-500">Items</p>
                  <ul className="divide-y divide-gray-200 border-y border-gray-200">
                    {open.items.map((i) => (
                      <li key={i.id} className="flex justify-between gap-4 py-2">
                        <span className="text-gray-900">
                          {i.name}
                          {i.variant_label && (
                            <span className="text-gray-500"> ({i.variant_label})</span>
                          )}{' '}
                          &times; {i.quantity}
                        </span>
                        <span className="shrink-0 text-gray-900">
                          {formatMoney(i.unit_price_cents * i.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <dl className="mt-3 space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Subtotal</dt>
                      <dd>{formatMoney(open.subtotal_cents)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-gray-600">Shipping</dt>
                      <dd>
                        {open.shipping_cents === 0 ? 'Free' : formatMoney(open.shipping_cents)}
                      </dd>
                    </div>
                    {open.tax_cents > 0 && (
                      <div className="flex justify-between">
                        <dt className="text-gray-600">Tax</dt>
                        <dd>{formatMoney(open.tax_cents)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-gray-200 pt-1 font-bold">
                      <dt>Total</dt>
                      <dd>{formatMoney(open.total_cents)}</dd>
                    </div>
                  </dl>
                </div>

                {/* Printify */}
                <div className="rounded-md border border-gray-200 px-4 py-3">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-gray-500">Fulfilment</p>
                      <p className="text-gray-900">
                        {open.printify_status
                          ? printifyLabel(open.printify_status)
                          : 'not sent to Printify'}
                      </p>
                      {open.printify_order_id && (
                        <p className="text-xs text-gray-500">
                          Printify order {open.printify_order_id}
                        </p>
                      )}
                      {open.fulfillment_error && (
                        <p className="mt-1 text-sm text-red-700">{open.fulfillment_error}</p>
                      )}
                    </div>
                    {open.status === 'paid' && (
                      <Button variant="outline" size="sm" onClick={doPrintify} disabled={busy}>
                        {busy ? (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                          <Package className="mr-2 h-4 w-4" />
                        )}
                        Send to Printify
                      </Button>
                    )}
                  </div>
                </div>

                {/* Shipping */}
                <div className="rounded-md border border-gray-200 px-4 py-3">
                  <p className="mb-3 text-xs uppercase tracking-wide text-gray-500">
                    Mark shipped
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <Label htmlFor="carrier">Carrier</Label>
                      <Input
                        id="carrier"
                        value={carrier}
                        onChange={(e) => setCarrier(e.target.value)}
                        placeholder="USPS"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tracking">Tracking number</Label>
                      <Input
                        id="tracking"
                        value={tracking}
                        onChange={(e) => setTracking(e.target.value)}
                        placeholder="9400 1000 0000 0000 0000 00"
                      />
                    </div>
                  </div>
                  <label className="mt-3 flex items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={notify}
                      onChange={(e) => setNotify(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    Email the buyer that it has shipped
                  </label>
                  <Button className="mt-3" onClick={doShip} disabled={busy || !tracking.trim()}>
                    {busy ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Truck className="mr-2 h-4 w-4" />
                    )}
                    Mark shipped
                  </Button>
                </div>

                {/* Internal note */}
                <div>
                  <Label htmlFor="note">Internal note</Label>
                  <Textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    placeholder="Only visible here. The buyer never sees this."
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={doSaveNote}
                    disabled={busy}
                  >
                    Save note
                  </Button>
                </div>
              </div>

              <DialogFooter className="flex-wrap gap-2">
                <p className="mr-auto text-xs text-gray-500">
                  Refunds are issued in Stripe. Changing the status here only records it.
                </p>
                {open.status !== 'cancelled' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => doStatus('cancelled')}
                    disabled={busy}
                  >
                    Cancel order
                  </Button>
                )}
                {open.status !== 'refunded' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => doStatus('refunded')}
                    disabled={busy}
                  >
                    Mark refunded
                  </Button>
                )}
                {(open.status === 'cancelled' || open.status === 'refunded') && (
                  <Button size="sm" onClick={() => doStatus('paid')} disabled={busy}>
                    Reopen as paid
                  </Button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

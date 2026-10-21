'use client';

/*
 * Add money to the Stripe balance with a debit card.
 *
 * The card is typed on Stripe's own hosted page, never here -- this screen
 * only collects an amount and hands off. See lib/actions/admin/funding-actions
 * for why this is a charge rather than a /v1/topups top-up, and what it costs.
 */

import { Suspense, useCallback, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CheckCircle2, CreditCard, Loader2, RefreshCw } from 'lucide-react';
import {
  startFunding,
  confirmFunding,
  listFunding,
  type FundingSummary,
} from '@/lib/actions/admin/funding-actions';
import { formatDate } from '@/lib/utils';

const money = (cents: number) =>
  (cents / 100).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

const QUICK = ['25', '50', '100', '250'];

const BADGE: Record<string, { label: string; className: string }> = {
  paid: { label: 'Paid', className: 'bg-green-100 text-green-800 hover:bg-green-100' },
  pending: { label: 'Pending', className: 'bg-amber-100 text-amber-800 hover:bg-amber-100' },
  cancelled: { label: 'Cancelled', className: 'bg-gray-100 text-gray-600 hover:bg-gray-100' },
};

function Funding() {
  const router = useRouter();
  const params = useSearchParams();
  const sessionId = params.get('session_id');
  const cancelled = params.get('cancelled');

  const [data, setData] = useState<FundingSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [justPaid, setJustPaid] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setData(await listFunding());
    } finally {
      setLoading(false);
    }
  }, []);

  /*
   * Returning from Stripe. The webhook settles this too, so this is only to
   * make the row show as paid immediately instead of on the next refresh.
   * The query string is cleared either way so a reload isn't a re-confirm.
   */
  useEffect(() => {
    (async () => {
      if (sessionId) {
        const r = await confirmFunding(sessionId);
        if (r.ok) setJustPaid(true);
        else setError(r.error ?? 'Could not confirm the payment.');
        router.replace('/admin/dashboard/funding');
      }
      await load();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  async function submit() {
    setBusy(true);
    setError(null);
    setJustPaid(false);
    try {
      const r = await startFunding(amount, note);
      if (!r.ok) {
        setError(r.error);
        return;
      }
      // Stripe's hosted page. Same tab, so success_url brings us back here.
      window.location.href = r.url;
    } catch {
      setError('Could not reach Stripe.');
    } finally {
      setBusy(false);
    }
  }

  const totals = data?.totals;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold">Fund Stripe Balance</h1>
          <p className="text-sm text-gray-500 mt-1">
            Working capital for print-on-demand costs. Not a donation and not sales revenue.
          </p>
        </div>
        <Button variant="outline" size="icon" onClick={load} disabled={loading} title="Refresh">
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {justPaid && (
        <div className="flex items-start gap-2 rounded-md border border-green-200 bg-green-50 p-3 text-sm text-green-800">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Payment received. Like any card payment it lands in the pending balance first and
            becomes spendable on Stripe&apos;s normal availability schedule — about two business
            days — so it is faster than a bank top-up but not instant.
          </span>
        </div>
      )}

      {cancelled && !justPaid && (
        <div className="rounded-md border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
          Top-up {cancelled} was cancelled. Nothing was charged.
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-800">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">New top-up</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="amount">Amount (USD)</Label>
              <Input
                id="amount"
                inputMode="decimal"
                placeholder="57.61"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="mt-1"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {QUICK.map((q) => (
                  <Button
                    key={q}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(q)}
                  >
                    ${q}
                  </Button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="note">Note (optional)</Label>
              <Input
                id="note"
                placeholder="Covers order AAM-JXKQG5"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="mt-1"
                maxLength={200}
              />
            </div>
          </div>

          <Button onClick={submit} disabled={busy || !amount.trim()} className="w-full sm:w-auto">
            {busy ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Opening Stripe…
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" /> Continue to Stripe
              </>
            )}
          </Button>

          <p className="text-xs text-gray-500">
            The card is entered on Stripe&apos;s own payment page — it never reaches this site
            and is not saved, so each top-up asks for it again. Stripe charges its standard card
            fee (about 2.9% + 30¢), deducted before the money lands. Funds clear in roughly two
            business days. A bank transfer from the Stripe dashboard is free but takes five to
            six, so use this when an order is waiting and that is too slow.
          </p>
        </CardContent>
      </Card>

      {totals && totals.count > 0 && (
        <div className="grid gap-3 sm:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-gray-500">Charged</p>
              <p className="text-2xl font-bold">{money(totals.gross_cents)}</p>
              <p className="mt-1 text-xs text-gray-500">
                {totals.count} top-up{totals.count === 1 ? '' : 's'}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-gray-500">Stripe fees</p>
              <p className="text-2xl font-bold text-red-700">{money(totals.fee_cents)}</p>
              <p className="mt-1 text-xs text-gray-500">Cost of funding by card</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-xs uppercase tracking-wide text-gray-500">Reached balance</p>
              <p className="text-2xl font-bold">{money(totals.net_cents)}</p>
              <p className="mt-1 text-xs text-gray-500">Spendable</p>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">History</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && !data ? (
            <div className="flex items-center justify-center py-8 text-gray-500">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          ) : data?.error ? (
            <p className="py-6 text-sm text-red-700">{data.error}</p>
          ) : !data?.rows.length ? (
            <p className="py-6 text-sm text-gray-500">No top-ups yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-xs uppercase tracking-wide text-gray-500">
                    <th className="py-2 pr-4 font-medium">Reference</th>
                    <th className="py-2 pr-4 font-medium">Date</th>
                    <th className="py-2 pr-4 font-medium">Status</th>
                    <th className="py-2 pr-4 text-right font-medium">Charged</th>
                    <th className="py-2 pr-4 text-right font-medium">Fee</th>
                    <th className="py-2 pr-4 text-right font-medium">Net</th>
                    <th className="py-2 font-medium">Note</th>
                  </tr>
                </thead>
                <tbody>
                  {data.rows.map((r) => {
                    const badge = BADGE[r.status] ?? {
                      label: r.status,
                      className: 'bg-gray-100 text-gray-600',
                    };
                    return (
                      <tr key={r.id} className="border-b last:border-0">
                        <td className="py-2 pr-4 font-mono text-xs">{r.reference}</td>
                        <td className="py-2 pr-4 whitespace-nowrap text-gray-600">
                          {formatDate(r.paid_at ?? r.created_at)}
                        </td>
                        <td className="py-2 pr-4">
                          <Badge className={badge.className}>{badge.label}</Badge>
                        </td>
                        <td className="py-2 pr-4 text-right">{money(r.amount_cents)}</td>
                        <td className="py-2 pr-4 text-right text-gray-500">
                          {r.fee_cents === null ? '—' : money(r.fee_cents)}
                        </td>
                        <td className="py-2 pr-4 text-right">
                          {r.net_cents === null ? '—' : money(r.net_cents)}
                        </td>
                        <td className="py-2 text-gray-600">{r.note ?? ''}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default function FundingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-12 text-gray-500">
          <Loader2 className="h-5 w-5 animate-spin" />
        </div>
      }
    >
      <Funding />
    </Suspense>
  );
}

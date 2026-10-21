'use server';

/*
 * Funding the Stripe balance from the admin with a debit card.
 *
 * WHY THIS EXISTS
 * The store pays Printify per order, and that bill is charged to a card
 * backed by the Stripe balance. Until sales cover it, the balance has to be
 * topped up by hand, and an order can sit unfulfilled waiting for it.
 *
 * WHY IT IS A CHARGE AND NOT A TOP-UP
 * Stripe's top-up API (/v1/topups) is the "proper" way to add funds, but it
 * only accepts a us_bank_account payment method -- ACH debit from a verified
 * bank account, which settles in 5-6 business days. Cards are not a supported
 * top-up source at all. So a card can only reach the balance as an ordinary
 * payment where AAM is the merchant.
 *
 * That is faster than ACH but NOT instantly spendable: like any card payment
 * it lands in the pending balance and becomes available on the account's
 * normal funds-availability schedule (about two business days for a US
 * account). And it pays the usual ~2.9% + 30c, which is recorded per row so
 * the cost of funding this way is never invisible.
 *
 * NO CARD DETAILS, ANYWHERE
 * The card is collected on Stripe's hosted Checkout page, so it never touches
 * this server, this database or these logs. Nothing here creates a Stripe
 * Customer, sets setup_future_usage, or attaches a payment method, which are
 * the three ways a card would get saved for reuse -- so it cannot be. Each
 * top-up asks for the card again, by design.
 *
 * This is operator working capital, not a gift and not revenue. Public
 * donations still go through Zeffy at 0% (see lib/stripe.ts).
 */

import { randomInt } from 'crypto';
import { getAuthToken, verifyToken } from '../auth-actions';
import prisma from '@/lib/prisma';
import { getStripe, isStripeConfigured } from '@/lib/stripe';
import { settleFunding } from '@/lib/settlement';
import { SITE_URL, ORG_NAME } from '@/lib/site';

/** The admin's email if the caller is an admin, else null. */
async function adminEmail(): Promise<string | null> {
  const token = await getAuthToken();
  if (!token) return null;
  const result = await verifyToken(token);
  if (!result.authorized || result.user?.role !== 'admin') return null;
  return result.user?.email ?? null;
}

const MIN_CENTS = 100;
/*
 * A ceiling on one top-up. This is a typo guard, not a policy: "5000" meant as
 * $50.00 is otherwise a $5,000 charge. Raise FUNDING_MAX_DOLLARS if a genuine
 * top-up needs to be bigger.
 */
const MAX_CENTS = Math.round(Number(process.env.FUNDING_MAX_DOLLARS ?? 2000) * 100);

/**
 * Dollars as typed -> exact cents, or null if it isn't a plain amount.
 * Parsed by hand rather than with parseFloat, which cannot represent 57.61.
 */
function toCents(input: string): number | null {
  const m = /^\$?\s*(\d{1,6})(?:\.(\d{1,2}))?$/.exec(input.trim().replace(/,/g, ''));
  if (!m) return null;
  return Number(m[1]) * 100 + Number((m[2] ?? '0').padEnd(2, '0'));
}

/** FUND-XXXXXX, no ambiguous characters (no 0/O, 1/I). */
function newFundingReference(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let s = '';
  for (let i = 0; i < 6; i++) s += alphabet[randomInt(alphabet.length)];
  return `FUND-${s}`;
}

export type StartFundingResult = { ok: true; url: string } | { ok: false; error: string };

/**
 * Records a pending top-up and returns the Stripe Checkout URL to send the
 * admin to. Nothing is charged until they complete that page, and the row
 * stays `pending` until settleFunding sees the payment.
 */
export async function startFunding(amount: string, note?: string): Promise<StartFundingResult> {
  const email = await adminEmail();
  if (!email) return { ok: false, error: 'Not authorised.' };
  if (!isStripeConfigured()) return { ok: false, error: 'Stripe is not configured.' };

  const cents = toCents(amount);
  if (cents === null) return { ok: false, error: 'Enter an amount like 57.61.' };
  if (cents < MIN_CENTS) return { ok: false, error: 'Minimum top-up is $1.00.' };
  if (cents > MAX_CENTS) {
    return { ok: false, error: `Maximum top-up is $${(MAX_CENTS / 100).toFixed(2)} per transaction.` };
  }

  const stripe = getStripe();
  if (!stripe) return { ok: false, error: 'Stripe is not configured.' };

  const trimmed = note?.trim().slice(0, 200) || null;

  // Retried only for a reference collision, which is a 1-in-a-billion draw.
  let funding: { id: string; reference: string } | null = null;
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      funding = await prisma.funding.create({
        data: { reference: newFundingReference(), amount_cents: cents, note: trimmed, created_by: email },
        select: { id: true, reference: true },
      });
      break;
    } catch (e) {
      if (attempt === 3) console.error('Funding create failed:', e instanceof Error ? e.message : e);
    }
  }
  if (!funding) return { ok: false, error: 'Could not start the top-up.' };

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      /*
       * Card only, deliberately. Leaving this to the automatic payment methods
       * would offer Link, whose whole purpose is remembering the card for next
       * time -- the one thing this flow must not do.
       */
      payment_method_types: ['card'],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: 'usd',
            unit_amount: cents,
            product_data: { name: `${ORG_NAME} - Stripe balance top-up` },
          },
        },
      ],
      // No automatic_tax and no shipping: moving money into our own balance is
      // not a sale, whatever STRIPE_AUTOMATIC_TAX is set to.
      metadata: { kind: 'funding', funding_id: funding.id, reference: funding.reference },
      payment_intent_data: {
        description: `${ORG_NAME} balance top-up ${funding.reference}`,
        metadata: { kind: 'funding', funding_id: funding.id, reference: funding.reference },
      },
      success_url: `${SITE_URL}/admin/dashboard/funding?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/admin/dashboard/funding?cancelled=${funding.reference}`,
      expires_at: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
    });

    await prisma.funding.update({ where: { id: funding.id }, data: { stripe_session_id: session.id } });

    if (!session.url) return { ok: false, error: 'Stripe did not return a checkout URL.' };
    return { ok: true, url: session.url };
  } catch (e) {
    console.error('Funding checkout failed:', e instanceof Error ? e.message : e);
    await prisma.funding.updateMany({
      where: { id: funding.id, status: 'pending' },
      data: { status: 'cancelled' },
    });
    return { ok: false, error: 'Stripe refused the top-up. Check the Stripe dashboard.' };
  }
}

/**
 * Settles the session the admin just came back from. The webhook settles it
 * too; both call the same idempotent settleFunding, so whichever lands first
 * wins and the other is a no-op.
 */
export async function confirmFunding(sessionId: string): Promise<{ ok: boolean; error?: string }> {
  if (!(await adminEmail())) return { ok: false, error: 'Not authorised.' };
  const stripe = getStripe();
  if (!stripe || !/^cs_(test|live)_[A-Za-z0-9]+$/.test(sessionId)) {
    return { ok: false, error: 'Bad session.' };
  }
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const r = await settleFunding(session);
    return r.ok ? { ok: true } : { ok: false, error: r.error };
  } catch (e) {
    console.error('Funding confirm failed:', e instanceof Error ? e.message : e);
    return { ok: false, error: 'Could not confirm with Stripe.' };
  }
}

export type FundingRow = {
  id: string;
  reference: string;
  status: string;
  amount_cents: number;
  fee_cents: number | null;
  net_cents: number | null;
  note: string | null;
  created_by: string | null;
  paid_at: Date | null;
  created_at: Date;
};

export type FundingSummary = {
  rows: FundingRow[];
  /** Paid rows only. */
  totals: { gross_cents: number; fee_cents: number; net_cents: number; count: number };
  error?: string;
};

/** The 50 most recent top-ups, newest first, with paid totals. */
export async function listFunding(): Promise<FundingSummary> {
  const empty = { rows: [], totals: { gross_cents: 0, fee_cents: 0, net_cents: 0, count: 0 } };
  if (!(await adminEmail())) return { ...empty, error: 'Not authorised.' };

  try {
    const rows = await prisma.funding.findMany({
      orderBy: { created_at: 'desc' },
      take: 50,
      select: {
        id: true,
        reference: true,
        status: true,
        amount_cents: true,
        fee_cents: true,
        net_cents: true,
        note: true,
        created_by: true,
        paid_at: true,
        created_at: true,
      },
    });

    const paid = rows.filter((r) => r.status === 'paid');
    return {
      rows,
      totals: {
        count: paid.length,
        gross_cents: paid.reduce((n, r) => n + r.amount_cents, 0),
        // Unknown fees count as zero rather than guessing a percentage.
        fee_cents: paid.reduce((n, r) => n + (r.fee_cents ?? 0), 0),
        net_cents: paid.reduce((n, r) => n + (r.net_cents ?? r.amount_cents), 0),
      },
    };
  } catch (e) {
    console.error('listFunding failed:', e instanceof Error ? e.message : e);
    return { ...empty, error: 'Could not load the funding history.' };
  }
}

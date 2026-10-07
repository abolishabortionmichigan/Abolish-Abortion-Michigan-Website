import 'server-only';
import Stripe from 'stripe';

/*
 * Stripe, server side only. Used by the STORE ONLY.
 *
 * Donations deliberately do NOT run through Stripe on this site: AAM takes
 * gifts through Zeffy, which is 0% for nonprofits. Routing donations here
 * would start costing roughly 2.2% + 30c on every gift for no benefit. If
 * that ever changes it is a deliberate decision, not a default.
 *
 * Rules this file exists to enforce:
 *   - the server computes every amount from the database, never the browser;
 *   - a payment is re-fetched from Stripe and checked (status + exact amount +
 *     our own reference) before anything is recorded as paid;
 *   - one Checkout Session can settle one order, enforced by a unique column
 *     and a pending->paid transition that only succeeds once.
 *
 * Which payment methods appear (cards, Apple Pay, Google Pay, Link) is
 * controlled in the Stripe Dashboard under Settings -> Payment methods.
 * Apple Pay on a custom domain also needs that domain registered there.
 */

let client: Stripe | null = null;

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  if (!client) client = new Stripe(key);
  return client;
}

export const isStripeConfigured = () => Boolean(process.env.STRIPE_SECRET_KEY);

/** Flat-rate shipping, overridable per environment without a code change. */
export const SHIPPING = {
  flatCents: Number(process.env.STORE_SHIPPING_CENTS ?? 600),
  // 0 disables free shipping.
  freeOverCents: Number(process.env.STORE_FREE_SHIPPING_OVER_CENTS ?? 7500),
};

export function shippingFor(subtotalCents: number): number {
  if (SHIPPING.freeOverCents > 0 && subtotalCents >= SHIPPING.freeOverCents) return 0;
  return SHIPPING.flatCents;
}

/**
 * Stripe Tax is opt-in: enable it in the Dashboard (with a Michigan
 * registration, plus any other state AAM crosses a nexus threshold in) and
 * set STRIPE_AUTOMATIC_TAX=true. Until then no sales tax is charged, which is
 * a decision for AAM and its accountant rather than a default this code
 * should make. Selling physical goods creates a Michigan obligation
 * immediately, so this should be settled before launch, not after.
 */
export const AUTOMATIC_TAX = process.env.STRIPE_AUTOMATIC_TAX === 'true';

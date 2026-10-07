import 'server-only';
import { printifyApi, isPrintifyConfigured } from './printify';
import { shippingFor } from './stripe';

/*
 * Real shipping cost, quoted by Printify instead of guessed.
 *
 * A flat rate cannot work here. Printify bills per item, and the rate differs
 * per VARIANT, not just per product -- an 11oz and a 15oz mug from the same
 * blueprint quote differently. Measured on the live account: one mug is $7.29
 * and five are $19.65, against the $6.00 flat rate the store used to charge.
 * That lost money on every order, including single-item ones.
 *
 * WHY WE CAN PRICE THIS BEFORE KNOWING THE ADDRESS
 * Stripe Checkout collects the shipping address after the session is created,
 * so at quote time we do not have one. That would normally be fatal. It is not,
 * because Printify's US rate is flat nationwide -- quoting the same cart to MI,
 * CA, NY, AK and HI returns an identical figure. So we quote against a fixed
 * in-state address and the answer is right for every US buyer. The store only
 * ships to the US (shipping_address_collection allows US only); revisit this
 * the day that changes, because the rest of the world is emphatically not flat.
 *
 * FAILURE IS NOT ALLOWED TO BLOCK A SALE
 * If Printify is slow or down, quoting falls back to the flat rate rather than
 * failing checkout. Undercharging shipping on one order beats losing the order.
 */

/** Any real US address works; the rate does not vary within the US. */
const US_QUOTE_ADDRESS = {
  first_name: 'Abolish Abortion',
  last_name: 'Michigan',
  email: 'admin@abolishabortionmichigan.com',
  country: 'US',
  region: 'MI',
  address1: '3665 S Lakeshore Dr',
  address2: 'Suite 4',
  city: 'St Joseph',
  zip: '49085',
};

const QUOTE_TIMEOUT_MS = 6000;

export interface QuoteLine {
  printify_product_id: string | null;
  printify_variant_id: number | null;
  quantity: number;
}

export interface ShippingQuote {
  cents: number;
  /** 'printify' = quoted live. 'flat' = fell back, see reason. */
  source: 'printify' | 'flat';
  reason?: string;
}

/**
 * Quote shipping for a cart.
 *
 * Mixed carts (some print-on-demand, some shipped by AAM) take the greater of
 * the Printify quote and the flat rate rather than adding them: the flat rate
 * is meant to cover a whole parcel, and charging twice for one order would be
 * worse than absorbing a little.
 */
export async function quoteShipping(
  lines: QuoteLine[],
  subtotalCents: number,
): Promise<ShippingQuote> {
  const flat = shippingFor(subtotalCents);

  // Free-shipping promise wins outright; the cost is a deliberate subsidy.
  if (flat === 0) return { cents: 0, source: 'flat', reason: 'free shipping threshold met' };

  const pod = lines.filter(
    (l) => l.printify_product_id && l.printify_variant_id && l.quantity > 0,
  );
  if (pod.length === 0) return { cents: flat, source: 'flat', reason: 'no print-on-demand items' };
  if (!isPrintifyConfigured()) {
    return { cents: flat, source: 'flat', reason: 'Printify not configured' };
  }

  try {
    const shop = process.env.PRINTIFY_SHOP_ID;
    const res = await printifyApi<Record<string, number>>(
      `shops/${shop}/orders/shipping.json`,
      {
        method: 'POST',
        body: {
          line_items: pod.map((l) => ({
            product_id: l.printify_product_id,
            variant_id: l.printify_variant_id,
            quantity: l.quantity,
          })),
          address_to: US_QUOTE_ADDRESS,
        },
        timeoutMs: QUOTE_TIMEOUT_MS,
      },
    );

    // Printify returns { standard: <cents> }, sometimes with faster options.
    const standard = typeof res?.standard === 'number' ? res.standard : null;
    if (standard === null || !Number.isFinite(standard) || standard < 0) {
      return { cents: flat, source: 'flat', reason: 'Printify returned no standard rate' };
    }

    const hasNonPod = pod.length !== lines.filter((l) => l.quantity > 0).length;
    return { cents: hasNonPod ? Math.max(standard, flat) : standard, source: 'printify' };
  } catch (e) {
    return {
      cents: flat,
      source: 'flat',
      reason: e instanceof Error ? e.message.slice(0, 120) : 'Printify quote failed',
    };
  }
}

/**
 * Michigan sales-tax thresholds for a nonprofit's fund-raising sales.
 *
 * MCL 205.54o: the FIRST $10,000 of retail sales in a calendar year is exempt,
 * but only while aggregate retail sales that year stay under $25,000. Past
 * $25,000 the exemption is lost for the entire year -- including that first
 * $10,000 -- so crossing it without having collected tax turns into a bill
 * paid out of pocket.
 *
 * Kept in its own module rather than in the store-admin actions file: that one
 * is 'use server', and a 'use server' module may only export async functions.
 *
 * Thresholds to watch, not tax advice.
 */

/** Collection starts above this. */
export const MI_EXEMPT_CENTS = 1_000_000; // $10,000

/** Above this the whole-year exemption is lost. */
export const MI_CLIFF_CENTS = 2_500_000; // $25,000

export type MiTaxBand = 'exempt' | 'approaching' | 'collecting' | 'near-cliff' | 'over-cliff';

export function miTaxBand(retailCents: number): MiTaxBand {
  if (retailCents >= MI_CLIFF_CENTS) return 'over-cliff';
  if (retailCents >= MI_CLIFF_CENTS * 0.9) return 'near-cliff';
  if (retailCents >= MI_EXEMPT_CENTS) return 'collecting';
  if (retailCents >= MI_EXEMPT_CENTS * 0.8) return 'approaching';
  return 'exempt';
}

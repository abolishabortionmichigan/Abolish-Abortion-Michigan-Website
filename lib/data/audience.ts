import { getSubscribedEmails } from './petition-store';
import { getActiveSubscriberEmails } from './subscriber-store';

/**
 * Single source of truth for "who gets a bulk email from AAM".
 *
 * There are two independent opt-in surfaces:
 *   1. The petition form  -> PetitionSignature.subscribed
 *   2. The footer form    -> Subscriber.subscribed
 *
 * These were previously resolved separately at each call site, and the two
 * call sites disagreed: the admin broadcast unioned both tables, while the
 * new-article newsletter only ever read the petition table. The result was
 * that 14 people who subscribed via the footer and never signed the
 * petition were counted on the dashboard but had never received a single
 * newsletter. Resolving the audience in one place removes that whole class
 * of bug.
 */

export interface AudienceMember {
  name: string;
  email: string;
}

/** Deduplicated union of both opt-in lists, case-insensitive on email. */
export async function getBulkEmailAudience(): Promise<AudienceMember[]> {
  const [petitionSubs, newsletterSubs] = await Promise.all([
    getSubscribedEmails(),
    getActiveSubscriberEmails(),
  ]);

  const seen = new Set<string>();
  const audience: AudienceMember[] = [];

  // Petition signers first: they carry a real name, which personalizes better.
  for (const s of petitionSubs) {
    const email = (s.email || '').trim();
    const key = email.toLowerCase();
    if (!email || seen.has(key)) continue;
    seen.add(key);
    audience.push({ name: s.name || '', email });
  }

  for (const s of newsletterSubs) {
    const email = (s.email || '').trim();
    const key = email.toLowerCase();
    if (!email || seen.has(key)) continue;
    seen.add(key);
    audience.push({ name: '', email });
  }

  return audience;
}

/**
 * Resend's free plan allows 3,000 emails/month but caps sending at 100 per
 * calendar day, and transactional mail (petition confirmations, contact-form
 * replies, admin notifications) draws from that same 100. A bulk send large
 * enough to exhaust the quota therefore silently breaks signup confirmations
 * for the rest of the day.
 *
 * DAILY_BULK_CAP is the most recipients a single bulk send may target.
 * It is DISABLED by default (0 = no cap): Dustin opted to send to the full
 * list and monitor the quota manually rather than have sends silently
 * truncated. The splitting logic below is left in place so the guard can be
 * re-enabled without a code change by setting RESEND_DAILY_BULK_CAP in
 * Vercel (85 leaves headroom for transactional mail on the free plan).
 *
 * On Resend Pro the daily limit disappears entirely and this stays at 0.
 */
export const DAILY_BULK_CAP = Number(process.env.RESEND_DAILY_BULK_CAP || 0);

export interface CappedAudience {
  /** Recipients to send to now. */
  batch: AudienceMember[];
  /** Recipients deferred because they exceeded the daily cap. */
  deferred: AudienceMember[];
  /** True when the audience did not fit inside the cap. */
  capped: boolean;
  cap: number;
  total: number;
}

/**
 * Split an audience against the daily cap. Callers send `batch` now and
 * surface `deferred` to the admin so a partial send is visible rather than
 * silently truncated.
 */
export function applyDailyCap(
  audience: AudienceMember[],
  cap: number = DAILY_BULK_CAP,
): CappedAudience {
  if (cap <= 0 || audience.length <= cap) {
    return { batch: audience, deferred: [], capped: false, cap, total: audience.length };
  }
  return {
    batch: audience.slice(0, cap),
    deferred: audience.slice(cap),
    capped: true,
    cap,
    total: audience.length,
  };
}

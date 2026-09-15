#!/usr/bin/env node
/**
 * One-time org-update broadcast.
 *
 * AUDIENCE (deliberately wider than the normal broadcast):
 *   - ALL petition signers, regardless of their `subscribed` flag
 *   - PLUS newsletter subscribers (Subscriber.subscribed = true) not
 *     already covered by the above
 *
 * Dustin asked for this explicitly as a one-off after being shown that 36
 * petition signers have subscribed=false, meaning they either unchecked the
 * opt-in box at signup or used the unsubscribe link previously. Every
 * message therefore carries a working unsubscribe link and AAM's physical
 * address so the send is CAN-SPAM compliant on its face.
 *
 * Unsubscribe tokens use the same month-scoped HMAC as lib/email.ts, so the
 * links validate against the live /api/unsubscribe route.
 *
 * Usage:
 *   node scripts/send-org-update-all-signers.mjs                 # dry run
 *   node scripts/send-org-update-all-signers.mjs --send
 *   node scripts/send-org-update-all-signers.mjs --send --limit=5 # smoke test
 *   node scripts/send-org-update-all-signers.mjs --send --retry-failed
 *
 * --retry-failed re-targets only the recipients whose earlier attempt failed
 * on Resend's daily quota, read back out of org-update-send-log.csv. Anyone
 * with a successful row in the log is excluded, so a retry cannot duplicate.
 */

import fs from 'node:fs';
import path from 'node:path';
import { createHmac } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { Resend } from 'resend';
import { PrismaClient } from '../lib/generated/prisma/index.js';

const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
for (const line of fs.readFileSync(path.join(REPO_ROOT, '.env.local'), 'utf8').split(/\r?\n/)) {
  const m = line.match(/^\s*([A-Z_][A-Z0-9_]*)\s*=\s*(.*?)\s*$/i);
  if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
}

const args = new Map();
for (const a of process.argv.slice(2)) {
  const m = a.match(/^--([a-z-]+)(?:=(.*))?$/);
  if (m) args.set(m[1], m[2] ?? 'true');
}
const DRY_RUN = !args.has('send');
const LIMIT = Number(args.get('limit') || 0);

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.abolishabortionmichigan.com';
const FROM = 'Abolish Abortion Michigan <admin@abolishabortionmichigan.com>';
const REPLY_TO = 'admin@abolishabortionmichigan.com';
const SUBJECT = 'Who we are, what we are working on, and how you can plug in';
const RATE_MS = 250;

// Same month-scoped HMAC as lib/email.ts generateUnsubscribeToken().
function unsubscribeUrl(email) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET required to mint unsubscribe tokens');
  const d = new Date();
  const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  const token = createHmac('sha256', secret)
    .update(`${email.toLowerCase()}:${month}`)
    .digest('hex');
  return `${BASE_URL}/unsubscribe?email=${encodeURIComponent(email.toLowerCase())}&token=${token}`;
}

const L = (href, text) => `<a href="${href}" style="color:#b91c1c;font-weight:600;">${text}</a>`;
const SIGNAL = 'https://signal.group/#CjQKIJKnCRVq5FifD0RNYPlovNABQHbeXnUqGWGciHeg16WYEhDJ8AInsNGnXU7dpn1B-M7X';

function buildHtml(email) {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f5;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f5f5f5">
<tr><td align="center" style="padding:24px 12px;">
<table width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;background:#ffffff;border-radius:8px;overflow:hidden;">

  <tr><td bgcolor="#1a1a1a" style="padding:28px 24px;text-align:center;">
    <div style="font-family:Georgia,serif;font-size:22px;font-weight:bold;color:#ffffff;letter-spacing:1px;">Abolish Abortion Michigan</div>
  </td></tr>

  <tr><td style="padding:32px 36px;font-family:Georgia,'Times New Roman',serif;font-size:16px;line-height:1.65;color:#333333;">

    <p style="margin:0 0 18px;">Hello,</p>

    <p style="margin:0 0 22px;">If you are subscribed to our email list, you probably already agree that abortion should be abolished, but we thought it would be beneficial to give a definition of who we are, what is happening in the movement, and ways you can be involved with actually helping us in that goal!</p>

    <p style="margin:0 0 10px;font-size:18px;font-weight:bold;color:#1a1a1a;">Who Abolish Abortion Michigan Is</p>
    <p style="margin:0 0 22px;">We are a Michigan 501(c)(3) nonprofit that exists to immediately and fully abolish abortion, which is the intentional killing of human beings made in the image of God. We are not a part of the pro-life movement which counters this goal by trying to regulate, not fully criminalize, abortion. Read more about our position at ${L(BASE_URL + '/what-we-believe', 'abolishabortionmichigan.com/what-we-believe')}.</p>

    <p style="margin:0 0 10px;font-size:18px;font-weight:bold;color:#1a1a1a;">What We Have Been Working on Recently</p>
    <p style="margin:0 0 14px;">We have reached out to over 130 churches to see who supports the abolitionist movement, and we have found that the bench of abolitionist churches and pastors is growing, especially in Reformed Baptist circles. To further this cause, we made a newsletter detailing how a pastor might present abolition to a church which also responds to common objections to a pastor doing that. Read it and send it to your pastor! ${L(BASE_URL + '/news', 'abolishabortionmichigan.com/news')}</p>
    <p style="margin:0 0 22px;">We have also made a scorecard grading Michigan politicians on their stances towards abortion, which you can check out here: ${L(BASE_URL + '/legislators', 'abolishabortionmichigan.com/legislators')}</p>

    <p style="margin:0 0 10px;font-size:18px;font-weight:bold;color:#1a1a1a;">Our 2-Month Plan</p>
    <p style="margin:0 0 10px;">In the next 60 days, our goal is to:</p>
    <ol style="margin:0 0 22px;padding-left:24px;">
      <li style="margin:0 0 8px;">Publish a finalized abolitionist pastor toolkit</li>
      <li style="margin:0 0 8px;">Continue finding more churches that support abolition and make a directory</li>
      <li style="margin:0 0 8px;">Personally contact Michigan legislators to update the scorecard and influence them towards abolition</li>
    </ol>

    <p style="margin:0 0 10px;font-size:18px;font-weight:bold;color:#1a1a1a;">How You Can Plug In</p>
    <ol style="margin:0 0 22px;padding-left:24px;">
      <li style="margin:0 0 14px;">${L(SIGNAL, 'Join our Signal group')}. This is the easiest and most important thing you could do right now to help the abolitionist cause, because it will allow you to connect with other abolitionists in your area and allow us to coordinate events, public witnessing, and enable you to share the gifts you have for the glory of God!</li>
      <li style="margin:0 0 14px;">Send our petition to others and encourage them to sign it! You have already signed, so you know the importance of this petition as the more people who sign, the more legislators realize that the abortion issue is not settled. Send it to your friends, family, and especially to your pastor in the hopes that whole congregations sign it following his example. Here it is: ${L(BASE_URL + '/the-petition', 'abolishabortionmichigan.com/the-petition')}</li>
      <li style="margin:0 0 14px;">Bring the abolitionist position to your pastor or church, asking if he has considered it. An easy way to do this is sending him our new blog post: ${L(BASE_URL + '/news/what-michigan-pastors-can-do-about-abortion', 'What Michigan Pastors Can Do About Abortion')}</li>
      <li style="margin:0 0 14px;">Subscribe to our YouTube channels to stay informed and updated: ${L('https://www.youtube.com/channel/UCDP23JqEyeJ91dAW-MKRkGQ', 'main channel')} and ${L('https://www.youtube.com/@AbolishAbortionMichiganAction', 'rallies and action')}.</li>
      <li style="margin:0 0 14px;">Read us on Substack: ${L('https://abolishabortion.substack.com', 'abolishabortion.substack.com')}</li>
      <li style="margin:0 0 14px;">Pray with us for pastors to adopt the abolitionist position and be bold in their proclamation of it, for churches who are going out into the culture of death and preaching the good news of Jesus Christ, for more to join the cause daily and for apathy to be replaced with action, for a Michigan legislator to support an equal protection bill, and for the mothers and children affected by abortion.</li>
    </ol>

    <p style="margin:0 0 22px;">We answer your replies, so let us know by replying to this email if you have any questions or are willing to help us out with any of the above action steps!</p>

    <p style="margin:0;">In gratitude,<br>
    <strong>The AAM Outreach Team</strong><br>
    Abolish Abortion Michigan<br>
    ${L('mailto:admin@abolishabortionmichigan.com', 'admin@abolishabortionmichigan.com')}</p>

  </td></tr>

  <tr><td style="padding:20px 36px 28px;font-family:Arial,sans-serif;font-size:12px;line-height:1.6;color:#888888;border-top:1px solid #e5e5e5;">
    <p style="margin:0 0 6px;">Abolish Abortion Michigan is a Michigan 501(c)(3) nonprofit.<br>
    3665 S Lakeshore Dr, Suite 4, St Joseph, MI 49085</p>
    <p style="margin:0;">You are receiving this because you signed our petition or subscribed at abolishabortionmichigan.com.
    <a href="${unsubscribeUrl(email)}" style="color:#888888;text-decoration:underline;">Unsubscribe</a></p>
  </td></tr>

</table>
</td></tr>
</table>
</body></html>`;
}

const prisma = new PrismaClient();
let audience = [];
try {
  // ALL petition signers, ignoring the subscribed flag (explicit one-off).
  const signers = await prisma.petitionSignature.findMany({
    select: { email: true, subscribed: true },
    orderBy: { created_at: 'asc' },
  });
  // Newsletter subscribers who actively want mail and are not already included.
  const subs = await prisma.subscriber.findMany({
    where: { subscribed: true },
    select: { email: true },
  });

  const seen = new Set();
  let optedOut = 0;
  for (const s of signers) {
    const email = (s.email || '').trim();
    const key = email.toLowerCase();
    if (!email || seen.has(key)) continue;
    seen.add(key);
    if (!s.subscribed) optedOut++;
    audience.push({ email, source: s.subscribed ? 'petition' : 'petition(opted-out)' });
  }
  let fromNewsletter = 0;
  for (const s of subs) {
    const email = (s.email || '').trim();
    const key = email.toLowerCase();
    if (!email || seen.has(key)) continue;
    seen.add(key);
    fromNewsletter++;
    audience.push({ email, source: 'newsletter' });
  }

  console.log('AUDIENCE');
  console.log('  petition signers (all):        ' + signers.length);
  console.log('    of which subscribed=false:   ' + optedOut + '  <-- included per explicit request');
  console.log('  newsletter-only added:         ' + fromNewsletter);
  console.log('  TOTAL unique recipients:       ' + audience.length);
  console.log('');
} finally {
  await prisma.$disconnect();
}

// --retry-failed: replace the audience with just the quota-failed recipients
// from a previous run. Anyone with an 'ok' row is filtered out so a retry can
// never double-send.
if (args.has('retry-failed')) {
  const LOG_PATH = path.join(REPO_ROOT, 'scripts', 'org-update-send-log.csv');
  if (!fs.existsSync(LOG_PATH)) {
    console.error('No send log at ' + LOG_PATH + ' — nothing to retry.');
    process.exit(1);
  }
  const lines = fs.readFileSync(LOG_PATH, 'utf8').split(/\r?\n/).filter(Boolean).slice(1);
  const cells = (l) => l.split('","').map((c) => c.replace(/^"|"$/g, ''));
  const delivered = new Set();
  const failedRows = [];
  for (const line of lines) {
    const c = cells(line);
    const [, email, source, , status, error] = c;
    if (status === 'ok') delivered.add(email.toLowerCase());
    else failedRows.push({ email, source, error: error || '' });
  }
  const seenRetry = new Set();
  const retry = [];
  for (const r of failedRows) {
    const key = r.email.toLowerCase();
    if (delivered.has(key) || seenRetry.has(key)) continue;
    seenRetry.add(key);
    retry.push({ email: r.email, source: r.source });
  }
  console.log('RETRY MODE');
  console.log('  previously delivered (excluded): ' + delivered.size);
  console.log('  retry targets:                   ' + retry.length);
  console.log('');
  audience = retry;
}

if (LIMIT > 0) audience = audience.slice(0, LIMIT);

if (audience.length === 0) {
  console.log('Nothing to send.');
  process.exit(0);
}

console.log('Subject: ' + SUBJECT);
console.log('From:    ' + FROM);
console.log('Mode:    ' + (DRY_RUN ? 'DRY RUN' : 'LIVE') + (LIMIT ? `  (limit ${LIMIT})` : ''));
console.log('');

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not set — unsubscribe links cannot be minted. Aborting.');
  process.exit(1);
}
// Prove token minting works before sending anything.
console.log('Sample unsubscribe link: ' + unsubscribeUrl(audience[0].email).slice(0, 96) + '...');
console.log('');

if (DRY_RUN) {
  fs.writeFileSync(
    path.join(REPO_ROOT, 'scripts', 'org-update-preview.html'),
    buildHtml(audience[0].email),
  );
  console.log('Preview written to scripts/org-update-preview.html');
  console.log('Re-run with --send to fire.');
  process.exit(0);
}

if (!process.env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY missing');
  process.exit(1);
}
const resend = new Resend(process.env.RESEND_API_KEY);
const LOG = path.join(REPO_ROOT, 'scripts', 'org-update-send-log.csv');
if (!fs.existsSync(LOG)) fs.writeFileSync(LOG, 'sent_at,email,source,resend_id,status,error\n');

let sent = 0, failed = 0;
for (const r of audience) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM, to: r.email, replyTo: REPLY_TO,
      subject: SUBJECT, html: buildHtml(r.email),
    });
    const err = error ? (error.message || String(error)).replace(/"/g, '""') : '';
    if (error) { failed++; process.stdout.write('X'); }
    else { sent++; process.stdout.write('.'); }
    fs.appendFileSync(LOG, `"${new Date().toISOString()}","${r.email}","${r.source}","${data?.id || ''}","${error ? 'fail' : 'ok'}","${err}"\n`);
  } catch (e) {
    failed++;
    process.stdout.write('!');
    fs.appendFileSync(LOG, `"${new Date().toISOString()}","${r.email}","${r.source}","","fail","${(e.message || String(e)).replace(/"/g, '""')}"\n`);
  }
  if ((sent + failed) % 25 === 0) process.stdout.write(` ${sent + failed}/${audience.length} `);
  await new Promise((res) => setTimeout(res, RATE_MS));
}
console.log('\n');
console.log(`DONE. sent=${sent} failed=${failed}`);
console.log('Log: ' + LOG);

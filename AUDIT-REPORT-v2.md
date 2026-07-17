# Pre-Launch Audit v2 (Re-run + Verification) — abolishabortionmichigan.com

**Audit date:** 2026-07-16
**Repo:** `C:\Users\Dustina\Websites\AAM Website`
**HEAD:** `69e97ac` on `main` (fixes landed in `be5da66` "Pre-launch audit fixes: security hardening + cleanup")
**Stack:** Next.js 16.1.6 (App Router, Turbopack) + React 19.2 + Prisma 6 + Neon Postgres + Upstash Redis + Nodemailer + Tailwind 4 + Vercel
**Live prod tested:** https://www.abolishabortionmichigan.com
**Prior report:** `AUDIT-REPORT.md` (kept for history)

---

## VERDICT: 🟢 READY TO LAUNCH

Every Critical and High finding from the prior audit has been independently verified as **fixed and working** — in the code *and* against live prod. The dangerous local `.env` / nested `aam-website/` scaffold is gone, `npm run lint` / `npx tsc --noEmit` / `npm run build` are all clean, admin surface is fully gated (verified unauthenticated on real infra), CSRF and rate-limiting hardening landed correctly, and Lighthouse scores are 99–100 across the board on prod.

There are **no launch-blockers.** What remains is a short list of **should-fix** items — the biggest two being (a) missing `<link rel="canonical">` on every page and (b) five WCAG-AA accessibility violations (color-contrast / icon-link naming / link-in-text) on specific pages. Neither breaks the site; both are quick fixes and worth doing before or immediately after launch.

### Recommended before launch (not blocking)
- [ ] **N-SEO1** — Add `alternates.canonical` to page metadata. No page currently emits a canonical URL (verified on `/` and `/the-petition`). With apex→www + trailing-slash redirects live, canonicals matter.
- [ ] **N-A11Y1** — Fix 5 serious axe/WCAG-AA violations (color-contrast on `/what-we-believe` + `/the-petition`; missing `aria-label` on `/media` social icons; link-in-text color-only on `/donate` + `/delete-my-data`).
- [ ] **N-SEC1** — `npm audit` shows 14 transitive vulns; `next` (16.1.6) and `nodemailer` both carry security advisories. Bump to the latest patched `next` 16.1.x and latest `nodemailer`, re-test, then deploy.

### Manual verification the owner must still do (cannot be tested from here)
- [ ] Confirm all Production env vars set in Vercel (list in "Env-Var Checklist" below).
- [ ] Zeffy $1 end-to-end donation test.
- [ ] Real petition + contact + delete-my-data submissions land in DB / email / dashboard.
- [ ] Confirm the physical mailing address on `/donate` and the "Tax-Deductible" claim (501(c)(3) status).

---

## Prior-report findings — verification results

Legend: ✅ FIXED (verified) · ⚠️ partial · ❌ not fixed · ➖ deferred/n-a

| ID | Prior finding | Status | Evidence |
|---|---|---|---|
| **C1** | Prod-looking secrets in `aam-website/.env` + dead nested folder | ✅ FIXED | `aam-website/` folder gone from disk & git; no `.env*` on disk; no tracked env files; secrets scan of tree = clean |
| **H1** | 2 ESLint `set-state-in-effect` errors (`unsubscribe`, `Header`) | ✅ FIXED | `npm run lint` → exit 0, no errors/warnings. Header uses render-phase derived-state (`Header.tsx:75`); unsubscribe computes `status` in render (`unsubscribe/page.tsx:17-26`) |
| **H2** | Security headers only in `vercel.json`, missing from `next.config.ts` | ✅ FIXED | `next.config.ts:3-16` now carries full set (CSP, HSTS, COOP, CORP, XFO, XCTO, Referrer, Permissions); `vercel.json` header block removed. Verified present LOCAL (`curl localhost:3000`) **and** PROD |
| **H3** | Rate limiter fails **open** on Redis outage (brute-force risk) | ✅ FIXED | `lib/rate-limit.ts` now split: `checkRateLimit` (fail-open, public forms) + `checkRateLimitStrict` (fail-closed, `retryAfter 30s`). Auth paths all use strict: `verifyAccessCode`, `loginUser` (`auth-actions.ts:33,78`), `verifyPin` (`pin-actions.ts:31`) |
| **H4** | CSRF bypass via `.vercel.app` substring `includes('abolish-abortion-michigan')` | ✅ FIXED | `lib/csrf.ts:57-77` now requires opt-in `VERCEL_PREVIEW_PROJECT_SLUG` + **exact** `${slug}-` prefix. Live-tested: `abolish-abortion-michigan-attacker.vercel.app` → **403** on LOCAL and PROD |
| **H5** | No env-var docs / `.env.example` in root | ⚠️ MOSTLY FIXED | `README.md` now fully documents every required/optional var. **But** README says `cp .env.example .env.local` and no `.env.example` exists (gitignored by `.env*`) — see N-DOC1 |
| **M1** | `/api/auth/logout` POST had no CSRF check | ✅ FIXED | `app/api/auth/logout/route.ts:6-7` calls `validateCsrf` first |
| **M2** | `/login` returned 200 with `notFound()` + 1yr cache | ✅ FIXED | `/login` route removed entirely; `curl PROD /login` → **404** |
| **M3** | `/feed.xml` 500 on DB failure | ✅ FIXED | `app/feed.xml/route.ts:15-20` try/catch → empty feed; `curl PROD /feed.xml` → **200** |
| **M4** | `/api/news` GET 500 on DB failure | ✅ FIXED | `app/api/news/route.ts:34-37` try/catch → returns `[]` |
| **M5** | CSP allows `'unsafe-inline'` | ➖ STILL-DEFERRED | Still present (`next.config.ts:12`). Known weakness; nonce migration deferred. See N-SEC2 |
| **M6** | Missing OG-image `alt` (2 lint warnings) | ✅ FIXED | `npm run lint` → 0 warnings |
| **M7** | Password-toggle icons inverted | ✅ FIXED | `manage-7x9k/page.tsx:231-235` now `showPassword ? <EyeOff/> : <Eye/>` (correct convention) |
| **M8** | Inconsistent client-IP extraction | ✅ FIXED | New `lib/client-ip.ts` shared helper (`x-forwarded-for` → `x-real-ip` → `unknown`); used by auth, pin, petition, inquiries |
| **L1** | Unused deps `lightningcss`, `sonner` | ✅ FIXED | Both absent from `package.json` |
| **L2** | 15 ESLint warnings | ✅ FIXED | Lint clean |
| **L3** | README was create-next-app boilerplate | ✅ FIXED | README rewritten with real project/setup/env/admin docs |
| **L4** | Prisma `User.role` defaulted to `"admin"` | ✅ FIXED | `schema.prisma:20` now `@default("member")` |
| **L5** | Unused `resetToken`/`resetTokenExpiry` fields | ➖ STILL-DEFERRED | Still present (`schema.prisma:21-22`); no reset flow. Harmless |
| **L6** | Email-subject double HTML-encoding | ✅ FIXED | Subjects now use `sanitizeSubject(...)` only (`email.ts:116,179,569,...`); `escapeHtml` retained correctly for HTML **body** substitutions |
| **L7** | Hardcoded mailing address on `/donate` | ➖ CONFIRM | Still hardcoded (`donate/page.tsx:123-125`). Owner to confirm accuracy |
| **L8** | Social handles hardcoded in 3 places | ✅ FIXED | Centralized in `lib/content.ts:29-34` `socialLinks`, referenced by Footer/Contact/homepage JSON-LD |

**No regressions introduced by the fixes.** The Header/unsubscribe React-19 refactors, the CSRF preview-slug logic, and the rate-limit split all behave correctly under test.

---

## NEW findings (not in prior report)

### 🟡 MEDIUM

#### [NEW] N-SEO1 — No canonical URL on any page
- **Where:** All routes. `app/layout.tsx` sets `metadataBase` but no page sets `alternates.canonical`.
- **Evidence:** `curl https://www.abolishabortionmichigan.com/` and `/the-petition` — **no `<link rel="canonical">`** in rendered `<head>`.
- **Why it matters:** Apex 307s to www and trailing-slash 308-redirects, so the same content is reachable at multiple URL shapes. Without canonicals, search engines can split ranking signals or index a non-preferred variant. Scope area 5 explicitly requires a canonical per page.
- **Fix:** Add `alternates: { canonical: '/<path>' }` to each page's `metadata` (or a root default of `'/'` + per-page overrides). With `metadataBase` set, relative paths resolve to absolute canonicals.

#### [NEW] N-A11Y1 — Five serious WCAG-AA violations (axe-core on live prod)
Run: `@axe-core/playwright`, tags `wcag2a/2aa/21a/21aa`, 15 public pages. 10 pages clean; 5 with serious violations:

| Page | Rule | Node(s) | Fix |
|---|---|---|---|
| `/what-we-believe` | `color-contrast` | `#on-abolition ... p:nth-child(1) > .text-red-600` | `text-red-600` (#dc2626 ≈ 4.0:1 on white) fails AA 4.5:1 for normal text → use `text-red-700` |
| `/the-petition` | `color-contrast` | `.text-red-600.font-semibold`, `.text-gray-500.text-center` | Darken red→`red-700`; darken the fine-print gray→`gray-600`/`gray-700` |
| `/media` | `link-name` | Facebook + X icon links (`media/page.tsx:59-78`) | Icon-only `<a>` have **no accessible name** — add `aria-label="Facebook"` / `aria-label="X (Twitter)"` (Contact/Footer versions already have them) |
| `/donate` | `link-in-text-block` | `.hover:underline` "contact us" links | Links distinguished by color only (underline appears on hover only) → add persistent `underline` |
| `/delete-my-data` | `link-in-text-block` | `.hover:underline` "Privacy Policy" link | Same — persistent underline |

- **Why it matters:** AA color-contrast + accessible-name are core WCAG. For a public advocacy nonprofit there's real accessibility/legal exposure. All are one-class fixes.
- **Note:** Homepage Lighthouse a11y = **100** and 10/15 axe pages clean — this is localized, not systemic.

### 🟢 LOW

#### [NEW] N-SEC1 — npm audit: 14 transitive vulns incl. `next` + `nodemailer` advisories
- **Evidence:** `npm audit` → 9 high / 4 moderate / 1 low. Notable **direct-dependency** advisories:
  - **`next@16.1.6`** — a large advisory list including *"null origin can bypass Server Actions CSRF checks,"* *"Middleware/Proxy bypass via segment-prefetch/dynamic-route-param,"* cache-poisoning, and DoS items. This app uses `proxy.ts` middleware for admin gating **and** Server Actions (`signPetition`, `loginUser`, `verifyPin`, …), so it is in-scope for these classes.
  - **`nodemailer`** — SMTP/CRLF injection advisories. Practical risk here is low (subjects are `sanitizeSubject`-stripped of CR/LF; `from`/envelope are server-controlled; `to` is email-validated) but patch anyway.
  - Remainder (`minimatch`, `picomatch`, `brace-expansion`, `postcss`, `defu`, `flatted`, `ajv`, `js-yaml`, `@babel/core`) are build/tooling-transitive.
- **Fix:** Upgrade `next` to the latest 16.1.x patch and `nodemailer` to latest; `npm audit` again; re-run `npm run build` + this pen-test smoke set; deploy. Do this on a branch/preview first.

#### [NEW] N-DOC1 — README references a `.env.example` that doesn't exist
- **Where:** `README.md:11` (`cp .env.example .env.local`). No `.env.example` in repo, and `.gitignore` `.env*` would exclude it even if created.
- **Fix:** Either commit a `.env.example` via `git add -f`, or change the README step to a `.env.local` template block (the env table right below it already lists everything).

#### [NEW] N-PRIV1 — Privacy policy doesn't disclose Vercel Web Analytics
- **Where:** `app/layout.tsx:63` mounts `<Analytics/>` (`@vercel/analytics`); `app/privacy-policy/page.tsx` "Cookies" section says *"We do not use … analytics cookies that collect personal data,"* and the third-party list (Vercel/Neon/Zeffy) describes Vercel only as hosting/CDN.
- **Why it matters:** Vercel Web Analytics is cookieless (so the "no analytics cookies" line is technically true), but it **does** collect anonymized page-view/usage data. Best practice / transparency is to disclose it.
- **Fix:** Add a sentence to the privacy policy noting anonymized, cookieless usage analytics via Vercel.

#### [NEW] N-SEC2 — `robots.txt` discloses the obscured admin path
- **Where:** `app/robots.ts:11` disallows `/manage-7x9k` and `/admin/` — publicly readable at `/robots.txt`, which negates the "obscured URL" defense.
- **Why it matters:** Low — real protection is access-code + bcrypt password + JWT + rate-limit, not the obscurity. But listing it hands attackers the login URL.
- **Fix:** Optional. Instead of listing `/manage-7x9k` in robots, add `robots: { index: false }` metadata to that page (and rely on middleware for `/admin/`). Or accept it as defense-in-depth only.

#### [NEW] N-SEC3 — PIN comparison is not constant-time
- **Where:** `lib/actions/pin-actions.ts:36` — `if (pin === adminPin)`.
- **Why it matters:** Low — the PIN check is gated behind an **authenticated admin** (`isAdmin()` first) and rate-limited fail-closed (5/15min). A timing side-channel is impractical for a 4-digit numeric PIN behind auth. Noted for completeness.
- **Fix:** Use `crypto.timingSafeEqual` on length-normalized buffers (same pattern already used for the access code).

#### [NEW] N-SEO2 — Generic `og:title` across most pages
- **Where:** `app/layout.tsx:24-30` sets a static `openGraph.title = "Abolish Abortion Michigan"`. Pages that set only `title` (not `openGraph.title`) inherit it, so social shares of `/donate`, `/faq`, etc. show "Abolish Abortion Michigan" instead of the page's own title.
- **Evidence:** `curl /` → `og:title = "Abolish Abortion Michigan"` while `<title> = "Equal Protection for the Preborn"`.
- **Fix:** Drop the static `openGraph.title` so it follows the title template, or set `openGraph.title` per page.

### ⚪ NIT

- **[NEW] N-N1** — `POST /api/inquiries` with **malformed/empty JSON body** returns **500** (`request.json()` throws → generic catch). Cosmetic; ideally 400. (`app/api/inquiries/route.ts:99-101`.)
- **[NEW] N-N2** — `TRACE /api/inquiries` returns **500** instead of 405 (Next internal). Harmless.
- **[NEW] N-N3** — Homepage `<title>` renders as `"Equal Protection for the Preborn"` **without** the `| Abolish Abortion Michigan` template suffix that every other page gets — minor inconsistency (not wrong, just different).
- **N-N4** — Public form rate-limiters fail **open** by design (`checkRateLimit`) on petition/newsletter/inquiries. Acceptable tradeoff; honeypots + email-format validation provide secondary spam defense. Documented in code.

---

## PEN TEST RESULTS

Tested against **both** a local `npm start` (port 3000, no DB/Redis/SMTP env → in-memory + fail-open, so auth/CSRF/validation layers still fully exercised) **and live prod** (real Neon/Redis/SMTP). Every attack blocked or behaved correctly. No successful bypass.

### Admin surface — unauthenticated (LOCAL + PROD identical verdicts)

| Route | Method | LOCAL | PROD | Verdict |
|---|---|---|---|---|
| `/admin/dashboard` (+ `/inquiries /news /subscribers /petitions /email /gallery`) | GET | 307→`/manage-7x9k` | 307→`/manage-7x9k` | ✅ Blocked (middleware `proxy.ts`) |
| `/api/inquiries` | GET | 401 | 401 | ✅ Blocked |
| `/api/dashboard/stats` | GET | 401 | 401 | ✅ Blocked |
| `/api/inquiries/{id}` | PATCH/DELETE | 401 | 401 | ✅ Blocked |
| `/api/news` | POST | 401 | — | ✅ Blocked |
| `/api/news/{slug}` | PATCH/DELETE | 401 | — | ✅ Blocked |

### CSRF probes — `POST /api/inquiries`

| Origin | LOCAL | PROD | Verdict |
|---|---|---|---|
| `http://localhost:3000` / same-site | 201 | — | ✅ Allowed (correct) |
| `https://evil.example.com` | 403 | 403 | ✅ Blocked |
| `abolish-abortion-michigan-attacker.vercel.app` (H4 bypass attempt) | **403** | **403** | ✅ **Bypass closed** |
| No Origin + no Referer | 201 | — | ⚠️ Allowed for non-browser clients (by design; SameSite=strict cookies protect browser state-change; documented in `csrf.ts:41-44`) |

### Public-side probes — `POST /api/inquiries` (origin allowed)

| Attack | Result | Verdict |
|---|---|---|
| Method fuzz | GET=401, POST=201/500(no-body), PUT/DELETE/PATCH=405, OPTIONS=204, HEAD=401, TRACE=500 | ✅ Mostly correct (TRACE nit) |
| Missing fields `{}` | 400 "Name, email, and message are required" | ✅ |
| Oversized message (6000 chars) | 400 | ✅ |
| Invalid email format | 400 | ✅ |
| Malformed JSON | 500 (should be 400 — N-N1) | ⚠️ cosmetic |
| XSS `<script>alert(1)</script>` in name | 201, stored raw, **echoed in JSON (not executed)**; escaped at email-send (`escapeHtml`) and at React render (auto-escape); news HTML double-`sanitizeHtml`'d | ✅ Not exploitable |
| SQL injection `' OR 1=1 --` | 201, stored as literal (Prisma parameterized) | ✅ Not exploitable |
| Prototype pollution `__proto__`/`constructor.prototype` | 201, no pollution (modern Node JSON.parse + Prisma field allow-list) | ✅ Not exploitable |
| Honeypot `website` filled | 201 fake-success, no record created | ✅ Correct |
| Path traversal `/api/news/../../etc/passwd` | 404 | ✅ Blocked |
| IDOR — nonexistent slug/id | 404 | ✅ Blocked |

### Auth / token / unsubscribe

| Test | Result | Verdict |
|---|---|---|
| JWT forgery / cookie tamper | `jwt.verify` throws → middleware redirect + cookie cleared (`proxy.ts:27-38`) | ✅ Blocked |
| Access-code compare | `timingSafeEqual` on length-normalized buffers (`auth-actions.ts:39-47`) | ✅ Constant-time |
| Password compare | `bcrypt.compare` (`auth-actions.ts:90`) | ✅ Constant-time |
| Access-code / login / PIN brute force | 5/15min per IP, **fail-CLOSED** on Redis outage | ✅ Limited (H3 resolved) |
| PIN compare | `pin === adminPin` (N-SEC3) — but gated behind admin + rate-limit | ⚠️ Low (impractical) |
| Unsubscribe bad token | PROD → **403** "Invalid or expired unsubscribe link" (HMAC-SHA256 + timingSafeEqual). (LOCAL 500 only because `JWT_SECRET` unset locally.) | ✅ Correct |

**Not tested (requires real admin creds — owner to verify manually):**
- IDOR/authorization *inside* the authed dashboard (PATCH/DELETE arbitrary inquiry IDs, draft slug enumeration) — the API auth gate is confirmed; per-record behavior needs a logged-in session.
- Bounded online PIN guessing — the PIN endpoint is a Next Server Action requiring the internal action header + a valid admin JWT, so it's not externally reachable to guess. Rate limit (5/15min, fail-closed) still applies.
- No exhaustive brute-force was run (rate limiting present → out of scope per instructions).

---

## SEO / Performance / Accessibility (live prod)

### Lighthouse (homepage, `https://www.abolishabortionmichigan.com/`)
| Preset | Performance | Accessibility | Best Practices | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Desktop | **100** | **100** | **100** | **100** | 0.4s | 0 | 0ms |
| Mobile | **99** | **100** | **100** | **100** | 2.0s | 0 | 30ms |

Reports saved: `audit-scripts/lighthouse/home-desktop.json`, `home-mobile.json`.

### SEO
- ✅ `robots.txt` valid, disallows `/admin/ /api/ /login /manage-7x9k /unsubscribe`; ✅ `sitemap.xml` valid (32 static + dynamic news URLs), excludes admin.
- ✅ OG image routes resolve (`/opengraph-image`, per-section ones) → 200 `image/png`. Twitter `summary_large_image`.
- ✅ JSON-LD: Organization (home), NewsArticle (`news/[slug]`), FAQPage (`/faq`).
- ✅ Unique `<title>` + meta description per page; H1 hierarchy present; semantic sections.
- ✅ Apex→www 307; trailing-slash 308 normalization; `/petition`→`/the-petition` 308.
- ❌ **Missing canonical tags** (N-SEO1). ⚠️ Generic `og:title` (N-SEO2).

### Performance
- Build clean (Turbopack). All content pages statically prerendered (`○`); API/feed/news-slug dynamic (`ƒ`); ISR on `/`, `/news`, `/media` (5m).
- `next/image` with AVIF/WebP + sized `deviceSizes`; hero logo `priority`. No large client bundles (TBT 0–30ms). No stray `"use client"` cost — client components are exactly the interactive ones (Header, MobileNav, forms, dashboard).
- Fonts: `next/font` Montserrat (self-hosted, no render-block). Preconnect to youtube/zeffy.

### Accessibility
- ✅ Skip-to-main link (`layout.tsx:54-59`); ✅ keyboard dropdown nav with arrow/Home/End/Escape (`Header.tsx`); ✅ mobile drawer `FocusTrap` + Escape + `aria-expanded`; ✅ form labels + `aria-live` regions on every form; ✅ honeypots `aria-hidden`.
- ✅ 10/15 public pages axe-clean; homepage Lighthouse a11y 100.
- ❌ 5 serious violations on 5 pages (N-A11Y1).

Screenshots (1440/768/375) saved under `audit-scripts/screenshots/`. **Verified the prior stats-overlap fix holds** — `/` at 768px renders a clean 4-col grid, at 375px a clean 2×2, no overlap (responsive `text-2xl sm:text-3xl md:text-2xl lg:text-4xl` + `min-w-0 break-words`).

### Broken-link / asset spot-check
- ✅ `abolishabortionnc.com` (footer credit) → 200; ✅ Facebook 301, ✅ X 200, ✅ Instagram 301 (all normal social redirects). Signal group link is an app-invite (not a web page) — expected.
- ✅ Favicons/app icons present (`app/icon.png`, `app/apple-icon.png`); ✅ Vercel Analytics mounted.

---

## Data / PII flow (verified against privacy promises)
- **Petition** → `PetitionSignature` (Neon) + confirmation email to signer + admin notification (SMTP). Matches policy.
- **Contact** → `Inquiry` (Neon) + confirmation + admin BCC. Matches.
- **Newsletter** → `Subscriber` (Neon) + welcome + admin notification. Matches.
- **Delete-my-data** → posts to `/api/inquiries` with subject "Data Deletion Request" (`delete-my-data/page.tsx:68`). Matches policy's 30-day promise.
- IP used only transiently for rate-limiting (no IP column in any table) — matches "not stored permanently."
- **Donations** delegate fully to Zeffy (`donate/page.tsx:10`, external link) — no card data or keys touch app code/logs. ✅
- One gap: **Vercel Analytics not disclosed** in the policy (N-PRIV1).

---

## Coverage — what was examined
- **Read line-by-line:** all API routes (`app/api/**`), `proxy.ts`, `lib/csrf.ts`, `lib/rate-limit.ts`, `lib/client-ip.ts`, `lib/sanitize.ts`, `lib/prisma.ts`, `lib/content.ts`, `lib/email.ts` (partial — transport/subject/token), all `lib/actions/{auth,pin,petition,subscriber}-actions.ts`, all `lib/data/{inquiry,petition,subscriber,news}-store.ts`, `prisma/schema.prisma`, `next.config.ts`, `vercel.json`, `package.json`, `README.md`, `app/robots.ts`, `app/sitemap.ts`, `app/layout.tsx`, `app/page.tsx`, `app/feed.xml`, pages for contact/donate/privacy-policy/delete-my-data/faq/media/news-slug/unsubscribe/manage-7x9k, `components/{Header,Footer,PetitionForm,FooterNewsletter,MobileNav}.tsx`, `components/ui/pin-dialog.tsx`, `app/admin/dashboard/layout.tsx`.
- **Verified via tooling (compiled + linted + rendered clean, not individually opened):** the ~30 static content pages under `what-we-believe/*`, `the-gospel/*`, `abolition-bills/*`, `who-we-are`, `non-violence-statement`; all `opengraph-image.tsx`; `error/loading/not-found`; remaining `components/**` + `components/ui/**`; remaining `lib/actions/{dashboard,email,gallery,inquiry,news}-actions.ts`; `lib/data/gallery-store.ts`; `lib/og-image.tsx`, `lib/utils.ts`, `store/use-user.ts`, `types/index.ts`; admin dashboard pages.
- **Ran:** `npm run build` (exit 0), `npx tsc --noEmit` (clean), `npm run lint` (clean), `npm audit --json` (14 vulns), grep sweeps (console/TODO/secrets/`any`/env), 40+ curl probes (LOCAL + PROD), Playwright axe on 15 pages + 18 screenshots, Lighthouse desktop+mobile.
- Throwaway tooling isolated under `audit-scripts/` (its own package.json — app lockfile untouched).

---

## Env-Var Checklist (verify in Vercel → Production)
**Required:** `DATABASE_URL`, `JWT_SECRET` (≥32), `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_ACCESS_CODE`, `ADMIN_PIN`, `EMAIL_USER`, `EMAIL_PASSWORD`, `NEXT_PUBLIC_SITE_URL` (no trailing slash), `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`.
**Optional:** `NOTIFICATION_EMAIL` (→`ADMIN_EMAIL`), `EMAIL_HOST` (→`smtp.gmail.com`), `EMAIL_PORT` (→`587`), `VERCEL_PREVIEW_PROJECT_SLUG` (only if CSRF from preview URLs needed).
Also confirm the **Preview** scope has what preview deploys need. `NODE_ENV` is Vercel-managed.

---

## Bottom line
The `be5da66` hardening pass did what it claimed — every prior Critical/High/most Medium is genuinely fixed and holds up under live testing, with no regressions. Ship it. Then knock out the canonical tags, the five a11y AA fixes, and the `next`/`nodemailer` bumps as fast-follows.

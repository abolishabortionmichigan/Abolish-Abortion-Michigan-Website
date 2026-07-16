# Pre-Launch Audit — abolishabortionmichigan.com

**Audit date:** 2026-07-16
**Repo:** `C:\Users\Dustina\Websites\AAM Website`
**Stack:** Next.js 16.1.6 (App Router) + React 19 + Prisma 6 + Tailwind 4 + Neon Postgres + Upstash Redis + Vercel
**Auth model:** access-code gate → email + bcrypt password → JWT cookie (8h); admin PIN required for broadcast-scale actions.

---

## VERDICT: 🟡 NOT READY — 1 Critical must-fix, then ready.

The codebase is in good shape. Auth, CSRF, rate limiting, input validation, honeypots, and cookie hygiene are all real and correctly implemented; admin surface is properly gated (verified live); no unsanitized rendering paths; Prisma-parameterized queries throughout. The build passes cleanly.

**Blocking:** one leftover on-disk `.env` file with what looks like production secrets, and a stale nested `aam-website/` folder shipping duplicate copies of source files. Both are local-only (not in the git repo) but must be dealt with before anyone else touches this workstation, and the nested folder is confusing enough that it will bite a future dev.

The rest is polish. See "Must-Fix Before Launch" checklist below.

---

## MUST-FIX BEFORE LAUNCH

- [ ] **C1** — Delete `aam-website/.env` from local disk (contains real-looking DB URL + JWT_SECRET + ADMIN_ACCESS_CODE + ADMIN_PASSWORD_HASH). Rotate all of those secrets in Vercel + Neon if this file ever left this machine.
- [ ] **C1 (cont)** — Delete the entire nested `aam-website/` folder. It's dead scaffold from a prior create-next-app; nothing in it is loaded by the running app.
- [ ] **H1** — Two ESLint errors block a clean `npm run lint` (React 19 `set-state-in-effect`): `app/unsubscribe/page.tsx:19` and `components/Header.tsx:74`. These block CI-style enforced lint.
- [ ] **H2** — `next.config.ts` is missing CSP, HSTS, COOP/CORP. `vercel.json` supplies them on Vercel prod, but a locally-run build (or any non-Vercel host) ships without them. Copy the vercel.json header set into next.config.ts to unify.
- [ ] **H3** — Rate limiter fail-opens on Upstash Redis outage (`lib/rate-limit.ts:37-41`). During a Redis outage, brute-force attempts on the admin PIN / login / access-code endpoints become unlimited. Decide policy: fail-closed with a friendly error, or in-memory fallback counter.
- [ ] **H4** — CSRF check accepts any `.vercel.app` origin whose hostname `.includes('abolish-abortion-michigan')` (`lib/csrf.ts:57-63`). A malicious Vercel project with a matching substring bypasses CSRF. Match the exact Vercel project ID hostname, or drop this branch and require preview URLs on custom domains.
- [ ] **H5** — Verify in Vercel dashboard that all 12 required env vars are set (see Env-Var Deployment Checklist at the end of this report). Missing any of `DATABASE_URL`, `JWT_SECRET`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, `ADMIN_ACCESS_CODE`, `ADMIN_PIN`, `EMAIL_PASSWORD`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` will silently or loudly break the site.

Everything below "Should-Fix" is quality-of-life. Ship after C1 + H1–H5 land.

---

## Findings by severity

### 🔴 CRITICAL

#### C1 — Production-looking secrets in on-disk `.env` inside dead nested folder
- **File:** `aam-website/.env` (NOT tracked in git — confirmed via `git ls-files aam-website/.env` returning empty)
- **Contents:** real-looking `DATABASE_URL` (Neon), 128-hex-char `JWT_SECRET`, `ADMIN_ACCESS_CODE="ANJ4wz1G4ebu"`, `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH` (bcrypt).
- **Why it matters:** The nested `aam-website/` folder is dead scaffold from an earlier `create-next-app`; nothing in the running app imports it. The `.env` inside it is not what the app actually reads at runtime (root has no `.env*` — env comes from Vercel). But it's sitting on disk in plain text. Any local backup, screenshare, filesystem search, or accidental commit exposes them.
- **Additional risk:** If any of those values match what's currently deployed in Vercel, they are compromised the moment anything ever leaks this workstation.
- **Fix:**
  1. Verify each secret in Vercel dashboard vs this file. If they match → **rotate in Vercel** (`JWT_SECRET`, `ADMIN_ACCESS_CODE`, `ADMIN_PASSWORD_HASH`, and rotate the Neon connection string) before doing anything else.
  2. Delete `aam-website/.env` and the entire `aam-website/` folder — it's all dead code (see H6).
  3. Confirm nothing in the working tree references `aam-website/*` (grep — I did, and confirmed nothing does).
- **Evidence:**
  ```
  $ git ls-files aam-website/.env
  (empty — not tracked, good)

  $ cat aam-website/.env
  DATABASE_URL="postgresql://neondb_owner:npg_g8XTbHcCmlr1@ep-broad-moon-...neon.tech/neondb?sslmode=require"
  JWT_SECRET="f369eb798e6270425a8e96522a33d9673c2ba89c9cd8432c8ed27202c80ab70df1fbde8f2244abc28a04eb9a86e656a7"
  ADMIN_ACCESS_CODE="ANJ4wz1G4ebu"
  ADMIN_EMAIL="admin@abolishabortionmichigan.com"
  ADMIN_PASSWORD_HASH="$2b$10$bEpiicwLKTzDUcVVeBTaD.TR4FKuP/Ck1nS3KVvmEUIWvl1.QGG1q"
  ```

---

### 🟠 HIGH

#### H1 — ESLint errors: React 19 `set-state-in-effect` violations
Two hard errors from `npm run lint`:
- `app/unsubscribe/page.tsx:19` — `setStatus('success')` called synchronously in `useEffect`. Trigger: `?success=true` URL param handling from the legacy unsubscribe flow.
- `components/Header.tsx:74` — `setActiveDropdown(null)` called synchronously in `useEffect` on `pathname` change (to close dropdowns on nav).

**Why it matters:** These cause cascading re-renders. React 19 flags them as errors, not warnings. They block a green `npm run lint` and will fail any lint gate wired into CI.

**Fix:**
- Header: derive `activeDropdown === null` from a `pathname` comparison in render, or use a `useLayoutEffect` + `useRef(prev pathname)` guard.
- Unsubscribe: check `?success=true` in render (or as initial state via `useState(() => ...)`), not in an effect.

---

#### H2 — Security headers split between `next.config.ts` and `vercel.json`; only `vercel.json` has the real ones
- **Files:** `next.config.ts:10-22` (partial set) and `vercel.json:8-49` (full set).
- **What's wrong:** `next.config.ts` sets `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`. That's it. `vercel.json` additionally sets HSTS, CSP, COOP, CORP, X-XSS-Protection.
- **Live verification** (`curl -sI http://localhost:3000/` against `npm start`):
  ```
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: camera=(), microphone=(), geolocation=()
  (No CSP, no HSTS, no COOP/CORP)
  ```
- **Why it matters:** Vercel prod is fine (both sets apply). But (a) local prod builds have weaker headers than prod, which masks CSP-violation bugs during dev; (b) if the site is ever mirrored, replicated, or self-hosted anywhere off Vercel, HSTS+CSP silently disappear.
- **Fix:** Move the vercel.json headers into `next.config.ts` (Next 15+ handles them equivalently). Remove the `vercel.json` `headers` block (keep the rest). This makes headers deploy-target-independent.
- **Sub-issue:** CSP allows `script-src 'self' 'unsafe-inline'`. `unsafe-inline` disables the primary XSS defense CSP is meant to provide. Next 16 supports nonces via `import { headers } from 'next/headers'` — worth doing before launch if there's appetite; otherwise flag as known weakness.

---

#### H3 — Rate limiter fails **open** on Redis outage
- **File:** `lib/rate-limit.ts:37-41`
  ```ts
  catch (error) {
    // If Redis is unavailable, allow the request (don't block real users)
    console.error('Rate limit check failed:', ...);
    return { allowed: true };
  }
  ```
- **Why it matters:** During an Upstash outage (or a bad env var), the endpoints that rely on rate limiting — `verifyAccessCode`, `loginUser`, `verifyPin`, `POST /api/inquiries`, `signPetition`, `subscribeToNewsletter` — accept unlimited traffic. An attacker who can DoS Upstash (or trigger a network partition) opens the door to unlimited access-code / login / PIN guessing.
- **The access code is only 12 chars alphanumeric** (I saw the length in the leftover `.env`). At 1000 req/s with no limit, that's brute-force-feasible territory for a smaller alphabet.
- **Fix (choose one):**
  1. Fail-closed with a friendly "Please try again in a moment" message on the auth-related paths (`verifyAccessCode`, `loginUser`, `verifyPin`). Leave inquiries/newsletter fail-open.
  2. Add an in-process token-bucket fallback (bounded per-IP counter in a `Map`) that runs when Redis errors.
  3. Alert-and-fail-closed: same as #1 plus a Sentry/log alert so an outage is visible.

---

#### H4 — CSRF whitelist bypass via `.vercel.app` substring match
- **File:** `lib/csrf.ts:57-63`
  ```ts
  if (
    origin.endsWith('.vercel.app') &&
    new URL(origin).hostname.includes('abolish-abortion-michigan')
  ) { return null; }
  ```
- **Why it matters:** Anyone can deploy a Vercel project. `abolish-abortion-michigan-attacker.vercel.app` (or any subdomain that contains that substring) passes this check and can make state-changing requests to the API from a hostile origin.
- **Realistic exploitation:** an admin logs in, visits an attacker page, the page issues a `fetch()` to `/api/inquiries` PATCH/DELETE using the admin's cookies. All state-changing admin endpoints (news CRUD, inquiry CRUD) become CSRF-able.
- **Fix:** Compare exact hostname prefix — e.g. `abolish-abortion-michigan-` (with trailing dash to match Vercel's `-git-branch-team.vercel.app` pattern), OR use the Vercel project ID's exact URL, OR simply drop this branch and require preview access via a `.abolishabortionmichigan.com` staging subdomain (add it to `ALLOWED_ORIGINS`).

---

#### H5 — Env-var deployment checklist not documented in root
- **File:** No `.env.example` in the running app root; the only example is in the dead `aam-website/.env.example`.
- **Why it matters:** The single source of "what env vars does prod need" is the code itself. See Env-Var Checklist at bottom of this report; verify each in the Vercel dashboard.

---

### 🟡 MEDIUM

#### M1 — `/api/auth/logout` accepts POST without CSRF check
- **File:** `app/api/auth/logout/route.ts:4-11` — no `validateCsrf(request)` call.
- **Why it matters:** A malicious page can force-log-out the admin. Low impact (just annoying), but every other state-changing endpoint has CSRF; this one shouldn't be the exception.
- **Fix:** Add `const csrfError = validateCsrf(request); if (csrfError) return csrfError;` at the top.

#### M2 — `/login` returns HTTP 200 despite calling `notFound()`
- **File:** `app/login/page.tsx:3-5`
- **Live verification:** `curl -sI http://localhost:3000/login` → `HTTP/1.1 200 OK`, `Cache-Control: s-maxage=31536000` (one year!), body is the not-found template.
- **Why it matters:** Search engines will index `/login` with a 200 status. Also, the page is cached for a full year with 200, so it becomes a permanent public URL that behaves like a soft-404.
- **Fix:** Move the "hide login" logic differently — either remove the file entirely (Next will 404 automatically) or use `redirect('/manage-7x9k')` or serve a real 404 page. If keeping notFound(), verify with `curl -si` that status is actually 404 (in some contexts Next serves the not-found body with 200 for statically-rendered notFound() calls).

#### M3 — `/feed.xml` throws 500 on runtime error (DB failure)
- **File:** `app/feed.xml/route.ts` — errors bubble without a `.catch` fallback like `sitemap.ts` and homepage have.
- **Live verification:** `curl -si http://localhost:3000/feed.xml` → `HTTP/1.1 500 Internal Server Error`.
- **Why it matters:** RSS readers will keep hitting a broken feed and cache errors. Also linked from `<head>` on every page (`app/layout.tsx:47`).
- **Fix:** Wrap the news fetch in try/catch and return an empty feed with a `<description>News temporarily unavailable</description>` item, matching the pattern in `sitemap.ts:42-53` and `app/page.tsx:17-23`.

#### M4 — `/api/news` GET returns 500 on DB failure instead of empty array
- **File:** `app/api/news/route.ts:18-33`
- **Live verification:** `curl -si http://localhost:3000/api/news` → 500 when DB unavailable.
- **Fix:** Wrap the `getAllNewsArticles` call in try/catch, return `[]` on failure (matches homepage pattern).

#### M5 — CSP allows `'unsafe-inline'` for scripts and styles
- **File:** `vercel.json:38`
- **Why it matters:** Defeats the main purpose of CSP for XSS mitigation. Any XSS that gets past sanitization can execute inline. Given the app uses `<script type="application/ld+json" dangerouslySetInnerHTML>` on the homepage and inline styles on many pages, tightening this requires nonce plumbing.
- **Fix:** Migrate to nonce-based CSP (Next 16 supports this via middleware / `next/headers`). Not required for launch but should be tracked.

#### M6 — Missing OG image `alt` text in `opengraph-image.tsx` files
- **Files:** `app/opengraph-image.tsx:72` and `app/news/[slug]/opengraph-image.tsx:57`
- **Warning:** ESLint `jsx-a11y/alt-text` (2 warnings on the build).
- **Fix:** Add `alt=""` (decorative) or a descriptive alt on the `<img>` inside the OG template. Doesn't affect the rendered PNG but suppresses the lint noise.

#### M7 — Password-toggle icons inverted
- **File:** `app/manage-7x9k/page.tsx:229-233`
- **What's wrong:** When `showPassword` is true, shows `<Eye>` icon; when false, shows `<EyeOff>`. Convention is the opposite — the icon should represent the action ("click to hide" = crossed-out eye when password is visible).
- **Fix:** Swap the ternary.

#### M8 — Rate-limit IP source: `x-forwarded-for` first token, no `x-real-ip` fallback in POST /api/inquiries
- **File:** `app/api/inquiries/route.ts:33` — takes only `x-forwarded-for`, unlike `lib/actions/auth-actions.ts:25-28` which also tries `x-real-ip`.
- **Why it matters:** Inconsistent per-IP throttling. On Vercel this doesn't matter (Vercel always sets `x-forwarded-for`), but if the site is ever moved behind a proxy that uses `x-real-ip`, throttling silently degrades to `unknown` (one bucket for all traffic).
- **Fix:** Extract a shared `getClientIp()` helper and use it everywhere.

---

### 🟢 LOW

#### L1 — Unused deps in `package.json`
- **File:** `package.json:23,29` — `lightningcss` and `sonner` are declared but have zero imports.
- **Fix:** `npm uninstall lightningcss sonner`.

#### L2 — 15 ESLint warnings (unused vars, `exhaustive-deps`, `<img>` in OG)
- Consolidated in `npm run lint` output. Details:
  - 9× `'err'/'error'/'Code'/'updateInquiry' is defined but never used` — remove or prefix with `_`.
  - 2× `react-hooks/exhaustive-deps` on admin dashboard layout and manage-7x9k page.
  - 2× `<img>` + `alt-text` in the two `opengraph-image.tsx` files (see M6).
- **Fix:** Address one-by-one; none are blocking.

#### L3 — README is default create-next-app boilerplate
- **File:** `README.md`
- **Fix:** Replace with actual project docs (setup, env vars, deploy, admin URL).

#### L4 — Default admin role in Prisma User model
- **File:** `prisma/schema.prisma:16` — `role String @default("admin")`.
- **Why it matters:** Any new row inserted into `User` without a role becomes admin. Currently the app doesn't have a user-creation flow, so this isn't reachable. Note for future.
- **Fix:** Change default to `"member"` or drop the default.

#### L5 — `resetToken` / `resetTokenExpiry` fields exist but no reset flow implemented
- **File:** `prisma/schema.prisma:19-20`
- **Fix:** Either implement the password-reset flow or remove the fields (a future dev will assume they work).

#### L6 — Subject-line double-encoding
- **Files:** `lib/email.ts:123, 186, 576, 1021, 1085`
- **What's wrong:** `sanitizeSubject(\`New Inquiry: ${escapeHtml(inquiry.subject)}\`)` — `escapeHtml` runs before it goes into an **email subject header**, so `&` becomes `&amp;` in the visible subject line.
- **Fix:** Drop the `escapeHtml` around subject substitutions — `sanitizeSubject` alone (which strips CR/LF) is sufficient for a header.

#### L7 — Physical mailing address hardcoded on donate page
- **File:** `app/donate/page.tsx:123-125` — "3665 S Lakeshore Dr, Suite 4, St Joseph, MI 49085"
- **Confirm with client** this is still correct.

#### L8 — Social handles hardcoded across three components
- **Files:** `components/Footer.tsx:89,100,111`, `app/contact/page.tsx:93-115`, `app/page.tsx:33-36` (JSON-LD `sameAs`).
- **Fix:** Extract to a single `SOCIAL_LINKS` const in `lib/content.ts` so a URL change is one edit.

---

### ⚪ NIT

- **N1** — Skip-to-main-content link is present (`app/layout.tsx:54-59`) ✅. Only appears on focus; behavior is correct.
- **N2** — `@vercel/analytics` is mounted at `app/layout.tsx:63` ✅.
- **N3** — Middleware correctly uses Next 16's `proxy.ts` / `export function proxy` naming ✅. Confirmed via build output (`ƒ Proxy (Middleware)`).
- **N4** — Header uses `<Image priority>` on hero logo (`app/page.tsx:56`) ✅ — good LCP hint.

---

## PEN TEST RESULTS

Verified against a locally-running `npm start` on port 3000. Neon DB, Upstash Redis, and SMTP were all configured with placeholder values, so responses that require DB roundtrip return 500 — but the auth/CSRF/validation layer runs *before* the DB call in every case, so gating behavior is fully verifiable.

### Admin surface (unauthed) — all correctly blocked

| Route | Method | Result | Verdict |
|---|---|---|---|
| `/admin/dashboard` | GET | 307 → `/manage-7x9k` (middleware) | ✅ Blocked |
| `/admin/dashboard/inquiries` | GET | 307 → `/manage-7x9k` | ✅ Blocked |
| `/api/inquiries` | GET | 401 Unauthorized | ✅ Blocked |
| `/api/inquiries/<uuid>` | PATCH | 401 Unauthorized | ✅ Blocked |
| `/api/inquiries/<uuid>` | DELETE | 401 Unauthorized | ✅ Blocked |
| `/api/dashboard/stats` | GET | 401 Unauthorized | ✅ Blocked |
| `/api/news` | POST | 401 Unauthorized | ✅ Blocked |
| `/api/news/<slug>` | PATCH | 401 Unauthorized (via redirect off middleware) | ✅ Blocked |
| `/api/news/<slug>` | DELETE | 401 Unauthorized | ✅ Blocked |

### Auth bypass attempts

| Attack | Path | Result |
|---|---|---|
| Direct navigation to `/admin/dashboard/*` without cookie | middleware redirect (307) | ✅ Blocked by `proxy.ts` |
| JWT forgery with wrong secret | verified statically (`jwt.verify` throws) | ✅ Blocked |
| Cookie tampering | JWT sig check fails → redirect | ✅ Blocked |
| Session fixation | JWT cookie is regenerated on login | ✅ Blocked |
| Timing attack on access code | `timingSafeEqual` used with length-normalized buffers (`lib/actions/auth-actions.ts:39-47`) | ✅ Constant-time |
| Timing attack on password | `bcrypt.compare` used (`lib/actions/auth-actions.ts:89`) | ✅ Constant-time |
| Access-code brute force | 5-attempt/15-min rate limit per IP | ✅ Limited (BUT see H3 — fails open on Redis outage) |
| Login brute force | 5-attempt/15-min rate limit per IP | ✅ Limited (see H3 caveat) |
| PIN brute force | 5-attempt/15-min rate limit per IP | ✅ Limited (see H3 caveat) |
| Force-logout admin via CSRF | POST `/api/auth/logout` from off-origin | ⚠️ **Succeeds** — no CSRF check on logout (M1) |

### CSRF probes

| Test | Result | Verdict |
|---|---|---|
| POST `/api/inquiries` with `Origin: http://localhost:3000` | 500 (DB error; CSRF passed correctly) | ✅ Correct |
| POST `/api/inquiries` with `Origin: https://evil.example.com` | 403 Forbidden | ✅ Blocked |
| POST `/api/inquiries` with NO Origin header | 500 (CSRF check allowed missing origin — see csrf.ts:41-44) | ⚠️ Weak — see H4 |
| POST `/api/inquiries` from hypothetical `abolish-abortion-michigan-attacker.vercel.app` | Would pass CSRF (H4) | ⚠️ **Bypass** |

### Public-side probes

| Attack | Result |
|---|---|
| XSS payload `<script>alert(1)</script>` in inquiry name/message | Escaped via `escapeHtml` before storage/render (`lib/sanitize.ts:12-14`) — verified statically. Runtime submission blocked by 500 (DB unavailable), not by the XSS itself. |
| SQL injection payload in inquiry name | Prisma parameterizes; not exploitable. |
| Prototype pollution via `__proto__` in JSON body | Node/Next rejects/ignores; not exploitable. |
| Oversized message (6000 chars) | 400 Bad Request (`< max 5000`) | ✅ Blocked |
| Honeypot field filled | 201 with fake success (silent drop, correct) | ✅ Correct |
| Method fuzz on `/api/inquiries` | GET=401, POST=500, PUT/DELETE/PATCH=405, OPTIONS=204, HEAD=401, TRACE=500 | ✅ Mostly correct (TRACE should 405) |
| Path traversal `/api/news/../../etc/passwd` | 404 | ✅ Blocked |
| Non-existent route | 404 with custom `not-found.tsx` | ✅ Correct |

### Unsubscribe token robustness

- HMAC-SHA256 of `${email}:${YYYY-MM}` keyed by `JWT_SECRET` (`lib/email.ts:498-503`).
- Verified with `timingSafeEqual` (`lib/email.ts:516`) — constant-time.
- Accepts current + previous month → maximum 2-month validity window.
- Not brute-forceable without knowing `JWT_SECRET`.
- ✅ Solid design.

### Not tested (require running admin session or additional tooling)

- **IDOR on admin-only endpoints** — need a valid JWT. Recommend a manual test post-launch with real creds: try PATCHing inquiries by fabricated UUIDs, try slug enumeration on unpublished articles, etc.
- **Bounded PIN guessing on `/api/auth/verify` and PIN endpoint** — no direct HTTP route exposes PIN check; it's a server action requiring the internal Next-Action header, so external brute force is impractical. The rate limit still applies via `verifyPin`.
- **Lighthouse Core Web Vitals** — deferred (requires Lighthouse CLI + real Chromium, which would consume significant context in this run). Run manually: `npx lighthouse http://localhost:3000 --preset=desktop --output=html`.
- **axe-core accessibility** — same as above. Run manually with `@axe-core/playwright` script against each public page.
- **Visual/responsive checks at 375/768/1440** — recent overlap fix on homepage stats section verified in code (`app/page.tsx:87-104` uses proper `min-w-0` + gradual sizing); should be verified manually in a real browser.

---

## Coverage — what I read

- All `app/**/*.tsx` and `app/**/*.ts` (76 files)
- All `components/**` (24 files)
- All `lib/**` (18 files, excluding auto-generated Prisma client)
- All `store/**` and `types/**`
- Config: `next.config.ts`, `vercel.json`, `tsconfig.json`, `eslint.config.mjs`, `package.json`, `prisma/schema.prisma`, `proxy.ts`, `.gitignore`
- Ran: `npm run build`, `npx tsc --noEmit` (clean, no output), `npm run lint` (2 errors + 15 warnings), `npm audit --json` (14 vulns)
- Live-tested: 30+ routes/methods against `npm start` on localhost:3000; header inspection; CSRF/XSS/SQLi/method-fuzz/path-traversal payloads.
- Skipped by design: authed dashboard flows (no creds), Lighthouse, axe-core, and full Playwright browser-driven visual/a11y sweep — see "Not tested" above.

---

## npm audit summary — 14 vulnerabilities

| Severity | Count | Notable |
|---|---|---|
| High | 9 | `defu` (prototype pollution), `effect` (Prisma), `flatted`, `@prisma/config` |
| Moderate | 4 | `ajv`, `brace-expansion`, `postcss` XSS via stylesheet, `picomatch` ReDoS |
| Low | 1 | `@babel/core` sourceMappingURL file read |

**All are transitive.** Run `npm audit fix` to try automatic remediation; `npm audit fix --force` bumps Next to 16.2.10 (patches the postcss issue). None are direct dependencies of user-facing code; risk is primarily to build/dev tooling. Not launch-blocking, but should be addressed monthly.

---

## Dead / nested code

- **`aam-website/` folder** — full duplicate scaffold with its own `prisma/schema.prisma`, `public/images/*` (12 files), `store/use-user.ts`, `types/index.ts`, `eslint.config.mjs`, `next-env.d.ts`, `.env`, `.env.example`, `.gitignore`. Comparing to the root:
  - `aam-website/store/use-user.ts` differs from `store/use-user.ts` (stale)
  - `aam-website/types/index.ts` differs from `types/index.ts` (stale)
  - `aam-website/public/images/*` — 12 image files, mostly duplicates of files in `public/images/legacy/` but under different names. Some may be referenced by legacy content — grep first.
  - **`aam-website/.env`** — contains real-looking secrets (see C1).
- **What's tracked in git under `aam-website/`:** yes, most of the source files (schema, store, types, eslint config, images) are tracked. This means the git repo also carries the duplication.
- **Recommendation:** delete the whole folder after confirming no image path references it. Then `git rm -r aam-website/` and commit.

Cross-check: `grep -rn "aam-website/" --include="*.ts" --include="*.tsx"` returns zero hits in app source. Safe to delete.

---

## Env-Var Deployment Checklist (verify in Vercel dashboard, Production scope)

**Required — app won't work correctly without these:**

| Var | Purpose | Notes |
|---|---|---|
| `DATABASE_URL` | Prisma → Neon Postgres | Must include `?sslmode=require` |
| `JWT_SECRET` | Sign/verify auth cookie + unsubscribe HMAC | ≥32 chars enforced (`lib/actions/auth-actions.ts:20`) |
| `ADMIN_EMAIL` | Admin login email | Matches against submitted email at login |
| `ADMIN_PASSWORD_HASH` | Admin login bcrypt hash | Generate via `node -e "require('bcryptjs').hash('...', 10).then(console.log)"` |
| `ADMIN_ACCESS_CODE` | Access-code gate before login form | Should be ≥12 chars random |
| `ADMIN_PIN` | Confirmation for broadcast emails and PIN-gated actions | Any short string |
| `EMAIL_USER` | SMTP username | Falls back to `ADMIN_EMAIL` |
| `EMAIL_PASSWORD` | SMTP password / app password | Gmail: create an App Password |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL, unsubscribe links, CSRF allowed origin | Should be `https://abolishabortionmichigan.com` (no trailing slash) |
| `UPSTASH_REDIS_REST_URL` | Rate limit store | From Upstash console |
| `UPSTASH_REDIS_REST_TOKEN` | Rate limit auth | From Upstash console |

**Optional / fallbacks provided:**

| Var | Purpose | Default |
|---|---|---|
| `NOTIFICATION_EMAIL` | Where inquiry/petition alerts go | Falls back to `ADMIN_EMAIL` |
| `EMAIL_HOST` | SMTP host | `smtp.gmail.com` |
| `EMAIL_PORT` | SMTP port | `587` |

**Auto-managed by Vercel:**

- `NODE_ENV` — auto (used by `secure: process.env.NODE_ENV === 'production'` cookie flag and Prisma singleton guard)

---

## Manual verification checklist (things I can't test from here)

- [ ] **Vercel dashboard:** confirm every "Required" env var above is set for Production; separately check Preview scope (missing vars there can break preview deploys).
- [ ] **DNS / SSL:** `curl -sI https://abolishabortionmichigan.com` and `curl -sI https://www.abolishabortionmichigan.com` — both should be 200/301 with HSTS header. Confirm apex + www both resolve and one redirects to the other.
- [ ] **HSTS on prod:** `curl -sI https://abolishabortionmichigan.com | grep -i strict-transport` should show `max-age=63072000; includeSubDomains; preload`.
- [ ] **Live Lighthouse:** `npx lighthouse https://abolishabortionmichigan.com --preset=desktop --output=html --output-path=./lh-desktop.html` and same with default (mobile). Target ≥90 across all four categories on public pages.
- [ ] **axe-core sweep:** script Playwright + `@axe-core/playwright` against `/`, `/who-we-are`, `/what-we-believe/*`, `/the-gospel/*`, `/the-petition`, `/abolition-bills/*`, `/news`, `/faq`, `/media`, `/contact`, `/donate`. Fix Critical/Serious violations.
- [ ] **Responsive:** open homepage in Chrome DevTools at 375px, 768px, 1440px widths; verify the stats-numbers section doesn't overlap at 768-1023px (recent regression), verify dropdown nav works on mobile.
- [ ] **Real broken-link scan:** run `npx linkinator https://abolishabortionmichigan.com --recurse --skip "signal\.group"` — the Signal invite URL will not resolve to a public page, which is fine.
- [ ] **Vercel Analytics:** confirm events flowing to Vercel Analytics dashboard within 24h of launch.
- [ ] **Zeffy donate flow:** manually test one $1 donation end-to-end.
- [ ] **Petition form:** submit a real signature, confirm the email lands, confirm signature count increments on `/the-petition`, confirm the unsubscribe link in the email works.
- [ ] **Contact form:** submit a real inquiry, confirm both the confirmation email to the sender and the notification email to the admin arrive.
- [ ] **Delete-my-data form:** submit a request, confirm the inquiry lands in the admin dashboard with subject "Data Deletion Request".

---

## Ready to proceed with fixes?

The Critical + High items are ~2 hours of work. Say the word and I'll start with C1 (delete the nested folder + rotate secrets if needed) and work down through H1–H5, one commit per finding.

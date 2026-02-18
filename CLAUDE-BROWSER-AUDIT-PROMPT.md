# Claude Browser Audit Prompt

Copy and paste this entire prompt into Claude.ai (with web browsing enabled) to run a comprehensive double-check audit of the site.

---

## Prompt

I need you to perform a comprehensive audit of our website. Test everything thoroughly and grade each category. The site is live at:

**Live site:** https://abolish-abortion-michigan-website.vercel.app/
**GitHub repo:** https://github.com/abolishabortionmichigan/Abolish-Abortion-Michigan-Website

This is a Next.js 16 / React 19 / TypeScript / Tailwind CSS 4 / Prisma site deployed on Vercel. Please audit every aspect below. Visit each page in the browser, inspect the source, check the GitHub repo code, and report findings with Pass/Fail/Warning for each item. Grade each category A+ through F.

---

### 1. PAGE-BY-PAGE AUDIT

Visit ALL of these pages and for each one check: loads without error, has a visible H1 tag, has a page title, has a meta description, has an OG image, has no console errors. Report as a table.

Pages to visit:
- `/` (Home)
- `/who-we-are`
- `/what-we-believe` (overview)
- `/what-we-believe/abolitionist-not-pro-life`
- `/what-we-believe/biblical-not-secular`
- `/what-we-believe/immediate-not-gradual`
- `/what-we-believe/no-exceptions`
- `/what-we-believe/ignore-roe`
- `/what-we-believe/criminalization`
- `/the-gospel` (overview)
- `/the-gospel/gospel`
- `/the-gospel/kingdom-of-god`
- `/the-gospel/great-commission`
- `/the-gospel/message-of-reconciliation`
- `/the-gospel/answer-to-abortion`
- `/the-gospel/incarnation`
- `/the-petition`
- `/news`
- `/faq`
- `/contact`
- `/donate`
- `/media`
- `/abolition-bills`
- `/abolition-bills/components`
- `/abolition-bills/current-bills`
- `/privacy-policy`
- `/non-violence-statement`
- `/delete-my-data`

Also visit a random non-existent URL to verify the custom 404 page works.

---

### 2. ACCESSIBILITY (WCAG 2.1 AA)

Check these on the live site:
- [ ] Tab through the homepage -- are focus indicators visible (red outline)?
- [ ] Tab to a dropdown menu in the header (like "WHAT WE BELIEVE") -- does Enter/Space open it? Do ArrowDown/ArrowUp navigate the menu items? Does Escape close it?
- [ ] On mobile viewport (resize browser to 375px), does the hamburger menu appear? Does it open/close properly?
- [ ] Check color contrast -- is any light gray text on white backgrounds hard to read?
- [ ] Are all images tagged with alt text? (View source or inspect)
- [ ] Does the site have a skip navigation link? (Tab once from the top of any page)
- [ ] Are buttons and interactive elements large enough to tap (at least 36px)?
- [ ] Check `aria-current="page"` -- when you're on a page, does the corresponding nav link have this attribute?

Check the GitHub repo for:
- [ ] `globals.css` -- does it have `:focus-visible` styles?
- [ ] `globals.css` -- does it have `prefers-reduced-motion` media queries?
- [ ] `components/Header.tsx` -- does it have keyboard event handlers (onKeyDown) for dropdowns?
- [ ] `components/MobileNav.tsx` -- does FocusTrap have `escapeDeactivates: true`?
- [ ] `components/ui/button.tsx` -- are default button heights at least 40px (h-10)?
- [ ] `components/ShareButtons.tsx` -- are share buttons at least 44px (w-11 h-11)?
- [ ] `components/Breadcrumbs.tsx` -- does the breadcrumb separator use `text-gray-500` (not gray-400)?

---

### 3. SEO

Check on the live site:
- [ ] View source on the homepage -- is there an Organization JSON-LD schema?
- [ ] View source on `/contact` -- is there a ContactPoint JSON-LD schema?
- [ ] View source on `/faq` -- is there a FAQPage JSON-LD schema?
- [ ] View source on any sub-page (e.g., `/what-we-believe/no-exceptions`) -- is there a BreadcrumbList JSON-LD schema?
- [ ] Visit `/sitemap.xml` -- are all public pages listed? Are admin pages excluded?
- [ ] Visit `/robots.txt` -- does it disallow `/admin/`, `/api/`, `/login`?
- [ ] Visit `/feed.xml` -- is there a valid RSS feed?
- [ ] Check OG images: right-click > inspect on each page, find `og:image` meta tag. Do the image URLs load?
- [ ] Is the homepage H1 visible (not sr-only/screen-reader-only)?

Check the GitHub repo for:
- [ ] Does every page file (`app/*/page.tsx`) export a `metadata` object with title and description?
- [ ] Are there `opengraph-image.tsx` files in key route directories?
- [ ] Does `lib/og-image.tsx` exist as a shared OG image generator?
- [ ] Is `/manage-7x9k` absent from `app/sitemap.ts`?

---

### 4. PERFORMANCE

Check on the live site:
- [ ] Do pages load quickly (under 500ms for static pages)?
- [ ] Open DevTools > Network -- are JS/CSS files served with long cache headers (`max-age=31536000, immutable`)?
- [ ] Is the site served over HTTP/2?
- [ ] Are images served as WebP/AVIF?

Check the GitHub repo for:
- [ ] `next.config.ts` -- is `poweredByHeader: false` set?
- [ ] `next.config.ts` -- are image formats configured for AVIF/WebP?
- [ ] `next.config.ts` -- is `optimizePackageImports` set for lucide-react?
- [ ] `app/news/[slug]/loading.tsx` -- is Math.random() replaced with a deterministic array?
- [ ] Do `app/what-we-believe/loading.tsx` and `app/the-gospel/loading.tsx` exist?
- [ ] Does the homepage use ISR (`export const revalidate = 300`)?

---

### 5. SECURITY

Check on the live site:
- [ ] Open DevTools > Network > click the document request > check Response Headers:
  - Content-Security-Policy present?
  - Strict-Transport-Security present with long max-age?
  - X-Frame-Options: DENY?
  - X-Content-Type-Options: nosniff?
  - Referrer-Policy present?
  - Permissions-Policy present?
  - Is `X-Powered-By` header ABSENT (it should not be there)?
- [ ] Try visiting `/admin/dashboard` without logging in -- does it redirect to `/manage-7x9k`?
- [ ] Try visiting `/.env` -- does it return 404?
- [ ] Try visiting `/.git/config` -- does it return 404?

Check the GitHub repo for:
- [ ] `vercel.json` -- are all security headers configured?
- [ ] `lib/actions/auth-actions.ts` -- are cookies set with HttpOnly, Secure, SameSite=strict?
- [ ] `lib/actions/auth-actions.ts` -- is bcrypt used for password comparison?
- [ ] `lib/actions/auth-actions.ts` -- is JWT expiry set to 8 hours?
- [ ] `lib/csrf.ts` -- is CSRF validation implemented?
- [ ] `lib/rate-limit.ts` -- is rate limiting implemented?
- [ ] `proxy.ts` -- does it check JWT and redirect unauthorized users?
- [ ] Do the petition form, contact form, and delete-my-data form have honeypot fields?
- [ ] `components/ShareButtons.tsx` -- is `document.execCommand('copy')` removed? (Should use only Clipboard API)
- [ ] Is there NO `/api/auth/login` route? (It should have been deleted)
- [ ] Is there NO localStorage usage for auth tokens?
- [ ] Do all `dangerouslySetInnerHTML` uses either call `sanitizeHtml()` or `JSON.stringify()`?

---

### 6. MOBILE RESPONSIVENESS

Check on the live site (resize to 375px or use DevTools mobile view):
- [ ] Does the hamburger menu appear on mobile?
- [ ] Does the desktop nav disappear?
- [ ] Is there no horizontal scrollbar / overflow on any page?
- [ ] Does the mobile menu open and close properly?
- [ ] Are forms usable on mobile (inputs aren't cut off, buttons are tappable)?

---

### 7. FORMS

Check on the live site:
- [ ] Visit `/the-petition` -- is there a petition form with required fields?
- [ ] Visit `/contact` -- is there a contact form with required fields?
- [ ] Try submitting each form with empty fields -- do validation errors appear?
- [ ] Inspect the forms -- are there hidden honeypot inputs?

Check the GitHub repo for:
- [ ] `app/api/inquiries/route.ts` -- input validation, rate limiting, CSRF check?
- [ ] `lib/actions/petition-actions.ts` -- rate limiting, input validation, email sanitization?
- [ ] Are input length limits enforced server-side?

---

### 8. CODE QUALITY

Check the GitHub repo for:
- [ ] Run your eye over the TypeScript -- are there any `any` types?
- [ ] Are there any `console.log` statements in production code? (console.error in error.tsx is OK)
- [ ] Is `tsconfig.json` set to `strict: true`?
- [ ] Are there any deprecated APIs like `document.execCommand`?
- [ ] Does `app/error.tsx` exist as an error boundary?
- [ ] Are `'use client'` directives only on interactive components (not on static content pages)?

---

### 9. LINK INTEGRITY

- [ ] Click through the main navigation -- do all links work?
- [ ] Click through footer links -- do they all work?
- [ ] Check social media links in the footer -- do they go to real pages?

---

### GRADING

After checking everything, provide:

1. A grade (A+ through F) for each of the 9 categories above
2. An overall site grade
3. A list of any issues found, categorized by severity (Critical / High / Medium / Low / Info)
4. A comparison to the previous audit results (all A/A+ grades) -- do you agree or disagree?

For reference, the previous audit found these as the only remaining nice-to-have items (not issues):
- Missing COOP/CORP headers (very minor)
- CSP uses 'unsafe-inline' instead of nonces (complex with Next.js)
- In-memory rate limiter resets on cold starts (adequate for current traffic)
- Media page is 1.5s vs 300ms for other pages (dynamic DB query)

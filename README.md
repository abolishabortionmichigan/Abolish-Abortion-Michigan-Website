# Abolish Abortion Michigan — Website

Marketing + petition + admin site for [abolishabortionmichigan.com](https://abolishabortionmichigan.com).

**Stack:** Next.js 16 (App Router) + React 19 + Prisma 6 + Neon Postgres + Upstash Redis + Nodemailer (SMTP) + Tailwind 4, deployed on Vercel.

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in the values below
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

Required in production (set in the Vercel dashboard under Environment Variables → Production):

| Var | Purpose |
|---|---|
| `DATABASE_URL` | Prisma → Neon Postgres. Include `?sslmode=require`. |
| `JWT_SECRET` | Signs auth cookie + unsubscribe HMAC tokens. Must be ≥32 chars. Generate: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_EMAIL` | Admin login email. |
| `ADMIN_PASSWORD_HASH` | bcrypt hash of admin password. Generate: `node -e "require('bcryptjs').hash('your-password', 10).then(console.log)"` |
| `ADMIN_ACCESS_CODE` | Access-code gate shown before the login form (≥12 random chars). |
| `ADMIN_PIN` | Short PIN gating high-impact admin actions (broadcast emails, exports). |
| `EMAIL_USER`, `EMAIL_PASSWORD` | SMTP creds (Gmail: use an App Password). |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL, e.g. `https://abolishabortionmichigan.com` (no trailing slash). |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Rate-limit store (Upstash console). |

Optional (defaults noted):

| Var | Default |
|---|---|
| `NOTIFICATION_EMAIL` | Falls back to `ADMIN_EMAIL` |
| `EMAIL_HOST` | `smtp.gmail.com` |
| `EMAIL_PORT` | `587` |
| `VERCEL_PREVIEW_PROJECT_SLUG` | (unset) — set to your Vercel project slug to allow CSRF from preview URLs like `<slug>-<branch>-<team>.vercel.app` |

## Admin

The admin dashboard is intentionally hidden — the login URL is not linked from any public page. See the code for the current URL. Access is gated by two factors: (1) a shared access code and (2) admin email + password. High-impact actions (broadcast emails) require an additional PIN.

## Scripts

- `npm run dev` — start dev server
- `npm run build` — production build
- `npm start` — run production build locally
- `npm run lint` — ESLint (should be clean)

## Deploy

Every push to `main` on GitHub deploys to Vercel production. Preview deploys run on any non-main branch push.

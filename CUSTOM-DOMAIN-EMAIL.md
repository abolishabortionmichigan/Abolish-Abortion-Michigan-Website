# Setting Up Custom Domain Email (@abolishabortionmichigan.com)

Currently the site sends emails from a Gmail address. This guide walks you through sending from your own domain (e.g. `newsletter@abolishabortionmichigan.com`). No code changes are needed — only environment variables.

---

## Option 1: Domain Host Email (Cheapest)

Most domain registrars (GoDaddy, Namecheap, Hostinger, etc.) include email hosting or offer it as an add-on.

### Steps

1. **Log in to your domain registrar** (wherever you bought `abolishabortionmichigan.com`)

2. **Create a mailbox** — Look for "Email" or "Email Hosting" in the dashboard
   - Create: `newsletter@abolishabortionmichigan.com` (or whatever address you want)
   - Set a strong password

3. **Find your SMTP settings** — The registrar will provide these. Common examples:

   | Provider   | SMTP Host                    | Port |
   |------------|------------------------------|------|
   | GoDaddy    | smtpout.secureserver.net     | 465  |
   | Namecheap  | mail.privateemail.com        | 465  |
   | Hostinger  | smtp.hostinger.com           | 465  |
   | Bluehost   | mail.abolishabortionmichigan.com | 465 |

   Check your provider's help docs if unsure. Search "[your provider] SMTP settings".

4. **Update Vercel environment variables**
   - Go to: Vercel Dashboard > your project > Settings > Environment Variables
   - Update these values:

   ```
   EMAIL_USER=newsletter@abolishabortionmichigan.com
   EMAIL_PASS=<the mailbox password you just created>
   EMAIL_HOST=<your provider's SMTP server from step 3>
   EMAIL_PORT=465
   ```

5. **Redeploy** — Go to Deployments tab > click "Redeploy" on the latest deployment

6. **Test** — Send a test broadcast from the admin dashboard to yourself

### DNS Records (if deliverability is poor)

If emails land in spam, add these DNS records at your registrar:

- **SPF** — TXT record on `@`:
  ```
  v=spf1 include:<your-provider's-spf> ~all
  ```
  (Your provider will tell you the exact value)

- **DKIM** — Your email provider may give you a CNAME or TXT record to add

- **DMARC** — TXT record on `_dmarc`:
  ```
  v=DMARC1; p=none; rua=mailto:newsletter@abolishabortionmichigan.com
  ```

---

## Option 2: Google Workspace (~$7/month)

This gives you full Gmail with your custom domain. Best option if you want to also read/send email from a `@abolishabortionmichigan.com` inbox.

### Steps

1. **Sign up** at https://workspace.google.com
   - Choose the Business Starter plan ($7/user/month)
   - Enter your domain: `abolishabortionmichigan.com`

2. **Verify domain ownership** — Google will ask you to add a TXT record at your registrar:
   ```
   google-site-verification=<unique-code-google-gives-you>
   ```

3. **Set up MX records** — Google tells you to add these MX records at your registrar:
   ```
   ASPMX.L.GOOGLE.COM         (priority 1)
   ALT1.ASPMX.L.GOOGLE.COM    (priority 5)
   ALT2.ASPMX.L.GOOGLE.COM    (priority 5)
   ALT3.ASPMX.L.GOOGLE.COM    (priority 10)
   ALT4.ASPMX.L.GOOGLE.COM    (priority 10)
   ```

4. **Create your email account** in the Google Workspace admin
   - e.g. `newsletter@abolishabortionmichigan.com`

5. **Generate an App Password**
   - Log in to the new account at gmail.com
   - Go to: Google Account > Security > 2-Step Verification > App passwords
   - Generate a new app password, copy it

6. **Update Vercel environment variables**
   ```
   EMAIL_USER=newsletter@abolishabortionmichigan.com
   EMAIL_PASS=<the 16-character app password>
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   ```

7. **Redeploy** and test

---

## Option 3: Resend (Free tier, best deliverability)

Resend is a developer-focused email API. Free tier: 3,000 emails/month. This option requires a small code change.

### Steps

1. **Sign up** at https://resend.com

2. **Add your domain** — Resend gives you 3 DNS records to add at your registrar:
   - SPF (TXT record)
   - DKIM (CNAME record)
   - DMARC (TXT record)

3. **Wait for verification** (usually a few minutes)

4. **Get your API key** from the Resend dashboard

5. **Code change needed** — Replace the Nodemailer transporter in `lib/email.ts`:

   Install the package:
   ```bash
   npm install resend
   ```

   Replace the transporter creation at the top of `lib/email.ts`:
   ```typescript
   // OLD (Nodemailer SMTP):
   // const transporter = nodemailer.createTransport({ ... });

   // NEW (Resend):
   import { Resend } from 'resend';
   const resend = new Resend(process.env.RESEND_API_KEY);
   ```

   Replace each `transporter.sendMail(...)` call with:
   ```typescript
   await resend.emails.send({
     from: 'Abolish Abortion Michigan <newsletter@abolishabortionmichigan.com>',
     to: recipientEmail,
     subject: subject,
     html: htmlContent,
   });
   ```

6. **Update Vercel environment variables**
   - Remove: `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_HOST`, `EMAIL_PORT`
   - Add: `RESEND_API_KEY=re_xxxxxxxxxxxx`

7. **Redeploy** and test

---

## Which Option Should You Choose?

| | Domain Host Email | Google Workspace | Resend |
|---|---|---|---|
| **Cost** | Free or ~$1-2/mo | ~$7/mo | Free (3k emails/mo) |
| **Code changes** | None | None | Yes (small) |
| **Can read inbox** | Yes | Yes (Gmail UI) | No (send only) |
| **Deliverability** | Decent | Good | Best |
| **Setup difficulty** | Easy | Medium | Medium |

**Recommendation:** Start with **Option 1** (domain host email) since it requires zero code changes and is usually free or very cheap. If emails consistently land in spam, upgrade to **Option 3** (Resend).

---

## After Switching: What to Verify

1. Send a test broadcast email to yourself
2. Check it arrives (not in spam)
3. Check the "From" address shows your custom domain
4. Click the unsubscribe link to make sure it still works
5. Submit a contact form and verify both confirmation emails arrive
6. Create and publish a test news article (then delete it) to verify newsletter sends

## Current Environment Variables Reference

```
EMAIL_USER=         → The email address to send from
EMAIL_PASS=         → SMTP password or app password
EMAIL_HOST=         → SMTP server hostname (default: smtp.gmail.com)
EMAIL_PORT=         → SMTP port (587 for TLS, 465 for SSL)
NOTIFICATION_EMAIL= → Where admin notifications are sent (separate from login)
ADMIN_EMAIL=        → Admin login email (do NOT change this to change notifications)
```

# Building a print-on-demand store: what it actually takes

Written after building the Abolish Abortion Michigan store (Next.js + Neon + Vercel + Stripe + Printify), October 2026. Everything here was learned by hitting it, usually in production, sometimes expensively.

Read the **Pricing** section before you price anything. It is the one that cost real money.

---

## 1. The decisions that are hard to undo

Make these deliberately on day one. Changing them later means touching every product.

**The supplier is the source of truth, not your database.** Titles, prices, colours, sizes, mockups and descriptions are edited in Printify; an importer copies them into your tables so pages render and carts price without an API call per request. Your database is a cache with opinions.

**Freeze slugs on first import.** Assign a slug once and never recompute it. Titles change constantly — renaming a product should not break a URL, a sitemap entry, or a link someone shared. Our naming scheme changed three times; no URL moved.

**Never delete a product.** `OrderItem` rows reference products. A removed product becomes `active: false`, which hides it from the store and keeps every past order intact. Put a guard in the importer that refuses to deactivate the entire catalogue if the API returns zero products — one API timeout should not empty your shop.

**Decide the product naming convention early.** Ours ended up as:

```
<design> — <type> (<front>) (<add-ons>)

Abolish Abortion Michigan — Tee (chest mark) (left sleeve + neck)
```

Everything downstream is derived from this at query time — listing groups, the design picker, the front picker, the add-on checkboxes. No schema change was ever needed to add a dimension. That was worth more than any other structural decision.

**Choose one package manager.** We shipped with both `package-lock.json` and `pnpm-lock.yaml` and no `packageManager` field. Vercel pinned `npm install`, so the npm lockfile won and the pnpm one quietly rotted. Pick one, delete the other, add the field.

---

## 2. Printify

### The API will lie to you in specific ways

**Updating a product requires *every* variant in `print_areas`.** Creating one does not. Send a partial set on update and it fails.

**One variant group per variant when scales differ.** Group two variants together and Printify folds them, leaking one variant's scale onto the other. This silently ruined a run of badges — the 1.25" scale appeared on the 2.25" button.

**Empty placeholders come back on read and are rejected on write.** Filter to placeholders that actually have images before sending them back, or you get `images field is required`.

**Printify attaches its own `text_layer.svg`** to neck placeholders, then refuses to accept it being written back:

```
400 {"reason":"Provided images do not exist","code":8253}
```

Strip anything ending `.svg` from placeholders you copy through.

**The paged listing returns duplicates while the catalogue is being written.** It pages by offset, so a product created or renamed mid-read appears on two pages. We saw **827 rows for 818 products**. The importer tried to create one twice, hit the unique constraint on `printify_product_id`, and **failed the entire sync**. Always dedupe by id after fetching.

**A `limit` above the maximum returns an empty list, not an error.**

**The `total` field is unreliable, and listings lag** after bulk writes. Count what you actually received.

**Pressing Publish in the Printify UI on an API-connected shop sets `is_locked: true` permanently.** Clear it with `POST shops/{shop}/products/{id}/publishing_failed.json`.

**Rate limits bite on bulk work.** Expect 429s on a few hundred sequential reads. Back off exponentially and cap concurrency at about three.

### Mockups

The URL structure is useful:

```
images-api.printify.com/mockup/<product>/<variant>/<mockup>/<slug>.jpg?camera_label=back
```

The **variant id is in the path**, which means you can group photos by colour or phone model without storing a second table. The **camera angle is in the query string**, not in a `position` field.

**`scale` is a fraction of the print area's WIDTH**, not its diagonal and not its height.

**Printify re-renders a mockup in place when artwork changes** — same URL, different picture. This is the single nastiest caching trap in the stack; see §7.

**Not every blueprint renders every angle.** The Gildan youth tee has no collar or neck camera at all, so a neck print will be manufactured but can never be shown. Check before promising a feature.

### Costs and placements

**Every print placement adds cost.** Adding sleeve and neck prints took a hoodie from **$30.79 to $46.06** — three placements at roughly $5 each, more than doubling our margin requirement. We did not re-run pricing afterwards and sold below cost. See §3.

**The catalog API does not expose cost.** You only learn what a variant costs after the product exists in your shop. Workflow: create with a placeholder price, read the costs back, then PUT the real prices.

**Shipping comes from `catalog/blueprints/{id}/print_providers/{id}/shipping.json`.** There may be more than one US profile at different rates — take the dearer one, so you quote high rather than low.

### Orders

**A new Printify order starts as `pending` and refuses production until validation finishes.**

```
400 {"reason":"It is not allowed to sent order ... to production with status pending.","code":8502}
```

Creating an order and sending it to production in the same breath **fails every time**. Two layers fix it:

1. Retry the send a few times with backoff when the refusal is specifically "still pending". Keep it bounded — this runs inside the Stripe webhook, which must answer quickly.
2. As a safety net, send it from the `order:updated` webhook when Printify reports the order has reached `on-hold`. **Put that check before any "no change" early return** — your own record already says `on-hold`, which is exactly why a stuck order never heals itself.

**Printify charges when the order goes to production**, not when it is created. That is the moment your card is hit, and it is the hook for the cash-flow problem in §10.

**Cancel before production and nothing is charged.** `POST .../orders/{id}/cancel.json`.

---

## 3. Pricing — read this twice

### "Cost plus five dollars" is not five dollars

Our first rule was `price = cost + $5`, rounded to the nearest `.99`. It felt right and it was wrong, because it ignored three separate costs. A real order:

```
customer paid                              $62.84
  − Stripe processing (2.9% + $0.30)       $ 2.12
  − Stripe Tax (0.5%)                      $ 0.31
  − Printify: items 46.06 + ship 8.79
             + 2.76 sales tax charged to us $57.61
  − sales tax remitted to Michigan          $ 3.06
  = kept                                   $-0.27
```

We lost money on a sale we believed earned five dollars.

### The formula that actually works

To keep a target amount `T` per item:

```
price = (T + fixed_fee + C + t_supplier·C + pct·S) / (1 − pct·(1 + t_customer))

C          supplier item cost
S          shipping (charged to the customer and paid to the supplier — a
           pass-through, except the processor takes a percentage of it)
t_supplier sales tax the supplier bills YOU on your cost
t_customer sales tax you collect from the customer
pct        processing % + any tax-service %   (0.029 + 0.005)
fixed_fee  processor's flat per-transaction fee ($0.30)
```

Then round **up** to the next `.99`, never down.

Worked through for a hoodie: cost $46.06, shipping $8.79 → **$56.99**, which nets **$5.51**.

### Things that make the real number better than modelled

- **Multi-item orders.** Price per item as though it were a single-item order and each carries the full flat fee and full first-item shipping. A two-item basket pays the flat fee once. The error is in your favour.
- **The tax service's percentage may be billed monthly**, not deducted from each payment. Check an actual payment's fee breakdown rather than assuming.

### Things that make it worse

- **Out-of-state orders.** The supplier charges sales tax by *destination*. For a buyer in a state where you have no nexus, you may be billed their tax while collecting none. Model your home state exactly and check the first out-of-state order against reality.

### The rule that would have saved us

> **Re-run pricing after any change to artwork, placements, or supplier costs.**

We added sleeve prints across 59 products and did not reprice. **2,604 variants were priced below cost** — every tee and every hoodie — and it was only caught because a friend placed a test order and the numbers looked wrong. Write a margin audit that walks every enabled variant and reports the minimum, then run it after every bulk change.

### Don't let cheap items carry a flat target

A $5 target on a $1.50 sticker means **$7.99 retail** — mostly flat fee and shipping, but the shopper only sees the price. Consider a tiered target: a lower one for small goods, the full one for apparel.

---

## 4. Stripe

**Use a restricted key in production, not a full-access one.** The store's entire API surface was three calls, so the scopes are small:

| Call | Scope |
|---|---|
| `checkout.sessions.create` | Checkout Sessions — write |
| `checkout.sessions.retrieve` | Checkout Sessions — read |
| `webhooks.constructEventAsync` | none — local signature check |

Passing `payment_intent_data` likely also needs PaymentIntents — write, and automatic tax needs Tax — read. A full-access key turns a site compromise from "create a checkout session" into "refund everything and export the customer list".

**Webhook events to handle:**

```
checkout.session.completed
checkout.session.async_payment_succeeded
checkout.session.async_payment_failed
checkout.session.expired
```

**The webhook signing secret is only returned at creation.** You cannot read it back later, even with a full-access key. If you are unsure whether the stored secret matches the endpoint, the cheapest proof is a test order: the dashboard shows the delivery's response code. **200 means it matches, 400 means it does not.**

**`vercel env pull` redacts sensitive variables** — they arrive as empty strings. A value of length 2 (`""`) means redacted, not empty. You cannot audit secrets this way; plan to verify behaviour instead.

**Verify tax setup through the API, not the dashboard blurb.** `GET /v1/tax/settings` and `/v1/tax/registrations` will tell you whether automatic tax actually works and which states are active. If automatic tax is enabled without an active registration, checkout fails.

**Apply for non-profit pricing** if you qualify — 2.2% + $0.30 instead of 2.9% + $0.30. There is no self-serve toggle; it goes through support with your EIN and determination letter. To check whether you already have it, look at a real payment's fee: ~2.9% means you don't.

**Stripe Issuing** solves the cash-flow gap (§10) by giving you a virtual card that spends from your Stripe balance. Use case to select: **Reseller** — you buy goods from a supplier to resell. Note that Issuing spends from the *available* balance, which still lags the sale by the settlement window.

**Payout schedule and Issuing pull against each other.** A payout moves money out of the Stripe balance; the Issuing card spends from it. Sweep daily and the card has nothing to pay the supplier with. Decide the schedule *after* you know whether Issuing is approved.

---

## 5. Email

**The sending domain must be verified with your provider.** You cannot send from a gmail.com address. Verify independently through DNS rather than trusting a dashboard tick:

```
resend._domainkey.<domain>   TXT   DKIM public key
send.<domain>                TXT   v=spf1 include:amazonses.com ~all
send.<domain>                MX    feedback-smtp...amazonses.com
_dmarc.<domain>              TXT   v=DMARC1; p=quarantine
```

The root SPF listing your mailbox provider (Proton, Google) is **not** the one that matters — SPF is checked against the return path, which is the `send.` subdomain. DMARC passes via DKIM, which signs as the From domain.

**Set the From address explicitly.** Ours was derived from `ADMIN_EMAIL`, which means changing an admin address would silently change the customer-facing sender. Pin `RESEND_FROM` to something like `Store <orders@yourdomain.com>`.

**Order emails fail silently by design, and that is correct.** The send wrapper catches provider errors, logs, and returns `{ success: false }`; settlement ignores the result. A broken mailbox must never void a paid order. But it means a bad From address looks *exactly* like success — money taken, order created, supplier printing, nobody emailed. **On your test order, check the provider's dashboard, not just your inbox.**

**Watch the free tier.** 100 emails/day shared between order confirmations and your newsletter. A list send on launch day can eat the quota that receipts need.

**Audit every early-return in your signup paths.** Ours had a branch for people who had already signed a petition: it flipped a flag and returned success **without sending anything**. From outside, identical to a broken signup. It affected **223 of 375 subscribers** — the larger half of the list — and surfaced only because a customer mentioned offhand that he "couldn't verify" his email.

---

## 6. Catalogue structure and the storefront

**Group listings at query time from the naming convention.** 386 products became 18 listings with no schema change. A department page of 40 near-identical tees is not a catalogue, it is a wall.

**Derive pickers from the name, and recognise dimensions by label, not position.** `Tee (chest mark) (sleeve prints)` parses as front + add-ons. But a hoodie has no front choice, so `Hoodie (sleeve prints)` has only one parenthetical — matching by position reads the add-on as a front design and puts it in the wrong picker. Match against a known set of labels instead.

**Prefer a plain string comparison over a dynamically built regex.** Ours was assembled in a template literal, which silently ate a backslash and matched only single-word labels. A `split('+').every(isKnown)` has no escaping to get wrong.

**Carry selections across navigation.** Every add-on combination is a separate product, so ticking one is a *navigation* — and colour, size and quantity all reset. Persist them:

- **Colour and size** follow the shopper between products (same decision, different garment).
- **Quantity is scoped to the item.** Carrying "4" from a tee to a sticker they just opened would be wrong.
- Read persisted values **after mount**, or the server and first client render disagree.

**Default to the cheapest, plainest version.** Make the rule explicit rather than relying on sort order — ours landed correctly by accident, which would have broken the first time a product was added.

**Changing one dimension must not change another.** Switching design silently turned on a paid add-on, because the sibling lookup matched on front but ignored add-ons — and since every hoodie has a *null* front, "same front" matched everything and the last name alphabetically won. Score every dimension you want preserved, and weight paid ones highest.

---

## 7. Images

**Add the supplier's image hosts to `next.config.ts` `remotePatterns` before you deploy.** Miss it and every product photo 400s in production while working perfectly locally.

**Version mockup URLs by artwork.** This is the big one. Because the supplier re-renders mockups in place, the URL stays the same while the picture changes — and the image CDN caches by URL. After we stripped sleeve prints, customers saw sleeve marks on garments that no longer had them. Clearing a browser cache does nothing; the stale copy is at the edge.

Worse, it is cached **per width**, so it looks random:

```
w=384   cache=STALE   ← old render
w=640   cache=MISS    ← correct
w=1080  cache=HIT     ← correct
w=1920  cache=STALE   ← old render
```

Append a short fingerprint of the artwork (image ids, positions, scales, angles) to every stored URL. Change the art, change the URL, cache misses. Suppliers ignore unknown query parameters. Key it on artwork only, so routine price syncs don't churn the cache.

**Gallery order is product information.** Our first real customer concluded the same design was on both sides of a hoodie, because the gallery led with **two back shots** and the second had the hood up — which reads as a front. Alternate sides so image two is always the opposite face.

**Group photos by whatever changes the look** — shirt colour, phone model, magnet shape — and not by things that don't, like garment size. A measurement-style size (`10" × 3"`) changes the shape; `M` versus `L` does not.

**Beware inconsistent units.** The same supplier wrote inches three ways across three products: `"`, `″`, and `''`. Our measurement test knew one of them, so a magnet's three shapes were read as *colours* and offered under a Colour dropdown.

---

## 8. Deployment and infrastructure

**A stale build cache can fail a build in a way that looks like a code error.** Ours died with 35 copies of:

```
Module not found: Can't resolve '@vercel/turbopack-next/internal/font/google/font'
```

The giveaway was the line above: `Restored build cache from previous deployment`. It is not a font problem. **Redeploy with the build cache disabled.** A lockfile change also invalidates it.

**Environment variable changes need a redeploy** to take effect.

**Production `vercel env add` defaults to `--sensitive`**, which stops the value being inlined into the client bundle. For anything `NEXT_PUBLIC_*` that makes it `undefined` in the browser **with no build error**. Use `--no-sensitive` for those, and for non-secret flags so you can read them back.

**Never pipe a secret through PowerShell** — it prepends a BOM, and the value looks right in the dashboard while being rejected at runtime. Pass it on stdin, written with no BOM and no trailing newline.

**Check which git/GitHub account is active before pushing.** Multi-account setups silently revert. Ours did, mid-session, and the push was rejected 403. Pin `user.email` repo-locally too, so it can't fall back to a global identity that doesn't resolve on GitHub — an unmatched author email blocks the deploy.

**Watch your sync duration against the function timeout.** Ours grew from 25s to 157s against a 300s cap as the catalogue went from 455 to 827 products. A timeout mid-import is not corrupt — a re-run finishes it — but know where the ceiling is.

**Apply schema changes out of band if your build doesn't migrate.** `next build` alone does not run migrations. Verify the production schema matches your Prisma schema *column by column* before the first deploy; a missing column is a runtime 500, not a build failure.

---

## 9. What real customers notice

Our first customer's feedback was worth more than any amount of internal review:

- **"Getting to the cart is hard, you have to add something to view it."** Correct, and it costs sales. Put the cart in the header on every page, and spell out "View cart" in words on store pages — an icon alone is missed.
- **"The same design is on the back and the front."** It wasn't, but the gallery made it look that way. See §7.
- **"It feels bland — more pictures, less black-and-white text."**
- **"I couldn't verify my email, probably my end."** It was not his end. See §5. **Treat "probably my fault" as a bug report.**

---

## 10. Operations

### Cash flow is the problem nobody warns you about

The customer pays you, then your supplier charges you — but the money is stuck in the processor's settlement and payout cycle while the supplier wants paying now. You can be profitable on paper and unable to fulfil.

Options, roughly best first:

1. **A credit card on the supplier account.** The charge sits on a statement for weeks; the processor pays out in days. Costs nothing if cleared in full. The most float for the least effort.
2. **Issuing / a card that spends from your processor balance.** Skips the bank round trip; still waits for settlement.
3. **A hold flag.** Ours (`PRINTIFY_HOLD_ORDERS=true`) creates orders at the supplier but leaves them on hold until someone releases them. Turns an awkward failure into a deliberate queue. Build this in from the start.
4. **Instant payouts.** ~1.5% — on a $60 order that is $0.90, nearly a fifth of a $5 margin. An emergency valve, not a routine.

A small working float of three or four orders also works and recycles itself.

### Abandoned baskets are not cancelled orders

Checkout creates the order row *before* redirecting to the processor, so there is something for `client_reference_id` to reference. Unfinished checkouts expire and get marked cancelled — and then sit in your Cancelled tab next to real cancellations, making the dashboard look like sales are failing.

Split them on whether they were ever paid. Never-paid means abandoned. Most started checkouts never finish; this is normal and should read as a metric, not an alarm.

### Sales tax

- The customer's tax is **not your money**. Price so your margin survives after remitting it.
- **File a resale certificate with your supplier.** Goods bought for resale are not taxable to you. Without it you pay tax twice on the same item — once to the supplier, once to the state. In Michigan this is **Form 3372**, which you complete yourself citing your sales tax licence number; there is no certificate to request.
- Shipping stated separately is **not** taxable in Michigan. Verify your own state.

---

## 11. Verification discipline

The habits that caught the most:

**Dry-run every bulk write.** Every script took `--apply`; without it, it printed exactly what it would do. This caught naming collisions, wrong variant sets and miscounted targets before they touched 400 products.

**Make bulk scripts idempotent.** Skip work already done, keyed on the exact target state. Ours survived a 10-minute timeout mid-run and resumed cleanly.

**Verify at the layer that actually matters.** When photos looked wrong I checked the supplier's data (perfect), then the stored URLs (perfect), then a direct fetch (perfect) — and concluded it was fixed. It was not: the staleness was in the CDN, a layer I hadn't checked. **Reproduce the user's exact path**, including viewport width.

**Count before and after.** `6,299 variants, 2,604 below cost` is an actionable sentence. "Repricing done" is not.

**Audit the whole catalogue, not a sample.** The margin audit walked all 24,527 variants and reported the minimum. A spot check of six would have missed it.

**Place a real test order before launch.** Nothing else exercises the whole chain at once: live key, webhook signature, tax calculation, supplier submission, confirmation email. It costs one item.

---

## 12. Pre-launch checklist

```
[ ] Production schema matches the ORM schema, column by column
[ ] Image host in next.config remotePatterns
[ ] All store env vars present in production
[ ] Payment key is LIVE mode and restricted to the scopes actually used
[ ] Webhook endpoint exists, right URL, right events, matching signing secret
[ ] Tax service active with a registration for your state
[ ] Email domain verified in DNS (DKIM + return-path SPF + DMARC)
[ ] From address pinned explicitly
[ ] Email quota adequate for launch day
[ ] Margin audit: zero variants below target
[ ] Resale certificate filed with the supplier
[ ] Supplier payment method funded, or the hold flag on
[ ] Cart reachable from every page
[ ] Selections survive navigation
[ ] Listings default to the cheapest option
[ ] One real test order, end to end, checked in every dashboard
```

---

## The five that cost the most

1. **Pricing that ignored processing fees and supplier tax.** Sold below cost across every garment; caught by luck.
2. **Image URLs that don't change when the image does.** Customers shown artwork that no longer exists, invisible to cache-clearing.
3. **A listing endpoint that returns duplicates** while being written, failing the whole import on a unique constraint.
4. **A signup branch that returned success without sending.** Half the mailing list, silent, for months.
5. **Creating a supplier order and submitting it in the same breath.** Every single order needed a manual button press.

Four of the five were silent. None would have been caught by a test suite. They were caught by auditing whole data sets and by one customer saying something felt off.

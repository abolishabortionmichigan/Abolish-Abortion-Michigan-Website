# AAM Google Ads scripts

Programmatic management of the AAM Ad Grants Google Ads account. See
`docs/google-ads-campaign-plan.md` for the narrative campaign plan and
`plan.mjs` in this folder for the machine-readable version the
builder executes.

## Files

| File | What it does |
|---|---|
| `get-refresh-token.mjs` | One-time OAuth helper — spins up a local server, opens Google consent flow, writes `GOOGLE_ADS_REFRESH_TOKEN` to `.env.local`. Only run once. |
| `smoke-test.mjs` | Validates all 6 credentials work by listing accessible customers and querying the target account. Run this after any credential change. |
| `plan.mjs` | Campaign definitions (data only, no side effects). Edit here to change what the builder creates. |
| `build-campaigns.mjs` | Reads `plan.mjs` and creates all 3 campaigns + ad groups + keywords + ads in the account, **paused by default**. Supports `--dry-run`. Idempotent — skips campaigns whose name already exists. |
| `enable-campaigns.mjs` | Flips every plan campaign + its ad groups + ads from PAUSED to ENABLED. |
| `reset-plan-campaigns.mjs` | Deletes every plan campaign (and its budget). Safe: only touches campaigns whose names match `plan.mjs`. Use before a clean rebuild. |
| `nuclear-reset.mjs` | Aggressive cleanup for when `reset` leaves orphans behind. Removes every non-REMOVED ad/adgroup/campaign matching a plan name — including children of already-removed parents where possible. |
| `status.mjs` | Read-only health check — prints every plan campaign, ad group, and ad with its current status. Use to verify state without opening the Google Ads UI. |
| `list-conversions.mjs` | Read-only — lists every conversion action on the account with id, name, and status. Use when wiring `NEXT_PUBLIC_GOOGLE_ADS_CONV_*` env vars. |

## Env vars (all in `.env.local`, never committed)

```
GOOGLE_ADS_CUSTOMER_ID        # AAM Ad Grants child account, 10 digits, no dashes
GOOGLE_ADS_LOGIN_CUSTOMER_ID  # MCC parent account, 10 digits, no dashes
GOOGLE_ADS_DEVELOPER_TOKEN    # From the MCC's API Center
GOOGLE_ADS_CLIENT_ID          # OAuth 2.0 Desktop client, from Google Cloud Console
GOOGLE_ADS_CLIENT_SECRET      # From the same OAuth client
GOOGLE_ADS_REFRESH_TOKEN      # Written by get-refresh-token.mjs
```

## Typical run flow (first-time build)

```bash
# 1. Preview — no API writes
node scripts/google-ads/build-campaigns.mjs --dry-run

# 2. Create (everything lands paused)
node scripts/google-ads/build-campaigns.mjs

# 3. Review in the Google Ads UI:
#    - Are the keywords right?
#    - Do the ads pass Google's review?
#    - Are the landing pages the ones you want?
# When happy, enable each campaign in the UI.
```

## Safety guarantees

- **Nothing goes live automatically.** Every campaign, ad group, and ad is created with `status: PAUSED`. You must flip switches in the UI.
- **No duplicates.** The builder queries existing campaign names and skips any that already exist. To recreate a campaign, delete it in the UI first.
- **No secret spend.** Ad Grants gives a $10K/mo credit, not a real bill. Even if a campaign got enabled unintentionally, the account cannot overspend the credit.

## Ad Grants compliance rules baked in

- Manual CPC bidding at ≤ $2.00 (Grants max)
- Michigan geo-target on every campaign
- Search network only (partners disabled)
- Standard budget delivery
- Every keyword ≥ 2 words (no single-word or overly-generic terms)

If Google Ads later rejects any keyword for Grants-specific reasons, edit `plan.mjs` and re-run — the builder is idempotent on already-created campaigns and will only add what's missing.

## The refresh token keeps dying — publish the consent screen

Both the Ads scripts and `scripts/search-console/` fail with
`invalid_grant` / `"Bad Request"` every week or so. That is not a bug in
the scripts: the OAuth consent screen is in **Testing**, and Google
expires refresh tokens for Testing apps after **seven days**
([publishing status docs](https://support.google.com/cloud/answer/10311615)).

**Recover access** (needs a browser, so it has to be the user):

```bash
node scripts/google-ads/get-refresh-token.mjs
```

It prints a consent URL and listens on `127.0.0.1:3737`. Open the URL,
click through the "Google hasn't verified this app" warning, approve, and
it rewrites `GOOGLE_ADS_REFRESH_TOKEN` in `.env.local` itself.

**Stop it recurring** — console only; there is no gcloud command or API
for this:

1. Open the Google Auth Platform **Audience** page for the project that
   owns the OAuth client (project number `89448349439`):
   https://console.cloud.google.com/auth/audience?project=89448349439
2. Click **Publish app** and confirm, so Publishing status reads
   **In production** instead of **Testing**.

Refresh tokens then stop expiring on a timer. The app stays *unverified*,
so the "unverified app" warning still appears on the consent screen —
that is cosmetic and does not block anything, because `adwords` and
`webmasters.readonly` are *sensitive* scopes, not *restricted* ones.
Verification is only needed to remove the warning or to go past 100
users. If the owning Google account is ever moved onto Google Workspace,
switching User Type to **Internal** removes both the expiry and the
warning.

### Developer token is at Explorer access

`KeywordPlanIdeaService` (search-volume research) returns
`authorization_error: 10 — "not allowed for use with explorer access"`.
Everything else in these scripts works. Apply for **Basic** access in the
Ads API Center on the manager account to unblock keyword research.

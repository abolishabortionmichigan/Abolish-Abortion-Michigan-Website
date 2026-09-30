# Abolish Abortion Michigan

Advocacy site for abolishabortionmichigan.com. Content is the product here — the data files under `data/` drive most pages, so a "content change" is usually a JSON edit, not a component edit.

## Accounts and scopes — these differ from the other sites

- Pushes go up as the **abolishabortionmichigan** GitHub account. Several accounts exist in `gh`; switch the active one before pushing or the commit lands under the wrong identity.
- Vercel **and** PostHog for this project live under the **`abolishabortionmichigan`** team, not the personal/Maria team. CLI commands that work for the photography site will silently target the wrong scope here.

## Lockfile hazard — resolve this before trusting a build

The repo contains **both `package-lock.json` and `pnpm-lock.yaml`**, with no `packageManager` field in `package.json`.

**`vercel.json` pins `"installCommand": "npm install"`, so Vercel uses `package-lock.json` — lockfile detection never runs.** An earlier version of this note said the opposite (that pnpm wins); it was wrong and cost a broken build once. **Add every dependency with `npm install`**, or it resolves locally under pnpm and then fails on Vercel with "Cannot find module".

Pick one manager, delete the other lockfile, and add a `packageManager` field. Until then, treat any "works locally, breaks on Vercel" dependency bug as this first.

## Vercel environment variables

`NEXT_PUBLIC_*` variables must be added with `--no-sensitive`. Production defaults to `--sensitive`, which stops the value being inlined into the client bundle — it becomes `undefined` in the browser with no build error. Push an empty commit afterward to force a fresh build. This cost 90 minutes once on the PostHog setup.

## City pages

Two rules that are easy to violate because nothing enforces them:

1. **Every new city page ships with a church deep-dive in the same batch.** A city page without one is incomplete, not a first step.
2. **Don't use "Reformed" as a qualifier in church-directory copy.** The directory is deliberately open to publicly abolitionist churches of any denomination; the narrower wording misrepresents it.

## JSX text spacing

Text like `{count} counties` broken across lines collapses to `83counties`, and `</strong> word` at a line break drops the space. Use explicit `{' '}` and confirm against the built HTML.

## Data

`data/*.json` holds legislators, abortion mills, county statistics, Prop 3 vote data, abolitionist churches, and pastoral outreach candidates. `data/pastoral-outreach-candidates.json` tracks pastors flagged for future abolition-position outreach — it's a live working list, not sample data.

Anti-spam on the footer newsletter is Cloudflare Turnstile (`lib/turnstile.ts`), added after bots defeated the honeypot and time-trap layers. Keep all three layers.

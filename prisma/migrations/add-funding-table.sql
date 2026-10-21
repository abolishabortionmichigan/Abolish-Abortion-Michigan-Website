-- Admin debit-card top-ups of the Stripe balance (model Funding).
--
-- Safe migration: creates one new table and touches nothing existing, so
-- there is no data-loss path. IF NOT EXISTS makes it re-runnable.
--
-- Apply against Neon prod via one of:
--   1) psql "$DATABASE_URL" -f prisma/migrations/add-funding-table.sql
--   2) Neon SQL Editor: paste the whole file
--   3) `npx prisma db execute --file prisma/migrations/add-funding-table.sql --schema prisma/schema.prisma`
--
-- DO NOT use `prisma migrate dev` / `migrate diff` / `migrate reset` against a
-- live DATABASE_URL -- those use a shadow database and have historically wiped
-- MRA prod (2026-07-09 incident). Plain DDL like this is safe.

CREATE TABLE IF NOT EXISTS "Funding" (
  "id"                    TEXT NOT NULL,
  "reference"             TEXT NOT NULL,
  "status"                TEXT NOT NULL DEFAULT 'pending',
  "amount_cents"          INTEGER NOT NULL,
  "fee_cents"             INTEGER,
  "net_cents"             INTEGER,
  "note"                  TEXT,
  "stripe_session_id"     TEXT,
  "stripe_payment_intent" TEXT,
  "created_by"            TEXT,
  "paid_at"               TIMESTAMP(3),
  "created_at"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at"            TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Funding_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Funding_reference_key" ON "Funding" ("reference");
CREATE UNIQUE INDEX IF NOT EXISTS "Funding_stripe_session_id_key" ON "Funding" ("stripe_session_id");
CREATE INDEX IF NOT EXISTS "Funding_status_created_at_idx" ON "Funding" ("status", "created_at");

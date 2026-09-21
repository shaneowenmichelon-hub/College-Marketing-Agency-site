import { neon } from "@neondatabase/serverless";

/**
 * Postgres access for the pipeline board.
 *
 * Why a real database and not the existing Blob store: admin-analytics writes
 * one immutable encrypted blob per event and re-fetches every blob over HTTP
 * just to list them. A board needs rows that CHANGE (stage, owner, notes) and
 * a query like "everything waiting on us", which that shape cannot serve.
 *
 * Connection string comes from Vercel's Postgres/Neon integration, which sets
 * DATABASE_URL; POSTGRES_URL is accepted too since older integrations use it.
 */
function connectionString(): string | null {
  const url = process.env.DATABASE_URL?.trim() || process.env.POSTGRES_URL?.trim();
  return url || null;
}

/** True when a database is wired up. Callers degrade instead of throwing. */
export function dbConfigured(): boolean {
  return connectionString() !== null;
}

/**
 * The query function, or null when unconfigured. Deliberately NOT a throwing
 * getter: a missing database must never take a public form down, so the
 * submission path checks this and falls back to email-only.
 */
export function sql() {
  const url = connectionString();
  return url ? neon(url) : null;
}

/** Throws with an actionable message. Use from admin/cron paths only. */
export function requireSql() {
  const q = sql();
  if (!q) {
    throw new Error(
      "DATABASE_URL is not set. Create a Postgres store in Vercel → Storage and connect it to this project.",
    );
  }
  return q;
}

/**
 * Creates the schema if it is not there yet. Safe to call on every request —
 * every statement is IF NOT EXISTS — and cheap enough at this volume that it
 * saves running a separate migration step by hand.
 */
export async function ensureSchema(): Promise<void> {
  const q = requireSql();

  await q`
    create table if not exists deals (
      id              text primary key,
      source          text not null,
      stage           text not null default 'new',
      stage_source    text not null default 'auto',
      company         text,
      contact_name    text,
      email           text not null,
      phone           text,
      payload         jsonb not null default '{}'::jsonb,
      last_inbound_at timestamptz,
      last_outbound_at timestamptz,
      thread_ids      text[] not null default '{}',
      owner           text,
      notes           text,
      created_at      timestamptz not null default now(),
      updated_at      timestamptz not null default now()
    )
  `;

  // One brand = one row. Re-submissions update the existing deal rather than
  // cluttering the board, so the email is the natural key.
  await q`create unique index if not exists deals_email_key on deals (lower(email))`;
  await q`create index if not exists deals_stage_idx on deals (stage)`;
  await q`create index if not exists deals_updated_idx on deals (updated_at desc)`;

  await q`
    create table if not exists deal_events (
      id       bigserial primary key,
      deal_id  text not null references deals(id) on delete cascade,
      at       timestamptz not null default now(),
      kind     text not null,
      actor    text,
      detail   jsonb not null default '{}'::jsonb
    )
  `;
  await q`create index if not exists deal_events_deal_idx on deal_events (deal_id, at desc)`;

  // Watermarks for the Gmail sync (last historyId seen, last run time).
  await q`
    create table if not exists sync_state (
      key        text primary key,
      value      jsonb not null,
      updated_at timestamptz not null default now()
    )
  `;
}

/** Reads a sync watermark. */
export async function getSyncState<T = unknown>(key: string): Promise<T | null> {
  const q = requireSql();
  const rows = (await q`select value from sync_state where key = ${key}`) as { value: T }[];
  return rows.length ? rows[0].value : null;
}

/** Writes a sync watermark. */
export async function setSyncState(key: string, value: unknown): Promise<void> {
  const q = requireSql();
  await q`
    insert into sync_state (key, value, updated_at)
    values (${key}, ${JSON.stringify(value)}::jsonb, now())
    on conflict (key) do update set value = excluded.value, updated_at = now()
  `;
}

import crypto from "node:crypto";
import { requireSql } from "./db";
import type { Deal, DealEvent, DealEventKind, DealSource, Stage, StageSource } from "./types";

/**
 * Rows come back from the driver untyped, so `any` is confined to the two
 * mappers below and nothing past this file sees it.
 */
type Row = Record<string, any>; // eslint-disable-line

/** Postgres row → Deal. Keeps snake_case confined to this file. */
function toDeal(r: Row): Deal {
  return {
    id: r.id,
    source: r.source,
    stage: r.stage,
    stageSource: r.stage_source,
    company: r.company,
    contactName: r.contact_name,
    email: r.email,
    phone: r.phone,
    payload: r.payload ?? {},
    lastInboundAt: r.last_inbound_at ? new Date(r.last_inbound_at).toISOString() : null,
    lastOutboundAt: r.last_outbound_at ? new Date(r.last_outbound_at).toISOString() : null,
    threadIds: r.thread_ids ?? [],
    owner: r.owner,
    notes: r.notes,
    createdAt: new Date(r.created_at).toISOString(),
    updatedAt: new Date(r.updated_at).toISOString(),
  };
}

function toEvent(r: Row): DealEvent {
  return {
    id: Number(r.id),
    dealId: r.deal_id,
    at: new Date(r.at).toISOString(),
    kind: r.kind,
    actor: r.actor,
    detail: r.detail ?? {},
  };
}

async function logEvent(
  dealId: string,
  kind: DealEventKind,
  actor: string | null,
  detail: Record<string, unknown> = {},
): Promise<void> {
  const q = requireSql();
  await q`
    insert into deal_events (deal_id, kind, actor, detail)
    values (${dealId}, ${kind}, ${actor}, ${JSON.stringify(detail)}::jsonb)
  `;
}

/**
 * Records a brand submission. One brand = one row, keyed on email, so a second
 * enquiry from the same company updates the existing card and logs the event
 * rather than creating a duplicate somebody has to merge later.
 *
 * A resubmission never rewinds the stage — if they're mid-campaign and fill in
 * the contact form again, that is a note on a live deal, not a new lead.
 */
export async function upsertDealFromSubmission(input: {
  source: DealSource;
  email: string;
  company?: string | null;
  contactName?: string | null;
  phone?: string | null;
  payload: Record<string, unknown>;
}): Promise<{ deal: Deal; created: boolean }> {
  const q = requireSql();
  const email = input.email.trim().toLowerCase();
  const id = crypto.randomUUID();

  const rows = (await q`
    insert into deals (id, source, email, company, contact_name, phone, payload)
    values (
      ${id}, ${input.source}, ${email},
      ${input.company ?? null}, ${input.contactName ?? null}, ${input.phone ?? null},
      ${JSON.stringify(input.payload)}::jsonb
    )
    on conflict (lower(email)) do update set
      company      = coalesce(excluded.company, deals.company),
      contact_name = coalesce(excluded.contact_name, deals.contact_name),
      phone        = coalesce(excluded.phone, deals.phone),
      payload      = excluded.payload,
      updated_at   = now()
    returning *, (xmax = 0) as inserted
  `) as Row[];

  const row = rows[0];
  const created = row.inserted === true;
  await logEvent(row.id, created ? "created" : "note", "form", {
    source: input.source,
    message: created ? "Submitted the form" : "Submitted the form again",
  });

  return { deal: toDeal(row), created };
}

/** Every deal, newest activity first. The board slices this into columns. */
export async function listDeals(opts: { includeArchived?: boolean } = {}): Promise<Deal[]> {
  const q = requireSql();
  const rows = opts.includeArchived
    ? ((await q`select * from deals order by updated_at desc`) as Row[])
    : ((await q`select * from deals where stage <> 'archived' order by updated_at desc`) as Row[]);
  return rows.map(toDeal);
}

export async function getDeal(id: string): Promise<Deal | null> {
  const q = requireSql();
  const rows = (await q`select * from deals where id = ${id}`) as Row[];
  return rows.length ? toDeal(rows[0]) : null;
}

export async function listDealEvents(dealId: string, limit = 50): Promise<DealEvent[]> {
  const q = requireSql();
  const rows = (await q`
    select * from deal_events where deal_id = ${dealId} order by at desc limit ${limit}
  `) as Row[];
  return rows.map(toEvent);
}

/**
 * Decides whether a stage change is allowed to land, so the two automated
 * writers can never undo a person's decision:
 *
 *   manual - always wins. Somebody looked at it and chose.
 *   label  - may set proposal/campaign, and may override an auto stage.
 *   auto   - the mail sync. Only ever moves between new and conversation, and
 *            only while nothing more authoritative has touched the deal.
 *
 * Without this, the 10-minute cron would drag a signed campaign back to
 * "in conversation" the moment somebody sent an unrelated email.
 */
function changeAllowed(current: Deal, next: Stage, by: StageSource): boolean {
  if (current.stage === next) return false;
  if (by === "manual") return true;
  if (by === "label") return current.stageSource !== "manual";
  // by === "auto"
  if (current.stageSource !== "auto") return false;
  return (
    (current.stage === "new" || current.stage === "conversation") &&
    (next === "new" || next === "conversation")
  );
}

/**
 * Moves a deal. Returns the deal unchanged (and logs nothing) when the change
 * is not permitted, so callers can fire this optimistically.
 */
export async function setStage(
  id: string,
  next: Stage,
  by: StageSource,
  actor: string,
  detail: Record<string, unknown> = {},
): Promise<Deal | null> {
  const q = requireSql();
  const current = await getDeal(id);
  if (!current) return null;
  if (!changeAllowed(current, next, by)) return current;

  const rows = (await q`
    update deals set stage = ${next}, stage_source = ${by}, updated_at = now()
    where id = ${id} returning *
  `) as Row[];

  await logEvent(id, "stage_changed", actor, { from: current.stage, to: next, by, ...detail });
  return toDeal(rows[0]);
}

export async function setOwner(id: string, owner: string | null, actor: string): Promise<Deal | null> {
  const q = requireSql();
  const rows = (await q`
    update deals set owner = ${owner}, updated_at = now() where id = ${id} returning *
  `) as Row[];
  if (!rows.length) return null;
  await logEvent(id, "owner_changed", actor, { owner });
  return toDeal(rows[0]);
}

export async function addNote(id: string, note: string, actor: string): Promise<Deal | null> {
  const q = requireSql();
  const rows = (await q`
    update deals set notes = ${note}, updated_at = now() where id = ${id} returning *
  `) as Row[];
  if (!rows.length) return null;
  await logEvent(id, "note", actor, { note });
  return toDeal(rows[0]);
}

/** Deals keyed by lowercased email, for matching Gmail headers to a brand. */
export async function dealsByEmail(): Promise<Map<string, Deal>> {
  const deals = await listDeals({ includeArchived: true });
  return new Map(deals.map((d) => [d.email.toLowerCase(), d]));
}

/**
 * Applies one message seen by the Gmail sync. `direction` is "in" when the
 * brand wrote to us and "out" when we wrote to them.
 *
 * Timestamps only ever move forward: Gmail's history feed can replay an older
 * message, and an out-of-order replay must not make a deal look freshly
 * answered when it is still waiting on us.
 */
export async function recordMailActivity(
  dealId: string,
  direction: "in" | "out",
  at: string,
  threadId: string,
): Promise<void> {
  const q = requireSql();

  // The WHERE clause is what enforces forward-only: if the row already holds
  // this timestamp or a newer one, nothing updates and we log nothing.
  const rows =
    direction === "in"
      ? ((await q`
          update deals set
            last_inbound_at = ${at}::timestamptz,
            thread_ids = (select array(select distinct unnest(thread_ids || array[${threadId}]))),
            updated_at = now()
          where id = ${dealId}
            and (last_inbound_at is null or last_inbound_at < ${at}::timestamptz)
          returning id
        `) as Row[])
      : ((await q`
          update deals set
            last_outbound_at = ${at}::timestamptz,
            thread_ids = (select array(select distinct unnest(thread_ids || array[${threadId}]))),
            updated_at = now()
          where id = ${dealId}
            and (last_outbound_at is null or last_outbound_at < ${at}::timestamptz)
          returning id
        `) as Row[]);

  if (!rows.length) return;
  await logEvent(dealId, direction === "in" ? "reply_in" : "reply_out", "gmail-sync", {
    at,
    threadId,
  });
}

/** Deals matched to a Gmail thread, for label-driven stage moves. */
export async function dealByThreadId(threadId: string): Promise<Deal | null> {
  const q = requireSql();
  const rows = (await q`select * from deals where ${threadId} = any(thread_ids) limit 1`) as Row[];
  return rows.length ? toDeal(rows[0]) : null;
}

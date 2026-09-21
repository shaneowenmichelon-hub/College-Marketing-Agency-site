import { dbConfigured, ensureSchema } from "./db";
import { upsertDealFromSubmission } from "./deals";
import type { DealSource } from "./types";

/**
 * Records a brand submission on the pipeline board.
 *
 * This sits on the public form path, so the contract is: it never throws and
 * never blocks a submission. A database outage must cost us a board entry, not
 * the lead itself — the notification email still goes out either way.
 */

/** Schema check is idempotent but not free; run it once per warm instance. */
let schemaReady: Promise<void> | null = null;
function readySchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = ensureSchema().catch((err) => {
      // Reset so the next request retries rather than caching the failure.
      schemaReady = null;
      throw err;
    });
  }
  return schemaReady;
}

export async function captureDeal(input: {
  source: DealSource;
  email: string;
  company?: string | null;
  contactName?: string | null;
  phone?: string | null;
  payload: Record<string, unknown>;
}): Promise<{ ok: boolean; skipped?: boolean }> {
  if (!input.email?.trim()) return { ok: false };
  if (!dbConfigured()) {
    console.warn("[crm] DATABASE_URL unset; deal not recorded for", input.email);
    return { ok: true, skipped: true };
  }
  try {
    await readySchema();
    await upsertDealFromSubmission(input);
    return { ok: true };
  } catch (err) {
    console.error("[crm] failed to record deal", err);
    return { ok: false };
  }
}

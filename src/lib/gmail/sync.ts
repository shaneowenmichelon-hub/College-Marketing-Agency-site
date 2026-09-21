import { ensureSchema, getSyncState, setSyncState } from "@/lib/crm/db";
import { dealByThreadId, dealsByEmail, getDeal, recordMailActivity, setStage } from "@/lib/crm/deals";
import type { Deal, Stage } from "@/lib/crm/types";
import {
  getMessageMeta,
  getProfile,
  listHistory,
  listLabels,
  listMessageIds,
  parseAddresses,
  type GmailMessageMeta,
} from "./client";

const WATERMARK = "gmail:historyId";

export type SyncResult = {
  ok: boolean;
  mailbox?: string;
  scanned: number;
  matched: number;
  stageChanges: number;
  /** Threads with recent activity we could not tie to a deal. */
  unmatched: { from: string; subject: string; at: string }[];
  baselined?: boolean;
  note?: string;
};

/**
 * Addresses that count as "us". A message from any of these is an outbound
 * reply; a message to one of them is inbound. Aliases matter — replying from a
 * send-as address would otherwise look like the brand wrote to themselves.
 */
function selfAddresses(mailbox: string): Set<string> {
  const extra = (process.env.GMAIL_SELF_ADDRESSES ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return new Set([mailbox.toLowerCase(), ...extra]);
}

/** Gmail label names that drive stages 3 and 4. Matched on the last path segment. */
function stageLabels(): { proposal: string; campaign: string } {
  return {
    proposal: (process.env.GMAIL_LABEL_PROPOSAL ?? "Proposal Sent").toLowerCase(),
    campaign: (process.env.GMAIL_LABEL_CAMPAIGN ?? "Campaign Live").toLowerCase(),
  };
}

/** "Agency/Proposal Sent" → "proposal sent", so nesting in Gmail is free. */
function leafName(label: string): string {
  return label.split("/").pop()!.trim().toLowerCase();
}

/** Runs `worker` over `items` with bounded concurrency. */
async function mapLimit<T, R>(items: T[], limit: number, worker: (item: T) => Promise<R>): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (cursor < items.length) {
        const i = cursor++;
        out[i] = await worker(items[i]);
      }
    }),
  );
  return out;
}

/**
 * Decides what one message means for the board.
 *
 * Direction comes from Gmail's own SENT label rather than from parsing the From
 * header, because that is what Gmail itself considers sent — it survives
 * aliases, send-as addresses and delegated sending.
 *
 * Drafts are skipped outright. A half-written reply sitting in the compose box
 * is the exact situation the "needs reply" flag exists to catch, so counting it
 * as a reply would defeat the feature.
 */
function classify(
  meta: GmailMessageMeta,
  self: Set<string>,
  byEmail: Map<string, Deal>,
): { deal: Deal; direction: "in" | "out" } | { unmatched: { from: string; subject: string; at: string } } | null {
  if (meta.labelIds.includes("DRAFT")) return null;

  const from = parseAddresses(meta.headers.from);
  const recipients = [...parseAddresses(meta.headers.to), ...parseAddresses(meta.headers.cc)];
  const outbound = meta.labelIds.includes("SENT") || from.some((a) => self.has(a));

  // The other party: who we wrote to, or who wrote to us.
  const counterparts = outbound ? recipients.filter((a) => !self.has(a)) : from.filter((a) => !self.has(a));

  for (const address of counterparts) {
    const deal = byEmail.get(address);
    if (deal) return { deal, direction: outbound ? "out" : "in" };
  }

  // Inbound mail from a stranger is worth surfacing; our own outbound is not.
  if (!outbound && counterparts.length) {
    return {
      unmatched: {
        from: counterparts[0],
        subject: meta.headers.subject ?? "(no subject)",
        at: new Date(meta.internalDate).toISOString(),
      },
    };
  }
  return null;
}

/**
 * Re-derives the stage for deals the sync just touched.
 *
 * Only ever chooses between "new" and "conversation" — see `setStage`, which
 * refuses anything further from an automated caller. A deal sitting at
 * "proposal" or moved by hand is left exactly where it is.
 */
async function reconcileAutoStages(dealIds: Set<string>): Promise<number> {
  let changes = 0;
  for (const id of dealIds) {
    const deal = await getDeal(id);
    if (!deal || deal.stageSource !== "auto") continue;
    const want: Stage = deal.lastOutboundAt ? "conversation" : "new";
    if (deal.stage === want) continue;
    const updated = await setStage(id, want, "auto", "gmail-sync", {
      reason: want === "conversation" ? "we replied" : "no reply from us yet",
    });
    if (updated?.stage === want) changes++;
  }
  return changes;
}

/** Applies stage labels seen on a thread. Returns how many stages moved. */
async function applyLabels(
  labelAdds: { threadId: string; labelIds: string[] }[],
  labelNames: Map<string, string>,
  byThread: Map<string, Deal>,
): Promise<number> {
  const wanted = stageLabels();
  let changes = 0;

  for (const add of labelAdds) {
    // Prefer a deal matched in this batch; otherwise fall back to a thread we
    // linked on an earlier run, so labelling an old thread still works.
    const deal = byThread.get(add.threadId) ?? (await dealByThreadId(add.threadId));
    if (!deal) continue;
    for (const labelId of add.labelIds) {
      const name = leafName(labelNames.get(labelId) ?? "");
      const target: Stage | null =
        name === wanted.proposal ? "proposal" : name === wanted.campaign ? "campaign" : null;
      if (!target) continue;
      const updated = await setStage(deal.id, target, "label", "gmail-sync", { label: name });
      if (updated?.stage === target) changes++;
    }
  }
  return changes;
}

/** Processes a batch of message IDs into board activity. */
async function ingest(
  ids: { id: string; threadId: string }[],
  self: Set<string>,
  byEmail: Map<string, Deal>,
): Promise<{
  matched: number;
  touched: Set<string>;
  byThread: Map<string, Deal>;
  unmatched: SyncResult["unmatched"];
}> {
  const metas = await mapLimit(ids, 8, (m) => getMessageMeta(m.id).catch(() => null));

  const touched = new Set<string>();
  const byThread = new Map<string, Deal>();
  const unmatched: SyncResult["unmatched"] = [];
  let matched = 0;

  for (const meta of metas) {
    if (!meta) continue;
    const verdict = classify(meta, self, byEmail);
    if (!verdict) continue;

    if ("unmatched" in verdict) {
      unmatched.push(verdict.unmatched);
      continue;
    }

    await recordMailActivity(
      verdict.deal.id,
      verdict.direction,
      new Date(meta.internalDate).toISOString(),
      meta.threadId,
    );
    touched.add(verdict.deal.id);
    byThread.set(meta.threadId, verdict.deal);
    matched++;
  }

  return { matched, touched, byThread, unmatched };
}

/**
 * The 10-minute job. Reads what changed in the mailbox since last run, updates
 * who-owes-a-reply on each deal, and applies any stage labels.
 *
 * First run only records a watermark — it does not reach backwards. Use
 * `backfillGmail` once for history.
 */
export async function syncGmail(): Promise<SyncResult> {
  await ensureSchema();

  const profile = await getProfile();
  const self = selfAddresses(profile.emailAddress);
  const watermark = await getSyncState<{ historyId: string }>(WATERMARK);

  if (!watermark?.historyId) {
    await setSyncState(WATERMARK, { historyId: profile.historyId });
    return {
      ok: true,
      mailbox: profile.emailAddress,
      scanned: 0,
      matched: 0,
      stageChanges: 0,
      unmatched: [],
      baselined: true,
      note: "First run: recorded a starting point. Run the backfill once to pull in existing threads.",
    };
  }

  const history = await listHistory(watermark.historyId);

  if (history.expired) {
    await setSyncState(WATERMARK, { historyId: profile.historyId });
    return {
      ok: true,
      mailbox: profile.emailAddress,
      scanned: 0,
      matched: 0,
      stageChanges: 0,
      unmatched: [],
      baselined: true,
      note: "Gmail's history window had lapsed, so the watermark was reset. Run the backfill to catch anything missed.",
    };
  }

  const byEmail = await dealsByEmail();
  const labelNames = new Map((await listLabels()).map((l) => [l.id, l.name]));

  // Label changes reference messages too, so fold them into the same fetch.
  const ids = [
    ...history.messageIds,
    ...history.labelAdds.map((l) => ({ id: l.messageId, threadId: l.threadId })),
  ].filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);

  const { matched, touched, byThread, unmatched } = await ingest(ids, self, byEmail);

  let stageChanges = await applyLabels(history.labelAdds, labelNames, byThread);
  stageChanges += await reconcileAutoStages(touched);

  if (history.historyId) await setSyncState(WATERMARK, { historyId: history.historyId });

  return {
    ok: true,
    mailbox: profile.emailAddress,
    scanned: ids.length,
    matched,
    stageChanges,
    unmatched: unmatched.slice(0, 25),
  };
}

/**
 * One-off catch-up over recent mail, for when the board is first switched on.
 *
 * Bounded deliberately: every message costs an API call, and a serverless
 * function has a wall clock. `limit` is per folder.
 */
export async function backfillGmail(limit = 250): Promise<SyncResult> {
  await ensureSchema();

  const profile = await getProfile();
  const self = selfAddresses(profile.emailAddress);
  const byEmail = await dealsByEmail();

  const [sent, inbox] = await Promise.all([
    listMessageIds(["SENT"], limit),
    listMessageIds(["INBOX"], limit),
  ]);
  const ids = [...sent, ...inbox].filter((m, i, arr) => arr.findIndex((x) => x.id === m.id) === i);

  const { matched, touched, unmatched } = await ingest(ids, self, byEmail);
  const stageChanges = await reconcileAutoStages(touched);

  // Start incremental syncing from here on.
  await setSyncState(WATERMARK, { historyId: profile.historyId });

  return {
    ok: true,
    mailbox: profile.emailAddress,
    scanned: ids.length,
    matched,
    stageChanges,
    unmatched: unmatched.slice(0, 25),
    note: `Backfilled the most recent ${limit} sent and ${limit} received messages.`,
  };
}

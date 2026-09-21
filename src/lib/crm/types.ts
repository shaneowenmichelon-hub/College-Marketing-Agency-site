/**
 * Shared types for the internal pipeline board.
 *
 * A "deal" is one brand that came in through a form. Student ambassador
 * applications are deliberately NOT deals — "proposal sent" is meaningless for
 * a student, so they keep their own list.
 */

/** The five columns on the board. Order matters: it is the pipeline order. */
export const STAGES = ["new", "conversation", "proposal", "campaign", "archived"] as const;
export type Stage = (typeof STAGES)[number];

/** Column headings and the one-line explanation shown under each. */
export const STAGE_META: Record<Stage, { label: string; blurb: string }> = {
  new: {
    label: "New — needs reply",
    blurb: "They submitted and nobody has emailed them back yet.",
  },
  conversation: {
    label: "In conversation",
    blurb: "We've replied. No proposal has gone out yet.",
  },
  proposal: {
    label: "Proposal sent",
    blurb: "Waiting on their feedback.",
  },
  campaign: {
    label: "Campaign live",
    blurb: "Signed and running.",
  },
  archived: {
    label: "Archived",
    blurb: "Closed, lost, or gone quiet. Off the active board.",
  },
};

/**
 * How a deal arrived at its current stage. This decides who is allowed to move
 * it next, so the mail sync can never undo a decision a person made:
 *   auto   - the mail sync inferred it from who emailed last
 *   label  - a Gmail label on the thread put it here
 *   manual - somebody clicked it on the board
 */
export type StageSource = "auto" | "label" | "manual";

/** Which form the brand came in through. */
export type DealSource = "brand_inquiry" | "campaign" | "lead_magnet";

export type Deal = {
  id: string;
  source: DealSource;
  stage: Stage;
  stageSource: StageSource;
  company: string | null;
  contactName: string | null;
  email: string;
  phone: string | null;
  /** The original form submission, kept verbatim so nothing is lost. */
  payload: Record<string, unknown>;
  /** Last time the brand emailed us / we emailed them (from Gmail headers). */
  lastInboundAt: string | null;
  lastOutboundAt: string | null;
  /** Gmail threads matched to this brand. */
  threadIds: string[];
  owner: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

/** Append-only history for a deal — who changed what, and when. */
export type DealEventKind =
  | "created"
  | "stage_changed"
  | "reply_in"
  | "reply_out"
  | "note"
  | "owner_changed";

export type DealEvent = {
  id: number;
  dealId: string;
  at: string;
  kind: DealEventKind;
  /** A person's name, or "gmail-sync" when the cron did it. */
  actor: string | null;
  detail: Record<string, unknown>;
};

/**
 * The board's real daily signal, and the reason the mail sync exists: the brand
 * spoke last and nobody has answered. True at ANY stage, not just "new" — a
 * stalled proposal matters more than a fresh lead.
 */
export function needsReply(deal: Pick<Deal, "lastInboundAt" | "lastOutboundAt" | "stage">): boolean {
  if (deal.stage === "archived") return false;
  if (!deal.lastInboundAt) return false;
  if (!deal.lastOutboundAt) return true;
  return new Date(deal.lastInboundAt) > new Date(deal.lastOutboundAt);
}

/** Whole days since a timestamp, for the "waiting 6 days" badge. */
export function daysSince(iso: string | null): number | null {
  if (!iso) return null;
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / 86_400_000));
}

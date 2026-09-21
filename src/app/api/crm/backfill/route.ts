import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { dbConfigured } from "@/lib/crm/db";
import { gmailConfigured } from "@/lib/gmail/client";
import { backfillGmail } from "@/lib/gmail/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * One-off catch-up over recent mail, so the board starts with real history
 * instead of only what arrives after it was switched on.
 *
 * Admin-only and never scheduled: it is far heavier than the incremental sync
 * (one API call per message) and is meant to be pressed once.
 */
export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!dbConfigured()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not set." }, { status: 503 });
  }
  if (!(await gmailConfigured())) {
    return NextResponse.json({ ok: false, error: "Gmail is not connected." }, { status: 503 });
  }

  // Kept modest so the run finishes inside maxDuration; press it again for more.
  const requested = Number(new URL(request.url).searchParams.get("limit") ?? 250);
  const limit = Math.min(500, Math.max(50, Number.isFinite(requested) ? requested : 250));

  try {
    return NextResponse.json(await backfillGmail(limit));
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[mail-backfill]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

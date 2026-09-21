import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { dbConfigured } from "@/lib/crm/db";
import { addNote, getDeal, listDealEvents, setOwner, setStage } from "@/lib/crm/deals";
import { STAGES, type Stage } from "@/lib/crm/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** One deal plus its history, for the detail drawer. */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!dbConfigured()) {
    return NextResponse.json({ ok: false, error: "No database connected." }, { status: 503 });
  }

  const { id } = await params;
  const deal = await getDeal(id);
  if (!deal) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true, deal, events: await listDealEvents(id) });
}

/**
 * Moves a deal, assigns it, or saves a note.
 *
 * Everything here is `stageSource: "manual"`, which by design outranks both the
 * mail sync and Gmail labels — a person's decision is never reversed by the
 * cron. `actor` is recorded on the event so the history shows who did it.
 */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!dbConfigured()) {
    return NextResponse.json({ ok: false, error: "No database connected." }, { status: 503 });
  }

  const { id } = await params;
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Free text, so cap it before it reaches the database.
  const actor = String(body.actor ?? "").trim().slice(0, 60) || "team";
  let deal = await getDeal(id);
  if (!deal) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  if (typeof body.stage === "string") {
    if (!STAGES.includes(body.stage as Stage)) {
      return NextResponse.json({ ok: false, error: `Unknown stage: ${body.stage}` }, { status: 400 });
    }
    deal = await setStage(id, body.stage as Stage, "manual", actor);
  }

  if (typeof body.owner === "string" || body.owner === null) {
    const owner = body.owner === null ? null : String(body.owner).trim().slice(0, 60) || null;
    deal = await setOwner(id, owner, actor);
  }

  if (typeof body.notes === "string") {
    deal = await addNote(id, body.notes.slice(0, 5000), actor);
  }

  return NextResponse.json({ ok: true, deal });
}

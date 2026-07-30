import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { readAdminEvents, summarizeEvents } from "@/lib/admin-analytics";

export const runtime = "nodejs";

export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const days = Math.min(Math.max(Number(searchParams.get("days") || 30), 1), 90);
  const { storageConfigured, events } = await readAdminEvents(days);
  return NextResponse.json({ ok: true, summary: summarizeEvents(events, storageConfigured) });
}

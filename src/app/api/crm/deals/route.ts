import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { dbConfigured, ensureSchema, getSyncState } from "@/lib/crm/db";
import { listDeals } from "@/lib/crm/deals";
import { gmailAppConfigured } from "@/lib/gmail/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Everything the board renders, in one request. */
export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!dbConfigured()) {
    return NextResponse.json({
      ok: false,
      setup: "database",
      error:
        "No database connected yet. In Vercel → Storage, create a Postgres store and attach it to this project, then redeploy.",
    });
  }

  try {
    await ensureSchema();
    const [deals, watermark, refresh] = await Promise.all([
      listDeals({ includeArchived: true }),
      getSyncState<{ historyId: string }>("gmail:historyId"),
      getSyncState<{ at: string }>("gmail:refreshToken"),
    ]);

    return NextResponse.json({
      ok: true,
      deals,
      gmail: {
        appConfigured: gmailAppConfigured(),
        connected: Boolean(refresh?.at),
        connectedAt: refresh?.at ?? null,
        synced: Boolean(watermark?.historyId),
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

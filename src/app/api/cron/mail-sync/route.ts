import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { dbConfigured } from "@/lib/crm/db";
import { gmailConfigured } from "@/lib/gmail/client";
import { syncGmail } from "@/lib/gmail/sync";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
/** Gmail calls are network-bound; a busy window needs more than the default 10s. */
export const maxDuration = 60;

/**
 * Reads the mailbox and updates the board. Scheduled every 10 minutes in
 * vercel.json.
 *
 * This route FAILS CLOSED, unlike /api/cron/article-art, which treats an unset
 * CRON_SECRET as permission to run. That route only busts a cache; this one
 * reaches into a mailbox and rewrites the pipeline, so an unauthenticated
 * caller is refused rather than served.
 */
async function authorized(request: Request): Promise<boolean> {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret) {
    // Vercel Cron sends CRON_SECRET as a bearer token.
    if (request.headers.get("authorization") === `Bearer ${secret}`) return true;
    if (new URL(request.url).searchParams.get("key") === secret) return true;
  }
  // A signed-in admin can always trigger a run by hand from the board.
  return await requireAdmin();
}

async function run(request: Request) {
  if (!(await authorized(request))) {
    return NextResponse.json(
      {
        ok: false,
        error: process.env.CRON_SECRET?.trim()
          ? "Unauthorized"
          : "CRON_SECRET is not set, so scheduled runs cannot authenticate. Add it in Vercel → Settings → Environment Variables.",
      },
      { status: 401 },
    );
  }

  if (!dbConfigured()) {
    return NextResponse.json({ ok: false, error: "DATABASE_URL is not set." }, { status: 503 });
  }
  if (!(await gmailConfigured())) {
    return NextResponse.json(
      { ok: false, error: "Gmail is not connected. Open /api/gmail/connect while signed in as admin." },
      { status: 503 },
    );
  }

  try {
    const result = await syncGmail();
    return NextResponse.json(result);
  } catch (err) {
    // A failed run must not retry-storm or look successful in the cron log.
    const message = err instanceof Error ? err.message : String(err);
    console.error("[mail-sync]", message);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  return run(request);
}

export async function POST(request: Request) {
  return run(request);
}

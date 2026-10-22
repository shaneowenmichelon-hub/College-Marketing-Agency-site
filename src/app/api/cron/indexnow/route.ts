import { NextResponse } from "next/server";
import sitemap from "@/app/sitemap";
import { pingIndexNow } from "@/lib/indexnow";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

/**
 * Submits sitemap URLs with a recent lastmod to IndexNow.
 * Vercel Cron sends CRON_SECRET as a bearer token when that env var is set.
 * Preview and local calls do not ping the live host.
 */
function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return true;
  const header = request.headers.get("authorization") || "";
  if (header === `Bearer ${secret}`) return true;
  return new URL(request.url).searchParams.get("key") === secret;
}

export async function GET(request: Request) {
  if (!authorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  if (process.env.VERCEL_ENV !== "production" && process.env.INDEXNOW_PING !== "1") {
    return NextResponse.json({ ok: true, skipped: "not-production" });
  }

  const result = await pingIndexNow(sitemap());
  return NextResponse.json({
    ok: result.status === 200 || result.status === 202 || result.count === 0,
    status: result.status,
    count: result.count,
    body: result.body.slice(0, 300),
  });
}

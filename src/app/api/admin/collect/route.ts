import { NextResponse } from "next/server";
import { classifySource, clientIp, hashIp, recordAdminEvent } from "@/lib/admin-analytics";
import { rateLimit, sweep } from "@/lib/rate-limit";

export const runtime = "nodejs";

function clean(value: unknown, max = 500): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : undefined;
}

export async function POST(request: Request) {
  sweep();
  const ip = clientIp(request);
  const rl = rateLimit(`admin-collect:${ip}`, { limit: 90, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: true, rateLimited: true });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const path = clean(body.path, 250) || "/";
  // Do not track admin dashboard views inside the public analytics stream.
  if (path.startsWith("/private-ops-7f3a") || path.startsWith("/api/admin")) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const referrer = clean(body.referrer, 500);
  const sourceHint = clean(body.utm_source, 100);
  const classified = classifySource(referrer, sourceHint);

  const result = await recordAdminEvent({
    type: "page_view",
    path,
    title: clean(body.title, 250),
    referrer,
    source: sourceHint || classified.source,
    medium: clean(body.utm_medium, 100) || classified.medium,
    campaign: clean(body.utm_campaign, 150),
    term: clean(body.utm_term, 150),
    content: clean(body.utm_content, 150),
    landingPage: clean(body.landing_page, 250) || path,
    llmSource: classified.llmSource,
    country: request.headers.get("x-vercel-ip-country") || undefined,
    city: request.headers.get("x-vercel-ip-city") || undefined,
    region: request.headers.get("x-vercel-ip-country-region") || undefined,
    userAgent: request.headers.get("user-agent") || undefined,
    ipHash: hashIp(ip),
  });

  return NextResponse.json(result);
}

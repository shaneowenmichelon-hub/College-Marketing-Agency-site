import { NextResponse } from "next/server";
import { isEduEmail } from "@/lib/utils";
import { rateLimit, clientIp, sweep } from "@/lib/rate-limit";
import { clientIp as analyticsClientIp, hashIp, recordAdminEvent } from "@/lib/admin-analytics";

export const runtime = "nodejs";

// Shared-secret access code given to approved ambassadors. Override with the
// PORTAL_ACCESS_CODE env var; the default keeps the portal testable in dev.
// TODO: replace with real per-user auth (Clerk / NextAuth / Supabase) — this is
// a shared secret and does NOT authenticate individuals.
const ACCESS_CODE = process.env.PORTAL_ACCESS_CODE || "collegiate2026";

export async function POST(request: Request) {
  sweep();
  const rl = rateLimit(`portal-login:${clientIp(request)}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many attempts. Try again shortly." },
      { status: 429 },
    );
  }

  let body: { email?: string; code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const code = String(body.code ?? "").trim();

  if (!isEduEmail(email)) {
    return NextResponse.json({ ok: false, error: "Use your .edu school email." }, { status: 422 });
  }
  if (code !== ACCESS_CODE) {
    return NextResponse.json({ ok: false, error: "Invalid access code." }, { status: 401 });
  }

  await recordAdminEvent({
    type: "portal_login",
    path: "/portal",
    source: "Ambassador portal",
    medium: "portal",
    userAgent: request.headers.get("user-agent") || undefined,
    ipHash: hashIp(analyticsClientIp(request)),
    data: { email },
  });

  // Never return the code; the client only stores the email as a session flag.
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { ADMIN_COOKIE, createAdminSession, verifyAdminCode } from "@/lib/admin-auth";
import { clientIp, hashIp, recordAdminEvent } from "@/lib/admin-analytics";
import { rateLimit, sweep } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: Request) {
  sweep();
  const ip = clientIp(request);
  const rl = rateLimit(`admin-login:${ip}`, { limit: 8, windowMs: 10 * 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Too many attempts." }, { status: 429 });
  }

  let body: { code?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (!verifyAdminCode(String(body.code || ""))) {
    return NextResponse.json({ ok: false, error: "Invalid access code." }, { status: 401 });
  }

  let session: string;
  try {
    session = createAdminSession();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Admin session secret is not configured in Vercel yet." },
      { status: 503 },
    );
  }

  await recordAdminEvent({
    type: "admin_login",
    path: "/private-ops-7f3a",
    source: "Admin",
    medium: "login",
    ipHash: hashIp(ip),
    userAgent: request.headers.get("user-agent") || undefined,
  });

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, session, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 14 * 24 * 60 * 60,
  });
  return res;
}

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/admin-auth";
import { ensureSchema, setSyncState } from "@/lib/crm/db";
import { REFRESH_TOKEN_KEY, resetTokenCache } from "@/lib/gmail/client";
import { GMAIL_STATE_COOKIE, callbackUrl } from "@/lib/gmail/oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Step two: swap the one-time code for a refresh token and store it.
 *
 * The refresh token is the durable credential — it is what lets the 10-minute
 * cron authenticate with nobody present. It goes in the database rather than an
 * env var so connecting (or reconnecting after a revoke) needs no redeploy.
 */
export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return NextResponse.json({ ok: false, error: `Google returned: ${error}` }, { status: 400 });
  }

  const jar = await cookies();
  const expected = jar.get(GMAIL_STATE_COOKIE)?.value;
  if (!code || !state || !expected || state !== expected) {
    return NextResponse.json(
      { ok: false, error: "Authorisation state did not match. Start again at /api/gmail/connect." },
      { status: 400 },
    );
  }
  jar.delete(GMAIL_STATE_COOKIE);

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!.trim(),
      client_secret: process.env.GOOGLE_CLIENT_SECRET!.trim(),
      redirect_uri: callbackUrl(request),
      grant_type: "authorization_code",
    }),
  });

  if (!res.ok) {
    return NextResponse.json(
      { ok: false, error: `Token exchange failed (${res.status}): ${(await res.text()).slice(0, 300)}` },
      { status: 502 },
    );
  }

  const json = (await res.json()) as { refresh_token?: string; scope?: string };
  if (!json.refresh_token) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Google did not return a refresh token. Remove this app at myaccount.google.com/permissions, then try again.",
      },
      { status: 502 },
    );
  }

  await ensureSchema();
  await setSyncState(REFRESH_TOKEN_KEY, { token: json.refresh_token, scope: json.scope, at: new Date().toISOString() });
  resetTokenCache();

  return NextResponse.redirect(new URL("/private-ops-7f3a/pipeline?connected=1", url.origin));
}

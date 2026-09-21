import crypto from "node:crypto";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { requireAdmin } from "@/lib/admin-auth";
import { gmailAppConfigured } from "@/lib/gmail/client";
import { GMAIL_SCOPE, GMAIL_STATE_COOKIE, callbackUrl } from "@/lib/gmail/oauth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Step one of connecting the mailbox: bounce to Google's consent screen.
 *
 * Admin-only, because completing this grants the deployed app standing access
 * to a real inbox.
 *
 * The scope is `gmail.metadata` and nothing else — headers and labels, never
 * message bodies or attachments. `access_type=offline` with `prompt=consent` is
 * what makes Google hand back a refresh token; without the prompt it returns
 * one only on the very first authorisation, so reconnecting would silently
 * yield nothing to store.
 */
export async function GET(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!gmailAppConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET first (Google Cloud Console → APIs & Services → Credentials → OAuth client ID, type: Web application).",
      },
      { status: 400 },
    );
  }

  // CSRF guard: a nonce we hand to Google and check again on the way back.
  const state = crypto.randomBytes(24).toString("hex");
  const jar = await cookies();
  jar.set(GMAIL_STATE_COOKIE, state, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: 600,
  });

  const auth = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  auth.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID!.trim());
  auth.searchParams.set("redirect_uri", callbackUrl(request));
  auth.searchParams.set("response_type", "code");
  auth.searchParams.set("scope", GMAIL_SCOPE);
  auth.searchParams.set("access_type", "offline");
  auth.searchParams.set("prompt", "consent");
  auth.searchParams.set("state", state);

  return NextResponse.redirect(auth.toString());
}

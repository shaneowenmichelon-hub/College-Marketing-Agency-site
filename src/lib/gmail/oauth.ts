/**
 * Shared bits of the Gmail OAuth handshake.
 *
 * These live here rather than in the route files because Next validates the
 * exports of a route module — anything beyond the handlers and the recognised
 * config keys fails the build.
 */

export const GMAIL_STATE_COOKIE = "ca_gmail_oauth_state";

/** Headers and labels only. Never message bodies or attachments. */
export const GMAIL_SCOPE = "https://www.googleapis.com/auth/gmail.metadata";

/**
 * Must match a redirect URI registered on the OAuth client exactly. Derived
 * from the request so preview deployments work, with an env override for when
 * the public URL differs from the one the function sees.
 */
export function callbackUrl(request: Request): string {
  const override = process.env.GOOGLE_REDIRECT_URI?.trim();
  if (override) return override;
  return new URL("/api/gmail/callback", new URL(request.url).origin).toString();
}

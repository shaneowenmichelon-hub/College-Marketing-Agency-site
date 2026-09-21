import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ch_admin_session";

// Fallback access-code hash. Currently the simple code "collegiate" (sha256).
// Override with ADMIN_ACCESS_CODE_SHA256 in Vercel env to set your own code.
// NOTE: this gate stays on because the dashboard shows applicant personal data.
const FALLBACK_ADMIN_CODE_SHA256 =
  "30f87a9672d9f18bffe25925c5e936d071f5fef822ab2afecab5b3d1e5223529";

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

/**
 * Key used to sign session cookies.
 *
 * There is deliberately NO production fallback. The previous default derived
 * the key from FALLBACK_ADMIN_CODE_SHA256 — a constant sitting ten lines above
 * this one — so anyone who could read this file could mint a valid session
 * cookie and skip the access code entirely. With the pipeline board behind this
 * gate that is a hole, not a convenience, so an unset secret now fails closed:
 * callers surface "not configured" rather than quietly trusting a public key.
 */
function sessionSecret(): string {
  const configured = process.env.ADMIN_SESSION_SECRET?.trim();
  if (configured) return configured;
  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "ADMIN_SESSION_SECRET is not set. Generate one (openssl rand -hex 32) and add it in Vercel → Settings → Environment Variables.",
    );
  }
  return `dev-only-session:${FALLBACK_ADMIN_CODE_SHA256}`;
}

function hmac(payload: string): string {
  return crypto.createHmac("sha256", sessionSecret()).update(payload).digest("hex");
}

/**
 * Constant-time compare that tolerates a length mismatch.
 *
 * crypto.timingSafeEqual THROWS when the two buffers differ in length, and both
 * call sites below compare against attacker-supplied input — so a short cookie
 * or a misconfigured hash raised a 500 instead of cleanly failing the check.
 */
function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

export function verifyAdminCode(code: string): boolean {
  const expected = process.env.ADMIN_ACCESS_CODE_SHA256?.trim() || FALLBACK_ADMIN_CODE_SHA256;
  return safeEqual(sha256(code.trim()), expected);
}

export function createAdminSession(): string {
  const issuedAt = Date.now();
  const nonce = crypto.randomBytes(12).toString("hex");
  const payload = `${issuedAt}.${nonce}`;
  return `${payload}.${hmac(payload)}`;
}

export function verifyAdminSession(value?: string | null): boolean {
  if (!value) return false;
  const parts = value.split(".");
  if (parts.length !== 3) return false;
  const [issuedAtRaw, nonce, sig] = parts;
  const payload = `${issuedAtRaw}.${nonce}`;
  let expected: string;
  try {
    expected = hmac(payload);
  } catch {
    // No session secret configured — reject rather than trust anything.
    return false;
  }
  if (!safeEqual(sig, expected)) return false;
  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return false;
  // 14-day admin session.
  return Date.now() - issuedAt < 14 * 24 * 60 * 60 * 1000;
}

export async function requireAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
}

import crypto from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ch_admin_session";

// Fallback access-code hash generated for Shane. Prefer overriding with
// ADMIN_ACCESS_CODE_SHA256 in Vercel env when dashboard ownership moves fully
// into the Vercel dashboard.
const FALLBACK_ADMIN_CODE_SHA256 =
  "9ec004c312597f729add2c7365b3391781dce734bac977cb12be7d5f02de1cbd";

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function sessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || null;
}

function hmac(payload: string): string {
  const secret = sessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET is required for admin sessions.");
  return crypto.createHmac("sha256", secret).update(payload).digest("hex");
}

export function verifyAdminCode(code: string): boolean {
  const expected = process.env.ADMIN_ACCESS_CODE_SHA256 || FALLBACK_ADMIN_CODE_SHA256;
  const actual = sha256(code.trim());
  return crypto.timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
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
    return false;
  }
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return false;
  const issuedAt = Number(issuedAtRaw);
  if (!Number.isFinite(issuedAt)) return false;
  // 14-day admin session.
  return Date.now() - issuedAt < 14 * 24 * 60 * 60 * 1000;
}

export async function requireAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyAdminSession(cookieStore.get(ADMIN_COOKIE)?.value);
}

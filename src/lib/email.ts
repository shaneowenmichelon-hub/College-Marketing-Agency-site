/**
 * Transactional email - provider-swappable, fails gracefully.
 * ----------------------------------------------------------
 * Default provider: Resend. When RESEND_API_KEY is unset/empty, sending is a
 * no-op (logged) and returns { ok: true, skipped: true } - forms still succeed.
 *
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │ TO SWAP PROVIDERS (Postmark / SendGrid / SES / Nodemailer SMTP):          │
 * │ replace ONLY the `deliver()` function below. Everything else - the        │
 * │ graceful-disable behavior, the return shape, the callers - stays the same.│
 * └─────────────────────────────────────────────────────────────────────────┘
 */

import { Resend } from "resend";
import { emailDefaults } from "@/site.config";

export type SendEmailArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text: string;
  replyTo?: string;
};

export type SendEmailResult = { ok: boolean; skipped?: boolean; id?: string };

const FROM = process.env.EMAIL_FROM || emailDefaults.from;

/** The agency inbox that receives internal notifications. */
export const AGENCY_INBOX = process.env.AGENCY_INBOX || emailDefaults.inbox;

function emailEnabled(): boolean {
  return !!process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim() !== "";
}

/* ── PROVIDER CALL - the single swap point ─────────────────────────────────
 * Return a provider message id on success, or throw to signal failure.
 */
async function deliver(args: SendEmailArgs): Promise<string | undefined> {
  const resend = new Resend(process.env.RESEND_API_KEY);
  const { data, error } = await resend.emails.send({
    from: FROM,
    to: Array.isArray(args.to) ? args.to : [args.to],
    subject: args.subject,
    html: args.html,
    text: args.text,
    ...(args.replyTo ? { replyTo: args.replyTo } : {}),
  });
  if (error) throw new Error(error.message);
  return data?.id;
}
/* ─────────────────────────────────────────────────────────────────────────── */

/**
 * Send an email. Never throws - a delivery failure is logged and returns
 * { ok: false } so the caller (a form handler) can still respond with success.
 */
export async function sendEmail(args: SendEmailArgs): Promise<SendEmailResult> {
  if (!emailEnabled()) {
    console.warn(
      `[email] disabled - no RESEND_API_KEY set. Would have sent: "${args.subject}" to ${
        Array.isArray(args.to) ? args.to.join(", ") : args.to
      }`,
    );
    return { ok: true, skipped: true };
  }

  // Common misconfig: key is set but EMAIL_FROM is still the placeholder domain,
  // which Resend rejects because the domain isn't verified. Surface it clearly.
  if (!process.env.EMAIL_FROM) {
    console.warn(
      `[email] EMAIL_FROM is not set - using default "${FROM}". Resend will REJECT this ` +
        `unless that domain is verified. Set EMAIL_FROM to a verified sender (or ` +
        `"onboarding@resend.dev" to test).`,
    );
  }

  try {
    const id = await deliver(args);
    console.log(`[email] sent "${args.subject}" -> ${Array.isArray(args.to) ? args.to.join(", ") : args.to} (id: ${id})`);
    return { ok: true, id };
  } catch (err) {
    console.error(
      `[email] send FAILED ("${args.subject}"):`,
      err instanceof Error ? err.message : err,
      "- check RESEND_API_KEY and that EMAIL_FROM is a VERIFIED sender.",
    );
    return { ok: false };
  }
}

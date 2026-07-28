import { NextResponse, after } from "next/server";
import { isValidEmail } from "@/lib/utils";
import { sendEmail, AGENCY_INBOX } from "@/lib/email";
import { brandConfirmation, internalNotification } from "@/lib/email-templates";
import { rateLimit, clientIp, sweep } from "@/lib/rate-limit";
import { ATTRIBUTION_KEYS, type Attribution, type BrandLead } from "@/lib/leads";

// Email SDK needs the Node runtime (not edge).
export const runtime = "nodejs";

/**
 * Brand "Get Started" / contact + lead-magnet submissions.
 * Validate → send brand confirmation + internal notification (parallel, non-blocking
 * on failure) → return success. Always logs a structured submission record so no
 * lead is lost even before email is configured.
 *
 * TODO (optional): also persist to Google Sheet / CRM / DB.
 */
export async function POST(request: Request) {
  sweep();
  const ip = clientIp(request);
  const rl = rateLimit(`contact:${ip}`, { limit: 6, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfter) } },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (typeof body.company_website === "string" && body.company_website.trim() !== "") {
    return NextResponse.json({ ok: true }); // pretend success
  }

  // Time-to-submit: forms submitted implausibly fast are almost always bots.
  const elapsed = Number(body.elapsedMs ?? 0);
  if (elapsed > 0 && elapsed < 1200) {
    return NextResponse.json({ ok: true }); // silently drop
  }

  const kind = body.kind === "lead_magnet" ? "lead_magnet" : "brand_inquiry";
  const company = String(body.company ?? "").trim();
  const email = String(body.email ?? "").trim();

  const errors: Record<string, string> = {};
  if (kind === "brand_inquiry" && !company) errors.company = "Company is required.";
  if (!email) errors.email = "Work email is required.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const attribution: Attribution = {};
  const rawAttr = (body.attribution ?? {}) as Record<string, unknown>;
  for (const k of ATTRIBUTION_KEYS) {
    const v = rawAttr[k];
    if (typeof v === "string" && v) attribution[k] = v;
  }

  const lead: BrandLead = {
    kind,
    firstName: String(body.firstName ?? ""),
    lastName: String(body.lastName ?? ""),
    company,
    email,
    phone: String(body.phone ?? ""),
    interests: Array.isArray(body.interests) ? (body.interests as string[]) : [],
    budget: String(body.budget ?? ""),
    message: String(body.message ?? ""),
    resource: String(body.resource ?? ""),
    attribution,
  };

  // Structured submission record — the capture fallback (never lose a lead).
  console.log("[lead]", JSON.stringify({ at: new Date().toISOString(), ...lead }));

  // Fire both emails AFTER the response returns so the sender isn't kept waiting
  // on Resend. Failures are logged inside sendEmail and never surface to the user.
  const confirmation = brandConfirmation(lead);
  const internal = internalNotification(kind, lead);
  after(async () => {
    await Promise.allSettled([
      sendEmail({
        to: email,
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
        replyTo: AGENCY_INBOX,
      }),
      sendEmail({
        to: AGENCY_INBOX,
        subject: internal.subject,
        html: internal.html,
        text: internal.text,
        replyTo: email,
      }),
    ]);
  });

  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { ageFromDOB, isEduEmail } from "@/lib/utils";
import { sendEmail, AGENCY_INBOX } from "@/lib/email";
import { studentConfirmation, internalNotification } from "@/lib/email-templates";
import { rateLimit, clientIp, sweep } from "@/lib/rate-limit";
import { ATTRIBUTION_KEYS, type Attribution, type StudentLead } from "@/lib/leads";

// Email SDK needs the Node runtime (not edge).
export const runtime = "nodejs";

/**
 * Student ambassador applications.
 * Validate (18+ gate, .edu check) → send applicant confirmation + internal
 * notification (parallel, non-blocking on failure) → return success. Always logs
 * a structured submission record so no application is lost before email is live.
 *
 * TODO (optional): also persist to Google Sheet / CRM / DB.
 * TODO: hand student applications off to the ambassador portal.
 */
export async function POST(request: Request) {
  sweep();
  const ip = clientIp(request);
  const rl = rateLimit(`apply:${ip}`, { limit: 6, windowMs: 60_000 });
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

  // Honeypot.
  if (typeof body.nickname === "string" && body.nickname.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Time-to-submit bot check.
  const elapsed = Number(body.elapsedMs ?? 0);
  if (elapsed > 0 && elapsed < 1500) {
    return NextResponse.json({ ok: true });
  }

  const fullName = String(body.fullName ?? "").trim();
  const dob = String(body.dob ?? "").trim();
  const school = String(body.school ?? "").trim();
  const schoolEmail = String(body.schoolEmail ?? "").trim();
  const why = String(body.why ?? "").trim();

  const errors: Record<string, string> = {};
  if (!fullName) errors.fullName = "Your name is required.";

  const age = ageFromDOB(dob);
  if (age === null) errors.dob = "Enter your date of birth.";
  else if (age < 18) errors.dob = "You must be 18 or older to apply.";

  if (!school) errors.school = "Your school is required.";
  if (!schoolEmail) errors.schoolEmail = "School email is required.";
  else if (!isEduEmail(schoolEmail)) errors.schoolEmail = "Use a valid .edu email.";
  if (!why) errors.why = "Tell us a little about why you want to join.";

  const agreements = (body.agreements ?? {}) as Record<string, unknown>;
  if (!agreements.age) errors.age = "You must confirm you're 18+.";
  if (!agreements.terms) errors.terms = "You must accept the terms.";
  if (!agreements.ftc) errors.ftc = "Please acknowledge the disclosure requirement.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const attribution: Attribution = {};
  const rawAttr = (body.attribution ?? {}) as Record<string, unknown>;
  for (const k of ATTRIBUTION_KEYS) {
    const v = rawAttr[k];
    if (typeof v === "string" && v) attribution[k] = v;
  }

  const lead: StudentLead = {
    kind: "student_application",
    fullName,
    dob,
    phone: String(body.phone ?? ""),
    city: String(body.city ?? ""),
    state: String(body.state ?? ""),
    school,
    schoolEmail,
    gradYear: String(body.gradYear ?? ""),
    major: String(body.major ?? ""),
    instagram: String(body.instagram ?? ""),
    tiktok: String(body.tiktok ?? ""),
    igFollowers: String(body.igFollowers ?? ""),
    ttFollowers: String(body.ttFollowers ?? ""),
    niche: String(body.niche ?? ""),
    why,
    resumeName: String(body.resumeName ?? ""),
    attribution,
  };

  // Structured submission record — capture fallback (never lose an application).
  console.log("[lead]", JSON.stringify({ at: new Date().toISOString(), ...lead }));

  const confirmation = studentConfirmation(lead);
  const internal = internalNotification("student_application", lead);
  await Promise.allSettled([
    sendEmail({
      to: schoolEmail,
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
      replyTo: schoolEmail,
    }),
  ]);

  return NextResponse.json({ ok: true });
}

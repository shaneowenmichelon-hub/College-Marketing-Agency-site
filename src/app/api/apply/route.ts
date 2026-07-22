import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { ageFromDOB, isEduEmail } from "@/lib/utils";
import { sendEmail, AGENCY_INBOX } from "@/lib/email";
import { studentConfirmation, internalNotification, type SecureLink } from "@/lib/email-templates";
import { rateLimit, clientIp, sweep } from "@/lib/rate-limit";
import { ATTRIBUTION_KEYS, type Attribution, type StudentLead } from "@/lib/leads";
import { uploadPrivate } from "@/lib/storage";
import { ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_BYTES } from "@/lib/uploads";

// Email SDK + Blob storage need the Node runtime (not edge).
export const runtime = "nodejs";

function validateIdFile(file: File | null, which: string, errors: Record<string, string>) {
  if (!file || file.size === 0) {
    errors[which] = "This ID photo is required.";
    return;
  }
  if (file.size > MAX_UPLOAD_BYTES) errors[which] = "File is larger than 10MB.";
  else if (file.type && !ALLOWED_UPLOAD_TYPES.includes(file.type))
    errors[which] = "Use a JPG, PNG, HEIC, WEBP, or PDF.";
}

/**
 * Student ambassador applications (multipart/form-data — includes ID photos).
 * Validate (18+ gate, .edu, ID files) → upload IDs to PRIVATE storage → email a
 * confirmation to the applicant + an internal notification with SECURE LINKS to
 * the IDs (never the raw files). Graceful when email/storage env vars are unset.
 *
 * ID URLs are only ever placed in the internal email — never returned to the
 * browser, logged in plaintext, or added to analytics / query strings.
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

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
  }
  const str = (k: string) => String(form.get(k) ?? "").trim();

  // Honeypot + time-to-submit bot checks.
  if (str("nickname") !== "") return NextResponse.json({ ok: true });
  const elapsed = Number(form.get("elapsedMs") ?? 0);
  if (elapsed > 0 && elapsed < 1500) return NextResponse.json({ ok: true });

  const fullName = str("fullName");
  const dob = str("dob");
  const school = str("school");
  const schoolEmail = str("schoolEmail");
  const why = str("why");

  let agreements: Record<string, unknown> = {};
  try {
    agreements = JSON.parse(str("agreements") || "{}");
  } catch {
    /* ignore */
  }

  const idFront = form.get("idFront") as File | null;
  const idBack = form.get("idBack") as File | null;

  const errors: Record<string, string> = {};
  if (!fullName) errors.fullName = "Your name is required.";
  const age = ageFromDOB(dob);
  if (age === null) errors.dob = "Enter your date of birth.";
  else if (age < 18) errors.dob = "You must be 18 or older to apply.";
  if (!school) errors.school = "Your school is required.";
  if (!schoolEmail) errors.schoolEmail = "School email is required.";
  else if (!isEduEmail(schoolEmail)) errors.schoolEmail = "Use a valid .edu email.";
  if (!why) errors.why = "Tell us a little about why you want to join.";
  if (!agreements.age) errors.age = "You must confirm you're 18+.";
  if (!agreements.terms) errors.terms = "You must accept the terms.";
  if (!agreements.ftc) errors.ftc = "Please acknowledge the disclosure requirement.";
  validateIdFile(idFront, "idFront", errors);
  validateIdFile(idBack, "idBack", errors);

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Attribution.
  const attribution: Attribution = {};
  try {
    const raw = JSON.parse(str("attribution") || "{}") as Record<string, unknown>;
    for (const k of ATTRIBUTION_KEYS) {
      const v = raw[k];
      if (typeof v === "string" && v) attribution[k] = v;
    }
  } catch {
    /* ignore */
  }

  // Upload IDs to private storage (unguessable paths). Never blocks submission.
  const submissionId = randomUUID();
  const [frontUp, backUp] = await Promise.all([
    uploadPrivate(`ambassador-ids/${submissionId}/front-${safeName(idFront!.name)}`, idFront!),
    uploadPrivate(`ambassador-ids/${submissionId}/back-${safeName(idBack!.name)}`, idBack!),
  ]);
  const secureLinks: SecureLink[] = [
    { label: "Government ID — front", url: frontUp.url, note: frontUp.note },
    { label: "Government ID — back", url: backUp.url, note: backUp.note },
  ];

  const lead: StudentLead = {
    kind: "student_application",
    fullName,
    dob,
    phone: str("phone"),
    city: str("city"),
    state: str("state"),
    school,
    schoolEmail,
    gradYear: str("gradYear"),
    major: str("major"),
    instagram: str("instagram"),
    tiktok: str("tiktok"),
    igFollowers: str("igFollowers"),
    ttFollowers: str("ttFollowers"),
    niche: str("niche"),
    why,
    attribution,
  };

  // Structured record — NO ID URLs in logs, just whether they were stored.
  console.log(
    "[lead]",
    JSON.stringify({
      at: new Date().toISOString(),
      ...lead,
      idFrontStored: !!frontUp.url,
      idBackStored: !!backUp.url,
    }),
  );

  const confirmation = studentConfirmation(lead);
  const internal = internalNotification("student_application", lead, secureLinks);
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
      replyTo: schoolEmail, // reply goes straight to the applicant
    }),
  ]);

  return NextResponse.json({ ok: true });
}

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60) || "file";
}

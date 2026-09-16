import { NextResponse, after } from "next/server";
import { ageFromDOB, isEduEmail } from "@/lib/utils";
import { sendEmail, AGENCY_INBOX } from "@/lib/email";
import { studentConfirmation, internalNotification } from "@/lib/email-templates";
import { rateLimit, clientIp, sweep } from "@/lib/rate-limit";
import { ATTRIBUTION_KEYS, type Attribution, type StudentLead } from "@/lib/leads";
import { classifySource, clientIp as analyticsClientIp, hashIp, recordAdminEvent } from "@/lib/admin-analytics";

// Email SDK needs the Node runtime (not edge).
export const runtime = "nodejs";

/**
 * Student ambassador applications (JSON). ID photos are uploaded DIRECTLY from
 * the browser to Vercel Blob (see /api/blob/upload) before this runs, so we only
 * receive their secure URLs here - the large files never hit this function (no
 * 4.5MB limit). Type/size were validated at the token route + client side.
 *
 * Validate (18+ gate, .edu) → email a confirmation to the applicant + an internal
 * notification with SECURE ID LINKS (never raw files). Graceful when email or
 * storage is unset. ID URLs are only ever placed in the internal email.
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
  const str = (k: string) => String(body[k] ?? "").trim();

  // Honeypot + time-to-submit bot checks.
  if (str("nickname") !== "") return NextResponse.json({ ok: true });
  const elapsed = Number(body.elapsedMs ?? 0);
  if (elapsed > 0 && elapsed < 1500) return NextResponse.json({ ok: true });

  const fullName = str("fullName");
  const dob = str("dob");
  const school = str("school");
  const schoolEmail = str("schoolEmail");
  const phone = str("phone");
  const why = str("why");
  const agreements = (body.agreements ?? {}) as Record<string, unknown>;

  const errors: Record<string, string> = {};
  if (!fullName) errors.fullName = "Your name is required.";
  const age = ageFromDOB(dob);
  if (age === null) errors.dob = "Enter your date of birth.";
  else if (age < 18) errors.dob = "You must be 18 or older to apply.";
  if (!school) errors.school = "Your school is required.";
  if (!schoolEmail) errors.schoolEmail = "School email is required.";
  else if (!isEduEmail(schoolEmail)) errors.schoolEmail = "Use a valid .edu email.";
  if (!phone) errors.phone = "Your phone number is required.";
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

  // Structured record - the capture fallback (never lose a lead).
  console.log("[lead]", JSON.stringify({ at: new Date().toISOString(), ...lead }));

  const ipForAnalytics = analyticsClientIp(request);
  const source = classifySource(attribution.referrer, attribution.utm_source);
  await recordAdminEvent({
    type: "student_application",
    path: attribution.landing_page || "/become-an-ambassador",
    referrer: attribution.referrer,
    source: attribution.utm_source || source.source,
    medium: attribution.utm_medium || source.medium,
    campaign: attribution.utm_campaign,
    term: attribution.utm_term,
    content: attribution.utm_content,
    landingPage: attribution.landing_page,
    llmSource: source.llmSource,
    userAgent: request.headers.get("user-agent") || undefined,
    ipHash: hashIp(ipForAnalytics),
    data: {
      fullName: lead.fullName,
      phone: lead.phone,
      city: lead.city,
      state: lead.state,
      school: lead.school,
      schoolEmail: lead.schoolEmail,
      gradYear: lead.gradYear,
      major: lead.major,
      instagram: lead.instagram,
      tiktok: lead.tiktok,
      igFollowers: lead.igFollowers,
      ttFollowers: lead.ttFollowers,
      niche: lead.niche,
      why: lead.why,
    },
  });

  // Send both emails AFTER the response is returned so the applicant isn't kept
  // waiting on Resend's round-trip (Vercel keeps the function alive for after()).
  const confirmation = studentConfirmation(lead);
  const internal = internalNotification("student_application", lead);
  // Attempt the TEAM notification WITHIN the request (awaited) so it never
  // depends on after() keep-alive — this is the email you must receive.
  // sendEmail never throws; it returns {ok:false} on failure / {skipped:true}
  // when email isn't configured. The applicant's confirmation is sent after the
  // response so they aren't kept waiting.
  const notified = await sendEmail({
    to: AGENCY_INBOX,
    subject: internal.subject,
    html: internal.html,
    text: internal.text,
    replyTo: schoolEmail,
  });
  after(async () => {
    await sendEmail({
      to: schoolEmail,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
      replyTo: AGENCY_INBOX,
    });
  });

  return NextResponse.json({ ok: true, emailed: notified.ok && !notified.skipped });
}

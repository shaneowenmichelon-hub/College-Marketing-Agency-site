import { NextResponse, after } from "next/server";
import { ageFromDOB, isEduEmail } from "@/lib/utils";
import { sendEmail, AGENCY_INBOX } from "@/lib/email";
import { studentConfirmation, internalNotification, type SecureLink } from "@/lib/email-templates";
import { rateLimit, clientIp, sweep } from "@/lib/rate-limit";
import { ATTRIBUTION_KEYS, type Attribution, type StudentLead } from "@/lib/leads";
import { classifySource, clientIp as analyticsClientIp, hashIp, recordAdminEvent } from "@/lib/admin-analytics";

// Email SDK needs the Node runtime (not edge).
export const runtime = "nodejs";

/**
 * Student ambassador applications (JSON). ID photos are uploaded DIRECTLY from
 * the browser to Vercel Blob (see /api/blob/upload) before this runs, so we only
 * receive their secure URLs here — the large files never hit this function (no
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
  const why = str("why");
  const agreements = (body.agreements ?? {}) as Record<string, unknown>;

  // ID references (Blob URLs uploaded client-side; may be empty if storage unset).
  const idFrontUrl = str("idFrontUrl");
  const idBackUrl = str("idBackUrl");
  const idFrontName = str("idFrontName");
  const idBackName = str("idBackName");

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
  // ID is required at the file-selection level (client sends the filename even if
  // the upload was skipped because storage isn't configured).
  if (!idFrontName) errors.idFront = "Front of your ID is required.";
  if (!idBackName) errors.idBack = "Back of your ID is required.";
  // Only accept our own Blob URLs.
  const okUrl = (u: string) => u === "" || /^https:\/\/[a-z0-9.-]*\.?blob\.vercel-storage\.com\//i.test(u);
  if (!okUrl(idFrontUrl) || !okUrl(idBackUrl)) {
    errors.idFront = "Invalid ID upload.";
  }

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const attribution: Attribution = {};
  const rawAttr = (body.attribution ?? {}) as Record<string, unknown>;
  for (const k of ATTRIBUTION_KEYS) {
    const v = rawAttr[k];
    if (typeof v === "string" && v) attribution[k] = v;
  }

  const secureLinks: SecureLink[] = [
    {
      label: "Government ID — front",
      url: idFrontUrl || null,
      note: idFrontUrl ? undefined : "not uploaded — storage not configured",
    },
    {
      label: "Government ID — back",
      url: idBackUrl || null,
      note: idBackUrl ? undefined : "not uploaded — storage not configured",
    },
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
      idFrontStored: !!idFrontUrl,
      idBackStored: !!idBackUrl,
    }),
  );

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
      idFrontStored: !!idFrontUrl,
      idBackStored: !!idBackUrl,
    },
  });

  // Send both emails AFTER the response is returned so the applicant isn't kept
  // waiting on Resend's round-trip (Vercel keeps the function alive for after()).
  const confirmation = studentConfirmation(lead);
  const internal = internalNotification("student_application", lead, secureLinks);
  after(async () => {
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
  });

  return NextResponse.json({ ok: true });
}

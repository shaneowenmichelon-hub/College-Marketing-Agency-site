import { NextResponse, after } from "next/server";
import { isValidEmail } from "@/lib/utils";
import { sendEmail, AGENCY_INBOX } from "@/lib/email";
import { brandConfirmation, internalNotification } from "@/lib/email-templates";
import { rateLimit, clientIp, sweep } from "@/lib/rate-limit";
import { ATTRIBUTION_KEYS, type Attribution, type BrandLead } from "@/lib/leads";
import { captureDeal } from "@/lib/crm/capture";
import { classifySource, clientIp as analyticsClientIp, hashIp, recordAdminEvent } from "@/lib/admin-analytics";
import { leadDeliveryError } from "@/site.config";

// Email SDK needs the Node runtime (not edge).
export const runtime = "nodejs";

/**
 * Brand "Get Started" / contact + lead-magnet submissions.
 * Validate (same required fields as the form) → record the lead → email the team.
 * Budget and "how did you find us?" are optional. An empty budget is stored as
 * "Not sure yet", which is the contact form's default option.
 * If Resend rejects the team notification, respond with an error so the sender
 * is not told it succeeded. Always logs a structured submission record so the
 * lead is still captured.
 *
 * TODO (optional): also persist to Google Sheet / CRM / DB.
 */

/** The contact form's default budget option. Its value is submitted as "". */
const NOT_SURE_BUDGET = "Not sure yet";

function budgetForLead(kind: BrandLead["kind"], value: unknown): string {
  const raw = String(value ?? "").trim();
  if (kind !== "brand_inquiry") return raw;
  if (!raw || raw.toLowerCase() === NOT_SURE_BUDGET.toLowerCase()) return NOT_SURE_BUDGET;
  return raw;
}

/** Provider text for logs. Strips addresses so the line is not a lead record. */
function nonPiiReason(reason: string | undefined): string {
  const text = (reason || "notification email was not accepted")
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted]")
    .replace(/\s+/g, " ")
    .trim();
  return text.slice(0, 300) || "notification email was not accepted";
}

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
  const howHeard = String(body.howHeard ?? "").trim();

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
    budget: budgetForLead(kind, body.budget),
    message: String(body.message ?? ""),
    howHeard,
    resource: String(body.resource ?? ""),
    attribution,
  };

  // Structured submission record - the capture fallback (never lose a lead).
  console.log("[lead]", JSON.stringify({ at: new Date().toISOString(), ...lead }));

  const ipForAnalytics = analyticsClientIp(request);
  const source = classifySource(attribution.referrer, attribution.utm_source);
  await recordAdminEvent({
    type: kind,
    path: attribution.landing_page || "/contact",
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
      kind,
      firstName: lead.firstName,
      lastName: lead.lastName,
      company: lead.company,
      email: lead.email,
      phone: lead.phone,
      interests: lead.interests,
      budget: lead.budget,
      message: lead.message,
      howHeard: lead.howHeard,
      resource: lead.resource,
    },
  });

  // Put the brand on the pipeline board. Never throws - see captureDeal.
  await captureDeal({
    source: kind === "lead_magnet" ? "lead_magnet" : "brand_inquiry",
    email: lead.email,
    company: lead.company || null,
    contactName: [lead.firstName, lead.lastName].filter(Boolean).join(" ") || null,
    phone: lead.phone || null,
    payload: lead as unknown as Record<string, unknown>,
  });

  const confirmation = brandConfirmation(lead);
  const internal = internalNotification(kind, lead);
  // The team notification is awaited so a Resend rejection can be returned to
  // the sender. The confirmation email goes out after the response.
  const notified = await sendEmail({
    to: AGENCY_INBOX,
    subject: internal.subject,
    html: internal.html,
    text: internal.text,
    replyTo: email,
  });
  if (!notified.ok) {
    console.error(`[lead] send FAILED: ${nonPiiReason(notified.error)}`);
    return NextResponse.json({ ok: false, error: leadDeliveryError() }, { status: 502 });
  }
  after(async () => {
    await sendEmail({
      to: email,
      subject: confirmation.subject,
      html: confirmation.html,
      text: confirmation.text,
      replyTo: AGENCY_INBOX,
    });
  });

  return NextResponse.json({ ok: true, emailed: notified.ok && !notified.skipped });
}

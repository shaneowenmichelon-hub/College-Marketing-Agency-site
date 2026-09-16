import { NextResponse, after } from "next/server";
import { isValidEmail } from "@/lib/utils";
import { sendEmail, AGENCY_INBOX } from "@/lib/email";
import { rateLimit, clientIp } from "@/lib/rate-limit";
import { classifySource, clientIp as analyticsClientIp, hashIp, recordAdminEvent } from "@/lib/admin-analytics";
import { formatUSD } from "@/lib/campaign-inventory";

// Email SDK needs the Node runtime (not edge).
export const runtime = "nodejs";

type SchoolPick = { school: string; ambassadors: number; productPlacement: boolean };
type EventPick = { name: string; group: string; minFee: number };

/**
 * "Create a Campaign" builder submissions. Validate → record a structured
 * submission (never lose a lead) → email the team + confirm to the sender. The
 * campaign body is rendered as readable text/HTML so no template file is needed.
 */
export async function POST(request: Request) {
  const ip = clientIp(request);
  const rl = rateLimit(`campaign:${ip}`, { limit: 6, windowMs: 60_000 });
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

  const contact = (body.contact ?? {}) as Record<string, unknown>;
  const email = String(contact.email ?? "").trim();
  if (!email) return NextResponse.json({ ok: false, error: "Work email is required." }, { status: 422 });
  if (!isValidEmail(email)) return NextResponse.json({ ok: false, error: "Enter a valid email." }, { status: 422 });

  const services = Array.isArray(body.services) ? (body.services as string[]) : [];
  const months = Number(body.months ?? 0);
  const schools = Array.isArray(body.schools) ? (body.schools as SchoolPick[]) : [];
  const events = Array.isArray(body.events) ? (body.events as EventPick[]) : [];
  const totals = (body.totals ?? {}) as Record<string, number>;
  const budget = String(body.budget ?? "").trim();
  const notes = String(body.notes ?? "").trim();
  const firstName = String(contact.firstName ?? "").trim();
  const lastName = String(contact.lastName ?? "").trim();
  const company = String(contact.company ?? "").trim();
  const phone = String(contact.phone ?? "").trim();
  const attribution = (body.attribution ?? {}) as Record<string, string>;

  // ── build a readable summary ──
  const lines: string[] = [];
  lines.push(`Services: ${services.join(", ") || "none"}`);
  if (services.includes("ambassadors")) lines.push(`Campaign length: ${months} month(s)`);
  if (schools.length) {
    lines.push("", "Campuses:");
    for (const s of schools) {
      const bits: string[] = [];
      if (s.ambassadors) bits.push(`${s.ambassadors} ambassador(s)`);
      if (s.productPlacement) bits.push("product placement");
      lines.push(`  • ${s.school}${bits.length ? ` — ${bits.join(", ")}` : ""}`);
    }
  }
  if (events.length) {
    lines.push("", "Events & trips:");
    for (const e of events) lines.push(`  • ${e.name} (${e.group}) — from ${formatUSD(e.minFee)}`);
  }
  lines.push(
    "",
    "Estimated starting cost:",
    `  Ambassadors: ${formatUSD(totals.ambassadors ?? 0)}`,
    `  Product placement: ${formatUSD(totals.productPlacement ?? 0)}`,
    `  Events: ${formatUSD(totals.events ?? 0)}`,
    `  Estimate total: ${formatUSD(totals.estimate ?? 0)}`,
    `  Client's target budget: ${budget || "—"}`,
  );
  if (notes) lines.push("", "Notes:", notes);
  const summaryText = lines.join("\n");

  const who = [firstName, lastName].filter(Boolean).join(" ") || "A brand";

  // Structured capture fallback.
  console.log("[campaign]", JSON.stringify({ at: new Date().toISOString(), email, company, services, months, schools, events, totals, budget, notes }));

  const source = classifySource(attribution.referrer, attribution.utm_source);
  await recordAdminEvent({
    type: "campaign_builder",
    path: attribution.landing_page || "/build-a-campaign",
    referrer: attribution.referrer,
    source: source.source,
    medium: source.medium,
    landingPage: attribution.landing_page,
    llmSource: source.llmSource,
    userAgent: request.headers.get("user-agent") || undefined,
    ipHash: hashIp(analyticsClientIp(request)),
    data: { firstName, lastName, company, email, phone, services, months, schools, events, totals, budget, notes },
  });

  const internalSubject = `New campaign build — ${who}${company ? ` @ ${company}` : ""} (${budget || formatUSD(totals.estimate ?? 0)})`;
  const contactText = [
    `Name: ${who}`,
    company ? `Company: ${company}` : "",
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : "",
    "",
    summaryText,
  ]
    .filter(Boolean)
    .join("\n");

  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const internalHtml = `<h2>New campaign build</h2><p><strong>${esc(who)}</strong>${company ? ` @ ${esc(company)}` : ""}<br/>${esc(email)}${phone ? ` · ${esc(phone)}` : ""}</p><pre style="font-family:ui-monospace,monospace;white-space:pre-wrap;background:#f4f4f6;padding:16px;border-radius:8px">${esc(summaryText)}</pre>`;
  const confirmHtml = `<p>Hi${firstName ? ` ${esc(firstName)}` : ""},</p><p>Thanks for building a campaign with Collegiate Agency! Our team will review it and get back to you within one business day with a tailored plan and firm pricing.</p><p>Here's what you sent:</p><pre style="font-family:ui-monospace,monospace;white-space:pre-wrap;background:#f4f4f6;padding:16px;border-radius:8px">${esc(summaryText)}</pre><p>— The Collegiate Agency team</p>`;

  after(async () => {
    await Promise.allSettled([
      sendEmail({
        to: AGENCY_INBOX,
        subject: internalSubject,
        html: internalHtml,
        text: contactText,
        replyTo: email,
      }),
      sendEmail({
        to: email,
        subject: "Your Collegiate Agency campaign build",
        html: confirmHtml,
        text: `Thanks for building a campaign with Collegiate Agency!\n\n${summaryText}\n\n— The Collegiate Agency team`,
        replyTo: AGENCY_INBOX,
      }),
    ]);
  });

  return NextResponse.json({ ok: true });
}

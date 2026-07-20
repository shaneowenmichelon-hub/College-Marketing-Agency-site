/**
 * Branded email templates. Each returns { subject, html, text }.
 * Copy is original and on-brand.
 */
import { siteConfig } from "@/site.config";
import type { Attribution, BrandLead, StudentLead } from "@/lib/leads";
import { wrap, button, h1, p, escapeHtml, colors } from "./base";

export type RenderedEmail = { subject: string; html: string; text: string };

/* ── Student application confirmation (to the applicant) ─────────────────── */
export function studentConfirmation(data: StudentLead): RenderedEmail {
  const name = (data.fullName || "there").split(" ")[0];
  const subject = `Thanks for applying to ${siteConfig.companyName}`;
  const body =
    h1(`You're on our radar, ${escapeHtml(name)}! 🎉`) +
    p(
      `Thanks for applying to the ${escapeHtml(
        siteConfig.companyName,
      )} ambassador network. We've got your application.`,
    ) +
    p(
      `Here's what happens next: our team reviews applications and reaches out with brand opportunities that fit your campus and your socials. There's nothing else you need to do right now — just keep an eye on your inbox.`,
    ) +
    `<div style="margin:22px 0;">${button("Explore the site", siteConfig.url)}</div>` +
    p(
      `Excited to have you in the mix.<br/>— The ${escapeHtml(siteConfig.companyName)} team`,
    );
  const text = `You're on our radar, ${name}!

Thanks for applying to the ${siteConfig.companyName} ambassador network. We've got your application.

What happens next: our team reviews applications and reaches out with brand opportunities that fit your campus and your socials. Nothing else to do right now — keep an eye on your inbox.

Explore the site: ${siteConfig.url}

— The ${siteConfig.companyName} team
${siteConfig.companyDomain}`;
  return { subject, html: wrap(body, "We received your ambassador application."), text };
}

/* ── Brand inquiry confirmation (to the brand contact) ───────────────────── */
export function brandConfirmation(data: BrandLead): RenderedEmail {
  const name = (data.firstName || "there").trim();
  const isLeadMagnet = data.kind === "lead_magnet";
  const subject = isLeadMagnet
    ? `Your guide from ${siteConfig.companyName}`
    : `Thanks for reaching out to ${siteConfig.companyName}`;
  const opening = isLeadMagnet
    ? p(`Thanks for your interest — we'll send your requested resource shortly.`)
    : p(
        `Thanks for reaching out. We've received your inquiry and a member of our team will be in touch soon to talk through how we can help.`,
      );
  const body =
    h1(`Thanks, ${escapeHtml(name)}.`) +
    opening +
    p(
      `In the meantime, here's how we help brands reach students:` +
        `<br/>• <strong style="color:${colors.INK};">Events</strong> — campus activations planned, staffed & executed.` +
        `<br/>• <strong style="color:${colors.INK};">Brand Ambassadors</strong> — a vetted student rep network.` +
        `<br/>• <strong style="color:${colors.INK};">Influencers</strong> — authentic peer-to-peer student content.`,
    ) +
    `<div style="margin:22px 0;">${button("See our work", `${siteConfig.url}/work`)}</div>` +
    p(`Talk soon,<br/>— The ${escapeHtml(siteConfig.companyName)} team`);
  const text = `Thanks, ${name}.

${
    isLeadMagnet
      ? "Thanks for your interest — we'll send your requested resource shortly."
      : "We've received your inquiry and a member of our team will be in touch soon."
  }

How we help brands reach students:
- Events — campus activations planned, staffed & executed.
- Brand Ambassadors — a vetted student rep network.
- Influencers — authentic peer-to-peer student content.

See our work: ${siteConfig.url}/work

— The ${siteConfig.companyName} team
${siteConfig.companyDomain}`;
  return {
    subject,
    html: wrap(body, isLeadMagnet ? "Your resource is on the way." : "We received your inquiry."),
    text,
  };
}

/* ── Internal notification (to the agency inbox) ─────────────────────────── */
export function internalNotification(
  kind: "student_application" | "brand_inquiry" | "lead_magnet",
  data: BrandLead | StudentLead,
): RenderedEmail {
  const label =
    kind === "student_application"
      ? "Student Application"
      : kind === "lead_magnet"
        ? "Lead Magnet"
        : "Brand Inquiry";

  const who =
    kind === "student_application"
      ? (data as StudentLead).fullName
      : `${(data as BrandLead).firstName ?? ""} ${(data as BrandLead).lastName ?? ""}`.trim() ||
        (data as BrandLead).company ||
        (data as BrandLead).email;

  const subject = `New ${label} — ${who || "unknown"}`;

  const skip = new Set(["kind", "attribution"]);
  const rows: string[] = [];
  for (const [k, v] of Object.entries(data)) {
    if (skip.has(k) || v == null || v === "") continue;
    const value = Array.isArray(v) ? v.join(", ") : String(v);
    rows.push(fieldRow(k, value));
  }

  const attr = (data as { attribution?: Attribution }).attribution;
  const attrRows =
    attr && Object.values(attr).some(Boolean)
      ? `<h2 style="font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:${colors.MUTED};margin:20px 0 8px;">Attribution</h2>` +
        Object.entries(attr)
          .filter(([, val]) => val)
          .map(([k, val]) => fieldRow(k, String(val)))
          .join("")
      : "";

  const body =
    h1(`New ${label.toLowerCase()}`) +
    `<h2 style="font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:${colors.MUTED};margin:20px 0 8px;">Submission</h2>` +
    rows.join("") +
    attrRows;

  const textLines = [`New ${label}`, ""];
  for (const [k, v] of Object.entries(data)) {
    if (skip.has(k) || v == null || v === "") continue;
    textLines.push(`${k}: ${Array.isArray(v) ? v.join(", ") : v}`);
  }
  if (attr) {
    textLines.push("", "Attribution:");
    for (const [k, v] of Object.entries(attr)) if (v) textLines.push(`${k}: ${v}`);
  }

  return { subject, html: wrap(body, subject), text: textLines.join("\n") };
}

function fieldRow(key: string, value: string): string {
  const pretty = key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
  return `<div style="display:block;padding:7px 0;border-bottom:1px solid ${colors.BORDER};font-size:14px;">
    <span style="color:${colors.MUTED};display:inline-block;min-width:150px;">${escapeHtml(
      pretty,
    )}</span>
    <span style="color:${colors.INK};font-weight:500;">${escapeHtml(value)}</span>
  </div>`;
}

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
        `<br/>• <strong style="color:${colors.INK};">Product Placement</strong> — Greek-life placements with dedicated media deliverables.`,
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
- Product Placement — Greek-life placements with dedicated media deliverables.

See our work: ${siteConfig.url}/work

— The ${siteConfig.companyName} team
${siteConfig.companyDomain}`;
  return {
    subject,
    html: wrap(body, isLeadMagnet ? "Your resource is on the way." : "We received your inquiry."),
    text,
  };
}

/** A secure link surfaced in the internal email (ID images, proof files). */
export type SecureLink = { label: string; url: string | null; note?: string };

/* ── Internal notification (to the agency inbox) ─────────────────────────── */
export function internalNotification(
  kind: "student_application" | "brand_inquiry" | "lead_magnet",
  data: BrandLead | StudentLead,
  secureLinks: SecureLink[] = [],
): RenderedEmail {
  const label =
    kind === "student_application"
      ? "ambassador application"
      : kind === "lead_magnet"
        ? "lead magnet"
        : "brand inquiry";

  // Subjects per spec.
  let subject: string;
  if (kind === "student_application") {
    const s = data as StudentLead;
    subject = `New ambassador application — ${s.fullName || "unknown"}, ${s.school || "school n/a"}`;
  } else if (kind === "brand_inquiry") {
    const b = data as BrandLead;
    subject = `New brand inquiry — ${b.company || b.email || "unknown"}`;
  } else {
    subject = `New lead magnet — ${(data as BrandLead).email || "unknown"}`;
  }

  const skip = new Set(["kind", "attribution"]);
  const fieldRows: [string, string][] = [];
  for (const [k, v] of Object.entries(data)) {
    if (skip.has(k) || v == null || v === "") continue;
    fieldRows.push([prettyKey(k), Array.isArray(v) ? v.join(", ") : String(v)]);
  }

  const attr = (data as { attribution?: Attribution }).attribution;
  const attrRows: [string, string][] =
    attr && Object.values(attr).some(Boolean)
      ? Object.entries(attr).filter(([, val]) => val).map(([k, val]) => [prettyKey(k), String(val)])
      : [];

  const body =
    h1(`New ${label}`) +
    sectionLabel("Submission") +
    table(fieldRows) +
    secureLinksBlock(secureLinks) +
    (attrRows.length ? sectionLabel("Attribution / UTM") + table(attrRows) : "");

  // Plaintext fallback.
  const t: string[] = [`New ${label}`, ""];
  for (const [k, v] of fieldRows) t.push(`${k}: ${v}`);
  if (secureLinks.length) {
    t.push("", "Secure files:");
    for (const l of secureLinks) t.push(`${l.label}: ${l.url ?? l.note ?? "n/a"}`);
  }
  if (attrRows.length) {
    t.push("", "Attribution / UTM:");
    for (const [k, v] of attrRows) t.push(`${k}: ${v}`);
  }

  return { subject, html: wrap(body, subject), text: t.join("\n") };
}

/** Generic internal notification for portal emails (signups / job submissions). */
export function genericNotification(
  subject: string,
  rows: [string, string][],
  secureLinks: SecureLink[] = [],
): RenderedEmail {
  const body =
    h1(subject) + sectionLabel("Details") + table(rows) + secureLinksBlock(secureLinks);
  const t = [subject, ""];
  for (const [k, v] of rows) t.push(`${k}: ${v}`);
  if (secureLinks.length) {
    t.push("", "Secure files:");
    for (const l of secureLinks) t.push(`${l.label}: ${l.url ?? l.note ?? "n/a"}`);
  }
  return { subject, html: wrap(body, subject), text: t.join("\n") };
}

function prettyKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (c) => c.toUpperCase());
}

function sectionLabel(text: string): string {
  return `<h2 style="font-size:13px;text-transform:uppercase;letter-spacing:0.05em;color:${colors.MUTED};margin:22px 0 8px;">${escapeHtml(
    text,
  )}</h2>`;
}

/** Clean, email-client-safe two-column table. */
function table(rows: [string, string][]): string {
  if (!rows.length) return "";
  const body = rows
    .map(
      ([k, v], i) => `<tr style="background:${i % 2 ? "#fafafa" : "#ffffff"};">
      <td style="padding:8px 10px;border:1px solid ${colors.BORDER};color:${colors.MUTED};font-size:13px;width:170px;vertical-align:top;">${escapeHtml(
        k,
      )}</td>
      <td style="padding:8px 10px;border:1px solid ${colors.BORDER};color:${colors.INK};font-size:14px;font-weight:500;">${escapeHtml(
        v,
      )}</td>
    </tr>`,
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;">${body}</table>`;
}

/** Secure links block (ID images / proof files). Never contains raw attachments. */
function secureLinksBlock(links: SecureLink[]): string {
  if (!links.length) return "";
  const items = links
    .map((l) => {
      if (l.url) {
        return `<li style="margin-bottom:6px;"><a href="${l.url}" style="color:${colors.ACCENT};font-weight:600;">${escapeHtml(
          l.label,
        )}</a></li>`;
      }
      return `<li style="margin-bottom:6px;color:${colors.MUTED};">${escapeHtml(l.label)}: <em>${escapeHtml(
        l.note || "not available",
      )}</em></li>`;
    })
    .join("");
  return (
    sectionLabel("Secure files") +
    `<p style="font-size:12px;color:${colors.MUTED};margin:0 0 8px;">Access-restricted links — do not forward. Delete once verification is complete.</p>` +
    `<ul style="padding-left:18px;margin:0;">${items}</ul>`
  );
}

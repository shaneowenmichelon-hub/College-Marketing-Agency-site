/**
 * Shared, email-client-safe HTML shell (inline CSS, table-free, dark-text on
 * light). All templates render through this wrapper for consistent branding.
 */
import { siteConfig } from "@/site.config";

const INK = "#0B0B0F";
const ACCENT = "#5A4BFF";
const LIME = "#D4FF4F";
const MUTED = "#56565f";
const BORDER = "#e6e6ea";

export function escapeHtml(input: string): string {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Wrap body HTML in the branded shell. `preheader` is the inbox preview text. */
export function wrap(bodyHtml: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"></head>
<body style="margin:0;padding:0;background:#f4f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${INK};">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${escapeHtml(preheader)}</span>
  <div style="max-width:560px;margin:0 auto;padding:24px 16px;">
    <div style="background:${INK};border-radius:16px 16px 0 0;padding:22px 28px;">
      <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${ACCENT};vertical-align:middle;"></span>
      <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${LIME};vertical-align:middle;margin-left:2px;"></span>
      <span style="color:#ffffff;font-weight:700;font-size:16px;vertical-align:middle;margin-left:10px;letter-spacing:-0.02em;">${escapeHtml(
        siteConfig.companyName,
      )}</span>
    </div>
    <div style="background:#ffffff;border:1px solid ${BORDER};border-top:none;border-radius:0 0 16px 16px;padding:28px;">
      ${bodyHtml}
    </div>
    <p style="text-align:center;color:${MUTED};font-size:12px;margin:18px 0 0;">
      ${escapeHtml(siteConfig.companyLegalName)} · <a href="${siteConfig.url}" style="color:${ACCENT};text-decoration:none;">${escapeHtml(
        siteConfig.companyDomain,
      )}</a>
    </p>
  </div>
</body>
</html>`;
}

export function button(label: string, href: string): string {
  return `<a href="${href}" style="display:inline-block;background:${ACCENT};color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:999px;">${escapeHtml(
    label,
  )}</a>`;
}

export function h1(text: string): string {
  return `<h1 style="font-size:22px;line-height:1.25;margin:0 0 12px;color:${INK};">${escapeHtml(
    text,
  )}</h1>`;
}

export function p(html: string): string {
  return `<p style="font-size:15px;line-height:1.6;color:${MUTED};margin:0 0 14px;">${html}</p>`;
}

export const colors = { INK, ACCENT, LIME, MUTED, BORDER };

import { NextResponse, after } from "next/server";
import { isEduEmail } from "@/lib/utils";
import { sendEmail, AGENCY_INBOX } from "@/lib/email";
import { genericNotification, type SecureLink } from "@/lib/email-templates";
import { rateLimit, clientIp, sweep } from "@/lib/rate-limit";
import { getJob } from "@/site.config";
import { clientIp as analyticsClientIp, hashIp, recordAdminEvent } from "@/lib/admin-analytics";

export const runtime = "nodejs";

/**
 * Proof-of-completion submission (JSON). Proof files are uploaded DIRECTLY from
 * the browser to Vercel Blob (see /api/blob/upload) before this runs; we only get
 * their secure URLs. The internal email carries SECURE LINKS, never raw files.
 */
export async function POST(request: Request) {
  sweep();
  const rl = rateLimit(`portal-submit:${clientIp(request)}`, { limit: 6, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const job = getJob(String(body.slug ?? ""));
  const notes = String(body.notes ?? "").trim();
  const links = Array.isArray(body.links) ? body.links.map((l) => String(l).trim()).filter(Boolean) : [];
  const files = Array.isArray(body.files)
    ? (body.files as unknown[]).map((f) => f as { name?: string; url?: string })
    : [];

  const errors: Record<string, string> = {};
  if (!isEduEmail(email)) errors.email = "Invalid email.";
  if (!job) errors.slug = "Unknown job.";
  for (const l of links) if (!/^https?:\/\//i.test(l)) errors.links = "Links must start with http(s)://";
  if (links.length === 0 && files.length === 0)
    errors.form = "Add at least one post link or file as proof.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const secureLinks: SecureLink[] = files.map((f, i) => ({
    label: `Proof file ${i + 1}${f.name ? ` (${f.name})` : ""}`,
    url: f.url && /^https:\/\/[a-z0-9.-]*\.?blob\.vercel-storage\.com\//i.test(f.url) ? f.url : null,
    note: f.url ? undefined : "not uploaded — storage not configured",
  }));

  console.log(
    "[portal] submission:",
    JSON.stringify({ at: new Date().toISOString(), email, job: job!.slug, links, files: files.length }),
  );

  await recordAdminEvent({
    type: "portal_submission",
    path: `/portal/submit/${job!.slug}`,
    source: "Ambassador portal",
    medium: "portal",
    userAgent: request.headers.get("user-agent") || undefined,
    ipHash: hashIp(analyticsClientIp(request)),
    data: {
      email,
      job: job!.slug,
      brand: job!.brand,
      title: job!.title,
      links,
      files: files.length,
      notes,
    },
  });

  const rows: [string, string][] = [
    ["Student", email],
    ["Job", `${job!.brand} — ${job!.title}`],
    ...links.map((l, i) => [`Post link ${i + 1}`, l] as [string, string]),
  ];
  if (notes) rows.push(["Notes", notes]);

  const mail = genericNotification(
    `Job submission — ${email} → ${job!.brand}: ${job!.title}`,
    rows,
    secureLinks,
  );
  after(async () => {
    await sendEmail({ to: AGENCY_INBOX, subject: mail.subject, html: mail.html, text: mail.text, replyTo: email });
  });

  return NextResponse.json({ ok: true });
}

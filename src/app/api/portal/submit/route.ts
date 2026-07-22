import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { isEduEmail } from "@/lib/utils";
import { sendEmail, AGENCY_INBOX } from "@/lib/email";
import { genericNotification, type SecureLink } from "@/lib/email-templates";
import { rateLimit, clientIp, sweep } from "@/lib/rate-limit";
import { uploadPrivate } from "@/lib/storage";
import { ALLOWED_UPLOAD_TYPES, MAX_UPLOAD_BYTES } from "@/lib/uploads";
import { getJob } from "@/site.config";

export const runtime = "nodejs";

/**
 * Proof-of-completion submission (multipart) — post links + files (photos/video/
 * screenshots). Files go to PRIVATE storage; the internal email carries SECURE
 * LINKS, never raw attachments. Graceful when email/storage env vars are unset.
 */
export async function POST(request: Request) {
  sweep();
  const rl = rateLimit(`portal-submit:${clientIp(request)}`, { limit: 6, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid form data." }, { status: 400 });
  }

  const email = String(form.get("email") ?? "").trim();
  const job = getJob(String(form.get("slug") ?? ""));
  const notes = String(form.get("notes") ?? "").trim();
  const links = form.getAll("links").map((l) => String(l).trim()).filter(Boolean);
  const files = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);

  const errors: Record<string, string> = {};
  if (!isEduEmail(email)) errors.email = "Invalid email.";
  if (!job) errors.slug = "Unknown job.";
  for (const l of links) if (!/^https?:\/\//i.test(l)) errors.links = "Links must start with http(s)://";
  for (const f of files) {
    if (f.size > MAX_UPLOAD_BYTES) errors.files = "A file is larger than 10MB.";
    else if (f.type && !ALLOWED_UPLOAD_TYPES.includes(f.type) && !f.type.startsWith("video/"))
      errors.files = "Use images, video, or PDF.";
  }
  if (links.length === 0 && files.length === 0)
    errors.form = "Add at least one post link or file as proof.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  // Upload proof files to private storage (unguessable paths). Non-blocking.
  const submissionId = randomUUID();
  const uploads = await Promise.all(
    files.map((f, i) =>
      uploadPrivate(`ambassador-proof/${submissionId}/${i}-${safeName(f.name)}`, f),
    ),
  );
  const secureLinks: SecureLink[] = uploads.map((u, i) => ({
    label: `Proof file ${i + 1} (${files[i].name})`,
    url: u.url,
    note: u.note,
  }));

  console.log(
    "[portal] submission:",
    JSON.stringify({
      at: new Date().toISOString(),
      email,
      job: job!.slug,
      links,
      files: files.length,
    }),
  );

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
  await sendEmail({
    to: AGENCY_INBOX,
    subject: mail.subject,
    html: mail.html,
    text: mail.text,
    replyTo: email,
  });

  return NextResponse.json({ ok: true });
}

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60) || "file";
}

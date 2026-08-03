import { NextResponse, after } from "next/server";
import { isEduEmail } from "@/lib/utils";
import { sendEmail, AGENCY_INBOX } from "@/lib/email";
import { genericNotification } from "@/lib/email-templates";
import { rateLimit, clientIp, sweep } from "@/lib/rate-limit";
import { getJob } from "@/site.config";
import { clientIp as analyticsClientIp, hashIp, recordAdminEvent } from "@/lib/admin-analytics";

export const runtime = "nodejs";

/** Ambassador signs up for a job → notify the agency inbox. */
export async function POST(request: Request) {
  sweep();
  const rl = rateLimit(`portal-signup:${clientIp(request)}`, { limit: 10, windowMs: 60_000 });
  if (!rl.ok) return NextResponse.json({ ok: false, error: "Too many requests." }, { status: 429 });

  let body: { email?: string; slug?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const email = String(body.email ?? "").trim();
  const job = getJob(String(body.slug ?? ""));
  if (!isEduEmail(email)) return NextResponse.json({ ok: false, error: "Invalid email." }, { status: 422 });
  if (!job) return NextResponse.json({ ok: false, error: "Unknown job." }, { status: 404 });

  console.log("[portal] signup:", JSON.stringify({ at: new Date().toISOString(), email, job: job.slug }));

  await recordAdminEvent({
    type: "portal_signup",
    path: `/portal/jobs/${job.slug}`,
    source: "Ambassador portal",
    medium: "portal",
    userAgent: request.headers.get("user-agent") || undefined,
    ipHash: hashIp(analyticsClientIp(request)),
    data: {
      email,
      job: job.slug,
      brand: job.brand,
      title: job.title,
      category: job.category,
      compensation: `${job.compensation.cash} + ${job.compensation.product}`,
    },
  });

  const mail = genericNotification(`Job signup - ${email} → ${job.brand}: ${job.title}`, [
    ["Student", email],
    ["Job", `${job.brand} - ${job.title}`],
    ["Compensation", `${job.compensation.cash} + ${job.compensation.product}`],
    ["Category", job.category],
  ]);
  after(async () => {
    await sendEmail({
      to: AGENCY_INBOX,
      subject: mail.subject,
      html: mail.html,
      text: mail.text,
      replyTo: email,
    });
  });

  return NextResponse.json({ ok: true });
}

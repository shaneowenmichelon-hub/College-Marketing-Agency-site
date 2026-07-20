import { NextResponse } from "next/server";
import { ageFromDOB, isEduEmail } from "@/lib/utils";

/**
 * Student ambassador applications.
 * Currently: validates, logs, returns success.
 *
 * TODO: wire to real endpoint (Formspree / Resend / CRM).
 * TODO: connect to the student portal / marketplace for onboarding hand-off.
 * Set APPLY_ENDPOINT in the environment and forward the payload there.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  // Honeypot.
  if (typeof body.nickname === "string" && body.nickname.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const fullName = String(body.fullName ?? "").trim();
  const dob = String(body.dob ?? "").trim();
  const schoolEmail = String(body.schoolEmail ?? "").trim();

  const errors: Record<string, string> = {};
  if (!fullName) errors.fullName = "Your name is required.";

  const age = ageFromDOB(dob);
  if (age === null) errors.dob = "Enter your date of birth.";
  else if (age < 18) errors.dob = "You must be 18 or older to apply.";

  if (!schoolEmail) errors.schoolEmail = "School email is required.";
  else if (!isEduEmail(schoolEmail)) errors.schoolEmail = "Use a valid .edu email.";

  const agreements = (body.agreements ?? {}) as Record<string, unknown>;
  if (!agreements.age) errors.age = "You must confirm you're 18+.";
  if (!agreements.terms) errors.terms = "You must accept the terms.";
  if (!agreements.ftc) errors.ftc = "Please acknowledge the disclosure requirement.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const endpoint = process.env.APPLY_ENDPOINT;
  if (endpoint) {
    // TODO: forward to real endpoint. Left unimplemented intentionally.
    // await fetch(endpoint, { method: "POST", body: JSON.stringify(body) });
  }

  console.log("[apply] new ambassador application:", {
    fullName,
    schoolEmail,
    school: body.school,
    instagram: body.instagram,
    tiktok: body.tiktok,
  });

  return NextResponse.json({ ok: true });
}

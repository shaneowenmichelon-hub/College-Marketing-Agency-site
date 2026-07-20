import { NextResponse } from "next/server";
import { isValidEmail } from "@/lib/utils";

/**
 * Brand "Get Started" / contact submissions.
 * Currently: validates, logs, returns success.
 *
 * TODO: wire to real endpoint (Formspree / Resend / CRM).
 * Set CONTACT_ENDPOINT in the environment and forward the payload there.
 */
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON." }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field.
  if (typeof body.company_website === "string" && body.company_website.trim() !== "") {
    // Pretend success so bots don't learn anything.
    return NextResponse.json({ ok: true });
  }

  const company = String(body.company ?? "").trim();
  const email = String(body.email ?? "").trim();

  const errors: Record<string, string> = {};
  if (!company) errors.company = "Company is required.";
  if (!email) errors.email = "Work email is required.";
  else if (!isValidEmail(email)) errors.email = "Enter a valid email.";

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, errors }, { status: 422 });
  }

  const endpoint = process.env.CONTACT_ENDPOINT;
  if (endpoint) {
    // TODO: forward to real endpoint. Left unimplemented intentionally.
    // await fetch(endpoint, { method: "POST", body: JSON.stringify(body) });
  }

  console.log("[contact] new lead:", {
    company,
    email,
    interests: body.interests,
    budget: body.budget,
  });

  return NextResponse.json({ ok: true });
}

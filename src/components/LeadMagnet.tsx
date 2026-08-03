"use client";

import { useState } from "react";
import { CheckCircle2, Download, Loader2 } from "lucide-react";
import { isValidEmail } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { useAttribution, useElapsed } from "@/lib/client-forms";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";

/**
 * Reusable email-capture lead magnet. Posts to /api/contact with
 * kind: "lead_magnet" so it triggers the same email flow (confirmation +
 * internal notification).
 *
 * TODO: add downloadable asset - deliver the file link in the confirmation email
 * or redirect to a gated URL after submit.
 */
export function LeadMagnet({
  eyebrow = "Free guide",
  title = "The Gen-Z campus marketing guide",
  description = "A no-fluff playbook for reaching college students in 2026 - events, ambassadors, and product placement that actually convert.",
  resource = "gen-z-campus-marketing-guide",
}: {
  eyebrow?: string;
  title?: string;
  description?: string;
  resource?: string;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const attribution = useAttribution();
  const getElapsed = useElapsed();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isValidEmail(email)) {
      setError("Enter a valid email.");
      return;
    }
    setError(undefined);
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "lead_magnet",
          email,
          resource,
          elapsedMs: getElapsed(),
          attribution,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError("Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      trackEvent("generate_lead", { form: "lead_magnet", resource });
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <Section tone="muted">
      <Reveal className="mx-auto max-w-3xl rounded-3xl border border-[color:var(--border-on-light)] bg-surface p-8 shadow-soft sm:p-10">
        <div className="grid items-center gap-8 sm:grid-cols-[1.3fr_1fr]">
          <div>
            <Badge variant="lime" className="mb-4">
              {eyebrow}
            </Badge>
            <h2 className="font-display text-2xl font-bold text-ink sm:text-3xl">{title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted-on-light)]">
              {description}
            </p>
          </div>

          {status === "success" ? (
            <div className="flex flex-col items-center rounded-2xl bg-surface-muted p-6 text-center">
              <CheckCircle2 className="h-10 w-10 text-accent" aria-hidden />
              <p className="mt-3 text-sm font-medium text-ink">Check your inbox!</p>
              <p className="mt-1 text-xs text-[color:var(--muted-on-light)]">
                We&apos;ll send the guide to {email}.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
              <label htmlFor="lm-email" className="sr-only">
                Work email
              </label>
              <input
                id="lm-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                aria-invalid={!!error}
                className="w-full rounded-xl border border-[color:var(--border-on-light)] bg-white px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
              />
              {error && (
                <p className="text-xs font-medium text-red-500" role="alert">
                  {error}
                </p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-accent px-6 text-sm font-medium text-white shadow-soft transition-all hover:brightness-110 disabled:opacity-60"
              >
                {status === "loading" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" /> Get the guide
                  </>
                )}
              </button>
              <p className="text-center text-xs text-[color:var(--muted-on-light)]">
                No spam. Unsubscribe anytime.
              </p>
            </form>
          )}
        </div>
      </Reveal>
    </Section>
  );
}

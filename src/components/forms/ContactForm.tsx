"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { siteConfig } from "@/site.config";
import { isValidEmail, cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { useAttribution, usePrefill, useElapsed } from "@/lib/client-forms";
import { FormField, Input, Select, Textarea } from "@/components/form/Fields";
import { Button } from "@/components/ui/Button";

type Errors = Partial<Record<string, string>>;

const interestOptions = siteConfig.services.map((s) => s.label);

export function ContactForm() {
  const [interests, setInterests] = useState<string[]>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const attribution = useAttribution();
  const prefill = usePrefill();
  const getElapsed = useElapsed();

  function toggleInterest(label: string) {
    setInterests((prev) =>
      prev.includes(label) ? prev.filter((x) => x !== label) : [...prev, label],
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const payload = {
      kind: "brand_inquiry" as const,
      firstName: String(data.get("firstName") ?? ""),
      lastName: String(data.get("lastName") ?? ""),
      company: String(data.get("company") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? ""),
      interests,
      budget: String(data.get("budget") ?? ""),
      message: String(data.get("message") ?? ""),
      howHeard: String(data.get("howHeard") ?? "").trim(),
      company_website: String(data.get("company_website") ?? ""), // honeypot
      elapsedMs: getElapsed(),
      attribution,
    };

    const nextErrors: Errors = {};
    if (!payload.company) nextErrors.company = "Company is required.";
    if (!payload.email) nextErrors.email = "Work email is required.";
    else if (!isValidEmail(payload.email)) nextErrors.email = "Enter a valid email.";
    if (!payload.howHeard) nextErrors.howHeard = "Please let us know how you found us.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (json.errors) setErrors(json.errors);
        setStatus("error");
        return;
      }
      trackEvent("generate_lead", { form: "contact", interests });
      setStatus("success");
      form.reset();
      setInterests([]);
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-10 text-center shadow-soft">
        <CheckCircle2 className="h-12 w-12 text-accent" aria-hidden />
        <h3 className="mt-4 font-display text-2xl font-bold text-ink">Thanks - we&apos;re on it.</h3>
        <p className="mt-2 max-w-sm text-sm text-[color:var(--muted-on-light)]">
          Your message is in. We&apos;ll get back to you shortly with next steps for
          reaching students.
        </p>
        <Button className="mt-6" onClick={() => setStatus("idle")} variant="secondary">
          Send another message
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-6 shadow-soft sm:p-8"
    >
      {/* Honeypot (hidden from humans + AT) */}
      <div className="hidden" aria-hidden>
        <label htmlFor="company_website">Company website</label>
        <input id="company_website" name="company_website" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <FormField label="First name" htmlFor="firstName">
          <Input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            defaultValue={prefill.fname}
            key={`fn-${prefill.fname ?? ""}`}
          />
        </FormField>
        <FormField label="Last name" htmlFor="lastName">
          <Input
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            defaultValue={prefill.lname}
            key={`ln-${prefill.lname ?? ""}`}
          />
        </FormField>
        <FormField label="Company" htmlFor="company" required error={errors.company}>
          <Input
            id="company"
            name="company"
            autoComplete="organization"
            error={errors.company}
            defaultValue={prefill.company}
            key={`co-${prefill.company ?? ""}`}
          />
        </FormField>
        <FormField label="Work email" htmlFor="email" required error={errors.email}>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            error={errors.email}
            defaultValue={prefill.email}
            key={`em-${prefill.email ?? ""}`}
          />
        </FormField>
        <FormField label="Phone" htmlFor="phone" className="sm:col-span-2">
          <Input id="phone" name="phone" type="tel" autoComplete="tel" />
        </FormField>
      </div>

      {/* Interested in (multi-select) */}
      <fieldset className="mt-5">
        <legend className="text-sm font-medium text-ink">Interested in</legend>
        <div className="mt-2 flex flex-wrap gap-2">
          {interestOptions.map((label) => {
            const active = interests.includes(label);
            return (
              <button
                key={label}
                type="button"
                onClick={() => toggleInterest(label)}
                aria-pressed={active}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "border-accent bg-accent text-white"
                    : "border-[color:var(--border-on-light)] bg-white text-ink hover:border-accent/40",
                )}
              >
                {label}
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-5">
        <FormField label="Budget range" htmlFor="budget">
          <Select id="budget" name="budget" defaultValue="">
            <option value="" disabled>
              Select a range
            </option>
            {siteConfig.budgetRanges.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </FormField>
        <FormField label="Message" htmlFor="message">
          <Textarea
            id="message"
            name="message"
            placeholder="Tell us what you're launching and which campuses you're after."
            defaultValue={prefill.message}
            key={`msg-${prefill.message ?? ""}`}
          />
        </FormField>
        <FormField label="How did you find us?" htmlFor="howHeard" required error={errors.howHeard}>
          <Input
            id="howHeard"
            name="howHeard"
            error={errors.howHeard}
            placeholder="e.g. Instagram, a referral, Google search, an event…"
          />
        </FormField>
      </div>

      {status === "error" && (
        <p className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          Something went wrong. Please review the fields above and try again.
        </p>
      )}

      <Button type="submit" size="lg" className="mt-6 w-full" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          "Get Started"
        )}
      </Button>
    </form>
  );
}

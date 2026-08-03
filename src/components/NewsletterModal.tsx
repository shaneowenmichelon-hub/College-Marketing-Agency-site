"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Mail, Sparkles, X } from "lucide-react";
import { isValidEmail } from "@/lib/utils";
import { useAttribution, useElapsed } from "@/lib/client-forms";
import { trackEvent } from "@/lib/analytics";

const STORAGE_KEY = "ca_newsletter_modal_dismissed";
const SHOW_DELAY_MS = 1500;

/**
 * Full-screen newsletter capture modal. Email-only, dismissible, and intentionally
 * separate from the mobile sticky CTA so the bottom prompt can stay in place.
 */
export function NewsletterModal() {
  const [email, setEmail] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const attribution = useAttribution();
  const getElapsed = useElapsed();

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      /* ignore */
    }
    if (dismissed) return;

    const timer = window.setTimeout(() => setShow(true), SHOW_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!show) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [show]);

  function dismiss() {
    setShow(false);
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const normalized = email.trim();
    if (!isValidEmail(normalized)) {
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
          email: normalized,
          resource: "newsletter-signup",
          message: "Newsletter signup: Gen-Z marketing tips, trend updates, and campus marketing insights.",
          elapsedMs: getElapsed(),
          attribution,
        }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json?.errors?.email || json?.error || "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      trackEvent("generate_lead", { form: "newsletter_modal", resource: "newsletter-signup" });
      setStatus("success");
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="newsletter-modal-title"
      className="fixed inset-0 z-[70] flex min-h-dvh items-center justify-center overflow-y-auto bg-ink/80 p-4 backdrop-blur-sm sm:p-6"
    >
      <div aria-hidden className="mesh pointer-events-none absolute inset-0 opacity-50" />
      <div className="grain relative w-full max-w-xl overflow-hidden rounded-[6px] border-2 border-ink bg-surface shadow-[10px_10px_0_var(--ink)]">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close newsletter signup"
          className="absolute right-4 top-4 z-10 inline-flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-ink bg-white text-ink shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="relative border-b-2 border-ink bg-[color:var(--accent-2)] px-6 py-4 pr-20">
          <p className="mono-label flex items-center gap-2 text-xs font-bold text-ink">
            <Sparkles className="h-4 w-4" aria-hidden /> Free campus marketing newsletter
          </p>
        </div>

        {status === "success" ? (
          <div className="px-6 py-10 text-center sm:px-10 sm:py-12">
            <CheckCircle2 className="mx-auto h-14 w-14 text-accent" aria-hidden />
            <h2 id="newsletter-modal-title" className="mt-5 font-display text-3xl font-bold text-ink sm:text-4xl">
              You&apos;re on the list.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-[color:var(--muted-on-light)] sm:text-base">
              We&apos;ll send Gen-Z marketing tips, trend updates, and campus activation ideas straight to your inbox.
            </p>
            <button
              type="button"
              onClick={dismiss}
              className="mt-7 inline-flex h-12 items-center justify-center rounded-[3px] border-2 border-ink bg-ink px-6 text-sm font-bold text-white shadow-[4px_4px_0_var(--accent-2)]"
            >
              Continue to site
            </button>
          </div>
        ) : (
          <div className="px-6 py-8 sm:px-10 sm:py-10">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-[4px] border-2 border-ink bg-accent text-white shadow-[4px_4px_0_var(--ink)]">
              <Mail className="h-6 w-6" aria-hidden />
            </div>
            <h2 id="newsletter-modal-title" className="mt-6 max-w-lg font-display text-3xl font-bold leading-tight text-ink sm:text-5xl">
              Get smarter at marketing to Gen Z.
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-[color:var(--muted-on-light)] sm:text-lg">
              Free tips, campus trend updates, activation ideas, and examples of what is actually working with college students.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-7 space-y-3">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  id="newsletter-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  aria-invalid={!!error}
                  className="h-[52px] min-h-[52px] w-full rounded-[3px] border-2 border-ink bg-white px-4 py-3 text-base font-medium text-ink shadow-[3px_3px_0_var(--ink)] outline-none placeholder:text-ink/45 focus:shadow-[5px_5px_0_var(--accent)]"
                />
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="mono-label inline-flex h-[52px] min-h-[52px] shrink-0 items-center justify-center gap-2 rounded-[3px] border-2 border-ink bg-accent px-6 py-3 text-xs font-bold text-white shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Sign me up
                </button>
              </div>
              {error ? (
                <p className="rounded-[3px] bg-red-50 px-3 py-2 text-sm font-semibold text-red-600" role="alert">
                  {error}
                </p>
              ) : null}
              <p className="text-xs leading-relaxed text-[color:var(--muted-on-light)]">
                No spam. Just practical Gen-Z marketing notes from the campus floor. Unsubscribe anytime.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

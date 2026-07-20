"use client";

import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";
import Link from "next/link";
import { getConsent, setConsent } from "@/lib/analytics";

/**
 * Lightweight, accessible cookie-consent banner. Non-essential scripts
 * (analytics/pixels) load only after "Accept" (see Analytics.tsx). Remembers the
 * choice; won't reappear once decided. Required because the site collects student
 * PII and would otherwise run tracking without consent.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Only show if no decision has been made yet.
    if (getConsent() === null) setVisible(true);
  }, []);

  if (!visible) return null;

  function decide(value: "granted" | "denied") {
    setConsent(value);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] p-4 sm:p-5"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-[color:var(--border-on-dark)] bg-ink p-5 text-white shadow-soft-lg sm:flex-row sm:items-center sm:gap-6">
        <div className="flex items-start gap-3">
          <Cookie className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--accent-2)]" aria-hidden />
          <p className="text-sm leading-relaxed text-[color:var(--muted-on-dark)]">
            We use cookies to understand traffic and improve the site. Analytics load
            only if you accept. See our{" "}
            <Link href="/privacy" className="text-white underline underline-offset-2">
              privacy policy
            </Link>
            .
          </p>
        </div>
        <div className="flex shrink-0 gap-2 sm:ml-auto">
          <button
            type="button"
            onClick={() => decide("denied")}
            className="rounded-full border border-[color:var(--border-on-dark)] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
          >
            Decline
          </button>
          <button
            type="button"
            onClick={() => decide("granted")}
            className="rounded-full bg-[color:var(--accent-2)] px-5 py-2 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}

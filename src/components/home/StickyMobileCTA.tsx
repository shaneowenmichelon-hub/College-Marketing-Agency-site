"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

const KEY = "ch_sticky_cta_dismissed";

/**
 * Mobile-only sticky prompt that slides in after the hero. Dismissible; the
 * dismissal persists for the session. Sits above the device safe-area and never
 * blocks device nav. Hidden at lg+.
 */
export function StickyMobileCTA() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(true); // assume hidden until mount check

  useEffect(() => {
    let already = false;
    try {
      already = sessionStorage.getItem(KEY) === "1";
    } catch {
      /* ignore */
    }
    if (already) {
      setDismissed(true);
      return;
    }
    setDismissed(false);
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.9);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function dismiss() {
    setDismissed(true);
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
  }

  if (dismissed) return null;

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 lg:hidden ${
        show ? "translate-y-0" : "translate-y-[130%]"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="mx-3 mb-3 flex items-center gap-3 rounded-[4px] border-2 border-ink bg-white p-3 shadow-[5px_5px_0_var(--ink)]">
        <p className="flex-1 text-sm font-semibold leading-tight text-ink">Planning a campus launch?</p>
        <Link
          href="/contact"
          className="mono-label inline-flex shrink-0 items-center gap-1.5 rounded-[3px] border-2 border-ink bg-accent px-3 py-2.5 text-[11px] font-bold text-white shadow-[2px_2px_0_var(--ink)]"
        >
          Get Started <ArrowRight className="h-4 w-4" />
        </Link>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss"
          className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[3px] border-2 border-ink text-ink"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

"use client";

/**
 * Client-side form helpers: attribution capture and query-param pre-fill.
 * Attribution is captured on first landing and persisted in sessionStorage so it
 * survives in-site navigation to the form.
 */
import { useEffect, useRef, useState } from "react";
import { ATTRIBUTION_KEYS, type Attribution } from "@/lib/leads";

const STORE_KEY = "ch_attribution";

function readStored(): Attribution {
  try {
    const raw = sessionStorage.getItem(STORE_KEY);
    return raw ? (JSON.parse(raw) as Attribution) : {};
  } catch {
    return {};
  }
}

/** Capture UTM/click-ids/referrer once, persist, and return them. */
export function useAttribution(): Attribution {
  const [attr, setAttr] = useState<Attribution>({});

  useEffect(() => {
    const stored = readStored();
    const params = new URLSearchParams(window.location.search);
    const next: Attribution = { ...stored };

    for (const key of ATTRIBUTION_KEYS) {
      if (key === "referrer" || key === "landing_page") continue;
      const v = params.get(key);
      if (v && !next[key]) next[key] = v;
    }
    // First-touch referrer + landing page.
    if (!next.referrer && document.referrer) next.referrer = document.referrer;
    if (!next.landing_page) next.landing_page = window.location.pathname;

    try {
      sessionStorage.setItem(STORE_KEY, JSON.stringify(next));
    } catch {
      /* ignore storage errors (private mode, etc.) */
    }
    setAttr(next);
  }, []);

  return attr;
}

/**
 * Read pre-fill values from the URL (?email=&fname=&lname=&company=).
 * These are only ever written into form inputs, never rendered elsewhere.
 */
export function usePrefill() {
  const [prefill, setPrefill] = useState<{
    email?: string;
    fname?: string;
    lname?: string;
    company?: string;
    message?: string;
  }>({});

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    setPrefill({
      email: p.get("email") ?? undefined,
      fname: p.get("fname") ?? undefined,
      lname: p.get("lname") ?? undefined,
      company: p.get("company") ?? undefined,
      message: p.get("msg") ?? undefined,
    });
  }, []);

  return prefill;
}

/** Milliseconds since the form mounted - used for the bot time-to-submit check. */
export function useElapsed() {
  const mountedAt = useRef<number>(0);
  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);
  return () => (mountedAt.current ? Date.now() - mountedAt.current : 0);
}

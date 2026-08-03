/**
 * Consent-aware analytics helpers (client-side).
 * Nothing here loads a script - see components/analytics/Analytics.tsx. These are
 * just safe wrappers that no-op when analytics isn't loaded (env unset or no consent).
 */

export const CONSENT_KEY = "ch_cookie_consent"; // "granted" | "denied"
export const CONSENT_EVENT = "ch-consent-change";

export type ConsentValue = "granted" | "denied";

export function getConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(CONSENT_KEY);
  return v === "granted" || v === "denied" ? v : null;
}

export function setConsent(value: ConsentValue) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CONSENT_KEY, value);
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
}

type GtagWindow = Window & {
  gtag?: (...args: unknown[]) => void;
  dataLayer?: unknown[];
};

/**
 * Track a conversion/event. Safe to call always - it only does something when
 * analytics is actually loaded (consent granted + env id set).
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  if (getConsent() !== "granted") return;
  if (typeof w.gtag === "function") {
    w.gtag("event", name, params);
  } else if (Array.isArray(w.dataLayer)) {
    // GTM path
    w.dataLayer.push({ event: name, ...params });
  }
}

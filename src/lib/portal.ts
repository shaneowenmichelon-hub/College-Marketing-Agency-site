"use client";

/**
 * Ambassador-portal client state (PROTOTYPE).
 *
 * TODO: move jobs, signups, slot counts, and submissions to a database
 * (Supabase / Vercel Postgres) - this local state does not sync across users or
 * devices, and slot counts only reflect the current student's own signups. Email
 * to the agency inbox is the reliable record until then.
 *
 * TODO: replace the shared-secret gate with real per-user auth (Clerk / NextAuth
 * / Supabase) before production - the session below is a client flag only and
 * does NOT authenticate individuals.
 */
import type { Job } from "@/site.config";

const SESSION_KEY = "ch_portal_session"; // the student's .edu email
const STATE_KEY = "ch_portal_state";

export type PortalState = {
  activeJob: string | null;
  signedUp: string[];
  submitted: string[];
};

const EMPTY: PortalState = { activeJob: null, signedUp: [], submitted: [] };

export function getSession(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(SESSION_KEY);
}

export function setSession(email: string) {
  window.localStorage.setItem(SESSION_KEY, email);
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY);
}

export function getPortalState(): PortalState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.localStorage.getItem(STATE_KEY);
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as PortalState) } : EMPTY;
  } catch {
    return EMPTY;
  }
}

function save(state: PortalState) {
  window.localStorage.setItem(STATE_KEY, JSON.stringify(state));
}

export function signUpForJob(slug: string): PortalState {
  const s = getPortalState();
  const next: PortalState = {
    ...s,
    activeJob: slug,
    signedUp: s.signedUp.includes(slug) ? s.signedUp : [...s.signedUp, slug],
  };
  save(next);
  return next;
}

export function markSubmitted(slug: string): PortalState {
  const s = getPortalState();
  const next: PortalState = {
    ...s,
    submitted: s.submitted.includes(slug) ? s.submitted : [...s.submitted, slug],
  };
  save(next);
  return next;
}

/** Slots filled as this student sees them (config baseline + their own signup). */
export function displaySlotsFilled(job: Job, state: PortalState): number {
  const mine = state.signedUp.includes(job.slug) ? 1 : 0;
  return Math.min(job.slotsTotal, job.slotsFilled + mine);
}

export function isFull(job: Job, state: PortalState): boolean {
  return displaySlotsFilled(job, state) >= job.slotsTotal;
}

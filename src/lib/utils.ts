/** Tiny className joiner — avoids pulling in a dependency. */
export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(" ");
}

/** Basic, pragmatic email check (good enough for client-side UX gating). */
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/** Requires an @-domain ending in .edu (case-insensitive). */
export function isEduEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.edu$/i.test(value.trim());
}

/** Returns age in whole years from an ISO date string (YYYY-MM-DD). */
export function ageFromDOB(dob: string): number | null {
  if (!dob) return null;
  const birth = new Date(dob);
  if (Number.isNaN(birth.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age -= 1;
  return age;
}

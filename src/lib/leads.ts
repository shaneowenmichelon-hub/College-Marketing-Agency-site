/** Shared types for form submissions and attribution. */

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  referrer?: string;
  landing_page?: string;
};

export const ATTRIBUTION_KEYS: (keyof Attribution)[] = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "referrer",
  "landing_page",
];

export type SubmissionKind = "brand_inquiry" | "student_application" | "lead_magnet";

export type BrandLead = {
  kind: "brand_inquiry" | "lead_magnet";
  firstName?: string;
  lastName?: string;
  company?: string;
  email: string;
  phone?: string;
  interests?: string[];
  budget?: string;
  message?: string;
  resource?: string; // for lead magnet
  attribution?: Attribution;
};

export type StudentLead = {
  kind: "student_application";
  fullName: string;
  dob: string;
  phone?: string;
  city?: string;
  state?: string;
  school: string;
  schoolEmail: string;
  gradYear?: string;
  major?: string;
  instagram?: string;
  tiktok?: string;
  igFollowers?: string;
  ttFollowers?: string;
  niche?: string;
  why?: string;
  resumeName?: string;
  attribution?: Attribution;
};

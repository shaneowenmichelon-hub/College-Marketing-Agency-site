/**
 * How a brand's choice on another page arrives on the inquiry form.
 * Labels must match `siteConfig.services` exactly or the form ignores them.
 */

export const INQUIRY_REQUIRED_LINE = "Company and work email are required.";

/** Already published on /contact, /pricing, and the campaign builder. */
export const INQUIRY_REPLY_LINE =
  "Collegiate Agency replies within one business day with a tailored plan and firm pricing.";

/** Under the homepage hero and the about closer. The reply sentence is the one already published. */
export const INQUIRY_BRIEF_LINE = `Send a short brief. ${INQUIRY_REPLY_LINE}`;

export const CAMPAIGN_SERVICES = ["events", "product-placement", "ambassadors"] as const;

export type CampaignService = (typeof CAMPAIGN_SERVICES)[number];

const SITE = "https://collegiateagency.com";

function searchParams(search: string): URLSearchParams {
  const query = search.startsWith("?") ? search.slice(1) : search;
  return new URLSearchParams(query);
}

/** Build /contact or /build-a-campaign with the context the brand already chose. */
export function inquiryHref(
  path: "/contact" | "/build-a-campaign",
  params: Record<string, string | undefined>,
): string {
  const url = new URL(path, SITE);
  for (const [key, value] of Object.entries(params)) {
    if (value) url.searchParams.set(key, value);
  }
  const qs = url.searchParams.toString();
  return qs ? `${url.pathname}?${qs}` : url.pathname;
}

/**
 * Attach the article slug to a brand inquiry link. Other destinations, including
 * service pages and external URLs, are left alone.
 */
export function articleInquiryHref(href: string, slug: string): string {
  let url: URL;
  try {
    url = new URL(href, SITE);
  } catch {
    return href;
  }
  if (url.origin !== SITE) return href;
  if (url.pathname !== "/contact" && url.pathname !== "/build-a-campaign") return href;
  url.searchParams.set("article", slug);
  const qs = url.searchParams.toString();
  return `${url.pathname}?${qs}`;
}

/** Service labels named in ?interest=, ignoring anything the form cannot show. */
export function interestsFromQuery(search: string, allowed: readonly string[]): string[] {
  const allowedSet = new Set(allowed);
  const found: string[] = [];
  for (const value of searchParams(search).getAll("interest")) {
    for (const part of value.split(",")) {
      const label = part.trim();
      if (!allowedSet.has(label) || found.includes(label)) continue;
      found.push(label);
    }
  }
  return found;
}

/** Campaign services named in ?service=, ignoring unknown keys. */
export function servicesFromQuery(search: string): CampaignService[] {
  const found: CampaignService[] = [];
  for (const value of searchParams(search).getAll("service")) {
    for (const part of value.split(",")) {
      const key = part.trim();
      if (!(CAMPAIGN_SERVICES as readonly string[]).includes(key)) continue;
      const service = key as CampaignService;
      if (!found.includes(service)) found.push(service);
    }
  }
  return found;
}

/** Company first, then email. Those are the only fields that can block a send. */
export function firstInvalidInquiryField(errors: {
  company?: string;
  email?: string;
}): "company" | "email" | null {
  if (errors.company) return "company";
  if (errors.email) return "email";
  return null;
}

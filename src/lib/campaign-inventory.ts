import { eventSponsorships, pricing, siteConfig } from "@/site.config";

/**
 * Data + pricing for the "Create a Campaign" builder. Everything derives from
 * site.config so the builder stays in sync with the real inventory and prices.
 */

/** "$2,500" | "$10,000" -> 2500 | 10000. Returns 0 when no number is present. */
export function parseUSD(input?: string): number {
  if (!input) return 0;
  const digits = input.replace(/[^\d]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function formatUSD(n: number): string {
  return `$${Math.max(0, Math.round(n)).toLocaleString("en-US")}`;
}

export const AMBASSADOR_MONTHLY = parseUSD(pricing["brand-ambassadors"].range) || 250;
export const PRODUCT_PLACEMENT_PER_CAMPUS = parseUSD(pricing["product-placement"].range) || 2500;

export type CampaignEvent = {
  id: string;
  group: string;
  name: string;
  minFee: number;
  feeLabel: string;
  blurb: string;
};

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

/** Flatten the event & trip inventory into a pick list, each with its minimum base fee. */
export const campaignEvents: { group: string; events: CampaignEvent[] }[] = eventSponsorships.groups
  .filter((g) => Array.isArray(g.items) && g.items.length > 0)
  .map((g) => ({
    group: g.title,
    events: g.items.map((item) => {
      const minFee = item.tiers?.length
        ? Math.min(...item.tiers.map((t) => parseUSD(t.price)).filter((n) => n > 0))
        : parseUSD(item.basePackage);
      return {
        id: `${slug(g.title)}--${slug(item.name)}`,
        group: g.title,
        name: item.name,
        minFee,
        feeLabel: minFee ? `from ${formatUSD(minFee)}` : "custom",
        blurb: item.description ?? "",
      };
    }),
  }));

/** Flat lookup of every event by id (for the review step). */
export const campaignEventById: Record<string, CampaignEvent> = Object.fromEntries(
  campaignEvents.flatMap((g) => g.events).map((e) => [e.id, e]),
);

/** The 20+ school markets, straight from the campus network. */
export const campaignSchools = siteConfig.campuses.map((c) => ({
  school: c.school,
  city: c.city,
}));

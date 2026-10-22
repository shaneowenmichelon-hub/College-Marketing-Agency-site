import { getStat, pricing, siteConfig } from "@/site.config";
import type { ServiceFaq } from "@/lib/service-faqs";

/**
 * Pricing page copy. Every dollar amount is read from `pricing` in site.config.
 * A campaign the table does not cover is described as quoted per campaign.
 * Do not add a discount, a minimum spend, or a stat that is not already published.
 */

export type PricingRow = {
  service: string;
  href: string;
  rate: string;
  includes: string;
};

export function publishedRate(slug: keyof typeof pricing): string {
  const price = pricing[slug];
  return `${price.range} ${price.unit}`.replace(/\s+/g, " ").trim();
}

function eventBounds(): { min: string; max: string } {
  const amounts = pricing.events.range.match(/\$[\d,]+/g);
  if (!amounts || amounts.length < 2) {
    throw new Error("events pricing range must include a minimum and a maximum");
  }
  return { min: amounts[0], max: amounts[1] };
}

export function pricingRows(): PricingRow[] {
  return [
    {
      service: "Brand ambassadors",
      href: "/services/brand-ambassadors",
      rate: publishedRate("brand-ambassadors"),
      includes: pricing["brand-ambassadors"].note,
    },
    {
      service: "Product placement",
      href: "/services/product-placement",
      rate: publishedRate("product-placement"),
      includes: pricing["product-placement"].note,
    },
    {
      service: "Events",
      href: "/services/events",
      rate: publishedRate("events"),
      includes: pricing.events.note,
    },
    {
      service: "Anything not listed",
      href: "/contact",
      rate: "Quoted per campaign",
      includes:
        "Extra Greek-life organizations beyond the five included per campus, and any brief that is not the ambassador rate, the product-placement rate, or an event package on the events page.",
    },
  ];
}

export function pricingFaqs(): ServiceFaq[] {
  const ambassadors = publishedRate("brand-ambassadors");
  const placement = publishedRate("product-placement");
  const { min, max } = eventBounds();
  const campuses = getStat("campuses");
  return [
    {
      question: "How much does a Collegiate Agency brand ambassador cost?",
      answer: `Collegiate Agency prices the ambassador program at ${ambassadors}. That rate includes 2 dedicated social posts (flyers or videos) with links and brand tags. Localized paid media and product placement are add-ons, and Collegiate Agency confirms firm pricing after a brand sends a campaign.`,
    },
    {
      question: "How much does Collegiate Agency charge for product placement?",
      answer: `Collegiate Agency prices product placement at ${placement}. That rate covers 5 of the top Greek-life organizations per campus, with dedicated media deliverables for each organization. Additional organizations are an extra cost, which Collegiate Agency quotes per campaign.`,
    },
    {
      question: "How much does a Collegiate Agency campus event cost?",
      answer: `Collegiate Agency prices campus events as packages from ${min} to ${max}, from single activations to full presenting sponsorships. The events page lists the published sponsorship prices inside that range. Collegiate Agency quotes a package that page does not list per campaign.`,
    },
    {
      question: "How does the Collegiate Agency campaign builder estimate a price?",
      answer: `The Collegiate Agency campaign builder multiplies ${ambassadors} by the ambassador count and the number of months a brand sets, then adds ${placement} for each campus marked for product placement. Selected events add the lowest published fee for that inventory item. Collegiate Agency replies within one business day with a tailored plan and firm pricing.`,
    },
    {
      question: "Does Collegiate Agency publish a discount?",
      answer: `Collegiate Agency does not publish a discount off the rates in the table. A brief that is not covered by the ambassador rate, the product-placement rate, or an event package on the events page is quoted per campaign. Extra Greek-life organizations, past the five included per campus, are quoted the same way.`,
    },
    {
      question: "How does a brand get firm pricing from Collegiate Agency?",
      answer: `A brand can build a campaign for a starting estimate, or contact Collegiate Agency, and the published network covers ${campuses} campuses a brand can choose from. Collegiate Agency replies within one business day with a tailored plan and firm pricing.`,
    },
  ];
}

export const PRICING_TITLE = "Campus marketing pricing";

export const PRICING_DESCRIPTION = (() => {
  const { min, max } = eventBounds();
  return `Collegiate Agency pricing: ${publishedRate("brand-ambassadors")}, product placement at ${publishedRate("product-placement")}, and event packages from ${min} to ${max}.`;
})();

export function pricingIntro(): string {
  const { min, max } = eventBounds();
  return `${siteConfig.definition} Collegiate Agency is based in ${siteConfig.contact.location}. Published rates are ${publishedRate("brand-ambassadors")} for ambassadors, ${publishedRate("product-placement")} for product placement, and event packages from ${min} to ${max}. A price that is not in the table is quoted per campaign.`;
}

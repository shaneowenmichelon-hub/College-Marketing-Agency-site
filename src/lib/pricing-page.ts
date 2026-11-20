import { BRAND_SUFFIX } from "@/lib/seo";
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
        "Any brief that is not the ambassador rate, the product-placement rate, or an event package on the events page.",
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
      question: "How much does a college marketing campaign cost?",
      answer: `Collegiate Agency prices a college marketing campaign at ${ambassadors}, including 2 dedicated social posts, and product placement at ${placement}. Event packages run from ${min} to ${max}. Anything else is quoted per campaign, and Collegiate Agency replies with firm pricing within one business day.`,
    },
    {
      question: "How much does Collegiate Agency charge for product placement?",
      answer: `Collegiate Agency prices product placement at ${placement}. Dedicated media deliverables come with each sorority (chapter).`,
    },
    {
      question: "How much does a Collegiate Agency campus event cost?",
      answer: `Collegiate Agency prices campus events as packages from ${min} to ${max}, from single activations to full presenting sponsorships. The events page lists the published sponsorship prices inside that range. Collegiate Agency quotes a package that page does not list per campaign.`,
    },
    {
      question: "How does the Collegiate Agency campaign builder estimate a price?",
      answer: `The Collegiate Agency campaign builder multiplies ${ambassadors} by the ambassador count and the number of months a brand sets, then adds ${placement} for each sorority (chapter) a brand sets. Selected events add the lowest published fee for that inventory item. Collegiate Agency replies within one business day with a tailored plan and firm pricing.`,
    },
    {
      question: "Does Collegiate Agency publish a discount?",
      answer: `Collegiate Agency does not publish a discount off the rates in the table. A brief that is not covered by the ambassador rate, the product-placement rate, or an event package on the events page is quoted per campaign.`,
    },
    {
      question: "How does a brand get firm pricing from Collegiate Agency?",
      answer: `A brand can build a campaign for a starting estimate, or contact Collegiate Agency, and the published network covers ${campuses} campuses a brand can choose from. Collegiate Agency replies within one business day with a tailored plan and firm pricing.`,
    },
  ];
}

/**
 * Document title lead. The shared resolver stops at 60 characters, which would
 * drop the brand from this lead. This page may use 65. Above that, the shorter
 * lead is the one that still renders with the brand suffix.
 */
const PRICING_TITLE_LONG = "Campus Marketing Campaign Cost and Pricing";
const PRICING_TITLE_SHORT = "Campus Marketing Cost and Pricing";
const PRICING_TITLE_LONG_WITH_BRAND = `${PRICING_TITLE_LONG}${BRAND_SUFFIX}`;
const PRICING_TITLE_FITS = PRICING_TITLE_LONG_WITH_BRAND.length <= 65;

export const PRICING_TITLE_LEAD = PRICING_TITLE_FITS ? PRICING_TITLE_LONG : PRICING_TITLE_SHORT;

/** Absolute document title, Open Graph title, and Twitter title. */
export const PRICING_DOCUMENT_TITLE = PRICING_TITLE_FITS
  ? PRICING_TITLE_LONG_WITH_BRAND
  : `${PRICING_TITLE_SHORT}${BRAND_SUFFIX}`;

export const PRICING_H1 = "Campus marketing pricing: published rates, then a quote for the rest.";

export const PRICING_COST_QUESTION = "How much does a campus marketing campaign cost?";

export const PRICING_DESCRIPTION = (() => {
  const { min, max } = eventBounds();
  const ambassadors = pricing["brand-ambassadors"].range;
  const placement = pricing["product-placement"].range;
  return `What a campus marketing campaign costs: ${ambassadors} per ambassador per month, ${placement} per sorority (chapter) for product placement, event packages from ${min} to ${max}`;
})();

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

/** Quotable answer under the H1. Published rates only. 40–70 words. */
export function pricingCostAnswer(): string {
  const ambassadors = pricing["brand-ambassadors"].range;
  const placement = pricing["product-placement"].range;
  const { min, max } = eventBounds();
  const text = `A campus marketing campaign costs ${ambassadors} per ambassador per month, including 2 dedicated social posts. Product placement is ${placement} per sorority (chapter). Event packages run from ${min} to ${max}. Anything else is quoted per campaign, and Collegiate Agency replies with firm pricing within one business day.`;
  const words = wordCount(text);
  if (words < 40 || words > 70) {
    throw new Error(`pricing cost answer is ${words} words; expected 40-70`);
  }
  return text;
}

/**
 * Worked example. The total is 10 ambassadors x 3 months x the published
 * ambassador rate. No other figure is introduced.
 */
export function pricingCostExample(): string {
  const raw = pricing["brand-ambassadors"].range;
  const match = raw.match(/^\$(\d+(?:,\d{3})*)$/);
  if (!match) throw new Error("ambassador rate must be a single published amount");
  const each = Number(match[1].replace(/,/g, ""));
  const total = each * 10 * 3;
  return `Example math: 10 ambassadors for 3 months at the published rate is 10 x 3 x ${raw} = $${total.toLocaleString("en-US")} before add-ons.`;
}

export function pricingIntro(): string {
  const { min, max } = eventBounds();
  return `${siteConfig.definition} Collegiate Agency is based in ${siteConfig.contact.location}. Published rates are ${publishedRate("brand-ambassadors")} for ambassadors, ${publishedRate("product-placement")} for product placement, and event packages from ${min} to ${max}. A price that is not in the table is quoted per campaign.`;
}

const pricingQueryCopy = [PRICING_TITLE_LEAD, PRICING_H1, PRICING_DESCRIPTION].join("\n");
if (/college marketing agency/i.test(pricingQueryCopy)) {
  throw new Error("pricing title, H1, and meta must not target college marketing agency");
}
if (PRICING_DESCRIPTION.length > 160) {
  throw new Error(`pricing description is ${PRICING_DESCRIPTION.length} characters`);
}
if (PRICING_DOCUMENT_TITLE.length > 65) {
  throw new Error(`pricing document title is ${PRICING_DOCUMENT_TITLE.length} characters`);
}

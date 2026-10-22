import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";
import { pricing } from "@/site.config";
import { publishedRate } from "@/lib/pricing-page";

export const alt = 'Collegiate Agency pricing card with the published ambassador, product placement, and event rates.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    kicker: 'Pricing',
    title: 'Published campus rates',
    accent: 'Ambassadors, placement, and events.',
    detail: `Ambassadors ${publishedRate("brand-ambassadors")}. Placement ${publishedRate("product-placement")}. ${pricing.events.range}.`,
  });
}

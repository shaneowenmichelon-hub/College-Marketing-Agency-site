import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";
import { publishedRate } from "@/lib/pricing-page";

export const alt = 'Collegiate Agency brand ambassador programs and the published monthly rate.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    kicker: 'Brand ambassadors',
    title: 'A vetted student network',
    accent: 'Priced per ambassador per month.',
    detail: publishedRate("brand-ambassadors"),
  });
}

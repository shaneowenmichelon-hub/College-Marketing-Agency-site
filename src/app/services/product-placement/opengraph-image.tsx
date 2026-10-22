import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";
import { publishedRate } from "@/lib/pricing-page";

export const alt = 'Collegiate Agency Greek life product placement and the published per-campus rate.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    kicker: 'Product placement',
    title: 'Greek life placement',
    accent: 'Five organizations per campus.',
    detail: publishedRate("product-placement"),
  });
}

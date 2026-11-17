import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";
import { publishedRate } from "@/lib/pricing-page";

export const alt = 'Collegiate Agency Greek life product placement at $1,500 per sorority (chapter).';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    kicker: 'Product placement',
    title: 'Greek life placement',
    accent: '$1,500 per sorority (chapter).',
    detail: publishedRate("product-placement"),
  });
}

import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";

export const alt = 'Build a Collegiate Agency campus campaign and get a starting estimate.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    kicker: 'Build a campaign',
    title: 'A starting estimate',
    accent: 'Firm pricing within one business day.',
  });
}

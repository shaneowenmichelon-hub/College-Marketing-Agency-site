import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";

export const alt = 'Collegiate Agency services: campus events, brand ambassadors, and product placement.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    kicker: 'Services',
    title: 'Three ways onto campus',
    accent: 'Events, ambassadors, placement.',
  });
}

import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";

export const alt = 'Collegiate Agency insights on campus marketing for brands.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    kicker: 'Insights',
    title: 'Notes from the ground',
    accent: 'Campus marketing for brands.',
  });
}

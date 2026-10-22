import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";

export const alt = 'Collegiate Agency work: campus marketing campaigns and case studies.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    kicker: 'Work',
    title: 'Campaigns and case studies',
    accent: 'Campus marketing for brands.',
  });
}

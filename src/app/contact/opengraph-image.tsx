import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";

export const alt = 'Contact Collegiate Agency to book a call about a campus campaign.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    kicker: 'Contact',
    title: 'Book a call',
    accent: 'Tell us what you are launching.',
  });
}

import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";

export const alt = 'Collegiate Agency about page: a college and campus marketing agency for brands.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    kicker: 'About',
    title: 'A campus agency',
    accent: 'for brands that need students.',
  });
}

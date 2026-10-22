import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";

export const alt = 'Become a Collegiate Agency campus ambassador and get paid to represent brands.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    kicker: 'For students',
    title: 'Become an ambassador',
    accent: 'Get paid to rep brands on campus.',
  });
}

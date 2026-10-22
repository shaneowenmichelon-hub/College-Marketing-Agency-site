import { ogContentType, ogSize, renderOgCard } from "@/lib/og-card";
import { pricing } from "@/site.config";

export const alt = 'Collegiate Agency campus events, with packages from the published rate range.';
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    kicker: 'Events',
    title: 'Campus activations',
    accent: 'Packages from the published range.',
    detail: pricing.events.range,
  });
}

import { siteConfig } from "@/site.config";
import { renderShareCard, shareCardSize, shareCardContentType } from "@/lib/og-share-card";

// Site-wide fallback social image: the cartoon activation board, rendered on
// demand. Segments with their own opengraph-image file (work, pricing, about,
// contact, insights, services, build-a-campaign) override this, and the
// homepage names the committed /share-card.png explicitly instead — see the
// note in app/page.tsx.
export const runtime = "edge";
export const alt = `${siteConfig.companyName} — ${siteConfig.tagline}`;
export const size = shareCardSize;
export const contentType = shareCardContentType;

export default function OpengraphImage() {
  return renderShareCard();
}

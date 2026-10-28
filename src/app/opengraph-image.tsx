import { siteConfig } from "@/site.config";
import { renderShareCard, shareCardSize, shareCardContentType } from "@/lib/og-share-card";

// Default social-share image for the whole site: the cartoon game-board card.
// A real raster PNG, because Facebook/LinkedIn/X/Slack don't reliably render
// SVG, and iMessage draws og:image as a still frame. Pages can override with
// their own openGraph.images.
export const runtime = "edge";
export const alt = `${siteConfig.companyName} — ${siteConfig.tagline}`;
export const size = shareCardSize;
export const contentType = shareCardContentType;

export default function OpengraphImage() {
  return renderShareCard();
}

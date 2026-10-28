import { siteConfig } from "@/site.config";
import { shareCardSize, shareCardContentType } from "@/lib/og-share-card";

// Reuse the Open Graph renderer for the X/Twitter card (same 1200x630 PNG).
export { default } from "./opengraph-image";

export const runtime = "edge";
export const alt = `${siteConfig.companyName} — ${siteConfig.tagline}`;
export const size = shareCardSize;
export const contentType = shareCardContentType;

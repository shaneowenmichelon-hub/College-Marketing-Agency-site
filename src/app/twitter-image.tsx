import { siteConfig } from "@/site.config";

// Reuse the Open Graph renderer for the X/Twitter card (same 1200x630 PNG).
export { default } from "./opengraph-image";

export const runtime = "edge";
export const alt = `${siteConfig.companyName} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

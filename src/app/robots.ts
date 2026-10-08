import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export default function robots(): MetadataRoute.Robots {
  return {
    // Allow everything (including CSS/JS/assets so Google can render pages),
    // except API endpoints which have no crawlable content. Private/gated pages
    // (/portal, /private-ops-7f3a, /zmm-affiliate-command) stay crawlable so
    // their page-level `noindex` is honored, keeping them out of the index.
    // One rule for everyone. AI crawlers (GPTBot, ClaudeBot, PerplexityBot,
    // Google-Extended) are covered by "*" and are therefore already allowed —
    // deliberately NOT broken out into their own blocks, because a named
    // user-agent group REPLACES the "*" group rather than adding to it, so
    // listing them without repeating this disallow would hand them /api/.
    rules: { userAgent: "*", allow: "/", disallow: "/api/" },
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}

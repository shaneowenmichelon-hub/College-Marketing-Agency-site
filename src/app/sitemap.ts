import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { posts, caseStudies } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  // Canonical, indexable routes only. Excludes gated/private pages
  // (/portal/*, /private-ops-7f3a, /zmm-affiliate-command) and noindex legal
  // pages (/terms, /privacy) so the sitemap advertises only what should rank.
  const routes = [
    "",
    "/services",
    "/services/events",
    "/services/brand-ambassadors",
    "/build-a-campaign",
    "/work",
    "/about",
    "/insights",
    "/contact",
    "/become-an-ambassador",
  ];

  // Static lastModified to keep the sitemap deterministic across builds.
  const lastModified = new Date("2026-01-01");

  const articleRoutes = posts.map((post) => `/insights/${post.slug}`);
  const workRoutes = caseStudies.map((c) => `/work/${c.slug}`);

  return [...routes, ...workRoutes, ...articleRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}

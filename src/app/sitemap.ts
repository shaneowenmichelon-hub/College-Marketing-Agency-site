import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services/events",
    "/services/brand-ambassadors",
    "/services/influencers",
    "/work",
    "/about",
    "/insights",
    "/contact",
    "/become-an-ambassador",
    "/terms",
    "/privacy",
  ];

  // Static lastModified to keep the sitemap deterministic across builds.
  const lastModified = new Date("2026-01-01");

  return routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}

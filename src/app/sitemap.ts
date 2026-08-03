import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { posts } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/services",
    "/services/events",
    "/services/brand-ambassadors",

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

  const articleRoutes = posts.map((post) => `/insights/${post.slug}`);

  return [...routes, ...articleRoutes].map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}

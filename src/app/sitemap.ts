import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { caseStudies, posts } from "@/lib/content";

/**
 * Date the technical SEO metadata on the static routes was updated.
 * Article and case-study URLs use their own publish dates instead.
 */
const STATIC_LAST_MODIFIED = "2026-10-20";
/** Service detail pages gained their FAQ and supporting copy on this date. */
const SERVICE_DETAIL_LAST_MODIFIED = "2026-10-21";
/** Pricing, product placement, and the homepage schema/accessibility pass. */
const SEO_BATCH_LAST_MODIFIED = "2026-10-22";
/** Services metadata reframed for brands, and the unsourced sampling stat removed. */
const BRAND_POSITIONING_LAST_MODIFIED = "2026-10-26";

function lastModified(iso: string): Date {
  // Date-only values are pinned to UTC so the sitemap does not shift with the build timezone.
  return new Date(iso.length === 10 ? `${iso}T00:00:00.000Z` : iso);
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Canonical, indexable routes only. Excludes gated/private pages
  // (/portal/*, /private-ops-7f3a, /zmm-affiliate-command), noindex legal
  // pages (/terms, /privacy), and illustrative sample case studies.
  const routes = [
    "",
    "/services",
    "/services/events",
    "/services/brand-ambassadors",
    "/services/product-placement",
    "/pricing",
    "/build-a-campaign",
    "/work",
    "/about",
    "/insights",
    "/contact",
    "/become-an-ambassador",
  ];

  const latestArticle = posts.reduce((latest, post) => {
    const stamp = post.dateModified ?? post.date;
    return stamp > latest ? stamp : latest;
  }, STATIC_LAST_MODIFIED);

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteConfig.url}${route}`,
    lastModified: lastModified(
      route === "/insights"
        ? latestArticle
        : route === "" || route === "/services"
          ? BRAND_POSITIONING_LAST_MODIFIED
          : route === "/services/events" || route === "/services/brand-ambassadors"
            ? SERVICE_DETAIL_LAST_MODIFIED
            : route === "/pricing" || route === "/services/product-placement"
              ? SEO_BATCH_LAST_MODIFIED
              : STATIC_LAST_MODIFIED,
    ),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const workEntries: MetadataRoute.Sitemap = caseStudies
    .filter((study) => !study.sample)
    .map((study) => ({
      url: `${siteConfig.url}/work/${study.slug}`,
      lastModified: lastModified(study.date ?? STATIC_LAST_MODIFIED),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

  const articleEntries: MetadataRoute.Sitemap = posts.map((post) => {
    const images = [
      ...(post.image ? [`${siteConfig.url}${post.image}`] : []),
      ...post.body.filter((block) => block.type === "figure").map((block) => `${siteConfig.url}${block.src}`),
    ];
    return {
      url: `${siteConfig.url}/insights/${post.slug}`,
      lastModified: lastModified(post.dateModified ?? post.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...(images.length ? { images: [...new Set(images)] } : {}),
    };
  });

  return [...staticEntries, ...workEntries, ...articleEntries];
}

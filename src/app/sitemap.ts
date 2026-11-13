import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { caseStudies, posts } from "@/lib/content";
import { insightTopicLastModified, insightTopicPath, insightTopics } from "@/lib/insight-topics";

/**
 * Date the technical SEO metadata on the static routes was updated.
 * Article and case-study URLs use dateModified when set, otherwise their publish date.
 */
const STATIC_LAST_MODIFIED = "2026-10-20";
/** Service detail pages gained their FAQ and supporting copy on this date. */
const SERVICE_DETAIL_LAST_MODIFIED = "2026-10-21";
/** Pricing, product placement, and the homepage schema/accessibility pass. */
const SEO_BATCH_LAST_MODIFIED = "2026-10-22";
/**
 * Homepage gained a visible FAQ and matching FAQPage JSON-LD on this date.
 * IndexNow only submits lastmod inside 72 hours. This replaces the 2026-11-03
 * CTR title/meta stamp for `/` only. Other routes keep their own dates.
 */
const HOME_FAQ_LAST_MODIFIED = "2026-11-04";
/**
 * /services gained a visible FAQ, matching FAQPage JSON-LD, and
 * campus-marketing-agency copy on this date.
 * IndexNow only submits lastmod inside 72 hours. This replaces the 2026-10-26
 * brand-positioning stamp for `/services` only. Other routes keep their own dates.
 */
const SERVICES_HUB_FAQ_LAST_MODIFIED = "2026-11-05";
/**
 * Second CTR title and meta pass on commercial pages that still had
 * impressions and no clicks. IndexNow only submits lastmod inside 72 hours.
 * Applies to /work and as a floor for /insights.
 * /services/events uses EVENTS_FAQ_LAST_MODIFIED.
 * / stays on HOME_FAQ_LAST_MODIFIED. /services stays on
 * SERVICES_HUB_FAQ_LAST_MODIFIED. /services/brand-ambassadors,
 * /contact, and /build-a-campaign keep their earlier stamps.
 */
const CTR_WAVE_LAST_MODIFIED = "2026-11-06";
/**
 * /services/events FAQ was rewritten to the queries that page already
 * receives impressions for. IndexNow only submits lastmod inside 72 hours.
 * /work stays on CTR_WAVE_LAST_MODIFIED.
 */
const EVENTS_FAQ_LAST_MODIFIED = "2026-11-13";
/**
 * /about title, meta description, and AboutPage JSON-LD description were
 * rewritten on this date. IndexNow only submits lastmod inside 72 hours.
 * This replaces the 2026-10-27 Person-schema stamp for /about only.
 */
const ABOUT_LAST_MODIFIED = "2026-11-10";
/** /contact and /build-a-campaign gained indexable copy on this date. /work uses CTR_WAVE_LAST_MODIFIED. */
const THIN_PAGE_LAST_MODIFIED = "2026-10-28";

function lastModified(iso: string): Date {
  // Date-only values are pinned to UTC so the sitemap does not shift with the build timezone.
  return new Date(iso.length === 10 ? `${iso}T00:00:00.000Z` : iso);
}

function newerStamp(a: string, b: string): string {
  return a > b ? a : b;
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
        ? newerStamp(latestArticle, CTR_WAVE_LAST_MODIFIED)
        : route === ""
          ? HOME_FAQ_LAST_MODIFIED
          : route === "/services"
            ? SERVICES_HUB_FAQ_LAST_MODIFIED
            : route === "/about"
              ? ABOUT_LAST_MODIFIED
              : route === "/services/events"
                ? EVENTS_FAQ_LAST_MODIFIED
                : route === "/work"
                  ? CTR_WAVE_LAST_MODIFIED
                : route === "/services/brand-ambassadors"
                  ? SERVICE_DETAIL_LAST_MODIFIED
                  : route === "/pricing" || route === "/services/product-placement"
                    ? SEO_BATCH_LAST_MODIFIED
                    : route === "/contact" || route === "/build-a-campaign"
                      ? THIN_PAGE_LAST_MODIFIED
                      : STATIC_LAST_MODIFIED,
    ),
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.7,
  }));

  const workEntries: MetadataRoute.Sitemap = caseStudies
    .filter((study) => !study.sample)
    .map((study) => ({
      url: `${siteConfig.url}/work/${study.slug}`,
      lastModified: lastModified(study.dateModified ?? study.date ?? STATIC_LAST_MODIFIED),
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

  const topicEntries: MetadataRoute.Sitemap = insightTopics.map((topic) => ({
    url: `${siteConfig.url}${insightTopicPath(topic.slug)}`,
    lastModified: lastModified(insightTopicLastModified(topic.slug)),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...workEntries, ...topicEntries, ...articleEntries];
}

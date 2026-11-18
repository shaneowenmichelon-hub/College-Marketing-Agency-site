import type { MetadataRoute } from "next";
import { siteConfig } from "@/site.config";
import { caseStudies, posts } from "@/lib/content";
import { insightTopicPath, insightTopicSitemapLastModified, insightTopics } from "@/lib/insight-topics";
import { cityPath, publishedMarkets } from "@/lib/campus-markets";
import { STATIC_ROUTE_UPDATED } from "@/lib/route-updated";

function lastModified(iso: string): Date {
  // Date-only values are pinned to UTC so the sitemap does not shift with the build timezone.
  return new Date(iso.length === 10 ? `${iso}T00:00:00.000Z` : iso);
}

function newerStamp(a: string, b: string): string {
  return a > b ? a : b;
}

function routePath(route: string): string {
  return route === "/" ? "" : route;
}

export default function sitemap(): MetadataRoute.Sitemap {
  // Canonical, indexable routes only. Excludes gated/private pages
  // (/portal/*, /private-ops-7f3a, /zmm-affiliate-command), noindex legal
  // pages (/terms, /privacy), and illustrative sample case studies.
  const routes = Object.keys(STATIC_ROUTE_UPDATED);

  const latestArticle = posts.reduce((latest, post) => {
    const stamp = post.dateModified ?? post.date;
    return stamp > latest ? stamp : latest;
  }, "");

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => {
    const stamped = STATIC_ROUTE_UPDATED[route];
    const iso = route === "/insights" && latestArticle ? newerStamp(latestArticle, stamped) : stamped;
    return {
      url: `${siteConfig.url}${routePath(route)}`,
      lastModified: lastModified(iso),
      changeFrequency: "monthly" as const,
      priority: route === "/" ? 1 : 0.7,
    };
  });

  const workEntries: MetadataRoute.Sitemap = caseStudies
    .filter((study) => !study.sample)
    .map((study) => ({
      url: `${siteConfig.url}/work/${study.slug}`,
      lastModified: lastModified(study.dateModified ?? study.date ?? STATIC_ROUTE_UPDATED["/work"]),
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

  const cityEntries: MetadataRoute.Sitemap = publishedMarkets().map((market) => ({
    url: `${siteConfig.url}${cityPath(market.slug)}`,
    lastModified: lastModified(market.dateModified),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const topicEntries: MetadataRoute.Sitemap = insightTopics.map((topic) => ({
    url: `${siteConfig.url}${insightTopicPath(topic.slug)}`,
    lastModified: lastModified(insightTopicSitemapLastModified(topic.slug)),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticEntries, ...cityEntries, ...workEntries, ...topicEntries, ...articleEntries];
}

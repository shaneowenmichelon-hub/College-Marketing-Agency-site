import { posts, type Post } from "@/lib/content";

/**
 * Insight topic hubs at /insights/topics/<slug>.
 *
 * Assignment is data, not a rewrite of the articles. An article with no topic
 * still appears on /insights. A known frontmatter `topic` overrides this map.
 * An unknown frontmatter value is ignored. A later article the publisher
 * ships without a mapping entry still builds.
 *
 * There is no Gen Z hub. Do not use the reserved pillar phrase in hub copy.
 *
 * Four hubs were retired on 2026-11-25. Each one 301s to a single published
 * article. Those articles stay on /insights and are not assigned to a
 * remaining hub. `RETIRED_INSIGHT_TOPIC_OWNERS` must match the redirects in
 * next.config.mjs, including each trailing-slash source.
 */

/** Date the hub pages were added. Article revisions are compared with this floor. */
export const INSIGHT_TOPICS_UPDATED = "2026-10-30";
/**
 * Titles, descriptions, and FAQs on every hub were updated on this day.
 * Sitemap lastmod is at least this day so IndexNow sees the edit. A newer
 * article revision still wins.
 */
export const INSIGHT_TOPIC_CONTENT_UPDATED = "2026-11-16";

/**
 * Hubs retired on 2026-11-25. Values are the owner articles.
 * brand-ambassador-programs → the college brand ambassador program guide
 * (the hub title, and the keyword-map URL for that program).
 * product-sampling-and-placement → on-campus product sampling, the primary
 * URL for campus and student product sampling.
 * campus-sponsorship → the college event sponsorship guide. That article's
 * title and meta stay as they are.
 * campus-marketing-strategy → the college marketing strategy guide, the
 * closest strategy article. Not the college marketing agency money page.
 */
export const RETIRED_INSIGHT_TOPIC_OWNERS = {
  "brand-ambassador-programs": "/insights/college-brand-ambassador-program",
  "product-sampling-and-placement": "/insights/on-campus-product-sampling",
  "campus-sponsorship": "/insights/college-event-sponsorship",
  "campus-marketing-strategy": "/insights/college-marketing-strategy",
} as const;

export const INSIGHT_TOPIC_SERVICE_PATHS = [
  "/services/brand-ambassadors",
  "/services/events",
  "/services/product-placement",
  "/pricing",
] as const;

export type InsightTopicServicePath = (typeof INSIGHT_TOPIC_SERVICE_PATHS)[number];

export type InsightTopic = {
  slug: string;
  /** Document title lead. The brand suffix is added when it still fits in 60 characters. */
  title: string;
  description: string;
  /** Visible H1. */
  heading: string;
  /** Short name for /insights, the article link, and breadcrumbs. */
  breadcrumb: string;
  navLabel: string;
  intro: string;
  serviceHref: InsightTopicServicePath;
  /** Visible label for the service link. The page always renders this href. */
  serviceLabel: string;
  ogTitle: string;
  ogAccent: string;
};

export const insightTopics: InsightTopic[] = [
  {
    slug: "campus-events-and-activations",
    title: "Campus Activations for Brands",
    description:
      "Campus activations and on-campus activation guides for brands hiring Collegiate Agency. Field plans, staffing, welcome week, and college event marketing.",
    heading: "Campus events and activations for brands.",
    breadcrumb: "Campus events and activations",
    navLabel: "Campus events and activations",
    intro:
      "Collegiate Agency is a college marketing agency brands hire to reach college students. These articles cover campus activations and on-campus activation work: field plans, staffing, welcome week, college event marketing, accessibility, and what to settle before a brand approves the work.",
    serviceHref: "/services/events",
    serviceLabel: "See campus events",
    ogTitle: "Campus activations",
    ogAccent: "Activations brands hire",
  },
  {
    slug: "student-influencers",
    title: "Campus Influencers for Brands",
    description:
      "Campus influencers and student influencer marketing for brands hiring Collegiate Agency. Guides on campus creators that brands brief to reach college students.",
    heading: "Student influencers and campus content.",
    breadcrumb: "Student influencers and content",
    navLabel: "Student influencers and content",
    intro:
      "Collegiate Agency is a college marketing agency brands hire to reach college students. These articles cover campus influencers and student influencer marketing: finding campus creators, briefing them, and tying their content to a campus moment.",
    serviceHref: "/services/brand-ambassadors",
    serviceLabel: "See the brand ambassador program",
    ogTitle: "Campus influencers",
    ogAccent: "Creators brands hire",
  },
];

/**
 * Current articles, grouped by hub. Articles omitted here have no topic.
 * Do not require a new publish to edit this list.
 */
const TOPIC_ARTICLES: Record<string, readonly string[]> = {
  "campus-events-and-activations": [
    "campus-activation-ideas",
    "university-activations",
    "campus-brand-activation-agency",
    "campus-event-accessibility-checklist",
    "campus-event-cancellation-policy",
    "campus-event-staffing-agency",
    "college-experiential-marketing-agency",
    "why-welcome-week-is-the-highest-leverage-moment-on-campus",
    "campus-pop-up-activation",
    "college-event-marketing-agency",
    "back-to-school-campus-activation",
    "spring-semester-campus-marketing",
    "finals-week-marketing",
  ],
  "student-influencers": ["campus-influencers", "student-influencer-marketing", "college-creator-marketing-agency"],
};

function assignmentsFrom(groups: Record<string, readonly string[]>): Record<string, string> {
  const assigned: Record<string, string> = {};
  for (const [topicSlug, articles] of Object.entries(groups)) {
    for (const articleSlug of articles) {
      if (assigned[articleSlug]) {
        throw new Error(
          `Article ${articleSlug} is assigned to both ${assigned[articleSlug]} and ${topicSlug}`,
        );
      }
      assigned[articleSlug] = topicSlug;
    }
  }
  return assigned;
}

export const insightTopicAssignments: Record<string, string> = assignmentsFrom(TOPIC_ARTICLES);

const topicsBySlug = new Map(insightTopics.map((topic) => [topic.slug, topic]));

export function insightTopicPath(slug: string): string {
  return `/insights/topics/${slug}`;
}

export function insightTopicBySlug(slug: string): InsightTopic | undefined {
  return topicsBySlug.get(slug);
}

export type TopicAssignable = {
  slug: string;
  topic?: string;
};

/**
 * Frontmatter wins when it names a real hub. Otherwise the mapping file.
 * Anything else, including a future article with no topic, returns undefined.
 */
export function topicForPost(post: TopicAssignable): InsightTopic | undefined {
  const requested = post.topic?.trim();
  if (requested) {
    const fromFrontmatter = insightTopicBySlug(requested);
    if (fromFrontmatter) return fromFrontmatter;
  }
  const assigned = insightTopicAssignments[post.slug];
  return assigned ? insightTopicBySlug(assigned) : undefined;
}

export function postsForInsightTopic(topicSlug: string): Post[] {
  return posts
    .filter((post) => topicForPost(post)?.slug === topicSlug)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
}

/** Newest article revision in the hub, or the day the hubs shipped. */
export function insightTopicLastModified(topicSlug: string): string {
  const stamps = postsForInsightTopic(topicSlug).map((post) => post.dateModified ?? post.date);
  return stamps.reduce((latest, stamp) => (stamp > latest ? stamp : latest), INSIGHT_TOPICS_UPDATED);
}

/** Sitemap lastmod: newer of the newest article revision and the hub content edit. */
export function insightTopicSitemapLastModified(topicSlug: string): string {
  const revision = insightTopicLastModified(topicSlug);
  return revision > INSIGHT_TOPIC_CONTENT_UPDATED ? revision : INSIGHT_TOPIC_CONTENT_UPDATED;
}

export function articleBreadcrumbItems(post: Pick<Post, "slug" | "title" | "topic">): { name: string; path: string }[] {
  const topic = topicForPost(post);
  return [
    { name: "Home", path: "/" },
    { name: "Insights", path: "/insights" },
    ...(topic ? [{ name: topic.breadcrumb, path: insightTopicPath(topic.slug) }] : []),
    { name: post.title, path: `/insights/${post.slug}` },
  ];
}

function assertInsightTopics(): void {
  const slugs = insightTopics.map((topic) => topic.slug);
  if (new Set(slugs).size !== slugs.length) {
    throw new Error("Insight topic slugs must be unique");
  }
  const knownArticles = new Set(posts.map((post) => post.slug));
  if (knownArticles.has("topics")) {
    throw new Error('Article slug "topics" is reserved for /insights/topics.');
  }
  for (const [articleSlug, topicSlug] of Object.entries(insightTopicAssignments)) {
    if (!knownArticles.has(articleSlug)) {
      throw new Error(`Insight topic map names an article that is not published: ${articleSlug}`);
    }
    if (!topicsBySlug.has(topicSlug)) {
      throw new Error(`Insight topic map names an unknown topic: ${topicSlug}`);
    }
  }
  for (const topic of insightTopics) {
    if (!INSIGHT_TOPIC_SERVICE_PATHS.includes(topic.serviceHref)) {
      throw new Error(`Insight topic ${topic.slug} links to an unknown service path`);
    }
    if (topic.slug === "topics" || topic.slug.includes("/")) {
      throw new Error(`Insight topic slug is not a single path segment: ${topic.slug}`);
    }
    if (topic.slug in RETIRED_INSIGHT_TOPIC_OWNERS) {
      throw new Error(`Insight topic ${topic.slug} was retired`);
    }
  }
  for (const [slug, destination] of Object.entries(RETIRED_INSIGHT_TOPIC_OWNERS)) {
    if (topicsBySlug.has(slug)) {
      throw new Error(`Retired insight topic is still published: ${slug}`);
    }
    const articleSlug = destination.startsWith("/insights/") ? destination.slice("/insights/".length) : "";
    if (!articleSlug || articleSlug.includes("/") || !knownArticles.has(articleSlug)) {
      throw new Error(`Retired insight topic ${slug} does not point at a published article: ${destination}`);
    }
  }
}

assertInsightTopics();

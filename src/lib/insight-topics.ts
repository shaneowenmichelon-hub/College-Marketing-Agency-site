import { posts, type Post } from "@/lib/content";

/**
 * Insight topic hubs at /insights/topics/<slug>.
 *
 * Assignment is data, not a rewrite of the articles. An article with no topic
 * still appears on /insights. A known frontmatter `topic` overrides this map.
 * An unknown frontmatter value is ignored. A later article the publisher
 * ships without a mapping entry still builds.
 *
 * There is no Gen Z hub. Those articles sit in the strategy hub. Do not use
 * the reserved pillar phrase in hub copy.
 */

/** Date the hub pages were added. Sitemap lastmod is at least this day. */
export const INSIGHT_TOPICS_UPDATED = "2026-10-30";

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
    slug: "brand-ambassador-programs",
    title: "Ambassador program guides",
    description:
      "Collegiate Agency notes on brand ambassador programs brands hire to reach college students, from the roster and the reps to content rights.",
    heading: "Brand ambassador programs for brands.",
    breadcrumb: "Brand ambassador programs",
    navLabel: "Brand ambassador programs",
    intro:
      "Collegiate Agency is a college marketing agency brands hire to reach college students. These articles cover brand ambassador programs: building a roster, running student reps, and the rights a brand has in the content those reps create.",
    serviceHref: "/services/brand-ambassadors",
    serviceLabel: "See the brand ambassador program",
    ogTitle: "Ambassador programs",
    ogAccent: "Programs brands hire",
  },
  {
    slug: "campus-events-and-activations",
    title: "Campus events and activations",
    description:
      "Collegiate Agency notes on campus events and activations brands hire, including field plans, staffing, welcome week, and accessibility.",
    heading: "Campus events and activations for brands.",
    breadcrumb: "Campus events and activations",
    navLabel: "Campus events and activations",
    intro:
      "Collegiate Agency is a college marketing agency brands hire to reach college students. These articles cover campus events and activations: field plans, staffing, welcome week, accessibility, and what to settle before a brand approves the work.",
    serviceHref: "/services/events",
    serviceLabel: "See campus events",
    ogTitle: "Events and activations",
    ogAccent: "Activations brands hire",
  },
  {
    slug: "product-sampling-and-placement",
    title: "Sampling and placement guides",
    description:
      "Collegiate Agency notes on product sampling and placement for brands, including trial, welcome-bag inserts, bookstore shelves, and Greek life.",
    heading: "Product sampling and placement on campus.",
    breadcrumb: "Product sampling and placement",
    navLabel: "Product sampling and placement",
    intro:
      "Collegiate Agency is a college marketing agency brands hire to reach college students. These articles cover product sampling and placement: trial on campus, welcome-bag inserts, bookstore shelves, and Greek-life placement.",
    serviceHref: "/services/product-placement",
    serviceLabel: "See product placement",
    ogTitle: "Sampling and placement",
    ogAccent: "Sampling brands hire",
  },
  {
    slug: "student-influencers",
    title: "Student influencer guides",
    description:
      "Collegiate Agency notes on student influencers and campus creators for brands that hire an agency to reach college students.",
    heading: "Student influencers and campus content.",
    breadcrumb: "Student influencers and content",
    navLabel: "Student influencers and content",
    intro:
      "Collegiate Agency is a college marketing agency brands hire to reach college students. These articles cover student influencers and campus creators: finding them, briefing them, and tying their content to a campus moment.",
    serviceHref: "/services/brand-ambassadors",
    serviceLabel: "See the brand ambassador program",
    ogTitle: "Student influencers",
    ogAccent: "Creators brands hire",
  },
  {
    slug: "campus-sponsorship",
    title: "Campus sponsorship guides",
    description:
      "Collegiate Agency notes on sponsorship brands hire for college events, festivals, tailgates, tours, and spring break.",
    heading: "Sponsorship for campus events, festivals, tailgates, and tours.",
    breadcrumb: "Campus sponsorship",
    navLabel: "Campus sponsorship",
    intro:
      "Collegiate Agency is a college marketing agency brands hire to reach college students. These articles cover sponsorship for college events, festivals, tailgates, tours, and spring break, and what a brand should settle before it shows up.",
    serviceHref: "/services/events",
    serviceLabel: "See campus events",
    ogTitle: "Campus sponsorship",
    ogAccent: "Events, festivals, and tours",
  },
  {
    slug: "campus-marketing-strategy",
    title: "Strategy and agency selection",
    description:
      "Collegiate Agency notes on campus marketing strategy for brands, including RFPs, switching agencies, and choosing a partner.",
    heading: "Campus marketing strategy and agency selection.",
    breadcrumb: "Campus marketing strategy",
    navLabel: "Campus marketing strategy",
    intro:
      "Collegiate Agency is a college marketing agency brands hire to reach college students. These articles cover campus marketing strategy and agency selection: a campus plan, an RFP, a handover when a brand switches partners, and how a brand chooses who to hire.",
    serviceHref: "/pricing",
    serviceLabel: "See published pricing",
    ogTitle: "Strategy and hiring",
    ogAccent: "Plans, RFPs, and hiring",
  },
];

/**
 * Current articles, grouped by hub. Articles omitted here have no topic.
 * Do not require a new publish to edit this list.
 */
const TOPIC_ARTICLES: Record<string, readonly string[]> = {
  "brand-ambassador-programs": [
    "college-brand-ambassador-program",
    "college-brand-ambassadors",
    "student-ambassador-marketing",
    "student-brand-reps",
    "campus-ambassador-content-rights",
  ],
  "campus-events-and-activations": [
    "campus-activation-ideas",
    "university-activations",
    "campus-brand-activation-agency",
    "campus-event-accessibility-checklist",
    "campus-event-cancellation-policy",
    "campus-event-staffing-agency",
    "college-experiential-marketing-agency",
    "why-welcome-week-is-the-highest-leverage-moment-on-campus",
  ],
  "product-sampling-and-placement": [
    "campus-product-sampling-ideas",
    "on-campus-product-sampling",
    "college-welcome-bag-inserts",
    "campus-bookstore-product-placement",
    "greek-life-marketing-agency",
    "campus-product-launch",
  ],
  "student-influencers": ["campus-influencers", "student-influencer-marketing"],
  "campus-sponsorship": [
    "college-event-sponsorship",
    "college-festival-sponsorship",
    "college-tailgate-marketing-agency",
    "college-tour-marketing",
    "spring-break-marketing-agency",
  ],
  "campus-marketing-strategy": [
    "college-marketing-strategy",
    "how-to-market-to-college-students",
    "gen-z-marketing",
    "gen-z-experiential-marketing",
    "college-marketing-agency",
    "campus-marketing-agency-rfp",
    "switching-campus-marketing-agencies",
    "campus-field-marketing-agency",
    "student-housing-marketing-agency",
  ],
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
  }
}

assertInsightTopics();

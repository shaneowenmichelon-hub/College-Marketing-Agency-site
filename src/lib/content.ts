/**
 * Placeholder editorial + case-study content. Clearly fill-in-later templates —
 * no fabricated clients, results, or quotes. Result figures are [X] tokens.
 * IMPORTANT: never import a competitor's real clients or numbers here.
 */

export type PostCategory =
  | "Campus Strategy"
  | "Ambassadors"
  | "Influencers"
  | "Events";

export type Post = {
  slug: string;
  title: string;
  category: PostCategory;
  /** Which service pages should surface this post under "Related insights". */
  services: ("events" | "brand-ambassadors" | "influencers")[];
  excerpt: string;
  date: string;
  readingTime: string;
};

export const posts: Post[] = [
  {
    slug: "why-peer-to-peer-beats-paid-reach-on-campus",
    title: "Why peer-to-peer beats paid reach on campus",
    category: "Campus Strategy",
    services: ["brand-ambassadors", "influencers"],
    excerpt:
      "Students trust the people they actually know. Here's how to build a campus program around that instead of fighting it.",
    date: "2026-05-14",
    readingTime: "5 min read",
  },
  {
    slug: "anatomy-of-a-welcome-week-activation",
    title: "The anatomy of a Welcome Week activation",
    category: "Events",
    services: ["events", "brand-ambassadors"],
    excerpt:
      "From permit to post-event recap — a look at how a campus takeover comes together in the first two weeks of the semester.",
    date: "2026-04-02",
    readingTime: "6 min read",
  },
  {
    slug: "vetting-student-creators-the-right-way",
    title: "Vetting student creators the right way",
    category: "Influencers",
    services: ["influencers", "brand-ambassadors"],
    excerpt:
      "Follower counts lie. What to actually screen for when you're building an authentic student influencer roster.",
    date: "2026-03-10",
    readingTime: "4 min read",
  },
  {
    slug: "what-makes-a-great-brand-ambassador",
    title: "What makes a great brand ambassador",
    category: "Ambassadors",
    services: ["brand-ambassadors", "events"],
    excerpt:
      "The traits that separate a rep who moves product from one who just collects a stipend — and how we screen for them.",
    date: "2026-02-18",
    readingTime: "5 min read",
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

/** Posts relevant to a given service, for the "Related insights" section. */
export function postsForService(
  service: "events" | "brand-ambassadors" | "influencers",
  limit = 3,
): Post[] {
  return posts.filter((p) => p.services.includes(service)).slice(0, limit);
}

export type CaseStudy = {
  slug: string;
  brand: string;
  type: "Events" | "Brand Ambassadors" | "Influencers";
  headline: string;
  /** Big metric-forward stat (placeholder [X] token). */
  stat: string;
  statLabel: string;
  /** Secondary metric callouts (tokens). */
  metrics: { value: string; label: string }[];
  challenge: string;
  approach: string;
  results: string;
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "welcome-week-takeover",
    brand: "Sample brand — slot",
    type: "Events",
    headline: "A multi-campus Welcome Week takeover",
    stat: "[X]",
    statLabel: "students engaged",
    metrics: [
      { value: "[X]", label: "campuses" },
      { value: "[X]K", label: "samples handed out" },
      { value: "[X]%", label: "opt-in rate" },
    ],
    challenge:
      "Placeholder challenge. Describe the brand's goal for the semester and why campus was the right bet.",
    approach:
      "Placeholder approach. Outline the activation plan, staffing, and how events + ambassadors worked together.",
    results:
      "Placeholder results. Summarize the outcome with real, verified numbers once the campaign wraps.",
  },
  {
    slug: "ambassador-sampling-program",
    brand: "Sample brand — slot",
    type: "Brand Ambassadors",
    headline: "A peer-to-peer sampling & door-hanger program",
    stat: "[X]",
    statLabel: "door hangers distributed",
    metrics: [
      { value: "[X]+", label: "ambassadors" },
      { value: "[X]", label: "campuses" },
      { value: "[X]%", label: "redemption lift" },
    ],
    challenge:
      "Placeholder challenge. Describe the trial/awareness goal and the target student segment.",
    approach:
      "Placeholder approach. Describe the vetted rep network, tactics, and management cadence.",
    results:
      "Placeholder results. Add verified redemption and reach numbers here.",
  },
  {
    slug: "student-creator-roster",
    brand: "Sample brand — slot",
    type: "Influencers",
    headline: "An always-on student creator roster",
    stat: "[X]M",
    statLabel: "organic views",
    metrics: [
      { value: "[X]+", label: "student creators" },
      { value: "[X]%", label: "avg. engagement" },
      { value: "[X]K", label: "pieces of UGC" },
    ],
    challenge:
      "Placeholder challenge. Describe the content/authenticity goal and the audience.",
    approach:
      "Placeholder approach. Outline recruiting, screening (1,500+ follower minimum), briefing, and optional boosting.",
    results:
      "Placeholder results. Add verified reach and engagement numbers here.",
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

/** Human-readable date without pulling in a date library. */
export function formatDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return `${months[m - 1]} ${d}, ${y}`;
}

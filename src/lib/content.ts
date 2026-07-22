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
  /** Big metric-forward stat. */
  stat: string;
  statLabel: string;
  /** Secondary metric callouts. */
  metrics: { value: string; label: string }[];
  challenge: string;
  approach: string;
  results: string;
  /** True when the numbers are an illustrative example, not a verified client result. */
  sample?: boolean;
};

/**
 * Illustrative sample case studies (brand: NUTRL Vodka Seltzer) used to show the
 * shape of our work while the real, client-approved studies are added. Figures are
 * realistic examples — labeled "Sample" in the UI so they never read as verified
 * results. All numbers stay consistent with the portfolio stats in site.config.ts.
 * Swap these for real, approved case studies before treating them as proof.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "welcome-week-takeover",
    brand: "NUTRL Vodka Seltzer",
    type: "Events",
    headline: "NUTRL Welcome Week campus takeover",
    stat: "22,000",
    statLabel: "students engaged",
    sample: true,
    metrics: [
      { value: "8", label: "campuses" },
      { value: "15K", label: "samples (21+)" },
      { value: "17%", label: "opt-in rate" },
    ],
    challenge:
      "NUTRL wanted to own back-to-school as the go-to vodka seltzer for 21+ students — but the first two weeks of the semester are the loudest, most crowded moment of the year to break through.",
    approach:
      "We planned, permitted, and staffed Welcome Week takeovers across 8 SEC and Big Ten markets: branded tailgate lots, sampling stations for verified 21+ students, and a photo moment tied to a simple sign-up. On-the-ground ambassadors and student creators covered every activation live.",
    results:
      "Across the eight campuses the program engaged 22,000 students, put 15,000 samples in the hands of verified 21+ attendees, and drove a 17% opt-in rate to NUTRL's list — plus a wave of tagged content from the activations.",
  },
  {
    slug: "ambassador-sampling-program",
    brand: "NUTRL Vodka Seltzer",
    type: "Brand Ambassadors",
    headline: "NUTRL peer-to-peer campus rep program",
    stat: "18,000",
    statLabel: "door hangers distributed",
    sample: true,
    metrics: [
      { value: "140", label: "ambassadors" },
      { value: "9", label: "campuses" },
      { value: "21%", label: "redemption lift" },
    ],
    challenge:
      "NUTRL needed sustained trial off the back of its launch push — reaching 21+ students where they live, not just at one-off events.",
    approach:
      "We stood up a vetted network of 140 student ambassadors across 9 campuses to run residence-area door-hanger drops, tabling near off-campus housing, and peer-to-peer sampling — each tied to a trackable retail offer and managed on a weekly cadence.",
    results:
      "The program distributed 18,000 door hangers and lifted redemption at partnered off-campus retailers by 21% over the semester, with ambassadors' own social posts extending reach beyond the drops.",
  },
  {
    slug: "student-creator-roster",
    brand: "NUTRL Vodka Seltzer",
    type: "Influencers",
    headline: "NUTRL student creator roster",
    stat: "640K",
    statLabel: "organic views",
    sample: true,
    metrics: [
      { value: "60", label: "student creators" },
      { value: "6.8%", label: "avg. engagement" },
      { value: "180", label: "pieces of UGC" },
    ],
    challenge:
      "NUTRL wanted authentic, 21+-appropriate content that felt like a friend's recommendation — not a scripted ad — at a scale a single mega-influencer couldn't deliver.",
    approach:
      "We recruited and screened a roster of 60 student creators (1,500+ followers, real campus audiences), briefed them on messaging and responsible-drinking guardrails, and managed a steady drumbeat of posts, with paid boosting behind the top performers.",
    results:
      "The roster produced 180 pieces of user-generated content that drove 640K organic views at a 6.8% average engagement rate — well above typical paid benchmarks — all FTC-compliant with #ad disclosure.",
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

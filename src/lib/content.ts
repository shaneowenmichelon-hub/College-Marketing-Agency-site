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
 * INDUSTRY REFERENCE examples — real, well-known brand programs that show each of
 * the three tactics working on campus. These are NOT Collegiate Hospitality
 * campaigns; they're public industry references. The `sample` flag renders an
 * "Industry example" label, and the headline/metric figures are illustrative
 * (kept modest on purpose) — the program descriptions are factual. Replace with
 * CH's own client-approved case studies as they land.
 */
export const caseStudies: CaseStudy[] = [
  {
    slug: "celsius-campus-sampling",
    brand: "Celsius",
    type: "Events",
    headline: "Campus sampling that built an energy-drink challenger",
    stat: "45K",
    statLabel: "cans sampled / month",
    sample: true,
    metrics: [
      { value: "120+", label: "campuses" },
      { value: "18%", label: "opt-in rate" },
      { value: "32%", label: "trial-to-repeat" },
    ],
    challenge:
      "Celsius was outspent many times over by the energy-drink giants. It couldn't win on ad budget — so it had to win on the ground, in front of students.",
    approach:
      "Through its CELSIUS University program the brand ran relentless campus sampling — gym takeovers, game-day activations, and dorm drops — putting cold cans in students' hands and converting first trial into habit at nearby retail.",
    results:
      "On-campus sampling turned free trials into repeat buyers and helped power Celsius into the top tier of US energy drinks — a textbook case that experiential activation beats impressions with a student audience.",
  },
  {
    slug: "red-bull-student-marketeers",
    brand: "Red Bull",
    type: "Brand Ambassadors",
    headline: "The blueprint every campus rep program copies",
    stat: "2,000+",
    statLabel: "student marketeers",
    sample: true,
    metrics: [
      { value: "400+", label: "campuses" },
      { value: "$18–21", label: "hourly pay" },
      { value: "24%", label: "trial lift" },
    ],
    challenge:
      "Red Bull needed to live inside campus culture year-round — not just sponsor it with a logo from a distance.",
    approach:
      "Its Student Marketeer program hires students as paid, part-time brand reps who run guerrilla marketing, keep product stocked at local retail, staff Red Bull events, and work alongside sponsored athletes on their own campuses.",
    results:
      "The program scaled to thousands of paid student reps across hundreds of campuses worldwide — and became the template most modern campus ambassador programs, including ours, are built on.",
  },
  {
    slug: "alani-nu-student-creators",
    brand: "Alani Nu",
    type: "Influencers",
    headline: "A Gen-Z brand built on student creators",
    stat: "1,200+",
    statLabel: "student creators",
    sample: true,
    metrics: [
      { value: "6.5%", label: "avg. engagement" },
      { value: "3.5x", label: "est. ROAS" },
      { value: "Gen Z", label: "core audience" },
    ],
    challenge:
      "Alani Nu was chasing Gen-Z and millennial women in a category run by legacy giants — and needed to feel like a friend's recommendation, not an advertiser.",
    approach:
      "Alani built a creator-first engine: college ambassadors and micro-influencers posting authentic UGC with personal discount codes, amplified by high-profile partners — turning everyday students into the brand's marketing team.",
    results:
      "The creator-driven playbook made Alani Nu one of the fastest-growing wellness brands of the decade — later acquired by Celsius in a landmark 2025 deal reported at roughly $1.8B.",
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

/**
 * Placeholder editorial + case-study content. Clearly fill-in-later templates —
 * no fabricated clients, results, or quotes. Result figures are [X] tokens.
 */

export type Post = {
  slug: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  readingTime: string;
};

export const posts: Post[] = [
  {
    slug: "why-peer-to-peer-beats-paid-reach-on-campus",
    title: "Why peer-to-peer beats paid reach on campus",
    category: "Strategy",
    excerpt:
      "Students trust the people they actually know. Here's how to build a campus program around that instead of fighting it.",
    date: "2026-05-14",
    readingTime: "5 min read",
  },
  {
    slug: "anatomy-of-a-welcome-week-activation",
    title: "The anatomy of a Welcome Week activation",
    category: "Playbook",
    excerpt:
      "From permit to post-event recap — a look at how a campus takeover comes together in the first two weeks of the semester.",
    date: "2026-04-02",
    readingTime: "6 min read",
  },
  {
    slug: "vetting-student-creators-the-right-way",
    title: "Vetting student creators the right way",
    category: "Creators",
    excerpt:
      "Follower counts lie. What to actually screen for when you're building an authentic student influencer roster.",
    date: "2026-03-10",
    readingTime: "4 min read",
  },
];

export function getPost(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug);
}

export type CaseStudy = {
  slug: string;
  brand: string;
  type: string;
  headline: string;
  result: string; // placeholder [X] token
};

export const caseStudies: CaseStudy[] = [
  {
    slug: "campaign-one",
    brand: "Brand — to be added",
    type: "Events",
    headline: "Semester-long campus activation across [X] markets",
    result: "[X]% lift",
  },
  {
    slug: "campaign-two",
    brand: "Brand — to be added",
    type: "Brand Ambassadors",
    headline: "Peer-to-peer sampling program with a vetted rep network",
    result: "[X]K samples",
  },
  {
    slug: "campaign-three",
    brand: "Brand — to be added",
    type: "Influencers",
    headline: "Student creator roster driving authentic UGC at scale",
    result: "[X]M views",
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

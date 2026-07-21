/**
 * SINGLE SOURCE OF TRUTH
 * ----------------------
 * Company name, contact info, stat tokens, campus list, nav, socials, offices and
 * feature flags all live here. Editing this file re-brands and re-configures the
 * whole site. Nothing is hard-coded in components.
 *
 * See README → "Launch runbook" for the fill-in checklist.
 */

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export type StatToken = {
  /** Stable key so other pages can pull the same figure (e.g. proof strips). */
  key?: string;
  /** The value to render literally. Keep as an [X] token until you have a real number. */
  value: string;
  label: string;
};

export type Office = {
  name: string;
  address: string;
  phone: string;
};

export const siteConfig = {
  /**
   * The agency brand name — a single swappable token referenced everywhere.
   * Change it once and the entire site (nav, hero, footer, meta, forms, emails)
   * updates. Later: replace <Logo /> internals with an SVG wordmark.
   */
  companyName: "Collegiate Hospitality",

  // Alt name: "Unreasonable Hospitality" — note trademark/brand-confusion risk
  // (existing NYT book/brand by Will Guidara); confirm availability before using.

  /** Legal entity name — used in emails, legal pages, and copyright. */
  companyLegalName: "Collegiate Hospitality LLC",

  /** Root domain (no protocol) — used to build email addresses and canonical URLs. */
  companyDomain: "collegiatehospitality.com", // PLACEHOLDER — confirm + register.

  /** Used for <title> templates, OG, and general voice. */
  tagline: "Where brands meet campus culture.",
  description:
    "A college marketing & events agency connecting brands with students through events, brand ambassadors, and influencers — on the campuses where they live, study, and go out.",

  /** Canonical URL for SEO/sitemap. Update to your production domain before launch. */
  url: "https://collegiatehospitality.com",

  /**
   * Real credibility line. Toggle off with `showCredibility: false` if you'd rather
   * not surface it. Copy is original; the ZMM / Night School pedigree is real.
   */
  showCredibility: true,
  credibilityLine:
    "Backed by the team behind ZMM Events and the Night School college tour.",

  /**
   * Primary contact info. Email/phone are derived defaults you can override.
   * PLACEHOLDER values — confirm before launch.
   */
  contact: {
    email: "hello@collegiatehospitality.com",
    phone: "(000) 000-0000",
    location: "New York, NY",
  },

  /**
   * Office locations — rendered on /contact with click-to-call links.
   * PLACEHOLDER offices; edit freely.
   */
  offices: [
    {
      name: "New York",
      address: "[123 Example Ave, New York, NY 10001]",
      phone: "(000) 000-0000",
    },
    {
      name: "Chicago",
      address: "[456 Example St, Chicago, IL 60601]",
      phone: "(000) 000-0000",
    },
  ] as Office[],

  /**
   * Social links — PLACEHOLDER. Empty href renders as a labeled placeholder.
   */
  socials: [
    { label: "Instagram", href: "" },
    { label: "TikTok", href: "" },
    { label: "LinkedIn", href: "" },
  ] as { label: string; href: string }[],

  /** Minimum follower count for the influencer program (IG or TikTok). */
  influencerMinFollowers: 1500,

  /**
   * REAL headline stats. Animated as counters on the homepage. `key` lets other
   * sections (e.g. service-page proof strips) pull the same number from one place.
   */
  stats: [
    { key: "ambassadors", value: "1,200", label: "student ambassadors" },
    { key: "campuses", value: "20", label: "campuses" },
    { key: "brands", value: "20+", label: "brands served" },
    { key: "socialReach", value: "1.44M+", label: "social reach" },
    { key: "studentsReached", value: "100K+", label: "students reached" },
  ] as StatToken[],

  /**
   * REAL campus network — the markets the agency's network spans / is launching
   * across. Framed honestly (markets, not "years of operation").
   */
  campuses: [
    { school: "Ohio State", city: "Columbus, OH" },
    { school: "Wisconsin", city: "Madison, WI" },
    { school: "Minnesota", city: "Minneapolis, MN" },
    { school: "Iowa", city: "Iowa City, IA" },
    { school: "Michigan State", city: "East Lansing, MI" },
    { school: "Nebraska", city: "Lincoln, NE" },
    { school: "Kansas", city: "Lawrence, KS" },
    { school: "Florida", city: "Gainesville, FL" },
    { school: "USF", city: "Tampa, FL" },
    { school: "LSU", city: "Baton Rouge, LA" },
    { school: "Ole Miss", city: "Oxford, MS" },
    { school: "South Carolina", city: "Columbia, SC" },
    { school: "NC State", city: "Raleigh, NC" },
    { school: "Syracuse", city: "Syracuse, NY" },
    { school: "Rutgers", city: "New Brunswick, NJ" },
    { school: "Maryland", city: "College Park, MD" },
    { school: "SMU", city: "Dallas, TX" },
    { school: "UT Austin", city: "Austin, TX" },
    { school: "Arizona State", city: "Tempe, AZ" },
    { school: "San Diego State", city: "San Diego, CA" },
  ] as { school: string; city: string }[],

  /** The three services — the ONLY services in nav, everywhere. */
  services: [
    {
      slug: "events",
      label: "Events",
      href: "/services/events",
      blurb: "Campus activations, planned and staffed end to end.",
    },
    {
      slug: "brand-ambassadors",
      label: "Brand Ambassadors",
      href: "/services/brand-ambassadors",
      blurb: "A vetted student rep network that becomes your voice on campus.",
    },
    {
      slug: "influencers",
      label: "Influencers",
      href: "/services/influencers",
      blurb: "Real students posting to real friends — peer-to-peer content that lands.",
    },
  ] as const,

  /** Primary nav. Services children are the single source for the dropdown. */
  nav: [
    { label: "Home", href: "/" },
    {
      label: "Services",
      href: "/services/events",
      children: [
        {
          label: "Events",
          href: "/services/events",
          description: "Activations planned, staffed & executed.",
        },
        {
          label: "Brand Ambassadors",
          href: "/services/brand-ambassadors",
          description: "A vetted student rep network.",
        },
        {
          label: "Influencers",
          href: "/services/influencers",
          description: "Authentic peer-to-peer content.",
        },
      ],
    },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Insights", href: "/insights" },
    { label: "Contact", href: "/contact" },
  ] as NavItem[],

  /** Budget ranges for the contact form. */
  budgetRanges: [
    "Under $10k",
    "$10k – $25k",
    "$25k – $50k",
    "$50k – $100k",
    "$100k+",
    "Not sure yet",
  ],
} as const;

export type SiteConfig = typeof siteConfig;

/** Derived email defaults (env vars override these — see src/lib/email.ts). */
export const emailDefaults = {
  from: `${siteConfig.companyName} <hello@${siteConfig.companyDomain}>`,
  inbox: `hello@${siteConfig.companyDomain}`,
};

/** Look up a headline stat value by key; falls back to a token if missing. */
export function getStat(key: string): string {
  return siteConfig.stats.find((s) => s.key === key)?.value ?? "[X]";
}

// ─────────────────────────────────────────────────────────────────────────────
// PRICING — per service slug. Edit ranges/copy here; pages read from this.
// ─────────────────────────────────────────────────────────────────────────────
export type ServicePricing = {
  range: string;
  unit: string;
  included: string;
  note: string;
};

export const pricing: Record<string, ServicePricing> = {
  events: {
    range: "$1,500–$10,000",
    unit: "per event",
    included: "Product placement & event sponsorship.",
    note: "Packages are customizable — let's talk.",
  },
  "brand-ambassadors": {
    range: "$50–$200",
    unit: "per student",
    included: "Vetted student reps activating your brand on campus.",
    note: "Packages are customizable — let's talk.",
  },
  influencers: {
    range: "$200–$250",
    unit: "per influencer",
    included: "Product donation + user-generated content (UGC).",
    note: "Packages are customizable — let's talk.",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CLIENTS — revolving marquee logos. `file` is self-hosted at /public/logos/
// (populated by scripts/fetch-assets.mjs at build). `remote` is the live source
// used as a fallback if the self-hosted file is missing. Reorder/remove freely.
// ─────────────────────────────────────────────────────────────────────────────
export type Client = { name: string; file: string; remote?: string; url?: string };

export const clients: Client[] = [
  ...Array.from({ length: 22 }, (_, i) => {
    const n = i + 1;
    return {
      name: `ZMM sponsor ${n}`,
      file: `sponsor${n}.png`,
      remote: `https://www.zmm.events/assets/sponsors/sponsor${n}.png`,
    };
  }),
  // Polymarket — self-hosted SVG wordmark (see /public/logos/polymarket.svg).
  { name: "Polymarket", file: "polymarket.svg", url: "https://polymarket.com" },
];

// ─────────────────────────────────────────────────────────────────────────────
// TEAM — rendered on /about. Drop a headshot at the `photo` path (e.g.
// public/team/shane-michelon.jpg) to show it; until then a clean initials avatar
// is shown. Optionally add a `linkedin` URL to link the card.
// ─────────────────────────────────────────────────────────────────────────────
export type TeamMember = {
  name: string;
  title: string;
  photo?: string;
  linkedin?: string;
};

export const team: TeamMember[] = [
  {
    name: "Shane Michelon",
    title: "Partner, ZMM Events · Co-founder, Night School Tour · Founder, SOS Consultants",
    photo: "/team/shane-michelon.jpg",
  },
  {
    name: "Zach Maitlin",
    title: "Founder, ZMM Events",
    photo: "/team/zach-maitlin.jpg",
  },
  {
    name: "Ronan Rolstan",
    title: "Head of Partnerships, ZMM & Night School Tour",
    photo: "/team/ronan-rolstan.jpg",
  },
  {
    name: "Elizabeth",
    title: "Trade & Activations — formerly Head of Trade & Activations, Anheuser-Busch",
    photo: "/team/elizabeth.jpg",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// EVENT PHOTOS — real ZMM event imagery, self-hosted at /public/images/events/
// (populated by scripts/fetch-assets.mjs). A curated spread of the t1–t54 set.
// Swap in higher-res originals later by replacing the files.
// ─────────────────────────────────────────────────────────────────────────────
export const eventPhotos: string[] = [
  "t1.jpg", "t4.jpg", "t7.jpg", "t10.jpg", "t13.jpg", "t16.jpg", "t20.jpg",
  "t24.jpg", "t28.jpg", "t32.jpg", "t37.jpg", "t42.jpg", "t47.jpg", "t51.jpg",
  "t53.jpg", "t54.jpg",
];

/** Live source for an event photo, used as a fallback before the gradient. */
export function eventPhotoRemote(file: string): string {
  return `https://www.zmm.events/assets/ticker/${file}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// SITE PHOTOS — online imagery used across the site and in the homepage photo
// carousel. Rights-safe (Unsplash). `src` is the topical photo; if it ever fails
// to load, the component falls back to a guaranteed real photo via `photoFallback`
// (Picsum, seeded so it's stable), then a gradient. Swap any `src` here anytime —
// drop in your own /images/events/*.jpg and point `src` at "/images/events/x.jpg".
// NOTE: these load on the live site / browser; this build sandbox blocks image
// hosts, so they won't render inside CI — verify on the Vercel deploy.
// ─────────────────────────────────────────────────────────────────────────────
export type SitePhoto = { src: string; alt: string; seed: string };

const unsplash = (id: string) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=70`;

export const sitePhotos: SitePhoto[] = [
  { src: unsplash("1516450360452-9312f5e86fc7"), alt: "Crowd at a live campus event", seed: "crowd-1" },
  { src: unsplash("1459749411175-04bf5292ceea"), alt: "Concert lights and crowd", seed: "concert-1" },
  { src: unsplash("1470229722913-7c0e2dbbafd3"), alt: "Live music crowd", seed: "concert-2" },
  { src: unsplash("1492684223066-81342ee5ff30"), alt: "Celebration with confetti", seed: "party-1" },
  { src: unsplash("1533174072545-7a4b6ad7a6c3"), alt: "Festival crowd", seed: "festival-1" },
  { src: unsplash("1524368535928-5b5e00ddc76b"), alt: "DJ performing at an event", seed: "dj-1" },
  { src: unsplash("1506157786151-b8491531f063"), alt: "Cheering crowd", seed: "crowd-2" },
  { src: unsplash("1540575467063-178a50c2df87"), alt: "Audience at an event", seed: "audience-1" },
  { src: unsplash("1511578314322-379afb476865"), alt: "Event audience seated", seed: "audience-2" },
  { src: unsplash("1523240795612-9a054b0db644"), alt: "Students collaborating", seed: "students-1" },
  { src: unsplash("1517457373958-b7bdd4587205"), alt: "Students studying together", seed: "students-2" },
  { src: unsplash("1523050854058-8df90110c9f1"), alt: "College graduates", seed: "students-3" },
  { src: unsplash("1541339907198-e08756dedf3f"), alt: "University campus", seed: "campus-1" },
  { src: unsplash("1470753937643-efeb931202a9"), alt: "Friends at a party", seed: "friends-1" },
  { src: unsplash("1543007630-9710e4a00a20"), alt: "Festival hands in the air", seed: "festival-2" },
  { src: unsplash("1493225457124-a3eb161ffa5f"), alt: "Nightlife crowd", seed: "nightlife-1" },
  { src: unsplash("1414235077428-338989a2e8c0"), alt: "Social gathering", seed: "social-1" },
  { src: unsplash("1533105079780-92b9be482077"), alt: "Hands up at a concert", seed: "concert-3" },
];

/** Guaranteed real-photo fallback (rights-safe, always resolves). */
export function photoFallback(seed: string, w = 1200, h = 900): string {
  return `https://picsum.photos/seed/ch-${seed}/${w}/${h}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT & TRIP SPONSORSHIP DIRECTORY — Events page. Grouped by category.
// Fill valuePerEvent / basePackage / presentingSponsor; use "[$ —]" for unknowns.
// ─────────────────────────────────────────────────────────────────────────────
export type SponsorshipItem = {
  name: string;
  description: string;
  valuePerEvent: string;
  basePackage?: string;
  presentingSponsor?: string;
};

export type SponsorshipGroup = {
  id: string;
  title: string;
  intro: string;
  /** Group-level annual pricing (used by portfolio groups like the trips). */
  groupPricing?: { base: string; presenting: string };
  items: SponsorshipItem[];
  comingSoon?: boolean;
};

export const eventSponsorships: {
  intro: string;
  groups: SponsorshipGroup[];
} = {
  intro:
    "Put your brand at the center of the moments students plan their whole year around.",
  groups: [
    {
      id: "zmm-events",
      title: "ZMM Events",
      intro: "Flagship national events — base $2,500, presenting $10,000 each.",
      items: [
        {
          name: "Night School Tour",
          description: "The national college nightlife tour.",
          valuePerEvent: "[$ —]",
          basePackage: "$2,500",
          presentingSponsor: "$10,000",
        },
        {
          name: "HOMETURF (Super Bowl weekend)",
          description: "The Super Bowl weekend flagship.",
          valuePerEvent: "[$ —]",
          basePackage: "$2,500",
          presentingSponsor: "$10,000",
        },
        {
          name: "Hells Gala",
          description: "A signature themed gala event.",
          valuePerEvent: "[$ —]",
          basePackage: "$2,500",
          presentingSponsor: "$10,000",
        },
        {
          name: "Boot Block Party",
          description: "An outdoor block-party activation.",
          valuePerEvent: "[$ —]",
          basePackage: "$2,500",
          presentingSponsor: "$10,000",
        },
      ],
    },
    {
      id: "juscollege-trips",
      title: "JusCollege Trips",
      intro: "Annual, portfolio-level sponsorship across every trip.",
      groupPricing: {
        base: "$50,000/year to sponsor any or all trips",
        presenting: "$500,000/year to be presenting sponsor of all trips that year",
      },
      items: [
        { name: "Puerto Vallarta — Spring Break", description: "Spring Break destination trip.", valuePerEvent: "[$ —]" },
        { name: "Cancún — Spring Break", description: "Spring Break destination trip.", valuePerEvent: "[$ —]" },
        { name: "Cabo — Spring Break", description: "Spring Break destination trip.", valuePerEvent: "[$ —]" },
        { name: "Punta Cana — Spring Break", description: "Spring Break destination trip.", valuePerEvent: "[$ —]" },
        { name: "Miami — Spring Break", description: "Spring Break destination trip.", valuePerEvent: "[$ —]" },
        { name: "Florida — Spring Break", description: "Spring Break destination trip.", valuePerEvent: "[$ —]" },
        { name: "Las Vegas — Senior Trip", description: "Senior-year celebration trip.", valuePerEvent: "[$ —]" },
        { name: "Montreal — Oktoberfest", description: "Oktoberfest destination trip.", valuePerEvent: "[$ —]" },
        { name: "Custom Destination", description: "Choose your own destination.", valuePerEvent: "[$ —]" },
      ],
    },
    {
      id: "venues",
      title: "Venues",
      intro: "Sponsor an ongoing venue partnership.",
      items: [
        {
          name: "The Village — North Carolina",
          description: "A North Carolina venue partnership.",
          valuePerEvent: "[$ —]",
          basePackage: "[$ —]",
          presentingSponsor: "[$ —]",
        },
      ],
    },
    {
      id: "more-to-come",
      title: "More to come",
      intro: "New events and venues are being added to the roster.",
      comingSoon: true,
      items: [],
    },
  ],
};

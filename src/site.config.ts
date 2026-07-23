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
    { key: "influencers", value: "300+", label: "college influencers" },
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
  // Destination for ALL internal notifications (brand + ambassador + portal).
  // Override with AGENCY_INBOX env var.
  inbox: "shane@zmmevents.com",
};

/** How long ambassador ID images should be retained before deletion. */
// TODO: implement a scheduled cleanup routine (cron / Vercel Cron) that deletes
// ambassador-ids/* older than this once verification is complete.
export const ID_RETENTION_DAYS = Number(process.env.ID_RETENTION_DAYS) || 90;

/** Portal: enforce a single active job per ambassador at a time. */
export const ONE_JOB_AT_A_TIME =
  (process.env.ONE_JOB_AT_A_TIME ?? "true").toLowerCase() !== "false";

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
    photo: "/team/shane-michelon.png",
  },
  {
    name: "Zach Maitlin",
    title: "Founder, ZMM Events",
    photo: "/team/zach-maitlin.png",
  },
  {
    name: "AJ Deaugustine",
    title: "Chief Operating Officer",
    photo: "/team/aj-deaugustine.webp",
  },
  {
    name: "Ronan Rolstan",
    title: "Head of Partnerships, ZMM & Night School Tour",
    photo: "/team/ronan-rolstan.png",
  },
  {
    // Photo intentionally left blank for now — shows a clean initials avatar.
    // Title intentionally blank — show name only.
    name: "Elizabeth",
    title: "",
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
/** A single sellable tier (e.g. Thaw Out's Presenting / Title / Founder). */
export type SponsorshipTier = {
  name: string;
  price: string;
  /** Short line describing what the tier is. */
  summary?: string;
  /** True for category-exclusive tiers (only one per category per market). */
  exclusive?: boolean;
  benefits: string[];
};

export type SponsorshipItem = {
  name: string;
  description: string;
  valuePerEvent: string;
  basePackage?: string;
  presentingSponsor?: string;
  /** What's included at each tier (shown when that tier is selected). */
  baseDetail?: string;
  presentingDetail?: string;
  /**
   * Three-tier inventory (festival markets). When present, the card renders the
   * tier layout; when absent it falls back to the two-field base/presenting layout,
   * keeping existing groups (ZMM, JusCollege, Venues) unchanged.
   */
  tiers?: SponsorshipTier[];
  /** Optional festival-market metadata. */
  eventDate?: string;
  venue?: string;
  capacity?: string;
  /** Optional venue proof image shown inline on classic sponsorship cards. */
  image?: { src: string; alt: string };
  /** Optional source-backed facts shown under the card stats. */
  highlights?: string[];
  /** Optional owner/contact line for venue partnerships. */
  contact?: { name: string; role: string; email: string; phone?: string };
  /**
   * Optional link to a hosted album ("View past activation photos →"). Available on
   * every item across all groups; leave "" to hide. Editable — point at a Drive folder.
   */
  photosUrl?: string;
};

/** A stat card (value + label) used in proof blocks. */
export type ProofStat = { value: string; label: string };
/** One product's on-site volume, for the bar comparison. */
export type DrinkVolume = { name: string; cases: number };
/** A text-only past-sponsor case study (no third-party logos). */
export type SponsorCaseStudy = { brand: string; body: string };
/** A captioned insight screenshot rendered as evidence (not decoration). */
export type InsightShot = { src: string; caption: string; alt: string };

/** "Why it works" diligence block for festival groups. */
export type SponsorshipProof = {
  heading: string;
  intro: string;
  reachStats: ProofStat[];
  giveawayBenchmark: string;
  audience: { intro: string; stats: ProofStat[]; notes: string[] };
  viral: { body: string; label: string };
  consumption: { intro: string; totalDrinks: string; revenue: string; byProduct: DrinkVolume[] };
  caseStudies: SponsorCaseStudy[];
  talent: { intro: string; performers: string[] };
  athletes: string;
  insights: InsightShot[];
};

/** Inline photo gallery (festival groups). Files resolve under `dir`; missing files hide gracefully. */
export type SponsorshipGallery = { dir: string; files: string[]; alt: string };

export type SponsorshipGroup = {
  id: string;
  title: string;
  intro: string;
  /** Longer positioning paragraph shown under the header (festival groups). */
  positioning?: string;
  /** Group-level annual pricing (used by portfolio groups like the trips). */
  groupPricing?: { base: string; presenting: string };
  /** Season-bundle upsell card (festival groups). */
  seasonBundle?: { intro: string; tiers: { name: string; price: string }[]; note: string };
  /** "Why it works" diligence block, rendered above the market cards. */
  proof?: SponsorshipProof;
  /** Inline photo gallery (festival groups). */
  gallery?: SponsorshipGallery;
  items: SponsorshipItem[];
  comingSoon?: boolean;
};

// Thaw Out sells the same three tiers in every market — defined once, reused per
// market so the four cards stay in sync. Prices are OUR sell prices (see §4);
// partner cost is never stored in this repo.
const thawTiers: SponsorshipTier[] = [
  {
    name: "Presenting Sponsor",
    price: "$25,000",
    summary: '"Thaw Out Presented By [Brand]" — naming rights at that campus.',
    benefits: [
      'Festival named "Thaw Out Presented By [Brand]" at that campus',
      "Main stage visibility and naming rights",
      "Product featured with campus influencers and student-athletes",
      "Logo on all festival marketing — poster, map, digital, wristband",
      "20 VIP tickets",
      "Premium activation space (10x20)",
      "3 dedicated Instagram posts",
      "Post-event ROI case study",
    ],
  },
  {
    name: "Title Sponsor",
    price: "$12,500",
    summary: '"[Brand] Official [Category]" — exclusive category ownership, one per category per market.',
    exclusive: true,
    benefits: [
      '"[Brand] Official [Category]" designation',
      "Exclusive category ownership — only one per category per market",
      "Logo on all festival marketing",
      "15 VIP tickets",
      "Activation space (10x20)",
      "Product placement with campus influencers",
      "3 dedicated Instagram posts",
      "On-site sampling and organic visibility",
    ],
  },
  {
    name: "Founder Sponsor",
    price: "$6,500",
    summary: "Entry point for building campus presence or testing a market.",
    benefits: [
      "Logo on festival materials and digital assets",
      "8 VIP tickets",
      "Activation space (10x20)",
      "Product placement with campus leaders",
      "Event mention and social visibility",
      "3 Instagram post mentions",
    ],
  },
];

function thawMarket(name: string, eventDate: string, venue: string): SponsorshipItem {
  return {
    name,
    description: `${venue} · ${eventDate}`,
    valuePerEvent: "8,000",
    eventDate,
    venue,
    capacity: "8,000",
    tiers: thawTiers,
    photosUrl: "", // editable — point at a Drive album to show "View past activation photos →"
  };
}

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
          valuePerEvent: "2,500+",
          basePackage: "$2,500",
          presentingSponsor: "$10,000",
        },
        {
          name: "HOMETURF (Super Bowl weekend)",
          description: "The Super Bowl weekend flagship.",
          valuePerEvent: "5,000+",
          basePackage: "$2,500",
          presentingSponsor: "$10,000",
        },
        {
          name: "Hells Gala",
          description: "A signature themed gala event.",
          valuePerEvent: "1,500+",
          basePackage: "$2,500",
          presentingSponsor: "$10,000",
        },
        {
          name: "Boot Block Party",
          description: "An outdoor block-party activation.",
          valuePerEvent: "2,500+",
          basePackage: "$2,500",
          presentingSponsor: "$10,000",
        },
      ],
    },
    {
      id: "thaw-out",
      title: "Thaw Out Music Festival",
      intro:
        "Four campus markets, one spring season — 8,000 students each, 32,000 total. Presenting $25,000 · Title $12,500 · Founder $6,500 per market.",
      positioning:
        "An independent, grassroots college festival built around campus culture — artists, top student-athletes in VIP sections, brands, and the student body. It is not a school-sanctioned event and carries no university affiliation; it's a cultural moment embedded in the college town. Brands buy in to become part of the single day students remember from their college years — presence and authenticity, not just impressions.",
      seasonBundle: {
        intro: "Own the whole spring season across all four 2027 markets.",
        tiers: [
          { name: "Presenting — full season", price: "$90,000" },
          { name: "Title — full season", price: "$45,000" },
          { name: "Founder — full season", price: "$24,000" },
        ],
        note: "Season pricing sits below 4× the single-market rate — the play is owning the whole spring, not a discount table.",
      },
      proof: {
        heading: "Why Thaw Out works",
        intro:
          "The diligence a brand asks for before writing a check — reach, audience, on-site consumption, and repeat sponsors. Every figure traces to Thaw Out's own reporting; estimates are labeled as such.",
        reachStats: [
          { value: "15M", label: "Impressions per season" },
          { value: "15,000", label: "Email subscribers" },
          { value: "1,000+", label: "Avg. likes per post" },
          { value: "32,000", label: "Attendees across four 2027 markets" },
        ],
        giveawayBenchmark: "Giveaway engagement benchmark: ~10K comments · 300K views · 6K likes.",
        audience: {
          intro: "Gen-Z college students are the primary demographic.",
          stats: [
            { value: "73%", label: "Ages 21–25" },
            { value: "53%", label: "Female" },
          ],
          notes: [
            "Parent-backed disposable income",
            "Peer-to-peer social drivers — campus culture leaders and trendsetters",
          ],
        },
        viral: {
          body: "Miami XO's first-ever live performance at Thaw Out became a global organic viral moment across Instagram, TikTok, X, and Facebook. Tens of millions of views are documented.",
          label: "Estimated 100M+ total impressions (unverified estimate)",
        },
        consumption: {
          intro: "Brands don't just get seen here — product moves.",
          totalDrinks: "16,334",
          revenue: "≈ $200K",
          byProduct: [
            { name: "Michelob Ultra 16oz", cases: 208 },
            { name: "Happy Dad", cases: 125 },
            { name: "Lime Rita 16oz", cases: 114 },
            { name: "Mango Rita 16oz", cases: 103 },
            { name: "Hoop Tea 16oz", cases: 78 },
            { name: "SW Hazy IPA", cases: 53 },
          ],
        },
        caseStudies: [
          {
            brand: "Red Bull",
            body: "A major financial commitment and infrastructure partnership — enterprise-level validation of the festival's reach.",
          },
          {
            brand: "Happy Dad",
            body: "Sponsored, placed product organically with influential campus figures, sold 125 cases in Knoxville alone in 2026, and returned the following year. They came for relationships, not awareness — the repeat buy is the proof.",
          },
        ],
        talent: {
          intro: "A funded festival booking real talent. Past performers include:",
          performers: ["DaBaby", "Waka Flocka", "Big X Tha Plug", "Acraze", "Sidepiece", "Bunt", "Xandra"],
        },
        athletes:
          "Every market features that school's most recognizable athletes in dedicated VIP sections — campus icons visible to the whole crowd. For sponsors: product lands organically with the most influential people on campus, athletes can appear on stage during sponsor moments for content capture, and it requires no formal endorsement contracts.",
        insights: [
          { src: "/images/thaw-out/insights/views.png", caption: "Social reach", alt: "Screenshot of Thaw Out social views" },
          { src: "/images/thaw-out/insights/comments.png", caption: "Giveaway engagement", alt: "Screenshot of Thaw Out giveaway comment engagement" },
        ],
      },
      gallery: {
        dir: "/images/thaw-out",
        files: [
          "thaw-out-01.jpg",
          "thaw-out-02.jpg",
          "thaw-out-03.jpg",
          "thaw-out-04.jpg",
          "thaw-out-05.jpg",
          "thaw-out-06.jpg",
          "thaw-out-07.jpg",
        ],
        alt: "Sponsor activation at Thaw Out Music Festival",
      },
      items: [
        thawMarket("Morgantown, WV", "April 3, 2027", "Mylan Park"),
        thawMarket("Iowa City, IA", "April 10, 2027", "Iowa Fairgrounds"),
        thawMarket("Boone, NC", "April 24, 2027", "High Country Fairgrounds"),
        thawMarket("Knoxville, TN", "May 1, 2027", "World's Fair Park"),
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
        { name: "Puerto Vallarta — Spring Break", description: "Spring Break destination trip.", valuePerEvent: "2,000+" },
        { name: "Cancún — Spring Break", description: "Spring Break destination trip.", valuePerEvent: "3,000+" },
        { name: "Cabo — Spring Break", description: "Spring Break destination trip.", valuePerEvent: "2,500+" },
        { name: "Punta Cana — Spring Break", description: "Spring Break destination trip.", valuePerEvent: "2,000+" },
        { name: "Miami — Spring Break", description: "Spring Break destination trip.", valuePerEvent: "3,000+" },
        { name: "Florida — Spring Break", description: "Spring Break destination trip.", valuePerEvent: "2,500+" },
        { name: "Las Vegas — Senior Trip", description: "Senior-year celebration trip.", valuePerEvent: "2,500+" },
        { name: "Montreal — Oktoberfest", description: "Oktoberfest destination trip.", valuePerEvent: "1,500+" },
        { name: "Custom Destination", description: "Choose your own destination.", valuePerEvent: "Varies" },
      ],
    },
    {
      id: "venues",
      title: "Venues",
      intro: "Sponsor an ongoing venue partnership.",
      items: [
        {
          name: "The Village — Raleigh, NC",
          description:
            "One of Raleigh's highest-volume nightlife destinations in the Glenwood South Entertainment District — built for concerts, activations, celebrity appearances, and experiential events.",
          valuePerEvent: "1,000–4,000",
          basePackage: "$10,000",
          presentingSponsor: "Custom",
          baseDetail:
            "Packages start at $10k: product placement and logo placement on flyers for one year, plus activations at 3 shows per year.",
          presentingDetail:
            "Activations all year at every event, social-media insight guarantees, content deliverables, logo placement at the venue entrance or above artists while they perform, and more.",
          image: {
            src: "/images/venues/village-pitch-deck.png",
            alt: "The Village Raleigh pitch deck with crowd photo and venue stats",
          },
          highlights: [
            "300,000+ annual guest visits",
            "21–35 core demographic",
            "12.6K+ Instagram followers @villageraleigh",
            "Weekly unique patrons: Thu 1,000–1,500 · Fri 2,000–2,500 · Sat 3,000–4,000",
            "Past talent includes Waka Flocka Flame, DaBaby, Riff Raff, Xandra, Shwayze, Sons of Paradise, Beach Fly, and more",
          ],
          contact: {
            name: "John Zimmerman",
            role: "Operating Partner, The Village · Founder, Milkman Promotions",
            email: "john@thevillageraleigh.com",
            phone: "720-202-3873",
          },
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

// ─────────────────────────────────────────────────────────────────────────────
// AMBASSADOR JOB PORTAL — editable job board. Edit comp/slots/copy here; the
// portal renders from this. Slot counts, signups and submissions are held in
// local state for the prototype (see src/lib/portal.ts).
// ─────────────────────────────────────────────────────────────────────────────
export type Job = {
  slug: string;
  brand: string;
  title: string;
  category: "Events" | "Brand Ambassadors" | "Influencers";
  compensation: { cash: string; product: string };
  slotsTotal: number;
  slotsFilled: number;
  description: string;
  requirements: string[];
  deliverables: string[];
  deadline: string;
  status: "open" | "closed";
};

export const jobs: Job[] = [
  {
    slug: "whoosh-campus-tabling",
    brand: "Whoosh",
    title: "Campus tabling & flyer drop",
    category: "Events",
    compensation: { cash: "$30/hour", product: "One month of product free" },
    slotsTotal: 2,
    slotsFilled: 0,
    description:
      "Run a table on campus for Whoosh (peptide / wellness) and hand out flyers to wellness-focused students. Great for students who love health, fitness, and meeting people.",
    requirements: [
      "Wellness-focused students preferred",
      "Set up and staff a table in a high-traffic campus spot",
      "Hand out Whoosh flyers and talk up the product",
      "Drive 70 QR code scans per person",
    ],
    deliverables: [
      "Photos and/or video of your table setup and activity",
      "Screenshot of your QR scan count (70+ per person)",
    ],
    deadline: "Rolling",
    status: "open",
  },
  {
    slug: "whoosh-ugc-creator",
    brand: "Whoosh",
    title: "UGC creator (Instagram + TikTok)",
    category: "Influencers",
    compensation: { cash: "$100", product: "One month of product free" },
    slotsTotal: 10,
    slotsFilled: 0,
    description:
      "Create and post an original UGC video promoting Whoosh on both Instagram and TikTok. Authentic, on-brand, and disclosed as #ad.",
    requirements: [
      "Create an original UGC video promoting Whoosh",
      "Post it on BOTH Instagram and TikTok",
      "Tag as #ad / #sponsored per FTC guidelines",
    ],
    deliverables: [
      "Live link to your Instagram post",
      "Live link to your TikTok post",
    ],
    deadline: "Rolling",
    status: "open",
  },
  {
    // Sample job (placeholder brand) — partially filled to demo the slot-counter state.
    slug: "sample-campus-sampling",
    brand: "Sample Brand",
    title: "Product sampling at a campus event",
    category: "Brand Ambassadors",
    compensation: { cash: "$25/hour", product: "Free samples" },
    slotsTotal: 2,
    slotsFilled: 1,
    description:
      "Sample job (placeholder) shown to demonstrate a partially-filled slot state. Hand out product samples at a campus event and collect sign-ups.",
    requirements: [
      "Hand out product samples at a campus event",
      "Collect sign-ups at the table",
    ],
    deliverables: ["Photos of the sampling activation"],
    deadline: "Rolling",
    status: "open",
  },
];

export function getJob(slug: string): Job | undefined {
  return jobs.find((j) => j.slug === slug);
}

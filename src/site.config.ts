/**
 * SINGLE SOURCE OF TRUTH
 * ----------------------
 * Company name, contact info, stat tokens, campus list, nav, socials and feature
 * flags all live here. Editing this file re-brands and re-configures the whole site.
 *
 * See README → "Customize before launch" for the fill-in checklist.
 */

export type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; description?: string }[];
};

export type StatToken = {
  /** The value to render literally. Keep as an [X] token until you have a real number. */
  value: string;
  label: string;
};

export const siteConfig = {
  /**
   * The company has no name yet. This is a swappable token referenced everywhere.
   * Change it once and the entire site (nav, hero, footer, meta, forms) updates.
   * Later: replace <Logo /> internals with an SVG wordmark.
   */
  companyName: "[ insert company name ]",

  /** Used for <title> templates, OG, and general voice. */
  tagline: "Where brands meet campus culture.",
  description:
    "A college marketing & events agency connecting brands with students through events, brand ambassadors, and influencers — on the campuses where they live, study, and go out.",

  /** Canonical URL for SEO/sitemap. Update to your production domain before launch. */
  url: "https://example.com",

  /**
   * Real credibility line. Toggle off with `showCredibility: false` if you'd rather
   * not surface it. Copy is original; the ZMM / Night School pedigree is real.
   */
  showCredibility: true,
  credibilityLine:
    "Backed by the team behind ZMM Events and the Night School college tour.",

  /**
   * Contact info — PLACEHOLDER tokens. Fill in real values before launch.
   */
  contact: {
    email: "[hello@yourdomain.com]",
    phone: "[(000) 000-0000]",
    location: "[City, ST]",
  },

  /** Social links — PLACEHOLDER. Empty href renders as a labeled placeholder. */
  socials: [
    { label: "Instagram", href: "" },
    { label: "TikTok", href: "" },
    { label: "LinkedIn", href: "" },
  ] as { label: string; href: string }[],

  /**
   * PLACEHOLDER stat tokens. Rendered literally so they read as an intentional
   * template, never as fabricated precise figures. Replace the [X] values only.
   */
  stats: [
    { value: "[X]M+", label: "students in reach" },
    { value: "[X]+", label: "campuses reached" },
    { value: "[X]+", label: "student ambassadors" },
    { value: "[X]+", label: "brands served" },
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

import { ORGANIZATION_ID, absoluteUrl, resolveDocumentTitle, TITLE_LIMIT } from "@/lib/seo";

/**
 * Campus marketing city pages. A market is published only when it has at
 * least one activation Collegiate Agency ran there. Copy is limited to those
 * activations. Do not add a brand, school, date, venue, fee, or result that
 * is not already on the activation.
 */

export type MarketActivation = {
  brand: string;
  /** ISO date when one was confirmed. Omit when no date was confirmed. */
  date?: string;
  whatRan: string;
  /** Published case-study result. Omit when the activation has no published result. */
  result?: string;
  /** Public https URL, a published /work path, or "owner-approved" when no public URL was supplied. */
  source: string;
  caseStudySlug?: string;
};

export type CampusMarket = {
  slug: string;
  city: string;
  region: string;
  /** One sentence: what Collegiate Agency ran in this market. */
  intro: string;
  description: string;
  activations: MarketActivation[];
  dateModified: string;
};

export const HUB_PATH = "/campus-marketing";
export const HUB_TITLE_LEAD = "Campus Marketing by City";
export const HUB_H1 = "Campus marketing by city";
export const HUB_DESCRIPTION =
  "Campus marketing by city. Each page lists only the brand activations Collegiate Agency ran in that market.";

/** Sitemap lastmod for the hub and each published city page. */
export const CAMPUS_MARKETING_UPDATED = "2026-11-19";

export const MONEY_PAGE_PATH = "/insights/college-marketing-agency";
export const MONEY_PAGE_ANCHORS = [
  "how to choose a college marketing agency",
  "college marketing agency guide",
  "what a college marketing agency does",
  "hiring a college marketing agency",
] as const;

export const SOS_CASE_STUDY = "sos-consultants-nola-campus-leasing-ambassadors";
export const NUTRL_CASE_STUDY = "nutrl-night-school-tour-product-placement";
export const OWNER_APPROVED_SOURCE = "owner-approved";

const SOS_SOURCE = `https://collegiateagency.com/work/${SOS_CASE_STUDY}`;
const NUTRL_SOURCE = `https://collegiateagency.com/work/${NUTRL_CASE_STUDY}`;
const SYRACUSE_SOURCE = "https://laylo.com/nightschooltour/Rx4xAb";
const OXFORD_SOURCE = "https://laylo.com/nightschooltour/V5wfUn";
const AUSTIN_SOURCE = "https://posh.vip/e/f1-race-week-camp-x-beatbox-julian-fijma";
const DALLAS_SOURCE = "https://posh.vip/e/beatbox-takeover-millero";

const SOS_WHAT_RAN = "SOS Consultants Nola ran a campus campaign with Collegiate Agency in New Orleans.";

export function cityPath(slug: string): string {
  return `${HUB_PATH}/${slug}`;
}

export function moneyPageAnchor(slug: string): (typeof MONEY_PAGE_ANCHORS)[number] {
  let sum = 0;
  for (const char of slug) sum += char.charCodeAt(0);
  return MONEY_PAGE_ANCHORS[sum % MONEY_PAGE_ANCHORS.length];
}

export function caseStudyLabel(slug: string): string {
  if (slug === NUTRL_CASE_STUDY) return "Night School tour case study";
  if (slug === SOS_CASE_STUDY) return "SOS Consultants Nola case study";
  throw new Error(`No case study label for ${slug}`);
}

function nightSchool(brand: string, city: string, when: string, audience: string): string {
  return `${brand} activated with Collegiate Agency at the Night School show in ${city} on ${when} for a ${audience} audience.`;
}

function nightSchoolUndated(brand: string, city: string): string {
  return `${brand} activated with Collegiate Agency at the Night School show in ${city}.`;
}

function activation(input: MarketActivation): MarketActivation {
  return input;
}

export const campusMarkets: CampusMarket[] = [
  {
    slug: "new-orleans",
    city: "New Orleans",
    region: "LA",
    dateModified: CAMPUS_MARKETING_UPDATED,
    intro:
      "Collegiate Agency ran a SOS Consultants Nola campaign and Night School show activations for BeatBox, NÜTRL, and Bumble in New Orleans.",
    description:
      "SOS Consultants Nola, BeatBox, NÜTRL, and Bumble activations Collegiate Agency ran in New Orleans.",
    activations: [
      activation({
        brand: "SOS Consultants Nola",
        whatRan: SOS_WHAT_RAN,
        source: SOS_SOURCE,
        caseStudySlug: SOS_CASE_STUDY,
      }),
      activation({
        brand: "BeatBox",
        whatRan: nightSchoolUndated("BeatBox", "New Orleans"),
        source: OWNER_APPROVED_SOURCE,
      }),
      activation({
        brand: "NÜTRL",
        whatRan: nightSchoolUndated("NÜTRL", "New Orleans"),
        source: NUTRL_SOURCE,
        caseStudySlug: NUTRL_CASE_STUDY,
      }),
      activation({
        brand: "Bumble",
        whatRan: nightSchoolUndated("Bumble", "New Orleans"),
        source: OWNER_APPROVED_SOURCE,
      }),
    ],
  },
  {
    slug: "syracuse",
    city: "Syracuse",
    region: "NY",
    dateModified: CAMPUS_MARKETING_UPDATED,
    intro:
      "Collegiate Agency ran Night School show activations for BeatBox, Dazed, NÜTRL, and Red Bull in Syracuse on Sep 4, 2026.",
    description:
      "Night School show activations Collegiate Agency ran in Syracuse on Sep 4, 2026 for BeatBox, Dazed, NÜTRL, and Red Bull.",
    activations: ["BeatBox", "Dazed", "NÜTRL", "Red Bull"].map((brand) =>
      activation({
        brand,
        date: "2026-09-04",
        whatRan: nightSchool(brand, "Syracuse", "Sep 4, 2026", "Syracuse University"),
        source: SYRACUSE_SOURCE,
        ...(brand === "NÜTRL" ? { caseStudySlug: NUTRL_CASE_STUDY } : {}),
      }),
    ),
  },
  {
    slug: "oxford-ole-miss",
    city: "Oxford",
    region: "MS",
    dateModified: CAMPUS_MARKETING_UPDATED,
    intro:
      "Collegiate Agency ran Night School show activations for Bloom, NÜTRL, and BeatBox in Oxford on Sep 16, 2026.",
    description:
      "Night School show activations Collegiate Agency ran in Oxford on Sep 16, 2026 for Bloom, NÜTRL, and BeatBox.",
    activations: ["Bloom", "NÜTRL", "BeatBox"].map((brand) =>
      activation({
        brand,
        date: "2026-09-16",
        whatRan: nightSchool(brand, "Oxford", "Sep 16, 2026", "University of Mississippi"),
        source: OXFORD_SOURCE,
        ...(brand === "NÜTRL" ? { caseStudySlug: NUTRL_CASE_STUDY } : {}),
      }),
    ),
  },
  {
    slug: "austin",
    city: "Austin",
    region: "TX",
    dateModified: CAMPUS_MARKETING_UPDATED,
    intro:
      "Collegiate Agency ran a BeatBox bar takeover at CAMP on West 6th in Austin on Fri Oct 23, 2026.",
    description:
      "BeatBox bar takeover Collegiate Agency ran at CAMP on West 6th in Austin on Fri Oct 23, 2026.",
    activations: [
      activation({
        brand: "BeatBox",
        date: "2026-10-23",
        whatRan:
          "BeatBox activated with Collegiate Agency at a bar takeover at CAMP on West 6th in Austin on Fri Oct 23, 2026 for a UT Austin audience.",
        source: AUSTIN_SOURCE,
      }),
    ],
  },
  {
    slug: "dallas",
    city: "Dallas",
    region: "TX",
    dateModified: CAMPUS_MARKETING_UPDATED,
    intro: "Collegiate Agency ran a BeatBox activation at Tree Haus in Dallas on Thu Nov 5, 2026.",
    description: "BeatBox activation Collegiate Agency ran at Tree Haus in Dallas on Thu Nov 5, 2026.",
    activations: [
      activation({
        brand: "BeatBox",
        date: "2026-11-05",
        whatRan:
          "BeatBox activated with Collegiate Agency at Tree Haus in Dallas on Thu Nov 5, 2026 for an SMU audience.",
        source: DALLAS_SOURCE,
      }),
    ],
  },
];

const PUBLISHED_SLUGS = ["new-orleans", "syracuse", "oxford-ole-miss", "austin", "dallas"] as const;

function validSource(source: string): boolean {
  if (source === OWNER_APPROVED_SOURCE) return true;
  if (source.startsWith("/work/")) return /^\/work\/[a-z0-9-]+$/.test(source);
  try {
    return new URL(source).protocol === "https:";
  } catch {
    return false;
  }
}

function oneSentence(text: string, label: string) {
  const sentences = text
    .trim()
    .split(/(?<=[.!?])\s+/)
    .filter(Boolean);
  if (sentences.length !== 1) {
    throw new Error(`${label} must be one sentence`);
  }
}

/** A market is published only when it has at least one complete activation. */
export function activationGate(market: { activations?: MarketActivation[] }): boolean {
  const activations = market.activations ?? [];
  return activations.length >= 1 && activations.every((item) => item.brand.trim() && item.whatRan.trim() && validSource(item.source));
}

export function publishedMarkets(): CampusMarket[] {
  return campusMarkets.filter((market) => activationGate(market));
}

export function publishedMarket(slug: string): CampusMarket | undefined {
  return publishedMarkets().find((market) => market.slug === slug);
}

export type MarketDocument = {
  h1: string;
  titleLead: string;
  description: string;
  path: string;
  intro: string;
  ranHeading: string;
  activations: {
    brand: string;
    whatRan: string;
    result?: string;
    caseStudyHref?: string;
    caseStudyLabel?: string;
  }[];
  moneyHref: string;
  moneyAnchor: (typeof MONEY_PAGE_ANCHORS)[number];
  cta: { title: string; href: string };
};

export function marketDocument(market: CampusMarket): MarketDocument {
  const titleLead = `College Marketing Agency in ${market.city}`;
  const resolved = resolveDocumentTitle(titleLead).text;
  if (resolved.length > TITLE_LIMIT) {
    throw new Error(`City title is ${resolved.length} characters: ${resolved}`);
  }
  if (market.description.length > 155) {
    throw new Error(`City meta description is ${market.description.length} characters: ${market.description}`);
  }
  return {
    h1: `College marketing in ${market.city}`,
    titleLead,
    description: market.description,
    path: cityPath(market.slug),
    intro: market.intro,
    ranHeading: `What Collegiate Agency ran in ${market.city}`,
    activations: market.activations.map((item) => ({
      brand: item.brand,
      whatRan: item.whatRan,
      result: item.result,
      caseStudyHref: item.caseStudySlug ? `/work/${item.caseStudySlug}` : undefined,
      caseStudyLabel: item.caseStudySlug ? caseStudyLabel(item.caseStudySlug) : undefined,
    })),
    moneyHref: MONEY_PAGE_PATH,
    moneyAnchor: moneyPageAnchor(market.slug),
    cta: { title: `Tell us your ${market.city} campus goal`, href: "/contact" },
  };
}

export function marketBodyText(market: CampusMarket): string {
  const doc = marketDocument(market);
  const cards = doc.activations
    .map((item) => [item.brand, item.whatRan, item.result ?? "", item.caseStudyLabel ?? ""].join(" "))
    .join(" ");
  return [
    doc.h1,
    doc.intro,
    doc.ranHeading,
    cards,
    `A brand still deciding how to hire can read ${doc.moneyAnchor}.`,
    doc.cta.title,
  ].join(" ");
}

export type CityLink = { href: string; anchor: string };

export function publishedCityLinks(): CityLink[] {
  return publishedMarkets().map((market) => ({
    href: cityPath(market.slug),
    anchor: `campus marketing in ${market.city}`,
  }));
}

export function cityBreadcrumbItems(market: CampusMarket): { name: string; path: string }[] {
  return [
    { name: "Home", path: "/" },
    { name: "Campus marketing", path: HUB_PATH },
    { name: market.city, path: cityPath(market.slug) },
  ];
}

export function hubBreadcrumbItems(): { name: string; path: string }[] {
  return [
    { name: "Home", path: "/" },
    { name: "Campus marketing", path: HUB_PATH },
  ];
}

export function cityServiceStructuredData(market: CampusMarket): Record<string, unknown> {
  const url = absoluteUrl(cityPath(market.slug));
  const doc = marketDocument(market);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}#service`,
    name: `Campus marketing in ${market.city}`,
    serviceType: "College marketing",
    description: doc.description,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: { "@type": "City", name: market.city },
    url,
  };
}

export function hubIntro(): string {
  return "Each city page lists only the brand activations Collegiate Agency ran in that market.";
}

export function hubBodyText(): string {
  const cards = publishedMarkets()
    .map((market) => `${market.city} ${market.intro}`)
    .join(" ");
  return [HUB_H1, hubIntro(), cards].join(" ");
}

export function hubCollectionItems(): { name: string; path: string }[] {
  return publishedMarkets().map((market) => ({
    name: `College marketing in ${market.city}`,
    path: cityPath(market.slug),
  }));
}

export function activationSummary(market: CampusMarket): string {
  return market.intro;
}

const PUBLIC_COPY_BANS = [
  "Murda",
  "Emo's",
  "Riverside",
  "Sep 11",
  "September 11",
  "171,902",
  "171902",
  "Ole Miss",
  "Tulane",
  "Loyola",
  "UNO",
  "Stripz",
  "Polymarket",
  "STIZZY",
  "Julian",
  "Fijma",
  "Millero",
  "LSU",
];

const RESULT_LEAK =
  /\$|return on ad spend|\bROAS\b|171,?902|\bviews\b|\bimpressions\b|\battendance\b|\btickets?\b|\bdoor counts?\b|\bsales\b|\$175,000|\b5\s*million\b|\b425\b|\bcases\b/i;

function publicCopy(market: CampusMarket): string {
  return [market.intro, market.description, marketBodyText(market)].join(" ");
}

if (HUB_DESCRIPTION.length > 155) {
  throw new Error(`Hub meta description is ${HUB_DESCRIPTION.length} characters`);
}
oneSentence(hubIntro(), "Hub intro");

if (campusMarkets.map((market) => market.slug).join("|") !== PUBLISHED_SLUGS.join("|")) {
  throw new Error("Campus markets must be the five approved cities, in that order");
}

for (const market of campusMarkets) {
  if (!activationGate(market)) {
    throw new Error(`${market.slug} failed the activation gate`);
  }
  oneSentence(market.intro, market.slug);
  const copy = publicCopy(market);
  if (RESULT_LEAK.test(copy)) throw new Error(`${market.slug} public copy includes a result or price`);
  for (const ban of PUBLIC_COPY_BANS) {
    if (copy.includes(ban)) throw new Error(`${market.slug} public copy includes ${ban}`);
  }
  for (const item of market.activations) {
    const text = `${item.whatRan} ${item.result ?? ""}`;
    if (RESULT_LEAK.test(text)) throw new Error(`${market.slug} ${item.brand} includes a banned metric`);
    if (item.caseStudySlug && !item.caseStudySlug.startsWith("sos-") && !item.caseStudySlug.startsWith("nutrl-")) {
      throw new Error(`${market.slug} links an unapproved case study`);
    }
  }
}

const brandsBySlug: Record<string, string[]> = {
  "new-orleans": ["SOS Consultants Nola", "BeatBox", "NÜTRL", "Bumble"],
  syracuse: ["BeatBox", "Dazed", "NÜTRL", "Red Bull"],
  "oxford-ole-miss": ["Bloom", "NÜTRL", "BeatBox"],
  austin: ["BeatBox"],
  dallas: ["BeatBox"],
};

for (const market of campusMarkets) {
  const brands = market.activations.map((item) => item.brand);
  const expected = brandsBySlug[market.slug];
  if (brands.join("|") !== expected.join("|")) {
    throw new Error(`${market.slug} brands are ${brands.join(", ")}`);
  }
}

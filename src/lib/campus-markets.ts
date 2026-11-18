import { publishedRate } from "@/lib/pricing-page";
import { faqPageStructuredData, type ServiceFaq } from "@/lib/service-faqs";
import { ORGANIZATION_ID, absoluteUrl, publishedServiceOffers, resolveDocumentTitle, TITLE_LIMIT } from "@/lib/seo";
import { getStat, siteConfig } from "@/site.config";

/**
 * Campus marketing city pages. A market renders only when it clears the
 * publish gate. Facts are the ones approved for the site. Do not add a
 * client, a school, a date, or a result that is not in this file.
 */

export type MarketService = "events" | "brand-ambassadors" | "product-placement";

export type MarketFact = {
  id: string;
  text: string;
  tier: "site" | "public";
  source: string;
  publish: boolean;
  service: MarketService;
  date?: string;
};

export type MarketFaq = { q: string; a: string };

export type CampusMarket = {
  slug: string;
  city: string;
  region: string;
  schools: string[];
  caseStudySlug?: string;
  facts: MarketFact[];
  localFaq: MarketFaq[];
  dateModified: string;
};

export type MarketCopyPart = { text: string; href?: string };
export type MarketCopyBlock = { type: "h2"; text: string } | { type: "p"; parts: MarketCopyPart[] };

export const HUB_PATH = "/campus-marketing";
export const HUB_TITLE_LEAD = "Campus Marketing by City";
export const HUB_H1 = "Campus marketing by city";
export const HUB_DESCRIPTION =
  "Campus marketing by city for brands that hire Collegiate Agency. A published page names the sourced campaign in that city and the published rates.";

/** Sitemap lastmod for the hub and each published city page. */
export const CAMPUS_MARKETING_UPDATED = "2026-11-18";

export const MIN_BODY_WORDS = 350;
export const MIN_LOCAL_FAQS = 4;

export const MONEY_PAGE_PATH = "/insights/college-marketing-agency";
export const MONEY_PAGE_ANCHORS = [
  "how to choose a college marketing agency",
  "college marketing agency guide",
  "what a college marketing agency does",
  "hiring a college marketing agency",
] as const;

const NO_FACT =
  "SOS Consultants Nola, a New Orleans leasing agency, ran a $2,500 package: two shows, an on-site activation at the show, one round of ambassador flyer/video posts, and localized Meta ads using the same creative. Result: 11x return on ad spend.";

const AU_FACT =
  'Night School Presents: MURDA BEATZ (HOUSE SET) at Emo\'s Austin, 2015 E Riverside Dr, Fri Sep 11, 2026.';

const OM_FACT =
  'Night School Ole Miss, Wednesday September 16, 2026, billed "Kick off LSU vs Ole Miss weekend with us".';

export function cityPath(slug: string): string {
  return `${HUB_PATH}/${slug}`;
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function moneyPageAnchor(slug: string): (typeof MONEY_PAGE_ANCHORS)[number] {
  let sum = 0;
  for (const char of slug) sum += char.charCodeAt(0);
  return MONEY_PAGE_ANCHORS[sum % MONEY_PAGE_ANCHORS.length];
}

export function schoolInNetwork(name: string): boolean {
  return siteConfig.campuses.some((campus) => campus.school === name);
}

export function publishedFacts(market: CampusMarket): MarketFact[] {
  return market.facts.filter((fact) => fact.publish);
}

/** A market clears the fact gate with one published site-tier fact, or two published facts of any tier. */
export function factGate(market: CampusMarket): boolean {
  const published = publishedFacts(market);
  return published.some((fact) => fact.tier === "site") || published.length >= 2;
}

function joinSchools(names: readonly string[]): string {
  if (names.length <= 1) return names.join("");
  if (names.length === 2) return `${names[0]} and ${names[1]}`;
  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

function factSnippet(text: string): string {
  const marker = "Result: ";
  const index = text.indexOf(marker);
  if (index >= 0) return text.slice(index).trim();
  const sentence = text.indexOf(". ");
  return (sentence === -1 ? text : text.slice(0, sentence + 1)).trim();
}

function speedSentence(): string {
  const stat = siteConfig.stats.find((item) => item.key === "speedToActivation");
  if (!stat) return "";
  return `Collegiate Agency publishes ${getStat("speedToActivation")} from a ${stat.label}.`;
}

function newOrleansFaqs(): MarketFaq[] {
  const speed = speedSentence();
  return [
    {
      q: "Can Collegiate Agency run a campus activation in New Orleans?",
      a: `Yes. Brands hire Collegiate Agency to plan, staff, and report a campus activation in New Orleans. ${NO_FACT}`,
    },
    {
      q: "What does a New Orleans campus ambassador program cost?",
      a: `Collegiate Agency prices a campus ambassador program at ${publishedRate("brand-ambassadors")}. Product placement is ${publishedRate("product-placement")}, and events are ${publishedRate("events")}. Firm pricing follows after a brand sends the New Orleans goal through the contact form.`,
    },
    {
      q: "Has Collegiate Agency worked in New Orleans before?",
      a: `Yes. Collegiate Agency has published one New Orleans campaign, and this page does not add a second one. ${NO_FACT}`,
    },
    {
      q: "Which schools can a New Orleans campaign reach?",
      a: "A New Orleans campaign can be aimed at students at Tulane, Loyola New Orleans, and UNO. Tulane is in the Collegiate Agency campus network. Loyola New Orleans and UNO are schools a brand can name in a brief, and they are not published as past Collegiate Agency work.",
    },
    {
      q: "How fast can a campaign start?",
      a: speed
        ? `${speed} A brand starts by sending the New Orleans goal through the contact form. Collegiate Agency replies within one business day with a tailored plan and firm pricing.`
        : "A brand starts by sending the New Orleans goal through the contact form. Collegiate Agency replies within one business day with a tailored plan and firm pricing.",
    },
  ];
}

function listingFaqs(city: string, school: string, fact: string): MarketFaq[] {
  const network = schoolInNetwork(school)
    ? `${school} is in the Collegiate Agency campus network. That label is not a past campaign.`
    : `${school} is not in the Collegiate Agency campus network.`;
  return [
    {
      q: `What public listing does Collegiate Agency have for ${city}?`,
      a: `The public listing Collegiate Agency can cite for ${city} is this one. ${fact}`,
    },
    {
      q: `Is ${school} past Collegiate Agency work?`,
      a: `${network} Collegiate Agency does not describe ${school} as a completed client campaign on this page.`,
    },
    {
      q: `Does this ${city} listing publish a Collegiate Agency result?`,
      a: `No. The ${city} entry is a public event listing, not a Collegiate Agency case study. Collegiate Agency is not adding a client, a return, or a date beyond that listing.`,
    },
    {
      q: `How would a brand ask about ${city}?`,
      a: `A brand asks through the contact form. Collegiate Agency does not publish a ${city} page until another sourced fact is approved.`,
    },
  ];
}

export const campusMarkets: CampusMarket[] = [
  {
    slug: "new-orleans",
    city: "New Orleans",
    region: "LA",
    schools: ["Tulane", "Loyola New Orleans", "UNO"],
    caseStudySlug: "sos-consultants-nola-campus-leasing-ambassadors",
    dateModified: CAMPUS_MARKETING_UPDATED,
    facts: [
      {
        id: "NO-1",
        text: NO_FACT,
        tier: "site",
        source: "https://collegiateagency.com/work/sos-consultants-nola-campus-leasing-ambassadors",
        publish: true,
        service: "brand-ambassadors",
      },
    ],
    localFaq: newOrleansFaqs(),
  },
  {
    slug: "austin",
    city: "Austin",
    region: "TX",
    schools: ["UT Austin"],
    dateModified: CAMPUS_MARKETING_UPDATED,
    facts: [
      {
        id: "AU-1",
        text: AU_FACT,
        tier: "public",
        source: "https://www.universe.com/events/murda-beatz-house-set-tickets-34Y7J2",
        publish: true,
        service: "events",
        date: "2026-09-11",
      },
    ],
    localFaq: listingFaqs("Austin", "UT Austin", AU_FACT),
  },
  {
    slug: "oxford-ole-miss",
    city: "Oxford",
    region: "MS",
    schools: ["Ole Miss"],
    dateModified: CAMPUS_MARKETING_UPDATED,
    facts: [
      {
        id: "OM-1",
        text: OM_FACT,
        tier: "public",
        source: "https://laylo.com/nightschooltour/V5wfUn",
        publish: true,
        service: "events",
        date: "2026-09-16",
      },
    ],
    localFaq: listingFaqs("Oxford", "Ole Miss", OM_FACT),
  },
];

function h2(text: string): MarketCopyBlock {
  return { type: "h2", text };
}

function p(parts: MarketCopyPart[]): MarketCopyBlock {
  return { type: "p", parts };
}

function blocksText(blocks: MarketCopyBlock[]): string {
  return blocks
    .map((block) => (block.type === "h2" ? block.text : block.parts.map((part) => part.text).join("")))
    .join(" ");
}

export type MarketDocument = {
  h1: string;
  titleLead: string;
  description: string;
  path: string;
  lead: MarketCopyBlock[];
  ranHeading: string;
  factCards: { id: string; text: string; href?: string; label?: string }[];
  schoolsHeading: string;
  schoolsIntro: MarketCopyBlock[];
  schools: { name: string; network: boolean }[];
  servicesHeading: string;
  services: MarketCopyBlock[];
  proofHeading: string;
  proof: MarketCopyBlock[];
  cta: { title: string; href: string };
};

function caseStudyCard(market: CampusMarket): { href: string; label: string } | undefined {
  if (!market.caseStudySlug) return undefined;
  if (market.slug === "new-orleans") {
    return {
      href: `/work/${market.caseStudySlug}`,
      label: "SOS Consultants Nola case study",
    };
  }
  return { href: `/work/${market.caseStudySlug}`, label: "Read the case study" };
}

function marketMetaDescription(market: CampusMarket): string {
  const fact = publishedFacts(market)[0];
  const snippet = fact ? factSnippet(fact.text) : "";
  const description = `Brands hire Collegiate Agency for campus events, ambassadors and product placement in ${market.city}. ${snippet} Published rates.`;
  if (factGate(market) && description.length > 155) {
    throw new Error(`City meta description is ${description.length} characters: ${description}`);
  }
  return description;
}

function leadBlocks(market: CampusMarket, fact: MarketFact | undefined): MarketCopyBlock[] {
  const schools = joinSchools(market.schools);
  const networkSchools = market.schools.filter(schoolInNetwork);
  const networkLine =
    networkSchools.length > 0
      ? `${joinSchools(networkSchools)} is in the Collegiate Agency campus network.`
      : "None of these schools are in the Collegiate Agency campus network.";
  const blocks: MarketCopyBlock[] = [
    p([
      {
        text: `Brands hire Collegiate Agency to market to college students in ${market.city}. A ${market.city} brief can name students at ${schools}. ${networkLine} Collegiate Agency is an agency based in ${siteConfig.contact.location}. Collegiate Agency plans the work, staffs the work, and reports the work.`,
      },
    ]),
  ];
  if (fact) {
    blocks.push(
      p([
        {
          text: `The strongest published fact for ${market.city} is this one: ${fact.text}`,
        },
      ]),
    );
  }
  if (market.slug === "new-orleans") {
    blocks.push(
      p([
        {
          text: "The published New Orleans package is a leasing campaign for SOS Consultants Nola. The pieces in that fact are the whole result this page will describe. Two shows gave the brand a room students had already chosen to enter. An on-site activation at the show put the leasing message in that room. One round of ambassador flyer and video posts carried the same message through students. Localized Meta ads then used that same creative, so the feed repeated what students had already seen on campus and at the show. This page does not add a second New Orleans client, a second show date, or a second return figure beside that fact.",
        },
      ]),
      p([
        {
          text: "A brand reading this page should keep the schools separate from that result. Tulane is in the Collegiate Agency campus network, which is the roster of schools the network covers. Loyola New Orleans can be named in a New Orleans brief. UNO can be named in a New Orleans brief. Those two schools are not marked as network inventory here, and they are not presented as completed campaigns. The published case study does not name a campus inside the city, so this page does not assign the leasing result to Tulane, to Loyola New Orleans, or to UNO.",
        },
      ]),
      p([
        {
          text: `Collegiate Agency plans a New Orleans campaign from ${siteConfig.contact.location}, then staffs it and reports it. College students are the audience. The people who plan, staff, and report the work are Collegiate Agency. A brand starts that conversation on the contact form. This page does not offer a calendar, a booking link, or a phone number, and it does not ask a student to run the agency.`,
        },
      ]),
      p([
        {
          text: "Use the page in that order. Read the fact before you read the rates. The rates are the published prices for the three channels, not a restatement of the leasing package. The package is the proof that a compact New Orleans program can stack a show, an on-site activation, ambassador posts, and localized ads that share one creative. A new brief can use one of those channels or more than one. Collegiate Agency confirms the mix after it reads the goal. Nothing on this page is a forecast for a community that has not run yet.",
        },
      ]),
    );
  }
  return blocks;
}

function schoolsIntro(market: CampusMarket): MarketCopyBlock[] {
  const named = joinSchools(market.schools);
  return [
    p([
      {
        text: `A ${market.city} campaign can be aimed at students at ${named}. Only a school that is already on the published campus list is marked in the Collegiate Agency campus network. The mark is a network line. It is not a logo, a sponsorship, or a university affiliation, and it is not a claim that the school hired Collegiate Agency.`,
      },
    ]),
  ];
}

function servicesBlocks(market: CampusMarket): MarketCopyBlock[] {
  const tied =
    market.slug === "new-orleans"
      ? "The published New Orleans fact included two shows and an on-site activation at the show, so campus events are the channel that fact already used. "
      : "";
  const ambassadors =
    market.slug === "new-orleans"
      ? "The same fact included one round of ambassador flyer and video posts, and those posts supplied the creative for the localized Meta ads. "
      : "";
  const placement =
    market.slug === "new-orleans"
      ? "The published New Orleans fact does not include a sorority chapter placement. "
      : "";
  return [
    p([
      { text: `${tied}Collegiate Agency publishes event rates as ${publishedRate("events")}. Read ` },
      { text: "campus events", href: "/services/events" },
      { text: " for how those packages are staffed." },
    ]),
    p([
      { text: `${ambassadors}Collegiate Agency prices a campus ambassador program at ${publishedRate("brand-ambassadors")}. Read ` },
      { text: "brand ambassadors", href: "/services/brand-ambassadors" },
      { text: " for what that monthly rate includes." },
    ]),
    p([
      { text: `${placement}A brand that wants product placement in ${market.city} can add it at ${publishedRate("product-placement")}. Read ` },
      { text: "product placement", href: "/services/product-placement" },
      { text: " for the chapter deliverables. That rate is a separate service from the fact above." },
    ]),
    p([
      { text: "Compare the three rates on the " },
      { text: "pricing", href: "/pricing" },
      {
        text: " page. A brief the rate table does not cover is quoted after the brand sends the goal through the contact form. Collegiate Agency replies within one business day with a tailored plan and firm pricing.",
      },
    ]),
  ];
}

function proofBlocks(market: CampusMarket): MarketCopyBlock[] {
  const card = caseStudyCard(market);
  const anchor = moneyPageAnchor(market.slug);
  const parts: MarketCopyPart[] = [
    {
      text: `The ${market.city} proof on this page is the published write-up, not a new number. `,
    },
  ];
  if (card) {
    parts.push({ text: card.label, href: card.href }, { text: " is the source for the fact above. " });
  }
  parts.push(
    { text: "A brand still deciding how to hire can read " },
    { text: anchor, href: MONEY_PAGE_PATH },
    {
      text: `. This page does not replace that guide. The comment beside this section is a published remark from the homepage. It is not a ${market.city} result.`,
    },
  );
  return [p(parts)];
}

export function marketDocument(market: CampusMarket): MarketDocument {
  const fact = publishedFacts(market)[0];
  const card = caseStudyCard(market);
  const titleLead = `College Marketing Agency in ${market.city}`;
  const resolved = resolveDocumentTitle(titleLead).text;
  if (resolved.length > TITLE_LIMIT) {
    throw new Error(`City title is ${resolved.length} characters: ${resolved}`);
  }
  return {
    h1: `College marketing in ${market.city}`,
    titleLead,
    description: marketMetaDescription(market),
    path: cityPath(market.slug),
    lead: leadBlocks(market, fact),
    ranHeading: `What we've run in ${market.city}`,
    factCards: publishedFacts(market).map((item) => ({
      id: item.id,
      text: item.text,
      href: card?.href,
      label: card?.label,
    })),
    schoolsHeading: `Schools a ${market.city} campaign can name`,
    schoolsIntro: schoolsIntro(market),
    schools: market.schools.map((name) => ({ name, network: schoolInNetwork(name) })),
    servicesHeading: `Services that fit ${market.city}`,
    services: servicesBlocks(market),
    proofHeading: `Proof for ${market.city}`,
    proof: proofBlocks(market),
    cta: { title: `Tell us your ${market.city} campus goal`, href: "/contact" },
  };
}

export function marketBodyText(market: CampusMarket): string {
  const doc = marketDocument(market);
  const schools = doc.schools
    .map((school) => (school.network ? `${school.name} in the Collegiate Agency campus network` : school.name))
    .join(" ");
  const cards = doc.factCards.map((card) => `${card.text} ${card.label ?? ""}`).join(" ");
  const faqs = market.localFaq.map((item) => `${item.q} ${item.a}`).join(" ");
  return [
    doc.h1,
    blocksText(doc.lead),
    doc.ranHeading,
    cards,
    doc.schoolsHeading,
    blocksText(doc.schoolsIntro),
    schools,
    doc.servicesHeading,
    blocksText(doc.services),
    faqs,
    doc.proofHeading,
    blocksText(doc.proof),
    doc.cta.title,
  ].join(" ");
}

export function marketGate(market: CampusMarket): {
  facts: boolean;
  faqs: boolean;
  words: boolean;
  wordCount: number;
} {
  const wordCount = countWords(marketBodyText(market));
  return {
    facts: factGate(market),
    faqs: market.localFaq.length >= MIN_LOCAL_FAQS,
    words: wordCount >= MIN_BODY_WORDS,
    wordCount,
  };
}

export function publishedMarkets(): CampusMarket[] {
  return campusMarkets.filter((market) => {
    const gate = marketGate(market);
    return gate.facts && gate.faqs && gate.words;
  });
}

export function publishedMarket(slug: string): CampusMarket | undefined {
  return publishedMarkets().find((market) => market.slug === slug);
}

export function uniqueWordShare(left: string, right: string): number {
  const tokenize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(Boolean);
  const words = tokenize(left);
  const other = new Set(tokenize(right));
  if (words.length === 0) return 0;
  return words.filter((word) => !other.has(word)).length / words.length;
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
    areaServed: [
      { "@type": "City", name: market.city },
      ...market.schools.map((name) => ({ "@type": "CollegeOrUniversity", name })),
    ],
    url,
    offers: publishedServiceOffers(),
  };
}

export function cityFaqItems(market: CampusMarket): ServiceFaq[] {
  return market.localFaq.map((item) => ({ question: item.q, answer: item.a }));
}

export function cityStructuredData(market: CampusMarket): Record<string, unknown>[] {
  return [
    cityServiceStructuredData(market),
    faqPageStructuredData(cityFaqItems(market), cityPath(market.slug)),
  ];
}

function campusCount(): string {
  const listed = String(siteConfig.campuses.length);
  const published = getStat("campuses");
  if (published !== listed) {
    throw new Error(`Campus stat ${published} does not match the campus list ${listed}`);
  }
  return published;
}

export function hubIntro(): MarketCopyBlock[] {
  const cities = publishedMarkets().map((market) => market.city);
  return [
    p([
      {
        text: `Brands hire Collegiate Agency for campus marketing by city when they want to reach college students in a named market. The cards on this page are the cities with a sourced campaign already published on the site. Today that is ${joinSchools(cities)}. A city without a published fact is not listed here.`,
      },
    ]),
    p([
      {
        text: `The grid under the cards is the Collegiate Agency campus network: ${campusCount()} schools. A school in that grid is in the network. It is not a past campaign, and it is not a university affiliation.`,
      },
    ]),
  ];
}

export function hubFaqs(): MarketFaq[] {
  const cities = joinSchools(publishedMarkets().map((market) => market.city));
  return [
    {
      q: "What is a campus marketing city page?",
      a: "A campus marketing city page is where Collegiate Agency publishes the sourced work it has already run in that city. Brands hire Collegiate Agency for campus events, brand ambassadors, and product placement aimed at college students. The page repeats a published fact and the published rates.",
    },
    {
      q: "Which cities does Collegiate Agency publish a campus marketing page for?",
      a: `Collegiate Agency publishes a campus marketing page for ${cities}. A city is listed on this hub only when a sourced fact for that city is already approved. The live pages are the cards on this page.`,
    },
    {
      q: "Is the school grid a list of past Collegiate Agency campaigns?",
      a: "No. The schools in the grid are in the Collegiate Agency campus network. A school in that grid is not a past campaign, and it is not a university affiliation. Past work is the case study linked from a published city page.",
    },
    {
      q: "How does a brand start campus marketing in a published city?",
      a: "A brand starts by sending the city and the goal through the contact form. Collegiate Agency replies within one business day with a tailored plan and firm pricing. This page does not offer a calendar or a phone number.",
    },
  ];
}

export function hubBodyText(): string {
  const cards = publishedMarkets()
    .map((market) => {
      const fact = publishedFacts(market)[0];
      return `${market.city} ${fact?.text ?? ""}`;
    })
    .join(" ");
  const faqs = hubFaqs().map((item) => `${item.q} ${item.a}`).join(" ");
  return [HUB_H1, blocksText(hubIntro()), cards, faqs].join(" ");
}

export function hubCollectionItems(): { name: string; path: string }[] {
  return publishedMarkets().map((market) => ({
    name: `College marketing in ${market.city}`,
    path: cityPath(market.slug),
  }));
}

for (const market of campusMarkets) {
  for (const fact of market.facts) {
    if (!fact.id || !fact.text || !fact.source.startsWith("https://")) {
      throw new Error(`Campus fact ${fact.id || market.slug} is missing an id, text, or source`);
    }
  }
  if (market.localFaq.length < MIN_LOCAL_FAQS) {
    throw new Error(`${market.slug} needs at least ${MIN_LOCAL_FAQS} local FAQ entries`);
  }
}

const newOrleans = campusMarkets.find((market) => market.slug === "new-orleans");
if (!newOrleans) throw new Error("Missing New Orleans market");
const newOrleansGate = marketGate(newOrleans);
if (!newOrleansGate.facts || !newOrleansGate.words || !newOrleansGate.faqs) {
  throw new Error(`New Orleans failed the publish gate: ${JSON.stringify(newOrleansGate)}`);
}

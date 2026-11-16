import type { ArticleTableBlock, CaseStudy } from "@/lib/content";
import { caseStudies } from "@/lib/content";
import type { ServiceFaq } from "@/lib/service-faqs";
import { publishedRate } from "@/lib/pricing-page";
import { getStat, siteConfig } from "@/site.config";

/**
 * Indexable copy for /work, /contact, and /build-a-campaign.
 * Every figure is read from pricing, the campus stat, the contact location,
 * or an existing case study. Do not add a client, a result, a phone number,
 * or a street address here.
 */

export type CopyPart = { text: string; href?: string };

export type CopyBlock = { type: "h2"; text: string } | { type: "p"; parts: CopyPart[] };

export const WORK_TITLE = "Campus Marketing Case Studies for Brands";
export const WORK_DESCRIPTION =
  "Campus marketing case studies for brands hiring Collegiate Agency. Published write-ups cover campus events, brand ambassador programs, and product placement.";

export const CONTACT_TITLE = "Contact the college marketing agency";
export const CONTACT_DESCRIPTION =
  "Brands, marketing teams, and agencies contact Collegiate Agency about campus events, brand ambassador programs, and product placement.";

export const BUILD_TITLE = "Build a campus marketing campaign";
export const BUILD_DESCRIPTION =
  "Build a campus marketing campaign with Collegiate Agency: events, brand ambassadors, and product placement. Send a starting estimate. Firm pricing follows.";

export const WORK_H1 = "Campus campaigns brands hire Collegiate Agency to run.";
export const CONTACT_H1 = "Contact Collegiate Agency about a campus campaign.";
export const BUILD_H1 = "Build a college marketing campaign.";

export const CONTACT_FAQ_TITLE = "Questions brands ask before they write.";
export const WORK_FAQ_TITLE = "Questions brands ask about these case studies.";
export const BUILD_FAQ_TITLE = "Questions brands ask before they send a campaign.";

const linkClassPages = [
  "/services/events",
  "/services/brand-ambassadors",
  "/services/product-placement",
  "/pricing",
  "/about",
] as const;

export const CONTEXTUAL_PATHS = linkClassPages;

function campusCount(): string {
  const listed = String(siteConfig.campuses.length);
  const published = getStat("campuses");
  if (published !== listed) {
    throw new Error(`Campus stat ${published} does not match the builder list ${listed}`);
  }
  return published;
}

function serviceBlurb(slug: "events" | "brand-ambassadors" | "product-placement"): string {
  const service = siteConfig.services.find((item) => item.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service.blurb;
}

function h2(text: string): CopyBlock {
  return { type: "h2", text };
}

function p(parts: CopyPart[]): CopyBlock {
  return { type: "p", parts };
}

export function workIntro(): CopyBlock[] {
  return [
    p([
      { text: "Collegiate Agency is a college and campus marketing agency. Brands hire it to reach college students through " },
      { text: "campus events", href: "/services/events" },
      { text: ", " },
      { text: "brand ambassador programs", href: "/services/brand-ambassadors" },
      { text: ", and " },
      { text: "product placement", href: "/services/product-placement" },
      {
        text: ". The cards below are the published write-ups: client campaigns for those channels, plus one industry example that is not a verified client result.",
      },
    ]),
    h2("What these campaigns cover"),
    p([
      { text: `${siteConfig.services.find((item) => item.slug === "events")?.label ?? "Events"}: ${serviceBlurb("events")} ` },
      { text: "Brand ambassadors", href: "/services/brand-ambassadors" },
      { text: `: ${serviceBlurb("brand-ambassadors")} ` },
      { text: "Product placement", href: "/services/product-placement" },
      { text: `: ${serviceBlurb("product-placement")} Published rates are on the ` },
      { text: "pricing page", href: "/pricing" },
      { text: ". The " },
      { text: "about page", href: "/about" },
      { text: " describes the agency." },
    ]),
    h2("How to read a write-up"),
    p([
      {
        text: "Each card adds the challenge already published on that case study, under the headline stored with it. Open the card for the approach and the results. A brand that wants a program in this shape can ",
      },
      { text: "build a campaign", href: "/build-a-campaign" },
      { text: " or " },
      { text: "contact Collegiate Agency", href: "/contact" },
      { text: "." },
    ]),
  ];
}

/**
 * Card description. The challenge is copied from the study.
 * A sample keeps the same caveat already published in llms.txt.
 */
export function caseStudyBlurb(study: CaseStudy): string {
  const challenge = study.challenge.trim();
  if (!study.sample) return challenge;
  return `Industry example, not a verified client result. ${challenge}`;
}

export function contactLead(): CopyBlock {
  return p([
    { text: "Collegiate Agency is a " },
    { text: "college and campus marketing agency", href: "/about" },
    { text: ` based in ${siteConfig.contact.location}. Brands, in-house marketing teams, and agencies use this form to hire ` },
    { text: "campus events", href: "/services/events" },
    { text: ", " },
    { text: "brand ambassador programs", href: "/services/brand-ambassadors" },
    { text: ", and " },
    { text: "product placement", href: "/services/product-placement" },
    { text: " that reach college students." },
  ]);
}

function joinList(items: readonly string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

export function contactBody(): CopyBlock[] {
  const ranges = joinList(siteConfig.budgetRanges);
  return [
    h2("Who should get in touch"),
    p([
      {
        text: "This form is for a brand, that brand's marketing team, or an agency hiring Collegiate Agency. Students who want to join the ambassador network use the ",
      },
      { text: "ambassador application", href: "/become-an-ambassador" },
      { text: ", which is separate from this form." },
    ]),
    h2("What happens after you reach out"),
    p([
      {
        text: "Collegiate Agency replies within one business day with a tailored plan and firm pricing. The ",
      },
      { text: "pricing page", href: "/pricing" },
      { text: " publishes that same follow-up when a brand gets in touch or " },
      { text: "builds a campaign", href: "/build-a-campaign" },
      { text: "." },
    ]),
    h2("What to include in a brief"),
    p([
      {
        text: `Company and work email are required. Choose events, brand ambassadors, product placement, or more than one. In the message, say what the brand is launching and which campuses it is after. Budget choices on the form are ${ranges}. Phone is optional.`,
      },
    ]),
  ];
}

function speedStat(): { value: string; label: string } {
  const stat = siteConfig.stats.find((item) => item.key === "speedToActivation");
  if (!stat) throw new Error("Missing speedToActivation stat");
  return { value: stat.value, label: stat.label };
}

function eventPackagePhrase(): string {
  const amounts = publishedRate("events").match(/\$[\d,]+/g);
  if (!amounts || amounts.length < 2) {
    throw new Error("events pricing range must include a minimum and a maximum");
  }
  return `event packages from ${amounts[0]} to ${amounts[1]}`;
}

export function workFaqs(): ServiceFaq[] {
  const speed = speedStat();
  return [
    {
      question: "What campus campaigns do brands hire Collegiate Agency for?",
      answer:
        "Brands hire Collegiate Agency for campus events, brand ambassador programs, and product placement that reach college students. The cards on this page are the published write-ups for those channels, plus one industry example that is not a verified client result.",
    },
    {
      question: "What does a Collegiate Agency case study cover?",
      answer:
        "A Collegiate Agency case study covers the challenge, the approach, and the results already published on that card. One card is labeled an industry example and is not a verified client result.",
    },
    {
      question: "How does a brand start a similar campus campaign?",
      answer: `A brand that wants a program in this shape can build a campaign or contact Collegiate Agency. Collegiate Agency replies within one business day with a tailored plan and firm pricing, and it publishes ${speed.value} from a ${speed.label}. The events page says Collegiate Agency does not publish a fixed number of weeks from that reply to event day.`,
    },
    {
      question: "Where does Collegiate Agency run campus campaigns?",
      answer: `Collegiate Agency is based in ${siteConfig.contact.location}. The published network covers ${campusCount()} campuses, and a brand chooses schools from that list or names the campuses that matter.`,
    },
    {
      question: "How much does a campus campaign like these cost?",
      answer: `Collegiate Agency publishes ${publishedRate("brand-ambassadors")} for ambassadors, product placement at ${publishedRate("product-placement")}, and ${eventPackagePhrase()}. A brief the rate table does not cover is quoted per campaign.`,
    },
  ];
}

export function contactFaqs(): ServiceFaq[] {
  const ambassadors = publishedRate("brand-ambassadors");
  const placement = publishedRate("product-placement");
  const events = publishedRate("events");
  return [
    {
      question: "Who should contact Collegiate Agency?",
      answer:
        "Brands, in-house marketing teams, and agencies contact Collegiate Agency when they want campus events, a brand ambassador program, or product placement in front of college students.",
    },
    {
      question: "What happens after a brand contacts Collegiate Agency?",
      answer:
        "Collegiate Agency replies within one business day with a tailored plan and firm pricing. The pricing page states that same window for a contact or a campaign sent from the builder.",
    },
    {
      question: "What should a Collegiate Agency brief include?",
      answer:
        "A Collegiate Agency brief needs the company name and a work email, and it should name events, brand ambassadors, product placement, or more than one. It should also say what the brand is launching and which campuses matter.",
    },
    {
      question: "How much does a Collegiate Agency campus campaign cost?",
      answer: `Collegiate Agency publishes ${ambassadors} for ambassadors, product placement at ${placement}, and ${events.toLowerCase()} for events. A brief the rate table does not cover is quoted per campaign.`,
    },
  ];
}

export function buildFaqs(): ServiceFaq[] {
  const speed = speedStat();
  const ambassadors = publishedRate("brand-ambassadors");
  const placement = publishedRate("product-placement");
  return [
    {
      question: "How does Collegiate Agency price a campus marketing campaign?",
      answer: `The builder multiplies ${ambassadors} by the ambassador count and the months a brand sets, then adds ${placement} for each campus marked for product placement. Selected events add the lowest published fee for that inventory item, inside ${eventPackagePhrase()}. The on-screen total is a starting estimate, and firm pricing is the reply.`,
    },
    {
      question: "How long does a campus marketing campaign take to start?",
      answer: `Collegiate Agency replies within one business day with a tailored plan and firm pricing after a brand sends a campaign. Collegiate Agency publishes ${speed.value} from a ${speed.label}. The events page says Collegiate Agency does not publish a fixed number of weeks from that reply to event day.`,
    },
    {
      question: "What should a brand include in a campus marketing brief?",
      answer:
        "A brief needs the company name and a work email, and it should name campus events, brand ambassadors, product placement, or more than one. It should also say what the brand is launching, which campuses matter, and a target budget. The builder review step is where the brand edits that budget, adds notes, and sends the work email.",
    },
    {
      question: "Which services can a brand combine in one campus marketing campaign?",
      answer:
        "A brand can pick campus events, a brand ambassador program, product placement, or all three. Campuses appears when ambassadors or product placement is selected, and events appears when events are selected. Collegiate Agency prices each selected channel from the published rates.",
    },
    {
      question: "Who is the campus marketing campaign builder for?",
      answer:
        "Brands use this builder to hire Collegiate Agency for campus events, brand ambassadors, and product placement that reach college students. The on-screen total is a starting estimate, and firm pricing follows in the reply.",
    },
  ];
}

export function buildLead(): CopyBlock[] {
  return [
    p([
      { text: "Collegiate Agency is a " },
      { text: "college and campus marketing agency", href: "/about" },
      { text: ". Brands use this builder to pick " },
      { text: "campus events", href: "/services/events" },
      { text: ", a " },
      { text: "brand ambassador program", href: "/services/brand-ambassadors" },
      { text: ", and " },
      { text: "product placement", href: "/services/product-placement" },
      {
        text: ", then send a starting estimate. Collegiate Agency replies within one business day with a tailored plan and firm pricing.",
      },
    ]),
  ];
}

export function buildTable(): ArticleTableBlock {
  return {
    type: "table",
    caption: "Steps in the Collegiate Agency campaign builder",
    columns: ["Step", "What the brand does", "What it adds to the estimate"],
    rows: [
      [
        "Services",
        "Pick event sponsorships, product placement, ambassadors, or all three.",
        "Later steps follow the channels you pick.",
      ],
      [
        "Campuses",
        `Shown for ambassadors or product placement. Choose schools, set ambassador counts, turn placement on per campus, and set the months. The list is the published network of ${campusCount()} campuses.`,
        `${publishedRate("brand-ambassadors")} times the count and the months, plus ${publishedRate("product-placement")} for each campus marked.`,
      ],
      [
        "Events",
        "Shown when events are selected. Add events and trips from the builder list.",
        "Each selected item adds its minimum base fee.",
      ],
      [
        "Review",
        "Edit the target budget, add notes, and send a work email.",
        "The total is a starting estimate. Firm pricing comes in the reply.",
      ],
    ],
  };
}

export function buildStepsIntro(): CopyBlock[] {
  return [
    h2("What the builder walks through"),
    p([
      {
        text: "Services is first. Campuses appears when ambassadors or product placement is selected. Events appears when events are selected. Review is always last. The on-screen total is a starting estimate from the published rates. Firm pricing is the reply, not that total.",
      },
    ]),
  ];
}

export function buildGets(): CopyBlock[] {
  return [
    h2("What a brand gets"),
    p([
      {
        text: `The estimate multiplies ${publishedRate("brand-ambassadors")} by the ambassador count and the months the brand sets, then adds ${publishedRate("product-placement")} for each campus marked for product placement. Selected events add the lowest published fee for that inventory item. Read the channel pages linked above, and the `,
      },
      { text: "pricing page", href: "/pricing" },
      { text: ", for the rates those steps use. The " },
      { text: "about page", href: "/about" },
      { text: " describes who brands hire." },
    ]),
  ];
}

export function blocksText(blocks: CopyBlock[]): string {
  return blocks
    .map((block) => (block.type === "h2" ? block.text : block.parts.map((part) => part.text).join("")))
    .join("\n");
}

function tableText(block: ArticleTableBlock): string {
  const cells = [block.caption ?? "", ...block.columns, ...block.rows.flat()];
  return cells.join("\n").replace(/<[^>]+>/g, " ");
}

export function countWords(text: string): number {
  return text
    .replace(/<[^>]+>/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}

export function workIndexableText(): string {
  const cards = caseStudies.map((study) => `${study.headline}\n${caseStudyBlurb(study)}`).join("\n");
  const faqs = workFaqs()
    .map((item) => `${item.question}\n${item.answer}`)
    .join("\n");
  return [WORK_H1, blocksText(workIntro()), cards, WORK_FAQ_TITLE, faqs].join("\n");
}

export function contactIndexableText(): string {
  const faqs = contactFaqs()
    .map((item) => `${item.question}\n${item.answer}`)
    .join("\n");
  return [CONTACT_H1, blocksText([contactLead()]), blocksText(contactBody()), CONTACT_FAQ_TITLE, faqs].join("\n");
}

export function buildIndexableText(): string {
  const faqs = buildFaqs()
    .map((item) => `${item.question}\n${item.answer}`)
    .join("\n");
  return [
    BUILD_H1,
    blocksText(buildLead()),
    blocksText(buildStepsIntro()),
    tableText(buildTable()),
    blocksText(buildGets()),
    BUILD_FAQ_TITLE,
    faqs,
  ].join("\n");
}

export function hrefsIn(blocks: CopyBlock[]): string[] {
  return blocks.flatMap((block) => (block.type === "p" ? block.parts.filter((part) => part.href).map((part) => part.href!) : []));
}

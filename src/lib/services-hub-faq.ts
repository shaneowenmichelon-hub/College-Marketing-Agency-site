import { faqAnswerPlainText } from "@/lib/article-faq";
import { getPost } from "@/lib/content";
import { publishedRate } from "@/lib/pricing-page";
import { faqPageStructuredData, type ServiceFaq, type ServiceReading } from "@/lib/service-faqs";
import { getStat, siteConfig } from "@/site.config";

/**
 * Services hub FAQ. One list feeds the visible block and the FAQPage JSON-LD
 * on /services. Every figure is read from `site.config` or `pricing`. Do not
 * add a stat, a client, a review, a result, a phone number, or a street address.
 * The contact email and Organization sameAs stay out of these answers.
 * Student recruiting stays in the #for-students section, not in this copy.
 */

const ALLOWED_HREF =
  /^\/(services\/events|services\/brand-ambassadors|services\/product-placement|pricing|build-a-campaign|contact)$/;

const GUIDE_LINKS = [
  { slug: "college-marketing-agency", anchor: "college marketing agency guide" },
  { slug: "campus-marketing-agency-rfp", anchor: "campus marketing agency RFP" },
  { slug: "campus-brand-activation-agency", anchor: "campus brand activation agency checklist" },
  { slug: "college-brand-ambassador-program", anchor: "college brand ambassador program guide" },
] as const;

function campusCount(): string {
  const listed = String(siteConfig.campuses.length);
  const published = getStat("campuses");
  if (published !== listed) {
    throw new Error(`Campus stat ${published} does not match the campus list ${listed}`);
  }
  return published;
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

function sentences(answer: string): string[] {
  return answer
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function assertServicesHubFaqs(items: ServiceFaq[]) {
  if (items.length < 5 || items.length > 7) {
    throw new Error("services hub FAQ must include 5 to 7 questions");
  }
  const seen = new Set<string>();
  for (const item of items) {
    if (!item.question.trim() || seen.has(item.question)) {
      throw new Error(`services hub FAQ has a blank or duplicate question: ${item.question}`);
    }
    seen.add(item.question);
    const plain = faqAnswerPlainText(item.answer);
    if (!plain.includes(siteConfig.companyName)) {
      throw new Error(`services hub FAQ answer must name ${siteConfig.companyName}: ${item.question}`);
    }
    const count = sentences(plain).length;
    if (count < 1 || count > 3) {
      throw new Error(`services hub FAQ answer must be 1 to 3 sentences (${count}): ${item.question}`);
    }
    if (/intern|zmmevents|zmm\.events|SOS Consultants|Celsius|@/i.test(plain)) {
      throw new Error(`services hub FAQ answer includes a fact that is not allowed here: ${item.question}`);
    }
    if (/become-an-ambassador|agency for students/i.test(plain)) {
      throw new Error(`services hub FAQ answer recruits students: ${item.question}`);
    }
    for (const match of item.answer.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
      if (match[1].trim().length < 4) {
        throw new Error(`services hub FAQ anchor is too short: ${match[1]}`);
      }
      if (!ALLOWED_HREF.test(match[2])) {
        throw new Error(`services hub FAQ link is not an allowed URL: ${match[2]}`);
      }
    }
  }
  const data = faqPageStructuredData(items, "/services");
  const parsed = JSON.parse(JSON.stringify(data)) as {
    "@type": string;
    url: string;
    mainEntity: { name: string; acceptedAnswer: { text: string } }[];
  };
  if (
    parsed["@type"] !== "FAQPage" ||
    parsed.url !== `${siteConfig.url}/services` ||
    parsed.mainEntity.length !== items.length
  ) {
    throw new Error("services hub FAQPage JSON-LD is not well formed");
  }
  parsed.mainEntity.forEach((entity, index) => {
    if (entity.name !== items[index].question || entity.acceptedAnswer.text !== faqAnswerPlainText(items[index].answer)) {
      throw new Error("services hub FAQPage JSON-LD does not match the visible FAQ");
    }
  });
}

export function servicesHubFaqs(): ServiceFaq[] {
  const ambassadors = getStat("ambassadors");
  const campuses = campusCount();
  const speed = speedStat();
  const ambassadorRate = publishedRate("brand-ambassadors");
  const placementRate = publishedRate("product-placement");
  const faqs: ServiceFaq[] = [
    {
      question: "What is a campus marketing agency?",
      answer: `${siteConfig.companyName} is a campus marketing agency brands hire for campus events, brand ambassador programs, and product placement. College students are the audience of the programs brands hire. The people who run ${siteConfig.companyName} are the operators, and the ambassador roster is the network a brand hires the agency to field.`,
    },
    {
      question: "What does Collegiate Agency offer as a campus marketing agency?",
      answer: `${siteConfig.companyName} offers [campus events and activations](/services/events), a vetted [brand ambassador](/services/brand-ambassadors) network of ${ambassadors} student ambassadors, and [Greek-life product placement](/services/product-placement). A brand can run one channel or stack them. Published rates for each channel are on the [pricing](/pricing) page.`,
    },
    {
      question: "How much does a Collegiate Agency campus campaign cost?",
      answer: `${siteConfig.companyName} publishes ${ambassadorRate} for ambassadors, product placement at ${placementRate}, and ${eventPackagePhrase()}. A brief the rate table does not cover is quoted per campaign. A brand can compare those rates on the [pricing](/pricing) page or [build a campaign](/build-a-campaign).`,
    },
    {
      question: "How fast can Collegiate Agency launch campus marketing?",
      answer: `${siteConfig.companyName} publishes ${speed.value} from a ${speed.label}. ${siteConfig.companyName} replies within one business day with a tailored plan and firm pricing after a brand [gets in touch](/contact) or [builds a campaign](/build-a-campaign).`,
    },
    {
      question: "Where does Collegiate Agency run campus marketing?",
      answer: `${siteConfig.companyName} is based in ${siteConfig.contact.location}. The published network covers ${campuses} campuses, and a brand chooses schools from that list or names the campuses that matter.`,
    },
    {
      question: "Who hires a campus marketing agency?",
      answer: `Brands, in-house marketing teams, and agencies hire ${siteConfig.companyName} when they want campus events, a brand ambassador program, or product placement in front of college students. A brand ready to start uses the [contact](/contact) form.`,
    },
  ];
  assertServicesHubFaqs(faqs);
  return faqs;
}

function guideLink(slug: string, anchor: string): { text: string; href: string } {
  const post = getPost(slug);
  if (!post) throw new Error(`Missing insight for services hub link: ${slug}`);
  return { text: anchor, href: `/insights/${slug}` };
}

/** Related guides and channel links rendered on the brands section, above the FAQ. */
export function servicesHubReading(): ServiceReading {
  const guides = GUIDE_LINKS.map((guide) => guideLink(guide.slug, guide.anchor));
  return {
    title: "Guides for brands hiring a campus marketing agency.",
    blocks: [
      {
        parts: [
          { text: "Brands comparing a campus marketing agency can read the " },
          guides[0],
          { text: ", the " },
          guides[1],
          { text: ", the " },
          guides[2],
          { text: ", and the " },
          guides[3],
          { text: "." },
        ],
      },
      {
        parts: [
          { text: "The channels on this page are " },
          { text: "campus events", href: "/services/events" },
          { text: ", " },
          { text: "brand ambassadors", href: "/services/brand-ambassadors" },
          { text: ", and " },
          { text: "product placement", href: "/services/product-placement" },
          { text: ". Published rates are on the " },
          { text: "pricing", href: "/pricing" },
          { text: " page. Then " },
          { text: "build a campaign", href: "/build-a-campaign" },
          { text: " or " },
          { text: "contact Collegiate Agency", href: "/contact" },
          { text: "." },
        ],
      },
    ],
  };
}

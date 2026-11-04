import { faqAnswerPlainText } from "@/lib/article-faq";
import { publishedRate } from "@/lib/pricing-page";
import { faqPageStructuredData, type ServiceFaq } from "@/lib/service-faqs";
import { getStat, siteConfig } from "@/site.config";

/**
 * Homepage FAQ. One list feeds the visible block and the FAQPage JSON-LD.
 * Every figure is read from `site.config` or `pricing`. Do not add a stat,
 * a client, a review, a result, a phone number, or a street address.
 * The contact email and Organization sameAs stay out of these answers.
 */

const ALLOWED_HREF =
  /^\/(services|services\/events|services\/brand-ambassadors|services\/product-placement|pricing|contact|become-an-ambassador)$/;

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

function assertHomeFaqs(items: ServiceFaq[]) {
  if (items.length < 5 || items.length > 7) {
    throw new Error("homepage FAQ must include 5 to 7 questions");
  }
  const seen = new Set<string>();
  for (const item of items) {
    if (!item.question.trim() || seen.has(item.question)) {
      throw new Error(`homepage FAQ has a blank or duplicate question: ${item.question}`);
    }
    seen.add(item.question);
    const plain = faqAnswerPlainText(item.answer);
    if (!plain.includes(siteConfig.companyName)) {
      throw new Error(`homepage FAQ answer must name ${siteConfig.companyName}: ${item.question}`);
    }
    const count = sentences(plain).length;
    if (count < 1 || count > 3) {
      throw new Error(`homepage FAQ answer must be 1 to 3 sentences (${count}): ${item.question}`);
    }
    if (/intern|zmmevents|zmm\.events|SOS Consultants|Celsius|@/i.test(plain)) {
      throw new Error(`homepage FAQ answer includes a fact that is not allowed here: ${item.question}`);
    }
    for (const match of item.answer.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
      if (match[1].trim().length < 4) {
        throw new Error(`homepage FAQ anchor is too short: ${match[1]}`);
      }
      if (!ALLOWED_HREF.test(match[2])) {
        throw new Error(`homepage FAQ link is not an allowed URL: ${match[2]}`);
      }
    }
  }
  const data = faqPageStructuredData(items, "/");
  const parsed = JSON.parse(JSON.stringify(data)) as {
    "@type": string;
    url: string;
    mainEntity: { name: string; acceptedAnswer: { text: string } }[];
  };
  if (parsed["@type"] !== "FAQPage" || parsed.url !== siteConfig.url || parsed.mainEntity.length !== items.length) {
    throw new Error("homepage FAQPage JSON-LD is not well formed");
  }
  parsed.mainEntity.forEach((entity, index) => {
    if (entity.name !== items[index].question || entity.acceptedAnswer.text !== faqAnswerPlainText(items[index].answer)) {
      throw new Error("homepage FAQPage JSON-LD does not match the visible FAQ");
    }
  });
}

export function homeFaqs(): ServiceFaq[] {
  const ambassadors = getStat("ambassadors");
  const campuses = campusCount();
  const speed = speedStat();
  const ambassadorRate = publishedRate("brand-ambassadors");
  const placementRate = publishedRate("product-placement");
  const faqs: ServiceFaq[] = [
    {
      question: "What is Collegiate Agency?",
      answer: `${siteConfig.companyName} is a college and campus marketing agency brands hire for campus events, brand ambassador programs, and product placement. Students are the audience of the programs brands hire. The people who run ${siteConfig.companyName} are the operators, and the ambassador roster is the network a brand hires the agency to field.`,
    },
    {
      question: "What services does Collegiate Agency offer?",
      answer: `${siteConfig.companyName} offers [campus events and activations](/services/events), a vetted [brand ambassador](/services/brand-ambassadors) network of ${ambassadors} student ambassadors, and [Greek-life product placement](/services/product-placement). A brand can run one channel or stack them. The three channels sit together on the [services](/services) page.`,
    },
    {
      question: "How much does a Collegiate Agency campaign cost?",
      answer: `${siteConfig.companyName} publishes ${ambassadorRate} for ambassadors, product placement at ${placementRate}, and ${eventPackagePhrase()}. A brief the rate table does not cover is quoted per campaign. Those rates are on the [pricing](/pricing) page.`,
    },
    {
      question: "How fast can Collegiate Agency launch a campus campaign?",
      answer: `${siteConfig.companyName} publishes ${speed.value} from a ${speed.label}. ${siteConfig.companyName} replies within one business day with a tailored plan and firm pricing after a brand gets in touch or sends a campaign.`,
    },
    {
      question: "Where does Collegiate Agency operate?",
      answer: `${siteConfig.companyName} is based in ${siteConfig.contact.location}. The published network covers ${campuses} campuses, and a brand chooses schools from that list or names the campuses that matter.`,
    },
    {
      question: "Who is Collegiate Agency for?",
      answer: `Brands, in-house marketing teams, and agencies contact ${siteConfig.companyName} when they want campus events, a brand ambassador program, or product placement in front of college students. Students who want to join the ambassador network use the [ambassador application](/become-an-ambassador), which is separate from the [contact](/contact) form.`,
    },
  ];
  assertHomeFaqs(faqs);
  return faqs;
}

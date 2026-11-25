import { faqAnswerPlainText } from "@/lib/article-faq";
import { publishedRate } from "@/lib/pricing-page";
import { faqPageStructuredData, type ServiceFaq } from "@/lib/service-faqs";
import { insightTopicPath, insightTopics } from "@/lib/insight-topics";
import { getStat, siteConfig } from "@/site.config";

/**
 * Visible FAQ copy for /insights/topics/<slug>. One list feeds ServiceFaq and
 * FAQPage JSON-LD. Every figure is read from site.config, pricing, or a line
 * already published on a service page. Do not add a stat, a client, a result,
 * a review, a phone number, or a street address.
 */

const ALLOWED_HREF =
  /^\/(services|services\/events|services\/brand-ambassadors|services\/product-placement|pricing|contact|build-a-campaign|work|about)$/;

function campusCount(): string {
  const listed = String(siteConfig.campuses.length);
  const published = getStat("campuses");
  if (published !== listed) {
    throw new Error(`Campus stat ${published} does not match the campus list ${listed}`);
  }
  return published;
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

function assertTopicFaqs(slug: string, items: ServiceFaq[]) {
  if (items.length < 4 || items.length > 5) {
    throw new Error(`${slug} hub FAQ must include 4 or 5 questions`);
  }
  const seen = new Set<string>();
  for (const item of items) {
    if (!item.question.trim() || seen.has(item.question)) {
      throw new Error(`${slug} hub FAQ has a blank or duplicate question`);
    }
    seen.add(item.question);
    const plain = faqAnswerPlainText(item.answer);
    if (!plain.includes(siteConfig.companyName)) {
      throw new Error(`${slug} hub FAQ answer must name ${siteConfig.companyName}: ${item.question}`);
    }
    const count = sentences(plain).length;
    if (count < 1 || count > 3) {
      throw new Error(`${slug} hub FAQ answer must be 1 to 3 sentences (${count}): ${item.question}`);
    }
    if (/intern|agency for students|zmmevents|@|how to market to gen z/i.test(`${item.question} ${plain}`)) {
      throw new Error(`${slug} hub FAQ includes a disallowed phrase: ${item.question}`);
    }
    if (plain.includes("\u2014")) {
      throw new Error(`${slug} hub FAQ answer includes an em dash: ${item.question}`);
    }
    for (const match of item.answer.matchAll(/\[([^\]]+)\]\(([^)\s]+)\)/g)) {
      if (match[1].trim().length < 4) {
        throw new Error(`${slug} hub FAQ anchor is too short: ${match[1]}`);
      }
      if (!ALLOWED_HREF.test(match[2])) {
        throw new Error(`${slug} hub FAQ link is not an allowed URL: ${match[2]}`);
      }
    }
  }
  const data = faqPageStructuredData(items, insightTopicPath(slug));
  const parsed = JSON.parse(JSON.stringify(data)) as {
    "@type": string;
    mainEntity: { name: string; acceptedAnswer: { text: string } }[];
  };
  if (parsed["@type"] !== "FAQPage" || parsed.mainEntity.length !== items.length) {
    throw new Error(`${slug} hub FAQPage JSON-LD is not well formed`);
  }
  parsed.mainEntity.forEach((entity, index) => {
    if (entity.name !== items[index].question || entity.acceptedAnswer.text !== faqAnswerPlainText(items[index].answer)) {
      throw new Error(`${slug} hub FAQPage JSON-LD does not match the visible FAQ`);
    }
  });
}

function placeAnswer(): string {
  const campuses = campusCount();
  return `${siteConfig.companyName} is based in ${siteConfig.contact.location}. The published network covers ${campuses} campuses, and a brand chooses schools from that list or names the campuses that matter.`;
}

function replyAnswer(): string {
  return `${siteConfig.companyName} replies within one business day with a tailored plan and firm pricing after a brand [gets in touch](/contact) or [builds a campaign](/build-a-campaign).`;
}

const FAQ_TITLES: Record<string, string> = {
  "campus-events-and-activations": "Questions brands ask about campus activations.",
  "student-influencers": "Questions brands ask about campus influencers.",
};

function faqsFor(slug: string): ServiceFaq[] {
  const campuses = campusCount();
  const ambassadorRate = publishedRate("brand-ambassadors");
  const noFixedWeeks =
    "Collegiate Agency does not publish a fixed number of weeks from that reply to event day.";

  if (slug === "campus-events-and-activations") {
    return [
      {
        question: "What are campus activations?",
        answer: `Campus activations are live moments brands hire ${siteConfig.companyName} to plan, staff, and run where college students already gather. These guides cover field plans, staffing, welcome week, accessibility, and what to settle before a brand approves the work.`,
      },
      {
        question: "What is an on-campus activation?",
        answer: `An on-campus activation is a campus activation brands hire ${siteConfig.companyName} to place on a college campus. The published network covers ${campuses} campuses, and a brand chooses markets in the [campaign builder](/build-a-campaign) or names the campuses that matter.`,
      },
      {
        question: "What is college event marketing?",
        answer: `College event marketing is the campus event work brands hire ${siteConfig.companyName} to plan, staff, and run, from the first permit to the post-event recap. ${siteConfig.companyName} replies within one business day with a tailored plan and firm pricing, and it does not publish a fixed number of weeks from that reply to event day.`,
      },
      {
        question: "How much does a campus activation cost?",
        answer: `${siteConfig.companyName} prices campus events as ${eventPackagePhrase()}, from single activations to full presenting sponsorships. A package the [events](/services/events) page does not list is quoted per campaign.`,
      },
      {
        question: "How does a brand start a campus activation?",
        answer: `${siteConfig.companyName} replies within one business day with a tailored plan and firm pricing after a brand [builds a campaign](/build-a-campaign) or [gets in touch](/contact). ${noFixedWeeks}`,
      },
    ];
  }

  if (slug === "student-influencers") {
    return [
      {
        question: "What are campus influencers?",
        answer: `Campus influencers are student creators tied to a target school, not a national lifestyle audience. ${siteConfig.companyName} treats campus fit, the brief, and a recap as one program brands hire to reach college students.`,
      },
      {
        question: "What is student influencer marketing?",
        answer: `Student influencer marketing, in these guides, is how a brand finds campus creators, briefs them, and ties their content to a campus moment. ${siteConfig.companyName} is the college marketing agency brands hire to run that work for college students, and a creator job the published rates do not cover is quoted per campaign.`,
      },
      {
        question: "How should a brand hire campus creators?",
        answer: `Brands hire ${siteConfig.companyName} to vet campus creators for school fit and to tie their content to a live campus moment, including [campus events](/services/events) or a [brand ambassador program](/services/brand-ambassadors). ${replyAnswer()}`,
      },
      {
        question: "How much does student influencer marketing cost?",
        answer: `${siteConfig.companyName} does not publish a separate rate for student influencer marketing. A creator job the published rates do not cover is quoted per campaign, and the ambassador program is ${ambassadorRate} when that is the job.`,
      },
      {
        question: "Where does Collegiate Agency run campus influencer programs?",
        answer: placeAnswer(),
      },
    ];
  }

  throw new Error(`No hub FAQ for ${slug}`);
}

export function insightTopicFaqTitle(slug: string): string {
  const title = FAQ_TITLES[slug];
  if (!title) throw new Error(`No hub FAQ title for ${slug}`);
  return title;
}

export function insightTopicFaqs(slug: string): ServiceFaq[] {
  const items = faqsFor(slug);
  assertTopicFaqs(slug, items);
  return items;
}

/** Load every hub FAQ at import so a bad answer fails the build. */
for (const topic of insightTopics) {
  insightTopicFaqs(topic.slug);
}

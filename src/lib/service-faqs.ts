import { getCaseStudy, getPost } from "@/lib/content";
import { getStat, pricing, siteConfig } from "@/site.config";

/**
 * Visible FAQ copy and FAQPage JSON-LD for the two service detail pages.
 * One list feeds both. Every answer has to stay inside facts already published
 * in this repo: service-page copy, `pricing` and campus stats in site.config,
 * the campaign builder, and the approach text on the two real case studies.
 * Do not add stats, client results, review quotes, or a launch-week count.
 */

export type ServiceSlug = "events" | "brand-ambassadors";

export type ServiceFaq = {
  question: string;
  answer: string;
};

export type ServiceReadingPart = {
  text: string;
  href?: string;
};

export type ServiceReading = {
  title: string;
  blocks: { parts: ServiceReadingPart[] }[];
};

export type ServicePageSeo = {
  faqs: ServiceFaq[];
  faqTitle: string;
  reading: ServiceReading;
};

function sentences(answer: string): string[] {
  return answer
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function ambassadorRate(): string {
  const price = pricing["brand-ambassadors"];
  return `${price.range} ${price.unit}`.replace(/\s+/g, " ").trim();
}

function eventPackageBounds(): { min: string; max: string } {
  const amounts = pricing.events.range.match(/\$[\d,]+/g);
  if (!amounts || amounts.length < 2) {
    throw new Error("events pricing range must include a minimum and a maximum");
  }
  return { min: amounts[0], max: amounts[1] };
}

function articleLink(slug: string): ServiceReadingPart {
  const post = getPost(slug);
  if (!post) throw new Error(`Missing insight for service-page link: ${slug}`);
  return { text: post.title, href: `/insights/${slug}` };
}

function publishedApproach(slug: string): string {
  const study = getCaseStudy(slug);
  if (!study || study.sample || !study.approach.trim()) {
    throw new Error(`Missing published case study: ${slug}`);
  }
  return study.approach.trim();
}

function brandAmbassadorFaqs(): ServiceFaq[] {
  const campuses = getStat("campuses");
  const rate = ambassadorRate();
  return [
    {
      question: "What does a Collegiate Agency campus brand ambassador program include?",
      answer:
        "Collegiate Agency's campus brand ambassador program is a vetted student rep network for sampling, flyering, friend-group product distribution, tabling, pop-ups, and twice-monthly Instagram and TikTok stories to real peers, with links and brand tags. Collegiate Agency recruits, screens, trains, and manages the roster, including proof, content, and reporting.",
    },
    {
      question: "How does Collegiate Agency choose campuses and ambassadors?",
      answer: `Collegiate Agency sources campus leaders who match the target schools and audience a brand names, then screens them for reliability, campus fit, and the ability to represent the brand cleanly. In the campaign builder, a brand chooses schools from the published network of ${campuses} campuses and sets how many ambassadors it wants at each school.`,
    },
    {
      question: "How does Collegiate Agency train campus brand ambassadors?",
      answer:
        "Collegiate Agency briefs ambassadors on deliverables, links, tags, talking points, and campus execution before they represent the brand. Collegiate Agency then manages the roster, proof, content, and reporting.",
    },
    {
      question: "How does Collegiate Agency report ambassador program results?",
      answer:
        "Collegiate Agency manages proof, content, and reporting so the ambassador program actually runs. Reporting stays with Collegiate Agency after the roster is recruited, screened, and trained.",
    },
    {
      question: "How much does a Collegiate Agency brand ambassador program cost?",
      answer: `Collegiate Agency prices the ambassador program at ${rate}. That rate includes 2 dedicated social posts (flyers or videos) with links and brand tags, and localized paid media and product placement are add-ons. Collegiate Agency confirms final pricing after a brand sends a campaign.`,
    },
    {
      question: "How long does it take Collegiate Agency to launch a brand ambassador program?",
      answer:
        "Collegiate Agency replies within one business day with a tailored plan and firm pricing after a brand sends a campaign. The program then moves through recruit, screen, train, and manage, and Collegiate Agency prices that work per ambassador per month for the length the brand sets in the campaign builder.",
    },
  ];
}

function eventFaqs(): ServiceFaq[] {
  const campuses = getStat("campuses");
  const { min, max } = eventPackageBounds();
  return [
    {
      question: "What does a Collegiate Agency campus event activation include?",
      answer:
        "Collegiate Agency plans, staffs, and runs a campus activation from the first permit to the post-event recap, covering logistics, permits, product, and the people on the ground. Formats include Welcome Week takeovers, tailgates and sampling, pop-ups, Greek and student-club sponsorships, product sampling, experiential moments, and custom builds. Collegiate Agency hands back the captured assets and a results recap.",
    },
    {
      question: "How does Collegiate Agency choose campuses for an event?",
      answer: `Collegiate Agency aligns on the goal, the audience, and a concept that fits the campus, then places the activation where students already gather, including move-in, game day, finals, and the first warm week of spring. The published network covers ${campuses} campuses, and a brand chooses markets in the campaign builder or tells Collegiate Agency the campuses that matter. Welcome Week is the busiest two weeks of the year, and Collegiate Agency runs takeovers in that window.`,
    },
    {
      question: "How does Collegiate Agency report campus event results?",
      answer:
        "Collegiate Agency captures content throughout the activation and hands the brand the assets plus a results recap. The published steps are scope and concept, permits and logistics, staff and execute, then capture and report.",
    },
    {
      question: "How much does a Collegiate Agency campus event cost?",
      answer: `Collegiate Agency prices campus events as packages from ${min} to ${max}, from single activations to full presenting sponsorships. The events page includes a menu of campus events, festivals, and venue partnerships so a brand can compare audience, pricing, and value. Collegiate Agency scopes the exact package around the brand's goals and confirms final pricing.`,
    },
    {
      question: "How long does it take Collegiate Agency to launch a campus event?",
      answer:
        "Collegiate Agency replies within one business day with a tailored plan and firm pricing after a brand sends a campaign. The activation then moves through scope and concept, permits and logistics, on-site staffing and execution, and a results recap. Collegiate Agency does not publish a fixed number of weeks from that reply to event day.",
    },
    {
      question: "Who staffs a Collegiate Agency campus activation?",
      answer:
        "Trained student staff run a Collegiate Agency campus activation on the ground, on-brand and on-time. Collegiate Agency handles approvals, vendors, product, and site logistics, and stays with the activation through the recap.",
    },
  ];
}

function brandAmbassadorReading(): ServiceReading {
  const sosApproach = publishedApproach("sos-consultants-nola-campus-leasing-ambassadors");
  return {
    title: "A campus brand ambassador program, run by Collegiate Agency.",
    blocks: [
      {
        parts: [
          {
            text: `${siteConfig.definition} This program is the managed student network brands hire for campus: reps sample, flyer, distribute product through friend groups, staff tables, support pop-ups, and post twice a month on Instagram and TikTok stories to real peers. Collegiate Agency recruits against the schools a brand wants, screens for reliability and campus fit, trains the deliverables, and manages proof, content, and reporting.`,
          },
        ],
      },
      {
        parts: [
          { text: `The published rate is ${ambassadorRate()}. The ` },
          {
            text: "SOS Consultants Nola case study",
            href: "/work/sos-consultants-nola-campus-leasing-ambassadors",
          },
          { text: ` states what Collegiate Agency ran: ${sosApproach} Read ` },
          articleLink("college-brand-ambassador-program"),
          { text: " and " },
          articleLink("college-brand-ambassadors"),
          { text: ". Then " },
          { text: "build a campaign", href: "/build-a-campaign" },
          { text: " or " },
          { text: "contact Collegiate Agency", href: "/contact" },
          { text: "." },
        ],
      },
    ],
  };
}

function eventReading(): ServiceReading {
  const nutrlApproach = publishedApproach("nutrl-night-school-tour-product-placement");
  const { min, max } = eventPackageBounds();
  return {
    title: "A campus event activation, run by Collegiate Agency.",
    blocks: [
      {
        parts: [
          {
            text: `${siteConfig.definition} Campus events are planned, staffed, and executed by Collegiate Agency from the first permit to the post-event recap, including logistics, permits, product, and the people on the ground. Formats include Welcome Week takeovers, tailgates and sampling, pop-ups, Greek and student-club sponsorships, product sampling, experiential moments, and custom builds.`,
          },
        ],
      },
      {
        parts: [
          {
            text: `Collegiate Agency prices events as packages from ${min} to ${max}, from single activations to full presenting sponsorships. The sponsorship inventory on this page is a menu of campus events, festivals, and venue partnerships a brand can compare on audience, pricing, and value. The `,
          },
          {
            text: "NÜTRL Night School Tour case study",
            href: "/work/nutrl-night-school-tour-product-placement",
          },
          { text: ` states what Collegiate Agency ran: ${nutrlApproach} See ` },
          articleLink("university-activations"),
          { text: ", " },
          articleLink("college-event-sponsorship"),
          { text: ", and " },
          articleLink("campus-brand-activation-agency"),
          { text: ". Then " },
          { text: "build a campaign", href: "/build-a-campaign" },
          { text: " or " },
          { text: "contact Collegiate Agency", href: "/contact" },
          { text: "." },
        ],
      },
    ],
  };
}

/** FAQPage node. `items` is the same array the page renders. */
export function faqPageStructuredData(
  items: ServiceFaq[],
  path: string,
): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${siteConfig.url}${path}#faq`,
    url: `${siteConfig.url}${path}`,
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

function assertQuotableFaqs(items: ServiceFaq[], label: string) {
  if (items.length < 5 || items.length > 7) {
    throw new Error(`${label} FAQ must include 5 to 7 questions`);
  }
  const seen = new Set<string>();
  for (const item of items) {
    if (!item.question.trim() || seen.has(item.question)) {
      throw new Error(`${label} has a blank or duplicate question`);
    }
    seen.add(item.question);
    if (!item.answer.includes(siteConfig.companyName)) {
      throw new Error(`${label} answer must name ${siteConfig.companyName}: ${item.question}`);
    }
    const count = sentences(item.answer).length;
    if (count < 1 || count > 3) {
      throw new Error(`${label} answer must be 1 to 3 sentences (${count}): ${item.question}`);
    }
  }
}

export function servicePageSeo(slug: ServiceSlug): ServicePageSeo {
  const faqs = slug === "events" ? eventFaqs() : brandAmbassadorFaqs();
  const reading = slug === "events" ? eventReading() : brandAmbassadorReading();
  assertQuotableFaqs(faqs, slug);
  const path = `/services/${slug}`;
  const data = faqPageStructuredData(faqs, path);
  const parsed = JSON.parse(JSON.stringify(data)) as {
    "@type": string;
    mainEntity: { name: string; acceptedAnswer: { text: string } }[];
  };
  if (parsed["@type"] !== "FAQPage" || parsed.mainEntity.length !== faqs.length) {
    throw new Error(`${slug} FAQPage JSON-LD is not well formed`);
  }
  parsed.mainEntity.forEach((entity, index) => {
    if (entity.name !== faqs[index].question || entity.acceptedAnswer.text !== faqs[index].answer) {
      throw new Error(`${slug} FAQPage JSON-LD does not match the visible FAQ`);
    }
  });
  return {
    faqs,
    faqTitle:
      slug === "events"
        ? "Questions brands ask about campus events."
        : "Questions brands ask about campus brand ambassadors.",
    reading,
  };
}

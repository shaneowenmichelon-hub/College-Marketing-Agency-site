/**
 * Article FAQs. One list in MDX frontmatter feeds the visible block and the
 * FAQPage JSON-LD. Answers may contain markdown links; the schema uses the
 * same words with the URL removed, so the visible text and the structured
 * data stay identical.
 */

export type ArticleFaq = {
  question: string;
  answer: string;
};

const ALLOWED_FAQ_HREF =
  /^\/(pricing|contact|services\/events|services\/brand-ambassadors|services\/product-placement)$/;

function faqLinkPattern(): RegExp {
  return /\[([^\]]+)\]\(([^)\s]+)\)/g;
}

/** Visible answer text. Markdown links collapse to their anchor words. */
export function faqAnswerPlainText(answer: string): string {
  return answer.replace(faqLinkPattern(), "$1").replace(/\s+/g, " ").trim();
}

export function articleFaqSchemaItems(faqs: ArticleFaq[]): ArticleFaq[] {
  return faqs.map((item) => ({
    question: item.question,
    answer: faqAnswerPlainText(item.answer),
  }));
}

/** Fail the build if a published article FAQ drifts out of the quotable range. */
export function assertArticleFaqs(slug: string, faqs: ArticleFaq[] | undefined): void {
  if (!faqs?.length) return;
  if (faqs.length < 3 || faqs.length > 5) {
    throw new Error(`${slug} FAQ must include 3 to 5 questions`);
  }
  const seen = new Set<string>();
  for (const item of faqs) {
    if (!item.question.trim() || seen.has(item.question)) {
      throw new Error(`${slug} has a blank or duplicate FAQ question`);
    }
    seen.add(item.question);
    const plain = faqAnswerPlainText(item.answer);
    if (!plain.includes("Collegiate Agency")) {
      throw new Error(`${slug} FAQ answer must name Collegiate Agency: ${item.question}`);
    }
    const words = plain.split(/\s+/).filter(Boolean);
    if (words.length < 40 || words.length > 80) {
      throw new Error(
        `${slug} FAQ answer must be 40 to 80 words (${words.length}): ${item.question}`,
      );
    }
    for (const match of item.answer.matchAll(faqLinkPattern())) {
      const anchor = match[1].trim();
      const href = match[2];
      if (anchor.length < 4) {
        throw new Error(`${slug} FAQ anchor is too short: ${anchor}`);
      }
      if (!ALLOWED_FAQ_HREF.test(href)) {
        throw new Error(`${slug} FAQ link is not an allowed commercial URL: ${href}`);
      }
    }
  }
}

import { siteConfig } from "@/site.config";
import { posts, type ArticleBlock } from "@/lib/content";
import { faqAnswerPlainText } from "@/lib/article-faq";
import { resolveArticleAuthor } from "@/lib/seo";

export const dynamic = "force-static";

/**
 * /llms-full.txt — the article library in plain text.
 * /llms.txt stays a short map. This file is the same articles with the body
 * a model can quote, generated from the pages so it cannot drift.
 */

function plainHtml(html: string): string {
  return html
    .replace(/<a\b[^>]*>([\s\S]*?)<\/a>/gi, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

function blockText(block: ArticleBlock): string {
  if (block.type === "h2") return `## ${block.text}`;
  if (block.type === "p") return plainHtml(block.html);
  if (block.type === "ul" || block.type === "ol") {
    return block.items.map((item) => `- ${plainHtml(item)}`).join("\n");
  }
  if (block.type === "table") {
    const caption = block.caption ? `${plainHtml(block.caption)}\n` : "";
    const header = block.columns.map(plainHtml).join(" | ");
    const rows = block.rows.map((row) => row.map(plainHtml).join(" | ")).join("\n");
    return `${caption}${header}\n${rows}`;
  }
  const caption = block.caption ? `\n${block.caption}` : "";
  return `Photograph: ${block.alt}${caption}`;
}

export async function GET() {
  const articles = [...posts].sort((a, b) => (a.date < b.date ? 1 : -1));
  const sections = articles.map((post) => {
    const body = post.body.map(blockText).filter(Boolean).join("\n\n");
    const faqs = (post.faq ?? [])
      .map((item) => `Q: ${item.question}\nA: ${faqAnswerPlainText(item.answer)}`)
      .join("\n\n");
    const author = resolveArticleAuthor(post.author);
    const byline = author.isDefault
      ? `Author: ${author.name}, ${author.jobTitle}, ${siteConfig.companyName}. Profile: ${author.linkedIn}`
      : `Author: ${author.name}`;
    return [
      `# ${post.title}`,
      `URL: ${siteConfig.url}/insights/${post.slug}`,
      byline,
      `Published: ${post.date}${post.dateModified ? `\nUpdated: ${post.dateModified}` : ""}`,
      `Category: ${post.category}`,
      "",
      post.excerpt,
      "",
      body,
      faqs ? `\n## Questions\n\n${faqs}` : "",
    ]
      .filter((part) => part !== "")
      .join("\n");
  });

  const text = `# ${siteConfig.companyName} — full insight library

> ${siteConfig.definition}

This file is generated from the published insight articles. It does not add claims that are not on those pages. Illustrative examples are labelled on the page they come from.

${sections.join("\n\n---\n\n")}
`;

  return new Response(text, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}

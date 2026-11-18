import { siteConfig } from "@/site.config";
import { caseStudyDescription, type CaseStudy } from "@/lib/content";
import { ORGANIZATION_ID, absoluteUrl, articleAuthorStructuredData } from "@/lib/seo";

/**
 * Article schema for a real case study. Sample studies render nothing.
 * Kept out of the root JSON-LD module so the layout does not load article files.
 * The author is the shared founder Person. The publisher is the organization
 * `@id` already emitted by the layout. `about` is the client named on the page.
 */
export function CaseStudyArticleJsonLd({ study }: { study: CaseStudy }) {
  if (study.sample) return null;
  const url = `${siteConfig.url}/work/${study.slug}`;
  const published = study.date;
  const modified = study.dateModified ?? study.date;
  const data = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.headline,
    description: caseStudyDescription(study),
    ...(published ? { datePublished: published } : {}),
    ...(modified ? { dateModified: modified } : {}),
    ...(study.image ? { image: absoluteUrl(study.image) } : {}),
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    author: articleAuthorStructuredData(),
    publisher: { "@id": ORGANIZATION_ID },
    about: { "@type": "Organization", name: study.brand },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

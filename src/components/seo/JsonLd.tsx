import { siteConfig } from "@/site.config";
import {
  LOGO_PATH,
  ORGANIZATION_ID,
  WEBSITE_ID,
  aboutStructuredData,
  articleAuthorStructuredData,
  organizationStructuredData,
  serviceStructuredData,
} from "@/lib/seo";

/**
 * Structured data (JSON-LD). Server components - rendered inline as
 * <script type="application/ld+json">. Values come from site.config.ts.
 */

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Content is our own config, not user input - safe to inline.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * One Organization + ProfessionalService node (LocalBusiness subtype) and a
 * WebSite node. Rendered once in the root layout.
 */
export function OrganizationJsonLd() {
  return (
    <>
      {organizationStructuredData().map((data) => (
        <JsonLd key={String(data["@id"])} data={data} />
      ))}
    </>
  );
}

/**
 * About page graph: an AboutPage/WebPage whose mainEntity is the organization
 * and each person shown on /about. Shane Michelon is the shared founder Person.
 */
export function AboutPageJsonLd() {
  return <JsonLd data={aboutStructuredData()} />;
}

/** Page name and description, matching that route's document title and meta description. */
export function WebPageJsonLd({
  name,
  description,
  path,
}: {
  name: string;
  description: string;
  path: string;
}) {
  const url = `${siteConfig.url}${path}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name,
        description,
        isPartOf: { "@id": WEBSITE_ID },
        publisher: { "@id": ORGANIZATION_ID },
      }}
    />
  );
}

/** Breadcrumbs for inner pages. Pass ordered [{name, path}] from the site root. */
export function BreadcrumbJsonLd({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: item.name,
          item: `${siteConfig.url}${item.path}`,
        })),
      }}
    />
  );
}

/** Article schema for insights posts. */
export function ArticleJsonLd({
  title,
  description,
  slug,
  date,
  image,
  author,
  dateModified,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  image?: string;
  author?: string;
  dateModified?: string;
}) {
  // Google's Article image requirements do not accept SVG, so the fallback is
  // the generated PNG from app/opengraph-image.tsx rather than /og.svg.
  const resolved = image || "/opengraph-image";
  const imageUrl = resolved.startsWith("http") ? resolved : `${siteConfig.url}${resolved}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": ["Article", "BlogPosting"],
        headline: title,
        description,
        datePublished: date,
        // Freshness is a ranking and citation signal; without dateModified a
        // crawler can only assume the article is as old as its publish date.
        dateModified: dateModified ?? date,
        image: [imageUrl],
        url: `${siteConfig.url}/insights/${slug}`,
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": `${siteConfig.url}/insights/${slug}`,
        },
        author: articleAuthorStructuredData(author),
        publisher: {
          "@type": "Organization",
          "@id": ORGANIZATION_ID,
          name: siteConfig.companyName,
          logo: {
            "@type": "ImageObject",
            url: `${siteConfig.url}${LOGO_PATH}`,
          },
        },
      }}
    />
  );
}

/**
 * Service schema for the three offerings, rendered on the services hub.
 *
 * A single published amount is a unit price. Two amounts are a min and max,
 * with no single price. Every value comes from `pricing` in site.config.
 */
/** Service schema for one offering. Detail pages emit their own node. */
export function ServiceJsonLd({ slug }: { slug: string }) {
  return <JsonLd data={serviceStructuredData(slug)} />;
}

/** Service schema for every offering, rendered on the services hub. */
export function ServicesJsonLd() {
  return (
    <>
      {siteConfig.services.map((service) => (
        <ServiceJsonLd key={service.slug} slug={service.slug} />
      ))}
    </>
  );
}

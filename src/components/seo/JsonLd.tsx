import { siteConfig } from "@/site.config";
import {
  ORGANIZATION_ID,
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
  const authorName = author ?? siteConfig.companyName;
  // Google's Article image requirements do not accept SVG, so the fallback is
  // the generated PNG from app/opengraph-image.tsx rather than /og.svg.
  const resolved = image || "/opengraph-image";
  const imageUrl = resolved.startsWith("http") ? resolved : `${siteConfig.url}${resolved}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
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
        author:
          authorName === siteConfig.companyName
            ? { "@id": ORGANIZATION_ID }
            : { "@type": "Organization", name: authorName },
        publisher: {
          "@type": "Organization",
          "@id": ORGANIZATION_ID,
          name: siteConfig.companyName,
          logo: {
            "@type": "ImageObject",
            url: `${siteConfig.url}/logo.svg`,
          },
        },
      }}
    />
  );
}

/**
 * Service schema for the three offerings, rendered on the services hub.
 *
 * Prices are stated as a minimum via PriceSpecification rather than a flat
 * `price`, because the real pricing is "from $X" — declaring a fixed price
 * would be a claim the site does not make. Every value comes from the single
 * pricing source in site.config, so schema and page can never disagree.
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

import { siteConfig } from "@/site.config";

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

/** Site-wide Organization + LocalBusiness. Rendered once in the root layout. */
export function OrganizationJsonLd() {
  const sameAs = siteConfig.socials.map((s) => s.href).filter(Boolean);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          name: siteConfig.companyName,
          legalName: siteConfig.companyLegalName,
          url: siteConfig.url,
          description: siteConfig.description,
          email: siteConfig.contact.email,
          ...(sameAs.length ? { sameAs } : {}),
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "LocalBusiness",
          "@id": `${siteConfig.url}/#localbusiness`,
          name: siteConfig.companyName,
          url: siteConfig.url,
          telephone: siteConfig.contact.phone,
          email: siteConfig.contact.email,
          address: siteConfig.offices.map((o) => ({
            "@type": "PostalAddress",
            name: o.name,
            streetAddress: o.address,
          })),
          areaServed: siteConfig.campuses.map((c) => c.city),
        }}
      />
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
  image = "/og.svg",
  author,
}: {
  title: string;
  description: string;
  slug: string;
  date: string;
  image?: string;
  author?: string;
}) {
  const authorName = author ?? siteConfig.companyName;
  const imageUrl = image.startsWith("http") ? image : `${siteConfig.url}${image}`;
  return (
    <JsonLd
      data={{
        "@context": "https://schema.org",
        "@type": "Article",
        headline: title,
        description,
        datePublished: date,
        image: [imageUrl],
        url: `${siteConfig.url}/insights/${slug}`,
        author: { "@type": "Organization", name: authorName },
        publisher: { "@type": "Organization", name: siteConfig.companyName },
      }}
    />
  );
}

import { pricing, siteConfig } from "@/site.config";

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
        author: { "@type": "Organization", name: authorName },
        publisher: { "@type": "Organization", name: siteConfig.companyName },
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
export function ServicesJsonLd() {
  const provider = {
    "@type": "Organization",
    name: siteConfig.companyName,
    url: siteConfig.url,
  };

  const minPrice: Record<string, number | undefined> = {
    events: 500,
    "brand-ambassadors": 150,
    "product-placement": 2500,
  };

  return (
    <>
      {siteConfig.services.map((service) => {
        const price = minPrice[service.slug];
        const note = pricing[service.slug];
        return (
          <JsonLd
            key={service.slug}
            data={{
              "@context": "https://schema.org",
              "@type": "Service",
              "@id": `${siteConfig.url}/services#${service.slug}`,
              name: service.label,
              description: service.blurb,
              serviceType: service.label,
              provider,
              areaServed: siteConfig.campuses.map((c) => ({
                "@type": "City",
                name: c.city,
              })),
              url: `${siteConfig.url}${service.href}`,
              ...(price
                ? {
                    offers: {
                      "@type": "Offer",
                      priceCurrency: "USD",
                      priceSpecification: {
                        "@type": "PriceSpecification",
                        minPrice: price,
                        priceCurrency: "USD",
                        ...(note?.unit ? { unitText: note.unit.replace(/^\//, "").trim() } : {}),
                      },
                    },
                  }
                : {}),
            }}
          />
        );
      })}
    </>
  );
}

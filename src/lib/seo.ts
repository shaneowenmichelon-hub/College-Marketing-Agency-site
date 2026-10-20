import type { Metadata } from "next";
import { pricing, siteConfig } from "@/site.config";

/**
 * Document titles stay within the ~60 character snippet width.
 * The brand suffix is appended only when the result still fits; a title that
 * already ends in the brand is not suffixed again.
 */
export const TITLE_LIMIT = 60;
export const BRAND_SUFFIX = ` | ${siteConfig.companyName}`;

/** Homepage lead. The brand suffix is added by {@link resolveDocumentTitle}. */
export const HOME_TITLE_LEAD = "College Marketing Agency";

export const ORGANIZATION_ID = `${siteConfig.url}/#organization`;
export const WEBSITE_ID = `${siteConfig.url}/#website`;
/** Raster-scale SVG of the existing app icon, served from /public. */
export const LOGO_PATH = "/logo.svg";

const BRAND_TAIL = new RegExp(
  `(?:\\s*[|·]\\s*${siteConfig.companyName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})+$`,
  "i",
);

export function resolveDocumentTitle(raw: string): { text: string } {
  const stripped = raw.replace(BRAND_TAIL, "").replace(/\s+/g, " ").trim();
  const withBrand = `${stripped}${BRAND_SUFFIX}`;
  return { text: withBrand.length <= TITLE_LIMIT ? withBrand : stripped };
}

export function absoluteUrl(path: string): string {
  if (path === "/" || path === "") return siteConfig.url;
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

type OgImage = { url: string; width?: number; height?: number; alt?: string };

/**
 * Page metadata with a canonical URL and matching Open Graph / Twitter tags.
 * Titles are absolute so the root template cannot append the brand a second time.
 */
export function pageMetadata(opts: {
  title: string;
  description: string;
  /** Pathname such as "/about". Omit on responses that have no canonical URL. */
  path?: string | null;
  index?: boolean;
  follow?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  images?: OgImage[];
}): Metadata {
  const { text } = resolveDocumentTitle(opts.title);
  const index = opts.index !== false;
  const follow = opts.follow !== false;
  const path = opts.path ?? undefined;
  return {
    title: { absolute: text },
    description: opts.description,
    ...(path ? { alternates: { canonical: path } } : {}),
    openGraph: {
      title: { absolute: text },
      description: opts.description,
      type: opts.type ?? "website",
      siteName: siteConfig.companyName,
      ...(path ? { url: absoluteUrl(path) } : {}),
      ...(opts.type === "article" && opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
      ...(opts.type === "article" && opts.modifiedTime ? { modifiedTime: opts.modifiedTime } : {}),
      ...(opts.type === "article" && opts.authors ? { authors: opts.authors } : {}),
      ...(opts.images?.length ? { images: opts.images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: { absolute: text },
      description: opts.description,
      ...(opts.images?.length ? { images: opts.images.map((image) => image.url) } : {}),
    },
    robots: { index, follow },
  };
}

export function serviceBreadcrumbItems(slug: string, name: string) {
  return [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name, path: `/services/${slug}` },
  ];
}

/** Standalone service URLs. Product placement lives on the services hub. */
export function serviceCanonicalPath(slug: string): string {
  if (slug === "events") return "/services/events";
  if (slug === "brand-ambassadors") return "/services/brand-ambassadors";
  return "/services";
}

function serviceMinPrice(slug: string): number | undefined {
  const range = pricing[slug]?.range ?? "";
  const match = range.match(/\$([\d,]+)/);
  if (!match) return undefined;
  const value = Number(match[1].replace(/,/g, ""));
  return Number.isFinite(value) ? value : undefined;
}

export function serviceStructuredData(slug: string): Record<string, unknown> {
  const service = siteConfig.services.find((item) => item.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);

  const path = serviceCanonicalPath(slug);
  const standalone = path !== "/services";
  const url = standalone ? `${siteConfig.url}${path}` : `${siteConfig.url}/services#${slug}`;
  const note = pricing[slug];
  const minPrice = serviceMinPrice(slug);
  const unit = note?.unit?.replace(/^\//, "").trim();

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": standalone ? `${url}#service` : `${siteConfig.url}/services#${slug}`,
    name: service.label,
    description: service.blurb,
    serviceType: service.label,
    provider: { "@id": ORGANIZATION_ID },
    areaServed: siteConfig.campuses.map((campus) => ({
      "@type": "City",
      name: campus.city,
    })),
    url,
    ...(minPrice
      ? {
          offers: {
            "@type": "Offer",
            priceCurrency: "USD",
            priceSpecification: {
              "@type": "PriceSpecification",
              minPrice,
              priceCurrency: "USD",
              ...(unit ? { unitText: unit } : {}),
            },
          },
        }
      : {}),
  };
}

export function organizationStructuredData(): Record<string, unknown>[] {
  const sameAs = siteConfig.socials.map((social) => social.href).filter(Boolean);
  const office = siteConfig.offices[0];
  const logoUrl = `${siteConfig.url}${LOGO_PATH}`;

  return [
    {
      "@context": "https://schema.org",
      "@type": ["Organization", "ProfessionalService"],
      "@id": ORGANIZATION_ID,
      name: siteConfig.companyName,
      legalName: siteConfig.companyLegalName,
      url: siteConfig.url,
      description: siteConfig.description,
      email: siteConfig.contact.email,
      logo: {
        "@type": "ImageObject",
        "@id": `${siteConfig.url}/#logo`,
        url: logoUrl,
        contentUrl: logoUrl,
        width: 512,
        height: 512,
      },
      image: `${siteConfig.url}/opengraph-image`,
      address: {
        "@type": "PostalAddress",
        addressLocality: office.addressLocality,
        addressRegion: office.addressRegion,
        addressCountry: office.addressCountry,
      },
      areaServed: siteConfig.campuses.map((campus) => campus.city),
      ...(sameAs.length ? { sameAs } : {}),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      url: siteConfig.url,
      name: siteConfig.companyName,
      description: siteConfig.description,
      inLanguage: "en-US",
      publisher: { "@id": ORGANIZATION_ID },
    },
  ];
}

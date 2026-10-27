import type { Metadata } from "next";
import { pricing, siteConfig, team, type TeamMember } from "@/site.config";

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
/** Stable id for the default article author. Defined once and reused by every article. */
export const FOUNDER_PERSON_ID = `${siteConfig.url}/#shane-michelon`;

export type ResolvedArticleAuthor = {
  name: string;
  jobTitle?: string;
  linkedIn?: string;
  /** True for the default founder, including a missing or legacy organization byline. */
  isDefault: boolean;
};

/**
 * Names that mean "use the default founder". `Collegiate Agency` is the old
 * byline still written on existing articles and sometimes copied into new ones.
 */
export function isDefaultArticleAuthor(author?: string): boolean {
  const name = author?.trim() ?? "";
  return name.length === 0 || name === siteConfig.companyName || name === siteConfig.articleAuthor.name;
}

/** Display byline. A frontmatter name other than the company or the founder overrides it. */
export function resolveArticleAuthor(author?: string): ResolvedArticleAuthor {
  if (isDefaultArticleAuthor(author)) {
    return {
      name: siteConfig.articleAuthor.name,
      jobTitle: siteConfig.articleAuthor.jobTitle,
      linkedIn: siteConfig.articleAuthor.linkedIn,
      isDefault: true,
    };
  }
  return { name: author!.trim(), isDefault: false };
}

/**
 * Person node for Shane Michelon. Articles embed this same object so the
 * `@id` does not drift. The LinkedIn profile is `sameAs` only.
 */
export function founderPersonStructuredData(): Record<string, unknown> {
  return {
    "@type": "Person",
    "@id": FOUNDER_PERSON_ID,
    name: siteConfig.articleAuthor.name,
    jobTitle: siteConfig.articleAuthor.jobTitle,
    worksFor: { "@id": ORGANIZATION_ID },
    sameAs: [siteConfig.articleAuthor.linkedIn],
  };
}

/** Article author. The default is the shared Person; any other name is a Person with that name only. */
export function articleAuthorStructuredData(author?: string): Record<string, unknown> {
  if (isDefaultArticleAuthor(author)) return founderPersonStructuredData();
  return { "@type": "Person", name: author!.trim() };
}

/** Document title lead for /about. The brand suffix is added when it still fits. */
export const ABOUT_TITLE_LEAD = "About the college marketing agency";

/**
 * Snippet for /about. Brand-framed: who hires the agency, the three channels,
 * and the founder. No student recruiting pitch and no new claim.
 */
export const ABOUT_DESCRIPTION =
  "Collegiate Agency is a college marketing agency brands hire for campus events, brand ambassador programs, and product placement. Founder Shane Michelon.";

/** Stable fragment for a person @id. Shane Michelon matches {@link FOUNDER_PERSON_ID}. */
export function personSlug(name: string): string {
  return name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function personIdForName(name: string): string {
  if (name === siteConfig.articleAuthor.name) return FOUNDER_PERSON_ID;
  return `${siteConfig.url}/#${personSlug(name)}`;
}

/**
 * Person node for someone shown on /about.
 * Shane Michelon is the shared founder node, ignoring any other title, photo,
 * or profile on the team record so the article author and this page cannot drift.
 * Everyone else gets only the name, role, photo, and profile already on that card.
 */
export function aboutTeamPersonStructuredData(member: TeamMember): Record<string, unknown> {
  if (member.name === siteConfig.articleAuthor.name) return founderPersonStructuredData();
  const node: Record<string, unknown> = {
    "@type": "Person",
    "@id": personIdForName(member.name),
    name: member.name,
    ...(member.title ? { jobTitle: member.title } : {}),
    worksFor: { "@id": ORGANIZATION_ID },
  };
  if (member.photo) node.image = absoluteUrl(member.photo);
  if (member.linkedin) node.sameAs = [member.linkedin];
  return node;
}

/** AboutPage graph for /about. Person nodes are the people in `team`, in that order. */
export function aboutStructuredData(): Record<string, unknown> {
  const people = team.map(aboutTeamPersonStructuredData);
  const url = absoluteUrl("/about");
  const page = {
    "@type": ["AboutPage", "WebPage"],
    "@id": `${url}#webpage`,
    url,
    name: resolveDocumentTitle(ABOUT_TITLE_LEAD).text,
    description: ABOUT_DESCRIPTION,
    inLanguage: "en-US",
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    mainEntity: [{ "@id": ORGANIZATION_ID }, ...people.map((person) => ({ "@id": person["@id"] }))],
  };
  return {
    "@context": "https://schema.org",
    "@graph": [page, ...people],
  };
}

/**
 * Raster logo rendered from public/logo.svg. Google's Organization logo
 * does not accept SVG; the file is 512×512 PNG.
 */
export const LOGO_PATH = "/logo.png";
export const LOGO_WIDTH = 512;
export const LOGO_HEIGHT = 512;

/**
 * Verified Collegiate Agency profiles. These are directory pages, not footer
 * socials, so they are appended to Organization sameAs only.
 * Confirmed live on 2026-10-22.
 */
export const ORGANIZATION_PROFILES = [
  "https://clutch.co/profile/collegiate-agency",
  "https://www.sortlist.com/agency/collegiate-agency",
] as const;

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
 * The generated root social card (`app/opengraph-image.tsx`). 1200×630 is that
 * file's real size. Article photos pass their own intrinsic pixels instead.
 */
export const DEFAULT_SOCIAL_IMAGE: { url: string; width: number; height: number; alt: string } = {
  url: "/opengraph-image",
  width: 1200,
  height: 630,
  alt: `${siteConfig.companyName} — ${siteConfig.tagline}`,
};

/** Per-article social image, or the default card when the article has no photograph. */
export function articleSocialImage(post: {
  title: string;
  image?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;
}): { url: string; width: number; height: number; alt: string } {
  if (post.image && post.imageWidth && post.imageHeight) {
    return {
      url: post.image,
      width: post.imageWidth,
      height: post.imageHeight,
      alt: post.imageAlt?.trim() || post.title,
    };
  }
  return DEFAULT_SOCIAL_IMAGE;
}

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
    alternates: {
      ...(path ? { canonical: path } : {}),
      types: {
        "application/rss+xml": "/feed.xml",
      },
    },
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

/** Standalone service URLs. Each priced channel has its own page. */
export function serviceCanonicalPath(slug: string): string {
  if (slug === "events") return "/services/events";
  if (slug === "brand-ambassadors") return "/services/brand-ambassadors";
  if (slug === "product-placement") return "/services/product-placement";
  return "/services";
}

/** Dollar amounts already written in a pricing range. No number is inferred. */
function servicePriceAmounts(slug: string): number[] {
  const range = pricing[slug]?.range ?? "";
  return [...range.matchAll(/\$([\d,]+)/g)]
    .map((match) => Number(match[1].replace(/,/g, "")))
    .filter((value) => Number.isFinite(value));
}

/**
 * Offer schema only when `pricing` states a number.
 * One amount is a unit price. Two amounts are a min/max range, with no single price.
 */
function serviceOffer(slug: string, url: string): Record<string, unknown> | undefined {
  const amounts = servicePriceAmounts(slug);
  if (amounts.length === 0) return undefined;
  const unit = pricing[slug]?.unit?.replace(/^\//, "").trim();
  if (amounts.length === 1) {
    return {
      "@type": "Offer",
      priceCurrency: "USD",
      price: amounts[0],
      url,
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: amounts[0],
        priceCurrency: "USD",
        ...(unit ? { unitText: unit } : {}),
      },
    };
  }
  return {
    "@type": "Offer",
    priceCurrency: "USD",
    url,
    priceSpecification: {
      "@type": "PriceSpecification",
      minPrice: Math.min(...amounts),
      maxPrice: Math.max(...amounts),
      priceCurrency: "USD",
      ...(unit ? { unitText: unit } : {}),
    },
  };
}

export function serviceStructuredData(slug: string): Record<string, unknown> {
  const service = siteConfig.services.find((item) => item.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);

  const path = serviceCanonicalPath(slug);
  const standalone = path !== "/services";
  const url = standalone ? `${siteConfig.url}${path}` : `${siteConfig.url}/services#${slug}`;
  const offer = serviceOffer(slug, url);

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
    ...(offer ? { offers: offer } : {}),
  };
}

export function organizationStructuredData(): Record<string, unknown>[] {
  const sameAs = [
    ...new Set([
      ...siteConfig.socials.map((social) => social.href).filter(Boolean),
      ...ORGANIZATION_PROFILES,
    ]),
  ];
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
      founder: { "@id": FOUNDER_PERSON_ID },
      description: siteConfig.description,
      email: siteConfig.contact.email,
      logo: {
        "@type": "ImageObject",
        "@id": `${siteConfig.url}/#logo`,
        url: logoUrl,
        contentUrl: logoUrl,
        width: LOGO_WIDTH,
        height: LOGO_HEIGHT,
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

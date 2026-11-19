import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { SectionHeading } from "@/components/SectionHeading";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/ui/Section";
import {
  HUB_DESCRIPTION,
  HUB_H1,
  HUB_PATH,
  HUB_TITLE_LEAD,
  cityPath,
  hubBreadcrumbItems,
  hubCollectionItems,
  hubIntro,
  publishedMarkets,
} from "@/lib/campus-markets";
import { pageMetadata, resolveDocumentTitle } from "@/lib/seo";

const title = resolveDocumentTitle(HUB_TITLE_LEAD).text;

export const metadata = pageMetadata({
  title: HUB_TITLE_LEAD,
  description: HUB_DESCRIPTION,
  path: HUB_PATH,
});

export default function CampusMarketingPage() {
  const markets = publishedMarkets();

  return (
    <>
      <CollectionPageJsonLd name={title} description={HUB_DESCRIPTION} path={HUB_PATH} items={hubCollectionItems()} />
      <BreadcrumbJsonLd items={hubBreadcrumbItems()} />
      <Section tone="light">
        <SectionHeading as="h1" eyebrow="Cities" title={HUB_H1} />
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-[color:var(--muted-on-light)] sm:text-lg">
          {hubIntro()}
        </p>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {markets.map((market) => (
            <li key={market.slug}>
              <Link
                href={cityPath(market.slug)}
                className="flex h-full flex-col rounded-[4px] border-2 border-ink bg-white p-6 shadow-[4px_4px_0_var(--ink)]"
              >
                <p className="mono-label text-[11px] font-bold text-accent">
                  {market.city}, {market.region}
                </p>
                <h2 className="mt-3 font-display text-2xl font-bold text-ink">College marketing in {market.city}</h2>
                <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted-on-light)]">{market.intro}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-ink">
                  campus marketing in {market.city}
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <CTASection
        eyebrow="Brands"
        title="Tell us the city you want to reach."
        primary={{ label: "Tell us your campus goal", href: "/contact" }}
      />
    </>
  );
}

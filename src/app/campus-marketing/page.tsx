import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CampusGrid } from "@/components/CampusGrid";
import { CTASection } from "@/components/CTASection";
import { SectionHeading } from "@/components/SectionHeading";
import { CopyBlocks } from "@/components/seo/CopyBlocks";
import { BreadcrumbJsonLd, CollectionPageJsonLd } from "@/components/seo/JsonLd";
import { FaqPageJsonLd, ServiceFaq } from "@/components/services/ServiceFaq";
import { Section } from "@/components/ui/Section";
import {
  HUB_DESCRIPTION,
  HUB_H1,
  HUB_PATH,
  HUB_TITLE_LEAD,
  hubBreadcrumbItems,
  hubCollectionItems,
  hubFaqs,
  hubIntro,
  publishedFacts,
  publishedMarkets,
  cityPath,
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
  const faqs = hubFaqs().map((item) => ({ question: item.q, answer: item.a }));

  return (
    <>
      <CollectionPageJsonLd
        name={title}
        description={HUB_DESCRIPTION}
        path={HUB_PATH}
        items={hubCollectionItems()}
      />
      <BreadcrumbJsonLd items={hubBreadcrumbItems()} />
      <FaqPageJsonLd items={faqs} path={HUB_PATH} />
      <Section tone="light">
        <SectionHeading as="h1" eyebrow="Cities" title={HUB_H1} />
        <CopyBlocks blocks={hubIntro()} className="mt-8 max-w-3xl" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2">
          {markets.map((market) => {
            const fact = publishedFacts(market)[0];
            return (
              <li key={market.slug}>
                <Link
                  href={cityPath(market.slug)}
                  className="group flex h-full flex-col rounded-[4px] border-2 border-ink bg-white p-6 shadow-[4px_4px_0_var(--ink)] transition-transform hover:-translate-y-0.5"
                >
                  <p className="mono-label text-[11px] font-bold text-accent">
                    {market.city}, {market.region}
                  </p>
                  <h2 className="mt-3 font-display text-2xl font-bold text-ink">
                    College marketing in {market.city}
                  </h2>
                  {fact ? (
                    <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted-on-light)]">{fact.text}</p>
                  ) : null}
                  <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-ink">
                    campus marketing in {market.city}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Section>
      <Section tone="muted">
        <SectionHeading
          eyebrow="Network"
          title="The Collegiate Agency campus network"
          intro="These schools are in the Collegiate Agency campus network. A name here is not a past campaign."
        />
        <div className="mt-8">
          <CampusGrid />
        </div>
      </Section>
      <Section tone="light" id="faq" className="scroll-mt-24">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions brands ask about campus marketing by city."
          intro="The same answers are in the FAQPage structured data on this page."
        />
        <ServiceFaq items={faqs} />
      </Section>
      <CTASection
        eyebrow="Brands"
        title="Tell us the city you want to reach."
        primary={{ label: "Tell us your campus goal", href: "/contact" }}
      />
    </>
  );
}

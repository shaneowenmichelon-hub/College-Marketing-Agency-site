import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Accordion } from "@/components/Accordion";
import { CTASection } from "@/components/CTASection";
import { InquiryTestimonial } from "@/components/InquiryTestimonial";
import { SectionHeading } from "@/components/SectionHeading";
import { CopyBlocks } from "@/components/seo/CopyBlocks";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { FaqPageJsonLd } from "@/components/services/ServiceFaq";
import { Section } from "@/components/ui/Section";
import {
  cityBreadcrumbItems,
  cityFaqItems,
  cityServiceStructuredData,
  marketDocument,
  publishedMarket,
  publishedMarkets,
} from "@/lib/campus-markets";
import { pageMetadata } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedMarkets().map((market) => ({ slug: market.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const market = publishedMarket(slug);
  if (!market) notFound();
  const doc = marketDocument(market);
  return pageMetadata({
    title: doc.titleLead,
    description: doc.description,
    path: doc.path,
  });
}

export default async function CampusMarketPage({ params }: { params: Params }) {
  const { slug } = await params;
  const market = publishedMarket(slug);
  if (!market) notFound();
  const doc = marketDocument(market);
  const faqs = cityFaqItems(market);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityServiceStructuredData(market)) }}
      />
      <BreadcrumbJsonLd items={cityBreadcrumbItems(market)} />
      <FaqPageJsonLd items={faqs} path={doc.path} />
      <Section tone="light">
        <SectionHeading
          as="h1"
          eyebrow={`${market.city}, ${market.region}`}
          title={doc.h1}
        />
        <CopyBlocks blocks={doc.lead} className="mt-8 max-w-3xl" />
      </Section>
      <Section tone="muted">
        <SectionHeading title={doc.ranHeading} />
        <ul className="mt-8 grid gap-4">
          {doc.factCards.map((card) => (
            <li key={card.id}>
              <article className="rounded-[4px] border-2 border-ink bg-white p-6 shadow-[4px_4px_0_var(--ink)]">
                <p className="text-base leading-relaxed text-[color:var(--muted-on-light)]">{card.text}</p>
                {card.href && card.label ? (
                  <p className="mt-4 text-sm font-semibold">
                    <Link href={card.href} className="text-accent underline decoration-accent/30 underline-offset-2">
                      {card.label}
                    </Link>
                  </p>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="light">
        <SectionHeading title={doc.schoolsHeading} />
        <CopyBlocks blocks={doc.schoolsIntro} className="mt-6 max-w-3xl" />
        <ul className="mt-6 max-w-3xl space-y-2">
          {doc.schools.map((school) => (
            <li key={school.name} className="text-base text-ink">
              {school.name}
              {school.network ? (
                <span className="text-[color:var(--muted-on-light)]"> in the Collegiate Agency campus network</span>
              ) : null}
            </li>
          ))}
        </ul>
      </Section>
      <Section tone="muted">
        <SectionHeading title={doc.servicesHeading} />
        <CopyBlocks blocks={doc.services} className="mt-6 max-w-3xl" />
      </Section>
      <Section tone="light" id="faq" className="scroll-mt-24">
        <SectionHeading
          eyebrow="FAQ"
          title={`Questions brands ask about college marketing in ${market.city}.`}
          intro="The same answers are in the FAQPage structured data on this page."
        />
        <div className="mt-8 max-w-3xl">
          <Accordion items={market.localFaq} />
        </div>
      </Section>
      <Section tone="muted">
        <SectionHeading title={doc.proofHeading} />
        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] lg:items-start">
          <CopyBlocks blocks={doc.proof} className="max-w-3xl" />
          <InquiryTestimonial />
        </div>
      </Section>
      <CTASection
        eyebrow={market.city}
        title={doc.cta.title}
        primary={{ label: doc.cta.title, href: doc.cta.href }}
      />
    </>
  );
}

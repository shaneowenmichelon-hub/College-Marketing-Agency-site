import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CTASection } from "@/components/CTASection";
import { SectionHeading } from "@/components/SectionHeading";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { Section } from "@/components/ui/Section";
import {
  cityBreadcrumbItems,
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(cityServiceStructuredData(market)) }}
      />
      <BreadcrumbJsonLd items={cityBreadcrumbItems(market)} />
      <Section tone="light">
        <SectionHeading as="h1" eyebrow={`${market.city}, ${market.region}`} title={doc.h1} />
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-[color:var(--muted-on-light)] sm:text-lg">
          {doc.intro}
        </p>
      </Section>
      <Section tone="muted">
        <SectionHeading title={doc.ranHeading} />
        <ul className="mt-8 grid gap-4">
          {doc.activations.map((activation) => (
            <li key={activation.brand}>
              <article className="rounded-[4px] border-2 border-ink bg-white p-6 shadow-[4px_4px_0_var(--ink)]">
                <h3 className="font-display text-xl font-bold text-ink">{activation.brand}</h3>
                <p className="mt-3 text-base leading-relaxed text-[color:var(--muted-on-light)]">{activation.whatRan}</p>
                {activation.result ? (
                  <p className="mt-3 text-base leading-relaxed text-[color:var(--muted-on-light)]">{activation.result}</p>
                ) : null}
                {activation.caseStudyHref && activation.caseStudyLabel ? (
                  <p className="mt-4 text-sm font-semibold">
                    <Link
                      href={activation.caseStudyHref}
                      className="text-accent underline decoration-accent/30 underline-offset-2"
                    >
                      {activation.caseStudyLabel}
                    </Link>
                  </p>
                ) : null}
              </article>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-[color:var(--muted-on-light)]">
          A brand still deciding how to hire can read{" "}
          <Link
            href={doc.moneyHref}
            className="font-semibold text-accent underline decoration-accent/30 underline-offset-2"
          >
            {doc.moneyAnchor}
          </Link>.
        </p>
      </Section>
      <CTASection eyebrow={market.city} title={doc.cta.title} primary={{ label: doc.cta.title, href: doc.cta.href }} />
    </>
  );
}

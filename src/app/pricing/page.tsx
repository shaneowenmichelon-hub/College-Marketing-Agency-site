import type { Metadata } from "next";
import Link from "next/link";
import { ArticleTable } from "@/components/article/ArticleTable";
import { CTASection } from "@/components/CTASection";
import { ProcessStep } from "@/components/ProcessStep";
import { SectionHeading } from "@/components/SectionHeading";
import { BreadcrumbJsonLd, ServiceJsonLd } from "@/components/seo/JsonLd";
import { FaqPageJsonLd, ServiceFaq } from "@/components/services/ServiceFaq";
import { Section } from "@/components/ui/Section";
import { pageMetadata } from "@/lib/seo";
import {
  PRICING_COST_QUESTION,
  PRICING_DESCRIPTION,
  PRICING_DOCUMENT_TITLE,
  PRICING_H1,
  PRICING_TITLE_LEAD,
  pricingCostAnswer,
  pricingCostExample,
  pricingFaqs,
  pricingIntro,
  pricingRows,
} from "@/lib/pricing-page";

const pricingMeta = pageMetadata({
  title: PRICING_TITLE_LEAD,
  description: PRICING_DESCRIPTION,
  path: "/pricing",
});

// The shared resolver drops the brand above 60 characters. This lead with the
// suffix is 62, which is still inside the 65-character cap for this page.
export const metadata: Metadata = {
  ...pricingMeta,
  title: { absolute: PRICING_DOCUMENT_TITLE },
  openGraph: pricingMeta.openGraph
    ? { ...pricingMeta.openGraph, title: { absolute: PRICING_DOCUMENT_TITLE } }
    : undefined,
  twitter: pricingMeta.twitter
    ? { ...pricingMeta.twitter, title: { absolute: PRICING_DOCUMENT_TITLE } }
    : undefined,
};

const steps = [
  {
    title: "Start from the table",
    body: "Ambassador months, product-placement chapters, and listed event packages use the published rates.",
  },
  {
    title: "Build a starting estimate",
    body: "The campaign builder multiplies those rates by the chapters, ambassadors, months, and events a brand selects.",
  },
  {
    title: "Get firm pricing",
    body: "Collegiate Agency replies within one business day with a tailored plan and firm pricing.",
  },
];

export default function PricingPage() {
  const faqs = pricingFaqs();
  const rows = pricingRows();
  return (
    <>
      <ServiceJsonLd slug="brand-ambassadors" />
      <ServiceJsonLd slug="product-placement" />
      <ServiceJsonLd slug="events" />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Pricing", path: "/pricing" },
        ]}
      />
      <FaqPageJsonLd items={faqs} path="/pricing" />

      <Section tone="light">
        <SectionHeading as="h1" eyebrow="Pricing" title={PRICING_H1} />
        <div className="mt-6 max-w-3xl">
          <h2 className="text-balance font-display text-2xl font-bold text-ink sm:text-3xl">
            {PRICING_COST_QUESTION}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[color:var(--muted-on-light)] sm:text-lg">
            {pricingCostAnswer()}
          </p>
          <p className="mt-3 text-base leading-relaxed text-[color:var(--muted-on-light)]">{pricingCostExample()}</p>
        </div>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-[color:var(--muted-on-light)] sm:text-lg">
          {pricingIntro()}
        </p>
        <div className="mt-10">
          <ArticleTable
            block={{
              type: "table",
              caption: "Published Collegiate Agency rates",
              columns: ["Service", "Published rate", "What that rate includes"],
              rows: rows.map((row) => [
                `<a href="${row.href}">${row.service}</a>`,
                row.rate,
                row.includes,
              ]),
            }}
          />
        </div>
        <p className="mt-6 max-w-3xl text-base leading-relaxed text-[color:var(--muted-on-light)]">
          The <Link href="/services/events" className="font-semibold text-accent">events page</Link>{" "}
          lists sponsorship inventory and the published package price for each item.{" "}
          <Link href="/services/brand-ambassadors" className="font-semibold text-accent">Brand ambassadors</Link>
          {" "}and{" "}
          <Link href="/services/product-placement" className="font-semibold text-accent">product placement</Link>
          {" "}use the rates in the table. Anything else is quoted per campaign. Brands still{" "}
          <Link href="/insights/college-marketing-agency" className="font-semibold text-accent">
            choosing a college marketing agency
          </Link>{" "}
          can put these rates next to the questions in that guide.
        </p>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="Estimate" title="How a number becomes a quote." />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {steps.map((step, index) => (
            <ProcessStep key={step.title} step={index + 1} title={step.title} body={step.body} index={index} />
          ))}
        </div>
      </Section>

      <Section id="faq" tone="light" className="scroll-mt-24">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions brands ask about pricing."
          intro="The same answers are in the FAQPage structured data on this page."
        />
        <ServiceFaq items={faqs} />
      </Section>

      <CTASection
        eyebrow="Talk to the team"
        title="Send the brief. Get firm pricing."
        intro="Tell Collegiate Agency what you are launching. The reply is a tailored plan and firm pricing within one business day."
        primary={{ label: "Contact Collegiate Agency", href: "/contact", variant: "lime" }}
        secondary={{ label: "Build a campaign", href: "/build-a-campaign" }}
      />
    </>
  );
}

import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { ArticleTable } from "@/components/article/ArticleTable";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { FaqPageJsonLd, ServiceFaq } from "@/components/services/ServiceFaq";
import { CopyBlocks } from "@/components/seo/CopyBlocks";
import { SectionHeading } from "@/components/SectionHeading";
import { CampaignBuilder } from "@/components/campaign/CampaignBuilder";
import {
  BUILD_DESCRIPTION,
  BUILD_FAQ_TITLE,
  BUILD_H1,
  BUILD_TITLE,
  buildFaqs,
  buildGets,
  buildLead,
  buildStepsIntro,
  buildTable,
} from "@/lib/indexable-pages";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: BUILD_TITLE,
  description: BUILD_DESCRIPTION,
  path: "/build-a-campaign",
});

export default function BuildACampaignPage() {
  const faqs = buildFaqs();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Create a Campaign", path: "/build-a-campaign" },
        ]}
      />
      <FaqPageJsonLd items={faqs} path="/build-a-campaign" />
      <Section tone="light" className="pb-0">
        <SectionHeading as="h1" eyebrow="Build a campaign" title={BUILD_H1} />
        <CopyBlocks blocks={buildLead()} className="mt-6 max-w-3xl" />
      </Section>
      <Section tone="light" className="pt-10">
        <Container className="px-0">
          <CampaignBuilder />
        </Container>
      </Section>
      <Section tone="muted">
        <CopyBlocks blocks={buildStepsIntro()} />
        <ArticleTable block={buildTable()} />
        <CopyBlocks blocks={buildGets()} />
      </Section>
      <Section id="faq" tone="light" className="scroll-mt-24">
        <SectionHeading as="h2" eyebrow="FAQ" title={BUILD_FAQ_TITLE} />
        <ServiceFaq items={faqs} />
      </Section>
    </>
  );
}

import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/Button";
import { BreadcrumbJsonLd, ServicesJsonLd, WebPageJsonLd } from "@/components/seo/JsonLd";
import { CapabilityBlock } from "@/components/services/CapabilityBlock";
import { IconCardGrid } from "@/components/services/IconCardGrid";
import { servicesHub } from "@/site.config";
import { pageMetadata, resolveDocumentTitle } from "@/lib/seo";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const servicesTitle = resolveDocumentTitle(servicesHub.documentTitle).text;

export const metadata = pageMetadata({
  title: servicesHub.documentTitle,
  description: servicesHub.description,
  path: "/services",
});

const { brands, students } = servicesHub;

function BrandsPanel() {
  return (
    <div>
      <p className="max-w-2xl text-base leading-relaxed text-[color:var(--muted-on-light)] sm:text-lg">
        {brands.intro}
      </p>
      <p className="mt-4 text-sm font-semibold">
        <Link href="/pricing" className="text-accent">
          See published pricing
        </Link>
      </p>
      <div className="mt-14 space-y-16 lg:space-y-24">
        {brands.blocks.map((block, i) => {
          // Prefer explicit config ids; legacy blocks derive their anchor from the detail-page slug.
          const anchor = block.id ?? block.cta?.href.replace("/services/", "");
          return (
            <div key={block.heading} id={anchor} className="scroll-mt-24">
              <CapabilityBlock block={block} imageSide={i % 2 === 0 ? "left" : "right"} />
            </div>
          );
        })}
      </div>
      <div className="mt-16 flex flex-col items-start gap-4 rounded-[4px] border-2 border-ink bg-surface-muted p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="font-display text-xl font-bold text-ink">Ready to reach students?</p>
        <Button href={brands.cta.href} variant="primary" size="lg">
          {brands.cta.label}
        </Button>
      </div>
    </div>
  );
}

function StudentsPanel() {
  return (
    <div>
      <p className="max-w-2xl text-base leading-relaxed text-[color:var(--muted-on-light)] sm:text-lg">
        {students.intro}
      </p>
      <div className="mt-14">
        <CapabilityBlock block={students.howItWorks} imageSide="right" />
      </div>
      <div className="mt-16">
        <h3 className="font-display text-display-sm font-bold text-ink">What&apos;s in it for you</h3>
        <div className="mt-8">
          <IconCardGrid cards={students.perks} />
        </div>
      </div>
      <div className="mt-16 flex flex-col items-start gap-4 rounded-[4px] border-2 border-ink bg-surface-muted p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <p className="font-display text-xl font-bold text-ink">Get paid to rep brands you love.</p>
        <Button href={students.cta.href} variant="lime" size="lg">
          {students.cta.label}
        </Button>
      </div>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <>
      <WebPageJsonLd name={servicesTitle} description={servicesHub.description} path="/services" />
      <ServicesJsonLd />
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />
      <Section tone="light" id="for-brands" className="scroll-mt-24">
        <SectionHeading
          as="h1"
          eyebrow="Services"
          title={servicesHub.heroTitle}
          intro={servicesHub.intro}
          align="center"
        />
        <div className="mt-10">
          <Link
            href="/build-a-campaign"
            className="group mx-auto flex w-full max-w-md items-center justify-between gap-4 rounded-[4px] border-2 border-ink bg-[color:var(--accent-2)] px-5 py-4 shadow-[5px_5px_0_var(--ink)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[7px_7px_0_var(--ink)]"
          >
            <span className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-ink" />
              <span className="font-display text-base font-bold text-ink sm:text-lg">Build a Campaign</span>
            </span>
            <span className="mono-label text-[11px] font-bold text-ink/70 transition-transform group-hover:translate-x-1">
              Build it →
            </span>
          </Link>
        </div>
        <div className="mt-12">
          <BrandsPanel />
        </div>
      </Section>
      <Section tone="muted" id="for-students" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Ambassador network"
          title="Apply to the ambassador roster."
        />
        <div className="mt-10">
          <StudentsPanel />
        </div>
      </Section>
    </>
  );
}

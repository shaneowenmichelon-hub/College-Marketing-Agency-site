import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/ui/Button";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { AudienceTabs } from "@/components/services/AudienceTabs";
import { CapabilityBlock } from "@/components/services/CapabilityBlock";
import { IconCardGrid } from "@/components/services/IconCardGrid";
import { servicesHub } from "@/site.config";

export const metadata: Metadata = {
  title: "Services — For brands and for students",
  description:
    "Campus presence for brands through events, ambassadors, and influencers — and paid opportunities for students. One team, run end to end.",
  alternates: { canonical: "/services" },
};

const { brands, students } = servicesHub;

function BrandsPanel() {
  return (
    <div>
      <p className="max-w-2xl text-base leading-relaxed text-[color:var(--muted-on-light)] sm:text-lg">
        {brands.intro}
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
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
      />
      <Section tone="light">
        <SectionHeading
          eyebrow="Services"
          title="One team. Two sides of campus."
          intro={servicesHub.intro}
          align="center"
        />
        <div className="mt-10">
          <AudienceTabs
            tabs={[
              { id: "for-brands", label: "For Brands", panel: <BrandsPanel /> },
              { id: "for-students", label: "For Students", panel: <StudentsPanel /> },
            ]}
            defaultId="for-brands"
            anchorTab={{
              events: "for-brands",
              "brand-ambassadors": "for-brands",
              influencers: "for-brands",
            }}
          />
        </div>
      </Section>
    </>
  );
}

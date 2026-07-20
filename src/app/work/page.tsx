import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/SectionHeading";
import { PlaceholderImage } from "@/components/Placeholders";
import { CTASection } from "@/components/CTASection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { caseStudies } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work — Campaigns & case studies",
  description:
    "Metric-led campus campaigns across events, brand ambassadors, and influencers. Sample case studies — real ones are added as they're approved.",
  alternates: { canonical: "/work" },
};

export default function WorkPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
        ]}
      />
      <Section tone="light">
        <SectionHeading
          eyebrow="Work"
          title="Campaigns built for campus, measured by outcomes."
          intro="These are sample slots showing the shape of our case studies — real campaigns land here as clients approve them. Every figure is a placeholder token, not fabricated proof."
        />
      </Section>

      <Section tone="muted" className="pt-0">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06}>
              <Link
                href={`/work/${c.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--border-on-light)] bg-surface shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg"
              >
                <PlaceholderImage
                  label={c.type}
                  index={i}
                  aspect="aspect-[16/10]"
                  className="rounded-none"
                />
                <div className="flex flex-1 flex-col p-6">
                  <Badge>{c.type}</Badge>
                  {/* Metric-forward headline stat */}
                  <div className="mt-4">
                    <div className="font-display text-4xl font-bold tracking-tight text-accent">
                      {c.stat}
                    </div>
                    <div className="text-sm text-[color:var(--muted-on-light)]">
                      {c.statLabel}
                    </div>
                  </div>
                  <h2 className="mt-4 font-display text-lg font-bold text-ink">
                    {c.headline}
                  </h2>
                  <p className="mt-1 text-sm text-[color:var(--muted-on-light)]">{c.brand}</p>
                  <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                    View case study
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection
        title="Want your campaign here?"
        intro="Let's build something worth writing up."
        primary={{ label: "Get Started", href: "/contact", variant: "lime" }}
      />
    </>
  );
}

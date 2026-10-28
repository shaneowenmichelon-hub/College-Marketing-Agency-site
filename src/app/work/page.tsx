import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/SectionHeading";
import { EventImage } from "@/components/EventImage";
import { CaseStudyCover } from "@/components/work/CaseStudyCover";
import { CTASection } from "@/components/CTASection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { caseStudies } from "@/lib/content";
import { caseStudyBlurb, WORK_DESCRIPTION, WORK_H1, WORK_TITLE, workIntro } from "@/lib/indexable-pages";
import { pageMetadata } from "@/lib/seo";
import { CopyBlocks } from "@/components/seo/CopyBlocks";

export const metadata = pageMetadata({
  title: WORK_TITLE,
  description: WORK_DESCRIPTION,
  path: "/work",
});

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
        <SectionHeading as="h1" eyebrow="Work" title={WORK_H1} />
        <CopyBlocks blocks={workIntro()} className="mt-8 max-w-3xl" />
      </Section>

      <Section tone="muted" className="pt-0">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06}>
              <Link
                href={`/work/${c.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[color:var(--border-on-light)] bg-surface shadow-soft transition-all card-press hover:-translate-y-1 hover:shadow-soft-lg"
              >
                <CaseStudyCover
                  scene={c.cover}
                  image={c.image}
                  imageAlt={c.imageAlt}
                  label={c.type}
                  className="aspect-[16/10] w-full"
                />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2">
                    <Badge>{c.type}</Badge>
                    {c.sample && (
                      <span className="mono-label rounded-[2px] border-2 border-ink px-2 py-0.5 text-[9px] font-bold text-[color:var(--muted-on-light)]">
                        Industry example
                      </span>
                    )}
                  </div>
                  <p className="mono-label mt-3 text-[11px] font-bold text-ink">{c.brand}</p>
                  {c.stat && c.statLabel ? (
                    <div className="mt-4">
                      <div className="font-display text-4xl font-bold tracking-tight text-accent">
                        {c.stat}
                      </div>
                      <div className="text-sm text-[color:var(--muted-on-light)]">
                        {c.statLabel}
                      </div>
                    </div>
                  ) : null}
                  <h3 className="mt-4 font-display text-lg font-bold text-ink">
                    {c.headline}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted-on-light)]">
                    {caseStudyBlurb(c)}
                  </p>
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

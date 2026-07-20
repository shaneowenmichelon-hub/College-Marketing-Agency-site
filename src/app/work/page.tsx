import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/SectionHeading";
import { PlaceholderImage } from "@/components/Placeholders";
import { CTASection } from "@/components/CTASection";
import { caseStudies } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work — Campaigns & case studies",
  description:
    "Selected campus campaigns across events, brand ambassadors, and influencers. Case studies are added here as they're approved.",
};

const sections = ["Challenge", "Approach", "Results"];

export default function WorkPage() {
  return (
    <>
      <Section tone="light">
        <SectionHeading
          eyebrow="Work"
          title="Campaigns built for campus."
          intro="These are template slots — real case studies land here as clients approve them. Nothing below is fabricated proof; every figure is a placeholder."
        />
      </Section>

      <Section tone="muted" className="pt-0">
        <div className="space-y-8">
          {caseStudies.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.05}>
              <article
                id={c.slug}
                className="scroll-mt-24 overflow-hidden rounded-3xl border border-[color:var(--border-on-light)] bg-surface shadow-soft"
              >
                <div className="grid lg:grid-cols-2">
                  <PlaceholderImage
                    label={c.type}
                    index={i}
                    aspect="aspect-[16/11]"
                    className="rounded-none"
                  />
                  <div className="flex flex-col justify-center p-8 lg:p-10">
                    <div className="flex items-center gap-3">
                      <Badge>{c.type}</Badge>
                      <span className="text-sm font-semibold text-accent">{c.result}</span>
                    </div>
                    <h2 className="mt-4 font-display text-2xl font-bold text-ink">
                      {c.headline}
                    </h2>
                    <p className="mt-1 text-sm text-[color:var(--muted-on-light)]">
                      {c.brand}
                    </p>
                    <dl className="mt-6 grid gap-4 sm:grid-cols-3">
                      {sections.map((s) => (
                        <div key={s}>
                          <dt className="text-xs font-semibold uppercase tracking-wide text-[color:var(--muted-on-light)]">
                            {s}
                          </dt>
                          <dd className="mt-1 text-sm text-[color:var(--muted-on-light)]/80">
                            To be added.
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </article>
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

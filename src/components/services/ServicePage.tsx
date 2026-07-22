import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Check, type LucideIcon } from "lucide-react";
import { siteConfig, pricing } from "@/site.config";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { ProcessStep } from "@/components/ProcessStep";
import { EventImage } from "@/components/EventImage";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { RelatedInsights } from "@/components/RelatedInsights";
import { postsForService } from "@/lib/content";

export type Tactic = { title: string; body: string };
export type Step = { title: string; body: string };
export type ProofStat = { value: string; label: string };

export type ServicePageProps = {
  slug: "events" | "brand-ambassadors" | "influencers";
  eyebrow: string;
  title: string;
  intro: string;
  overview: string[];
  tacticsHeading: string;
  tactics: Tactic[];
  processHeading: string;
  steps: Step[];
  proof: ProofStat[];
  icon: LucideIcon;
  secondaryCta?: { label: string; href: string };
  /** Rendered right after the pricing block (used for the Events sponsorship directory). */
  afterTactics?: ReactNode;
};

export function ServicePage({
  slug,
  eyebrow,
  title,
  intro,
  overview,
  tacticsHeading,
  tactics,
  processHeading,
  steps,
  proof,
  icon: Icon,
  secondaryCta,
  afterTactics,
}: ServicePageProps) {
  const related = postsForService(slug);
  const price = pricing[slug];
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: eyebrow, path: `/services/${slug}` },
        ]}
      />
      {/* Hero */}
      <section className="grain relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="mesh pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="max-w-3xl py-24 sm:py-28 lg:py-32">
            <Reveal>
              <Badge variant="outline-dark" className="mb-6">
                <Icon className="h-3.5 w-3.5 text-[color:var(--accent-2)]" />
                {eyebrow}
              </Badge>
              <h1 className="text-balance font-display text-4xl font-bold leading-[1.02] sm:text-5xl lg:text-6xl">
                {title}
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted-on-dark)]">
                {intro}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/contact" variant="lime" size="lg">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
                {secondaryCta && (
                  <Button href={secondaryCta.href} variant="ghost-dark" size="lg">
                    {secondaryCta.label}
                  </Button>
                )}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Overview */}
      <Section tone="light">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading eyebrow="Overview" title="What it looks like." />
          <Reveal delay={0.1} className="space-y-4">
            {overview.map((p, i) => (
              <p
                key={i}
                className="text-base leading-relaxed text-[color:var(--muted-on-light)] sm:text-lg"
              >
                {p}
              </p>
            ))}
          </Reveal>
        </div>
      </Section>

      {/* Tactics */}
      <Section tone="muted">
        <SectionHeading eyebrow="Tactics" title={tacticsHeading} />
        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tactics.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.06}>
              <div className="flex h-full gap-3 rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-5 shadow-soft">
                <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Check className="h-3.5 w-3.5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-ink">{t.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-[color:var(--muted-on-light)]">
                    {t.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Pricing */}
      <Section tone="light">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Pricing"
            title="Simple, flexible pricing."
            intro="Straightforward rates to start from — we scope the exact package around your goals."
          />
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-[color:var(--border-on-light)] bg-surface p-8 shadow-soft">
              <p className="text-sm font-medium text-[color:var(--muted-on-light)]">
                {price.included}
              </p>
              <div className="mt-4 flex flex-wrap items-baseline gap-x-3">
                <span className="font-display text-4xl font-bold tracking-tight text-ink sm:text-5xl">
                  {price.range}
                </span>
                <span className="text-base text-[color:var(--muted-on-light)]">
                  {price.unit}
                </span>
              </div>
              <p className="mt-4 text-sm text-[color:var(--muted-on-light)]">{price.note}</p>
              <Button href="/contact" variant="primary" size="md" className="mt-6">
                Get a custom quote <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Reveal>
        </div>
      </Section>

      {afterTactics}

      {/* Process */}
      <Section tone="light">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:items-start">
          <SectionHeading eyebrow="How we run it" title={processHeading} />
          <div className="grid gap-4 sm:grid-cols-2">
            {steps.map((s, i) => (
              <ProcessStep key={s.title} step={i + 1} title={s.title} body={s.body} index={i} />
            ))}
          </div>
        </div>
      </Section>

      {/* Proof strip */}
      <Section tone="dark" grain>
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="Proof"
            onDark
            title="The numbers behind the network."
            intro="The scale behind every campaign as the network stands today."
          />
          <div className="grid grid-cols-3 gap-6">
            {proof.map((p) => (
              <div key={p.label}>
                <div className="font-display text-3xl font-bold text-[color:var(--accent-2)] sm:text-4xl">
                  {p.value}
                </div>
                <div className="mt-1 text-xs text-[color:var(--muted-on-dark)] sm:text-sm">
                  {p.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Imagery */}
      <Section tone="muted">
        <div className="grid gap-4 sm:grid-cols-3">
          <Reveal>
            <EventImage index={4} aspect="aspect-square" />
          </Reveal>
          <Reveal delay={0.08}>
            <EventImage index={5} aspect="aspect-square" />
          </Reveal>
          <Reveal delay={0.16}>
            <EventImage index={6} aspect="aspect-square" />
          </Reveal>
        </div>
      </Section>

      {/* Related insights */}
      {related.length > 0 && (
        <Section tone="light">
          <SectionHeading
            eyebrow="Related insights"
            title="Go deeper."
            intro="Perspective relevant to this service."
          />
          <div className="mt-12">
            <RelatedInsights posts={related} />
          </div>
        </Section>
      )}

      {/* CTA */}
      <Section tone="dark" mesh grain containerClassName="text-center">
        <Reveal className="mx-auto max-w-2xl">
          <h2 className="text-balance font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Let&apos;s put this to work for your brand.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-[color:var(--muted-on-dark)] sm:text-lg">
            Tell us your goal and we&apos;ll build the plan. Backed by the team behind{" "}
            {siteConfig.showCredibility ? "ZMM Events and the Night School tour." : "a national campus operation."}
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/contact" variant="lime" size="lg">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
            {secondaryCta && (
              <Link
                href={secondaryCta.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white"
              >
                {secondaryCta.label} <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </Reveal>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Target, Lightbulb, TrendingUp, ExternalLink } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Reveal } from "@/components/motion/Reveal";
import { EventImage } from "@/components/EventImage";
import { CTASection } from "@/components/CTASection";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { caseStudies, getCaseStudy } from "@/lib/content";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) return { title: "Case study not found" };
  return {
    title: `${c.headline} — Work`,
    description: `${c.type} case study: ${c.headline}. ${c.stat} ${c.statLabel} (sample).`,
    alternates: { canonical: `/work/${slug}` },
  };
}

const sections = [
  { key: "challenge", label: "Challenge", icon: Target },
  { key: "approach", label: "Approach", icon: Lightbulb },
  { key: "results", label: "Results", icon: TrendingUp },
] as const;

export default async function CaseStudyPage({ params }: { params: Params }) {
  const { slug } = await params;
  const c = getCaseStudy(slug);
  if (!c) notFound();

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Work", path: "/work" },
          { name: c.headline, path: `/work/${slug}` },
        ]}
      />

      {/* Hero */}
      <section className="grain relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="mesh pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="max-w-3xl py-20 sm:py-24">
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-white/80 hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" /> All work
            </Link>
            <div className="mt-6 flex flex-wrap items-center gap-2">
              <Badge variant="lime">{c.type}</Badge>
              {c.sample && (
                <span className="mono-label rounded-[2px] border-2 border-white/70 px-2 py-0.5 text-[10px] font-bold text-white/80">
                  Industry example
                </span>
              )}
            </div>
            <h1 className="mt-4 text-balance font-display text-4xl font-bold leading-[1.05] sm:text-5xl">
              {c.headline}
            </h1>
            <p className="mt-3 text-[color:var(--muted-on-dark)]">{c.brand}</p>
            {c.sample && (
              <p className="mono-label mt-4 max-w-xl text-[10px] leading-relaxed text-[color:var(--muted-on-dark)]/80">
                Public industry reference — not a Collegiate Hospitality campaign. Figures are illustrative.
              </p>
            )}
          </div>
        </Container>
      </section>

      {/* Metric callouts */}
      <Section tone="light" className="py-12">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          <div>
            <div className="font-display text-4xl font-bold text-accent sm:text-5xl">
              {c.stat}
            </div>
            <div className="mt-1 text-sm text-[color:var(--muted-on-light)]">
              {c.statLabel}
            </div>
          </div>
          {c.metrics.map((m) => (
            <div key={m.label}>
              <div className="font-display text-4xl font-bold text-ink sm:text-5xl">
                {m.value}
              </div>
              <div className="mt-1 text-sm text-[color:var(--muted-on-light)]">{m.label}</div>
            </div>
          ))}
        </div>
      </Section>

      {/* Challenge / Approach / Results */}
      <Section tone="muted" className="pt-0">
        <div className="grid gap-6 lg:grid-cols-3">
          {sections.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-7 shadow-soft">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <s.icon className="h-5 w-5" aria-hidden />
                </span>
                <h2 className="mt-4 font-display text-xl font-bold text-ink">{s.label}</h2>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-on-light)]">
                  {c[s.key]}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Gallery placeholder */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[12, 13, 14].map((idx, i) => (
            <Reveal key={idx} delay={i * 0.06}>
              <EventImage index={idx} aspect="aspect-square" />
            </Reveal>
          ))}
        </div>

        {/* Sources (industry references) */}
        {c.sources && c.sources.length > 0 && (
          <Reveal className="mt-10">
            <div className="rounded-[3px] border-2 border-ink bg-white p-5 shadow-[6px_6px_0_var(--ink)]">
              <p className="mono-label text-[11px] font-bold text-ink">Sources &amp; further reading</p>
              <ul className="mt-3 space-y-2">
                {c.sources.map((src) => (
                  <li key={src.url}>
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      {src.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        )}
      </Section>

      <CTASection
        title="Ready to build your campaign?"
        primary={{ label: "Get Started", href: "/contact", variant: "lime" }}
        secondary={{ label: "See all work", href: "/work" }}
      />
    </>
  );
}

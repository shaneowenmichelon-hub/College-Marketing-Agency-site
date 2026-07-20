import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/SectionHeading";
import { PlaceholderImage } from "@/components/Placeholders";
import { CTASection } from "@/components/CTASection";
import { posts, formatDate } from "@/lib/content";

export const metadata: Metadata = {
  title: "Insights — Notes on campus marketing & culture",
  description:
    "Perspective on campus marketing, culture, and creators. Placeholder posts for now — replace with real articles before launch.",
  alternates: { canonical: "/insights" },
};

export default function InsightsPage() {
  const [featured, ...rest] = posts;

  return (
    <>
      <Section tone="light">
        <SectionHeading
          eyebrow="Insights"
          title="Notes from the ground."
          intro="Ideas on campus marketing, culture, and creators. These are placeholder posts — swap in real articles before launch."
        />

        {/* Featured */}
        <Reveal className="mt-12">
          <Link
            href={`/insights/${featured.slug}`}
            className="group grid overflow-hidden rounded-3xl border border-[color:var(--border-on-light)] bg-surface shadow-soft transition-all hover:shadow-soft-lg lg:grid-cols-2"
          >
            <PlaceholderImage
              label={featured.category}
              index={0}
              aspect="aspect-[16/10]"
              className="rounded-none"
            />
            <div className="flex flex-col justify-center p-8 lg:p-10">
              <div className="flex items-center gap-3 text-xs text-[color:var(--muted-on-light)]">
                <Badge>{featured.category}</Badge>
                <span>{formatDate(featured.date)}</span>
                <span>· {featured.readingTime}</span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold text-ink group-hover:text-accent sm:text-3xl">
                {featured.title}
              </h2>
              <p className="mt-3 text-[color:var(--muted-on-light)]">{featured.excerpt}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
                Read article <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </Link>
        </Reveal>
      </Section>

      <Section tone="muted" className="pt-0">
        <div className="grid gap-6 md:grid-cols-2">
          {rest.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link
                href={`/insights/${p.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg"
              >
                <div className="flex items-center gap-3 text-xs text-[color:var(--muted-on-light)]">
                  <Badge>{p.category}</Badge>
                  <span>{formatDate(p.date)}</span>
                </div>
                <h3 className="mt-4 font-display text-xl font-bold text-ink group-hover:text-accent">
                  {p.title}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[color:var(--muted-on-light)]">
                  {p.excerpt}
                </p>
                <span className="mt-4 text-xs font-medium text-[color:var(--muted-on-light)]">
                  {p.readingTime}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection
        title="Want to reach students?"
        primary={{ label: "Get Started", href: "/contact", variant: "lime" }}
        secondary={{ label: "Become an Ambassador", href: "/become-an-ambassador" }}
      />
    </>
  );
}

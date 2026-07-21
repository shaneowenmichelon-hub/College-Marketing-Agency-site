import Link from "next/link";
import {
  ArrowRight,
  CalendarHeart,
  Users,
  Megaphone,
  Target,
  MapPin,
  Wallet,
  ClipboardList,
  Sparkles,
  ShieldCheck,
  Rocket,
} from "lucide-react";
import { siteConfig, pricing, clients } from "@/site.config";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Hero } from "@/components/home/Hero";
import { SectionHeading } from "@/components/SectionHeading";
import { ServiceCard } from "@/components/ServiceCard";
import { ProcessStep } from "@/components/ProcessStep";
import { StatCounter } from "@/components/StatCounter";
import { CampusGrid } from "@/components/CampusGrid";
import { ClientMarquee } from "@/components/ClientMarquee";
import { EventImage } from "@/components/EventImage";
import { LeadMagnet } from "@/components/LeadMagnet";
import { CTASection } from "@/components/CTASection";
import { caseStudies, posts, formatDate } from "@/lib/content";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

const serviceIcons = {
  events: CalendarHeart,
  "brand-ambassadors": Users,
  influencers: Megaphone,
} as const;

const process = [
  {
    title: "Understand the goal",
    body: "We start with the outcome you're after — awareness, trial, sign-ups, sales — and work backward from there.",
    icon: Target,
  },
  {
    title: "Pin down the audience",
    body: "Which students, which schools, which scenes. We define exactly who we're trying to reach and where they already are.",
    icon: MapPin,
  },
  {
    title: "Stretch the budget",
    body: "We map spend to impact so every dollar shows up on the ground and online — no waste, no vanity metrics.",
    icon: Wallet,
  },
  {
    title: "Build the media plan",
    body: "Events, ambassadors, and creators combined into one plan built to actually move your number.",
    icon: ClipboardList,
  },
];

const whyUs = [
  {
    title: "Culturally native",
    body: "We don't study campus culture from the outside — we run it. Your brand shows up fluent, not forced.",
    icon: Sparkles,
  },
  {
    title: "On the ground and online",
    body: "Physical activations and social content working together, so a moment on campus becomes a moment in the feed.",
    icon: Rocket,
  },
  {
    title: "A vetted student network",
    body: "Real students, screened and trained — not a spreadsheet of random handles.",
    icon: ShieldCheck,
  },
  {
    title: "Turnkey execution",
    body: "Strategy, staffing, logistics, and reporting handled. You get the results without the operational lift.",
    icon: ClipboardList,
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Trust bar */}
      <Section tone="light" className="py-10 sm:py-12">
        <Reveal className="text-center">
          {siteConfig.showCredibility && (
            <p className="text-sm font-medium text-[color:var(--muted-on-light)]">
              {siteConfig.credibilityLine}
            </p>
          )}
          <p className="mt-2 text-xs uppercase tracking-widest text-[color:var(--muted-on-light)]/70">
            Brands the team has partnered with
          </p>
        </Reveal>
        <div className="mt-8">
          <ClientMarquee clients={clients} />
        </div>
      </Section>

      {/* Positioning */}
      <Section tone="muted">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="What we do"
            title="A modern college-marketing agency built for how students actually live."
            intro="Legacy campus-media shops sell you posters and email blasts. We connect your brand to students through the things they show up for — the events they go to, the friends they trust, and the feeds they scroll. It's marketing that feels native to campus, because it is."
          />
          <Reveal delay={0.1}>
            <EventImage index={1} aspect="aspect-[5/4]" />
          </Reveal>
        </div>
      </Section>

      {/* Stats band */}
      <Section tone="dark" grain>
        <SectionHeading
          eyebrow="The reach"
          onDark
          title="Built to scale across campus."
        />
        <div className="mt-12 grid grid-cols-2 gap-8 sm:gap-10 sm:grid-cols-3 lg:grid-cols-5">
          {siteConfig.stats.map((s) => (
            <StatCounter key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </Section>

      {/* Services */}
      <Section tone="light">
        <SectionHeading
          eyebrow="Services"
          title="Three ways to reach students — one integrated plan."
          intro="Run them on their own or stack them together. Either way, it's one team and one plan."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {siteConfig.services.map((s, i) => (
            <ServiceCard
              key={s.slug}
              icon={serviceIcons[s.slug]}
              title={s.label}
              blurb={s.blurb}
              href={s.href}
              price={`${pricing[s.slug].range} ${pricing[s.slug].unit}`}
              index={i}
            />
          ))}
        </div>
      </Section>

      {/* Process */}
      <Section tone="muted">
        <SectionHeading
          eyebrow="Our process"
          title="How a campaign comes together."
          intro="A simple, repeatable path from goal to plan — designed to make your budget work harder."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {process.map((p, i) => (
            <ProcessStep
              key={p.title}
              step={i + 1}
              title={p.title}
              body={p.body}
              index={i}
            />
          ))}
        </div>
      </Section>

      {/* Campus network */}
      <Section tone="light">
        <SectionHeading
          eyebrow="Campus network"
          title="On the campuses that matter."
          intro="The markets our network spans and is launching across — big-ten towns, SEC country, and major metros where students live, study, and go out."
        />
        <div className="mt-12">
          <CampusGrid />
        </div>
      </Section>

      {/* Work teaser */}
      <Section tone="muted">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Work"
            title="Campaigns in the making."
            intro="Real case studies land here as they're approved. For now, these are the template slots."
          />
          <Reveal>
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
            >
              See all work <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {caseStudies.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.08}>
              <Link
                href={`/work/${c.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border border-[color:var(--border-on-light)] bg-surface shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg"
              >
                <EventImage
                  label={c.type}
                  index={i + 2}
                  aspect="aspect-[16/10]"
                  className="rounded-none"
                />
                <div className="p-6">
                  <Badge>{c.type}</Badge>
                  <h3 className="mt-3 font-display text-lg font-bold text-ink">
                    {c.headline}
                  </h3>
                  <p className="mt-2 text-sm text-[color:var(--muted-on-light)]">
                    {c.brand} ·{" "}
                    <span className="font-semibold text-accent">
                      {c.stat} {c.statLabel}
                    </span>
                  </p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Why us */}
      <Section tone="light">
        <SectionHeading
          eyebrow="Why us"
          title="The difference between reaching students and resonating with them."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {whyUs.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.06}>
              <div className="flex gap-4 rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-6 shadow-soft">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <w.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{w.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--muted-on-light)]">
                    {w.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Student CTA band */}
      <Section tone="dark" mesh grain>
        <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <Reveal className="max-w-2xl">
            <Badge variant="lime" className="mb-4">
              For students
            </Badge>
            <h2 className="text-balance font-display text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
              Get paid to rep brands you actually love.
            </h2>
            <p className="mt-4 text-base text-[color:var(--muted-on-dark)] sm:text-lg">
              Join the ambassador network. Post, activate on campus, and earn —
              cash, free product, and real experience for your resume.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link
              href="/become-an-ambassador"
              className="inline-flex items-center gap-2 rounded-full bg-[color:var(--accent-2)] px-8 py-4 font-medium text-ink transition-transform hover:-translate-y-0.5"
            >
              Apply now <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* Insights teaser */}
      <Section tone="light">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Insights"
            title="Notes from the ground."
            intro="Perspective on campus marketing, culture, and creators."
          />
          <Reveal>
            <Link
              href="/insights"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
            >
              All insights <ArrowRight className="h-4 w-4" />
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {posts.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.08}>
              <Link
                href={`/insights/${p.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg"
              >
                <div className="flex items-center gap-3 text-xs text-[color:var(--muted-on-light)]">
                  <Badge>{p.category}</Badge>
                  <span>{formatDate(p.date)}</span>
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-ink group-hover:text-accent">
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

      {/* Social / Instagram placeholder */}
      <Section tone="light">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Follow along"
            title="Campus, in real time."
            intro="Behind the scenes from activations and creators across the network."
          />
          {(() => {
            const ig = siteConfig.socials.find((s) => s.label === "Instagram");
            return ig?.href ? (
              <Reveal>
                <a
                  href={ig.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent"
                >
                  Follow on Instagram <ArrowRight className="h-4 w-4" />
                </a>
              </Reveal>
            ) : null;
          })()}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[8, 9, 10, 11].map((idx, i) => (
            <Reveal key={idx} delay={i * 0.06}>
              <EventImage index={idx} aspect="aspect-square" />
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Lead magnet */}
      <LeadMagnet />

      {/* Final CTA */}
      <CTASection
        eyebrow="Let's talk"
        title="Ready to reach students?"
        intro="Tell us what you're launching. We'll come back with a plan for how to put it in front of the right campuses."
        primary={{ label: "Get Started", href: "/contact", variant: "lime" }}
        secondary={{ label: "Explore services", href: "/services/events" }}
      />
    </>
  );
}

import type { Metadata } from "next";
import { Compass, Flame, HeartHandshake, Zap } from "lucide-react";
import { siteConfig } from "@/site.config";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/SectionHeading";
import { PlaceholderImage } from "@/components/Placeholders";
import { CTASection } from "@/components/CTASection";

export const metadata: Metadata = {
  title: "About — Built by people who run campus culture",
  description:
    "A modern college-marketing agency built by people who actually run campus and nightlife culture — the fresh alternative to legacy campus-media shops.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: Flame,
    title: "Culture first",
    body: "We build from what students actually care about, not what a media kit says they should.",
  },
  {
    icon: Zap,
    title: "Bias to action",
    body: "We move at the speed of a semester — plan fast, execute faster, learn in real time.",
  },
  {
    icon: HeartHandshake,
    title: "Real relationships",
    body: "Our network is built on trust with students and schools, and we protect it.",
  },
  {
    icon: Compass,
    title: "Honest measurement",
    body: "We report what actually happened. No vanity metrics, no fabricated proof.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Section tone="light">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading
            eyebrow="About"
            title="A campus agency built by people who run the culture."
            intro="We're not a legacy campus-media shop dusting off the same posters and email lists. We're the team that plans the events, knows the promoters, and understands why students show up — building the modern, culturally-native way for brands to reach campus."
          />
          <Reveal delay={0.1}>
            <PlaceholderImage label="Team / culture photo" index={2} aspect="aspect-[5/4]" />
          </Reveal>
        </div>
      </Section>

      <Section tone="dark" grain>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            onDark
            eyebrow="Our story"
            title="From the dance floor to the campus quad."
          />
          <Reveal delay={0.1} className="space-y-4 text-[color:var(--muted-on-dark)]">
            {siteConfig.showCredibility && (
              <p className="text-lg">
                We&apos;re backed by the team behind{" "}
                <span className="text-white">ZMM Events</span> and the{" "}
                <span className="text-white">Night School college tour</span> — a
                national events operation with deep campus and nightlife roots.
              </p>
            )}
            <p>
              That pedigree is the whole point: we&apos;ve spent years earning
              students&apos; attention in the rooms where it&apos;s hardest to earn.
              This agency brings that same instinct to brands — pairing on-the-ground
              activation with the online reach of a vetted student network.
            </p>
            <p>
              We&apos;re building the fresh alternative to the campus-marketing status
              quo. Modern, honest, and genuinely native to the way students live now.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section tone="light">
        <SectionHeading eyebrow="What we value" title="How we work." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          {values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.06}>
              <div className="flex gap-4 rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-6 shadow-soft">
                <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <v.icon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-ink">{v.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--muted-on-light)]">
                    {v.body}
                  </p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="Team"
          title="The people behind it."
          intro="Team bios and photos go here. Placeholder cards for now — no fabricated names."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Reveal key={i} delay={i * 0.06}>
              <div className="rounded-2xl border border-dashed border-[color:var(--border-on-light)] bg-surface p-5 text-center">
                <div className="mx-auto h-24 w-24 rounded-full bg-surface-muted" aria-hidden />
                <p className="mt-4 font-display text-base font-bold text-ink">
                  Team member
                </p>
                <p className="text-xs text-[color:var(--muted-on-light)]">
                  Role — to be added
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection
        title="Let's build something on campus."
        intro="Whether you're a brand or a student, there's a place for you here."
        primary={{ label: "Get Started", href: "/contact", variant: "lime" }}
        secondary={{ label: "Become an Ambassador", href: "/become-an-ambassador" }}
      />
    </>
  );
}

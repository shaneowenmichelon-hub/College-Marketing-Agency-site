import type { Metadata } from "next";
import {
  Banknote,
  CalendarClock,
  Gift,
  Rocket,
  Send,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { ApplyForm } from "@/components/forms/ApplyForm";

export const metadata: Metadata = {
  title: "Become an Ambassador — Get paid to rep brands you love",
  description:
    "Join the student ambassador network. Apply, get matched with brands, post and activate on campus, and get paid — cash, free product, and real resume experience.",
};

const steps = [
  { icon: Send, title: "Apply", body: "Fill out the application below. Takes about 5 minutes." },
  { icon: Users, title: "Get matched", body: "We pair you with brands that fit your campus and vibe." },
  { icon: Rocket, title: "Post & activate", body: "Rep the brand online and at on-campus activations." },
  { icon: Banknote, title: "Get paid", body: "Earn cash and product for the work you do." },
];

const benefits = [
  { icon: Banknote, title: "Real money", body: "Get paid for activations, content, and referrals — not just exposure." },
  { icon: Gift, title: "Free product", body: "First access to gear, samples, and drops from brands students actually want." },
  { icon: CalendarClock, title: "Flexible", body: "Work around your class schedule. You choose what you take on." },
  { icon: Star, title: "Resume & portfolio", body: "Real marketing experience and content you can show off after graduation." },
];

export default function BecomeAnAmbassadorPage() {
  return (
    <>
      {/* Hero */}
      <section className="grain relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="mesh pointer-events-none absolute inset-0" />
        <Container className="relative">
          <div className="max-w-3xl py-24 sm:py-28">
            <Reveal>
              <Badge variant="lime" className="mb-6">
                <Sparkles className="h-3.5 w-3.5" />
                For students
              </Badge>
              <h1 className="text-balance font-display text-4xl font-bold leading-[1.02] sm:text-5xl lg:text-6xl">
                Get paid to rep the brands you love.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-[color:var(--muted-on-dark)]">
                Join the ambassador network. Post, show up at campus activations, and
                earn — cash, free product, and experience that actually looks good on a
                resume.
              </p>
              <div className="mt-8">
                <Button href="#apply" variant="lime" size="lg">
                  Apply now
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* How it works */}
      <Section tone="light">
        <SectionHeading eyebrow="How it works" title="Four steps to getting paid." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <div className="flex h-full flex-col rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-6 shadow-soft">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <s.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">
                  {i + 1}. {s.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--muted-on-light)]">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Benefits */}
      <Section tone="muted">
        <SectionHeading eyebrow="Perks" title="Why students join." />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b, i) => (
            <Reveal key={b.title} delay={i * 0.06}>
              <div className="flex h-full flex-col rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-6 shadow-soft">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[color:var(--accent-2)] text-ink">
                  <b.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">{b.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--muted-on-light)]">
                  {b.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Application */}
      <Section tone="light" id="apply">
        <div className="mx-auto max-w-2xl">
          <SectionHeading
            align="center"
            className="mx-auto"
            eyebrow="Application"
            title="Apply to the network."
            intro="Takes about 5 minutes. You must be 18+ and a current student with a .edu email."
          />
          <div className="mt-10">
            <ApplyForm />
          </div>
        </div>
      </Section>
    </>
  );
}

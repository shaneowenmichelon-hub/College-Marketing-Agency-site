"use client";

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CheckCircle2, MapPin, Megaphone, Repeat2, Share2, ShoppingBag, Sparkles, Users } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/SectionHeading";
import { StatCounter } from "@/components/StatCounter";
import { getStat, pricing } from "@/site.config";
import { cn } from "@/lib/utils";

const journey = [
  {
    label: "See",
    icon: Megaphone,
    color: "bg-[color:var(--accent)] text-white",
    body: "Your brand enters the campus feed and the places students already gather.",
  },
  {
    label: "Show up",
    icon: MapPin,
    color: "bg-[color:var(--accent-2)] text-ink",
    body: "Ambassadors, events, and placements put the brand in real student routines.",
  },
  {
    label: "Try",
    icon: Sparkles,
    color: "bg-[color:var(--magenta)] text-white",
    body: "Product gets into hands through drops, booths, sampling, and social moments.",
  },
  {
    label: "Share",
    icon: Share2,
    color: "bg-[color:var(--orange)] text-white",
    body: "The activation turns into posts, stories, group chats, and campus conversation.",
  },
  {
    label: "Trust",
    icon: Users,
    color: "bg-white text-ink",
    body: "Repetition from real students makes the brand feel familiar instead of forced.",
  },
  {
    label: "Choose",
    icon: ShoppingBag,
    color: "bg-[color:var(--accent)] text-white",
    body: "When the buying moment hits, the known brand gets the first shot.",
  },
  {
    label: "Scale",
    icon: Repeat2,
    color: "bg-[color:var(--accent-2)] text-ink",
    body: "Reports show what worked, then we repeat it across the next campus.",
  },
] as const;

const offers = [
  {
    label: "Events",
    href: "/services#events",
    price: `${pricing.events.range} ${pricing.events.unit}`.trim(),
    body: "Put the brand inside the nightlife, welcome-week, and campus moments students actually attend.",
  },
  {
    label: "Brand Ambassadors",
    href: "/services#brand-ambassadors",
    price: `${pricing["brand-ambassadors"].range} ${pricing["brand-ambassadors"].unit}`.trim(),
    body: "Turn vetted students into the repeated voice that makes the campaign feel native on campus.",
  },
  {
    label: "Product Placement",
    href: "/services#product-placement",
    price: `${pricing["product-placement"].range} ${pricing["product-placement"].unit}`.trim(),
    body: "Place product directly into Greek life, events, organizations, and content moments.",
  },
] as const;

export function CampusAttentionJourney() {
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const current = journey[active];
  const ActiveIcon = current.icon;

  const stats = useMemo(
    () => [
      { value: getStat("campuses"), label: "campus markets" },
      { value: getStat("ambassadors"), label: "student ambassadors" },
      { value: getStat("studentsReached"), label: "students reached" },
    ],
    [],
  );

  return (
    <Section tone="light" id="campus-attention-journey" className="border-y-2 border-ink bg-surface">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <SectionHeading
            eyebrow="Campus attention game"
            title="Students buy what keeps showing up."
            intro="Campus attention compounds through repeated, native touchpoints: the event they attend, the ambassador they trust, the product they try, and the post they see afterward."
          />

          <div className="mt-8 grid grid-cols-3 gap-3">
            {stats.map((s) => (
              <StatCounter key={s.label} value={s.value} label={s.label} className="bg-ink p-3" />
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/contact" variant="primary">
              Build my campus plan <ArrowRight className="h-4 w-4" />
            </Button>
            <Button href="/services" variant="secondary">
              See services
            </Button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-[3px] border-2 border-ink bg-[color:var(--surface-muted)] p-4 shadow-[8px_8px_0_var(--ink)] sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="mono-label text-[11px] font-bold text-accent">The 7 campus touchpoints</p>
              <p className="mono-label text-[10px] text-[color:var(--muted-on-light)]">tap a step</p>
            </div>

            <div className="grid grid-cols-7 gap-2" role="tablist" aria-label="Campus attention journey steps">
              {journey.map((step, i) => {
                const Icon = step.icon;
                const selected = i === active;
                return (
                  <button
                    key={step.label}
                    type="button"
                    role="tab"
                    aria-selected={selected}
                    aria-controls="campus-attention-panel"
                    onClick={() => setActive(i)}
                    className={cn(
                      "group flex min-h-16 flex-col items-center justify-center gap-1 rounded-[3px] border-2 border-ink px-1 py-2 text-center transition-all brutal-press",
                      selected ? `${step.color} shadow-[4px_4px_0_var(--ink)] -translate-y-0.5` : "bg-white hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--ink)]",
                    )}
                  >
                    <Icon className="h-4 w-4" aria-hidden />
                    <span className="hidden text-[10px] font-bold uppercase leading-none tracking-tight sm:inline">{step.label}</span>
                    <span className="text-[10px] font-black sm:hidden">{i + 1}</span>
                  </button>
                );
              })}
            </div>

            <motion.div
              id="campus-attention-panel"
              key={current.label}
              role="tabpanel"
              initial={reduce ? false : { opacity: 0, y: 10 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.22 }}
              className={cn("mt-5 rounded-[3px] border-2 border-ink p-5 shadow-[5px_5px_0_var(--ink)]", current.color)}
            >
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-white text-ink">
                  <ActiveIcon className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <p className="mono-label text-[11px] opacity-80">Step {active + 1} / 7</p>
                  <h3 className="mt-1 font-display text-3xl font-bold">{current.label}</h3>
                  <p className="mt-3 max-w-xl text-base leading-relaxed">{current.body}</p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {offers.map((offer, i) => (
              <a
                key={offer.label}
                href={offer.href}
                className={cn(
                  "group flex min-h-full flex-col rounded-[3px] border-2 border-ink p-5 shadow-[5px_5px_0_var(--ink)] transition-all hover:-translate-y-1 hover:shadow-[8px_8px_0_var(--ink)]",
                  i === 0 && "bg-[color:var(--accent)] text-white",
                  i === 1 && "bg-[color:var(--accent-2)] text-ink",
                  i === 2 && "bg-[color:var(--magenta)] text-white",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="mono-label text-[10px] opacity-80">way to play</p>
                  <CheckCircle2 className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-5 font-display text-2xl font-bold">{offer.label}</h3>
                <p className="mt-2 text-sm font-bold opacity-90">{offer.price}</p>
                <p className="mt-4 text-sm leading-relaxed opacity-90">{offer.body}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-bold underline decoration-2 underline-offset-4">
                  Learn more <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { pop } from "@/lib/confetti";
import { eventSponsorships, type SponsorshipGroup, type SponsorshipItem } from "@/site.config";

type Tier = "base" | "presenting";

// Per-chapter dopamine accent (flat blocks, no gradient).
const CHAPTER_ACCENT = ["var(--accent)", "var(--magenta)", "var(--orange)", "var(--accent-2)"];

function inquireHref(groupId: string, tier: Tier, item?: string) {
  const p = new URLSearchParams({
    utm_source: "sponsorship_directory",
    utm_medium: "events_page",
    utm_campaign: groupId,
    utm_content: tier,
  });
  if (item) p.set("utm_term", item);
  return `/contact?${p.toString()}`;
}

function priceFor(item: SponsorshipItem, group: SponsorshipGroup, tier: Tier): string {
  if (tier === "presenting") {
    return item.presentingSponsor ?? (group.groupPricing ? "See annual" : "[$ —]");
  }
  return item.basePackage ?? (group.groupPricing ? "See annual" : "[$ —]");
}

function TierPicker({
  tier,
  onPick,
  accent,
}: {
  tier: Tier;
  onPick: (t: Tier) => void;
  accent: string;
}) {
  return (
    <div className="inline-flex rounded-[3px] border-2 border-ink shadow-[3px_3px_0_var(--ink)]">
      {(["base", "presenting"] as Tier[]).map((t, i) => (
        <button
          key={t}
          type="button"
          aria-pressed={tier === t}
          onClick={() => {
            onPick(t);
            if (t === "presenting") pop(0.5, 0.5);
          }}
          className={cn(
            "mono-label min-h-[44px] px-5 py-2.5 text-[11px] font-bold transition-colors",
            i === 0 && "border-r-2 border-ink",
            tier === t ? "text-ink" : "bg-white text-[color:var(--muted-on-light)]",
          )}
          style={tier === t ? { backgroundColor: accent } : undefined}
        >
          {t === "base" ? "Base" : "Presenting"}
        </button>
      ))}
    </div>
  );
}

function Chapter({ group, index }: { group: SponsorshipGroup; index: number }) {
  const reduce = useReducedMotion();
  const [tier, setTier] = useState<Tier>("base");
  const accent = CHAPTER_ACCENT[index % CHAPTER_ACCENT.length];

  const reveal = {
    hidden: { opacity: 0, y: reduce ? 0 : 40, rotate: reduce ? 0 : -1.5 },
    show: (i: number) => ({
      opacity: 1,
      y: 0,
      rotate: 0,
      transition: { duration: 0.5, delay: reduce ? 0 : Math.min(i * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] as const },
    }),
  };

  return (
    <section className="scroll-mt-24 border-t-2 border-ink pt-10 first:border-t-0 first:pt-0">
      {/* Chapter header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mono-label text-xs font-bold" style={{ color: accent }}>
            Chapter {String(index + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-1 font-display text-display-sm font-bold text-ink">{group.title}</h3>
          <p className="mt-1 max-w-xl text-sm text-[color:var(--muted-on-light)]">{group.intro}</p>
        </div>
        {!group.comingSoon && (
          <div className="flex flex-col items-start gap-2">
            <span className="mono-label text-[10px] text-[color:var(--muted-on-light)]">
              Pick your level
            </span>
            <TierPicker tier={tier} onPick={setTier} accent={accent} />
          </div>
        )}
      </div>

      {/* Portfolio-level pricing */}
      {group.groupPricing && (
        <div className="mt-6 grid gap-4 rounded-[3px] border-2 border-ink bg-white p-5 shadow-[6px_6px_0_var(--ink)] sm:grid-cols-2">
          <div className={cn("rounded-[2px] p-3", tier === "base" && "ring-2 ring-ink")} style={{ backgroundColor: tier === "base" ? accent : "transparent" }}>
            <div className="mono-label text-[10px] font-bold text-ink">Base</div>
            <div className="mt-1 font-display text-lg font-bold text-ink">{group.groupPricing.base}</div>
          </div>
          <div className={cn("rounded-[2px] p-3", tier === "presenting" && "ring-2 ring-ink")} style={{ backgroundColor: tier === "presenting" ? accent : "transparent" }}>
            <div className="mono-label text-[10px] font-bold text-ink">Presenting</div>
            <div className="mt-1 font-display text-lg font-bold text-ink">{group.groupPricing.presenting}</div>
          </div>
        </div>
      )}

      {/* Coming soon */}
      {group.comingSoon ? (
        <div className="mt-6 flex flex-col items-start gap-3 rounded-[3px] border-2 border-dashed border-ink bg-surface-muted p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 shrink-0 text-accent" aria-hidden />
            <p className="text-sm font-medium text-ink">More events &amp; venues coming soon.</p>
          </div>
          <Link
            href={inquireHref(group.id, "base")}
            className="mono-label inline-flex items-center gap-1.5 rounded-[3px] border-2 border-ink bg-accent px-5 py-2 text-[11px] font-bold text-white shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
          >
            Get in touch to be first <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {group.items.map((item, i) => (
            <motion.div
              key={item.name}
              custom={i}
              variants={reveal}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              className="group/card flex h-full flex-col rounded-[3px] border-2 border-ink bg-white p-5 shadow-[5px_5px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h4 className="font-display text-lg font-bold text-ink">{item.name}</h4>
                  <p className="mt-1 text-sm text-[color:var(--muted-on-light)]">{item.description}</p>
                </div>
                <span
                  className="mono-label shrink-0 rounded-[2px] border-2 border-ink px-2 py-0.5 text-[9px] font-bold text-ink"
                  style={{ backgroundColor: accent }}
                >
                  {tier === "presenting" ? "TOP" : "BASE"}
                </span>
              </div>

              {/* All three tiers stay visible + readable; selected tier highlighted */}
              <div className="mt-4 grid grid-cols-3 gap-2 border-t-2 border-ink/10 pt-3">
                <Stat label="Reach / event" value={item.valuePerEvent} />
                <Stat label="Base" value={priceFor(item, group, "base")} active={tier === "base"} accent={accent} />
                <Stat label="Presenting" value={priceFor(item, group, "presenting")} active={tier === "presenting"} accent={accent} />
              </div>

              {/* What's included at the selected tier */}
              {(tier === "presenting" ? item.presentingDetail : item.baseDetail) && (
                <p className="mt-3 rounded-[2px] border-l-4 border-ink bg-surface-muted px-3 py-2 text-xs leading-relaxed text-ink">
                  <span className="mono-label mr-1 font-bold text-accent">
                    {tier === "presenting" ? "Presenting:" : "Base:"}
                  </span>
                  {tier === "presenting" ? item.presentingDetail : item.baseDetail}
                </p>
              )}

              <Link
                href={inquireHref(group.id, tier, item.name)}
                className="mono-label mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-accent hover:underline"
              >
                Inquire — {tier === "presenting" ? "Presenting" : "Base"} tier <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

function Stat({
  label,
  value,
  active,
  accent,
}: {
  label: string;
  value: string;
  active?: boolean;
  accent?: string;
}) {
  return (
    <div
      className={cn("rounded-[2px] p-2 transition-colors", active && "text-ink")}
      style={active && accent ? { backgroundColor: accent } : undefined}
    >
      <div className="mono-label text-[9px] text-[color:var(--muted-on-light)]">{label}</div>
      <div className="font-display text-sm font-bold text-ink">{value}</div>
    </div>
  );
}

/** The gamified "Sponsor an event or trip" reel — Events service page. */
export function EventSponsorships() {
  return (
    <Section tone="muted" id="sponsor">
      <SectionHeading eyebrow="Sponsorships" title="Sponsor an event or trip." intro={eventSponsorships.intro} />
      <div className="mt-4 flex items-center gap-2 text-[color:var(--muted-on-light)]">
        <Lock className="h-4 w-4" aria-hidden />
        <span className="mono-label text-[11px]">Scroll to unlock each chapter · pick a level to pre-tag your inquiry</span>
      </div>
      <div className="mt-12 space-y-14">
        {eventSponsorships.groups.map((group, i) => (
          <Chapter key={group.id} group={group} index={i} />
        ))}
      </div>
    </Section>
  );
}

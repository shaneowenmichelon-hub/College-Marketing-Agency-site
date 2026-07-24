"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles, Lock, Camera, X, ChevronLeft, ChevronRight, Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { pop } from "@/lib/confetti";
import {
  eventSponsorships,
  type SponsorshipGroup,
  type SponsorshipItem,
  type SponsorshipTier,
  type SponsorshipProof,
  type SponsorshipGallery,
} from "@/site.config";

type Tier = "base" | "presenting";

// Per-chapter dopamine accent (flat blocks, no gradient).
const CHAPTER_ACCENT = ["var(--accent)", "var(--magenta)", "var(--orange)", "var(--accent-2)"];

/**
 * Build a pre-tagged /contact link. UTM params are captured into the lead's
 * attribution (see lib/client-forms) and carried into the notification email;
 * `msg` pre-fills a readable line so the inquiry says which market + tier.
 */
function inquireHref(groupId: string, tier: string, item?: string, msg?: string) {
  const p = new URLSearchParams({
    utm_source: "sponsorship_directory",
    utm_medium: "events_page",
    utm_campaign: groupId,
    utm_content: tier,
  });
  if (item) p.set("utm_term", item);
  if (msg) p.set("msg", msg);
  return `/contact?${p.toString()}`;
}

function priceFor(item: SponsorshipItem, group: SponsorshipGroup, tier: Tier): string {
  if (tier === "presenting") {
    return item.presentingSponsor ?? (group.groupPricing ? "See annual" : "[$ —]");
  }
  return item.basePackage ?? (group.groupPricing ? "See annual" : "[$ —]");
}

function shortTier(name: string): string {
  return name.split(/\s+/)[0];
}

// ── Site-wide "view past activation photos" link (any group, any item) ────────
function PhotosLink({ url }: { url?: string }) {
  if (!url) return null;
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer"
      className="mono-label mt-3 inline-flex items-center gap-1.5 text-[11px] font-bold text-[color:var(--muted-on-light)] hover:text-accent"
    >
      <Camera className="h-3.5 w-3.5" /> View past activation photos <ArrowRight className="h-3.5 w-3.5" />
    </a>
  );
}

// ── Base/Presenting picker (two-field groups) ─────────────────────────────────
function TierPicker({ tier, onPick, accent }: { tier: Tier; onPick: (t: Tier) => void; accent: string }) {
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

function Stat({ label, value, active, accent }: { label: string; value: string; active?: boolean; accent?: string }) {
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

// ── Festival market card: three tiers + benefits + pre-tagged inquiry ─────────
function MarketCard({
  item,
  group,
  accent,
  index,
}: {
  item: SponsorshipItem;
  group: SponsorshipGroup;
  accent: string;
  index: number;
}) {
  const reduce = useReducedMotion();
  const tiers = item.tiers ?? [];
  const [active, setActive] = useState(0);
  const tier: SponsorshipTier | undefined = tiers[active];

  const reveal = {
    hidden: { opacity: 0, y: reduce ? 0 : 32 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, delay: reduce ? 0 : Math.min(index * 0.06, 0.3), ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <motion.div
      variants={reveal}
      initial="show"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      className="flex h-full flex-col rounded-[3px] border-2 border-ink bg-white p-5 shadow-[5px_5px_0_var(--ink)]"
    >
      {/* Market header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-display text-lg font-bold text-ink">{item.name}</h4>
          {(item.venue || item.eventDate) && (
            <p className="mono-label mt-1 text-[10px] text-[color:var(--muted-on-light)]">
              {[item.venue, item.eventDate].filter(Boolean).join(" · ")}
            </p>
          )}
        </div>
        {item.capacity && (
          <span
            className="mono-label shrink-0 rounded-[2px] border-2 border-ink px-2 py-0.5 text-[9px] font-bold text-ink"
            style={{ backgroundColor: accent }}
          >
            {item.capacity} cap
          </span>
        )}
      </div>

      {/* Tier selector */}
      <div className="mt-4 grid grid-cols-3 gap-0 rounded-[3px] border-2 border-ink shadow-[3px_3px_0_var(--ink)]">
        {tiers.map((t, i) => (
          <button
            key={t.name}
            type="button"
            aria-pressed={active === i}
            onClick={() => {
              setActive(i);
              if (i === 0) pop(0.5, 0.5);
            }}
            className={cn(
              "mono-label min-h-[44px] px-2 py-2 text-[10px] font-bold transition-colors",
              i < tiers.length - 1 && "border-r-2 border-ink",
              active === i ? "text-ink" : "bg-white text-[color:var(--muted-on-light)]",
            )}
            style={active === i ? { backgroundColor: accent } : undefined}
          >
            {shortTier(t.name)}
          </button>
        ))}
      </div>

      {tier && (
        <>
          {/* Price + summary */}
          <div className="mt-4 flex items-baseline justify-between gap-2 border-t-2 border-ink/10 pt-3">
            <span className="font-display text-2xl font-bold text-ink">{tier.price}</span>
            <span className="mono-label text-right text-[10px] font-bold text-ink">
              {tier.name}
              {tier.exclusive && (
                <span className="ml-1 inline-flex items-center gap-0.5 text-accent">
                  <Star className="h-3 w-3" aria-hidden /> exclusive
                </span>
              )}
            </span>
          </div>
          {tier.summary && (
            <p className="mt-1 text-xs text-[color:var(--muted-on-light)]">{tier.summary}</p>
          )}

          {/* Benefits */}
          <ul className="mt-3 space-y-1.5">
            {tier.benefits.map((b) => (
              <li key={b} className="flex gap-2 text-xs leading-relaxed text-ink">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-4">
            <Link
              href={inquireHref(
                group.id,
                tier.name,
                item.name,
                `Inquiry: ${group.title} — ${item.name} (${tier.name})`,
              )}
              className="mono-label inline-flex items-center gap-1.5 rounded-[3px] border-2 border-ink bg-accent px-4 py-2.5 text-[11px] font-bold text-white shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
            >
              Inquire about sponsoring <ArrowRight className="h-4 w-4" />
            </Link>
            <PhotosLink url={item.photosUrl} />
          </div>
        </>
      )}
    </motion.div>
  );
}

// ── Season bundle upsell ──────────────────────────────────────────────────────
function SeasonBundle({ group, accent }: { group: SponsorshipGroup; accent: string }) {
  const bundle = group.seasonBundle;
  if (!bundle) return null;
  return (
    <div className="mt-8 rounded-[3px] border-2 border-ink bg-ink p-6 text-white shadow-[6px_6px_0_var(--accent)]">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="mono-label text-[10px] font-bold" style={{ color: accent }}>
            Season play
          </span>
          <h4 className="mt-1 font-display text-xl font-bold">Own the full 2027 season</h4>
          <p className="mt-1 max-w-md text-sm text-white/70">{bundle.intro}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {bundle.tiers.map((t) => (
          <div key={t.name} className="rounded-[2px] border-2 border-white/20 bg-white/5 p-4">
            <div className="mono-label text-[10px] font-bold text-white/70">{t.name}</div>
            <div className="mt-1 font-display text-2xl font-bold text-white">{t.price}</div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-white/60">{bundle.note}</p>
      <Link
        href={inquireHref(group.id, "Full season", "All four markets", `Inquiry: ${group.title} — full 2027 season bundle`)}
        className="mono-label mt-5 inline-flex items-center gap-1.5 rounded-[3px] border-2 border-white bg-white px-5 py-2.5 text-[11px] font-bold text-ink transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
      >
        Inquire about the season bundle <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// ── On-site consumption bar comparison ────────────────────────────────────────
function DrinkBars({ consumption, accent }: { consumption: SponsorshipProof["consumption"]; accent: string }) {
  const max = Math.max(...consumption.byProduct.map((d) => d.cases), 1);
  return (
    <div className="rounded-[3px] border-2 border-ink bg-white p-5 shadow-[5px_5px_0_var(--ink)]">
      <h5 className="font-display text-base font-bold text-ink">On-site consumption</h5>
      <p className="mt-1 text-sm text-[color:var(--muted-on-light)]">{consumption.intro}</p>
      <div className="mt-4 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-display text-3xl font-bold text-ink">{consumption.totalDrinks}</span>
        <span className="mono-label text-[11px] font-bold text-[color:var(--muted-on-light)]">
          drinks sold · {consumption.revenue} on-site beverage revenue
        </span>
      </div>
      <ul className="mt-4 space-y-2">
        {consumption.byProduct.map((d) => (
          <li key={d.name} className="flex items-center gap-3">
            <span className="w-32 shrink-0 text-xs font-medium text-ink sm:w-40">{d.name}</span>
            <span className="flex-1">
              <span
                className="block h-4 rounded-[2px] border-2 border-ink"
                style={{ width: `${Math.max((d.cases / max) * 100, 6)}%`, backgroundColor: accent }}
              />
            </span>
            <span className="mono-label w-16 shrink-0 text-right text-[11px] font-bold text-ink">
              {d.cases} cs
            </span>
          </li>
        ))}
      </ul>
      <p className="mono-label mt-3 text-[9px] text-[color:var(--muted-on-light)]">
        Case volume by product · cs = cases
      </p>
    </div>
  );
}

// ── Captioned insight screenshot (evidence, hides if the file is missing) ─────
function InsightFigure({ src, caption, alt }: { src: string; caption: string; alt: string }) {
  const [broken, setBroken] = useState(false);
  return (
    <figure className="rounded-[3px] border-2 border-ink bg-white p-2 shadow-[4px_4px_0_var(--ink)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[2px] border border-ink/10 bg-surface-muted">
        {broken ? (
          <div className="flex h-full items-center justify-center px-4 text-center">
            <span className="mono-label text-[10px] text-[color:var(--muted-on-light)]">
              Screenshot available on request
            </span>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            className="object-contain"
            onError={() => setBroken(true)}
          />
        )}
      </div>
      <figcaption className="mono-label mt-2 text-center text-[10px] font-bold text-ink">{caption}</figcaption>
    </figure>
  );
}

// ── "Why Thaw Out works" proof block ──────────────────────────────────────────
function ProofBlock({ proof, accent }: { proof: SponsorshipProof; accent: string }) {
  return (
    <div className="mt-6 rounded-[3px] border-2 border-ink bg-surface-muted p-6 sm:p-8">
      <span className="mono-label text-[10px] font-bold" style={{ color: accent }}>
        Diligence
      </span>
      <h4 className="mt-1 font-display text-display-sm font-bold text-ink">{proof.heading}</h4>
      <p className="mt-2 max-w-2xl text-sm text-[color:var(--muted-on-light)]">{proof.intro}</p>

      {/* Reach stats */}
      <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {proof.reachStats.map((s) => (
          <div key={s.label} className="rounded-[3px] border-2 border-ink bg-white p-4 shadow-[4px_4px_0_var(--ink)]">
            <div className="font-display text-2xl font-bold text-ink sm:text-3xl">{s.value}</div>
            <div className="mono-label mt-1 text-[10px] text-[color:var(--muted-on-light)]">{s.label}</div>
          </div>
        ))}
      </div>
      <p className="mono-label mt-3 text-[11px] font-bold text-ink">{proof.giveawayBenchmark}</p>

      {/* Audience + optional insight screenshots */}
      <div className={cn("mt-6 grid gap-4", proof.insights.length > 0 && "lg:grid-cols-2")}>
        <div className="rounded-[3px] border-2 border-ink bg-white p-5 shadow-[5px_5px_0_var(--ink)]">
          <h5 className="font-display text-base font-bold text-ink">Audience profile</h5>
          <p className="mt-1 text-sm text-[color:var(--muted-on-light)]">{proof.audience.intro}</p>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {proof.audience.stats.map((s) => (
              <div key={s.label} className="rounded-[2px] border-2 border-ink p-3" style={{ backgroundColor: accent }}>
                <div className="font-display text-2xl font-bold text-ink">{s.value}</div>
                <div className="mono-label text-[10px] font-bold text-ink">{s.label}</div>
              </div>
            ))}
          </div>
          <ul className="mt-4 space-y-1.5">
            {proof.audience.notes.map((n) => (
              <li key={n} className="flex gap-2 text-xs text-ink">
                <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                <span>{n}</span>
              </li>
            ))}
          </ul>
        </div>
        {proof.insights.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            {proof.insights.map((shot) => (
              <InsightFigure key={shot.src} src={shot.src} caption={shot.caption} alt={shot.alt} />
            ))}
          </div>
        )}
      </div>

      {/* Consumption bars */}
      <div className="mt-6">
        <DrinkBars consumption={proof.consumption} accent={accent} />
      </div>

      {/* Viral moment (labeled estimate) */}
      <div className="mt-6 rounded-[3px] border-l-4 border-ink bg-white p-5">
        <h5 className="mono-label text-[11px] font-bold text-accent">Viral proof</h5>
        <p className="mt-2 text-sm text-ink">{proof.viral.body}</p>
        <p className="mono-label mt-2 text-[11px] font-bold text-[color:var(--muted-on-light)]">
          {proof.viral.label}
        </p>
      </div>

      {/* Case studies (text only — no third-party logos) */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {proof.caseStudies.map((c) => (
          <div key={c.brand} className="rounded-[3px] border-2 border-ink bg-white p-5 shadow-[4px_4px_0_var(--ink)]">
            <h5 className="font-display text-base font-bold text-ink">{c.brand}</h5>
            <p className="mt-2 text-sm text-[color:var(--muted-on-light)]">{c.body}</p>
          </div>
        ))}
      </div>

      {/* Talent + athletes */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="rounded-[3px] border-2 border-ink bg-white p-5">
          <h5 className="font-display text-base font-bold text-ink">Talent</h5>
          <p className="mt-1 text-sm text-[color:var(--muted-on-light)]">{proof.talent.intro}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {proof.talent.performers.map((p) => (
              <span
                key={p}
                className="mono-label rounded-[2px] border-2 border-ink bg-surface-muted px-2.5 py-1 text-[10px] font-bold text-ink"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="rounded-[3px] border-2 border-ink bg-white p-5">
          <h5 className="font-display text-base font-bold text-ink">Athlete integration</h5>
          <p className="mt-1 text-sm text-[color:var(--muted-on-light)]">{proof.athletes}</p>
        </div>
      </div>
    </div>
  );
}

// ── Photo gallery + lightbox (missing files hide gracefully) ──────────────────
function Gallery({ gallery, groupId }: { gallery: SponsorshipGallery; groupId: string }) {
  const INLINE = 8;
  const [broken, setBroken] = useState<Set<number>>(new Set());
  const [expanded, setExpanded] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);

  const markBroken = (i: number) => setBroken((prev) => new Set(prev).add(i));
  const visible = gallery.files.map((f, i) => ({ f, i })).filter(({ i }) => !broken.has(i));
  const shown = expanded ? visible : visible.slice(0, INLINE);

  // Keyboard nav for the lightbox.
  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((c) => (c === null ? c : next(c)));
      if (e.key === "ArrowLeft") setLightbox((c) => (c === null ? c : prev(c)));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lightbox, visible.length]);

  function next(cur: number) {
    const order = visible.map((v) => v.i);
    const at = order.indexOf(cur);
    return order[(at + 1) % order.length];
  }
  function prev(cur: number) {
    const order = visible.map((v) => v.i);
    const at = order.indexOf(cur);
    return order[(at - 1 + order.length) % order.length];
  }

  // All files missing → graceful fallback (spec §6).
  if (visible.length === 0) {
    return (
      <div className="mt-6 flex flex-col items-start gap-3 rounded-[3px] border-2 border-dashed border-ink bg-white p-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Camera className="h-5 w-5 shrink-0 text-accent" aria-hidden />
          <p className="text-sm font-medium text-ink">Past activation photos available on request.</p>
        </div>
        <Link
          href={inquireHref(groupId, "Photos", "Photo album request", "Please send Thaw Out activation photos")}
          className="mono-label inline-flex items-center gap-1.5 rounded-[3px] border-2 border-ink bg-accent px-5 py-2 text-[11px] font-bold text-white shadow-[3px_3px_0_var(--ink)]"
        >
          Request the album <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h4 className="mono-label text-[11px] font-bold text-accent">Past activations</h4>
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {shown.map(({ f, i }) => (
          <button
            key={f}
            type="button"
            onClick={() => setLightbox(i)}
            className="group relative aspect-square overflow-hidden rounded-[3px] border-2 border-ink bg-surface-muted shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
            aria-label="Expand photo"
          >
            <Image
              src={`${gallery.dir}/${f}`}
              alt={gallery.alt}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover"
              loading="lazy"
              onError={() => markBroken(i)}
            />
          </button>
        ))}
      </div>
      {visible.length > INLINE && (
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mono-label mt-4 inline-flex items-center gap-1.5 rounded-[3px] border-2 border-ink bg-white px-4 py-2 text-[11px] font-bold text-ink shadow-[3px_3px_0_var(--ink)]"
        >
          {expanded ? "Show fewer" : `View all photos (${visible.length})`}
        </button>
      )}

      {/* Lightbox */}
      {lightbox !== null && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
        >
          <button
            type="button"
            onClick={() => setLightbox(null)}
            aria-label="Close"
            className="absolute right-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-white bg-white/10 text-white"
          >
            <X className="h-5 w-5" />
          </button>
          {visible.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((c) => (c === null ? c : prev(c)));
                }}
                aria-label="Previous photo"
                className="absolute left-4 inline-flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-white bg-white/10 text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox((c) => (c === null ? c : next(c)));
                }}
                aria-label="Next photo"
                className="absolute right-4 bottom-4 inline-flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-white bg-white/10 text-white sm:bottom-auto sm:top-1/2"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}
          <div className="relative h-[80vh] w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            <Image
              src={`${gallery.dir}/${gallery.files[lightbox]}`}
              alt={gallery.alt}
              fill
              sizes="100vw"
              className="object-contain"
              onError={() => {
                markBroken(lightbox);
                setLightbox(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ── Chapter: routes festival groups (tiers/proof) vs. classic two-field groups ─
function Chapter({ group, index }: { group: SponsorshipGroup; index: number }) {
  const reduce = useReducedMotion();
  const [tier, setTier] = useState<Tier>("base");
  const accent = CHAPTER_ACCENT[index % CHAPTER_ACCENT.length];
  const isFestival = Boolean(group.proof || group.seasonBundle || group.items.some((i) => i.tiers));

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
        {!group.comingSoon && !isFestival && (
          <div className="flex flex-col items-start gap-2">
            <span className="mono-label text-[10px] text-[color:var(--muted-on-light)]">Pick your level</span>
            <TierPicker tier={tier} onPick={setTier} accent={accent} />
          </div>
        )}
      </div>

      {/* Festival positioning */}
      {isFestival && group.positioning && (
        <p className="mt-4 max-w-3xl rounded-[3px] border-l-4 border-ink bg-white px-4 py-3 text-sm leading-relaxed text-ink">
          {group.positioning}
        </p>
      )}

      {/* Portfolio-level pricing (classic groups only) */}
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

      {/* Festival: proof → gallery → season bundle → market cards */}
      {isFestival ? (
        <>
          {group.proof && <ProofBlock proof={group.proof} accent={accent} />}
          {group.gallery && <Gallery gallery={group.gallery} groupId={group.id} />}
          {group.seasonBundle && <SeasonBundle group={group} accent={accent} />}
          <div className="mt-8">
            <h4 className="mono-label text-[11px] font-bold text-accent">The four 2027 markets</h4>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              {group.items.map((item, i) => (
                <MarketCard key={item.name} item={item} group={group} accent={accent} index={i} />
              ))}
            </div>
          </div>
        </>
      ) : group.comingSoon ? (
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
              initial="show"
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

              <div className="mt-4 grid grid-cols-3 gap-2 border-t-2 border-ink/10 pt-3">
                <Stat label="Reach / event" value={item.valuePerEvent} />
                <Stat label="Base" value={priceFor(item, group, "base")} active={tier === "base"} accent={accent} />
                <Stat label="Presenting" value={priceFor(item, group, "presenting")} active={tier === "presenting"} accent={accent} />
              </div>

              {item.image && (
                <div className="relative mt-4 aspect-[4/5] overflow-hidden rounded-[3px] border-2 border-ink bg-white shadow-[3px_3px_0_var(--ink)]">
                  <Image
                    src={item.image.src}
                    alt={item.image.alt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                  />
                </div>
              )}

              {(tier === "presenting" ? item.presentingDetail : item.baseDetail) && (
                <p className="mt-3 rounded-[2px] border-l-4 border-ink bg-surface-muted px-3 py-2 text-xs leading-relaxed text-ink">
                  <span className="mono-label mr-1 font-bold text-accent">
                    {tier === "presenting" ? "Presenting:" : "Base:"}
                  </span>
                  {tier === "presenting" ? item.presentingDetail : item.baseDetail}
                </p>
              )}

              {item.highlights && item.highlights.length > 0 && (
                <ul className="mt-3 space-y-1.5 rounded-[3px] border-2 border-ink/10 bg-surface-muted p-3">
                  {item.highlights.map((highlight) => (
                    <li key={highlight} className="flex gap-2 text-xs leading-relaxed text-ink">
                      <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" aria-hidden />
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              )}

              {item.contact && (
                <div className="mt-3 rounded-[3px] border-2 border-ink bg-white p-3 text-xs text-ink">
                  <div className="mono-label text-[9px] font-bold text-[color:var(--muted-on-light)]">Venue contact</div>
                  <p className="mt-1 font-bold">{item.contact.name}</p>
                  <p className="text-[color:var(--muted-on-light)]">{item.contact.role}</p>
                  <p className="mt-1 text-[color:var(--muted-on-light)]">
                    {item.contact.email}{item.contact.phone ? ` · ${item.contact.phone}` : ""}
                  </p>
                </div>
              )}

              <Link
                href={inquireHref(group.id, tier, item.name)}
                className="mono-label mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-accent hover:underline"
              >
                Inquire — {tier === "presenting" ? "Presenting" : "Base"} tier <ArrowRight className="h-4 w-4" />
              </Link>
              <PhotosLink url={item.photosUrl} />
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}

/** The gamified "Sponsor an event or trip" reel — Events service page. */
export function EventSponsorships() {
  return (
    <Section tone="muted" id="sponsor">
      <SectionHeading eyebrow="Sponsorships" title="Sponsor a campus moment." intro={eventSponsorships.intro} />
      <div className="mt-4 flex items-center gap-2 text-[color:var(--muted-on-light)]">
        <Lock className="h-4 w-4" aria-hidden />
        <span className="mono-label text-[11px]">Choose the event, festival, or venue package that fits the brand.</span>
      </div>
      <div className="mt-12 space-y-14">
        {eventSponsorships.groups.map((group, i) => (
          <Chapter key={group.id} group={group} index={i} />
        ))}
      </div>
    </Section>
  );
}

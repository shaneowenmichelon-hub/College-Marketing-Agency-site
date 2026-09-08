"use client";

import { Quote, Star } from "lucide-react";
import type { Testimonial } from "@/site.config";

/**
 * Slow, brutalist-styled marquee of client testimonials — sits right under the
 * brand logo wall. Moves noticeably slower than the logo marquee so the quotes
 * are readable, pauses on hover, and goes static under reduced motion (via the
 * shared `.marquee-track` rule). Testimonials with an empty quote are skipped,
 * so a name/title can be staged before the quote exists.
 */

const ACCENTS = ["var(--accent)", "var(--accent-2)", "var(--magenta)", "var(--orange)"];

function TestimonialCard({ t, accentIndex }: { t: Testimonial; accentIndex: number }) {
  const accent = ACCENTS[accentIndex % ACCENTS.length];
  return (
    <figure
      className="flex h-full w-[300px] shrink-0 flex-col justify-between rounded-[4px] border-2 border-ink bg-surface p-6 sm:w-[380px]"
      style={{ boxShadow: `6px 6px 0 ${accent}` }}
    >
      <div>
        <div className="flex items-center justify-between">
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-ink"
            style={{ backgroundColor: accent }}
            aria-hidden
          >
            <Quote className="h-4 w-4 text-ink" />
          </span>
          <span className="flex gap-0.5" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} className="h-4 w-4 fill-[color:var(--accent-2)] text-ink" aria-hidden />
            ))}
          </span>
        </div>
        <blockquote className="mt-4 text-[15px] font-medium leading-relaxed text-ink">
          {t.quote}
        </blockquote>
      </div>
      <figcaption className="mt-6 border-t-2 border-ink/10 pt-4">
        <div className="font-display text-sm font-bold text-ink">{t.name}</div>
        <div className="mono-label mt-1 text-[10px] text-[color:var(--muted-on-light)]">{t.title}</div>
      </figcaption>
    </figure>
  );
}

export function TestimonialMarquee({ testimonials }: { testimonials: Testimonial[] }) {
  const live = testimonials.filter((t) => t.quote.trim().length > 0);
  if (live.length === 0) return null;
  const doubled = [...live, ...live];

  return (
    <div className="group relative overflow-hidden" role="region" aria-label="Client testimonials">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-surface-muted to-transparent sm:w-20"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-surface-muted to-transparent sm:w-20"
      />
      <ul
        className="marquee-track flex w-max animate-marquee items-stretch gap-5 py-3 group-hover:[animation-play-state:paused]"
        style={{ animationDuration: "75s" }}
      >
        {doubled.map((t, i) => (
          <li key={`${t.name}-${i}`} aria-hidden={i >= live.length}>
            <TestimonialCard t={t} accentIndex={i % live.length} />
          </li>
        ))}
      </ul>
    </div>
  );
}

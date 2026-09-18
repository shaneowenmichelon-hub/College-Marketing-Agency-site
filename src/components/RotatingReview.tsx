"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { testimonials } from "@/site.config";

/**
 * Rotating client review for the contact ("Book a Call") page. Cycles through the
 * testimonials every 6 seconds with a soft fade. Reduced motion shows a static
 * one and does not auto-advance.
 */
const REVIEWS = testimonials.filter((t) => t.quote.trim().length > 0);

export function RotatingReview() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);

  useEffect(() => {
    if (reduce || REVIEWS.length <= 1) return;
    const id = setInterval(() => setI((n) => (n + 1) % REVIEWS.length), 6000);
    return () => clearInterval(id);
  }, [reduce]);

  if (REVIEWS.length === 0) return null;
  const t = REVIEWS[i];

  return (
    <div className="mt-6 min-h-[210px]">
      <AnimatePresence mode="wait">
        <motion.figure
          key={t.name}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.4 }}
          className="rounded-[4px] border-2 border-ink bg-surface p-5 shadow-[5px_5px_0_var(--accent-2)]"
        >
          <div className="flex gap-0.5" aria-label="5 out of 5 stars">
            {Array.from({ length: 5 }).map((_, s) => (
              <Star key={s} className="h-4 w-4 fill-[color:var(--accent-2)] text-ink" aria-hidden />
            ))}
          </div>
          <blockquote className="mt-3 text-sm leading-relaxed text-ink">{t.quote}</blockquote>
          <figcaption className="mt-3 text-xs font-bold text-ink">
            {t.name}
            <span className="font-normal text-[color:var(--muted-on-light)]"> · {t.title}</span>
          </figcaption>
        </motion.figure>
      </AnimatePresence>

      {REVIEWS.length > 1 && (
        <div className="mt-3 flex gap-1.5" aria-hidden>
          {REVIEWS.map((_, d) => (
            <span
              key={d}
              className={`h-1.5 rounded-full transition-all ${d === i ? "w-5 bg-ink" : "w-1.5 bg-ink/25"}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

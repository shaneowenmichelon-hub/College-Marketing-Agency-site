"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Animated stat that counts up when scrolled into view.
 *
 * Values are placeholder tokens like "[X]M+" or "[X]+". We only animate the
 * numeric part when present; token values that contain no digits (the common
 * case here) render statically. This keeps the placeholders honest — nothing
 * fabricated — while still supporting real numbers once they're dropped in.
 */
export function StatCounter({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);

  // Parse a leading integer if the token has one (e.g. "250M+" -> 250, "M+").
  const match = value.match(/^(\d+)(.*)$/);

  useEffect(() => {
    if (!match || reduce || !inView) {
      setDisplay(value);
      return;
    }
    const target = parseInt(match[1], 10);
    const suffix = match[2];
    const duration = 1200;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(`${Math.round(eased * target)}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, reduce, value, match]);

  return (
    <div ref={ref} className={cn("text-center sm:text-left", className)}>
      <div className="font-display text-4xl font-bold tracking-tight text-[color:var(--accent-2)] sm:text-5xl lg:text-6xl">
        {display}
      </div>
      <div className="mt-2 text-sm text-[color:var(--muted-on-dark)] sm:text-base">
        {label}
      </div>
    </div>
  );
}

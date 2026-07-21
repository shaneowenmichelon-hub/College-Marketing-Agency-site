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

  // Parse a leading number (commas + decimals ok) plus a suffix, e.g.
  //   "1,200" -> 1200 ""        "1.44M+" -> 1.44 "M+"
  //   "100K+" -> 100 "K+"       "20+"    -> 20 "+"
  // Tokens like "[X]+" have no leading number and render statically.
  const match = value.match(/^([\d.,]+)(.*)$/);
  const numericStr = match ? match[1].replace(/,/g, "") : "";
  const target = match ? parseFloat(numericStr) : 0;
  const decimals = numericStr.includes(".") ? numericStr.split(".")[1].length : 0;
  const suffix = match ? match[2] : "";

  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

  useEffect(() => {
    if (!match || Number.isNaN(target) || reduce || !inView) {
      setDisplay(value);
      return;
    }
    const duration = 1200;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(`${fmt(eased * target)}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduce, value]);

  return (
    <div
      ref={ref}
      className={cn(
        "rounded-[3px] border-2 border-white/80 bg-white/[0.03] p-4 text-left shadow-[5px_5px_0_var(--accent)]",
        className,
      )}
    >
      <div className="font-display text-4xl font-bold leading-none tracking-tight text-[color:var(--accent-2)] sm:text-5xl lg:text-6xl">
        {display}
      </div>
      <div className="mono-label mt-3 text-[11px] text-[color:var(--muted-on-dark)]">
        {label}
      </div>
    </div>
  );
}

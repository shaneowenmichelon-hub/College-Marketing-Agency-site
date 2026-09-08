"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Count-up-on-scroll hook. Returns a ref to attach to the container (it triggers
 * when scrolled into view) and the display string.
 *
 * Values are tokens like "1,200", "1.44M+", "100K+", or "[X]+". We animate only
 * the leading numeric part; tokens with no leading number render statically.
 * This keeps placeholders honest while supporting real numbers.
 */
export function useCountUp(value: string) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);

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

  return { ref, display };
}

/**
 * Animated stat that counts up when scrolled into view (large, dark-band style).
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
  const { ref, display } = useCountUp(value);

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

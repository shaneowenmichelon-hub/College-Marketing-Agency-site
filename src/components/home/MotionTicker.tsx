"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Slow right-to-left ticker. Two copies of the content make a seamless loop.
 * Pauses when off-screen (IntersectionObserver) and under reduced motion
 * (handled in globals.css). Decorative, so hidden from the a11y tree.
 */
export function MotionTicker({ items }: { items: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const Row = () => (
    <span className="mono-label flex shrink-0 items-center whitespace-nowrap text-[11px] tracking-[0.2em] text-[color:var(--muted-on-dark)]">
      {items.map((it, i) => (
        <span key={i} className="flex items-center">
          <span className="px-4">{it}</span>
          <span aria-hidden className="text-[color:var(--accent-2)]">
            ·
          </span>
        </span>
      ))}
    </span>
  );

  return (
    <div
      ref={ref}
      aria-hidden
      className="relative w-full overflow-hidden border-y border-white/15 py-2.5"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div
        className="ticker-track flex w-max will-change-transform"
        style={{ animationPlayState: inView ? "running" : "paused" }}
      >
        <Row />
        <Row />
      </div>
    </div>
  );
}

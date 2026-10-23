"use client";

import { useEffect, useState } from "react";

/**
 * Thin progress bar pinned to the top of the viewport, filling as the page
 * scrolls. It sits one layer above the sticky header (z-50) so it stays put.
 *
 * Mobile-first: on a phone the header collapses to a logo and a burger, so
 * there is no nav to tell you how far through a long article or service page
 * you are. Hidden at lg+, where the full nav and a visible scrollbar already
 * do the job.
 *
 * Driven by scroll position rather than a scroll-linked CSS animation because
 * `animation-timeline: scroll()` is still missing on Safari, which is most of
 * this audience. Reads are throttled to one per frame and the handler is
 * passive, so it never blocks the scroll thread.
 *
 * Renders nothing under prefers-reduced-motion: it is decorative, and a bar
 * that tracks every scroll pixel is exactly the kind of movement that setting
 * is asking us to stop.
 */
export function ScrollProgress() {
  const [pct, setPct] = useState(0);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    setEnabled(true);

    let frame = 0;
    const read = () => {
      frame = 0;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      setPct(scrollable > 40 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] lg:hidden"
    >
      <div
        className="h-full origin-left bg-[color:var(--accent-2)]"
        style={{ transform: `scaleX(${pct})`, transition: "transform 90ms linear" }}
      />
    </div>
  );
}

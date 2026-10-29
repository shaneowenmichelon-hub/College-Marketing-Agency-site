"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/**
 * The horizontally scrollable shell around an article table.
 *
 * The table itself stays server-rendered and is passed straight through as
 * children, so the markup a crawler or a screen reader sees is unchanged.
 * This only adds the part that needs to measure: whether the table is wider
 * than the phone, and whether there is more of it to the right.
 *
 * Why it exists: horizontal scroll is the right strategy for a data table on
 * a phone — collapsing it into stacked cards destroys the row/column
 * relationships that are the whole point — but with no visual cue a cut-off
 * column reads as a broken layout rather than as something you can swipe.
 * Reported as exactly that. So when the table overflows it gets a fade at the
 * right edge and a one-line hint, both of which disappear once you reach the
 * end, and neither of which appears at all when the table already fits.
 *
 * The fade is `pointer-events-none` so it can never swallow a tap or a swipe.
 */
export function TableScroller({ label, children }: { label: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [overflows, setOverflows] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  const measure = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setOverflows(max > 4);
    setAtEnd(max - el.scrollLeft <= 4);
  }, []);

  useEffect(() => {
    measure();
    const el = ref.current;
    if (!el) return;
    el.addEventListener("scroll", measure, { passive: true });
    // Fonts and images land after first paint and change the table's width.
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    return () => {
      el.removeEventListener("scroll", measure);
      ro.disconnect();
    };
  }, [measure]);

  return (
    <>
      <div className="relative">
        <div
          ref={ref}
          className="overflow-x-auto rounded-[3px] border-2 border-ink shadow-[5px_5px_0_var(--ink)]"
          // Scrollable regions need to be focusable, or keyboard users can't
          // reach the columns that are off screen.
          tabIndex={0}
          role="region"
          aria-label={label}
        >
          {children}
        </div>
        {overflows && !atEnd && (
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-[2px] right-[2px] w-10 rounded-r-[2px] bg-gradient-to-l from-white to-transparent"
          />
        )}
      </div>
      {overflows && (
        <p aria-hidden className="mono-label mt-2 text-[10px] font-bold text-[color:var(--muted-on-light)]">
          {atEnd ? "End of table" : "Swipe the table to see every column →"}
        </p>
      )}
    </>
  );
}

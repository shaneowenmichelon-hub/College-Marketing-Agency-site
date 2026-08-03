"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type AudienceTab = { id: string; label: string; panel: ReactNode };

/**
 * Accessible tabbed audience switcher (ARIA tablist pattern, roving tabindex,
 * arrow-key nav, selection-follows-focus). Deep-linkable via URL hash
 * (#for-brands / #for-students) - the hash updates on switch via replaceState
 * so there's no navigation or scroll jump. Reduced motion disables the fade.
 */
// Sticky-nav offset applied when scrolling to a deep-linked block.
const NAV_OFFSET = 88;

export function AudienceTabs({
  tabs,
  defaultId,
  anchorTab,
}: {
  tabs: AudienceTab[];
  defaultId?: string;
  /** Maps a block-anchor id (e.g. "events") → the tab id to activate for it. */
  anchorTab?: Record<string, string>;
}) {
  const initial = defaultId ?? tabs[0]?.id;
  const [active, setActive] = useState(initial);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  // A block anchor waiting to be scrolled to once its panel is visible.
  const pendingScroll = useRef<string | null>(null);

  // Respond to the URL hash on load and on back/forward / same-page hash links.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace(/^#/, "");
      if (!id) return;
      if (tabs.some((t) => t.id === id)) {
        setActive(id);
      } else if (anchorTab && anchorTab[id]) {
        setActive(anchorTab[id]);
        pendingScroll.current = id;
      }
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [tabs, anchorTab]);

  // After the target tab becomes active (panel un-hidden), scroll to the block.
  useEffect(() => {
    if (!pendingScroll.current) return;
    const id = pendingScroll.current;
    pendingScroll.current = null;
    requestAnimationFrame(() => {
      const el = document.getElementById(id);
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const y = el.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    });
  }, [active]);

  function select(id: string, focus = false) {
    setActive(id);
    // Update the hash without a navigation or scroll jump.
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${id}`);
    }
    if (focus) {
      const idx = tabs.findIndex((t) => t.id === id);
      tabRefs.current[idx]?.focus();
    }
  }

  function onKeyDown(e: React.KeyboardEvent, index: number) {
    const last = tabs.length - 1;
    let next = index;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = index === last ? 0 : index + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = index === 0 ? last : index - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    select(tabs[next].id, true);
  }

  return (
    <div>
      {/* Segmented control */}
      <div
        role="tablist"
        aria-label="Choose your audience"
        className="mx-auto flex w-full max-w-md rounded-[4px] border-2 border-ink bg-white shadow-[4px_4px_0_var(--ink)]"
      >
        {tabs.map((t, i) => {
          const selected = active === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={selected}
              aria-controls={`panel-${t.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(t.id)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "mono-label flex-1 rounded-[2px] px-4 py-3 text-center text-[12px] font-bold uppercase tracking-wide transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-accent",
                i === 0 && "border-r-2 border-ink",
                selected ? "bg-accent text-white" : "bg-white text-[color:var(--muted-on-light)] hover:text-ink",
              )}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Panels - both mounted; inactive is hidden. Fade in on show. */}
      <div className="mt-12">
        {tabs.map((t) => (
          <div
            key={t.id}
            role="tabpanel"
            id={`panel-${t.id}`}
            aria-labelledby={`tab-${t.id}`}
            hidden={active !== t.id}
            tabIndex={0}
            className="ch-fade-in focus:outline-none"
          >
            {t.panel}
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Two jobs:
 *  1. On every route change (no hash), jump instantly to the top. The root no
 *     longer sets `scroll-behavior: smooth`, so this is a clean instant reset —
 *     fixing the bug where opening an article from far down a page left you at
 *     the bottom.
 *  2. Restore smooth scrolling for in-page anchor clicks (e.g. `#product-placement`)
 *     without letting that smoothness affect route navigation.
 */
export function ScrollManager() {
  const pathname = usePathname();

  // Instant top on route change (unless the URL targets an anchor).
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);

  // Smooth-scroll same-page hash links on click.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href");
      if (!href || !href.includes("#")) return;

      const url = new URL(anchor.href, window.location.href);
      // Only handle links that stay on the current page.
      if (url.pathname !== window.location.pathname || url.search !== window.location.search) return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      history.pushState(null, "", url.hash);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}

"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { siteConfig } from "@/site.config";
import { Button } from "./ui/Button";

/**
 * Full-height editorial nav panel (mobile only). Spring-driven wipe with a
 * staggered reveal, numbered items, a brand/student split, and a persistent CTA
 * footer. Focus-trapped, Escape-to-close; body scroll lock is handled by Navbar.
 * Reduced motion → simple fade, no wipe/stagger.
 */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const reduce = useReducedMotion();
  const panelRef = useRef<HTMLDivElement>(null);
  // Portal to <body> so the panel escapes the header's backdrop-filter, which
  // would otherwise become the containing block for a fixed child (mobile bug).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const nodes = panelRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!nodes || nodes.length === 0) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => {
      panelRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    }, 60);
    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  const listStagger = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.05, delayChildren: reduce ? 0 : 0.1 } },
  };
  const rowV = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const } },
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
          exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          transition={reduce ? { duration: 0.15 } : { type: "spring", stiffness: 260, damping: 32 }}
        >
          <div ref={panelRef} className="grain flex h-[100svh] flex-col bg-ink text-white">
            {/* Header row */}
            <div className="flex h-16 shrink-0 items-center justify-between border-b-2 border-white/15 px-5">
              <span className="mono-label text-[11px] tracking-[0.2em] text-[color:var(--muted-on-dark)]">
                Menu
              </span>
              <button
                data-autofocus
                type="button"
                onClick={onClose}
                aria-label="Close menu"
                className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-white/40 text-white transition-colors hover:bg-white/10"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav list */}
            <motion.nav
              variants={listStagger}
              initial="hidden"
              animate="show"
              className="flex-1 overflow-y-auto px-5 py-4"
            >
              <ul>
                {siteConfig.nav.map((item, i) => (
                  <motion.li key={item.href} variants={rowV} className="border-b border-white/10">
                    <Link href={item.href} onClick={onClose} className="flex items-baseline gap-4 py-4">
                      <span className="mono-label w-6 text-[11px] text-[color:var(--accent-2)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="font-display text-3xl font-bold leading-none">{item.label}</span>
                    </Link>
                  </motion.li>
                ))}
              </ul>

              {/* Brand / student split */}
              <motion.div variants={rowV} className="mt-7 grid grid-cols-2 gap-3">
                <Link
                  href="/services#for-brands"
                  onClick={onClose}
                  className="rounded-[3px] border-2 border-white/25 p-4 transition-colors hover:border-[color:var(--accent-2)]"
                >
                  <span className="mono-label text-[10px] text-[color:var(--muted-on-dark)]">For brands</span>
                  <span className="mt-1 flex items-center gap-1 font-display text-base font-bold">
                    Services <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
                <Link
                  href="/services#for-students"
                  onClick={onClose}
                  className="rounded-[3px] border-2 border-white/25 p-4 transition-colors hover:border-[color:var(--accent-2)]"
                >
                  <span className="mono-label text-[10px] text-[color:var(--muted-on-dark)]">For students</span>
                  <span className="mt-1 flex items-center gap-1 font-display text-base font-bold">
                    Get paid <ArrowUpRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            </motion.nav>

            {/* Footer CTAs */}
            <div className="shrink-0 border-t-2 border-white/15 px-5 pt-5 [padding-bottom:calc(1.25rem+env(safe-area-inset-bottom))]">
              <div className="flex flex-col gap-3">
                <Button href="/contact" variant="lime" size="lg">
                  Get Started
                </Button>
                <Button href="/become-an-ambassador" variant="ghost-dark" size="lg">
                  Become an Ambassador
                </Button>
              </div>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="mono-label mt-4 block text-center text-[11px] tracking-[0.2em] text-[color:var(--muted-on-dark)] hover:text-white"
              >
                {siteConfig.contact.email}
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

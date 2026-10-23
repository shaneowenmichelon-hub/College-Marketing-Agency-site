"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger index → delay in seconds. */
  delay?: number;
  as?: "div" | "section" | "li" | "span";
};

/**
 * Scroll-reveal wrapper: fade + slide-up when it enters the viewport once.
 * Fully disabled under prefers-reduced-motion (renders content statically).
 *
 * Two things this has to avoid, which is why it is not just `initial="hidden"`:
 *
 * 1. Never ship `opacity: 0` in the server HTML. framer-motion inlines the
 *    `initial` variant during SSR, so a plain `initial="hidden"` would mean
 *    every revealed block renders invisible to a crawler that does not run JS,
 *    and stays invisible for real users if the bundle is slow or fails. On a
 *    site this dependent on search traffic that trade is not worth a fade.
 * 2. Never animate something the reader is already looking at. Deciding to
 *    animate only after mount would otherwise flash content in, out and back
 *    in for anything above the fold.
 *
 * So: render statically on the server and on first paint, then on mount ask
 * whether this block is still below the fold. Only those arm the animation —
 * which on a phone is most of the page, and none of what is already on screen.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement | null>(null);
  const [armed, setArmed] = useState(false);

  useEffect(() => {
    if (reduce) return;
    const el = ref.current;
    if (!el) return;
    // Below the fold at mount → safe to hide and animate in on scroll.
    if (el.getBoundingClientRect().top > window.innerHeight * 0.92) setArmed(true);
  }, [reduce]);

  const Tag = as;

  if (reduce || !armed) {
    return (
      <Tag ref={ref as never} className={className}>
        {children}
      </Tag>
    );
  }

  const variants: Variants = {
    hidden: { opacity: 0, y: 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1], delay },
    },
  };

  const MotionTag = motion[as];
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
    >
      {children}
    </MotionTag>
  );
}

"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ReactLenis, type LenisRef } from "lenis/react";
import { useReducedMotion } from "framer-motion";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Smooth-scroll provider (Lenis) synced with GSAP's ticker so ScrollTrigger stays
 * in lockstep — protects INP/jank. Under prefers-reduced-motion we DON'T hijack
 * scroll at all: native scrolling is used and only ScrollTrigger.update runs.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const lenisRef = useRef<LenisRef>(null);

  useEffect(() => {
    if (reduce) return;
    function update(time: number) {
      lenisRef.current?.lenis?.raf(time * 1000);
    }
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    const onScroll = () => ScrollTrigger.update();
    lenisRef.current?.lenis?.on("scroll", onScroll);
    return () => {
      gsap.ticker.remove(update);
      lenisRef.current?.lenis?.off("scroll", onScroll);
    };
  }, [reduce]);

  // Reduced motion: render children directly, native scroll (no Lenis).
  if (reduce) return <>{children}</>;

  return (
    <ReactLenis
      root
      ref={lenisRef}
      options={{ autoRaf: false, lerp: 0.1, smoothWheel: true }}
    >
      {children}
    </ReactLenis>
  );
}

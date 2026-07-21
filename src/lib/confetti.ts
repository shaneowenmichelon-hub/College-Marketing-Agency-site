"use client";

import confetti from "canvas-confetti";

const DOPAMINE = ["#2F5BFF", "#FF3D9A", "#C6FF3D", "#FF6A2B", "#FFFFFF"];

function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return true;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** A reward pop. No-op under reduced motion. */
export function pop(originX = 0.5, originY = 0.6) {
  if (prefersReducedMotion()) return;
  confetti({
    particleCount: 60,
    spread: 65,
    startVelocity: 38,
    origin: { x: originX, y: originY },
    colors: DOPAMINE,
    disableForReducedMotion: true,
    scalar: 0.9,
  });
}

/** A bigger celebration for milestones/completion. No-op under reduced motion. */
export function celebrate() {
  if (prefersReducedMotion()) return;
  const fire = (ratio: number, opts: confetti.Options) =>
    confetti({
      origin: { y: 0.65 },
      colors: DOPAMINE,
      disableForReducedMotion: true,
      particleCount: Math.floor(180 * ratio),
      ...opts,
    });
  fire(0.25, { spread: 26, startVelocity: 55 });
  fire(0.2, { spread: 60 });
  fire(0.35, { spread: 100, decay: 0.91, scalar: 0.9 });
  fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
  fire(0.1, { spread: 120, startVelocity: 45 });
}

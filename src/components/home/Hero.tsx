"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { siteConfig, getStat } from "@/site.config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MotionTicker } from "@/components/home/MotionTicker";

/**
 * The "campus coin" - a brand artifact, not decoration. Desktop: 3D tilt follows
 * the cursor. Touch: a slow idle DRIFT (globals.css, never a continuous auto-spin).
 * Tap (any device, user-initiated): one fast 3D flip + a micro-message + a short
 * haptic where supported. Everything is static under reduced motion.
 */
function Coin({ reduce }: { reduce: boolean }) {
  const [rot, setRot] = useState({ x: -12, y: 18 });
  const [flipping, setFlipping] = useState(false);
  const [msg, setMsg] = useState(false);

  function spin() {
    setMsg(true);
    window.setTimeout(() => setMsg(false), 1700);
    if (typeof navigator !== "undefined" && "vibrate" in navigator && !reduce) {
      try {
        navigator.vibrate([8, 18, 8]);
      } catch {
        /* haptics unsupported - ignore */
      }
    }
    if (reduce || flipping) return;
    setFlipping(true);
    window.setTimeout(() => setFlipping(false), 820);
  }

  return (
    <div className="relative flex aspect-square w-full max-w-[210px] items-center justify-center justify-self-center sm:max-w-xs lg:max-w-sm">
      <div
        role="button"
        tabIndex={0}
        aria-label="Spin the campus coin"
        onClick={spin}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            spin();
          }
        }}
        className="relative rounded-full outline-none focus-visible:ring-4 focus-visible:ring-[color:var(--accent-2)]/60"
        style={{ perspective: "900px" }}
        onMouseMove={
          reduce || flipping
            ? undefined
            : (e) => {
                const r = e.currentTarget.getBoundingClientRect();
                const px = (e.clientX - r.left) / r.width - 0.5;
                const py = (e.clientY - r.top) / r.height - 0.5;
                setRot({ x: -py * 40, y: px * 60 });
              }
        }
        onMouseLeave={() => !reduce && setRot({ x: -12, y: 18 })}
      >
        <div
          className={`${flipping ? "coin-flip" : "coin-idle"} relative h-40 w-40 rounded-full sm:h-56 sm:w-56 lg:h-64 lg:w-64 ${
            reduce ? "" : "will-change-transform"
          }`}
          style={{
            // While flipping, let the CSS animation own the transform.
            transform: flipping ? undefined : `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.2s ease-out",
          }}
        >
          {/* coin face */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-ink bg-[color:var(--accent-2)]"
            style={{ transform: "translateZ(22px)", boxShadow: "0 0 0 4px var(--ink)" }}
          >
            <span className="font-display text-5xl font-bold text-ink lg:text-6xl">CA</span>
          </div>
          {/* back face */}
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-ink bg-[color:var(--magenta)]"
            style={{ transform: "translateZ(-22px) rotateY(180deg)" }}
          >
            <Sparkles className="h-14 w-14 text-white lg:h-16 lg:w-16" aria-hidden />
          </div>
          {/* edge ring */}
          <div className="absolute inset-0 rounded-full border-[10px] border-ink/80" style={{ transform: "translateZ(0px)" }} />
        </div>
      </div>

      {/* Micro-message on tap */}
      <span
        aria-live="polite"
        className={`pointer-events-none absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[3px] border-2 border-ink bg-[color:var(--accent-2)] px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-wide text-ink shadow-[3px_3px_0_var(--ink)] transition-opacity duration-200 ${
          msg ? "opacity-100" : "opacity-0"
        }`}
      >
        Campus culture, on the ground.
      </span>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <section className="grain relative overflow-hidden border-b-2 border-ink bg-ink text-white">
      <div aria-hidden className="mesh pointer-events-none absolute inset-0" />
      {/* brutalist grid lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(var(--surface) 1px, transparent 1px), linear-gradient(90deg, var(--surface) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />
      <Container className="relative">
        <div className="grid items-center gap-10 py-20 sm:py-28 lg:grid-cols-[1.3fr_1fr] lg:py-36">
          <motion.div ref={ref} variants={container} initial="hidden" animate="show" className="flex flex-col items-start">
            {siteConfig.showCredibility && (
              <motion.div variants={item}>
                <span className="sticker mono-label bg-[color:var(--accent-2)] px-3 py-1.5 text-[11px] font-bold text-ink">
                  <Sparkles className="h-3.5 w-3.5" />
                  {siteConfig.credibilityLine}
                </span>
              </motion.div>
            )}

            <motion.h1
              variants={item}
              className="mt-6 max-w-4xl text-balance font-display text-display-lg font-bold leading-[0.95]"
            >
              Where brands meet{" "}
              <span className="font-serif font-normal italic text-[color:var(--accent-2)]">
                campus culture.
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--muted-on-dark)] sm:text-xl"
            >
              We put your brand in front of college students through events, brand
              ambassadors, and product placement - on the campuses where they live, study,
              and go out.
            </motion.p>

            <motion.div variants={item} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/contact" variant="lime" size="lg">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button href="/become-an-ambassador" variant="ghost-dark" size="lg">
                Become an Ambassador
              </Button>
            </motion.div>
          </motion.div>

          <Coin reduce={!!reduce} />
        </div>
      </Container>

      {/* Ticker below the hero copy */}
      <MotionTicker
        items={[
          "EVENTS",
          "BRAND AMBASSADORS",
          "PRODUCT PLACEMENT",
          `${getStat("campuses")}+ MARKETS`,
        ]}
      />
    </section>
  );
}

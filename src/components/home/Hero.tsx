"use client";

import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { siteConfig } from "@/site.config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

/**
 * Cursor-reactive CSS-3D "campus coin" motif. Pure CSS transforms (no WebGL) so
 * it's tiny, battery-friendly, and works everywhere. Static under reduced motion.
 * NOTE: a WebGL/three.js version is a documented future enhancement — this ships
 * the interactive 3D moment with zero heavy bundle.
 */
function Coin({ reduce }: { reduce: boolean }) {
  const [rot, setRot] = useState({ x: -12, y: 18 });

  return (
    <div
      className="relative hidden aspect-square w-full max-w-sm items-center justify-center lg:flex"
      style={{ perspective: "900px" }}
      onMouseMove={
        reduce
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
        className={cnCoin(reduce)}
        style={{
          transform: `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
          transformStyle: "preserve-3d",
          transition: "transform 0.2s ease-out",
        }}
      >
        {/* coin face */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-ink bg-[color:var(--accent-2)]"
          style={{ transform: "translateZ(22px)", boxShadow: "0 0 0 4px var(--ink)" }}
        >
          <span className="font-display text-6xl font-bold text-ink">CH</span>
        </div>
        {/* back face */}
        <div
          className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-ink bg-[color:var(--magenta)]"
          style={{ transform: "translateZ(-22px) rotateY(180deg)" }}
        >
          <Sparkles className="h-16 w-16 text-white" aria-hidden />
        </div>
        {/* edge ring */}
        <div className="absolute inset-0 rounded-full border-[10px] border-ink/80" style={{ transform: "translateZ(0px)" }} />
      </div>
    </div>
  );
}

function cnCoin(reduce: boolean) {
  // The 3D rotation is driven by the cursor via inline transform, so we don't add
  // a continuous spin (which would override it). A soft float animates the wrapper.
  return `relative h-64 w-64 rounded-full ${reduce ? "" : "will-change-transform"}`;
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
        <div className="grid items-center gap-10 py-24 sm:py-28 lg:grid-cols-[1.3fr_1fr] lg:py-36">
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
              className="mt-6 max-w-4xl text-balance font-display text-display-lg font-bold"
            >
              Where brands meet{" "}
              <span
                className="glitch text-[color:var(--accent-2)]"
                data-text="campus culture."
              >
                campus culture.
              </span>
            </motion.h1>

            <motion.p
              variants={item}
              className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--muted-on-dark)] sm:text-xl"
            >
              We put your brand in front of college students through events, brand
              ambassadors, and influencers — on the campuses where they live, study,
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

            <motion.p variants={item} className="mono-label mt-8 text-[11px] text-[color:var(--muted-on-dark)]">
              Events · Brand Ambassadors · Influencers — across {siteConfig.campuses.length}+ markets.
            </motion.p>
          </motion.div>

          <Coin reduce={!!reduce} />
        </div>
      </Container>
    </section>
  );
}

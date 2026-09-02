"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { siteConfig, getStat } from "@/site.config";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MotionTicker } from "@/components/home/MotionTicker";

/**
 * Fallback coin (reduced motion / pre-hydration): the tappable CS-3D CA coin,
 * cursor-tilt on desktop, one flip + micro-message + haptic on tap.
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
        /* haptics unsupported */
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
            transform: flipping ? undefined : `rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 0.2s ease-out",
          }}
        >
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-ink bg-[color:var(--accent-2)]"
            style={{ transform: "translateZ(22px)", boxShadow: "0 0 0 4px var(--ink)" }}
          >
            <span className="font-display text-5xl font-bold text-ink lg:text-6xl">CA</span>
          </div>
          <div
            className="absolute inset-0 flex items-center justify-center rounded-full border-4 border-ink bg-[color:var(--magenta)]"
            style={{ transform: "translateZ(-22px) rotateY(180deg)" }}
          >
            <Sparkles className="h-14 w-14 text-white lg:h-16 lg:w-16" aria-hidden />
          </div>
          <div className="absolute inset-0 rounded-full border-[10px] border-ink/80" style={{ transform: "translateZ(0px)" }} />
        </div>
      </div>
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

/**
 * Scroll-driven reel: the big CA coin hangs up top; a worker cranking a cable
 * spool on an A-frame stand sits at the bottom, roping the coin in. Three scrolls
 * lower the coin toward the spool; on the third it drops with a dust burst, then
 * the page scrolls on. Driven by hero scroll progress, so it never traps the user.
 */
const PANTS = "#F4A9C7";
const SKIN = "#C98A5E";

function ReelApparatus({ progress }: { progress: MotionValue<number> }) {
  const [stage, setStage] = useState(0);

  const appear = useTransform(progress, [0, 0.06], [0, 1]);
  const spoolRotate = useTransform(progress, [0.06, 0.86], [0, 900]);
  // Big coin: hangs high, reeled down toward the spool in 3 steps, then drops.
  const coinY = useTransform(
    progress,
    [0.06, 0.3, 0.34, 0.55, 0.6, 0.8, 0.86, 0.93, 1],
    [70, 150, 150, 226, 226, 300, 300, 422, 422],
  );
  const coinRotate = useTransform(progress, [0.86, 0.96], [0, 150]);
  const ropeEndY = useTransform(coinY, (v) => v - 46); // rope meets the coin's top
  const ropeOpacity = useTransform(progress, [0, 0.06, 0.86, 0.9], [0, 1, 1, 0]);
  const dustOpacity = useTransform(progress, [0.86, 0.9, 0.99], [0, 0.9, 0]);
  const dustScale = useTransform(progress, [0.86, 1], [0.3, 1.9]);
  const hintOpacity = useTransform(progress, [0, 0.04, 0.12], [0, 1, 0]);
  const labelOpacity = useTransform(progress, [0.08, 0.12, 0.84, 0.9], [0, 1, 1, 0]);

  useMotionValueEvent(progress, "change", (v) => {
    setStage(v < 0.06 ? 0 : v < 0.34 ? 1 : v < 0.6 ? 2 : v < 0.86 ? 3 : v < 0.93 ? 4 : 5);
  });
  const label = stage === 0 ? "" : stage <= 3 ? `Reel ${stage} / 3` : stage === 4 ? "Drop!" : "";

  return (
    <div className="relative mx-auto w-full max-w-[240px] justify-self-center sm:max-w-[300px] lg:max-w-[360px]">
      <svg viewBox="0 0 300 480" className="w-full" role="img" aria-label="A worker cranks a cable spool that reels the big Collegiate Agency coin down, then it drops.">
        {/* ground */}
        <line x1="30" y1="432" x2="270" y2="432" stroke="var(--ink)" strokeWidth="3" />

        {/* rope from spool up to the coin */}
        <motion.line x1="150" y1="330" x2="196" y2={ropeEndY} stroke="var(--ink)" strokeWidth="3" style={{ opacity: ropeOpacity }} />

        {/* the BIG CA coin */}
        <motion.g style={{ y: coinY, opacity: appear }}>
          <motion.g style={{ rotate: coinRotate, transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx="196" cy="0" r="46" fill="var(--accent-2)" stroke="var(--ink)" strokeWidth="6" />
            <circle cx="196" cy="0" r="46" fill="none" stroke="var(--ink)" strokeWidth="2" opacity="0.35" />
            <text
              x="196"
              y="0"
              textAnchor="middle"
              dominantBaseline="central"
              fontSize="34"
              fontWeight="800"
              fill="var(--ink)"
              style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
            >
              CA
            </text>
          </motion.g>
        </motion.g>

        {/* dust burst on impact (ground, right of the spool) */}
        <motion.g style={{ opacity: dustOpacity, scale: dustScale, transformBox: "fill-box", transformOrigin: "center" }}>
          <g transform="translate(196 424)">
            <circle cx="-30" cy="0" r="12" fill="var(--muted-on-dark)" opacity="0.5" />
            <circle cx="0" cy="-8" r="16" fill="var(--muted-on-dark)" opacity="0.45" />
            <circle cx="30" cy="0" r="13" fill="var(--muted-on-dark)" opacity="0.5" />
            <circle cx="-14" cy="8" r="9" fill="var(--muted-on-dark)" opacity="0.4" />
            <circle cx="18" cy="8" r="10" fill="var(--muted-on-dark)" opacity="0.4" />
          </g>
        </motion.g>

        {/* ── the contraption at the bottom ── */}
        <motion.g style={{ opacity: appear }}>
          {/* A-frame stand */}
          <path d="M104 432L150 322" stroke="var(--accent)" strokeWidth="12" strokeLinecap="round" />
          <path d="M196 432L150 322" stroke="var(--accent)" strokeWidth="12" strokeLinecap="round" />
          <line x1="122" y1="388" x2="178" y2="388" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round" />
          <path d="M104 432L150 322" stroke="var(--ink)" strokeWidth="12" strokeLinecap="round" opacity="0.25" />

          {/* cable spool (side view) — rotates */}
          <motion.g style={{ rotate: spoolRotate, transformBox: "fill-box", transformOrigin: "center" }}>
            <circle cx="150" cy="330" r="52" fill="#fff" stroke="var(--ink)" strokeWidth="5" />
            {[42, 34, 26, 18].map((r) => (
              <circle key={r} cx="150" cy="330" r={r} fill="none" stroke="var(--ink)" strokeWidth="2" opacity="0.55" />
            ))}
            <circle cx="150" cy="330" r="9" fill="var(--ink)" />
            {/* crank handle on the rim */}
            <circle cx="150" cy="286" r="7" fill="var(--accent-2)" stroke="var(--ink)" strokeWidth="3" />
          </motion.g>
          <circle cx="150" cy="330" r="52" fill="none" stroke="var(--ink)" strokeWidth="5" />

          {/* worker (left), bent over cranking */}
          <g>
            {/* legs (pink) */}
            <path d="M78 356l-8 76" stroke={PANTS} strokeWidth="14" strokeLinecap="round" />
            <path d="M92 356l10 76" stroke={PANTS} strokeWidth="14" strokeLinecap="round" />
            {/* shoes */}
            <path d="M62 432h18" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
            <path d="M100 432h18" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
            {/* torso (blue shirt), leaning toward spool */}
            <path d="M84 360l26 -44" stroke="var(--accent)" strokeWidth="22" strokeLinecap="round" />
            {/* arm reaching to the crank */}
            <path d="M104 322l40 -30" stroke="var(--accent)" strokeWidth="11" strokeLinecap="round" />
            <path d="M138 296l14 -8" stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
            {/* head + cap */}
            <circle cx="120" cy="306" r="15" fill={SKIN} stroke="var(--ink)" strokeWidth="3" />
            <path d="M104 302a16 12 0 0 1 32 0z" fill="var(--accent)" stroke="var(--ink)" strokeWidth="3" />
            <path d="M132 302h16" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" />
          </g>
        </motion.g>
      </svg>

      {/* hint + stage label */}
      <motion.p
        style={{ opacity: hintOpacity }}
        className="mono-label pointer-events-none absolute inset-x-0 top-0 text-center text-[10px] font-bold tracking-widest text-[color:var(--accent-2)]"
      >
        ↓ scroll to reel the coin in
      </motion.p>
      <motion.p
        style={{ opacity: labelOpacity }}
        className="mono-label pointer-events-none absolute inset-x-0 bottom-0 text-center text-[10px] font-bold tracking-widest text-white"
      >
        {label}
      </motion.p>
    </div>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const active = mounted && !reduce;

  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.09, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <div ref={wrapRef} className={active ? "relative h-[240vh] sm:h-[300vh]" : "relative"}>
      <section
        className={`grain relative overflow-hidden border-b-2 border-ink bg-ink text-white ${
          active ? "sticky top-0 flex min-h-[100svh] flex-col justify-center" : ""
        }`}
      >
        <div aria-hidden className="mesh pointer-events-none absolute inset-0" />
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
          <div className={`grid items-center gap-8 lg:grid-cols-[1.3fr_1fr] ${active ? "py-10 sm:py-14 lg:py-16" : "py-20 sm:py-28 lg:py-36"}`}>
            <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col items-start">
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
                <span className="font-serif font-normal italic text-[color:var(--accent-2)]">campus culture.</span>
              </motion.h1>

              <motion.p
                variants={item}
                className="mt-6 max-w-2xl text-lg leading-relaxed text-[color:var(--muted-on-dark)] sm:text-xl"
              >
                We put your brand in front of college students through events, brand
                ambassadors, and product placement — on the campuses where they live,
                study, and go out.
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

            {active ? <ReelApparatus progress={scrollYProgress} /> : <Coin reduce={!!reduce} />}
          </div>
        </Container>

        <MotionTicker
          items={["EVENTS", "BRAND AMBASSADORS", "PRODUCT PLACEMENT", `${getStat("campuses")}+ MARKETS`]}
        />
      </section>
    </div>
  );
}

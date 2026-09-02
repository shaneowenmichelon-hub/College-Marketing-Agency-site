"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

/**
 * Scroll-driven "reel in the CA coin, then crash" moment, placed right after the
 * hero. It is NOT scroll-jacking: a tall wrapper with a sticky inner viewport
 * lets the user scroll normally while scroll PROGRESS (0→1) drives the animation.
 * You scroll a few extra screens; the winch reels the coin up in three cranks;
 * on the third it crashes down with a dust burst; then the page continues.
 * Reduced motion (or pre-hydration) → a compact static scene, no extra height.
 */
export function CoinReel() {
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [stage, setStage] = useState(1); // 1..3 reels, then "crash"/"done"
  const [crashed, setCrashed] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMounted(true), []);
  const active = mounted && !reduce;

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // Winch + crank rotate 3 full turns as the coin is reeled up.
  const wheelRotate = useTransform(scrollYProgress, [0, 0.75], [0, 1080]);
  // Coin: sits low, reels up to the wheel by 0.75, holds, then crashes down.
  const coinY = useTransform(
    scrollYProgress,
    [0, 0.75, 0.82, 0.9, 1],
    [250, 96, 96, 360, 360],
  );
  const coinRotate = useTransform(
    scrollYProgress,
    [0, 0.75, 0.82, 0.9],
    [0, 40, 40, 200],
  );
  const ropeEndY = useTransform(coinY, (v) => v - 30); // rope meets coin's top
  // Dust burst on impact.
  const dustOpacity = useTransform(scrollYProgress, [0.82, 0.9, 0.98], [0, 0.85, 0]);
  const dustScale = useTransform(scrollYProgress, [0.82, 1], [0.3, 1.9]);
  // Text/coin nudge label.
  const labelOpacity = useTransform(scrollYProgress, [0, 0.05, 0.86, 0.95], [0, 1, 1, 0]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setStage(v < 0.27 ? 1 : v < 0.54 ? 2 : v < 0.8 ? 3 : v < 0.92 ? 4 : 5);
    setCrashed(v >= 0.86);
  });

  const stageLabel =
    stage <= 3 ? `Reel ${stage} / 3` : crashed ? "Impact." : "Reeling…";

  // Shared scene markup (viewBox scene). `animated` toggles motion vs. static.
  const Scene = ({ animated }: { animated: boolean }) => (
    <svg
      viewBox="0 0 320 400"
      className="h-[min(70vh,460px)] w-auto max-w-full"
      role="img"
      aria-label="A worker cranks a winch that reels in the Collegiate Agency coin."
    >
      {/* ground */}
      <line x1="20" y1="360" x2="300" y2="360" stroke="var(--ink)" strokeWidth="3" />

      {/* winch post + wheel (top right) */}
      <line x1="232" y1="96" x2="232" y2="360" stroke="var(--ink)" strokeWidth="6" />
      {animated ? (
        <motion.g style={{ rotate: wheelRotate, transformBox: "fill-box", transformOrigin: "center" }}>
          <WheelSpokes />
        </motion.g>
      ) : (
        <g>
          <WheelSpokes />
        </g>
      )}

      {/* rope */}
      {animated ? (
        <motion.line x1="232" y1="96" x2="188" y2={ropeEndY} stroke="var(--ink)" strokeWidth="3" />
      ) : (
        <line x1="232" y1="96" x2="188" y2="150" stroke="var(--ink)" strokeWidth="3" />
      )}

      {/* the person / crank operator (left) */}
      <Operator />

      {/* dust burst */}
      {animated && (
        <motion.g style={{ opacity: dustOpacity, scale: dustScale, transformBox: "fill-box", transformOrigin: "center" }}>
          <g transform="translate(188 352)">
            <circle cx="-26" cy="0" r="10" fill="var(--muted-on-light)" opacity="0.5" />
            <circle cx="0" cy="-6" r="14" fill="var(--muted-on-light)" opacity="0.45" />
            <circle cx="26" cy="0" r="11" fill="var(--muted-on-light)" opacity="0.5" />
            <circle cx="-12" cy="6" r="8" fill="var(--muted-on-light)" opacity="0.4" />
            <circle cx="16" cy="6" r="9" fill="var(--muted-on-light)" opacity="0.4" />
          </g>
        </motion.g>
      )}

      {/* the CA coin on the rope */}
      {animated ? (
        <motion.g style={{ y: coinY }}>
          <motion.g style={{ rotate: coinRotate, transformBox: "fill-box", transformOrigin: "center" }}>
            <CoinFace />
          </motion.g>
        </motion.g>
      ) : (
        <g transform="translate(0 150)">
          <CoinFace />
        </g>
      )}
    </svg>
  );

  return (
    <div ref={wrapRef} className={active ? "relative h-[260vh] sm:h-[320vh]" : "relative"}>
      <section
        className={`grain relative flex flex-col items-center justify-center overflow-hidden border-b-2 border-ink bg-ink text-white ${
          active ? "sticky top-0 h-[100svh]" : "min-h-[70svh] py-16"
        }`}
      >
        <div aria-hidden className="mesh pointer-events-none absolute inset-0" />
        <div className="relative z-10 flex flex-col items-center px-5 text-center">
          <p className="mono-label text-[11px] tracking-[0.2em] text-[color:var(--accent-2)]">
            Campus attention takes work
          </p>
          <h2 className="mt-3 max-w-md font-display text-2xl font-bold leading-tight sm:text-3xl">
            Keep scrolling — reel the coin in.
          </h2>

          <div className="relative mt-4">
            <Scene animated={active} />
          </div>

          {active ? (
            <motion.p
              style={{ opacity: labelOpacity }}
              className="mono-label mt-2 text-[11px] font-bold tracking-widest text-white"
            >
              {stageLabel}
            </motion.p>
          ) : (
            <p className="mono-label mt-2 text-[11px] font-bold tracking-widest text-white/70">
              Campus culture, on the ground.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

/** The winch wheel with spokes + a crank handle. Centered on (232,96). */
function WheelSpokes() {
  return (
    <g>
      <circle cx="232" cy="96" r="40" fill="var(--accent)" stroke="var(--ink)" strokeWidth="4" />
      <circle cx="232" cy="96" r="7" fill="var(--ink)" />
      {[0, 45, 90, 135].map((a) => (
        <line
          key={a}
          x1="232"
          y1="96"
          x2={232 + 36 * Math.cos((a * Math.PI) / 180)}
          y2={96 + 36 * Math.sin((a * Math.PI) / 180)}
          stroke="var(--ink)"
          strokeWidth="3"
        />
      ))}
      {/* crank handle */}
      <line x1="232" y1="96" x2="232" y2="60" stroke="var(--ink)" strokeWidth="4" />
      <circle cx="232" cy="56" r="6" fill="var(--accent-2)" stroke="var(--ink)" strokeWidth="3" />
    </g>
  );
}

/** A simple crank operator to the left of the wheel. */
function Operator() {
  return (
    <g stroke="var(--ink)" strokeWidth="6" strokeLinecap="round" fill="none">
      {/* head */}
      <circle cx="120" cy="150" r="13" fill="var(--accent-2)" />
      {/* body */}
      <line x1="120" y1="163" x2="120" y2="300" />
      {/* legs */}
      <line x1="120" y1="300" x2="100" y2="352" />
      <line x1="120" y1="300" x2="140" y2="352" />
      {/* arms reaching to the crank */}
      <line x1="120" y1="205" x2="180" y2="150" />
      <line x1="120" y1="205" x2="176" y2="120" />
    </g>
  );
}

/** The CA coin face, centered on x=188, local y=0 (translated by the group). */
function CoinFace() {
  return (
    <g>
      <circle cx="188" cy="0" r="28" fill="var(--accent-2)" stroke="var(--ink)" strokeWidth="5" />
      <circle cx="188" cy="0" r="28" fill="none" stroke="var(--ink)" strokeWidth="2" opacity="0.4" />
      <text
        x="188"
        y="0"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="22"
        fontWeight="800"
        fill="var(--ink)"
        style={{ fontFamily: "var(--font-display), system-ui, sans-serif" }}
      >
        CA
      </text>
    </g>
  );
}

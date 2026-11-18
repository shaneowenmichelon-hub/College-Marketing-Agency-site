"use client";

import type { RefObject } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";

/**
 * Scroll-driven reel: the big CA coin hangs up top; a worker cranking a cable
 * spool on an A-frame stand sits at the bottom, roping the coin in. Three scrolls
 * lower the coin toward the spool; on the third it drops with a dust burst, then
 * the page scrolls on. Driven by hero scroll progress, so it never traps the user.
 */
const PANTS = "#F4A9C7";
const SKIN = "#C98A5E";

// Fixed geometry (viewBox units). Coin hangs from a pulley at the top of the
// boom; because the pulley sits directly above the coin, the hang-rope stays
// vertical the whole way down — the coin is reeled straight in, never swinging.
const PULLEY = { x: 132, y: 74 };
const COIN_X = 132;
const COIN_R = 46;
const SPOOL = { x: 214, y: 392, r: 34 };
const GROUND_Y = 452;

function ReelApparatus({ progress }: { progress: MotionValue<number> }) {
  const appear = useTransform(progress, [0, 0.1], [0, 1]);
  // One scroll: the coin is reeled straight down, then drops to the ground with a
  // dust burst near the end, after which the page scrolls on.
  const coinY = useTransform(
    progress,
    [0.15, 0.7, 0.88, 1],
    [150, 300, GROUND_Y - COIN_R, GROUND_Y - COIN_R],
  );
  const ropeEndY = useTransform(coinY, (v) => v - COIN_R); // hang-rope meets coin top
  const hangRopeOpacity = useTransform(progress, [0, 0.1, 0.8, 0.88], [0, 1, 1, 0]);
  const dustOpacity = useTransform(progress, [0.8, 0.88, 0.99], [0, 1, 0]);
  const dustScale = useTransform(progress, [0.8, 1], [0.3, 3.2]);

  return (
    <div className="relative mx-auto w-full max-w-[240px] justify-self-center sm:max-w-[300px] lg:max-w-[360px]">
      <svg viewBox="0 0 300 480" className="w-full" role="img" aria-label="A worker cranks a cable spool that reels the big Collegiate Agency coin straight down, then it drops.">
        {/* ground */}
        <line x1="20" y1={GROUND_Y} x2="280" y2={GROUND_Y} stroke="var(--ink)" strokeWidth="3" />

        {/* ── rig: A-frame base + boom to the pulley (drawn behind coin) ── */}
        <motion.g style={{ opacity: appear }}>
          {/* A-frame legs holding the spool */}
          <path d={`M180 ${GROUND_Y}L${SPOOL.x} 360`} stroke="var(--accent)" strokeWidth="12" strokeLinecap="round" />
          <path d={`M248 ${GROUND_Y}L${SPOOL.x} 360`} stroke="var(--accent)" strokeWidth="12" strokeLinecap="round" />
          <line x1="192" y1="414" x2="236" y2="414" stroke="var(--accent)" strokeWidth="9" strokeLinecap="round" />
          {/* boom arm reaching up-left to the pulley above the coin */}
          <path d={`M${SPOOL.x} 360L${PULLEY.x} ${PULLEY.y}`} stroke="var(--accent)" strokeWidth="11" strokeLinecap="round" />
          {/* drive rope (white): spool → up the boom → over the pulley (static) */}
          <line x1={SPOOL.x} y1={SPOOL.y} x2={PULLEY.x} y2={PULLEY.y} stroke="#fff" strokeWidth="3" />
          {/* pulley wheel */}
          <circle cx={PULLEY.x} cy={PULLEY.y} r="9" fill="#fff" stroke="var(--ink)" strokeWidth="4" />
          <circle cx={PULLEY.x} cy={PULLEY.y} r="2.5" fill="var(--ink)" />
        </motion.g>

        {/* hang-rope (white): pulley straight down to the coin (always vertical) */}
        <motion.line x1={PULLEY.x} y1={PULLEY.y} x2={COIN_X} y2={ropeEndY} stroke="#fff" strokeWidth="3.5" style={{ opacity: hangRopeOpacity }} />

        {/* the BIG CA coin (no spin — just reeled down) */}
        <motion.g style={{ y: coinY, opacity: appear }}>
          <circle cx={COIN_X} cy="0" r={COIN_R} fill="var(--accent-2)" stroke="var(--ink)" strokeWidth="6" />
          <circle cx={COIN_X} cy="0" r={COIN_R} fill="none" stroke="var(--ink)" strokeWidth="2" opacity="0.35" />
          {/* small hang loop at the top of the coin */}
          <circle cx={COIN_X} cy={-COIN_R} r="5" fill="none" stroke="var(--ink)" strokeWidth="3" />
          <text
            x={COIN_X}
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

        {/* dust burst where the coin lands */}
        <motion.g style={{ opacity: dustOpacity, scale: dustScale, transformBox: "fill-box", transformOrigin: "center" }}>
          <g transform={`translate(${COIN_X} ${GROUND_Y - 6})`}>
            <circle cx="-62" cy="4" r="15" fill="#fff" opacity="0.45" />
            <circle cx="-46" cy="-12" r="16" fill="#fff" opacity="0.5" />
            <circle cx="-30" cy="-24" r="18" fill="#fff" opacity="0.55" />
            <circle cx="-10" cy="-32" r="20" fill="#fff" opacity="0.5" />
            <circle cx="12" cy="-30" r="20" fill="#fff" opacity="0.55" />
            <circle cx="34" cy="-22" r="18" fill="#fff" opacity="0.5" />
            <circle cx="54" cy="-8" r="16" fill="#fff" opacity="0.5" />
            <circle cx="66" cy="6" r="14" fill="#fff" opacity="0.45" />
            <circle cx="-40" cy="14" r="13" fill="#fff" opacity="0.45" />
            <circle cx="-18" cy="6" r="16" fill="#fff" opacity="0.45" />
            <circle cx="0" cy="2" r="24" fill="#fff" opacity="0.4" />
            <circle cx="22" cy="8" r="17" fill="#fff" opacity="0.45" />
            <circle cx="44" cy="14" r="13" fill="#fff" opacity="0.45" />
            <circle cx="-6" cy="-14" r="15" fill="#fff" opacity="0.5" />
          </g>
        </motion.g>

        {/* ── spool + worker (in front of the rig) ── */}
        <motion.g style={{ opacity: appear }}>
          {/* cable spool (side view) — a reel full of white cable; stays still, only the rope moves */}
          <g>
            {/* rim */}
            <circle cx={SPOOL.x} cy={SPOOL.y} r={SPOOL.r} fill="#fff" stroke="var(--ink)" strokeWidth="5" />
            {/* wound white cable filling the reel (bright, always present) */}
            {[30, 25, 20, 15].map((r) => (
              <circle key={r} cx={SPOOL.x} cy={SPOOL.y} r={r} fill="none" stroke="#fff" strokeWidth="3.5" />
            ))}
            {[27.5, 22.5, 17.5, 12.5].map((r) => (
              <circle key={r} cx={SPOOL.x} cy={SPOOL.y} r={r} fill="none" stroke="var(--ink)" strokeWidth="0.75" opacity="0.5" />
            ))}
            <circle cx={SPOOL.x} cy={SPOOL.y} r="6" fill="var(--ink)" />
            {/* crank handle on the rim */}
            <circle cx={SPOOL.x} cy={SPOOL.y - SPOOL.r} r="6" fill="var(--accent-2)" stroke="var(--ink)" strokeWidth="3" />
          </g>

          {/* worker to the right of the spool, bent over cranking it */}
          <g>
            {/* legs (pink) */}
            <path d={`M250 388l-6 ${GROUND_Y - 388}`} stroke={PANTS} strokeWidth="14" strokeLinecap="round" />
            <path d={`M264 388l8 ${GROUND_Y - 388}`} stroke={PANTS} strokeWidth="14" strokeLinecap="round" />
            {/* shoes */}
            <path d={`M236 ${GROUND_Y}h18`} stroke="#fff" strokeWidth="8" strokeLinecap="round" />
            <path d={`M264 ${GROUND_Y}h18`} stroke="#fff" strokeWidth="8" strokeLinecap="round" />
            {/* torso (blue shirt), leaning toward the spool */}
            <path d="M258 392l-16 -44" stroke="var(--accent)" strokeWidth="22" strokeLinecap="round" />
            {/* arm reaching down-left to the crank */}
            <path d={`M244 356L${SPOOL.x + 4} ${SPOOL.y - SPOOL.r + 4}`} stroke="var(--accent)" strokeWidth="11" strokeLinecap="round" />
            <path d={`M${SPOOL.x + 10} ${SPOOL.y - SPOOL.r} l-10 -2`} stroke={SKIN} strokeWidth="9" strokeLinecap="round" />
            {/* head + cap */}
            <circle cx="250" cy="336" r="15" fill={SKIN} stroke="var(--ink)" strokeWidth="3" />
            <path d="M234 332a16 12 0 0 1 32 0z" fill="var(--accent)" stroke="var(--ink)" strokeWidth="3" />
            <path d="M234 332h-14" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" />
          </g>
        </motion.g>
      </svg>
    </div>
  );
}


export function HeroReel({ target }: { target: RefObject<HTMLDivElement | null> }) {
  const { scrollYProgress } = useScroll({ target, offset: ["start start", "center start"] });
  return <ReelApparatus progress={scrollYProgress} />;
}

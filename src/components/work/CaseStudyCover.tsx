import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * Cover art for a case study card.
 *
 * Two kinds: a real activation photo, or an original flat-vector cartoon in the
 * site palette. The cartoons follow the same conventions as the article covers
 * in src/components/insights/ArticleArt.tsx — 400x200 viewBox, ink outlines,
 * inline SVG with CSS-only motion, no external assets and nothing to license.
 * The shared `.art-*` classes in globals.css already stop animating under
 * prefers-reduced-motion.
 */

const INK = "var(--ink)";
const BLUE = "var(--accent)";
const LIME = "var(--accent-2)";
const MAGENTA = "var(--magenta)";
const ORANGE = "var(--orange)";

export type CoverScene = "apartment" | "bolt";

const SCENE_BG: Record<CoverScene, string> = {
  apartment: BLUE,
  bolt: ORANGE,
};

/** Apartment block with windows lighting up and a swinging LEASED sign. */
function Apartment() {
  const windows = [144, 186, 228].flatMap((x, col) =>
    [58, 96].map((y, row) => ({ x, y, delay: (col * 2 + row) * 0.35 })),
  );
  return (
    <g>
      {/* roof */}
      <path d="M108 42L200 12l92 30z" fill={MAGENTA} stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      {/* block */}
      <rect x="120" y="40" width="160" height="140" fill="#fff" stroke={INK} strokeWidth="5" />
      {/* windows switching on one by one — units filling up */}
      {windows.map((w) => (
        <rect
          key={`${w.x}-${w.y}`}
          className="art-anim art-pulse"
          style={{ animationDelay: `${w.delay}s` }}
          x={w.x}
          y={w.y}
          width="28"
          height="26"
          fill={LIME}
          stroke={INK}
          strokeWidth="4"
        />
      ))}
      {/* door + step */}
      <rect x="182" y="136" width="36" height="44" fill={MAGENTA} stroke={INK} strokeWidth="4" />
      <circle cx="210" cy="158" r="3" fill={INK} />
      <line x1="120" y1="180" x2="280" y2="180" stroke={INK} strokeWidth="5" />
      {/* hanging sign — kept clear of the right edge so the swing never clips */}
      <line x1="300" y1="52" x2="300" y2="180" stroke={INK} strokeWidth="5" />
      <line x1="300" y1="52" x2="344" y2="52" stroke={INK} strokeWidth="5" />
      <g className="art-anim art-sway" style={{ transformOrigin: "344px 54px" }}>
        <line x1="344" y1="52" x2="344" y2="66" stroke={INK} strokeWidth="4" />
        <rect x="304" y="66" width="80" height="40" rx="5" fill="#fff" stroke={INK} strokeWidth="5" />
        <text
          x="344"
          y="92"
          textAnchor="middle"
          fontSize="16"
          fontWeight="800"
          fill={INK}
          style={{ fontFamily: "var(--font-display),sans-serif" }}
        >
          LEASED
        </text>
      </g>
      {/* floating keys */}
      <g className="art-anim art-float" style={{ transformOrigin: "68px 108px" }}>
        <circle cx="62" cy="96" r="14" fill="none" stroke={INK} strokeWidth="5" />
        <line x1="62" y1="110" x2="62" y2="140" stroke={INK} strokeWidth="5" />
        <line x1="62" y1="126" x2="74" y2="126" stroke={INK} strokeWidth="5" />
        <line x1="62" y1="136" x2="72" y2="136" stroke={INK} strokeWidth="5" />
      </g>
    </g>
  );
}

/** Lightning bolt with energy rings — the energy-drink sampling story. */
function Bolt() {
  return (
    <g>
      {/* charge rings radiating out */}
      <circle
        className="art-anim art-pulse"
        style={{ transformOrigin: "200px 100px" }}
        cx="200"
        cy="100"
        r="66"
        fill="none"
        stroke={INK}
        strokeWidth="4"
        opacity="0.45"
      />
      <circle
        className="art-anim art-pulse"
        style={{ transformOrigin: "200px 100px", animationDelay: "0.7s" }}
        cx="200"
        cy="100"
        r="86"
        fill="none"
        stroke={INK}
        strokeWidth="4"
        opacity="0.28"
      />
      {/* the bolt */}
      <path
        className="art-anim art-pulse"
        style={{ transformOrigin: "200px 100px" }}
        d="M214 20L156 106h38l-14 74 62-92h-40l24-68z"
        fill={LIME}
        stroke={INK}
        strokeWidth="5"
        strokeLinejoin="round"
      />
      {/* sparks */}
      <path
        className="art-anim art-float"
        d="M92 56l5 13 13 5-13 5-5 13-5-13-13-5 13-5z"
        fill="#fff"
        stroke={INK}
        strokeWidth="3"
      />
      <path
        className="art-anim art-float-lg"
        d="M312 130l4 11 11 4-11 4-4 11-4-11-11-4 11-4z"
        fill="#fff"
        stroke={INK}
        strokeWidth="3"
      />
      <circle className="art-anim art-pulse" style={{ animationDelay: "1.1s" }} cx="322" cy="54" r="9" fill={MAGENTA} stroke={INK} strokeWidth="4" />
      <circle className="art-anim art-pulse" style={{ animationDelay: "0.4s" }} cx="82" cy="146" r="7" fill={MAGENTA} stroke={INK} strokeWidth="4" />
    </g>
  );
}

const SCENES: Record<CoverScene, () => React.ReactElement> = {
  apartment: Apartment,
  bolt: Bolt,
};

export function CaseStudyCover({
  scene,
  image,
  imageAlt,
  label,
  className,
  sizes = "(min-width: 768px) 33vw, 100vw",
  priority = false,
}: {
  scene?: CoverScene;
  image?: string;
  imageAlt?: string;
  label?: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const Caption = label ? (
    <span className="absolute bottom-3 left-3 z-20 rounded-full bg-black/45 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
      {label}
    </span>
  ) : null;

  if (image) {
    return (
      <div className={cn("relative overflow-hidden", className)}>
        <Image src={image} alt={imageAlt ?? ""} fill sizes={sizes} priority={priority} className="object-cover" />
        {Caption}
      </div>
    );
  }

  const key: CoverScene = scene ?? "bolt";
  const SceneEl = SCENES[key];

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundColor: SCENE_BG[key] }}
    >
      <div aria-hidden className="grain absolute inset-0 opacity-40" />
      {/* faint grid, matching the hero motif */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(var(--ink) 1px, transparent 1px), linear-gradient(90deg, var(--ink) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <svg
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid meet"
        className="relative z-10 h-full w-full"
        role="img"
        aria-label={imageAlt ?? "Case study illustration"}
      >
        <SceneEl />
      </svg>
      {Caption}
    </div>
  );
}

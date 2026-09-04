import { cn } from "@/lib/utils";
import { resolveScene, type Scene } from "@/lib/article-art";

/**
 * Original, on-brand ANIMATED cover illustrations for insight articles — flat
 * vector art in the site's palette (ink outlines, electric blue, acid lime,
 * magenta, orange). Fully inline SVG with CSS-only motion: no external assets,
 * no licensing, no network, no JS. A scene is chosen per article by an optional
 * `art` override, then slug/category keyword, so related posts still vary. The
 * same resolver drives the 48h cron that assigns covers to new articles.
 */

const INK = "var(--ink)";
const BLUE = "var(--accent)";
const LIME = "var(--accent-2)";
const MAGENTA = "var(--magenta)";
const ORANGE = "var(--orange)";

const SCENE_BG: Record<Scene, string> = {
  creators: BLUE,
  product: LIME,
  events: ORANGE,
  ambassadors: MAGENTA,
  strategy: BLUE,
};

function Creators() {
  // Phone livestream with floating hearts + chat — student creators.
  return (
    <g>
      <g className="art-anim art-float-lg">
        <rect x="150" y="34" width="100" height="150" rx="14" fill="#fff" stroke={INK} strokeWidth="5" />
        <rect x="162" y="52" width="76" height="96" rx="6" fill={LIME} stroke={INK} strokeWidth="3" />
        <circle cx="200" cy="92" r="17" fill="#fff" stroke={INK} strokeWidth="4" />
        <path d="M182 132c0-12 36-12 36 0" fill="#fff" stroke={INK} strokeWidth="4" />
        <path d="M194 88l14 8-14 8z" fill={INK} />
        <circle cx="200" cy="166" r="6" fill={INK} />
      </g>
      {/* floating hearts */}
      <path className="art-anim art-float" d="M96 70c6-10 22-4 0 14-22-18-6-24 0-14z" fill={MAGENTA} stroke={INK} strokeWidth="3" />
      <path className="art-anim art-float-lg" d="M300 110c5-8 18-3 0 11-18-14-5-19 0-11z" fill={MAGENTA} stroke={INK} strokeWidth="3" />
      {/* chat bubble */}
      <g className="art-anim art-bob">
        <rect x="286" y="44" width="66" height="34" rx="8" fill="#fff" stroke={INK} strokeWidth="4" />
        <path d="M300 78l-8 12 20-12z" fill="#fff" stroke={INK} strokeWidth="4" />
        <line x1="298" y1="58" x2="340" y2="58" stroke={INK} strokeWidth="4" />
        <line x1="298" y1="68" x2="326" y2="68" stroke={INK} strokeWidth="4" />
      </g>
    </g>
  );
}

function Product() {
  // A can with sparkles + offering hand — product placement / sampling.
  return (
    <g>
      <g className="art-anim art-float">
        <rect x="168" y="40" width="64" height="118" rx="12" fill="#fff" stroke={INK} strokeWidth="5" />
        <rect x="168" y="82" width="64" height="34" fill={BLUE} stroke={INK} strokeWidth="4" />
        <ellipse cx="200" cy="40" rx="32" ry="9" fill="#fff" stroke={INK} strokeWidth="5" />
        <text x="200" y="104" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" style={{ fontFamily: "var(--font-display),sans-serif" }}>CA</text>
      </g>
      {/* sparkles */}
      <path className="art-anim art-pulse" d="M120 60l6 16 16 6-16 6-6 16-6-16-16-6 16-6z" fill={LIME} stroke={INK} strokeWidth="3" />
      <path className="art-anim art-pulse" style={{ animationDelay: "0.8s" }} d="M286 96l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill={MAGENTA} stroke={INK} strokeWidth="3" />
      {/* offering hand */}
      <path d="M150 170c14-14 96-14 110 0" fill={ORANGE} stroke={INK} strokeWidth="5" />
    </g>
  );
}

function Events() {
  // Stage arch + swaying spotlights + speaker — events / tour / sponsorship.
  return (
    <g>
      {/* spotlight beams sway */}
      <path className="art-anim art-sway" style={{ transformOrigin: "60px 24px" }} d="M60 24L30 176h40L96 24z" fill={LIME} opacity="0.5" />
      <path className="art-anim art-sway" style={{ transformOrigin: "340px 24px", animationDelay: "0.9s" }} d="M340 24l30 152h-40L304 24z" fill={LIME} opacity="0.5" />
      {/* stage arch */}
      <path d="M120 176V96a80 80 0 0 1 160 0v80" fill="#fff" stroke={INK} strokeWidth="5" />
      <rect x="150" y="120" width="100" height="56" fill={BLUE} stroke={INK} strokeWidth="4" />
      {/* speaker */}
      <rect x="286" y="120" width="46" height="56" rx="6" fill={INK} />
      <circle className="art-anim art-pulse" cx="309" cy="140" r="9" fill={LIME} />
      <circle cx="309" cy="160" r="6" fill="#fff" />
      {/* crowd bobbing */}
      <circle className="art-anim art-bob" cx="150" cy="180" r="12" fill={MAGENTA} stroke={INK} strokeWidth="4" />
      <circle className="art-anim art-bob" style={{ animationDelay: "0.4s" }} cx="180" cy="182" r="12" fill={ORANGE} stroke={INK} strokeWidth="4" />
      <circle className="art-anim art-bob" style={{ animationDelay: "0.8s" }} cx="210" cy="180" r="12" fill={LIME} stroke={INK} strokeWidth="4" />
      {/* note */}
      <g className="art-anim art-float">
        <circle cx="196" cy="150" r="7" fill={INK} />
        <line x1="203" y1="150" x2="203" y2="126" stroke={INK} strokeWidth="4" />
      </g>
    </g>
  );
}

function Ambassadors() {
  // Two students + megaphone — ambassadors / brand reps.
  return (
    <g>
      {/* person 1 */}
      <g className="art-anim art-bob">
        <circle cx="132" cy="66" r="18" fill={LIME} stroke={INK} strokeWidth="5" />
        <path d="M104 176v-40a28 28 0 0 1 56 0v40" fill="#fff" stroke={INK} strokeWidth="5" />
      </g>
      {/* person 2 */}
      <g className="art-anim art-bob" style={{ animationDelay: "0.5s" }}>
        <circle cx="210" cy="72" r="16" fill={ORANGE} stroke={INK} strokeWidth="5" />
        <path d="M186 176v-36a24 24 0 0 1 48 0v36" fill="#fff" stroke={INK} strokeWidth="5" />
      </g>
      {/* megaphone shakes + sound waves pulse */}
      <g className="art-anim art-sway" style={{ transformOrigin: "262px 96px" }}>
        <path d="M262 96l60-22v58l-60-22z" fill={BLUE} stroke={INK} strokeWidth="5" />
        <rect x="250" y="98" width="14" height="30" rx="4" fill="#fff" stroke={INK} strokeWidth="4" />
      </g>
      <path className="art-anim art-pulse" style={{ transformOrigin: "330px 104px" }} d="M330 84c10 6 10 34 0 40" fill="none" stroke={INK} strokeWidth="4" />
      <path className="art-anim art-pulse" style={{ transformOrigin: "340px 111px", animationDelay: "0.5s" }} d="M340 74c18 12 18 62 0 74" fill="none" stroke={INK} strokeWidth="4" />
    </g>
  );
}

function Strategy() {
  // Growing bars + spinning target — strategy / agency / gen-z.
  return (
    <g>
      {/* bars grow */}
      <rect className="art-anim art-grow" x="60" y="130" width="30" height="46" fill={LIME} stroke={INK} strokeWidth="4" />
      <rect className="art-anim art-grow" style={{ animationDelay: "0.4s" }} x="98" y="106" width="30" height="70" fill={ORANGE} stroke={INK} strokeWidth="4" />
      <rect className="art-anim art-grow" style={{ animationDelay: "0.8s" }} x="136" y="78" width="30" height="98" fill={MAGENTA} stroke={INK} strokeWidth="4" />
      <path d="M64 128l40-24 40-28 34-24" fill="none" stroke={INK} strokeWidth="4" />
      <path d="M178 52l14-4-4 14z" fill={INK} />
      {/* target: outer ring spins, bullseye pulses */}
      <circle cx="290" cy="104" r="52" fill="#fff" stroke={INK} strokeWidth="5" />
      <g className="art-anim art-spin" style={{ transformOrigin: "290px 104px" }}>
        <circle cx="290" cy="104" r="32" fill={BLUE} stroke={INK} strokeWidth="4" />
        <path d="M330 64l24-14-8 22z" fill={MAGENTA} stroke={INK} strokeWidth="3" />
      </g>
      <circle className="art-anim art-pulse" style={{ transformOrigin: "290px 104px" }} cx="290" cy="104" r="12" fill={LIME} stroke={INK} strokeWidth="4" />
    </g>
  );
}

const SCENES_MAP: Record<Scene, () => React.ReactElement> = {
  creators: Creators,
  product: Product,
  events: Events,
  ambassadors: Ambassadors,
  strategy: Strategy,
};

export function ArticleArt({
  slug,
  category,
  art,
  className,
  rounded = "rounded-2xl",
}: {
  slug: string;
  category: string;
  /** Optional explicit scene override (frontmatter / cron manifest). */
  art?: string;
  className?: string;
  rounded?: string;
}) {
  const scene = resolveScene(slug, category, art);
  const SceneEl = SCENES_MAP[scene];
  return (
    <div
      className={cn("relative overflow-hidden border-2 border-ink", rounded, className)}
      style={{ backgroundColor: SCENE_BG[scene] }}
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
        aria-label={`Illustration for ${category} article`}
      >
        <SceneEl />
      </svg>
    </div>
  );
}

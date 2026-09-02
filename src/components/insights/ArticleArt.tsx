import { cn } from "@/lib/utils";

/**
 * Original, on-brand cartoon illustrations for insight articles — flat vector art
 * in the site's palette (ink outlines, electric blue, acid lime, magenta, orange).
 * Fully inline SVG: no external assets, no licensing, no network. A scene is
 * chosen per article by slug/category keyword so related posts still vary.
 */

type Scene = "creators" | "product" | "events" | "ambassadors" | "strategy";

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

/** Pick a scene from the slug first, then the category. */
function resolveScene(slug: string, category: string): Scene {
  const s = `${slug} ${category}`.toLowerCase();
  if (/(influencer|creator|content|ugc)/.test(s)) return "creators";
  if (/(product|sampling|nutrl|launch|drop)/.test(s)) return "product";
  if (/(event|tour|sponsor|activation|welcome|festival|night school)/.test(s)) return "events";
  if (/(ambassador|rep|sos|boots|street)/.test(s)) return "ambassadors";
  return "strategy";
}

function Creators() {
  // Phone livestream with hearts + play — student creators.
  return (
    <g>
      <rect x="150" y="34" width="100" height="150" rx="14" fill="#fff" stroke={INK} strokeWidth="5" />
      <rect x="162" y="52" width="76" height="96" rx="6" fill={LIME} stroke={INK} strokeWidth="3" />
      <circle cx="200" cy="92" r="17" fill="#fff" stroke={INK} strokeWidth="4" />
      <path d="M182 132c0-12 36-12 36 0" fill="#fff" stroke={INK} strokeWidth="4" />
      <path d="M194 88l14 8-14 8z" fill={INK} />
      <circle cx="200" cy="166" r="6" fill={INK} />
      {/* hearts */}
      <path d="M96 70c6-10 22-4 0 14-22-18-6-24 0-14z" fill={MAGENTA} stroke={INK} strokeWidth="3" />
      <path d="M300 110c5-8 18-3 0 11-18-14-5-19 0-11z" fill={MAGENTA} stroke={INK} strokeWidth="3" />
      {/* chat bubble */}
      <rect x="286" y="44" width="66" height="34" rx="8" fill="#fff" stroke={INK} strokeWidth="4" />
      <path d="M300 78l-8 12 20-12z" fill="#fff" stroke={INK} strokeWidth="4" />
      <line x1="298" y1="58" x2="340" y2="58" stroke={INK} strokeWidth="4" />
      <line x1="298" y1="68" x2="326" y2="68" stroke={INK} strokeWidth="4" />
    </g>
  );
}

function Product() {
  // A can being handed over with sparkle + price tag — product placement/sampling.
  return (
    <g>
      <rect x="168" y="40" width="64" height="118" rx="12" fill="#fff" stroke={INK} strokeWidth="5" />
      <rect x="168" y="82" width="64" height="34" fill={BLUE} stroke={INK} strokeWidth="4" />
      <ellipse cx="200" cy="40" rx="32" ry="9" fill="#fff" stroke={INK} strokeWidth="5" />
      <text x="200" y="104" textAnchor="middle" fontSize="15" fontWeight="800" fill="#fff" style={{ fontFamily: "var(--font-display),sans-serif" }}>CA</text>
      {/* sparkles */}
      <path d="M120 60l6 16 16 6-16 6-6 16-6-16-16-6 16-6z" fill={LIME} stroke={INK} strokeWidth="3" />
      <path d="M286 96l4 10 10 4-10 4-4 10-4-10-10-4 10-4z" fill={MAGENTA} stroke={INK} strokeWidth="3" />
      {/* offering hand */}
      <path d="M150 170c14-14 96-14 110 0" fill={ORANGE} stroke={INK} strokeWidth="5" />
    </g>
  );
}

function Events() {
  // Stage arch + spotlights + speaker — events/tour/sponsorship.
  return (
    <g>
      {/* spotlight beams */}
      <path d="M60 24L30 176h40L96 24z" fill={LIME} opacity="0.5" />
      <path d="M340 24l30 152h-40L304 24z" fill={LIME} opacity="0.5" />
      {/* stage arch */}
      <path d="M120 176V96a80 80 0 0 1 160 0v80" fill="#fff" stroke={INK} strokeWidth="5" />
      <rect x="150" y="120" width="100" height="56" fill={BLUE} stroke={INK} strokeWidth="4" />
      {/* speaker */}
      <rect x="286" y="120" width="46" height="56" rx="6" fill={INK} />
      <circle cx="309" cy="140" r="9" fill={LIME} />
      <circle cx="309" cy="160" r="6" fill="#fff" />
      {/* crowd */}
      <circle cx="150" cy="180" r="12" fill={MAGENTA} stroke={INK} strokeWidth="4" />
      <circle cx="180" cy="182" r="12" fill={ORANGE} stroke={INK} strokeWidth="4" />
      <circle cx="210" cy="180" r="12" fill={LIME} stroke={INK} strokeWidth="4" />
      {/* note */}
      <circle cx="196" cy="150" r="7" fill={INK} />
      <line x1="203" y1="150" x2="203" y2="126" stroke={INK} strokeWidth="4" />
    </g>
  );
}

function Ambassadors() {
  // Two students + megaphone — ambassadors / brand reps.
  return (
    <g>
      {/* person 1 */}
      <circle cx="132" cy="66" r="18" fill={LIME} stroke={INK} strokeWidth="5" />
      <path d="M104 176v-40a28 28 0 0 1 56 0v40" fill="#fff" stroke={INK} strokeWidth="5" />
      {/* person 2 */}
      <circle cx="210" cy="72" r="16" fill={ORANGE} stroke={INK} strokeWidth="5" />
      <path d="M186 176v-36a24 24 0 0 1 48 0v36" fill="#fff" stroke={INK} strokeWidth="5" />
      {/* megaphone */}
      <path d="M262 96l60-22v58l-60-22z" fill={BLUE} stroke={INK} strokeWidth="5" />
      <rect x="250" y="98" width="14" height="30" rx="4" fill="#fff" stroke={INK} strokeWidth="4" />
      <path d="M330 84c10 6 10 34 0 40" fill="none" stroke={INK} strokeWidth="4" />
      <path d="M340 74c18 12 18 62 0 74" fill="none" stroke={INK} strokeWidth="4" />
    </g>
  );
}

function Strategy() {
  // Target + rising bars + campus building — strategy / agency / gen-z.
  return (
    <g>
      {/* bars */}
      <rect x="60" y="130" width="30" height="46" fill={LIME} stroke={INK} strokeWidth="4" />
      <rect x="98" y="106" width="30" height="70" fill={ORANGE} stroke={INK} strokeWidth="4" />
      <rect x="136" y="78" width="30" height="98" fill={MAGENTA} stroke={INK} strokeWidth="4" />
      <path d="M64 128l40-24 40-28 34-24" fill="none" stroke={INK} strokeWidth="4" />
      <path d="M178 52l14-4-4 14z" fill={INK} />
      {/* target */}
      <circle cx="290" cy="104" r="52" fill="#fff" stroke={INK} strokeWidth="5" />
      <circle cx="290" cy="104" r="32" fill={BLUE} stroke={INK} strokeWidth="4" />
      <circle cx="290" cy="104" r="12" fill={LIME} stroke={INK} strokeWidth="4" />
      <path d="M330 64l24-14-8 22z" fill={MAGENTA} stroke={INK} strokeWidth="3" />
      <line x1="290" y1="104" x2="348" y2="56" stroke={INK} strokeWidth="4" />
    </g>
  );
}

const SCENES: Record<Scene, () => React.ReactElement> = {
  creators: Creators,
  product: Product,
  events: Events,
  ambassadors: Ambassadors,
  strategy: Strategy,
};

export function ArticleArt({
  slug,
  category,
  className,
  rounded = "rounded-2xl",
}: {
  slug: string;
  category: string;
  className?: string;
  rounded?: string;
}) {
  const scene = resolveScene(slug, category);
  const SceneEl = SCENES[scene];
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

import { ImageResponse } from "next/og";
import { getStat, siteConfig } from "@/site.config";

/**
 * The share card: what a link to this site looks like in iMessage, WhatsApp,
 * Slack, LinkedIn, X, Discord and every other unfurl.
 *
 * Deliberately a cartoon "game board" rather than a text slide. The three
 * things sold — product drops, ambassadors, event sponsorship — each get a
 * chunky stamped tile popping off a cream board, with burst pills and sparks
 * around them, in the site's own Elevated-Brutalism palette.
 *
 * Two constraints drove the layout:
 *
 * 1. It is SMALL where it matters. An iMessage bubble renders this around 300pt
 *    wide, so anything subtle disappears. Hence three big shapes, four words of
 *    headline and nothing finer than a HUD chip. Read it squinting; if a
 *    detail does not survive that, it is not in here.
 * 2. It cannot move. Link unfurls in iMessage, WhatsApp, Slack and LinkedIn
 *    render a still frame — Apple's LinkPresentation takes og:image and draws
 *    it static, and an animated GIF would just show as its first frame (and
 *    risks not unfurling at all on the pickier clients). So the motion is
 *    implied — tilt, hard offset shadows, burst pills and confetti — rather
 *    than animated. If this artwork is ever wanted in motion, that belongs on
 *    the site itself, not here.
 *
 * Regenerating /public/share-card.png after changing this file:
 *
 *   npm run build && (PORT=3100 npm run start &)
 *   curl -s -o public/share-card.png http://localhost:3100/opengraph-image
 *
 * then bump SHARE_CARD_VERSION in src/lib/seo.ts so every unfurler refetches.
 *
 * Built from divs, not inline SVG: Satori (what next/og renders with) is
 * reliable on flexbox, borders, radii, shadows and transforms, and patchy on
 * SVG path features. Chunky cartoon shapes are exactly what divs do well.
 */

export const shareCardSize = { width: 1200, height: 630 };
export const shareCardContentType = "image/png";

const INK = "#0B0B0F";
const BLUE = "#2F5BFF";
const LIME = "#C6FF3D";
const MAGENTA = "#FF3D9A";
const ORANGE = "#FF6A2B";
const CREAM = "#F4F2EA";

/** A stamped tile: hard ink border, hard offset shadow, tilted like a sticker. */
function Tile({
  bg,
  rotate,
  left,
  top,
  size = 198,
  children,
}: {
  bg: string;
  rotate: number;
  left: number;
  top: number;
  size?: number;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: bg,
        border: `5px solid ${INK}`,
        borderRadius: 18,
        boxShadow: `12px 12px 0 ${INK}`,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {children}
    </div>
  );
}

/** Product drop: a can mid-fall with speed lines above it. */
function DropIcon() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
        {[18, 30, 18].map((h, i) => (
          <div key={i} style={{ width: 8, height: h, borderRadius: 4, background: INK }} />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: 60,
          height: 92,
          background: "#ffffff",
          border: `5px solid ${INK}`,
          borderRadius: 12,
        }}
      >
        <div style={{ display: "flex", width: "100%", height: 13, background: INK }} />
      </div>
    </div>
  );
}

/** Ambassador: a head and shoulders with a star badge clipped to the shoulder. */
function AmbassadorIcon() {
  return (
    <div style={{ display: "flex", position: "relative", width: 112, height: 104 }}>
      <div
        style={{
          position: "absolute",
          left: 32,
          top: 0,
          width: 46,
          height: 46,
          borderRadius: 999,
          background: "#ffffff",
          border: `5px solid ${INK}`,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 10,
          top: 54,
          width: 90,
          height: 52,
          borderTopLeftRadius: 46,
          borderTopRightRadius: 46,
          background: "#ffffff",
          border: `5px solid ${INK}`,
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 72,
          top: 58,
          width: 42,
          height: 42,
          borderRadius: 999,
          background: ORANGE,
          border: `5px solid ${INK}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Drawn, not typed: Satori's default font has no star glyph and
            renders U+2605 as tofu. */}
        <Plus size={20} color={INK} />
      </div>
    </div>
  );
}

/** Event sponsorship: a ticket with a perforation down the middle. */
function TicketIcon() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: 126,
        height: 86,
        background: "#ffffff",
        border: `5px solid ${INK}`,
        borderRadius: 14,
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ width: 6, height: 6, borderRadius: 3, background: INK }} />
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        <div style={{ width: 42, height: 8, borderRadius: 4, background: INK }} />
        <div style={{ width: 30, height: 8, borderRadius: 4, background: "#C9C9D1" }} />
      </div>
    </div>
  );
}

/** Little "+1" score pop, the way a game rewards you for a tap. */
function Pop({
  label,
  bg,
  color,
  left,
  top,
  rotate,
}: {
  label: string;
  bg: string;
  color: string;
  left: number;
  top: number;
  rotate: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "6px 14px",
        background: bg,
        color,
        border: `4px solid ${INK}`,
        borderRadius: 999,
        fontSize: 24,
        fontWeight: 800,
        boxShadow: `4px 4px 0 ${INK}`,
        transform: `rotate(${rotate}deg)`,
      }}
    >
      {label}
    </div>
  );
}

/**
 * Confetti: a tilted, ink-outlined square. Started as a crossed-bar sparkle,
 * but at the size an iMessage bubble renders this it just read as a plus sign,
 * and divs cannot make the concave curves a real four-point star needs.
 */
function Confetti({ left, top, size, color }: { left: number; top: number; size: number; color: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: size,
        height: size,
        background: color,
        border: `4px solid ${INK}`,
        borderRadius: 5,
        transform: "rotate(45deg)",
        display: "flex",
      }}
    />
  );
}

/** Explicit plus, for the "recruit an ambassador" badge. */
function Plus({ size, color }: { size: number; color: string }) {
  return (
    <div style={{ position: "relative", display: "flex", width: size, height: size }}>
      <div style={{ position: "absolute", left: size * 0.36, top: 0, width: size * 0.28, height: size, borderRadius: size, background: color, display: "flex" }} />
      <div style={{ position: "absolute", left: 0, top: size * 0.36, width: size, height: size * 0.28, borderRadius: size, background: color, display: "flex" }} />
    </div>
  );
}

function Chip({ value, label }: { value: string; label: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 16px",
        borderRadius: 999,
        border: `3px solid ${BLUE}`,
        background: "rgba(47,91,255,0.14)",
      }}
    >
      <div style={{ color: LIME, fontSize: 26, fontWeight: 800 }}>{value}</div>
      <div style={{ color: "#D3D3DA", fontSize: 20, fontWeight: 600 }}>{label}</div>
    </div>
  );
}

export function renderShareCard() {
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: INK, fontFamily: "sans-serif" }}>
        {/* Left: who this is and the three numbers worth knowing. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 648,
            padding: "56px 48px 56px 64px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 24, height: 24, borderRadius: 999, background: BLUE, display: "flex" }} />
            <div style={{ color: "#ffffff", fontSize: 27, fontWeight: 700, letterSpacing: 0.5 }}>
              {siteConfig.companyName}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ color: "#ffffff", fontSize: 74, fontWeight: 800, lineHeight: 1.03 }}>Where brands</div>
            <div style={{ color: "#ffffff", fontSize: 74, fontWeight: 800, lineHeight: 1.03 }}>meet campus</div>
            <div style={{ color: LIME, fontSize: 74, fontWeight: 800, lineHeight: 1.03 }}>culture.</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ display: "flex", gap: 10 }}>
              <Chip value={getStat("ambassadors")} label="ambassadors" />
              <Chip value={getStat("campuses")} label="campuses" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ color: LIME, fontSize: 27, fontWeight: 700 }}>{siteConfig.companyDomain}</div>
            </div>
          </div>
        </div>

        {/* Right: the game board. */}
        <div style={{ display: "flex", position: "relative", width: 552, height: "100%", background: CREAM }}>
          {/* Faint rules, so the board reads as a surface rather than a flat fill. */}
          {[0, 1, 2, 3].map((i) => (
            <div
              key={`v${i}`}
              style={{
                position: "absolute",
                left: 110 + i * 120,
                top: 0,
                width: 2,
                height: 630,
                background: "rgba(11,11,15,0.07)",
                display: "flex",
              }}
            />
          ))}
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={`h${i}`}
              style={{
                position: "absolute",
                left: 0,
                top: 90 + i * 120,
                width: 552,
                height: 2,
                background: "rgba(11,11,15,0.07)",
                display: "flex",
              }}
            />
          ))}

          <Confetti left={276} top={48} size={26} color={MAGENTA} />
          <Confetti left={486} top={138} size={20} color={ORANGE} />
          <Confetti left={40} top={286} size={24} color={BLUE} />
          <Confetti left={474} top={500} size={18} color={MAGENTA} />

          <Tile bg={BLUE} rotate={-9} left={56} top={62}>
            <DropIcon />
          </Tile>
          <Tile bg={LIME} rotate={7} left={286} top={198}>
            <AmbassadorIcon />
          </Tile>
          <Tile bg={MAGENTA} rotate={-5} left={74} top={360}>
            <TicketIcon />
          </Tile>

          <Pop label="DROP" bg={LIME} color={INK} left={252} top={92} rotate={8} />
          <Pop label="+1" bg={ORANGE} color={INK} left={238} top={372} rotate={-10} />
          <Pop label="SOLD OUT" bg="#ffffff" color={INK} left={286} top={494} rotate={5} />
        </div>
      </div>
    ),
    { ...shareCardSize },
  );
}

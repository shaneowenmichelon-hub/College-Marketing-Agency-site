"use client";

import Image from "next/image";
import { sitePhotos, heroCollage } from "@/site.config";

/**
 * Scrolling image collage for the hero. Photo source priority:
 *   1. `photos` prop (real activation photos in /public/images/hero — see
 *      src/lib/hero-photos.ts), 2. `heroCollage` config, 3. `sitePhotos`.
 * Rendered with next/image so photos are auto-optimized (AVIF/WebP, resized,
 * lazy). Pauses on hover; static under reduced motion (shared `.marquee-track`).
 *
 * No photo is ever shown twice on screen at once. A marquee needs a second copy
 * of its tiles to loop seamlessly, so that copy must start beyond the right
 * edge: a row holds each photo exactly once, and the row only works as a loop
 * if one pass is wider than the hero — see MIN_PASS.
 *
 * Tiles are locked to the aspect ratio of the source photos (TILE_ASPECT) and
 * the files in /public/images/hero are cropped to match. That is deliberate:
 * the tile then has nothing left to crop, so the whole photo shows and the
 * browser only ever scales it down. Sizing width and height independently is
 * what broke this before — portrait photos in a 2.5:1 tile showed a quarter of
 * the frame, upscaled, which is what "smudged" looked like.
 */
type Photo = { src: string; alt: string };

/** Tile shape, and the shape every file in /public/images/hero is cropped to. */
const TILE_ASPECT = 3 / 2;

/**
 * Tile height.
 *
 * `compact` is the in-hero case and the hero has no spare room: every pixel the
 * strip grows is taken from the headline column above it, at roughly half a
 * pixel of squeeze per pixel of tile. On a 1366x768 or 1280x800 laptop that
 * column is already at its limit, so the strip must stay small there; on a
 * taller screen there is a visible band of dead space above the strip that it
 * should be using. Hence a floor, a per-pixel-of-viewport ramp, and a ceiling,
 * rather than one number or a plain `svh` (which would scale it up on short
 * screens too, which is exactly where there is nothing to give).
 */
const TILE_H = {
  compact: "clamp(80px, calc(80px + (100svh - 800px) * 0.34), 132px)",
  full: "min(132px, 15svh)",
} as const;
/** Nominal px height, for deriving an honest `sizes` and the loop maths. */
const TILE_H_MAX = { compact: 132, full: 132 } as const;
/** One pass of a row must span at least this much, in px, to push its repeat offscreen. */
const MIN_PASS = 1400;
/** Gap between tiles, in px. Matches the `gap-3` class below. */
const GAP = 12;

function Row({
  items,
  reverse = false,
  duration,
  height,
  maxH,
}: {
  items: Photo[];
  reverse?: boolean;
  duration: string;
  /** CSS length for the tile height. */
  height: string;
  /** Largest px height that CSS length can resolve to, for `sizes`. */
  maxH: number;
}) {
  // The second copy is what makes the -50% translate loop seamless. It is a
  // mechanical duplicate, so its tiles carry aria-hidden and are announced
  // once; the alt text stays on both (see seo-batch-3).
  const doubled = [...items, ...items];
  const maxTileW = Math.round(maxH * TILE_ASPECT);
  return (
    <div className="group relative overflow-hidden">
      <ul
        className="marquee-track flex w-max animate-marquee items-center gap-3 group-hover:[animation-play-state:paused]"
        style={{ animationDuration: duration, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {doubled.map((p, i) => {
          const first = i < items.length;
          return (
            <li
              key={`${p.src}-${i}`}
              aria-hidden={!first}
              // Height drives the tile; width follows from the aspect, so the
              // frame can never disagree with the photo inside it.
              style={{ height, aspectRatio: `${TILE_ASPECT}` }}
              className="relative shrink-0 overflow-hidden rounded-[4px] border-2 border-white/20"
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                // Honest width, doubled so a 2x screen still gets a variant at
                // least as wide as the tile's device pixels rather than an
                // upscale. next/image picks the smallest candidate that fits.
                sizes={`${maxTileW * 2}px`}
                loading="lazy"
                // Repeated tiles sit off the first screen. Keep every collage
                // photo from outranking the headline font on a slow phone.
                fetchPriority="low"
                // No object-position: the files are cropped 3:2 to match the
                // tile, so there is nothing left for the tile to shift.
                className="object-cover"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function HeroCollage({ photos, compact = false }: { photos?: Photo[]; compact?: boolean }) {
  const source: Photo[] =
    photos && photos.length ? photos : heroCollage.length ? heroCollage : sitePhotos;

  if (source.length === 0) return null;

  const height = compact ? TILE_H.compact : TILE_H.full;
  const maxH = compact ? TILE_H_MAX.compact : TILE_H_MAX.full;
  // Loop maths uses the SMALLEST the tile can be, so one pass still overruns
  // the viewport at the bottom of the clamp as well as the top.
  const perTile = Math.round(80 * TILE_ASPECT) + GAP;
  /** Photos needed before one pass is wide enough to hide its own repeat. */
  const minForRow = Math.ceil(MIN_PASS / perTile);

  // Inside the hero the height is fixed, so a second row would have to come out
  // of the headline. One row there, however many photos; split only when the
  // collage is standing on its own and there are enough photos for both rows to
  // still loop cleanly.
  const twoRows = !compact && source.length >= minForRow * 2;

  if (!twoRows) {
    return (
      <div role="region" aria-label="Recent campus events and activations">
        <Row items={source} duration="54s" height={height} maxH={maxH} />
      </div>
    );
  }

  const half = Math.ceil(source.length / 2);
  return (
    <div className="space-y-3" role="region" aria-label="Recent campus events and activations">
      <Row items={source.slice(0, half)} duration="50s" height={height} maxH={maxH} />
      <Row items={source.slice(half)} reverse duration="58s" height={height} maxH={maxH} />
    </div>
  );
}

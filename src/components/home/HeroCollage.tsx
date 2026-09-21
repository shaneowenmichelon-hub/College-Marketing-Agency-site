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
 * edge: a row holds each photo exactly once, and tiles are sized up when there
 * are few photos so one pass is still wider than the hero. Two opposing rows
 * only appear once there are enough photos to fill both.
 */
type Photo = { src: string; alt: string };

/** Photos needed before the collage splits into two opposing rows. */
const TWO_ROW_MIN = 8;
/** One pass of a row must span at least this much, in px, to push its repeat offscreen. */
const ROW_SPAN = 1320;

function Row({
  items,
  reverse = false,
  duration,
  tileW,
  tileH,
}: {
  items: Photo[];
  reverse?: boolean;
  duration: string;
  tileW: number;
  tileH: number;
}) {
  // The second copy is what makes the -50% translate loop seamless; it is a
  // mechanical duplicate, so each photo is described to screen readers once.
  const doubled = [...items, ...items];
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
              // Capped in vw so big tiles stay phone-sized on a narrow screen.
              style={{ width: `min(${tileW}px, 52vw)`, height: `min(${tileH}px, 32vw)` }}
              className="relative shrink-0 overflow-hidden rounded-[4px] border-2 border-white/20"
            >
              <Image
                src={p.src}
                alt={first ? p.alt : ""}
                fill
                sizes={`${tileW}px`}
                className="object-cover object-[50%_32%]"
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Tile width that makes `count` photos span the hero, within sane bounds. */
function tileWidth(count: number): number {
  return Math.min(320, Math.max(160, Math.ceil(ROW_SPAN / count)));
}

export function HeroCollage({ photos }: { photos?: Photo[] }) {
  const source: Photo[] =
    photos && photos.length ? photos : heroCollage.length ? heroCollage : sitePhotos;

  if (source.length === 0) return null;

  if (source.length < TWO_ROW_MIN) {
    const w = tileWidth(source.length);
    return (
      <div role="region" aria-label="Recent campus events and activations">
        <Row items={source} duration="46s" tileW={w} tileH={Math.round(w * 0.58)} />
      </div>
    );
  }

  const half = Math.ceil(source.length / 2);
  const rowA = source.slice(0, half).slice(0, 8);
  const rowB = source.slice(half).slice(0, 8);

  return (
    <div className="space-y-3" role="region" aria-label="Recent campus events and activations">
      <Row items={rowA} duration="42s" tileW={160} tileH={96} />
      <Row items={rowB} reverse duration="50s" tileW={160} tileH={96} />
    </div>
  );
}

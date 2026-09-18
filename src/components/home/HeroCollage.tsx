"use client";

import { sitePhotos, heroCollage } from "@/site.config";

/**
 * Scrolling image collage for the hero. Two rows drifting in opposite directions
 * so 10-15 photos are on screen at once. Uses `heroCollage` from site.config when
 * populated (real ZMM/event photos in /public/images/hero), else falls back to
 * the stock `sitePhotos`. Pauses on hover; static under reduced motion (via the
 * shared `.marquee-track` rule).
 */

const PHOTOS = heroCollage.length ? heroCollage : sitePhotos;
const HALF = Math.ceil(PHOTOS.length / 2);
const ROW_A = PHOTOS.slice(0, HALF).slice(0, 8);
const ROW_B = PHOTOS.slice(HALF).slice(0, 8);

function Row({
  items,
  reverse = false,
  duration,
}: {
  items: typeof sitePhotos;
  reverse?: boolean;
  duration: string;
}) {
  const doubled = [...items, ...items];
  return (
    <div className="group relative overflow-hidden">
      <ul
        className="marquee-track flex w-max animate-marquee items-center gap-3 group-hover:[animation-play-state:paused]"
        style={{ animationDuration: duration, animationDirection: reverse ? "reverse" : "normal" }}
      >
        {doubled.map((p, i) => (
          <li key={`${p.seed}-${i}`} aria-hidden={i >= items.length} className="shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={p.src}
              alt={i < items.length ? p.alt : ""}
              loading="lazy"
              className="h-20 w-32 rounded-[4px] border-2 border-white/20 object-cover sm:h-24 sm:w-40"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HeroCollage() {
  return (
    <div className="space-y-3" role="region" aria-label="Recent campus events and activations">
      <Row items={ROW_A} duration="42s" />
      <Row items={ROW_B} reverse duration="50s" />
    </div>
  );
}

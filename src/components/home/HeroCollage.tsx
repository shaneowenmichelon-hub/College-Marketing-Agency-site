"use client";

import { sitePhotos } from "@/site.config";

/**
 * Scrolling image collage for the hero. Two rows drifting in opposite directions
 * so 10-15 photos are on screen at once. Pulls from `sitePhotos` in site.config,
 * so swapping in real ZMM/event photos there updates this automatically. Pauses
 * on hover; static under reduced motion (via the shared `.marquee-track` rule).
 */

const ROW_A = sitePhotos.slice(0, 8);
const ROW_B = sitePhotos.slice(8, 16);

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

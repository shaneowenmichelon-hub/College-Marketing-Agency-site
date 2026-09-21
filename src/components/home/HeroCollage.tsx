"use client";

import Image from "next/image";
import { sitePhotos, heroCollage } from "@/site.config";

/**
 * Scrolling image collage for the hero. Two rows drifting in opposite directions
 * so 10-15 photos are on screen at once. Photo source priority:
 *   1. `photos` prop (real activation photos in /public/images/hero — see
 *      src/lib/hero-photos.ts), 2. `heroCollage` config, 3. stock `sitePhotos`.
 * Rendered with next/image so photos are auto-optimized (AVIF/WebP, resized,
 * lazy). Pauses on hover; static under reduced motion (shared `.marquee-track`).
 */
type Photo = { src: string; alt: string };

function Row({
  items,
  reverse = false,
  duration,
}: {
  items: Photo[];
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
          <li
            key={`${p.src}-${i}`}
            aria-hidden={i >= items.length}
            className="relative h-20 w-32 shrink-0 overflow-hidden rounded-[4px] border-2 border-white/20 sm:h-24 sm:w-40"
          >
            <Image
              src={p.src}
              alt={i < items.length ? p.alt : ""}
              fill
              sizes="160px"
              className="object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export function HeroCollage({ photos }: { photos?: Photo[] }) {
  const source: Photo[] =
    photos && photos.length ? photos : heroCollage.length ? heroCollage : sitePhotos;
  const half = Math.ceil(source.length / 2);
  const rowA = source.slice(0, half).slice(0, 8);
  const rowB = source.slice(half).slice(0, 8);

  return (
    <div className="space-y-3" role="region" aria-label="Recent campus events and activations">
      <Row items={rowA} duration="42s" />
      <Row items={rowB.length ? rowB : rowA} reverse duration="50s" />
    </div>
  );
}

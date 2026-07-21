"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { sitePhotos, photoFallback } from "@/site.config";

const gradients = [
  "from-[#5A4BFF] to-[#8B7BFF]",
  "from-[#0B0B0F] to-[#3a3a4a]",
  "from-[#5A4BFF] via-[#7c6bff] to-[#D4FF4F]",
  "from-[#1a1a24] to-[#5A4BFF]",
];

/**
 * A real photo with staged fallback:
 *   1. topical online photo (Unsplash)  →  2. guaranteed real photo (Picsum, seeded)
 *   →  3. brand gradient (only if the network is unreachable entirely)
 * `index` picks from the curated `sitePhotos` set; pass `src` to override.
 */
export function EventImage({
  index = 0,
  src: srcOverride,
  label,
  className,
  aspect = "aspect-[4/3]",
  priority = false,
}: {
  index?: number;
  src?: string;
  label?: string;
  className?: string;
  aspect?: string;
  priority?: boolean;
}) {
  const photo = sitePhotos[index % sitePhotos.length];
  const primary = srcOverride ?? photo.src;
  const [stage, setStage] = useState<0 | 1 | 2>(0);

  const src = stage === 0 ? primary : photoFallback(photo.seed);
  const failed = stage === 2;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl", aspect, className)}>
      {failed ? (
        <div
          className={cn(
            "flex h-full w-full items-center justify-center bg-gradient-to-br text-white/80",
            gradients[index % gradients.length],
          )}
        >
          <div aria-hidden className="grain absolute inset-0" />
          {label && (
            <span className="relative z-10 rounded-full bg-black/25 px-3 py-1 text-xs font-medium backdrop-blur-sm">
              {label}
            </span>
          )}
        </div>
      ) : (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={label || photo.alt}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover"
            onError={() => setStage((s) => (s < 2 ? ((s + 1) as 0 | 1 | 2) : s))}
          />
          {label && (
            <span className="absolute bottom-3 left-3 z-10 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {label}
            </span>
          )}
        </>
      )}
    </div>
  );
}

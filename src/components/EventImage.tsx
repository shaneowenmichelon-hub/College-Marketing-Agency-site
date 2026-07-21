"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { eventPhotos, eventPhotoRemote } from "@/site.config";

const gradients = [
  "from-[#5A4BFF] to-[#8B7BFF]",
  "from-[#0B0B0F] to-[#3a3a4a]",
  "from-[#5A4BFF] via-[#7c6bff] to-[#D4FF4F]",
  "from-[#1a1a24] to-[#5A4BFF]",
];

/**
 * Real ZMM event photo with staged fallback:
 *   1. self-hosted /images/events/<file>  →  2. live remote  →  3. gradient block
 * `index` selects a photo from the curated set (and the fallback gradient), so
 * callers can just pass an index like the old PlaceholderImage did.
 */
export function EventImage({
  index = 0,
  file,
  label,
  className,
  aspect = "aspect-[4/3]",
  priority = false,
}: {
  index?: number;
  file?: string;
  label?: string;
  className?: string;
  aspect?: string;
  priority?: boolean;
}) {
  const chosen = file ?? eventPhotos[index % eventPhotos.length];
  const [src, setSrc] = useState(`/images/events/${chosen}`);
  const [failed, setFailed] = useState(false);

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
            alt={label || "Event photo"}
            loading={priority ? "eager" : "lazy"}
            className="h-full w-full object-cover"
            onError={() => {
              const remote = eventPhotoRemote(chosen);
              if (src !== remote) setSrc(remote);
              else setFailed(true);
            }}
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

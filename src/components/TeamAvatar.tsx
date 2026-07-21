"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

/** Circular headshot; falls back to a clean initials avatar if no photo loads. */
export function TeamAvatar({
  name,
  photo,
  className,
}: {
  name: string;
  photo?: string;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const base = cn("h-24 w-24 overflow-hidden rounded-full", className);

  if (!photo || failed) {
    return (
      <div
        className={cn(
          base,
          "flex items-center justify-center bg-accent/10 font-display text-2xl font-bold text-accent",
        )}
        aria-label={name}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className={base}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={photo}
        alt={name}
        loading="lazy"
        className="h-full w-full object-cover"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

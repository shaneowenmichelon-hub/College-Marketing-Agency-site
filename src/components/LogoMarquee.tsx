"use client";

import { cn } from "@/lib/utils";

/**
 * Horizontally scrolling strip. Used two ways:
 *  - client-logo placeholder slots (labeled "Client logo")
 *  - campus/city names
 * Duplicates the content once so the CSS marquee loops seamlessly.
 * Animation is paused under prefers-reduced-motion (see globals.css).
 */
export function LogoMarquee({
  items,
  variant = "logo",
  onDark = false,
}: {
  items: string[];
  variant?: "logo" | "text";
  onDark?: boolean;
}) {
  const doubled = [...items, ...items];

  return (
    <div
      className="group relative overflow-hidden"
      aria-label="Scrolling list"
      role="region"
    >
      {/* edge fades */}
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r",
          onDark ? "from-ink to-transparent" : "from-surface to-transparent",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l",
          onDark ? "from-ink to-transparent" : "from-surface to-transparent",
        )}
      />

      <ul className="marquee-track flex w-max animate-marquee items-center gap-4 group-hover:[animation-play-state:paused]">
        {doubled.map((item, i) => (
          <li key={`${item}-${i}`} aria-hidden={i >= items.length}>
            {variant === "logo" ? (
              <div
                className={cn(
                  "flex h-14 w-40 items-center justify-center rounded-xl border text-xs font-medium tracking-wide",
                  onDark
                    ? "border-[color:var(--border-on-dark)] bg-white/[0.03] text-[color:var(--muted-on-dark)]"
                    : "border-[color:var(--border-on-light)] bg-surface-muted text-[color:var(--muted-on-light)]",
                )}
              >
                {item}
              </div>
            ) : (
              <div
                className={cn(
                  "flex h-10 items-center whitespace-nowrap rounded-full border px-4 text-sm font-medium",
                  onDark
                    ? "border-[color:var(--border-on-dark)] text-white"
                    : "border-[color:var(--border-on-light)] text-ink",
                )}
              >
                {item}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

import { cn } from "@/lib/utils";
import { EventImage } from "@/components/EventImage";
import { sitePhotos } from "@/site.config";

/**
 * Revolving carousel of real event/campus photos (online-sourced). Reuses the
 * same marquee animation as the logo strip; pauses on hover, static under
 * reduced motion (see globals.css). Each tile has the EventImage fallback chain.
 */
export function PhotoMarquee({ onDark = false }: { onDark?: boolean }) {
  const doubled = [...sitePhotos, ...sitePhotos];
  return (
    <div className="group relative overflow-hidden" role="region" aria-label="Event photos">
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r sm:w-24",
          onDark ? "from-ink to-transparent" : "from-surface to-transparent",
        )}
      />
      <div
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l sm:w-24",
          onDark ? "from-ink to-transparent" : "from-surface to-transparent",
        )}
      />
      <ul className="marquee-track flex w-max animate-marquee items-center gap-4 group-hover:[animation-play-state:paused]">
        {doubled.map((photo, i) => (
          <li key={`${photo.seed}-${i}`} aria-hidden={i >= sitePhotos.length} className="shrink-0">
            <EventImage
              index={i % sitePhotos.length}
              aspect="aspect-[16/10]"
              className="w-56 sm:w-64"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

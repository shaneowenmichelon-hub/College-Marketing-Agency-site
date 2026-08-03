import { Quote } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * All placeholders are intentionally labeled so the site reads as a template
 * ready to be filled - never as fabricated proof.
 */

const gradients = [
  "from-[#5A4BFF] to-[#8B7BFF]",
  "from-[#0B0B0F] to-[#3a3a4a]",
  "from-[#5A4BFF] via-[#7c6bff] to-[#D4FF4F]",
  "from-[#1a1a24] to-[#5A4BFF]",
];

/** A tasteful gradient block standing in for photography. Swap with real images. */
export function PlaceholderImage({
  label = "Image placeholder",
  className,
  index = 0,
  aspect = "aspect-[4/3]",
}: {
  label?: string;
  className?: string;
  index?: number;
  aspect?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br text-white/80",
        gradients[index % gradients.length],
        aspect,
        className,
      )}
    >
      <div aria-hidden className="grain absolute inset-0" />
      <span className="relative z-10 rounded-full bg-black/25 px-3 py-1 text-xs font-medium backdrop-blur-sm">
        {label}
      </span>
    </div>
  );
}

/** A single "Client logo" slot for placeholder logo grids. */
export function LogoSlot({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-16 items-center justify-center rounded-xl border border-dashed border-[color:var(--border-on-light)] bg-surface-muted/60 text-xs font-medium text-[color:var(--muted-on-light)]",
        className,
      )}
    >
      Client logo
    </div>
  );
}

/** A labeled placeholder testimonial. Never contains a fabricated quote. */
export function TestimonialCard({ index = 0 }: { index?: number }) {
  return (
    <figure className="flex h-full flex-col rounded-2xl border border-dashed border-[color:var(--border-on-light)] bg-surface p-6">
      <Quote className="h-7 w-7 text-accent/40" aria-hidden />
      <blockquote className="mt-4 flex-1 text-sm italic leading-relaxed text-[color:var(--muted-on-light)]">
        Testimonial {index + 1} - to be added. Drop a real client quote here once
        you have sign-off.
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="h-9 w-9 rounded-full bg-surface-muted" aria-hidden />
        <span className="text-xs text-[color:var(--muted-on-light)]">
          Name, Title - Company
        </span>
      </figcaption>
    </figure>
  );
}

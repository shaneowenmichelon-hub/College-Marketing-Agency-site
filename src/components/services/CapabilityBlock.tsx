import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CapabilityBlock as CapabilityBlockData } from "@/site.config";

/**
 * An alternating image/content capability block. Stacks image-first on mobile;
 * `imageSide` sets which side the image sits on at lg and up.
 */
export function CapabilityBlock({
  block,
  imageSide,
}: {
  block: CapabilityBlockData;
  imageSide: "left" | "right";
}) {
  const imageRight = imageSide === "right";
  return (
    <div className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Image (first in DOM → image-first on mobile) */}
      <div className={cn(imageRight ? "lg:order-2" : "lg:order-1")}>
        {block.image ? (
          <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] border-2 border-ink shadow-[6px_6px_0_var(--ink)]">
            <Image
              src={block.image}
              alt={block.imageAlt ?? block.heading}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-[4px] border-2 border-dashed border-ink bg-gradient-to-br from-[#2F5BFF] to-[#0B0B0F] shadow-[6px_6px_0_var(--ink)]">
            <div aria-hidden className="grain absolute inset-0" />
            <span className="relative z-10 rounded-full bg-black/25 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur-sm">
              Image slot — {block.heading}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn(imageRight ? "lg:order-1" : "lg:order-2")}>
        <p className="mono-label flex items-center gap-2 text-xs font-bold text-accent">
          <span aria-hidden className="inline-block h-2.5 w-2.5 bg-current" />
          {block.eyebrow}
        </p>
        <h3 className="mt-3 font-display text-display-sm font-bold text-ink">{block.heading}</h3>

        <div className="mt-5 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {block.columns.map((col, ci) => (
            <ul key={ci} className="space-y-2">
              {col.map((bullet) => (
                <li key={bullet} className="flex gap-2 text-sm leading-relaxed text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ))}
        </div>

        {block.priceNote && (
          <p className="mono-label mt-5 inline-block rounded-[3px] border-2 border-ink bg-[color:var(--accent-2)] px-3 py-1.5 text-[11px] font-bold text-ink shadow-[3px_3px_0_var(--ink)]">
            {block.priceNote}
          </p>
        )}

        {block.cta && (
          <div className="mt-6">
            <Link
              href={block.cta.href}
              className="mono-label inline-flex items-center gap-1.5 text-[12px] font-bold text-accent hover:underline"
            >
              {block.cta.label} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

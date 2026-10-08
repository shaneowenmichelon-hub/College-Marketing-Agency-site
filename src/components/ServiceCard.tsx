import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion/Reveal";

/**
 * A service card on the homepage.
 *
 * Each of the three services owns a colour, and it is the SAME colour the
 * service carries in the campus-attention section further down. Those two
 * sections list the same three things; styling them differently made the page
 * read as two unrelated blocks, and a grid of grey cards gave the eye nothing
 * to land on after the hero.
 *
 * Colours come from the existing brutalist palette rather than new ones, so
 * the page gains contrast without gaining a second design language.
 */
const TONES = [
  { bg: "bg-[color:var(--accent)]", text: "text-white", chip: "bg-white/15 text-white", onLight: false },
  { bg: "bg-[color:var(--accent-2)]", text: "text-ink", chip: "bg-ink/10 text-ink", onLight: true },
  { bg: "bg-[color:var(--magenta)]", text: "text-white", chip: "bg-white/15 text-white", onLight: false },
] as const;

export function ServiceCard({
  icon: Icon,
  title,
  blurb,
  href,
  price,
  index = 0,
}: {
  icon: LucideIcon;
  title: string;
  blurb: string;
  href: string;
  price?: string;
  index?: number;
}) {
  const tone = TONES[index % TONES.length];

  return (
    <Reveal delay={index * 0.08} className="h-full">
      <Link
        href={href}
        className={cn(
          "group flex h-full flex-col rounded-[4px] border-2 border-ink p-7 shadow-[6px_6px_0_var(--ink)] transition-all duration-200",
          "hover:-translate-y-1 hover:shadow-[10px_10px_0_var(--ink)]",
          tone.bg,
          tone.text,
        )}
      >
        <span
          className={cn(
            "inline-flex h-12 w-12 items-center justify-center rounded-[3px] border-2 border-ink bg-white text-ink transition-transform group-hover:-rotate-6",
          )}
        >
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="mt-5 font-display text-xl font-bold">{title}</h3>
        <p className={cn("mt-2 flex-1 text-sm leading-relaxed", tone.onLight ? "opacity-80" : "opacity-90")}>
          {blurb}
        </p>
        {price && (
          <p className={cn("mt-4 w-fit rounded-[3px] px-2 py-1 text-sm font-bold", tone.chip)}>{price}</p>
        )}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold underline decoration-2 underline-offset-4">
          Learn more
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </Link>
    </Reveal>
  );
}

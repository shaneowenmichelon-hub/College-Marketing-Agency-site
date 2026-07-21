import Link from "next/link";
import { ArrowRight, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion/Reveal";

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
  return (
    <Reveal delay={index * 0.08} className="h-full">
      <Link
        href={href}
        className={cn(
          "group flex h-full flex-col rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-7 shadow-soft transition-all duration-200",
          "hover:-translate-y-1 hover:border-accent/30 hover:shadow-soft-lg",
        )}
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-white">
          <Icon className="h-6 w-6" aria-hidden />
        </span>
        <h3 className="mt-5 font-display text-xl font-bold text-ink">{title}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[color:var(--muted-on-light)]">
          {blurb}
        </p>
        {price && (
          <p className="mt-4 text-sm font-semibold text-ink">
            {price}
          </p>
        )}
        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent">
          Learn more
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
        </span>
      </Link>
    </Reveal>
  );
}

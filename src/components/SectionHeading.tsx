import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion/Reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  onDark = false,
  className,
  as: HeadingTag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
  /** Heading level for the title. Use "h1" when this is the page's primary heading. */
  as?: "h1" | "h2";
}) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "mono-label mb-4 flex items-center gap-2 text-xs font-bold",
            onDark ? "text-[color:var(--accent-2)]" : "text-accent",
          )}
        >
          <span aria-hidden className="inline-block h-2.5 w-2.5 bg-current" />
          {eyebrow}
        </p>
      )}
      <HeadingTag
        className={cn(
          "text-balance font-display text-display-sm font-bold",
          onDark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </HeadingTag>
      {intro && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed sm:text-lg",
            onDark
              ? "text-[color:var(--muted-on-dark)]"
              : "text-[color:var(--muted-on-light)]",
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./motion/Reveal";
import { Badge } from "./ui/Badge";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  onDark = false,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  onDark?: boolean;
  className?: string;
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
        <Badge variant={onDark ? "outline-dark" : "default"} className="mb-4">
          {eyebrow}
        </Badge>
      )}
      <h2
        className={cn(
          "text-balance font-display text-3xl font-bold leading-[1.05] sm:text-4xl lg:text-5xl",
          onDark ? "text-white" : "text-ink",
        )}
      >
        {title}
      </h2>
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

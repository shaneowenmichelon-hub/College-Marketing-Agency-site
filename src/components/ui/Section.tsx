import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";

type Tone = "light" | "muted" | "dark";

const toneClasses: Record<Tone, string> = {
  light: "bg-surface text-[color:var(--text-on-light)]",
  muted: "bg-surface-muted text-[color:var(--text-on-light)]",
  dark: "bg-ink text-[color:var(--text-on-dark)]",
};

/**
 * A full-bleed band with an inner Container. Alternate tones for rhythm.
 * `mesh` + `grain` decorate dark bands (see globals.css).
 */
export function Section({
  children,
  tone = "light",
  className,
  containerClassName,
  mesh = false,
  grain = false,
  id,
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  containerClassName?: string;
  mesh?: boolean;
  grain?: boolean;
  id?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative overflow-hidden py-16 sm:py-20 lg:py-28",
        toneClasses[tone],
        grain && "grain",
        className,
      )}
    >
      {mesh && <div aria-hidden className="mesh pointer-events-none absolute inset-0" />}
      <Container className={cn("relative", containerClassName)}>{children}</Container>
    </section>
  );
}

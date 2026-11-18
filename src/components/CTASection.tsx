import type { ReactNode } from "react";
import { Section } from "./ui/Section";
import { Button } from "./ui/Button";
import { Reveal } from "./motion/Reveal";

type CTAButton = { label: string; href: string; variant?: "primary" | "lime" | "ghost-dark" };

export function CTASection({
  eyebrow,
  title,
  intro,
  primary,
  secondary,
  note,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: string;
  primary: CTAButton;
  secondary?: CTAButton;
  /** Small muted line under the buttons. Same sentence already used on the inquiry path. */
  note?: string;
}) {
  return (
    <Section tone="dark" mesh grain containerClassName="text-center">
      <Reveal className="mx-auto max-w-3xl">
        {eyebrow && (
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-[color:var(--accent-2)]">
            {eyebrow}
          </p>
        )}
        <h2 className="text-balance font-display text-3xl font-bold leading-[1.05] text-white sm:text-5xl lg:text-6xl">
          {title}
        </h2>
        {intro && (
          <p className="mx-auto mt-5 max-w-2xl text-base text-[color:var(--muted-on-dark)] sm:text-lg">
            {intro}
          </p>
        )}
        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap">
          <Button
            href={primary.href}
            variant={primary.variant ?? "primary"}
            size="lg"
            className="!h-auto max-w-full whitespace-normal text-balance text-center leading-snug"
          >
            {primary.label}
          </Button>
          {secondary && (
            <Button
              href={secondary.href}
              variant={secondary.variant ?? "ghost-dark"}
              size="lg"
              className="!h-auto max-w-full whitespace-normal text-balance text-center leading-snug"
            >
              {secondary.label}
            </Button>
          )}
        </div>
        {note ? (
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[color:var(--muted-on-dark)]">
            {note}
          </p>
        ) : null}
      </Reveal>
    </Section>
  );
}

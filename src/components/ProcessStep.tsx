import { cn } from "@/lib/utils";
import { Reveal } from "./motion/Reveal";

export function ProcessStep({
  step,
  title,
  body,
  onDark = false,
  index = 0,
}: {
  step: number;
  title: string;
  body: string;
  onDark?: boolean;
  index?: number;
}) {
  return (
    <Reveal delay={index * 0.08} className="h-full">
      <div
        className={cn(
          "flex h-full flex-col rounded-2xl border p-6",
          onDark
            ? "border-[color:var(--border-on-dark)] bg-white/[0.04]"
            : "border-[color:var(--border-on-light)] bg-surface shadow-soft",
        )}
      >
        <span className="font-display text-sm font-bold text-accent">
          {String(step).padStart(2, "0")}
        </span>
        <h3
          className={cn(
            "mt-3 font-display text-lg font-bold",
            onDark ? "text-white" : "text-ink",
          )}
        >
          {title}
        </h3>
        <p
          className={cn(
            "mt-2 text-sm leading-relaxed",
            onDark
              ? "text-[color:var(--muted-on-dark)]"
              : "text-[color:var(--muted-on-light)]",
          )}
        >
          {body}
        </p>
      </div>
    </Reveal>
  );
}

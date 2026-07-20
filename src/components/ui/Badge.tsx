import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "lime" | "outline" | "outline-dark";

const variants: Record<Variant, string> = {
  default: "bg-accent/10 text-accent border border-accent/20",
  lime: "bg-[color:var(--accent-2)] text-ink border border-transparent",
  outline: "border border-[color:var(--border-on-light)] text-[color:var(--muted-on-light)]",
  "outline-dark": "border border-[color:var(--border-on-dark)] text-[color:var(--muted-on-dark)]",
};

export function Badge({
  children,
  variant = "default",
  className,
}: {
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium tracking-wide",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

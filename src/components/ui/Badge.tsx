import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "lime" | "outline" | "outline-dark";

const variants: Record<Variant, string> = {
  default: "bg-[color:var(--accent-2)] text-ink border-2 border-ink",
  lime: "bg-[color:var(--accent-2)] text-ink border-2 border-ink",
  outline: "border-2 border-ink bg-white text-ink",
  "outline-dark": "border-2 border-white bg-transparent text-white",
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
        "mono-label inline-flex items-center gap-1.5 rounded-[3px] px-3 py-1 text-[11px] font-bold",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

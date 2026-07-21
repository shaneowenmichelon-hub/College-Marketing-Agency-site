import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "light" | "dark";

export function Card({
  children,
  className,
  tone = "light",
  interactive = false,
}: {
  children: ReactNode;
  className?: string;
  tone?: Tone;
  interactive?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-[3px] border-2 p-6 transition-all duration-150",
        tone === "light"
          ? "border-ink bg-surface shadow-[6px_6px_0_var(--ink)]"
          : "border-white bg-white/[0.04] shadow-[6px_6px_0_var(--accent)]",
        interactive && "hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_var(--ink)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

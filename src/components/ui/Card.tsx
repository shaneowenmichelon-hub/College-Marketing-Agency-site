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
        "rounded-2xl border p-6 transition-all duration-200",
        tone === "light"
          ? "border-[color:var(--border-on-light)] bg-surface shadow-soft"
          : "border-[color:var(--border-on-dark)] bg-white/[0.04]",
        interactive && "hover:-translate-y-1 hover:shadow-soft-lg",
        className,
      )}
    >
      {children}
    </div>
  );
}

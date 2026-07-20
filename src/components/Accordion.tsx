"use client";

import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export type FAQItem = { q: string; a: string };

export function Accordion({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[color:var(--border-on-light)] rounded-2xl border border-[color:var(--border-on-light)] bg-surface">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q}>
            <button
              type="button"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
            >
              <span className="font-display text-base font-semibold text-ink sm:text-lg">
                {item.q}
              </span>
              <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-muted text-ink">
                {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              </span>
            </button>
            <div
              className={cn(
                "grid overflow-hidden transition-all duration-300",
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
              )}
            >
              <div className="min-h-0">
                <p className="px-5 pb-5 text-sm leading-relaxed text-[color:var(--muted-on-light)]">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

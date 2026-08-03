"use client";

import { useEffect, useRef } from "react";
import { GraduationCap, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { pop } from "@/lib/confetti";

export type Badge = { key: string; label: string; earned: boolean };

/** The gamification sidebar: XP meter, achievement badges, and a live player card.
 *  Purely presentational - it reflects form state, never blocks or alters it. */
export function AmbassadorQuestPanel({
  percent,
  level,
  badges,
  card,
}: {
  percent: number;
  level: number;
  badges: Badge[];
  card: { name: string; school: string; niche: string; ig: string; tt: string; eduVerified: boolean };
}) {
  // Pop confetti when a badge newly unlocks.
  const prev = useRef<Set<string>>(new Set());
  useEffect(() => {
    const now = new Set(badges.filter((b) => b.earned).map((b) => b.key));
    for (const b of badges) {
      if (b.earned && !prev.current.has(b.key)) pop(0.85, 0.5);
    }
    prev.current = now;
  }, [badges]);

  return (
    <div className="space-y-5 lg:sticky lg:top-24">
      {/* XP meter */}
      <div className="rounded-[3px] border-2 border-ink bg-white p-4 shadow-[6px_6px_0_var(--ink)]">
        <div className="flex items-center justify-between">
          <span className="mono-label text-[11px] font-bold text-ink">Level {level}</span>
          <span className="mono-label text-[11px] font-bold text-accent">{Math.round(percent)}%</span>
        </div>
        <div className="mt-2 h-4 w-full overflow-hidden rounded-[2px] border-2 border-ink bg-surface-muted">
          <div
            className="h-full bg-[color:var(--accent-2)] transition-[width] duration-500 ease-out"
            style={{ width: `${Math.max(6, Math.min(100, percent))}%` }}
            role="progressbar"
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Application progress"
          />
        </div>
        <p className="mono-label mt-2 text-[10px] text-[color:var(--muted-on-light)]">
          Level up to Ambassador
        </p>
      </div>

      {/* Achievements */}
      <div className="grid grid-cols-2 gap-2">
        {badges.map((b) => {
          const Icon = iconFor(b.key);
          return (
            <div
              key={b.key}
              className={cn(
                "flex items-center gap-2 rounded-[3px] border-2 p-2.5 transition-all",
                b.earned
                  ? "border-ink bg-[color:var(--accent-2)] text-ink shadow-[3px_3px_0_var(--ink)]"
                  : "border-dashed border-[color:var(--muted-on-light)]/40 bg-white text-[color:var(--muted-on-light)]/60",
              )}
            >
              {b.earned ? (
                <Icon className="h-4 w-4 shrink-0" aria-hidden />
              ) : (
                <Lock className="h-4 w-4 shrink-0" aria-hidden />
              )}
              <span className="mono-label text-[10px] font-bold leading-tight">{b.label}</span>
            </div>
          );
        })}
      </div>

      {/* Live Ambassador Card */}
      <AmbassadorCard card={card} level={level} />
    </div>
  );
}

function iconFor(key: string) {
  switch (key) {
    case "edu": return GraduationCap;
    case "age21": return Sparkles;
    case "socials": return Zap;
    case "trust": return ShieldCheck;
    default: return Sparkles;
  }
}

export function AmbassadorCard({
  card,
  level,
  flipped = false,
}: {
  card: { name: string; school: string; niche: string; ig: string; tt: string; eduVerified: boolean };
  level: number;
  flipped?: boolean;
}) {
  const initials =
    card.name
      .split(" ")
      .map((w) => w[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase() || "??";

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[4px] border-2 border-ink bg-ink text-white shadow-[6px_6px_0_var(--accent)] transition-transform duration-500",
        flipped && "animate-[fade-up_0.6s_ease-out]",
      )}
    >
      <div aria-hidden className="grain absolute inset-0 opacity-60" />
      {/* header */}
      <div className="relative flex items-center justify-between border-b-2 border-white/80 bg-[color:var(--accent)] px-4 py-2">
        <span className="mono-label text-[10px] font-bold text-white">Ambassador Card</span>
        <span className="mono-label text-[10px] font-bold text-white">LV {level}</span>
      </div>
      <div className="relative p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[3px] border-2 border-white bg-[color:var(--magenta)] font-display text-xl font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-lg font-bold leading-tight">
              {card.name || "Your name"}
            </p>
            <p className="mono-label truncate text-[10px] text-[color:var(--accent-2)]">
              {card.school || "your school"}
            </p>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {card.niche && (
            <span className="mono-label rounded-[2px] border border-white/70 px-2 py-0.5 text-[9px]">
              {card.niche}
            </span>
          )}
          {card.eduVerified && (
            <span className="mono-label rounded-[2px] bg-[color:var(--accent-2)] px-2 py-0.5 text-[9px] text-ink">
              🎓 .edu
            </span>
          )}
        </div>

        <div className="mono-label mt-4 grid grid-cols-2 gap-2 border-t-2 border-white/20 pt-3 text-[10px] text-[color:var(--muted-on-dark)]">
          <span className="truncate">IG {card.ig ? `@${card.ig.replace(/^@/, "")}` : "-"}</span>
          <span className="truncate text-right">TT {card.tt ? `@${card.tt.replace(/^@/, "")}` : "-"}</span>
        </div>
      </div>
    </div>
  );
}

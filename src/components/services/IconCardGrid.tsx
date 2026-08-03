import {
  Briefcase,
  CalendarClock,
  DollarSign,
  Gift,
  Music,
  ShieldCheck,
  Sparkles,
  Video,
  Zap,
  type LucideIcon,
} from "lucide-react";
import type { PerkCard } from "@/site.config";

// Icon names referenced from site.config map to lucide components here.
const ICONS: Record<string, LucideIcon> = {
  DollarSign,
  Gift,
  CalendarClock,
  Briefcase,
  ShieldCheck,
  Zap,
  Music,
  Video,
};

function IconCard({ card }: { card: PerkCard }) {
  const Icon = ICONS[card.icon] ?? Sparkles;
  return (
    <div className="flex h-full flex-col rounded-[4px] border-2 border-ink bg-white p-5 shadow-[5px_5px_0_var(--ink)]">
      <span className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-ink bg-[color:var(--accent-2)]">
        <Icon className="h-5 w-5 text-ink" aria-hidden />
      </span>
      <h4 className="mt-4 font-display text-lg font-bold text-ink">{card.title}</h4>
      <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--muted-on-light)]">{card.body}</p>
    </div>
  );
}

/** Responsive perk grid - 1-up mobile, 2-up tablet, 3-up desktop. */
export function IconCardGrid({ cards }: { cards: PerkCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => (
        <IconCard key={card.title} card={card} />
      ))}
    </div>
  );
}

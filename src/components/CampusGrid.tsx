import { siteConfig } from "@/site.config";
import { Reveal } from "./motion/Reveal";

/**
 * Renders the REAL campus network - the markets the network spans / is
 * launching across. Framed honestly (markets, not "years of operation").
 */
export function CampusGrid() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {siteConfig.campuses.map((c, i) => (
        <Reveal key={c.school} delay={Math.min(i * 0.03, 0.4)}>
          <div className="group flex h-full flex-col justify-between rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-4 transition-colors hover:border-accent/30">
            <span className="font-display text-base font-bold text-ink">
              {c.school}
            </span>
            <span className="mt-2 text-xs text-[color:var(--muted-on-light)]">
              {c.city}
            </span>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

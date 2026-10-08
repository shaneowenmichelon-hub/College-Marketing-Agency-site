import { siteConfig } from "@/site.config";
import { Reveal } from "./motion/Reveal";

/**
 * The real campus network — the markets the network spans / is launching
 * across. Framed honestly (markets, not "years of operation").
 *
 * Each card carries its school's own colour. Twenty-one identical grey cards
 * read as a list; twenty-one colours read as a map, and a visitor spots their
 * own campus far faster. The colour is decorative only — no logos, no marks,
 * and nothing here claims the university is a client or partner.
 */
export function CampusGrid() {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {siteConfig.campuses.map((c, i) => (
        <li key={c.school}>
          <Reveal delay={Math.min(i * 0.03, 0.4)}>
            <div
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-[4px] border-2 border-ink bg-white p-4 shadow-[3px_3px_0_var(--ink)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--school)]"
              style={{ ["--school" as string]: c.color }}
            >
              {/* Colour bar, and a wash that fills in on hover. */}
              <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: c.color }} />
              <span
                aria-hidden
                className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-[0.07]"
                style={{ background: c.color }}
              />
              <span className="relative mt-1.5 font-display text-base font-bold text-ink">{c.school}</span>
              <span className="relative mt-2 flex items-center gap-1.5 text-xs text-[color:var(--muted-on-light)]">
                <span
                  aria-hidden
                  className="inline-block h-2 w-2 shrink-0 rounded-full ring-1 ring-ink/20"
                  style={{ background: c.color }}
                />
                {c.city}
              </span>
            </div>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

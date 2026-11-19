import Link from "next/link";
import { campusLinkLabel, campusNetworkCards, type CampusNetworkCard } from "@/lib/campus-network";
import { Reveal } from "./motion/Reveal";

/**
 * The real campus network — the markets the network spans / is launching
 * across. Framed honestly (markets, not "years of operation").
 *
 * Each card carries its school's own colour. Twenty-one identical grey cards
 * read as a list; twenty-one colours read as a map, and a visitor spots their
 * own campus far faster. The colour is decorative only — no logos, no marks,
 * and nothing here claims the university is a client or partner.
 *
 * Markets with a published city page lead the grid. Those cards are links.
 * Every other campus stays in its original order, with no link. The grid
 * uses items-start so a linked card's extra line does not stretch the
 * cards beside it.
 */
const CARD_CLASS =
  "group relative flex h-full flex-col justify-between overflow-hidden rounded-[4px] border-2 border-ink bg-white p-4 shadow-[3px_3px_0_var(--ink)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--school)]";

const ACTIVATION_CUE = "See activations →";

function CampusCardFace({ card, cue }: { card: CampusNetworkCard; cue: boolean }) {
  return (
    <>
      <span aria-hidden className="absolute inset-x-0 top-0 h-1.5" style={{ background: card.color }} />
      <span
        aria-hidden
        className="absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-[0.07]"
        style={{ background: card.color }}
      />
      <span className="relative mt-1.5 font-display text-base font-bold text-ink">{card.school}</span>
      <span className="relative mt-2 flex items-center gap-1.5 text-xs text-[color:var(--muted-on-light)]">
        <span
          aria-hidden
          className="inline-block h-2 w-2 shrink-0 rounded-full ring-1 ring-ink/20"
          style={{ background: card.color }}
        />
        {card.city}
      </span>
      {cue ? <span className="relative mt-3 text-xs font-semibold text-ink">{ACTIVATION_CUE}</span> : null}
    </>
  );
}

function CampusCard({ card }: { card: CampusNetworkCard }) {
  const style = { ["--school" as string]: card.color };
  if (!card.href) {
    return (
      <div className={CARD_CLASS} style={style}>
        <CampusCardFace card={card} cue={false} />
      </div>
    );
  }
  return (
    <Link
      href={card.href}
      aria-label={campusLinkLabel(card.school)}
      className={CARD_CLASS}
      style={style}
    >
      <CampusCardFace card={card} cue />
    </Link>
  );
}

export function CampusGrid() {
  const cards = campusNetworkCards();
  return (
    <ul className="grid grid-cols-2 items-start gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {cards.map((card, index) => (
        <li key={card.href ?? card.school}>
          <Reveal delay={Math.min(index * 0.03, 0.4)}>
            <CampusCard card={card} />
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

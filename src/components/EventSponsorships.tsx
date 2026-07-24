import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/SectionHeading";
import { eventSponsorships, type SponsorshipGroup, type SponsorshipItem } from "@/site.config";

function inquireHref(groupId: string, tier: string, item?: string, msg?: string) {
  const p = new URLSearchParams({
    utm_source: "sponsorship_directory",
    utm_medium: "events_page",
    utm_campaign: groupId,
    utm_content: tier,
  });
  if (item) p.set("utm_term", item);
  if (msg) p.set("msg", msg);
  return `/contact?${p.toString()}`;
}

function entryPrice(item: SponsorshipItem) {
  if (item.basePackage) return item.basePackage;
  if (item.tiers?.length) return item.tiers[item.tiers.length - 1]?.price ?? "Custom";
  return "Custom";
}

function premiumPrice(item: SponsorshipItem) {
  if (item.presentingSponsor) return item.presentingSponsor;
  if (item.tiers?.length) return item.tiers[0]?.price ?? "Custom";
  return "Custom";
}

function packageLabel(item: SponsorshipItem) {
  if (item.tiers?.length) {
    return item.tiers.map((tier) => `${tier.name.replace(" Sponsor", "")}: ${tier.price}`).join(" · ");
  }
  if (item.presentingDetail) return item.presentingDetail;
  if (item.baseDetail) return item.baseDetail;
  return "Entry and presenting packages are scoped around the brand's goals, market, and deliverables.";
}

function coreFacts(item: SponsorshipItem, group: SponsorshipGroup) {
  const facts = [
    item.venue || item.eventDate ? [item.venue, item.eventDate].filter(Boolean).join(" · ") : null,
    ...((item.highlights ?? []).slice(0, 4)),
  ].filter(Boolean) as string[];

  if (facts.length >= 3) return facts.slice(0, 4);

  const defaults = group.id === "thaw-out"
    ? [
        "8,000 students expected per market",
        "Single-market festival sponsorship with on-site activation",
        "Artist, student-athlete, and campus-culture integration",
      ]
    : [
        "High-intent student audience",
        "On-site brand presence and product placement",
        "Marketing visibility before and during the event",
      ];

  return [...facts, ...defaults].slice(0, 4);
}

function EventCard({ item, group }: { item: SponsorshipItem; group: SponsorshipGroup }) {
  const facts = coreFacts(item, group);

  return (
    <article className="flex h-full flex-col rounded-[4px] border-2 border-ink bg-white p-5 shadow-[5px_5px_0_var(--ink)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mono-label text-[10px] font-bold text-accent">{group.title}</p>
          <h4 className="mt-1 font-display text-xl font-bold leading-tight text-ink">{item.name}</h4>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-[color:var(--muted-on-light)]">{item.description}</p>
        </div>
        <span className="mono-label w-fit shrink-0 rounded-[2px] border-2 border-ink bg-accent px-2.5 py-1 text-[10px] font-bold text-ink">
          Sponsorship
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 border-y-2 border-ink/10 py-4">
        <div>
          <div className="mono-label text-[9px] text-[color:var(--muted-on-light)]">Audience</div>
          <div className="mt-1 font-display text-base font-bold text-ink">{item.valuePerEvent}</div>
        </div>
        <div>
          <div className="mono-label text-[9px] text-[color:var(--muted-on-light)]">Entry</div>
          <div className="mt-1 font-display text-base font-bold text-ink">{entryPrice(item)}</div>
        </div>
        <div>
          <div className="mono-label text-[9px] text-[color:var(--muted-on-light)]">Premium</div>
          <div className="mt-1 font-display text-base font-bold text-ink">{premiumPrice(item)}</div>
        </div>
      </div>

      <div className="mt-4 rounded-[3px] bg-surface-muted p-4">
        <p className="mono-label text-[10px] font-bold text-ink">Package snapshot</p>
        <p className="mt-1 text-xs leading-relaxed text-[color:var(--muted-on-light)]">{packageLabel(item)}</p>
      </div>

      <ul className="mt-4 space-y-2">
        {facts.map((fact) => (
          <li key={fact} className="flex gap-2 text-sm leading-relaxed text-ink">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
            <span>{fact}</span>
          </li>
        ))}
      </ul>

      {item.contact && (
        <div className="mt-4 rounded-[3px] border border-ink/15 bg-white p-3 text-xs text-[color:var(--muted-on-light)]">
          <span className="font-bold text-ink">Venue contact:</span> {item.contact.name} · {item.contact.email}
          {item.contact.phone ? ` · ${item.contact.phone}` : ""}
        </div>
      )}

      <Link
        href={inquireHref(group.id, "sponsorship", item.name, `Inquiry: ${group.title} — ${item.name}`)}
        className="mono-label mt-auto inline-flex items-center gap-1.5 pt-5 text-[11px] font-bold text-accent hover:underline"
      >
        Inquire about this opportunity <ArrowRight className="h-4 w-4" />
      </Link>
    </article>
  );
}

function EventGroup({ group, index }: { group: SponsorshipGroup; index: number }) {
  return (
    <section className="scroll-mt-24 border-t-2 border-ink pt-10 first:border-t-0 first:pt-0">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mono-label text-xs font-bold text-accent">Chapter {String(index + 1).padStart(2, "0")}</p>
          <h3 className="mt-1 font-display text-display-sm font-bold text-ink">{group.title}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-[color:var(--muted-on-light)]">{group.intro}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {group.items.map((item) => (
          <EventCard key={`${group.id}-${item.name}`} item={item} group={group} />
        ))}
      </div>
    </section>
  );
}

export function EventSponsorships() {
  return (
    <Section tone="muted" id="sponsor">
      <SectionHeading
        eyebrow="Sponsorships"
        title="Sponsor the moments students already care about."
        intro="A tighter menu of campus events, festivals, and venue partnerships — formatted so a brand can quickly compare audience, pricing, and value."
      />
      <div className="mt-12 space-y-14">
        {eventSponsorships.groups.map((group, index) => (
          <EventGroup key={group.id} group={group} index={index} />
        ))}
      </div>
    </Section>
  );
}

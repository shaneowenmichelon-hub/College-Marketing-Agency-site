import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { SectionHeading } from "@/components/SectionHeading";
import { eventSponsorships, type SponsorshipGroup } from "@/site.config";

// Pre-tag inquiries so the internal lead email shows they came from the directory.
const INQUIRE_HREF = "/contact?utm_source=sponsorship_directory&utm_medium=events_page";

function PriceStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-[color:var(--muted-on-light)]">
        {label}
      </div>
      <div className="font-display text-base font-bold text-ink">{value}</div>
    </div>
  );
}

function InquireLink() {
  return (
    <Link
      href={INQUIRE_HREF}
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
    >
      Inquire about sponsoring <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function Group({ group }: { group: SponsorshipGroup }) {
  return (
    <div className="mt-12 first:mt-10">
      <div className="flex flex-col gap-2 border-b border-[color:var(--border-on-light)] pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-display text-2xl font-bold text-ink">{group.title}</h3>
          <p className="mt-1 text-sm text-[color:var(--muted-on-light)]">{group.intro}</p>
        </div>
        <InquireLink />
      </div>

      {/* Portfolio-level pricing (e.g. the trips) shown prominently. */}
      {group.groupPricing && (
        <div className="mt-5 grid gap-4 rounded-2xl border border-accent/20 bg-accent/[0.04] p-5 sm:grid-cols-2">
          <div>
            <div className="text-[11px] uppercase tracking-wide text-accent">Base</div>
            <div className="mt-1 font-display text-lg font-bold text-ink">
              {group.groupPricing.base}
            </div>
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wide text-accent">Presenting</div>
            <div className="mt-1 font-display text-lg font-bold text-ink">
              {group.groupPricing.presenting}
            </div>
          </div>
        </div>
      )}

      {/* Coming-soon placeholder card */}
      {group.comingSoon ? (
        <div className="mt-5 flex flex-col items-start gap-3 rounded-2xl border border-dashed border-[color:var(--border-on-light)] bg-surface-muted/50 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Sparkles className="h-5 w-5 text-accent" aria-hidden />
            <p className="text-sm font-medium text-ink">
              More events &amp; venues coming soon.
            </p>
          </div>
          <Link
            href={INQUIRE_HREF}
            className="inline-flex items-center gap-1.5 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Get in touch to be first <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {group.items.map((item, i) => (
            <Reveal key={item.name} delay={Math.min(i * 0.05, 0.3)}>
              <div className="flex h-full flex-col rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-5 shadow-soft">
                <h4 className="font-display text-lg font-bold text-ink">{item.name}</h4>
                <p className="mt-1 text-sm text-[color:var(--muted-on-light)]">
                  {item.description}
                </p>
                <div className="mt-4 grid grid-cols-3 gap-3 border-t border-[color:var(--border-on-light)] pt-4">
                  <PriceStat label="Value / event" value={item.valuePerEvent} />
                  <PriceStat
                    label="Base package"
                    value={item.basePackage ?? (group.groupPricing ? "See above" : "[$ —]")}
                  />
                  <PriceStat
                    label="Presenting"
                    value={item.presentingSponsor ?? (group.groupPricing ? "See above" : "[$ —]")}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

/** The "Sponsor an event or trip" directory — Events service page. */
export function EventSponsorships() {
  return (
    <Section tone="muted" id="sponsor">
      <SectionHeading
        eyebrow="Sponsorships"
        title="Sponsor an event or trip."
        intro={eventSponsorships.intro}
      />
      <div className="mt-4">
        <Badge variant="lime">Value per event · Base package · Presenting sponsor</Badge>
      </div>
      {eventSponsorships.groups.map((group) => (
        <Group key={group.id} group={group} />
      ))}
    </Section>
  );
}

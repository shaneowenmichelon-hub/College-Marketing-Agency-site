import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/SectionHeading";
import {
  CURRENT_CAMPAIGN_STATUS,
  CURRENT_CAMPAIGNS_ANCHOR,
  currentCampaigns,
} from "@/lib/current-campaigns";

/**
 * Live campaigns with no published results. Kept off the case-study cards so
 * a missing stat cannot be read as a result.
 */
export function CurrentCampaigns() {
  return (
    <div id={CURRENT_CAMPAIGNS_ANCHOR} className="mt-16 scroll-mt-24 border-t border-[color:var(--border-on-light)] pt-14">
      <SectionHeading as="h2" eyebrow="Running now" title="Current campaigns" />
      <p className="mt-4 max-w-3xl text-base leading-relaxed text-[color:var(--muted-on-light)]">
        Collegiate Agency is currently running these campus campaigns for the Korean skincare brands pretune and
        HEVEBLUE. No results are published yet.
      </p>
      <ul className="mt-8 grid list-none gap-6 p-0 md:grid-cols-2">
        {currentCampaigns.map((campaign) => (
          <li key={campaign.name}>
            <article className="flex h-full flex-col rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-6 shadow-soft">
              <h3 className="font-display text-lg font-bold text-ink">{campaign.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[color:var(--muted-on-light)]">{campaign.description}</p>
              <p className="mt-4 text-sm font-semibold text-ink">{CURRENT_CAMPAIGN_STATUS}</p>
            </article>
          </li>
        ))}
      </ul>
      <div className="mt-8">
        <Button href="/contact" variant="lime" size="lg">
          Get a plan and pricing
        </Button>
      </div>
    </div>
  );
}

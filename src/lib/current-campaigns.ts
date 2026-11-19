/**
 * Live campus campaigns Shane Michelon confirmed on Nov 18, 2026 may be named
 * publicly. Do not add results, campuses, budgets, contract terms, quotes, or logos.
 */

export const CURRENT_CAMPAIGNS_ANCHOR = "running-now";
export const CURRENT_CAMPAIGNS_PATH = `/work#${CURRENT_CAMPAIGNS_ANCHOR}`;
export const CURRENT_CAMPAIGN_STATUS = "Campus campaign running on multiple U.S. campuses";

export type CurrentCampaign = {
  name: string;
  description: string;
};

export const currentCampaigns: readonly CurrentCampaign[] = [
  {
    name: "pretune",
    description: "Makes targeted hydrogel Neck-Tune patches.",
  },
  {
    name: "HEVEBLUE",
    description: "Korean skincare brand sold in the U.S. through retailers including Sephora and Olive Young.",
  },
];

/** One llms.txt line. No metrics, campuses, budgets, or results. */
export function currentCampaignsLlmsLine(origin: string): string {
  return `- [Running now](${origin}${CURRENT_CAMPAIGNS_PATH}): Collegiate Agency is currently running campus campaigns for pretune (https://www.pretune.us/) and HEVEBLUE on multiple U.S. college campuses. pretune makes targeted hydrogel Neck-Tune patches. HEVEBLUE is a Korean skincare brand sold in the U.S. through retailers including Sephora and Olive Young. No results are published yet.`;
}

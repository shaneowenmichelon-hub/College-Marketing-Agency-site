import { PackageOpen } from "lucide-react";
import { ServicePage } from "@/components/services/ServicePage";
import { getStat, pricing } from "@/site.config";
import { pageMetadata } from "@/lib/seo";

const rate = `${pricing["product-placement"].range} ${pricing["product-placement"].unit}`
  .replace(/\s+/g, " ")
  .trim();

export const metadata = pageMetadata({
  title: "Greek life product placement",
  description: `Product placement with 5 of the top Greek-life organizations per campus and dedicated media deliverables. Collegiate Agency prices it at ${pricing["product-placement"].range} per campus.`,
  path: "/services/product-placement",
});

export default function ProductPlacementPage() {
  return (
    <ServicePage
      slug="product-placement"
      icon={PackageOpen}
      eyebrow="Product Placement"
      title="Product placed with Greek life and campus social leaders."
      intro={`Collegiate Agency puts product with 5 of the top Greek-life organizations per campus, with dedicated media deliverables for each organization. The published rate is ${rate}. Additional organizations are quoted per campaign.`}
      overview={[
        "Product goes to campus social leaders, including Greek life and student organisations, instead of only appearing on a flyer after the fact. Each included organization gets its own media deliverables.",
        `A brand chooses campuses from the published network of ${getStat("campuses")} campuses, or names the campuses that matter. The campaign builder adds ${rate} for each campus marked for placement, and Collegiate Agency confirms firm pricing within one business day.`,
      ]}
      tacticsHeading="What a campus placement includes."
      tactics={[
        {
          title: "Five organizations per campus",
          body: "5 of the top Greek-life organizations are included on each campus in the published rate.",
        },
        {
          title: "Campus social leaders",
          body: "Product is placed directly with the students who already move things through their own circles.",
        },
        {
          title: "Media deliverables",
          body: "Each included organization comes with dedicated media deliverables.",
        },
        {
          title: "More organizations",
          body: "Additional organizations can be added. That extra cost is quoted per campaign.",
        },
        {
          title: "Student organisations",
          body: "The same channel covers Greek life and student organisations when the brief calls for both.",
        },
        {
          title: "Stack it with ambassadors",
          body: "Product placement is an add-on on the ambassador rate, and the campaign builder can include both.",
        },
      ]}
      processHeading="How a placement gets scoped."
      steps={[
        {
          title: "Name the campuses",
          body: "Pick schools from the published network, or tell Collegiate Agency which campuses matter.",
        },
        {
          title: "Place with organizations",
          body: "The rate includes 5 of the top Greek-life organizations on each campus.",
        },
        {
          title: "Collect the media",
          body: "Each included organization has dedicated media deliverables.",
        },
        {
          title: "Confirm the price",
          body: "Collegiate Agency replies within one business day with a tailored plan and firm pricing.",
        },
      ]}
      proof={[
        { value: getStat("campuses"), label: "campuses in the network" },
        { value: "5", label: "Greek-life organizations included per campus" },
        { value: pricing["product-placement"].range, label: "per campus" },
      ]}
      secondaryCta={{ label: "See pricing", href: "/pricing" }}
      hidePedigree
    />
  );
}

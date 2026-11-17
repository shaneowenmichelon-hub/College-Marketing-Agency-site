import { PackageOpen } from "lucide-react";
import { ServicePage } from "@/components/services/ServicePage";
import { getStat, pricing } from "@/site.config";
import { pageMetadata } from "@/lib/seo";

const rate = `${pricing["product-placement"].range} ${pricing["product-placement"].unit}`
  .replace(/\s+/g, " ")
  .trim();

export const metadata = pageMetadata({
  title: "Greek life product placement",
  description: `Greek-life product placement with dedicated media deliverables for each chapter. Collegiate Agency prices it at ${rate}.`,
  path: "/services/product-placement",
});

export default function ProductPlacementPage() {
  return (
    <ServicePage
      slug="product-placement"
      icon={PackageOpen}
      eyebrow="Product Placement"
      title="Product placed with Greek life and campus social leaders."
      intro={`Collegiate Agency places product with Greek-life chapters, with dedicated media deliverables for each chapter. The published rate is ${rate}.`}
      overview={[
        "Product goes to campus social leaders, including Greek-life chapters, instead of only appearing on a flyer after the fact. Each chapter gets its own media deliverables.",
        `A brand chooses campuses from the published network of ${getStat("campuses")} campuses, or names the campuses that matter, then sets how many chapters to include. The campaign builder adds ${rate} for each chapter, and Collegiate Agency confirms firm pricing within one business day.`,
      ]}
      tacticsHeading="What a chapter placement includes."
      tactics={[
        {
          title: "Priced per chapter",
          body: `The published rate is ${rate}.`,
        },
        {
          title: "Campus social leaders",
          body: "Product is placed directly with the students who already move things through their own circles.",
        },
        {
          title: "Media deliverables",
          body: "Each chapter comes with dedicated media deliverables.",
        },
        {
          title: "Chapter count",
          body: "A brand sets how many chapters to include. Each chapter uses the same published rate.",
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
          title: "Set the chapters",
          body: `Each chapter uses the published rate of ${rate}.`,
        },
        {
          title: "Collect the media",
          body: "Each chapter has dedicated media deliverables.",
        },
        {
          title: "Confirm the price",
          body: "Collegiate Agency replies within one business day with a tailored plan and firm pricing.",
        },
      ]}
      proof={[
        { value: getStat("campuses"), label: "campuses in the network" },
        { value: pricing["product-placement"].range, label: "per chapter" },
      ]}
      secondaryCta={{ label: "See pricing", href: "/pricing" }}
      hidePedigree
    />
  );
}

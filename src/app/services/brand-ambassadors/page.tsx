import type { Metadata } from "next";
import { Users } from "lucide-react";
import { ServicePage } from "@/components/services/ServicePage";
import { getStat } from "@/site.config";

export const metadata: Metadata = {
  title: "Brand Ambassadors - Student reps and campus leaders",
  description:
    "A vetted student rep network for sampling, flyering, product distribution, tabling, pop-ups, and campus leaders posting monthly Instagram and TikTok stories to real peers.",
  alternates: { canonical: "/services/brand-ambassadors" },
};

export default function BrandAmbassadorsPage() {
  return (
    <ServicePage
      slug="brand-ambassadors"
      icon={Users}
      eyebrow="Brand Ambassadors"
      title="A vetted student rep network that carries your brand on campus."
      intro="Our ambassador program combines boots-on-the-ground execution with real peer-to-peer social stories. We recruit, screen, train, and manage campus leaders so your product shows up through students their friends already trust."
      overview={[
        "The program is built around real student operators - not random handles. Ambassadors sample, flyer, distribute product through friend groups, staff tables, support pop-ups, and create campus-native visibility.",
        "Each ambassador can post 2x a month on Instagram/TikTok stories to real peers, with links and brand tags. When it makes sense, we add localized paid media boosting to extend what is already working organically.",
      ]}
      tacticsHeading="What ambassadors do for brands."
      tactics={[
        {
          title: "Sampling & flyering",
          body: "Get product and messaging directly into students' hands in high-traffic campus moments.",
        },
        {
          title: "Friend group product distribution",
          body: "Seed product through trusted social circles so trial starts with the people students already know.",
        },
        {
          title: "Tabling & event staffing",
          body: "Staffed tables and event support that put a friendly, on-brand student face on your presence.",
        },
        {
          title: "Pop-up activations",
          body: "Short-run branded moments run by students who know the campus and the crowd.",
        },
        {
          title: "2x monthly social stories",
          body: "Campus leaders post Instagram/TikTok stories to real peers with links and brand tags.",
        },
        {
          title: "Optional paid media boosting",
          body: "Extend strong ambassador content with localized paid media when the organic signal is there.",
        },
      ]}
      processHeading="How the network works."
      steps={[
        { title: "Recruit", body: "We source campus leaders and student reps who match your target schools and audience." },
        { title: "Screen", body: "We vet for reliability, campus fit, and ability to represent the brand cleanly." },
        { title: "Train", body: "Ambassadors are briefed on deliverables, links, tags, talking points, and campus execution." },
        { title: "Manage", body: "We manage the roster, proof, content, and reporting so the program actually runs." },
      ]}
      proof={[
        { value: getStat("ambassadors"), label: "student ambassadors" },
        { value: getStat("campuses"), label: "campuses" },
        { value: getStat("studentsReached"), label: "students reached" },
      ]}
      secondaryCta={{ label: "Become an Ambassador", href: "/become-an-ambassador" }}
    />
  );
}

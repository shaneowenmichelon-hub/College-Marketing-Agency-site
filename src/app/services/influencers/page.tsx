import type { Metadata } from "next";
import { Megaphone } from "lucide-react";
import { ServicePage } from "@/components/services/ServicePage";
import { getStat } from "@/site.config";

export const metadata: Metadata = {
  title: "Influencers — Real students, real reach",
  description:
    "Real students posting to real friends — authentic peer-to-peer content with high engagement because the audience is their actual social circle. Recruit, screen, train, manage, boost.",
  alternates: { canonical: "/services/influencers" },
};

export default function InfluencersPage() {
  return (
    <ServicePage
      slug="influencers"
      icon={Megaphone}
      eyebrow="Influencers"
      title="Real students posting to real friends."
      intro="Student creators reach an audience that's actually their social circle — so the content lands as a recommendation, not an ad. It's peer-to-peer content with the kind of engagement you can't buy with reach alone."
      overview={[
        "The most persuasive post about your brand isn't from a mega-influencer — it's from someone's friend. We build rosters of student creators whose audiences are their real classmates, teammates, and roommates, so your brand shows up inside genuine social circles.",
        "We handle the whole roster: finding the right creators, screening them, briefing and training them, and managing the content so it stays authentic and on-brand. When it makes sense, we add paid boosting to extend the best-performing posts beyond their organic reach.",
        "Our creators meet a baseline of 1,500+ followers on Instagram or TikTok — enough to matter, small enough to stay authentic. Students below that threshold are a great fit for our brand ambassador program instead.",
      ]}
      tacticsHeading="Content that fits the feed."
      tactics={[
        {
          title: "Authentic UGC",
          body: "Content that looks and sounds like the creator, because it is — not a scripted ad read.",
        },
        {
          title: "Product seeding",
          body: "Get product into the hands of the right creators and let genuine reactions do the work.",
        },
        {
          title: "Campus creator rosters",
          body: "Curated groups of student creators mapped to your target schools and audiences.",
        },
        {
          title: "Event amplification",
          body: "Creators cover your activations live, turning one moment into a wave of content.",
        },
        {
          title: "Paid boosting",
          body: "Extend the top-performing posts with targeted spend to reach beyond organic.",
        },
        {
          title: "FTC-compliant disclosure",
          body: "Every paid post is tagged #ad / #sponsored, so the program stays clean and compliant.",
        },
      ]}
      processHeading="How it works."
      steps={[
        { title: "Recruit", body: "We source student creators whose audiences match your target campuses." },
        { title: "Pre-screen", body: "We vet for real engagement and audience fit — not just follower counts." },
        { title: "Train & manage", body: "We brief, train, and manage creators so content stays authentic and on-brand." },
        { title: "Boost", body: "Optional paid boosting extends your best content beyond its organic reach." },
      ]}
      proof={[
        { value: getStat("influencers"), label: "student creators" },
        { value: getStat("socialReach"), label: "combined social reach" },
        { value: "7%", label: "avg. engagement" },
      ]}
    />
  );
}

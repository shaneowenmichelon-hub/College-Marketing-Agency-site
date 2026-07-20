import type { Metadata } from "next";
import { Users } from "lucide-react";
import { ServicePage } from "@/components/services/ServicePage";

export const metadata: Metadata = {
  title: "Brand Ambassadors — Your voice on campus",
  description:
    "A vetted student rep network that becomes your brand's voice on campus — peer-to-peer, customized by school and audience. Sampling, dorm drops, tabling, pop-ups, and more.",
};

export default function BrandAmbassadorsPage() {
  return (
    <ServicePage
      icon={Users}
      eyebrow="Brand Ambassadors"
      title="A student rep network that becomes your voice on campus."
      intro="Our vetted ambassadors are real students who represent your brand where they live, study, and hang out. It's peer-to-peer marketing — customized by school and audience — that reaches students through people they already trust."
      overview={[
        "Nobody sells a brand to students better than another student. Our ambassador program puts a screened, trained network of reps on the ground for you — handing out product, running tables, hosting drops, and talking about your brand like the insiders they are.",
        "We recruit and vet the network, match reps to your brand and campuses, and manage them so the program actually runs. You set the goal; we put the right students behind it. Every program is customized by school and audience — [X]+ ambassadors across the network and growing.",
      ]}
      tacticsHeading="What ambassadors do on the ground."
      tactics={[
        {
          title: "Sampling & flyering",
          body: "Get product and messaging directly into students' hands in high-traffic spots.",
        },
        {
          title: "Dorm & residence drops",
          body: "Reach students where they live with targeted drops and residence-hall programs.",
        },
        {
          title: "Greek & club sponsorships",
          body: "Activate through the orgs that shape the social calendar and carry real influence.",
        },
        {
          title: "Tabling & event staffing",
          body: "Staffed tables and event support that put a friendly, on-brand face on your presence.",
        },
        {
          title: "Pop-up stores",
          body: "Short-run branded retail moments run by students who know the campus.",
        },
        {
          title: "Peer-to-peer content",
          body: "Ambassadors post from their own accounts, so your brand shows up in real student feeds.",
        },
      ]}
      processHeading="How the network works."
      steps={[
        { title: "Match", body: "We match reps to your brand, goals, and target campuses." },
        { title: "Train", body: "Ambassadors are briefed and trained so they represent you accurately." },
        { title: "Activate", body: "Reps execute on the ground and online across the semester." },
        { title: "Report", body: "We track activity and results and report back on what landed." },
      ]}
      proof={[
        { value: "[X]+", label: "ambassadors" },
        { value: "[X]+", label: "campuses" },
        { value: "[X]K+", label: "students reached" },
      ]}
      secondaryCta={{ label: "Become an Ambassador", href: "/become-an-ambassador" }}
    />
  );
}

import type { Metadata } from "next";
import { CalendarHeart } from "lucide-react";
import { ServicePage } from "@/components/services/ServicePage";

export const metadata: Metadata = {
  title: "Events — Campus activations, planned & executed",
  description:
    "Custom campus activations planned, staffed, and executed end to end — Welcome Week takeovers, tailgates, sampling, and experiential moments students actually show up for.",
  alternates: { canonical: "/services/events" },
};

export default function EventsPage() {
  return (
    <ServicePage
      slug="events"
      icon={CalendarHeart}
      eyebrow="Events"
      title="Campus activations students actually show up for."
      intro="We plan, staff, and run custom activations on campus — from the first permit to the post-event recap. You get a moment students remember and content that keeps working after everyone goes home."
      overview={[
        "An event is the fastest way to turn a brand into an experience. We design activations around the moments students already care about — move-in, game day, finals, the first warm week of spring — so your brand shows up where the energy already is.",
        "Every activation is planned, staffed, and executed by our team. We handle the logistics, permits, product, and people on the ground, then hand you the assets and the numbers afterward.",
      ]}
      tacticsHeading="Ways we activate on campus."
      tactics={[
        {
          title: "Welcome Week takeovers",
          body: "Own the busiest two weeks of the year, when students are forming new habits and open to trying something.",
        },
        {
          title: "Tailgates & sampling",
          body: "Meet students where the crowd already is — game days, tailgate lots, and big campus gatherings.",
        },
        {
          title: "Pop-up activations",
          body: "High-design, high-energy pop-ups that create a line, a photo, and a story worth posting.",
        },
        {
          title: "Greek & student-club sponsorships",
          body: "Partner with the orgs that set the social calendar and reach students through people they already follow.",
        },
        {
          title: "Product sampling & experiential",
          body: "Put the product in students' hands with a moment built around trying it, not just taking it.",
        },
        {
          title: "Custom builds",
          body: "Have something bigger in mind? We scope, design, and produce one-off concepts from scratch.",
        },
      ]}
      processHeading="How we run an event."
      steps={[
        { title: "Scope & concept", body: "We align on the goal, the audience, and a concept that fits the campus." },
        { title: "Permits & logistics", body: "We handle approvals, vendors, product, and site logistics so nothing stalls." },
        { title: "Staff & execute", body: "Trained student staff run the activation on the ground, on-brand and on-time." },
        { title: "Capture & report", body: "We capture content throughout and hand back assets plus a results recap." },
      ]}
      proof={[
        { value: "[X]+", label: "activations run" },
        { value: "[X]K+", label: "students engaged" },
        { value: "[X]+", label: "campuses" },
      ]}
    />
  );
}

import type { Metadata } from "next";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { CampaignBuilder } from "@/components/campaign/CampaignBuilder";

export const metadata: Metadata = {
  title: "Create a Campaign - Build your campus plan",
  description:
    "Build a college marketing campaign in minutes: pick event sponsorships, product placement, and ambassadors, choose your campuses and events, and get an instant starting estimate.",
  alternates: { canonical: "/build-a-campaign" },
};

export default function BuildACampaignPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Create a Campaign", path: "/build-a-campaign" },
        ]}
      />
      <Section tone="light">
        <Container className="px-0">
          <CampaignBuilder />
        </Container>
      </Section>
    </>
  );
}

import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service - placeholder.",
  robots: { index: false, follow: true },
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service">
      <p>
        These terms are a placeholder. Add your agency&apos;s real terms of service,
        including acceptable use, ambassador program terms, payment terms, and
        limitation of liability, reviewed by counsel before you launch.
      </p>
      <p>
        Suggested sections to cover: use of the site, ambassador eligibility and
        conduct, brand engagement terms, intellectual property, disclaimers, and
        governing law.
      </p>
    </LegalPage>
  );
}

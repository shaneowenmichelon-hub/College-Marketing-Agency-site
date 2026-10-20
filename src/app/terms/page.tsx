import { LegalPage } from "@/components/LegalPage";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "Terms of Service - placeholder.",
  path: "/terms",
  index: false,
});

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

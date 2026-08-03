import type { Metadata } from "next";
import { siteConfig } from "@/site.config";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How we collect, use, and protect your data - including student applicant data.",
  alternates: { canonical: "/privacy" },
  robots: { index: false, follow: true },
};

// TODO: have counsel review before launch. This describes actual data flows in the
// app but is not a substitute for a lawyer-reviewed policy.
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This policy describes how {siteConfig.companyName} ({siteConfig.companyLegalName})
        collects and uses information through this website. It is a starting point and
        must be reviewed by counsel before launch.
      </p>

      <h2 className="font-display text-xl font-bold text-ink">Information we collect</h2>
      <p>
        <strong>Brand inquiries.</strong> When you contact us or request a resource, we
        collect your name, work email, company, phone (optional), and anything you include
        in your message.
      </p>
      <p>
        <strong>Student ambassador applications.</strong> When you apply, we collect
        personal information including your name, date of birth (to confirm you are 18 or
        older), phone, city/state, school, school (.edu) email, graduation year, major,
        social handles and self-reported follower counts, your reasons for applying, and an
        optional resume file you choose to attach.
      </p>
      <p>
        <strong>Analytics &amp; cookies.</strong> With your consent, we use cookies and
        analytics tools (such as Google Analytics) to understand site traffic. We also
        record basic marketing attribution (UTM parameters and referring page) with form
        submissions. Non-essential tracking loads only after you opt in via the cookie
        banner.
      </p>

      <h2 className="font-display text-xl font-bold text-ink">How we use it</h2>
      <p>
        We use brand information to respond to your inquiry and discuss working together.
        We use student information to review your application and match you with brand
        opportunities that fit your campus and audience, and to follow up with you by
        email. We use analytics to improve the site.
      </p>

      <h2 className="font-display text-xl font-bold text-ink">Sharing</h2>
      <p>
        We may share limited information with brand partners in the course of matching
        ambassadors to campaigns, and with service providers who help us operate the site
        and send email. We do not sell your personal information.
      </p>

      <h2 className="font-display text-xl font-bold text-ink">Your choices &amp; contact</h2>
      <p>
        You can decline non-essential cookies at any time via the banner, and you can
        request access to or deletion of your data by emailing{" "}
        <a href={`mailto:${siteConfig.contact.email}`} className="text-accent underline underline-offset-2">
          {siteConfig.contact.email}
        </a>
        . Students must be 18 or older to apply; this site is not directed to children.
      </p>
    </LegalPage>
  );
}

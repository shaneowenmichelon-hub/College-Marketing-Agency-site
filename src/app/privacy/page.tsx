import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy Policy — placeholder.",
  robots: { index: false, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <p>
        This privacy policy is a placeholder. Add your real policy describing what
        data you collect (including from brand contact forms and student ambassador
        applications), how it&apos;s used and stored, and the rights available to
        users, reviewed by counsel before launch.
      </p>
      <p>
        Suggested sections to cover: information you collect, how you use it, sharing
        with brand partners, data retention, cookies, and how to contact you with
        privacy requests.
      </p>
    </LegalPage>
  );
}

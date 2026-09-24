"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Analytics } from "@/components/analytics/Analytics";
import { CookieConsent } from "@/components/analytics/CookieConsent";
import { FirstPartyAnalytics } from "@/components/analytics/FirstPartyAnalytics";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { NewsletterModal } from "@/components/NewsletterModal";

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAdmin =
    pathname?.startsWith("/private-ops-7f3a") ||
    pathname?.startsWith("/zmm-affiliate-command") ||
    pathname?.startsWith("/api/admin");
  // Never interrupt a page whose whole job is to capture a lead. The modal is
  // full-screen and locks body scroll, so on /contact and /build-a-campaign it
  // was covering the form 1.5s after load — trading a brand enquiry for a
  // newsletter signup. The ambassador page was already exempt; these two are
  // the revenue pages and matter more.
  const showNewsletterModal =
    !pathname?.startsWith("/portal") &&
    !pathname?.startsWith("/become-an-ambassador") &&
    !pathname?.startsWith("/contact") &&
    !pathname?.startsWith("/build-a-campaign") &&
    !pathname?.startsWith("/terms") &&
    !pathname?.startsWith("/privacy");

  if (isAdmin) {
    return (
      <main id="main" className="min-h-screen">
        {children}
      </main>
    );
  }

  return (
    <>
      <SmoothScroll>
        <Navbar />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </SmoothScroll>
      <CookieConsent />
      {showNewsletterModal ? <NewsletterModal /> : null}
      <Analytics />
      <FirstPartyAnalytics />
    </>
  );
}

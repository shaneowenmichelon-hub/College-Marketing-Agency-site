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
  const showNewsletterModal =
    !pathname?.startsWith("/portal") &&
    !pathname?.startsWith("/become-an-ambassador") &&
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

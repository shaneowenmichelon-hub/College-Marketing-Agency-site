"use client";

import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

// Lenis/GSAP only restyle scrolling and paint no box. Load them after idle so
// they are not on the LCP path. The header and page are server HTML.
function IdleSmoothScroll() {
  const [Scroll, setScroll] = useState<ComponentType<{ children?: ReactNode }> | null>(null);
  useEffect(() => {
    let cancel = false;
    const run = () => {
      void import("@/components/motion/SmoothScroll").then((mod) => {
        if (!cancel) setScroll(() => mod.SmoothScroll);
      });
    };
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(run, { timeout: 2000 });
      return () => {
        cancel = true;
        window.cancelIdleCallback(id);
      };
    }
    const id = window.setTimeout(run, 1);
    return () => {
      cancel = true;
      window.clearTimeout(id);
    };
  }, []);
  return Scroll ? <Scroll /> : null;
}

// Enhancements that are not the page content. SSR stays on; the inquiry form
// is never in this list.
const Analytics = dynamic(() =>
  import("@/components/analytics/Analytics").then((mod) => mod.Analytics),
);
const CookieConsent = dynamic(() =>
  import("@/components/analytics/CookieConsent").then((mod) => mod.CookieConsent),
);
const FirstPartyAnalytics = dynamic(() =>
  import("@/components/analytics/FirstPartyAnalytics").then((mod) => mod.FirstPartyAnalytics),
);
const NewsletterModal = dynamic(() =>
  import("@/components/NewsletterModal").then((mod) => mod.NewsletterModal),
);
const ScrollProgress = dynamic(() =>
  import("@/components/motion/ScrollProgress").then((mod) => mod.ScrollProgress),
);

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
      <ScrollProgress />
      <IdleSmoothScroll />
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
      <CookieConsent />
      {showNewsletterModal ? <NewsletterModal /> : null}
      <Analytics />
      <FirstPartyAnalytics />
    </>
  );
}

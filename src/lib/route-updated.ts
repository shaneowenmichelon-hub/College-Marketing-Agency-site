/**
 * Last content-change date for each static sitemap route.
 *
 * Each date is `git log -1 --format=%cs` of the files in
 * {@link STATIC_ROUTE_SOURCES}, taking the newest file. Article and
 * case-study URLs do not use this map; they use their own dates.
 * `/insights` uses the newer of this date and the newest article revision.
 *
 * Do not bump a date by hand. Change the source file, then set the date to
 * that commit. `tests/sitemap-lastmod.test.cjs` fails when a listed file is
 * newer than the date stored here.
 */
export const STATIC_ROUTE_SOURCES: Record<string, readonly string[]> = {
  "/": [
    "src/app/page.tsx",
    "src/components/home/Hero.tsx",
    "src/components/home/CampusAttentionJourney.tsx",
    "src/components/home/StickyMobileCTA.tsx",
    "src/components/ServiceCard.tsx",
    "src/lib/home-faq.ts",
    "src/lib/seo.ts",
    "src/site.config.ts",
  ],
  "/services": [
    "src/app/services/page.tsx",
    "src/lib/services-hub-faq.ts",
    "src/components/services/CapabilityBlock.tsx",
    "src/site.config.ts",
  ],
  "/services/events": [
    "src/app/services/events/page.tsx",
    "src/components/services/ServicePage.tsx",
    "src/components/EventSponsorships.tsx",
    "src/lib/service-faqs.ts",
    "src/lib/seo.ts",
    "src/site.config.ts",
  ],
  "/services/brand-ambassadors": [
    "src/app/services/brand-ambassadors/page.tsx",
    "src/components/services/ServicePage.tsx",
    "src/lib/service-faqs.ts",
    "src/site.config.ts",
  ],
  "/services/product-placement": [
    "src/app/services/product-placement/page.tsx",
    "src/components/services/ServicePage.tsx",
    "src/lib/service-faqs.ts",
    "src/site.config.ts",
  ],
  "/pricing": ["src/app/pricing/page.tsx", "src/lib/pricing-page.ts", "src/site.config.ts"],
  "/build-a-campaign": [
    "src/app/build-a-campaign/page.tsx",
    "src/components/campaign/CampaignBuilder.tsx",
    "src/lib/campaign-inventory.ts",
    "src/lib/indexable-pages.ts",
    "src/site.config.ts",
  ],
  "/work": ["src/app/work/page.tsx", "src/lib/indexable-pages.ts", "src/lib/content.ts"],
  "/about": ["src/app/about/page.tsx", "src/lib/seo.ts", "src/site.config.ts"],
  "/insights": ["src/app/insights/page.tsx", "src/lib/seo.ts"],
  "/contact": [
    "src/app/contact/page.tsx",
    "src/lib/indexable-pages.ts",
    "src/components/forms/ContactForm.tsx",
    "src/components/InquiryTestimonial.tsx",
    "src/site.config.ts",
  ],
  "/become-an-ambassador": ["src/app/become-an-ambassador/page.tsx", "src/components/forms/ApplyForm.tsx"],
};

/** Newest `git log -1 --format=%cs` date of {@link STATIC_ROUTE_SOURCES}. */
export const STATIC_ROUTE_UPDATED: Record<string, string> = {
  "/": "2026-11-18",
  "/services": "2026-11-18",
  "/services/events": "2026-11-18",
  "/services/brand-ambassadors": "2026-11-18",
  "/services/product-placement": "2026-11-18",
  "/pricing": "2026-11-18",
  "/build-a-campaign": "2026-11-18",
  "/work": "2026-11-18",
  "/about": "2026-11-18",
  "/insights": "2026-11-18",
  "/contact": "2026-11-18",
  "/become-an-ambassador": "2026-10-20",
};

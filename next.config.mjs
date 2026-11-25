import { productionAliasRedirects } from "./src/lib/production-host-redirect.mjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The default trailing-slash redirect is registered before every custom
  // redirect, so /hub/ would 308 to /hub and only then to the owner. Skip that
  // built-in rule and add the same strip at the end of redirects(), after the
  // retired hub rules, so a trailing-slash hub URL reaches its owner in one hop.
  skipTrailingSlashRedirect: true,
  // Ensure the blog .mdx files are bundled into serverless functions (the 48h
  // article-art cron reads them at runtime).
  outputFileTracingIncludes: {
    "/api/cron/article-art": ["./content/blog/**/*"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Online photo sources used across the site (see src/site.config.ts sitePhotos).
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
  // Influencers was never a standalone page. Product placement is
  // /services/product-placement. Preserves any inbound/old links.
  async redirects() {
    return [
      // Public production aliases only. See src/lib/production-host-redirect.mjs.
      // vercel.json repeats these so the edge applies them before the CDN cache.
      ...productionAliasRedirects(),
      { source: "/services/influencers", destination: "/services", permanent: true },
      // Old feed path. /feed.xml is the insights RSS document.
      { source: "/rss.xml", destination: "/feed.xml", permanent: true },
      // Retired insight topic hubs, approved 2026-11-25. Keep in sync with
      // RETIRED_INSIGHT_TOPIC_OWNERS in src/lib/insight-topics.ts.
      // trailingSlash is false. The slash variant is listed too. Because
      // skipTrailingSlashRedirect is set, these rules run before the general
      // slash strip at the bottom of this list. permanent: true is a 308.
      {
        source: "/insights/topics/brand-ambassador-programs",
        destination: "/insights/college-brand-ambassador-program",
        permanent: true,
      },
      {
        source: "/insights/topics/brand-ambassador-programs/",
        destination: "/insights/college-brand-ambassador-program",
        permanent: true,
      },
      {
        source: "/insights/topics/product-sampling-and-placement",
        destination: "/insights/on-campus-product-sampling",
        permanent: true,
      },
      {
        source: "/insights/topics/product-sampling-and-placement/",
        destination: "/insights/on-campus-product-sampling",
        permanent: true,
      },
      {
        source: "/insights/topics/campus-sponsorship",
        destination: "/insights/college-event-sponsorship",
        permanent: true,
      },
      {
        source: "/insights/topics/campus-sponsorship/",
        destination: "/insights/college-event-sponsorship",
        permanent: true,
      },
      {
        source: "/insights/topics/campus-marketing-strategy",
        destination: "/insights/college-marketing-strategy",
        permanent: true,
      },
      {
        source: "/insights/topics/campus-marketing-strategy/",
        destination: "/insights/college-marketing-strategy",
        permanent: true,
      },
      // Same campaigns as the /work case studies. Keep in sync with
      // CASE_STUDIES_CANONICAL_ON_WORK in src/lib/content.ts.
      {
        source: "/insights/sos-consultants-nola-campus-leasing-ambassadors",
        destination: "/work/sos-consultants-nola-campus-leasing-ambassadors",
        statusCode: 301,
      },
      {
        source: "/insights/nutrl-night-school-tour-product-placement",
        destination: "/work/nutrl-night-school-tour-product-placement",
        statusCode: 301,
      },
      // Same behavior as Next's built-in trailing-slash redirect, after the
      // specific rules above so those can match /path/ themselves.
      { source: "/:path+/", destination: "/:path+", permanent: true },
    ];
  },
};

export default nextConfig;

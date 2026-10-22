/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
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
      { source: "/services/influencers", destination: "/services", permanent: true },
      // Old feed path. /feed.xml is the insights RSS document.
      { source: "/rss.xml", destination: "/feed.xml", permanent: true },
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
    ];
  },
};

export default nextConfig;

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
  // 301s for service sub-paths that were never standalone pages (the /services
  // hub is the single services entry point). Preserves any inbound/old links.
  async redirects() {
    return [
      { source: "/services/influencers", destination: "/services", permanent: true },
      { source: "/services/product-placement", destination: "/services", permanent: true },
    ];
  },
};

export default nextConfig;

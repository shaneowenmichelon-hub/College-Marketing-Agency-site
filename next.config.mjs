/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure the blog .mdx files are bundled into serverless functions (the 48h
  // article-art cron reads them at runtime).
  outputFileTracingIncludes: {
    "/api/cron/article-art": ["./content/blog/**/*"],
  },
  images: {
    remotePatterns: [
      // Online photo sources used across the site (see src/site.config.ts sitePhotos).
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;

import { pageMetadata } from "@/lib/seo";

// Keep the whole portal out of search results.
export const metadata = pageMetadata({
  title: "Ambassador Portal",
  description: "Student ambassador job portal.",
  path: "/portal",
  index: false,
  follow: false,
});

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

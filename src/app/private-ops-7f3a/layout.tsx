import { pageMetadata } from "@/lib/seo";

// Internal admin dashboard - never index.
export const metadata = pageMetadata({
  title: "Admin",
  description: "Internal operations dashboard.",
  path: "/private-ops-7f3a",
  index: false,
  follow: false,
});

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

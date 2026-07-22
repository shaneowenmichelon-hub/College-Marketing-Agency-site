import type { Metadata } from "next";

// Keep the whole portal out of search results.
export const metadata: Metadata = {
  title: "Ambassador Portal",
  robots: { index: false, follow: false },
};

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

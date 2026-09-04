import type { Metadata } from "next";
import { Analytics as VercelAnalytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Inter, Space_Grotesk, Space_Mono, Instrument_Serif } from "next/font/google";
import "@/styles/globals.css";
import { siteConfig } from "@/site.config";
import { AppShell } from "@/components/AppShell";
import { ScrollManager } from "@/components/ScrollManager";
import { OrganizationJsonLd } from "@/components/seo/JsonLd";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

// Editorial serif - used only for selected emphasis (e.g. "campus culture").
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.companyName} - ${siteConfig.tagline}`,
    template: `%s · ${siteConfig.companyName}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.companyName,
  openGraph: {
    type: "website",
    siteName: siteConfig.companyName,
    title: `${siteConfig.companyName} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: "/og.svg", width: 1200, height: 630, alt: siteConfig.companyName }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.companyName} - ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: ["/og.svg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable} ${spaceMono.variable} ${instrumentSerif.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to content
        </a>
        <OrganizationJsonLd />
        <ScrollManager />
        <AppShell>{children}</AppShell>
        <VercelAnalytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

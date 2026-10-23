"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CTASection } from "@/components/CTASection";
import { trackEvent } from "@/lib/analytics";

export type ArticleCtaCopy = {
  heading: string;
  blurb: string;
  primary: { label: string; href: string };
  secondary: { label: string; href: string };
};

/** Carry the article slug onto the brand form so the lead stores where it started. */
export function articleCtaHref(href: string, slug: string): string {
  if (href !== "/contact" && href !== "/build-a-campaign") return href;
  return `${href}?article=${encodeURIComponent(slug)}`;
}

function trackCta(slug: string, position: string, destination: string) {
  trackEvent("cta_click", { article_slug: slug, position, destination });
}

/** Mid-article and closing brand cards. Events book a call; the other services open the builder. */
export function ArticleCtaCard({
  slug,
  position,
  cta,
}: {
  slug: string;
  position: "mid" | "closing";
  cta: ArticleCtaCopy;
}) {
  const href = articleCtaHref(cta.primary.href, slug);
  return (
    <div
      className={
        position === "mid"
          ? "my-8 rounded-[4px] border-2 border-ink bg-[color:var(--accent)] p-5 text-white shadow-[6px_6px_0_var(--ink)]"
          : "mt-12 rounded-[4px] border-2 border-ink bg-[color:var(--accent)] p-6 text-white shadow-[8px_8px_0_var(--ink)] sm:p-8"
      }
    >
      <h2 className="font-display text-2xl font-bold text-white">{cta.heading}</h2>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/90">{cta.blurb}</p>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Link
          href={href}
          onClick={() => trackCta(slug, position, cta.primary.href)}
          className="brutal-press inline-flex shrink-0 items-center justify-center gap-1.5 rounded-[3px] border-2 border-ink bg-[color:var(--accent-2)] px-5 py-2.5 text-sm font-bold text-ink shadow-[4px_4px_0_var(--ink)]"
        >
          {cta.primary.label} <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href={cta.secondary.href}
          onClick={() => trackCta(slug, position, cta.secondary.href)}
          className="inline-flex shrink-0 items-center gap-1.5 text-sm font-bold text-white underline decoration-2 underline-offset-4"
        >
          {cta.secondary.label}
        </Link>
      </div>
      {position === "closing" && (
        <p className="mt-5 border-t-2 border-white/20 pt-4 text-xs text-white/70">
          Student, not a brand?{" "}
          <Link href="/become-an-ambassador" className="font-semibold text-white underline underline-offset-4">
            Apply to the ambassador network
          </Link>
          .
        </p>
      )}
    </div>
  );
}

/** The dark band at the bottom of an article. Same destination as the events call, with the article attached. */
export function ArticleFooterCta({ slug }: { slug: string }) {
  const href = articleCtaHref("/contact", slug);
  return (
    <div onClickCapture={(event) => {
      const link = (event.target as HTMLElement).closest("a");
      if (!link) return;
      const destination = link.getAttribute("href")?.split("?")[0] || href;
      trackCta(slug, "footer", destination);
    }}>
      <CTASection
        title="Ready to reach students?"
        primary={{ label: "Get Started", href, variant: "lime" }}
      />
    </div>
  );
}

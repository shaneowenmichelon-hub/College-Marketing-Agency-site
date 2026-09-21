import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

/**
 * "Add us as a preferred source on Google" badge.
 *
 * Google's Preferred Sources feature lets readers choose sites they want to see
 * more of in Top Stories, AI Overviews, and AI Mode. This links to Google's
 * official source-preferences deeplink with our domain pre-filled, so a
 * logged-in reader can add us in one click. No script, structured data, meta
 * tag, or application is required (per Google's Search Central guidance) — it's
 * an audience-promotion prompt, not a ranking signal.
 *
 * Docs: https://developers.google.com/search/docs/appearance/preferred-sources
 */

const DEEPLINK = `https://www.google.com/preferences/source?q=${siteConfig.companyDomain}`;

function GoogleG({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden focusable="false">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

export function PreferredSourceBadge({
  variant = "card",
  className,
}: {
  variant?: "card" | "compact";
  className?: string;
}) {
  if (variant === "compact") {
    return (
      <a
        href={DEEPLINK}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "group inline-flex items-center gap-2 rounded-[3px] border-2 border-ink bg-surface px-3 py-2 text-sm font-bold text-ink shadow-[3px_3px_0_var(--ink)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0_var(--ink)]",
          className,
        )}
      >
        <GoogleG className="h-4 w-4" />
        Make us a preferred source on Google
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-start gap-4 rounded-[4px] border-2 border-ink bg-surface p-6 shadow-[6px_6px_0_var(--accent)] sm:flex-row sm:items-center sm:justify-between sm:p-8",
        className,
      )}
    >
      <div className="flex items-start gap-4">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[3px] border-2 border-ink bg-white">
          <GoogleG className="h-6 w-6" />
        </span>
        <div>
          <p className="mono-label text-[11px] font-bold text-accent">Read us first on Google</p>
          <h3 className="mt-1 font-display text-xl font-bold text-ink">
            Add {siteConfig.companyName} as a preferred source.
          </h3>
          <p className="mt-1 max-w-md text-sm text-[color:var(--muted-on-light)]">
            Get our campus-marketing insights surfaced first in Google&apos;s Top Stories and AI
            results. One click adds us to your preferred sources.
          </p>
        </div>
      </div>
      <a
        href={DEEPLINK}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex shrink-0 items-center gap-2 rounded-[3px] border-2 border-ink bg-[color:var(--accent-2)] px-5 py-3 font-display text-sm font-bold text-ink shadow-[4px_4px_0_var(--ink)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_var(--ink)]"
      >
        Add on Google
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </a>
    </div>
  );
}

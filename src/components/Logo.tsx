import Link from "next/link";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";

/**
 * Wordmark rendering COMPANY_NAME in the display typeface.
 * Swap the inner markup for an <svg> logo later — the API stays the same.
 */
export function Logo({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label={`${siteConfig.companyName} — home`}
      className={cn(
        "group inline-flex items-center gap-2 font-display text-lg font-bold tracking-tight",
        onDark ? "text-white" : "text-ink",
        className,
      )}
    >
      <span
        aria-hidden
        className="inline-block h-2.5 w-2.5 rounded-full bg-accent transition-transform duration-200 group-hover:scale-125"
      />
      <span className="whitespace-nowrap">{siteConfig.companyName}</span>
    </Link>
  );
}

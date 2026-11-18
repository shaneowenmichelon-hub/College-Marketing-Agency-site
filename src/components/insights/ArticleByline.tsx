import { resolveArticleAuthor } from "@/lib/seo";
import { formatDate } from "@/lib/content";
import { siteConfig } from "@/site.config";

/**
 * Visible insight byline. The default is Shane Michelon, Founder, linking
 * only to his LinkedIn profile. A non-default frontmatter author is the name
 * alone, with no invented title or profile.
 *
 * When `dateModified` is later than `date`, the updated line uses that same
 * ISO value as Article JSON-LD `dateModified`.
 */
export function ArticleByline({
  author,
  date,
  dateModified,
  showAuthor = true,
  tone = "light",
}: {
  author?: string;
  date?: string;
  dateModified?: string;
  showAuthor?: boolean;
  tone?: "light" | "dark";
}) {
  const resolved = resolveArticleAuthor(author);
  const showUpdated = Boolean(date && dateModified && dateModified > date);
  if (!showAuthor && !date) return null;
  const nameClass = tone === "dark" ? "text-white" : "text-ink";
  const mutedClass = tone === "dark" ? "text-white/80" : "text-[color:var(--muted-on-light)]";
  const linkClass =
    tone === "dark"
      ? "underline decoration-white/40 underline-offset-2 hover:text-white"
      : "underline decoration-ink/40 underline-offset-2 hover:text-accent";

  return (
    <div className="mt-4 text-sm">
      {showAuthor ? (
        <>
          <p className={`font-medium ${nameClass}`}>
            By{" "}
            {resolved.linkedIn ? (
              <a href={resolved.linkedIn} rel="author noopener" target="_blank" className={linkClass}>
                {resolved.name}
              </a>
            ) : (
              resolved.name
            )}
          </p>
          {resolved.jobTitle ? (
            <p className={`mt-1 font-normal ${mutedClass}`}>
              {resolved.jobTitle}, {siteConfig.companyName}
            </p>
          ) : null}
        </>
      ) : null}
      {date ? (
        <p className={`${showAuthor ? "mt-2" : ""} font-normal ${mutedClass}`}>
          <time dateTime={date}>{formatDate(date)}</time>
          {showUpdated ? (
            <>
              <span aria-hidden="true"> · </span>
              <time dateTime={dateModified}>{`Updated ${formatDate(dateModified!)}`}</time>
            </>
          ) : null}
        </p>
      ) : null}
    </div>
  );
}

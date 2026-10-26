import { resolveArticleAuthor } from "@/lib/seo";
import { siteConfig } from "@/site.config";

/**
 * Visible insight byline. The default is Shane Michelon, Founder, linking
 * only to his LinkedIn profile. A non-default frontmatter author is the name
 * alone, with no invented title or profile.
 */
export function ArticleByline({ author }: { author?: string }) {
  const resolved = resolveArticleAuthor(author);
  return (
    <div className="mt-4 text-sm">
      <p className="font-medium text-ink">
        By{" "}
        {resolved.linkedIn ? (
          <a
            href={resolved.linkedIn}
            rel="author noopener"
            target="_blank"
            className="underline decoration-ink/40 underline-offset-2 hover:text-accent"
          >
            {resolved.name}
          </a>
        ) : (
          resolved.name
        )}
      </p>
      {resolved.jobTitle ? (
        <p className="mt-1 font-normal text-[color:var(--muted-on-light)]">
          {resolved.jobTitle}, {siteConfig.companyName}
        </p>
      ) : null}
    </div>
  );
}

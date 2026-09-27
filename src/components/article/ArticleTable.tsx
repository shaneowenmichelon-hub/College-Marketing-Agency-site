import type { ArticleTableBlock } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Renders an article data table as real, semantic HTML.
 *
 * Deliberately a true <table> — never an image, never a grid of <div>s. That
 * is what makes the data extractable: a scraper, a screen reader, an LLM or a
 * spreadsheet paste all read the same structure, and the content stays
 * selectable, searchable and translatable.
 *
 * What earns each piece of markup here:
 *   <caption>    names the table for anyone who can't see its surroundings
 *   <thead>/<th scope="col">  binds every cell to its column heading
 *   <th scope="row">          the first column is the row's label, not data
 *   role/aria/tabIndex on the scroller  keeps it reachable by keyboard when it
 *                                       overflows on a narrow screen
 *
 * Horizontal scroll is the deliberate mobile strategy. Collapsing a table into
 * stacked cards reads better on a phone but destroys the row/column
 * relationships, which is exactly the thing that must survive.
 */
export function ArticleTable({ block, className }: { block: ArticleTableBlock; className?: string }) {
  const { caption, columns, rows, align } = block;
  if (!columns.length) return null;

  const alignClass = (i: number) =>
    align?.[i] === "center" ? "text-center" : align?.[i] === "right" ? "text-right" : "text-left";

  return (
    <figure className={cn("not-prose my-8", className)}>
      <div
        className="overflow-x-auto rounded-[3px] border-2 border-ink shadow-[5px_5px_0_var(--ink)]"
        // Scrollable regions need to be focusable, or keyboard users can't
        // reach the columns that are off screen.
        tabIndex={0}
        role="region"
        aria-label={caption ?? "Data table"}
      >
        <table className="w-full border-collapse bg-white text-left text-sm">
          {caption && (
            <caption className="mono-label border-b-2 border-ink bg-[color:var(--accent-2)] px-4 py-2.5 text-left text-[11px] font-bold text-ink">
              {caption}
            </caption>
          )}
          <thead>
            <tr className="border-b-2 border-ink bg-ink">
              {columns.map((col, i) => (
                <th
                  key={i}
                  scope="col"
                  className={cn(
                    "mono-label whitespace-nowrap px-4 py-3 text-[11px] font-bold text-[color:var(--accent-2)]",
                    alignClass(i),
                  )}
                  dangerouslySetInnerHTML={{ __html: col }}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, r) => (
              <tr
                key={r}
                className={cn(
                  "border-b border-[color:var(--border-on-light)] last:border-b-0",
                  r % 2 === 1 && "bg-[color:var(--surface-muted)]",
                )}
              >
                {row.map((cell, c) =>
                  c === 0 ? (
                    <th
                      key={c}
                      scope="row"
                      className={cn(
                        "px-4 py-3 align-top font-semibold text-ink",
                        alignClass(c),
                      )}
                      dangerouslySetInnerHTML={{ __html: cell }}
                    />
                  ) : (
                    <td
                      key={c}
                      className={cn(
                        "px-4 py-3 align-top leading-relaxed text-[color:var(--muted-on-light)]",
                        alignClass(c),
                      )}
                      dangerouslySetInnerHTML={{ __html: cell }}
                    />
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </figure>
  );
}

import Link from "next/link";
import type { CopyBlock } from "@/lib/indexable-pages";
import { cn } from "@/lib/utils";

const linkClass =
  "font-semibold text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent";

/** Server-rendered prose. The same blocks feed the word-count check. */
export function CopyBlocks({
  blocks,
  className = "max-w-3xl",
}: {
  blocks: CopyBlock[];
  className?: string;
}) {
  return (
    <div
      className={cn(
        "space-y-4 text-base leading-relaxed text-[color:var(--muted-on-light)] sm:text-lg",
        className,
      )}
    >
      {blocks.map((block, index) => {
        if (block.type === "h2") {
          return (
            <h2 key={index} className="pt-2 font-display text-2xl font-bold text-ink sm:text-3xl">
              {block.text}
            </h2>
          );
        }
        return (
          <p key={index}>
            {block.parts.map((part, partIndex) =>
              part.href ? (
                <Link key={partIndex} href={part.href} className={linkClass}>
                  {part.text}
                </Link>
              ) : (
                <span key={partIndex}>{part.text}</span>
              ),
            )}
          </p>
        );
      })}
    </div>
  );
}

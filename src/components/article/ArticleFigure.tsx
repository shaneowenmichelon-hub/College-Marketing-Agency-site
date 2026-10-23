import Image from "next/image";
import type { ArticleFigureBlock } from "@/lib/content";

/**
 * An owned activation photograph inside an article.
 * Width and height are the file's intrinsic pixels, read when the markdown
 * is parsed, so layout and social metadata are not a guessed 1200×630.
 */
export function ArticleFigure({ block }: { block: ArticleFigureBlock }) {
  return (
    <figure className="my-2">
      <Image
        src={block.src}
        alt={block.alt}
        width={block.width}
        height={block.height}
        sizes="(min-width: 768px) 720px, 100vw"
        className="h-auto w-full border-2 border-ink object-cover"
        style={{ width: "100%", height: "auto" }}
      />
      {block.caption ? (
        <figcaption className="mt-2 text-xs leading-relaxed text-[color:var(--muted-on-light)]">
          {block.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

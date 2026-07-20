import Link from "next/link";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { formatDate, type Post } from "@/lib/content";

/** Compact insight cards, used on service pages under "Related insights". */
export function RelatedInsights({ posts }: { posts: Post[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {posts.map((p, i) => (
        <Reveal key={p.slug} delay={i * 0.08}>
          <Link
            href={`/insights/${p.slug}`}
            className="group flex h-full flex-col rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-soft-lg"
          >
            <div className="flex items-center gap-3 text-xs text-[color:var(--muted-on-light)]">
              <Badge>{p.category}</Badge>
              <span>{formatDate(p.date)}</span>
            </div>
            <h3 className="mt-4 font-display text-lg font-bold text-ink group-hover:text-accent">
              {p.title}
            </h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-[color:var(--muted-on-light)]">
              {p.excerpt}
            </p>
            <span className="mt-4 text-xs font-medium text-[color:var(--muted-on-light)]">
              {p.readingTime}
            </span>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

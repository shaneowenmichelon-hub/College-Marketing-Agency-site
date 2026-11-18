/**
 * Answer-first summary under the excerpt and byline.
 * Plain text, one existing ink border, no extra color.
 */
export function ArticleShortAnswer({ text }: { text: string }) {
  return (
    <div className="mt-6 border-l-2 border-ink/30 pl-4">
      <p className="mono-label text-[11px] font-bold text-ink">Short answer</p>
      <p className="mt-2 text-base leading-relaxed text-[color:var(--muted-on-light)]">{text}</p>
    </div>
  );
}

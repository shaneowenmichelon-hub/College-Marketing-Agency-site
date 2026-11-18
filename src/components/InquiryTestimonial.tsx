import { testimonials, type Testimonial } from "@/site.config";
import { cn } from "@/lib/utils";

/**
 * The homepage marquee's lead quote, shown once beside an inquiry submit.
 * Text, name, and title come only from `testimonials` — never a new line,
 * rating, or client.
 */
export function inquiryTestimonial(): Testimonial | undefined {
  const troy = testimonials.find((item) => item.name === "Troy Osinoff" && item.quote.trim().length > 0);
  if (troy) return troy;
  return testimonials.find((item) => item.quote.trim().length > 0);
}

export function InquiryTestimonial({ className }: { className?: string }) {
  const quote = inquiryTestimonial();
  if (!quote) return null;

  return (
    <figure className={cn("rounded-[4px] border-2 border-ink bg-surface p-5", className)}>
      <blockquote className="text-sm font-medium leading-relaxed text-ink">{quote.quote}</blockquote>
      <figcaption className="mt-3 border-t-2 border-ink/10 pt-3">
        <div className="font-display text-sm font-bold text-ink">{quote.name}</div>
        <div className="mono-label mt-1 text-[10px] text-[color:var(--muted-on-light)]">{quote.title}</div>
      </figcaption>
    </figure>
  );
}

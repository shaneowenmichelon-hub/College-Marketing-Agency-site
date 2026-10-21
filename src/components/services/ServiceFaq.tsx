import Link from "next/link";
import {
  faqPageStructuredData,
  type ServiceFaq as ServiceFaqItem,
  type ServiceReading as ServiceReadingCopy,
} from "@/lib/service-faqs";

const linkClass =
  "font-semibold text-accent underline decoration-accent/30 underline-offset-2 hover:decoration-accent";

/**
 * FAQPage schema from the same `items` the visible FAQ renders.
 * Kept beside Service and Breadcrumb JSON-LD, not in place of them.
 * Lives here, not in the root JSON-LD module, so the layout does not load blog files.
 */
export function FaqPageJsonLd({ items, path }: { items: ServiceFaqItem[]; path: string }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageStructuredData(items, path)) }}
    />
  );
}

/** Always-visible FAQ. The same `items` array is passed to FAQPage JSON-LD. */
export function ServiceFaq({ items }: { items: ServiceFaqItem[] }) {
  return (
    <dl className="mt-12 divide-y divide-[color:var(--border-on-light)] rounded-2xl border border-[color:var(--border-on-light)] bg-surface">
      {items.map((item) => (
        <div key={item.question} className="px-5 py-5 sm:px-6 sm:py-6">
          <dt>
            <h3 className="font-display text-lg font-bold text-ink">{item.question}</h3>
          </dt>
          <dd className="mt-2 text-base leading-relaxed text-[color:var(--muted-on-light)]">
            {item.answer}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** Indexable copy and internal links rendered directly above the FAQ. */
export function ServiceReading({ reading }: { reading: ServiceReadingCopy }) {
  return (
    <div className="mt-8 max-w-3xl space-y-4 text-base leading-relaxed text-[color:var(--muted-on-light)] sm:text-lg">
      {reading.blocks.map((block, index) => (
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
      ))}
    </div>
  );
}

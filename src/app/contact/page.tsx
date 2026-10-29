import Image from "next/image";
import { Mail, MapPin } from "lucide-react";
import { siteConfig, clients, sitePhotos } from "@/site.config";
import { pageMetadata } from "@/lib/seo";
import {
  CONTACT_DESCRIPTION,
  CONTACT_FAQ_TITLE,
  CONTACT_H1,
  CONTACT_TITLE,
  contactBody,
  contactFaqs,
  contactLead,
} from "@/lib/indexable-pages";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { ContactForm } from "@/components/forms/ContactForm";
import { ClientMarquee } from "@/components/ClientMarquee";
import { RotatingReview } from "@/components/RotatingReview";
import { SectionHeading } from "@/components/SectionHeading";
import { BreadcrumbJsonLd } from "@/components/seo/JsonLd";
import { CopyBlocks } from "@/components/seo/CopyBlocks";
import { FaqPageJsonLd, ServiceFaq } from "@/components/services/ServiceFaq";

export const metadata = pageMetadata({
  title: CONTACT_TITLE,
  description: CONTACT_DESCRIPTION,
  path: "/contact",
});

/** Lead activation photo for the left column (first entry in the shared set). */
const leadPhoto = sitePhotos[0];

export default function ContactPage() {
  const faqs = contactFaqs();
  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
      />
      <FaqPageJsonLd items={faqs} path="/contact" />
    <Section tone="muted">
      {/*
        `[&>*]:min-w-0` is load-bearing, not tidying. A grid item defaults to
        `min-width: auto`, so a column cannot shrink below the min-content
        width of what is inside it. This column holds a logo marquee and a
        photo, both capped at `max-w-md`, and that cap (448px) became the
        column's FLOOR — so on every phone the column stayed 448px wide inside
        a ~350px content box and the h1, the lead copy, the photo and the whole
        form were clipped by the section's `overflow-hidden`, with no way to
        scroll to them. Letting the items shrink is what lets the column track
        the viewport.
      */}
      <div className="grid gap-12 [&>*]:min-w-0 lg:grid-cols-2">
        {/* Left: pitch + info */}
        <Reveal>
          <Badge className="mb-4">Book a Call</Badge>
          <h1 className="text-balance font-display text-4xl font-bold leading-[1.05] text-ink sm:text-5xl">
            {CONTACT_H1}
          </h1>
          <CopyBlocks blocks={[contactLead()]} className="mt-4 max-w-md" />

          {/* Real activation photo: sits left of the form on desktop, above it on mobile */}
          <figure className="mt-8 max-w-md">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[3px] border-2 border-ink shadow-[8px_8px_0_var(--ink)]">
              <Image
                src={leadPhoto.src}
                alt={leadPhoto.alt}
                fill
                sizes="(min-width: 1024px) 28rem, 100vw"
                className="object-cover object-[50%_32%]"
                priority
              />
            </div>
          </figure>

          {/* Social proof: brands + a review, on the form's left side */}
          <div className="mt-8 max-w-md">
            <p className="mono-label text-[11px] font-bold text-[color:var(--muted-on-light)]">
              Trusted by brands like
            </p>
            <div className="mt-3">
              <ClientMarquee clients={clients} />
            </div>
            <RotatingReview />
          </div>

          <dl className="mt-10 space-y-5">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Mail className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[color:var(--muted-on-light)]">
                  Email
                </dt>
                <dd className="text-sm font-medium text-ink">{siteConfig.contact.email}</dd>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <MapPin className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[color:var(--muted-on-light)]">
                  Based in
                </dt>
                <dd className="text-sm font-medium text-ink">{siteConfig.contact.location}</dd>
              </div>
            </div>
          </dl>

          {/* Offices */}
          <div className="mt-10">
            <p className="text-xs uppercase tracking-wide text-[color:var(--muted-on-light)]">
              Offices
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              {siteConfig.offices.map((office) => (
                <div
                  key={office.name}
                  className="rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-4 shadow-soft"
                >
                  <p className="font-display text-base font-bold text-ink">{office.name}</p>
                  <p className="mt-1 text-sm text-[color:var(--muted-on-light)]">
                    {office.address}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {siteConfig.showCredibility && (
            <p className="mt-10 max-w-sm text-sm text-[color:var(--muted-on-light)]">
              {siteConfig.credibilityLine}
            </p>
          )}
        </Reveal>

        {/* Right: form */}
        <Reveal delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </Section>

    <Section tone="light">
      <CopyBlocks blocks={contactBody()} />
    </Section>

    <Section id="faq" tone="muted" className="scroll-mt-24">
      <SectionHeading as="h2" eyebrow="FAQ" title={CONTACT_FAQ_TITLE} />
      <ServiceFaq items={faqs} />
    </Section>
    </>
  );
}

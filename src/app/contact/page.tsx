import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/site.config";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Badge } from "@/components/ui/Badge";
import { ContactForm } from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact - Let's reach students together",
  description:
    "Tell us what you're launching and we'll build a plan to put it in front of the right campuses through events, brand ambassadors, and product placement.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <Section tone="muted">
      <div className="grid gap-12 lg:grid-cols-2">
        {/* Left: pitch + info */}
        <Reveal>
          <Badge className="mb-4">Get Started</Badge>
          <h1 className="text-balance font-display text-4xl font-bold leading-[1.05] text-ink sm:text-5xl">
            Let&apos;s put your brand on campus.
          </h1>
          <p className="mt-4 max-w-md text-lg text-[color:var(--muted-on-light)]">
            Tell us your goal and we&apos;ll come back with a plan across events, brand
            ambassadors, and product placement - mapped to the campuses that matter for you.
          </p>

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
                <Phone className="h-5 w-5" aria-hidden />
              </span>
              <div>
                <dt className="text-xs uppercase tracking-wide text-[color:var(--muted-on-light)]">
                  Phone
                </dt>
                <dd className="text-sm font-medium text-ink">{siteConfig.contact.phone}</dd>
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

          {/* Offices - click-to-call */}
          <div className="mt-10">
            <h2 className="text-xs uppercase tracking-wide text-[color:var(--muted-on-light)]">
              Offices
            </h2>
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
                  <a
                    href={`tel:${office.phone.replace(/[^\d+]/g, "")}`}
                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
                  >
                    <Phone className="h-4 w-4" aria-hidden /> {office.phone}
                  </a>
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
  );
}

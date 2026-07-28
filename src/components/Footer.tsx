import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { siteConfig } from "@/site.config";
import { Container } from "./ui/Container";
import { Logo } from "./Logo";

const legal = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
];

export function Footer() {
  const year = 2026; // static to avoid hydration drift; bump as needed.
  return (
    <footer className="grain relative overflow-hidden bg-ink text-[color:var(--text-on-dark)]">
      <Container className="relative py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand + credibility */}
          <div className="lg:col-span-1">
            <Logo onDark />
            <p className="mt-4 max-w-xs text-sm text-[color:var(--muted-on-dark)]">
              {siteConfig.description}
            </p>
            {siteConfig.showCredibility && (
              <p className="mt-4 text-xs text-[color:var(--muted-on-dark)]">
                {siteConfig.credibilityLine}
              </p>
            )}
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold text-white">Services</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/services#for-brands"
                  className="text-[color:var(--muted-on-dark)] transition-colors hover:text-white"
                >
                  For Brands
                </Link>
              </li>
              <li>
                <Link
                  href="/services#for-students"
                  className="text-[color:var(--muted-on-dark)] transition-colors hover:text-white"
                >
                  For Students
                </Link>
              </li>
              {siteConfig.services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={s.href}
                    className="text-[color:var(--muted-on-dark)] transition-colors hover:text-white"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white">Company</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link href="/work" className="text-[color:var(--muted-on-dark)] hover:text-white">
                  Work
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-[color:var(--muted-on-dark)] hover:text-white">
                  About
                </Link>
              </li>
              <li>
                <Link href="/insights" className="text-[color:var(--muted-on-dark)] hover:text-white">
                  Insights
                </Link>
              </li>
              <li>
                <Link
                  href="/become-an-ambassador"
                  className="text-[color:var(--muted-on-dark)] hover:text-white"
                >
                  Become an Ambassador
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white">Contact</h3>
            <ul className="mt-4 space-y-2.5 text-sm text-[color:var(--muted-on-dark)]">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" aria-hidden />
                <span>{siteConfig.contact.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" aria-hidden />
                <span>{siteConfig.contact.phone}</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                <span>{siteConfig.contact.location}</span>
              </li>
            </ul>
            <ul className="mt-5 flex flex-wrap gap-3 text-sm">
              {siteConfig.socials.map((s) => (
                <li key={s.label}>
                  {s.href ? (
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[color:var(--muted-on-dark)] underline-offset-4 hover:text-white hover:underline"
                    >
                      {s.label}
                    </a>
                  ) : (
                    <span
                      className="cursor-default text-[color:var(--muted-on-dark)]/70"
                      title="Add link in site.config.ts"
                    >
                      {s.label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-[color:var(--border-on-dark)] pt-6 text-xs text-[color:var(--muted-on-dark)] sm:flex-row sm:items-center">
          <p>
            © {year} {siteConfig.companyName}. All rights reserved.
          </p>
          <ul className="flex gap-5">
            {legal.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="hover:text-white">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}

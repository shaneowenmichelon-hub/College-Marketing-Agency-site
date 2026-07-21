"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, Menu, X } from "lucide-react";
import { siteConfig } from "@/site.config";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { Button } from "./ui/Button";

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menus on route change.
  useEffect(() => {
    setMobileOpen(false);
    setServicesOpen(false);
  }, [pathname]);

  // Lock body scroll when the mobile drawer is open.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b-2 border-ink bg-white/90 backdrop-blur-xl"
          : "border-b-2 border-transparent bg-white/40 backdrop-blur-md",
      )}
    >
      <nav
        aria-label="Primary"
        className={cn(
          "mx-auto flex max-w-container items-center justify-between px-5 transition-all duration-300 sm:px-6 lg:px-8",
          scrolled ? "h-14" : "h-16 lg:h-20",
        )}
      >
        <Logo />

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {siteConfig.nav.map((item) =>
            item.children ? (
              <li
                key={item.label}
                className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button
                  type="button"
                  aria-expanded={servicesOpen}
                  aria-haspopup="true"
                  onClick={() => setServicesOpen((v) => !v)}
                  className={cn(
                    "flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    pathname.startsWith("/services")
                      ? "text-accent"
                      : "text-ink/80 hover:text-ink",
                  )}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 transition-transform",
                      servicesOpen && "rotate-180",
                    )}
                  />
                </button>
                {servicesOpen && (
                  <div className="absolute left-0 top-full w-72 pt-2">
                    <div className="overflow-hidden rounded-2xl border border-[color:var(--border-on-light)] bg-white p-2 shadow-soft-lg">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-surface-muted"
                        >
                          <span className="block text-sm font-semibold text-ink">
                            {child.label}
                          </span>
                          {child.description && (
                            <span className="mt-0.5 block text-xs text-[color:var(--muted-on-light)]">
                              {child.description}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </li>
            ) : (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className={cn(
                    "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                    isActive(item.href) ? "text-accent" : "text-ink/80 hover:text-ink",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>

        {/* Desktop CTAs */}
        <div className="hidden items-center gap-2 lg:flex">
          <Button href="/become-an-ambassador" variant="secondary" size="sm">
            Become an Ambassador
          </Button>
          <Button href="/contact" variant="primary" size="sm">
            Get Started
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-full text-ink lg:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-x-0 bottom-0 top-14 z-40 overflow-y-auto bg-white lg:hidden">
          <div className="space-y-1 px-5 py-6 sm:px-6">
            {siteConfig.nav.map((item) =>
              item.children ? (
                <div key={item.label} className="py-1">
                  <p className="px-3 pb-1 pt-3 text-xs font-semibold uppercase tracking-wide text-[color:var(--muted-on-light)]">
                    {item.label}
                  </p>
                  {item.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      className="block rounded-xl px-3 py-3 text-base font-medium text-ink hover:bg-surface-muted"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "block rounded-xl px-3 py-3 text-base font-medium hover:bg-surface-muted",
                    isActive(item.href) ? "text-accent" : "text-ink",
                  )}
                >
                  {item.label}
                </Link>
              ),
            )}
            <div className="flex flex-col gap-3 pt-6">
              <Button href="/become-an-ambassador" variant="secondary" size="lg">
                Become an Ambassador
              </Button>
              <Button href="/contact" variant="primary" size="lg">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

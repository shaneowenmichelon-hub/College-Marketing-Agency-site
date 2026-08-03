"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Briefcase, LogOut } from "lucide-react";
import { siteConfig } from "@/site.config";
import { getSession, clearSession } from "@/lib/portal";
import { Container } from "@/components/ui/Container";

/**
 * Guards a portal page: redirects to /portal if there's no client session.
 * Prototype gate only - see src/lib/portal.ts TODO for real per-user auth.
 */
export function PortalShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.replace("/portal");
      return;
    }
    setEmail(session);
    setReady(true);
  }, [router]);

  if (!ready) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <span className="mono-label text-xs text-[color:var(--muted-on-light)]">Loading…</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted">
      <header className="border-b-2 border-ink bg-white">
        <Container className="flex h-16 items-center justify-between">
          <Link href="/portal/jobs" className="flex items-center gap-2 font-display font-bold text-ink">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-[3px] border-2 border-ink bg-accent text-white">
              <Briefcase className="h-4 w-4" />
            </span>
            <span className="hidden sm:inline">{siteConfig.companyName}</span> Ambassador Portal
          </Link>
          <div className="flex items-center gap-3">
            <span className="mono-label hidden text-[10px] text-[color:var(--muted-on-light)] sm:inline">
              {email}
            </span>
            <button
              type="button"
              onClick={() => {
                clearSession();
                router.replace("/portal");
              }}
              className="mono-label inline-flex items-center gap-1.5 rounded-[3px] border-2 border-ink bg-white px-3 py-1.5 text-[10px] font-bold text-ink hover:bg-surface-muted"
            >
              <LogOut className="h-3.5 w-3.5" /> Log out
            </button>
          </div>
        </Container>
      </header>
      <Container className="py-10">{children}</Container>
    </div>
  );
}

/** Read the current portal session email in a client page. */
export function usePortalEmail(): string | null {
  const [email, setEmail] = useState<string | null>(null);
  useEffect(() => setEmail(getSession()), []);
  return email;
}

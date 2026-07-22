"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Loader2, Lock } from "lucide-react";
import { siteConfig } from "@/site.config";
import { isEduEmail } from "@/lib/utils";
import { getSession, setSession } from "@/lib/portal";
import { Container } from "@/components/ui/Container";
import { FormField, Input } from "@/components/form/Fields";

export default function PortalLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getSession()) router.replace("/portal/jobs");
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isEduEmail(email)) {
      setError("Use your .edu school email.");
      return;
    }
    setError(undefined);
    setLoading(true);
    try {
      const res = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error || "Login failed.");
        setLoading(false);
        return;
      }
      setSession(email.trim());
      router.replace("/portal/jobs");
    } catch {
      setError("Something went wrong. Try again.");
      setLoading(false);
    }
  }

  return (
    <div className="grain relative flex min-h-screen items-center justify-center bg-ink py-16">
      <div aria-hidden className="mesh pointer-events-none absolute inset-0" />
      <Container className="relative max-w-md">
        <div className="rounded-[4px] border-2 border-white bg-white p-8 shadow-[8px_8px_0_var(--accent)]">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-ink bg-accent text-white">
            <Lock className="h-5 w-5" />
          </span>
          <h1 className="mt-5 font-display text-3xl font-bold text-ink">Ambassador Portal</h1>
          <p className="mt-2 text-sm text-[color:var(--muted-on-light)]">
            Approved ambassadors only. Sign in with your school email and the access code we
            sent you.
          </p>

          <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
            <FormField label="School email (.edu)" htmlFor="p-email" required>
              <Input
                id="p-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@school.edu"
              />
            </FormField>
            <FormField label="Access code" htmlFor="p-code" required>
              <Input
                id="p-code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Enter your access code"
              />
            </FormField>
            {error && (
              <p className="text-xs font-medium text-red-500" role="alert">
                {error}
              </p>
            )}
            <button
              type="submit"
              disabled={loading}
              className="brutal-press inline-flex h-12 w-full items-center justify-center gap-2 rounded-[3px] border-2 border-ink bg-accent text-sm font-bold uppercase tracking-wide text-white shadow-[4px_4px_0_var(--ink)] disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  <KeyRound className="h-4 w-4" /> Enter portal
                </>
              )}
            </button>
          </form>

          <p className="mono-label mt-5 text-[10px] leading-relaxed text-[color:var(--muted-on-light)]">
            Not an ambassador yet?{" "}
            <a href="/become-an-ambassador" className="text-accent underline">
              Apply here
            </a>
            . Prototype access — shared code, not individual login.
          </p>
        </div>
        <p className="mono-label mt-4 text-center text-[10px] text-white/60">
          {siteConfig.companyName}
        </p>
      </Container>
    </div>
  );
}

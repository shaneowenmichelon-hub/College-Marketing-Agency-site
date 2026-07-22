"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Banknote, Check, Gift, Loader2, Users } from "lucide-react";
import { getJob } from "@/site.config";
import { ONE_JOB_AT_A_TIME } from "@/site.config";
import {
  getPortalState,
  getSession,
  signUpForJob,
  displaySlotsFilled,
  isFull,
  type PortalState,
} from "@/lib/portal";
import { PortalShell } from "@/components/portal/PortalShell";

export default function JobDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const job = getJob(params.slug);

  const [state, setState] = useState<PortalState | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "signed" | "error">("idle");
  useEffect(() => setState(getPortalState()), []);

  if (!job) {
    return (
      <PortalShell>
        <p className="text-sm text-ink">Job not found. <Link href="/portal/jobs" className="text-accent underline">Back to jobs</Link>.</p>
      </PortalShell>
    );
  }

  const s = state ?? { activeJob: null, signedUp: [], submitted: [] };
  const mine = s.signedUp.includes(job.slug);
  const full = isFull(job, s);
  const blockedByActive = ONE_JOB_AT_A_TIME && !!s.activeJob && s.activeJob !== job.slug;

  async function handleSignup() {
    if (!job) return;
    setStatus("loading");
    try {
      const email = getSession();
      await fetch("/api/portal/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, slug: job.slug }),
      });
      setState(signUpForJob(job.slug));
      setStatus("signed");
    } catch {
      setStatus("error");
    }
  }

  return (
    <PortalShell>
      <Link href="/portal/jobs" className="mono-label inline-flex items-center gap-1.5 text-[11px] font-bold text-accent">
        <ArrowLeft className="h-4 w-4" /> All jobs
      </Link>

      <div className="mt-5 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        {/* Brief */}
        <div>
          <p className="mono-label text-[11px] font-bold text-[color:var(--muted-on-light)]">{job.brand}</p>
          <h1 className="font-display text-display-sm font-bold text-ink">{job.title}</h1>
          <p className="mt-3 text-[color:var(--muted-on-light)]">{job.description}</p>

          <Block title="What you'll do">
            <ul className="space-y-2">
              {job.requirements.map((r) => (
                <li key={r} className="flex items-start gap-2 text-sm text-ink">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden /> {r}
                </li>
              ))}
            </ul>
          </Block>

          <Block title="Deliverables to submit for payout">
            <ul className="space-y-2">
              {job.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-ink">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden /> {d}
                </li>
              ))}
            </ul>
          </Block>

          <div className="mono-label mt-6 flex flex-wrap gap-2 text-[10px]">
            <Chip icon={<Banknote className="h-3 w-3" />}>{job.compensation.cash}</Chip>
            <Chip icon={<Gift className="h-3 w-3" />}>{job.compensation.product}</Chip>
            <Chip icon={<Users className="h-3 w-3" />}>
              {displaySlotsFilled(job, s)}/{job.slotsTotal} filled
            </Chip>
            <Chip>Deadline: {job.deadline}</Chip>
          </div>
        </div>

        {/* Signup card */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[3px] border-2 border-ink bg-white p-6 shadow-[6px_6px_0_var(--accent)]">
            {mine || status === "signed" ? (
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-ink bg-[color:var(--accent-2)] text-ink">
                  <Check className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-display text-xl font-bold text-ink">You&apos;re signed up.</h2>
                <p className="mt-2 text-sm text-[color:var(--muted-on-light)]">
                  Instructions are above — do the work, then submit your proof when you&apos;re done.
                </p>
                <Link
                  href={`/portal/submit/${job.slug}`}
                  className="mono-label mt-5 inline-flex w-full items-center justify-center gap-1.5 rounded-[3px] border-2 border-ink bg-accent px-4 py-3 text-[11px] font-bold text-white shadow-[3px_3px_0_var(--ink)]"
                >
                  Submit proof of completion <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : full ? (
              <p className="text-sm font-bold text-ink">This job is full — all slots are taken.</p>
            ) : blockedByActive ? (
              <div>
                <h2 className="font-display text-lg font-bold text-ink">One job at a time</h2>
                <p className="mt-2 text-sm text-[color:var(--muted-on-light)]">
                  You already have an active job. Finish and submit it before signing up for a
                  new one.
                </p>
                <Link
                  href="/portal/my-job"
                  className="mono-label mt-4 inline-flex items-center gap-1.5 text-[11px] font-bold text-accent"
                >
                  Go to my active job <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div>
                <h2 className="font-display text-xl font-bold text-ink">Sign up for this job</h2>
                <p className="mt-2 text-sm text-[color:var(--muted-on-light)]">
                  You&apos;ll get instructions here and submit proof when you&apos;re done.
                </p>
                <button
                  type="button"
                  onClick={handleSignup}
                  disabled={status === "loading"}
                  className="brutal-press mt-5 inline-flex w-full items-center justify-center gap-2 rounded-[3px] border-2 border-ink bg-accent px-4 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[4px_4px_0_var(--ink)] disabled:opacity-60"
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Signing up…
                    </>
                  ) : (
                    "Sign up for this job"
                  )}
                </button>
                {status === "error" && (
                  <p className="mt-3 text-xs font-medium text-red-500" role="alert">
                    Something went wrong — you&apos;re signed up locally; please tell us if you
                    don&apos;t hear back.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PortalShell>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-6 rounded-[3px] border-2 border-ink bg-white p-5">
      <h2 className="mono-label text-[11px] font-bold text-accent">{title}</h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function Chip({ icon, children }: { icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-[2px] border-2 border-ink px-2 py-0.5 text-ink">
      {icon}
      {children}
    </span>
  );
}

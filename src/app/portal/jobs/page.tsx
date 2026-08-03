"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Banknote, Gift, Users } from "lucide-react";
import { jobs, type Job } from "@/site.config";
import { cn } from "@/lib/utils";
import { getPortalState, displaySlotsFilled, isFull, type PortalState } from "@/lib/portal";
import { PortalShell } from "@/components/portal/PortalShell";

export default function JobsBoardPage() {
  const [state, setState] = useState<PortalState | null>(null);
  useEffect(() => setState(getPortalState()), []);

  return (
    <PortalShell>
      <div className="flex flex-col gap-1">
        <p className="mono-label text-xs font-bold text-accent">Job board</p>
        <h1 className="font-display text-display-sm font-bold text-ink">Open campus jobs</h1>
        <p className="mt-1 max-w-2xl text-sm text-[color:var(--muted-on-light)]">
          Pick a gig, sign up, do the work, and submit your proof to get paid. You can hold one
          active job at a time.
        </p>
      </div>

      {state?.activeJob && (
        <div className="mt-6 flex flex-col items-start gap-2 rounded-[3px] border-2 border-ink bg-[color:var(--accent-2)] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm font-bold text-ink">You have an active job in progress.</p>
          <Link
            href="/portal/my-job"
            className="mono-label inline-flex items-center gap-1.5 rounded-[3px] border-2 border-ink bg-white px-3 py-1.5 text-[10px] font-bold text-ink"
          >
            View my job <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      )}

      <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job.slug} job={job} state={state} />
        ))}
      </div>
    </PortalShell>
  );
}

function JobCard({ job, state }: { job: Job; state: PortalState | null }) {
  const s = state ?? { activeJob: null, signedUp: [], submitted: [] };
  const filled = displaySlotsFilled(job, s);
  const full = isFull(job, s);
  const mine = s.signedUp.includes(job.slug);

  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-[3px] border-2 border-ink bg-white p-5 shadow-[5px_5px_0_var(--ink)]",
        full && !mine && "opacity-60",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="mono-label rounded-[2px] border-2 border-ink bg-[color:var(--accent-2)] px-2 py-0.5 text-[9px] font-bold text-ink">
          {job.category}
        </span>
        <span
          className={cn(
            "mono-label flex items-center gap-1 rounded-[2px] border-2 px-2 py-0.5 text-[9px] font-bold",
            full ? "border-red-500 text-red-500" : "border-ink text-ink",
          )}
        >
          <Users className="h-3 w-3" /> {filled}/{job.slotsTotal} filled
        </span>
      </div>

      <p className="mono-label mt-3 text-[10px] font-bold text-[color:var(--muted-on-light)]">
        {job.brand}
      </p>
      <h2 className="font-display text-lg font-bold text-ink">{job.title}</h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[color:var(--muted-on-light)]">
        {job.description}
      </p>

      <div className="mono-label mt-4 flex flex-wrap gap-2 text-[10px]">
        <span className="inline-flex items-center gap-1 rounded-[2px] border-2 border-ink px-2 py-0.5 text-ink">
          <Banknote className="h-3 w-3" /> {job.compensation.cash}
        </span>
        <span className="inline-flex items-center gap-1 rounded-[2px] border-2 border-ink px-2 py-0.5 text-ink">
          <Gift className="h-3 w-3" /> {job.compensation.product}
        </span>
      </div>

      {mine ? (
        <Link
          href="/portal/my-job"
          className="mono-label mt-5 inline-flex items-center justify-center gap-1.5 rounded-[3px] border-2 border-ink bg-[color:var(--accent-2)] px-4 py-2.5 text-[11px] font-bold text-ink shadow-[3px_3px_0_var(--ink)]"
        >
          You signed up - view job <ArrowRight className="h-4 w-4" />
        </Link>
      ) : full ? (
        <span className="mono-label mt-5 inline-flex items-center justify-center rounded-[3px] border-2 border-[color:var(--muted-on-light)]/40 bg-surface-muted px-4 py-2.5 text-[11px] font-bold text-[color:var(--muted-on-light)]">
          Full - all slots taken
        </span>
      ) : (
        <Link
          href={`/portal/jobs/${job.slug}`}
          className="mono-label mt-5 inline-flex items-center justify-center gap-1.5 rounded-[3px] border-2 border-ink bg-accent px-4 py-2.5 text-[11px] font-bold text-white shadow-[3px_3px_0_var(--ink)] transition-transform hover:-translate-x-0.5 hover:-translate-y-0.5"
        >
          View details <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Clock } from "lucide-react";
import { getJob } from "@/site.config";
import { getPortalState, type PortalState } from "@/lib/portal";
import { PortalShell } from "@/components/portal/PortalShell";

export default function MyJobPage() {
  const [state, setState] = useState<PortalState | null>(null);
  useEffect(() => setState(getPortalState()), []);

  const job = state?.activeJob ? getJob(state.activeJob) : undefined;
  const submitted = job && state ? state.submitted.includes(job.slug) : false;

  return (
    <PortalShell>
      <p className="mono-label text-xs font-bold text-accent">My job</p>
      <h1 className="font-display text-display-sm font-bold text-ink">Your active job</h1>

      {!job ? (
        <div className="mt-8 rounded-[3px] border-2 border-dashed border-ink bg-white p-8 text-center">
          <p className="text-sm text-[color:var(--muted-on-light)]">
            You don&apos;t have an active job yet.
          </p>
          <Link
            href="/portal/jobs"
            className="mono-label mt-4 inline-flex items-center gap-1.5 rounded-[3px] border-2 border-ink bg-accent px-4 py-2.5 text-[11px] font-bold text-white shadow-[3px_3px_0_var(--ink)]"
          >
            Browse open jobs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="mt-8 rounded-[3px] border-2 border-ink bg-white p-6 shadow-[6px_6px_0_var(--ink)]">
          <div className="flex items-center justify-between">
            <span className="mono-label rounded-[2px] border-2 border-ink bg-[color:var(--accent-2)] px-2 py-0.5 text-[9px] font-bold text-ink">
              {job.category}
            </span>
            <span
              className={`mono-label inline-flex items-center gap-1 rounded-[2px] border-2 px-2 py-0.5 text-[9px] font-bold ${
                submitted ? "border-ink text-ink" : "border-accent text-accent"
              }`}
            >
              {submitted ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
              {submitted ? "Submitted - in review" : "In progress"}
            </span>
          </div>
          <p className="mono-label mt-3 text-[10px] font-bold text-[color:var(--muted-on-light)]">
            {job.brand}
          </p>
          <h2 className="font-display text-xl font-bold text-ink">{job.title}</h2>

          <div className="mt-4 rounded-[3px] border-2 border-ink bg-surface-muted p-4">
            <h3 className="mono-label text-[11px] font-bold text-accent">Deliverables</h3>
            <ul className="mt-2 space-y-1.5">
              {job.deliverables.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-ink">
                  <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden /> {d}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/portal/jobs/${job.slug}`}
              className="mono-label inline-flex items-center gap-1.5 rounded-[3px] border-2 border-ink bg-white px-4 py-2.5 text-[11px] font-bold text-ink"
            >
              View full brief
            </Link>
            {!submitted && (
              <Link
                href={`/portal/submit/${job.slug}`}
                className="mono-label inline-flex items-center gap-1.5 rounded-[3px] border-2 border-ink bg-accent px-4 py-2.5 text-[11px] font-bold text-white shadow-[3px_3px_0_var(--ink)]"
              >
                Submit proof <ArrowRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </PortalShell>
  );
}

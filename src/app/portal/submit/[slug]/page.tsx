"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2, Plus, UploadCloud, X } from "lucide-react";
import { getJob } from "@/site.config";
import { getSession, getPortalState, markSubmitted } from "@/lib/portal";
import { humanFileSize } from "@/lib/uploads";
import { compressImage } from "@/lib/image-compress";
import { PortalShell } from "@/components/portal/PortalShell";
import { FormField, Input, Textarea } from "@/components/form/Fields";

export default function SubmitProofPage() {
  const params = useParams<{ slug: string }>();
  const job = getJob(params.slug);

  // Seed link fields from deliverables that ask for links (min 1).
  const linkCount = job ? Math.max(1, job.deliverables.filter((d) => /link/i.test(d)).length) : 1;
  const [links, setLinks] = useState<string[]>(Array(linkCount).fill(""));
  const [files, setFiles] = useState<File[]>([]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | undefined>();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const fileRef = useRef<HTMLInputElement>(null);
  const [signedUp, setSignedUp] = useState(false);

  useEffect(() => {
    if (job) setSignedUp(getPortalState().signedUp.includes(job.slug));
  }, [job]);

  if (!job) {
    return (
      <PortalShell>
        <p className="text-sm text-ink">
          Job not found. <Link href="/portal/jobs" className="text-accent underline">Back to jobs</Link>.
        </p>
      </PortalShell>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!job) return;
    const cleanLinks = links.map((l) => l.trim()).filter(Boolean);
    if (cleanLinks.length === 0 && files.length === 0) {
      setError("Add at least one post link or file as proof.");
      return;
    }
    for (const l of cleanLinks) {
      if (!/^https?:\/\//i.test(l)) {
        setError("Links must start with http:// or https://");
        return;
      }
    }
    setError(undefined);
    setStatus("loading");

    const body = new FormData();
    body.set("email", getSession() ?? "");
    body.set("slug", job.slug);
    body.set("notes", notes);
    for (const l of cleanLinks) body.append("links", l);
    for (const f of files) body.append("files", f);

    try {
      const res = await fetch("/api/portal/submit", { method: "POST", body });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        setError(json.error || "Submission failed. Please try again.");
        setStatus("idle");
        return;
      }
      markSubmitted(job.slug);
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <PortalShell>
        <div className="mx-auto max-w-lg rounded-[4px] border-2 border-ink bg-white p-8 text-center shadow-[8px_8px_0_var(--accent)]">
          <CheckCircle2 className="mx-auto h-12 w-12 text-accent" aria-hidden />
          <h1 className="mt-4 font-display text-2xl font-bold text-ink">Submitted for review.</h1>
          <p className="mt-2 text-sm text-[color:var(--muted-on-light)]">
            We&apos;ll verify your proof and get your payout moving. You&apos;ll hear from us soon.
          </p>
          <Link
            href="/portal/jobs"
            className="mono-label mt-6 inline-flex items-center gap-1.5 rounded-[3px] border-2 border-ink bg-accent px-4 py-2.5 text-[11px] font-bold text-white shadow-[3px_3px_0_var(--ink)]"
          >
            Back to jobs
          </Link>
        </div>
      </PortalShell>
    );
  }

  return (
    <PortalShell>
      <Link
        href={`/portal/jobs/${job.slug}`}
        className="mono-label inline-flex items-center gap-1.5 text-[11px] font-bold text-accent"
      >
        <ArrowLeft className="h-4 w-4" /> Back to job
      </Link>
      <h1 className="mt-4 font-display text-display-sm font-bold text-ink">Submit your proof</h1>
      <p className="mono-label mt-1 text-[11px] text-[color:var(--muted-on-light)]">
        {job.brand} — {job.title}
      </p>

      {!signedUp && (
        <p className="mt-4 rounded-[3px] border-2 border-ink bg-[color:var(--accent-2)] px-4 py-2 text-xs font-bold text-ink">
          Heads up: you haven&apos;t signed up for this job yet — you can still submit, but sign up first if you meant to.
        </p>
      )}

      <div className="mt-4 rounded-[3px] border-2 border-ink bg-white p-4">
        <h2 className="mono-label text-[11px] font-bold text-accent">Required deliverables</h2>
        <ul className="mt-2 space-y-1 text-sm text-ink">
          {job.deliverables.map((d) => (
            <li key={d}>• {d}</li>
          ))}
        </ul>
      </div>

      <form onSubmit={handleSubmit} noValidate className="mt-6 max-w-2xl space-y-6">
        {/* Post links */}
        <div>
          <p className="text-sm font-medium text-ink">Post links</p>
          <p className="mono-label mb-2 text-[10px] text-[color:var(--muted-on-light)]">
            e.g. your Instagram and TikTok post URLs
          </p>
          <div className="space-y-3">
            {links.map((val, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input
                  value={val}
                  onChange={(e) => setLinks((l) => l.map((x, j) => (j === i ? e.target.value : x)))}
                  placeholder="https://…"
                  aria-label={`Post link ${i + 1}`}
                />
                {links.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setLinks((l) => l.filter((_, j) => j !== i))}
                    aria-label="Remove link"
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-[3px] border-2 border-ink bg-white text-ink"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setLinks((l) => [...l, ""])}
            className="mono-label mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-accent"
          >
            <Plus className="h-3.5 w-3.5" /> Add another link
          </button>
        </div>

        {/* Files */}
        <div>
          <p className="text-sm font-medium text-ink">Photos / video / screenshots</p>
          <p className="mono-label mb-2 text-[10px] text-[color:var(--muted-on-light)]">
            e.g. table setup, flyers, QR scan count screenshot · max 10MB each
          </p>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="flex w-full flex-col items-center justify-center gap-2 rounded-[3px] border-2 border-dashed border-ink bg-surface-muted/50 px-4 py-7 text-center hover:bg-surface-muted"
          >
            <UploadCloud className="h-6 w-6 text-[color:var(--muted-on-light)]" aria-hidden />
            <span className="text-sm font-medium text-ink">Tap to add files</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,video/*,application/pdf"
            capture="environment"
            className="sr-only"
            onChange={async (e) => {
              const picked = Array.from(e.target.files ?? []);
              const optimized = await Promise.all(picked.map((f) => compressImage(f)));
              setFiles((prev) => [...prev, ...optimized]);
            }}
          />
          {files.length > 0 && (
            <ul className="mt-3 space-y-2">
              {files.map((f, i) => (
                <li
                  key={`${f.name}-${i}`}
                  className="flex items-center justify-between gap-2 rounded-[3px] border-2 border-ink bg-white px-3 py-2 text-sm"
                >
                  <span className="truncate text-ink">{f.name}</span>
                  <span className="flex items-center gap-2">
                    <span className="mono-label text-[10px] text-[color:var(--muted-on-light)]">
                      {humanFileSize(f.size)}
                    </span>
                    <button
                      type="button"
                      onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))}
                      aria-label="Remove file"
                      className="inline-flex h-7 w-7 items-center justify-center rounded-[2px] border-2 border-ink text-ink"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <FormField label="Notes (optional)" htmlFor="notes">
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Anything we should know about your activation?"
          />
        </FormField>

        {error && (
          <p className="text-xs font-medium text-red-500" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="brutal-press inline-flex h-12 w-full items-center justify-center gap-2 rounded-[3px] border-2 border-ink bg-accent text-sm font-bold uppercase tracking-wide text-white shadow-[4px_4px_0_var(--ink)] disabled:opacity-60"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
            </>
          ) : (
            "Submit for review"
          )}
        </button>
      </form>
    </PortalShell>
  );
}

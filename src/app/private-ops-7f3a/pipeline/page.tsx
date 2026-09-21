"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { STAGES, STAGE_META, daysSince, needsReply, type Deal, type Stage } from "@/lib/crm/types";

type GmailStatus = { appConfigured: boolean; connected: boolean; connectedAt: string | null; synced: boolean };
type Payload = { ok: boolean; deals?: Deal[]; gmail?: GmailStatus; error?: string; setup?: string };

const SOURCE_LABEL: Record<string, string> = {
  brand_inquiry: "Contact form",
  campaign: "Campaign builder",
  lead_magnet: "Lead magnet",
};

function fmt(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

/** Who we're waiting on, in words, because that's the question people ask. */
function waitingLabel(deal: Deal): { text: string; urgent: boolean } | null {
  if (deal.stage === "archived") return null;
  if (needsReply(deal)) {
    const d = daysSince(deal.lastInboundAt);
    return { text: d === 0 ? "They replied today" : `Waiting on us · ${d}d`, urgent: (d ?? 0) >= 2 };
  }
  if (deal.lastOutboundAt) {
    const d = daysSince(deal.lastOutboundAt);
    return { text: d === 0 ? "You replied today" : `Waiting on them · ${d}d`, urgent: false };
  }
  const d = daysSince(deal.createdAt);
  return { text: d === 0 ? "Came in today" : `No contact yet · ${d}d`, urgent: (d ?? 0) >= 1 };
}

function Card({ deal, onOpen }: { deal: Deal; onOpen: (d: Deal) => void }) {
  const waiting = waitingLabel(deal);
  return (
    <button
      type="button"
      onClick={() => onOpen(deal)}
      className="w-full rounded-lg border border-slate-200 bg-white p-3 text-left shadow-sm transition hover:border-slate-400 hover:shadow"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="truncate text-sm font-semibold text-slate-900">
          {deal.company || deal.contactName || deal.email}
        </span>
        {waiting && (
          <span
            className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
              waiting.urgent ? "bg-rose-100 text-rose-700" : "bg-slate-100 text-slate-600"
            }`}
          >
            {waiting.text}
          </span>
        )}
      </div>
      <p className="mt-1 truncate text-xs text-slate-500">{deal.email}</p>
      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600">
          {SOURCE_LABEL[deal.source] ?? deal.source}
        </span>
        {deal.owner && (
          <span className="rounded bg-indigo-50 px-1.5 py-0.5 text-[10px] text-indigo-700">{deal.owner}</span>
        )}
        {deal.stageSource !== "auto" && (
          <span className="rounded bg-amber-50 px-1.5 py-0.5 text-[10px] text-amber-700">
            {deal.stageSource === "label" ? "via label" : "set by hand"}
          </span>
        )}
      </div>
    </button>
  );
}

function Drawer({
  deal,
  onClose,
  onSave,
}: {
  deal: Deal;
  onClose: () => void;
  onSave: (patch: Record<string, unknown>) => Promise<void>;
}) {
  const [notes, setNotes] = useState(deal.notes ?? "");
  const [owner, setOwner] = useState(deal.owner ?? "");
  const [busy, setBusy] = useState(false);

  const save = async (patch: Record<string, unknown>) => {
    setBusy(true);
    try {
      await onSave(patch);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40" onClick={onClose}>
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-white p-5 shadow-xl sm:max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              {deal.company || deal.contactName || deal.email}
            </h2>
            <p className="text-sm text-slate-500">{deal.email}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded p-1 text-slate-400 hover:bg-slate-100">
            ✕
          </button>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-xs">
          <div>
            <dt className="text-slate-500">Contact</dt>
            <dd className="font-medium text-slate-800">{deal.contactName || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">Phone</dt>
            <dd className="font-medium text-slate-800">{deal.phone || "—"}</dd>
          </div>
          <div>
            <dt className="text-slate-500">They last wrote</dt>
            <dd className="font-medium text-slate-800">{fmt(deal.lastInboundAt)}</dd>
          </div>
          <div>
            <dt className="text-slate-500">We last wrote</dt>
            <dd className="font-medium text-slate-800">{fmt(deal.lastOutboundAt)}</dd>
          </div>
        </dl>

        <label className="mt-5 block text-xs font-semibold text-slate-600">
          Stage
          <select
            value={deal.stage}
            disabled={busy}
            onChange={(e) => save({ stage: e.target.value })}
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
          >
            {STAGES.map((s) => (
              <option key={s} value={s}>
                {STAGE_META[s].label}
              </option>
            ))}
          </select>
        </label>
        <p className="mt-1 text-[11px] text-slate-500">
          Moving it by hand pins it — the mail sync won&apos;t move it again.
        </p>

        <label className="mt-4 block text-xs font-semibold text-slate-600">
          Owner
          <div className="mt-1 flex gap-2">
            <input
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Who's on it?"
              className="w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => save({ owner: owner.trim() || null })}
              className="rounded bg-slate-900 px-3 text-xs font-semibold text-white disabled:opacity-50"
            >
              Save
            </button>
          </div>
        </label>

        <label className="mt-4 block text-xs font-semibold text-slate-600">
          Notes
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={5}
            className="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-sm"
          />
        </label>
        <button
          type="button"
          disabled={busy}
          onClick={() => save({ notes })}
          className="mt-2 rounded bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
        >
          Save notes
        </button>

        <details className="mt-6">
          <summary className="cursor-pointer text-xs font-semibold text-slate-600">
            What they submitted
          </summary>
          <pre className="mt-2 overflow-x-auto rounded bg-slate-50 p-3 text-[11px] text-slate-700">
            {JSON.stringify(deal.payload, null, 2)}
          </pre>
        </details>
      </div>
    </div>
  );
}

/** Shown until the database and mailbox are wired up. */
function Setup({ gmail, dbError }: { gmail?: GmailStatus; dbError?: string }) {
  const steps = [
    { done: !dbError, label: "Connect a Postgres database", detail: dbError ?? "Connected." },
    {
      done: Boolean(gmail?.appConfigured),
      label: "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET",
      detail: "Google Cloud Console → Credentials → OAuth client ID → Web application.",
    },
    {
      done: Boolean(gmail?.connected),
      label: "Connect the mailbox",
      detail: "Visit /api/gmail/connect while signed in here.",
    },
  ];
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
      <h2 className="text-sm font-bold text-amber-900">Setup needed</h2>
      <ol className="mt-3 space-y-2">
        {steps.map((s) => (
          <li key={s.label} className="flex gap-2 text-sm">
            <span>{s.done ? "✅" : "⬜"}</span>
            <span>
              <span className="font-medium text-amber-900">{s.label}</span>
              <span className="block text-xs text-amber-800">{s.detail}</span>
            </span>
          </li>
        ))}
      </ol>
      {!gmail?.connected && gmail?.appConfigured && (
        <a
          href="/api/gmail/connect"
          className="mt-3 inline-block rounded bg-amber-900 px-3 py-1.5 text-xs font-semibold text-white"
        >
          Connect Gmail
        </a>
      )}
    </div>
  );
}

export default function PipelinePage() {
  const [data, setData] = useState<Payload | null>(null);
  const [code, setCode] = useState("");
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [loginError, setLoginError] = useState("");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<Deal | null>(null);
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    const res = await fetch("/api/crm/deals", { cache: "no-store" });
    if (res.status === 401) {
      setAuthed(false);
      return;
    }
    setAuthed(true);
    setData((await res.json()) as Payload);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const login = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const json = (await res.json()) as { ok: boolean; error?: string };
    if (json.ok) {
      setCode("");
      await load();
    } else {
      setLoginError(json.error ?? "Could not sign in.");
    }
  };

  const patch = async (id: string, body: Record<string, unknown>) => {
    const res = await fetch(`/api/crm/deals/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    const json = (await res.json()) as { ok: boolean; deal?: Deal; error?: string };
    if (json.ok && json.deal) {
      setOpen(json.deal);
      await load();
    } else {
      setStatus(json.error ?? "Could not save.");
    }
  };

  const act = async (path: string, label: string) => {
    setStatus(`${label}…`);
    const res = await fetch(path, { method: "POST" });
    const json = (await res.json()) as { ok: boolean; matched?: number; error?: string; note?: string };
    setStatus(
      json.ok
        ? `${label} done — ${json.matched ?? 0} message(s) matched. ${json.note ?? ""}`
        : `${label} failed: ${json.error}`,
    );
    await load();
  };

  const filtered = useMemo(() => {
    const deals = data?.deals ?? [];
    const q = query.trim().toLowerCase();
    if (!q) return deals;
    return deals.filter((d) =>
      [d.company, d.contactName, d.email, d.owner].filter(Boolean).join(" ").toLowerCase().includes(q),
    );
  }, [data, query]);

  const waitingCount = useMemo(() => filtered.filter(needsReply).length, [filtered]);

  if (authed === null) return <main className="p-8 text-sm text-slate-500">Loading…</main>;

  if (authed === false) {
    return (
      <main className="mx-auto max-w-sm p-8">
        <h1 className="text-lg font-bold text-slate-900">Pipeline</h1>
        <form onSubmit={login} className="mt-4 space-y-3">
          <input
            type="password"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Access code"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          />
          <button type="submit" className="w-full rounded bg-slate-900 px-3 py-2 text-sm font-semibold text-white">
            Sign in
          </button>
          {loginError && <p className="text-xs text-rose-600">{loginError}</p>}
        </form>
      </main>
    );
  }

  const needsSetup = !data?.ok || !data?.gmail?.connected;

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <header className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Pipeline</h1>
          <p className="text-xs text-slate-500">
            {filtered.length} brand{filtered.length === 1 ? "" : "s"} ·{" "}
            <span className={waitingCount ? "font-semibold text-rose-600" : ""}>
              {waitingCount} waiting on us
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="rounded border border-slate-300 px-2 py-1.5 text-sm"
          />
          <button
            type="button"
            onClick={() => act("/api/cron/mail-sync", "Sync")}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            Sync now
          </button>
          <button
            type="button"
            onClick={() => act("/api/crm/backfill", "Backfill")}
            className="rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700"
          >
            Backfill history
          </button>
        </div>
      </header>

      {status && <p className="mb-3 rounded bg-slate-900 px-3 py-2 text-xs text-white">{status}</p>}
      {needsSetup && (
        <div className="mb-4">
          <Setup gmail={data?.gmail} dbError={data?.ok ? undefined : data?.error} />
        </div>
      )}

      {/* Columns scroll sideways on a phone rather than squashing. */}
      <div className="flex gap-3 overflow-x-auto pb-4">
        {STAGES.map((stage) => {
          const items = filtered.filter((d) => d.stage === stage);
          return (
            <section key={stage} className="w-72 shrink-0">
              <div className="mb-2 px-1">
                <h2 className="text-sm font-bold text-slate-800">
                  {STAGE_META[stage].label}{" "}
                  <span className="font-normal text-slate-400">{items.length}</span>
                </h2>
                <p className="text-[11px] text-slate-500">{STAGE_META[stage].blurb}</p>
              </div>
              <div className="space-y-2">
                {items.map((d) => (
                  <Card key={d.id} deal={d} onOpen={setOpen} />
                ))}
                {!items.length && (
                  <p className="rounded border border-dashed border-slate-300 p-3 text-center text-xs text-slate-400">
                    Nothing here
                  </p>
                )}
              </div>
            </section>
          );
        })}
      </div>

      {open && <Drawer deal={open} onClose={() => setOpen(null)} onSave={(p) => patch(open.id, p)} />}
    </main>
  );
}

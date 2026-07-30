"use client";

import { useEffect, useMemo, useState } from "react";

type Row = { label: string; count: number };
type AdminEvent = {
  id: string;
  at: string;
  type: string;
  path?: string;
  title?: string;
  source?: string;
  medium?: string;
  llmSource?: string;
  data?: Record<string, unknown>;
};
type Summary = {
  generatedAt: string;
  storageConfigured: boolean;
  totalEvents: number;
  pageViews: number;
  uniqueVisitorsEstimate: number;
  submissions: number;
  llmLandings: number;
  topPages: Row[];
  topSources: Row[];
  topLlmSources: Row[];
  recentSubmissions: AdminEvent[];
  recentEvents: AdminEvent[];
  daily: { date: string; pageViews: number; submissions: number; llmLandings: number }[];
};

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, { dateStyle: "short", timeStyle: "short" });
}

function BarList({ rows }: { rows: Row[] }) {
  const max = Math.max(1, ...rows.map((row) => row.count));
  if (rows.length === 0) return <p className="text-sm text-slate-500">No data yet.</p>;
  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1 flex justify-between gap-4 text-xs font-medium text-slate-600">
            <span className="truncate">{row.label}</span>
            <span>{row.count}</span>
          </div>
          <div className="h-2 rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-emerald-500"
              style={{ width: `${Math.max(7, (row.count / max) * 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function SparkBars({ summary }: { summary: Summary }) {
  const max = Math.max(1, ...summary.daily.map((row) => row.pageViews + row.submissions));
  return (
    <div className="flex h-36 items-end gap-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      {summary.daily.map((row) => (
        <div key={row.date} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-24 w-full items-end justify-center rounded-t-lg bg-slate-50 px-1">
            <div
              title={`${row.date}: ${row.pageViews} views, ${row.submissions} submissions, ${row.llmLandings} LLM`}
              className="w-full rounded-t-lg bg-slate-900"
              style={{ height: `${Math.max(4, ((row.pageViews + row.submissions) / max) * 96)}px` }}
            />
          </div>
          <span className="text-[10px] text-slate-500">{row.date.slice(5)}</span>
        </div>
      ))}
    </div>
  );
}

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const json = await res.json();
    setLoading(false);
    if (!res.ok || !json.ok) {
      setError(json.error || "Login failed");
      return;
    }
    onSuccess();
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
      <div className="mx-auto max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-emerald-300">Private Ops</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight">Collegiate admin dashboard</h1>
        <p className="mt-3 text-sm leading-6 text-slate-300">
          Enter Shane's private code to view submissions, website traffic, referrers, and LLM landings.
        </p>
        <form onSubmit={submit} className="mt-8 space-y-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            type="password"
            autoFocus
            placeholder="Access code"
            className="w-full rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-white outline-none ring-emerald-400 focus:ring-2"
          />
          {error && <p className="rounded-xl bg-red-500/15 px-4 py-3 text-sm text-red-200">{error}</p>}
          <button
            disabled={loading}
            className="w-full rounded-2xl bg-emerald-400 px-5 py-3 font-bold text-slate-950 transition hover:bg-emerald-300 disabled:opacity-60"
          >
            {loading ? "Checking…" : "Open dashboard"}
          </button>
        </form>
      </div>
    </main>
  );
}

export default function PrivateOpsPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/admin/summary?days=30", { cache: "no-store" });
    setLoading(false);
    if (res.status === 401) {
      setAuthorized(false);
      return;
    }
    const json = await res.json();
    setAuthorized(true);
    setSummary(json.summary);
  }

  useEffect(() => {
    load();
  }, []);

  const maxDaily = useMemo(
    () => Math.max(1, ...(summary?.daily.map((row) => row.pageViews) || [1])),
    [summary],
  );

  if (authorized === false) return <Login onSuccess={load} />;
  if (!summary) {
    return <main className="grid min-h-screen place-items-center bg-slate-950 text-white">Loading dashboard…</main>;
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4 text-slate-950 sm:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-emerald-600">Private Ops</p>
            <h1 className="mt-2 text-4xl font-black tracking-tight">Collegiate admin dashboard</h1>
            <p className="mt-2 text-sm text-slate-500">Generated {fmtDate(summary.generatedAt)} · last 30 days</p>
          </div>
          <div className="flex gap-2">
            <button onClick={load} className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-bold text-white">
              {loading ? "Refreshing…" : "Refresh"}
            </button>
            <button
              onClick={async () => { await fetch("/api/admin/logout", { method: "POST" }); setAuthorized(false); }}
              className="rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold"
            >
              Log out
            </button>
          </div>
        </div>

        {!summary.storageConfigured && (
          <div className="mt-6 rounded-3xl border border-amber-300 bg-amber-50 p-5 text-sm text-amber-900">
            <b>Storage needs Vercel Blob:</b> tracking code is installed, but this deployment must have <code>BLOB_READ_WRITE_TOKEN</code> connected for events/submissions to persist. Once Vercel Blob is connected, this dashboard auto-populates.
          </div>
        )}

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            ["Page views", summary.pageViews],
            ["Visitors est.", summary.uniqueVisitorsEstimate],
            ["Submissions", summary.submissions],
            ["LLM landings", summary.llmLandings],
            ["Total events", summary.totalEvents],
          ].map(([label, value]) => (
            <div key={label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">{label}</p>
              <p className="mt-2 text-4xl font-black">{value}</p>
            </div>
          ))}
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h2 className="mb-3 text-lg font-black">Daily activity</h2>
            <SparkBars summary={summary} />
            <div className="mt-3 grid grid-cols-7 gap-1 text-[10px] text-slate-500 sm:grid-cols-14">
              {summary.daily.map((row) => (
                <div key={row.date} title={`${row.date}: ${row.pageViews} views`} className="rounded-lg bg-white p-2 text-center">
                  <div className="mx-auto mb-1 h-1.5 rounded bg-emerald-500" style={{ width: `${Math.max(8, (row.pageViews / maxDaily) * 100)}%` }} />
                  {row.pageViews}
                </div>
              ))}
            </div>
          </div>
          <div>
            <h2 className="mb-3 text-lg font-black">LLM landings</h2>
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <BarList rows={summary.topLlmSources} />
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-black">Top pages</h2>
            <BarList rows={summary.topPages} />
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-black">Traffic sources</h2>
            <BarList rows={summary.topSources} />
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black">Recent submissions</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wider text-slate-500">
                <tr><th className="py-3">Time</th><th>Type</th><th>Name/company</th><th>Email</th><th>Source</th><th>Details</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {summary.recentSubmissions.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-slate-500">No submissions captured yet.</td></tr>}
                {summary.recentSubmissions.map((event) => (
                  <tr key={event.id} className="align-top">
                    <td className="py-3 text-slate-500">{fmtDate(event.at)}</td>
                    <td className="font-bold">{event.type.replace(/_/g, " ")}</td>
                    <td>{String(event.data?.company || event.data?.fullName || event.data?.email || "—")}</td>
                    <td>{String(event.data?.email || event.data?.schoolEmail || "—")}</td>
                    <td>{event.source || "—"}</td>
                    <td className="max-w-sm truncate text-slate-500">{String(event.data?.message || event.data?.school || event.data?.job || event.path || "—")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-black">Recent website events</h2>
          <div className="mt-4 grid gap-2">
            {summary.recentEvents.slice(0, 18).map((event) => (
              <div key={event.id} className="grid gap-2 rounded-2xl bg-slate-50 p-3 text-sm sm:grid-cols-[150px_150px_1fr_160px]">
                <span className="text-slate-500">{fmtDate(event.at)}</span>
                <span className="font-bold">{event.type.replace(/_/g, " ")}</span>
                <span className="truncate">{event.path || String(event.data?.company || event.data?.email || "—")}</span>
                <span className="truncate text-slate-500">{event.llmSource || event.source || "—"}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

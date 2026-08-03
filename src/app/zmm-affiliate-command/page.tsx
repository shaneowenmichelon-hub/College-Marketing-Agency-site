import type { ReactNode } from "react";
import snapshot from "../../../content/affiliate-command/snapshot.json";

export const metadata = {
  title: "ZMM Affiliate Command Center",
  robots: { index: false, follow: false },
};

type MetricMap = Record<string, number>;

type Source = {
  name: string;
  status: string;
  range: string;
  metrics: MetricMap;
  metricsAll?: MetricMap;
  metrics90?: MetricMap;
  promoCodes?: Array<Record<string, string | number | null>>;
  campaigns?: Array<Record<string, string | number | null>>;
  recentTransactions?: Array<Record<string, string | number>>;
  states?: Array<{ state: string; qualified_users: number }>;
  requests?: Array<Record<string, string | null>>;
  notes?: string[];
};

const data = snapshot as unknown as {
  generatedAt: string;
  rollup: Record<string, number>;
  sources: Source[];
  leaderboard: Array<Record<string, string | number>>;
};

function money(value: number | undefined) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(value || 0);
}

function number(value: number | undefined) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

function pct(value: number | undefined) {
  return `${(value || 0).toFixed(1)}%`;
}

function getSource(name: string) {
  return data.sources.find((source) => source.name === name)!;
}

const acebet = getSource("Acebet");
const polymarket = getSource("Polymarket");
const generated = new Date(data.generatedAt);
const topCode = data.leaderboard[0];

function StatCard({ label, value, detail, accent = "emerald" }: { label: string; value: string; detail: string; accent?: "emerald" | "cyan" | "violet" | "amber" }) {
  const colors = {
    emerald: "from-emerald-400/25 to-emerald-500/5 text-emerald-200 ring-emerald-300/20",
    cyan: "from-cyan-400/25 to-cyan-500/5 text-cyan-200 ring-cyan-300/20",
    violet: "from-violet-400/25 to-violet-500/5 text-violet-200 ring-violet-300/20",
    amber: "from-amber-400/25 to-amber-500/5 text-amber-200 ring-amber-300/20",
  }[accent];

  return (
    <div className={`rounded-[1.75rem] bg-gradient-to-br ${colors} p-5 ring-1 backdrop-blur`}>
      <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-white/50">{label}</p>
      <p className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">{value}</p>
      <p className="mt-2 text-sm text-white/60">{detail}</p>
    </div>
  );
}

function SourcePanel({ source, children }: { source: Source; children: ReactNode }) {
  const online = source.status === "connected";
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-white/40">{source.range}</p>
          <h2 className="mt-2 text-2xl font-black text-white">{source.name}</h2>
        </div>
        <span className={`w-fit rounded-full px-3 py-1 text-xs font-black uppercase tracking-[0.2em] ${online ? "bg-emerald-400/15 text-emerald-200" : "bg-red-400/15 text-red-200"}`}>
          {online ? "Live feed" : "Needs attention"}
        </span>
      </div>
      {children}
    </section>
  );
}

export default function ZmmAffiliateCommandPage() {
  const totalValue = data.rollup.totalTrackedValue;
  const ace = acebet.metrics;
  const poly = polymarket.metrics;
  const all = polymarket.metricsAll || polymarket.metrics;
  const states = polymarket.states || [];
  const promoCodes = polymarket.promoCodes || [];
  const requests = polymarket.requests || [];

  return (
    <main className="min-h-screen overflow-hidden bg-[#070b18] text-white">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(34,211,238,0.22),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.18),transparent_32%),radial-gradient(circle_at_50%_80%,rgba(16,185,129,0.14),transparent_34%)]" />
      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 sm:py-8 lg:px-8">
        <header className="rounded-[2rem] border border-white/10 bg-white/[0.07] p-5 shadow-2xl shadow-black/30 backdrop-blur sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[0.7rem] font-black uppercase tracking-[0.35em] text-cyan-200/70">Private Ops · ZMM / Night School</p>
              <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.06em] text-white sm:text-6xl">
                Affiliate command center
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-white/64 sm:text-lg">
                Acebet and Polymarket/NIGHTSCHOOL in one place: lifetime signups, verified depositors, signed-up-only users, deposited-not-traded users, qualified paid users, code leaderboard, states, pending codes, and tracked payout value.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-white/70">
              <p className="font-bold text-white">Last refreshed</p>
              <p>{generated.toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: "America/New_York" })} ET</p>
              <p className="mt-2 text-xs text-white/45">Safe snapshot. No portal passwords are stored in this site.</p>
            </div>
          </div>
        </header>

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Lifetime signups" value={number(data.rollup.totalSignups)} detail={`${number(data.rollup.acebetSignups)} Acebet · ${number(data.rollup.polymarketSignups)} Polymarket lifetime`} accent="cyan" />
          <StatCard label="Qualified / FTD" value={number(data.rollup.totalQualified)} detail={`${pct(data.rollup.qualificationRate)} blended qualification rate`} accent="emerald" />
          <StatCard label="Tracked value" value={money(totalValue)} detail="Acebet commission + Polymarket qualified cost" accent="amber" />
          <StatCard label="Top code" value={String(topCode?.code || "-")} detail={`${number(Number(topCode?.qualified || 0))} qualified · ${number(Number(topCode?.signups || 0))} signups`} accent="violet" />
        </section>

        <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <SourcePanel source={acebet}>
            <div className="mt-6 grid grid-cols-2 gap-3">
              <StatCard label="Clicks" value={number(ace.clicks)} detail="Unique clicks" accent="cyan" />
              <StatCard label="Registrations" value={number(ace.signups)} detail={`${pct(ace.registrationCr)} click → signup`} accent="emerald" />
              <StatCard label="FTDs" value={number(ace.ftds)} detail={`${pct(ace.regToFtd)} reg → FTD`} accent="violet" />
              <StatCard label="Commission" value={money(ace.commissionEarned)} detail={`${money(ace.depositAmount)} deposit volume`} accent="amber" />
            </div>
            <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-white/40">Campaign</p>
              {(acebet.campaigns || []).map((campaign) => (
                <div key={String(campaign.id)} className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-white/[0.06] p-3">
                  <div>
                    <p className="font-black">{campaign.title}</p>
                    <p className="text-xs text-white/50">{campaign.type} · {campaign.strategy}</p>
                  </div>
                  <p className="text-xl font-black text-emerald-200">{money(Number(campaign.payout || 0))}</p>
                </div>
              ))}
            </div>
          </SourcePanel>

          <SourcePanel source={polymarket}>
            <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard label="Lifetime signups" value={number(poly.signups)} detail={`${number(poly.depositors)} verified depositors`} accent="cyan" />
              <StatCard label="Signed up only" value={number(poly.signedUpOnly)} detail="No deposit yet" accent="violet" />
              <StatCard label="Deposited, no trade" value={number(poly.depositedNotTraded)} detail={`${number(poly.traders)} lifetime traders`} accent="amber" />
              <StatCard label="Qualified paid" value={number(poly.qualifiedPaid)} detail={`${pct(poly.qualificationRate)} signup → qualified`} accent="emerald" />
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/40">Top states</p>
                <div className="mt-3 space-y-2">
                  {states.slice(0, 6).map((state) => (
                    <div key={state.state} className="flex items-center justify-between rounded-xl bg-white/[0.06] px-3 py-2 text-sm">
                      <span className="font-black">{state.state}</span>
                      <span className="text-emerald-200">{state.qualified_users} qualified</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-xs font-black uppercase tracking-[0.22em] text-white/40">Pending code requests</p>
                <div className="mt-3 space-y-2">
                  {requests.length ? requests.map((request) => (
                    <div key={String(request.code)} className="rounded-xl bg-white/[0.06] px-3 py-2 text-sm">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-black">{request.code}</span>
                        <span className="rounded-full bg-amber-300/15 px-2 py-1 text-[0.65rem] font-black uppercase tracking-widest text-amber-200">{request.status}</span>
                      </div>
                      <p className="mt-1 text-xs text-white/45">Requested {String(request.requestedAt || "-").slice(0, 10)}</p>
                    </div>
                  )) : <p className="text-sm text-white/50">No pending requests.</p>}
                </div>
              </div>
            </div>
          </SourcePanel>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-white/40">Code leaderboard</p>
              <h2 className="mt-2 text-2xl font-black">Who is carrying the scoreboard</h2>
            </div>
            <p className="text-sm text-white/50">Ranked by qualified users / FTDs.</p>
          </div>
          <div className="mt-5 grid gap-3 lg:grid-cols-3">
            {data.leaderboard.map((row, index) => (
              <div key={`${row.source}-${row.code}`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm font-black text-slate-950">#{index + 1}</span>
                    <div>
                      <p className="font-black">{row.code}</p>
                      <p className="text-xs text-white/45">{row.source}</p>
                    </div>
                  </div>
                  <p className="text-lg font-black text-emerald-200">{money(Number(row.value || 0))}</p>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl bg-white/[0.06] p-3"><p className="text-white/40">Signups</p><p className="text-xl font-black">{number(Number(row.signups || 0))}</p></div>
                  <div className="rounded-xl bg-white/[0.06] p-3"><p className="text-white/40">Qualified</p><p className="text-xl font-black">{number(Number(row.qualified || 0))}</p></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-white/[0.06] p-5 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[0.65rem] font-black uppercase tracking-[0.28em] text-white/40">Polymarket sub-code table</p>
              <h2 className="mt-2 text-2xl font-black">Night School code performance</h2>
            </div>
            <p className="text-sm text-white/50">Lifetime totals from authenticated affiliate API.</p>
          </div>
          <div className="mt-5 hidden overflow-hidden rounded-2xl border border-white/10 lg:block">
            <table className="w-full text-left text-sm">
              <thead className="bg-white/[0.08] text-xs uppercase tracking-widest text-white/45">
                <tr>
                  <th className="px-4 py-3">Code</th><th className="px-4 py-3">Signups</th><th className="px-4 py-3">Depositors</th><th className="px-4 py-3">Signed up only</th><th className="px-4 py-3">Dep/no trade</th><th className="px-4 py-3">Traded/pending qual</th><th className="px-4 py-3">Qualified</th><th className="px-4 py-3">Cost</th>
                </tr>
              </thead>
              <tbody>
                {promoCodes.map((code) => (
                  <tr key={String(code.code)} className="border-t border-white/10">
                    <td className="px-4 py-3 font-black">{code.code}</td>
                    <td className="px-4 py-3">{number(Number(code.signups || 0))}</td>
                    <td className="px-4 py-3">{number(Number(code.depositors || 0))}</td>
                    <td className="px-4 py-3">{number(Number(code.signedUpOnly || 0))}</td>
                    <td className="px-4 py-3">{number(Number(code.depositedNotTraded || 0))}</td>
                    <td className="px-4 py-3">{number(Number(code.tradedNotQualified || 0))}</td>
                    <td className="px-4 py-3 text-emerald-200">{number(Number(code.qualifiedPaid || 0))}</td>
                    <td className="px-4 py-3">{money(Number(code.cost || 0))}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-5 grid gap-3 lg:hidden">
            {promoCodes.map((code) => (
              <div key={String(code.code)} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between"><p className="text-xl font-black">{code.code}</p><p className="text-emerald-200">{number(Number(code.qualifiedPaid || 0))} qualified</p></div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-xl bg-white/[0.06] p-2"><p className="text-white/40">Signups</p><p className="font-black">{number(Number(code.signups || 0))}</p></div>
                  <div className="rounded-xl bg-white/[0.06] p-2"><p className="text-white/40">Dep</p><p className="font-black">{number(Number(code.depositors || 0))}</p></div>
                  <div className="rounded-xl bg-white/[0.06] p-2"><p className="text-white/40">No deposit</p><p className="font-black">{number(Number(code.signedUpOnly || 0))}</p></div>
                  <div className="rounded-xl bg-white/[0.06] p-2"><p className="text-white/40">Dep/no trade</p><p className="font-black">{number(Number(code.depositedNotTraded || 0))}</p></div>
                  <div className="rounded-xl bg-white/[0.06] p-2"><p className="text-white/40">Cost</p><p className="font-black">{money(Number(code.cost || 0))}</p></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

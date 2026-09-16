"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CalendarHeart,
  Check,
  Coins,
  Loader2,
  MapPin,
  Minus,
  PackageOpen,
  PartyPopper,
  Plus,
  Sparkles,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  AMBASSADOR_MONTHLY,
  PRODUCT_PLACEMENT_PER_CAMPUS,
  campaignEvents,
  campaignSchools,
  formatUSD,
} from "@/lib/campaign-inventory";
import { cn } from "@/lib/utils";

type ServiceKey = "events" | "product-placement" | "ambassadors";

const SERVICES: { key: ServiceKey; label: string; icon: typeof Users; blurb: string; accent: string; textOn: string }[] = [
  {
    key: "events",
    label: "Event sponsorships",
    icon: CalendarHeart,
    blurb: "Put your brand inside the shows, tours, festivals, and trips students plan their year around.",
    accent: "var(--accent)",
    textOn: "text-white",
  },
  {
    key: "product-placement",
    label: "Product placement on campus",
    icon: PackageOpen,
    blurb: "Place product directly with the top Greek-life orgs and campus leaders. $2,500 per campus.",
    accent: "var(--magenta)",
    textOn: "text-white",
  },
  {
    key: "ambassadors",
    label: "Ambassadors",
    icon: Users,
    blurb: `Vetted students repping your brand where peers actually listen. ${formatUSD(AMBASSADOR_MONTHLY)} / ambassador / month.`,
    accent: "var(--accent-2)",
    textOn: "text-ink",
  },
];

type SchoolState = { selected: boolean; ambassadors: number; productPlacement: boolean };

function Stepper({
  value,
  onChange,
  min = 0,
  max = 999,
  ariaLabel,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
  ariaLabel: string;
}) {
  return (
    <div className="inline-flex items-center overflow-hidden rounded-[3px] border-2 border-ink bg-white">
      <button
        type="button"
        aria-label={`decrease ${ariaLabel}`}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-[color:var(--surface-muted)]"
      >
        <Minus className="h-4 w-4" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={ariaLabel}
        value={value}
        min={min}
        max={max}
        onChange={(e) => {
          const n = parseInt(e.target.value, 10);
          onChange(Number.isNaN(n) ? min : Math.min(max, Math.max(min, n)));
        }}
        className="h-9 w-12 border-x-2 border-ink text-center font-display text-base font-bold text-ink outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        type="button"
        aria-label={`increase ${ariaLabel}`}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-9 w-9 items-center justify-center text-ink transition-colors hover:bg-[color:var(--surface-muted)]"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}

export function CampaignBuilder() {
  const reduce = useReducedMotion();

  const [services, setServices] = useState<Record<ServiceKey, boolean>>({
    events: false,
    "product-placement": false,
    ambassadors: false,
  });
  const [months, setMonths] = useState(3);
  const [schoolStates, setSchoolStates] = useState<Record<string, SchoolState>>({});
  const [selectedEvents, setSelectedEvents] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState("");
  const [budgetOverride, setBudgetOverride] = useState<string>("");
  const [contact, setContact] = useState({ firstName: "", lastName: "", company: "", email: "", phone: "" });
  const [stepIndex, setStepIndex] = useState(0);
  const [submitState, setSubmitState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const wantsSchools = services.ambassadors || services["product-placement"];
  const steps = useMemo(() => {
    const s: ("services" | "schools" | "events" | "review")[] = ["services"];
    if (wantsSchools) s.push("schools");
    if (services.events) s.push("events");
    s.push("review");
    return s;
  }, [wantsSchools, services.events]);

  const step = steps[Math.min(stepIndex, steps.length - 1)];

  // ── cost model ──
  const totalAmbassadors = useMemo(
    () => Object.values(schoolStates).reduce((sum, s) => (s.selected ? sum + s.ambassadors : sum), 0),
    [schoolStates],
  );
  const ppCampuses = useMemo(
    () => Object.values(schoolStates).filter((s) => s.selected && s.productPlacement).length,
    [schoolStates],
  );
  const eventsCost = useMemo(
    () =>
      campaignEvents
        .flatMap((g) => g.events)
        .reduce((sum, e) => (selectedEvents[e.id] ? sum + e.minFee : sum), 0),
    [selectedEvents],
  );

  const ambCost = services.ambassadors ? totalAmbassadors * AMBASSADOR_MONTHLY * months : 0;
  const ppCost = services["product-placement"] ? ppCampuses * PRODUCT_PLACEMENT_PER_CAMPUS : 0;
  const eventCost = services.events ? eventsCost : 0;
  const estimate = ambCost + ppCost + eventCost;

  const anyService = services.events || services["product-placement"] || services.ambassadors;

  function toggleService(key: ServiceKey) {
    setServices((s) => ({ ...s, [key]: !s[key] }));
  }
  function schoolOf(name: string): SchoolState {
    return schoolStates[name] ?? { selected: false, ambassadors: 1, productPlacement: false };
  }
  function updateSchool(name: string, patch: Partial<SchoolState>) {
    setSchoolStates((prev) => ({ ...prev, [name]: { ...schoolOf(name), ...patch } }));
  }

  const canAdvance =
    (step === "services" && anyService) ||
    step === "schools" ||
    step === "events" ||
    step === "review";

  function next() {
    setStepIndex((i) => Math.min(steps.length - 1, i + 1));
  }
  function back() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  async function submit() {
    if (!contact.email.trim()) {
      setErrorMsg("Please add a work email so we can send your campaign back to you.");
      return;
    }
    setSubmitState("sending");
    setErrorMsg("");

    const payload = {
      services: (Object.keys(services) as ServiceKey[]).filter((k) => services[k]),
      months,
      schools: Object.entries(schoolStates)
        .filter(([, s]) => s.selected)
        .map(([school, s]) => ({
          school,
          ambassadors: services.ambassadors ? s.ambassadors : 0,
          productPlacement: services["product-placement"] ? s.productPlacement : false,
        })),
      events: campaignEvents
        .flatMap((g) => g.events)
        .filter((e) => selectedEvents[e.id])
        .map((e) => ({ name: e.name, group: e.group, minFee: e.minFee })),
      totals: { ambassadors: ambCost, productPlacement: ppCost, events: eventCost, estimate },
      budget: budgetOverride.trim() || formatUSD(estimate),
      notes: notes.trim(),
      contact,
      attribution: {
        referrer: typeof document !== "undefined" ? document.referrer : "",
        landing_page: typeof window !== "undefined" ? window.location.pathname : "/build-a-campaign",
      },
    };

    try {
      const res = await fetch("/api/campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Something went wrong. Please try again.");
      }
      setSubmitState("done");
    } catch (err) {
      setSubmitState("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  // ── success screen ──
  if (submitState === "done") {
    return (
      <div className="mx-auto max-w-xl rounded-[4px] border-2 border-ink bg-surface p-8 text-center shadow-[8px_8px_0_var(--accent-2)]">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-[color:var(--accent-2)]">
          <PartyPopper className="h-8 w-8 text-ink" />
        </span>
        <h2 className="mt-6 font-display text-3xl font-bold text-ink">Campaign sent!</h2>
        <p className="mt-3 text-[color:var(--muted-on-light)]">
          We got your campaign build{contact.firstName ? `, ${contact.firstName}` : ""}. Our team will review it and
          get back to you within one business day with a tailored plan and firm pricing.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-[3px] border-2 border-ink bg-ink px-4 py-2 font-display text-xl font-bold text-[color:var(--accent-2)]">
          <Coins className="h-5 w-5" /> {budgetOverride.trim() || formatUSD(estimate)}
        </div>
      </div>
    );
  }

  const stepMeta: Record<string, { eyebrow: string; title: string; intro: string }> = {
    services: {
      eyebrow: "Step 1",
      title: "What do you want to run?",
      intro: "Pick one or stack all three. Your plan builds as you go.",
    },
    schools: {
      eyebrow: `Step ${steps.indexOf("schools") + 1}`,
      title: "Pick your campuses.",
      intro: services.ambassadors
        ? "Choose schools, then set how many ambassadors you want at each. Toggle product placement per campus where you want it."
        : "Choose the campuses where you want product placement ($2,500 each).",
    },
    events: {
      eyebrow: `Step ${steps.indexOf("events") + 1}`,
      title: "Choose your events.",
      intro: "Tap the events and trips you want in. Prices shown are the minimum base fee to get in the door.",
    },
    review: {
      eyebrow: `Step ${steps.length}`,
      title: "Review & send.",
      intro: "Here's your campaign and an estimated starting cost. Adjust the number, add notes, then send it to our team.",
    },
  };
  const meta = stepMeta[step];

  return (
    <div>
      {/* Progress + running total */}
      <div className="sticky top-16 z-30 mb-8 rounded-[4px] border-2 border-ink bg-surface/95 px-3 py-2.5 shadow-[4px_4px_0_var(--ink)] backdrop-blur sm:px-4 sm:py-3 lg:top-20">
        <div className="flex items-center justify-between gap-3">
          <ol className="flex min-w-0 items-center gap-1 sm:gap-2">
            {steps.map((s, i) => (
              <li key={s} className="flex items-center gap-1 sm:gap-2">
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-ink font-display text-[11px] font-bold sm:h-7 sm:w-7 sm:text-xs",
                    i < stepIndex && "bg-ink text-[color:var(--accent-2)]",
                    i === stepIndex && "bg-[color:var(--accent-2)] text-ink",
                    i > stepIndex && "bg-white text-ink",
                  )}
                >
                  {i < stepIndex ? <Check className="h-3.5 w-3.5" /> : i + 1}
                </span>
                {i < steps.length - 1 && <span className="h-0.5 w-2 bg-ink/30 sm:w-6" />}
              </li>
            ))}
          </ol>
          <div className="flex shrink-0 items-center gap-1.5 rounded-[3px] border-2 border-ink bg-ink px-2.5 py-1.5 sm:gap-2 sm:px-3">
            <Coins className="h-4 w-4 shrink-0 text-[color:var(--accent-2)]" />
            <span className="font-display text-sm font-bold text-[color:var(--accent-2)] sm:text-base">
              {formatUSD(estimate)}
            </span>
          </div>
        </div>
      </div>

      {/* Step header */}
      <div className="mb-8">
        <span className="mono-label text-[11px] font-bold text-accent">{meta.eyebrow}</span>
        <h1 className="mt-2 font-display text-3xl font-bold leading-tight text-ink sm:text-4xl">{meta.title}</h1>
        <p className="mt-3 max-w-2xl text-[color:var(--muted-on-light)]">{meta.intro}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={reduce ? undefined : { opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: 0.22 }}
        >
          {step === "services" && (
            <div className="grid gap-4 sm:grid-cols-3">
              {SERVICES.map((svc) => {
                const on = services[svc.key];
                const Icon = svc.icon;
                return (
                  <button
                    key={svc.key}
                    type="button"
                    onClick={() => toggleService(svc.key)}
                    aria-pressed={on}
                    className={cn(
                      "brutal-press group flex flex-col rounded-[4px] border-2 border-ink p-6 text-left transition-all",
                      on
                        ? `-translate-y-1 ${svc.textOn} shadow-[8px_8px_0_var(--ink)]`
                        : "bg-white text-ink shadow-[4px_4px_0_var(--ink)] hover:-translate-y-1",
                    )}
                    style={on ? { backgroundColor: svc.accent } : undefined}
                  >
                    <div className="flex items-center justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-[3px] border-2 border-ink bg-white text-ink">
                        <Icon className="h-6 w-6" />
                      </span>
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink",
                          on ? "bg-ink text-white" : "bg-white text-transparent",
                        )}
                      >
                        <Check className="h-4 w-4" />
                      </span>
                    </div>
                    <h3 className="mt-5 font-display text-xl font-bold">{svc.label}</h3>
                    <p className="mt-2 text-sm leading-relaxed opacity-90">{svc.blurb}</p>
                  </button>
                );
              })}
            </div>
          )}

          {step === "schools" && (
            <div>
              {services.ambassadors && (
                <div className="mb-6 flex flex-wrap items-center gap-4 rounded-[4px] border-2 border-ink bg-[color:var(--surface-muted)] p-4">
                  <span className="mono-label text-[11px] font-bold text-ink">Campaign length</span>
                  <Stepper value={months} onChange={setMonths} min={1} max={24} ariaLabel="months" />
                  <span className="text-sm text-[color:var(--muted-on-light)]">
                    months · ambassadors bill at {formatUSD(AMBASSADOR_MONTHLY)}/month each
                  </span>
                </div>
              )}
              <div className="grid gap-3">
                {campaignSchools.map(({ school, city }) => {
                  const s = schoolOf(school);
                  return (
                    <div
                      key={school}
                      className={cn(
                        "rounded-[4px] border-2 border-ink transition-all",
                        s.selected ? "bg-white shadow-[4px_4px_0_var(--accent)]" : "bg-white",
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => updateSchool(school, { selected: !s.selected })}
                        aria-pressed={s.selected}
                        className="flex w-full items-center gap-3 p-4 text-left"
                      >
                        <span
                          className={cn(
                            "flex h-6 w-6 shrink-0 items-center justify-center rounded-[3px] border-2 border-ink",
                            s.selected ? "bg-[color:var(--accent-2)] text-ink" : "bg-white text-transparent",
                          )}
                        >
                          <Check className="h-4 w-4" />
                        </span>
                        <span className="flex-1">
                          <span className="font-display text-base font-bold text-ink">{school}</span>
                          <span className="ml-2 inline-flex items-center gap-1 text-xs text-[color:var(--muted-on-light)]">
                            <MapPin className="h-3 w-3" /> {city}
                          </span>
                        </span>
                      </button>

                      {s.selected && (
                        <div className="flex flex-col gap-3 border-t-2 border-ink/10 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                          {services.ambassadors && (
                            <div className="flex items-center gap-3">
                              <span className="mono-label text-[10px] text-[color:var(--muted-on-light)]">Ambassadors</span>
                              <Stepper
                                value={s.ambassadors}
                                onChange={(n) => updateSchool(school, { ambassadors: n })}
                                min={0}
                                max={200}
                                ariaLabel={`ambassadors at ${school}`}
                              />
                            </div>
                          )}
                          {services["product-placement"] && (
                            <button
                              type="button"
                              onClick={() => updateSchool(school, { productPlacement: !s.productPlacement })}
                              aria-pressed={s.productPlacement}
                              className={cn(
                                "brutal-press inline-flex items-center gap-2 self-start rounded-[3px] border-2 border-ink px-3 py-1.5 text-xs font-bold transition-all",
                                s.productPlacement
                                  ? "bg-[color:var(--magenta)] text-white"
                                  : "bg-white text-ink hover:bg-[color:var(--surface-muted)]",
                              )}
                            >
                              <PackageOpen className="h-4 w-4" />
                              Product placement +{formatUSD(PRODUCT_PLACEMENT_PER_CAMPUS)}
                              {s.productPlacement && <Check className="h-4 w-4" />}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === "events" && (
            <div className="space-y-8">
              {campaignEvents.map((group) => (
                <div key={group.group}>
                  <h3 className="mono-label mb-3 text-[11px] font-bold text-accent">{group.group}</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {group.events.map((e) => {
                      const on = !!selectedEvents[e.id];
                      return (
                        <button
                          key={e.id}
                          type="button"
                          onClick={() => setSelectedEvents((prev) => ({ ...prev, [e.id]: !prev[e.id] }))}
                          aria-pressed={on}
                          className={cn(
                            "brutal-press flex flex-col rounded-[4px] border-2 border-ink p-4 text-left transition-all",
                            on
                              ? "-translate-y-0.5 bg-[color:var(--accent)] text-white shadow-[6px_6px_0_var(--ink)]"
                              : "bg-white text-ink shadow-[3px_3px_0_var(--ink)] hover:-translate-y-0.5",
                          )}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <span className="font-display text-base font-bold leading-tight">{e.name}</span>
                            <span
                              className={cn(
                                "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-ink",
                                on ? "bg-white text-ink" : "bg-white text-transparent",
                              )}
                            >
                              <Check className="h-4 w-4" />
                            </span>
                          </div>
                          <span
                            className={cn(
                              "mt-2 inline-flex w-fit items-center gap-1 rounded-[3px] border-2 border-ink px-2 py-0.5 text-xs font-bold",
                              on ? "bg-[color:var(--accent-2)] text-ink" : "bg-[color:var(--surface-muted)] text-ink",
                            )}
                          >
                            <Coins className="h-3 w-3" /> {e.feeLabel}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === "review" && (
            <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
              {/* Summary */}
              <div className="space-y-4">
                {services.ambassadors && (
                  <ReviewCard title="Ambassadors" accent="var(--accent-2)">
                    {totalAmbassadors > 0 ? (
                      <>
                        <p className="text-sm text-[color:var(--muted-on-light)]">
                          {totalAmbassadors} ambassador{totalAmbassadors === 1 ? "" : "s"} × {formatUSD(AMBASSADOR_MONTHLY)} × {months} month{months === 1 ? "" : "s"}
                        </p>
                        <ul className="mt-2 space-y-1 text-sm text-ink">
                          {Object.entries(schoolStates)
                            .filter(([, s]) => s.selected && s.ambassadors > 0)
                            .map(([school, s]) => (
                              <li key={school} className="flex justify-between">
                                <span>{school}</span>
                                <span className="font-medium">{s.ambassadors}</span>
                              </li>
                            ))}
                        </ul>
                        <LineTotal label="Ambassadors subtotal" value={ambCost} />
                      </>
                    ) : (
                      <p className="text-sm text-[color:var(--muted-on-light)]">No ambassadors added yet.</p>
                    )}
                  </ReviewCard>
                )}

                {services["product-placement"] && (
                  <ReviewCard title="Product placement" accent="var(--magenta)">
                    {ppCampuses > 0 ? (
                      <>
                        <ul className="space-y-1 text-sm text-ink">
                          {Object.entries(schoolStates)
                            .filter(([, s]) => s.selected && s.productPlacement)
                            .map(([school]) => (
                              <li key={school} className="flex justify-between">
                                <span>{school}</span>
                                <span className="font-medium">{formatUSD(PRODUCT_PLACEMENT_PER_CAMPUS)}</span>
                              </li>
                            ))}
                        </ul>
                        <LineTotal label="Product placement subtotal" value={ppCost} />
                      </>
                    ) : (
                      <p className="text-sm text-[color:var(--muted-on-light)]">No product-placement campuses selected.</p>
                    )}
                  </ReviewCard>
                )}

                {services.events && (
                  <ReviewCard title="Events & trips" accent="var(--accent)">
                    {eventCost > 0 ? (
                      <>
                        <ul className="space-y-1 text-sm text-ink">
                          {campaignEvents
                            .flatMap((g) => g.events)
                            .filter((e) => selectedEvents[e.id])
                            .map((e) => (
                              <li key={e.id} className="flex justify-between gap-3">
                                <span>{e.name}</span>
                                <span className="font-medium whitespace-nowrap">{formatUSD(e.minFee)}</span>
                              </li>
                            ))}
                        </ul>
                        <LineTotal label="Events subtotal (base fees)" value={eventCost} />
                      </>
                    ) : (
                      <p className="text-sm text-[color:var(--muted-on-light)]">No events selected yet.</p>
                    )}
                  </ReviewCard>
                )}

                {/* Notepad */}
                <div className="rounded-[4px] border-2 border-ink bg-white p-5 shadow-[4px_4px_0_var(--ink)]">
                  <label htmlFor="campaign-notes" className="mono-label text-[11px] font-bold text-ink">
                    Notes for our team
                  </label>
                  <textarea
                    id="campaign-notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                    placeholder="Goals, timing, target audience, must-have markets, anything else…"
                    className="mt-2 w-full rounded-[3px] border-2 border-ink bg-white p-3 text-base text-ink outline-none focus:shadow-[3px_3px_0_var(--accent)]"
                  />
                </div>
              </div>

              {/* Estimate + contact + submit */}
              <div className="space-y-4">
                <div className="rounded-[4px] border-2 border-ink bg-ink p-6 text-white shadow-[6px_6px_0_var(--accent-2)]">
                  <p className="mono-label text-[11px] text-[color:var(--accent-2)]">Estimated starting cost</p>
                  <p className="mt-2 font-display text-4xl font-bold text-[color:var(--accent-2)]">{formatUSD(estimate)}</p>
                  <p className="mt-2 text-xs text-[color:var(--muted-on-dark)]">
                    Starting estimate from base/minimum pricing. Final pricing is confirmed by our team.
                  </p>
                  <label htmlFor="budget" className="mono-label mt-5 block text-[10px] text-[color:var(--muted-on-dark)]">
                    Adjust your target budget (optional)
                  </label>
                  <input
                    id="budget"
                    type="text"
                    inputMode="numeric"
                    value={budgetOverride}
                    onChange={(e) => setBudgetOverride(e.target.value)}
                    placeholder={formatUSD(estimate)}
                    className="mt-1 w-full rounded-[3px] border-2 border-white/80 bg-white/10 p-2.5 text-base font-bold text-white placeholder:text-white/50 outline-none focus:border-[color:var(--accent-2)]"
                  />
                </div>

                <div className="rounded-[4px] border-2 border-ink bg-white p-5 shadow-[4px_4px_0_var(--ink)]">
                  <p className="mono-label text-[11px] font-bold text-ink">Where do we send it?</p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    <input className={inputCls} placeholder="First name" value={contact.firstName} onChange={(e) => setContact({ ...contact, firstName: e.target.value })} />
                    <input className={inputCls} placeholder="Last name" value={contact.lastName} onChange={(e) => setContact({ ...contact, lastName: e.target.value })} />
                  </div>
                  <input className={cn(inputCls, "mt-3")} placeholder="Company" value={contact.company} onChange={(e) => setContact({ ...contact, company: e.target.value })} />
                  <input className={cn(inputCls, "mt-3")} type="email" placeholder="Work email *" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
                  <input className={cn(inputCls, "mt-3")} type="tel" placeholder="Phone (optional)" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />

                  {errorMsg && <p className="mt-3 text-sm font-medium text-[color:var(--magenta)]">{errorMsg}</p>}

                  <button
                    type="button"
                    onClick={submit}
                    disabled={submitState === "sending"}
                    className="brutal-press mt-4 flex w-full items-center justify-center gap-2 rounded-[3px] border-2 border-ink bg-[color:var(--accent-2)] px-5 py-3 font-display text-base font-bold text-ink shadow-[4px_4px_0_var(--ink)] disabled:opacity-60"
                  >
                    {submitState === "sending" ? (
                      <><Loader2 className="h-5 w-5 animate-spin" /> Sending…</>
                    ) : (
                      <><Sparkles className="h-5 w-5" /> Send my campaign</>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Nav */}
      <div className="mt-10 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={back}
          disabled={stepIndex === 0}
          className="inline-flex items-center gap-1.5 rounded-[3px] border-2 border-ink bg-white px-4 py-2 text-sm font-bold text-ink transition-all hover:-translate-y-0.5 disabled:opacity-40 disabled:hover:translate-y-0"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        {step !== "review" && (
          <Button onClick={next} variant="primary" size="lg" disabled={!canAdvance}>
            Continue <ArrowRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-[3px] border-2 border-ink bg-white p-2.5 text-base text-ink outline-none focus:shadow-[3px_3px_0_var(--accent)]";

function ReviewCard({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[4px] border-2 border-ink bg-white p-5" style={{ boxShadow: `4px 4px 0 ${accent}` }}>
      <h3 className="font-display text-lg font-bold text-ink">{title}</h3>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function LineTotal({ label, value }: { label: string; value: number }) {
  return (
    <div className="mt-3 flex items-center justify-between border-t-2 border-ink/10 pt-3">
      <span className="mono-label text-[10px] text-[color:var(--muted-on-light)]">{label}</span>
      <span className="font-display text-lg font-bold text-ink">{formatUSD(value)}</span>
    </div>
  );
}

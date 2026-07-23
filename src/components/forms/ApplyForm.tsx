"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { siteConfig } from "@/site.config";
import { ageFromDOB, isEduEmail } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { useAttribution, useElapsed } from "@/lib/client-forms";
import { celebrate } from "@/lib/confetti";
import { cn } from "@/lib/utils";
import { validateUpload } from "@/lib/uploads";
import { uploadToBlob, newSubmissionId, idPath } from "@/lib/blob-upload";
import {
  FormField,
  Input,
  Select,
  Textarea,
  Checkbox,
} from "@/components/form/Fields";
import { IdUpload } from "@/components/forms/IdUpload";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { AmbassadorQuestPanel, AmbassadorCard, type Badge } from "./AmbassadorQuestPanel";

type Errors = Partial<Record<string, string>>;

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS",
  "KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY",
  "NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY",
];

const NICHES = [
  "Lifestyle", "Fashion", "Beauty", "Fitness", "Food", "Music",
  "Sports", "Gaming", "Comedy", "Tech", "Finance", "Other",
];

const currentYear = 2026;
const gradYears = Array.from({ length: 8 }, (_, i) => currentYear + i - 1);

function SectionTitle({ n, title, done = false }: { n: number; title: string; done?: boolean }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span
        className={cn(
          "inline-flex h-8 w-8 items-center justify-center rounded-[3px] border-2 border-ink text-xs font-bold shadow-[3px_3px_0_var(--ink)]",
          done ? "bg-[color:var(--accent-2)] text-ink" : "bg-ink text-white",
        )}
      >
        {done ? <Check className="h-4 w-4" aria-hidden /> : String(n).padStart(2, "0")}
      </span>
      <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
    </div>
  );
}

export function ApplyForm() {
  const [dob, setDob] = useState("");
  const [idFront, setIdFront] = useState<File | null>(null);
  const [idBack, setIdBack] = useState<File | null>(null);
  const [agreements, setAgreements] = useState({ age: false, terms: false, ftc: false });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [followers, setFollowers] = useState({ ig: "", tt: "" });
  // Live snapshot of uncontrolled fields — for the XP meter / card / badges only.
  // Never used for validation or submission (that stays on FormData).
  const [watch, setWatch] = useState<Record<string, string>>({});
  const attribution = useAttribution();
  const getElapsed = useElapsed();

  const age = ageFromDOB(dob);

  // ── Gamification (a presentation layer over the real form) ──────────────────
  const w = (k: string) => (watch[k] ?? "").trim();
  const eduVerified = isEduEmail(w("schoolEmail"));
  const socialsLinked = !!(w("instagram") || w("tiktok"));
  const trustEarned = agreements.age && agreements.terms && agreements.ftc;
  const age21 = age !== null && age >= 21;

  const questFlags = {
    you: !!w("fullName") && age !== null && age >= 18,
    school: !!w("school") && eduVerified,
    socials: socialsLinked,
    more: !!w("why"),
    agreements: trustEarned,
  };
  const questsDone = Object.values(questFlags).filter(Boolean).length;
  // Endowed progress: start ~14% ("Level 1 started") so it never reads as 0%.
  const percent = 14 + (questsDone / 5) * 86;
  const level = 1 + questsDone;

  const badges: Badge[] = [
    { key: "edu", label: ".edu Verified", earned: eduVerified },
    { key: "age21", label: "21+ Unlocked", earned: age21 },
    { key: "socials", label: "Socials Linked", earned: socialsLinked },
    { key: "trust", label: "Trust Badge", earned: trustEarned },
  ];

  const card = {
    name: w("fullName"),
    school: w("school"),
    niche: w("niche"),
    ig: w("instagram"),
    tt: w("tiktok"),
    eduVerified,
  };

  // Confetti celebration when the (unchanged) success state fires.
  useEffect(() => {
    if (status === "success") celebrate();
  }, [status]);

  // Soft eligibility check: warn (don't block) if neither platform meets the min.
  const igCount = parseInt(followers.ig.replace(/[^\d]/g, ""), 10) || 0;
  const ttCount = parseInt(followers.tt.replace(/[^\d]/g, ""), 10) || 0;
  const enteredFollowers = followers.ig !== "" || followers.tt !== "";
  const meetsFollowerMin =
    Math.max(igCount, ttCount) >= siteConfig.influencerMinFollowers;
  const showFollowerWarning = enteredFollowers && !meetsFollowerMin;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    const values = {
      fullName: String(data.get("fullName") ?? "").trim(),
      school: String(data.get("school") ?? "").trim(),
      schoolEmail: String(data.get("schoolEmail") ?? "").trim(),
      why: String(data.get("why") ?? "").trim(),
    };

    const next: Errors = {};
    if (!values.fullName) next.fullName = "Your name is required.";
    if (!dob) next.dob = "Enter your date of birth.";
    else if (age !== null && age < 18) next.dob = "You must be 18 or older to apply.";
    if (!values.school) next.school = "Your school is required.";
    if (!values.schoolEmail) next.schoolEmail = "School email is required.";
    else if (!isEduEmail(values.schoolEmail)) next.schoolEmail = "Use a valid .edu email.";
    if (!values.why) next.why = "Tell us a little about why you want to join.";
    if (!agreements.age) next.age = "Please confirm you're 18 or older.";
    if (!agreements.terms) next.terms = "You must accept the terms.";
    if (!agreements.ftc) next.ftc = "Please acknowledge the disclosure requirement.";
    if (!idFront) next.idFront = "Front of your ID is required.";
    else { const e1 = validateUpload(idFront); if (e1) next.idFront = e1; }
    if (!idBack) next.idBack = "Back of your ID is required.";
    else { const e2 = validateUpload(idBack); if (e2) next.idBack = e2; }

    setErrors(next);
    if (Object.keys(next).length > 0) {
      const firstKey = Object.keys(next)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("loading");

    // Upload ID photos straight to Blob (browser -> Blob), then POST JSON with
    // just the URLs — the large files never hit our serverless function.
    const submissionId = newSubmissionId();
    let frontUp = { url: null as string | null };
    let backUp = { url: null as string | null };
    try {
      [frontUp, backUp] = await Promise.all([
        idFront ? uploadToBlob(idPath(submissionId, "front", idFront.name), idFront) : Promise.resolve({ url: null }),
        idBack ? uploadToBlob(idPath(submissionId, "back", idBack.name), idBack) : Promise.resolve({ url: null }),
      ]);
    } catch {
      /* uploadToBlob never throws, but guard anyway */
    }

    const fields = [
      "phone", "city", "state", "gradYear", "major",
      "instagram", "tiktok", "igFollowers", "ttFollowers", "niche",
    ];
    const payload: Record<string, unknown> = {
      kind: "student_application",
      fullName: values.fullName,
      dob,
      school: values.school,
      schoolEmail: values.schoolEmail,
      why: values.why,
      elapsedMs: getElapsed(),
      nickname: String(data.get("nickname") ?? ""),
      agreements,
      attribution,
      idFrontUrl: frontUp.url ?? "",
      idBackUrl: backUp.url ?? "",
      idFrontName: idFront?.name ?? "",
      idBackName: idBack?.name ?? "",
    };
    for (const f of fields) payload[f] = String(data.get(f) ?? "");

    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok || !json.ok) {
        if (json.errors) setErrors(json.errors);
        setStatus("error");
        return;
      }
      trackEvent("student_application", { form: "ambassador" });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-[4px] border-2 border-ink bg-surface p-8 text-center shadow-[8px_8px_0_var(--accent)] sm:p-10">
        <span className="mono-label inline-block rounded-[3px] border-2 border-ink bg-[color:var(--accent-2)] px-3 py-1 text-[11px] font-bold text-ink shadow-[3px_3px_0_var(--ink)]">
          ⚡ Level {level} · You&apos;re in the game
        </span>
        <h3 className="mt-5 font-display text-display-sm font-bold text-ink">
          You&apos;re in the game! 🎉
        </h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-[color:var(--muted-on-light)]">
          Thanks for applying to the ambassador network. We review applications on a
          rolling basis and reach out when there&apos;s a brand match on your campus.
          Keep an eye on your inbox.
        </p>
        <div className="mx-auto mt-8 max-w-xs">
          <AmbassadorCard card={card} level={level} flipped />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_20rem]">
      <aside className="lg:col-start-2 lg:row-start-1">
        <AmbassadorQuestPanel percent={percent} level={level} badges={badges} card={card} />
      </aside>
      <form
        onSubmit={handleSubmit}
        onChange={(e) => {
          const fd = new FormData(e.currentTarget);
          const obj: Record<string, string> = {};
          for (const [k, v] of fd.entries()) obj[k] = typeof v === "string" ? v : "";
          setWatch(obj);
        }}
        noValidate
        className="space-y-8 rounded-[4px] border-2 border-ink bg-surface p-6 shadow-[8px_8px_0_var(--ink)] sm:p-8 lg:col-start-1 lg:row-start-1"
      >
      {/* Honeypot */}
      <div className="hidden" aria-hidden>
        <label htmlFor="nickname">Nickname</label>
        <input id="nickname" name="nickname" tabIndex={-1} autoComplete="off" />
      </div>

      {/* You */}
      <section>
        <SectionTitle n={1} title="Who are you?" done={questFlags.you} />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Full name" htmlFor="fullName" required error={errors.fullName} className="sm:col-span-2">
            <Input id="fullName" name="fullName" autoComplete="name" error={errors.fullName} />
          </FormField>
          <FormField
            label="Date of birth"
            htmlFor="dob"
            required
            error={errors.dob}
            hint={age !== null && age >= 18 ? `Age ${age} ✓` : "You must be 18+ to apply."}
          >
            <Input
              id="dob"
              name="dob"
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              error={errors.dob}
            />
          </FormField>
          <FormField label="Phone" htmlFor="phone">
            <Input id="phone" name="phone" type="tel" autoComplete="tel" />
          </FormField>
          <FormField label="City" htmlFor="city">
            <Input id="city" name="city" autoComplete="address-level2" />
          </FormField>
          <FormField label="State" htmlFor="state">
            <Select id="state" name="state" defaultValue="">
              <option value="" disabled>
                Select
              </option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
      </section>

      {/* School */}
      <section>
        <SectionTitle n={2} title="Your campus" done={questFlags.school} />
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="School" htmlFor="school" required error={errors.school} className="sm:col-span-2">
            <Input id="school" name="school" placeholder="e.g. Ohio State" error={errors.school} />
          </FormField>
          <FormField
            label="School email (.edu)"
            htmlFor="schoolEmail"
            required
            error={errors.schoolEmail}
            hint="Used to verify you're a current student."
          >
            <Input
              id="schoolEmail"
              name="schoolEmail"
              type="email"
              placeholder="you@school.edu"
              error={errors.schoolEmail}
            />
          </FormField>
          <FormField label="Graduation year" htmlFor="gradYear">
            <Select id="gradYear" name="gradYear" defaultValue="">
              <option value="" disabled>
                Select
              </option>
              {gradYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </Select>
          </FormField>
          <FormField label="Major" htmlFor="major" className="sm:col-span-2">
            <Input id="major" name="major" />
          </FormField>
        </div>
      </section>

      {/* Socials */}
      <section>
        <SectionTitle n={3} title="Your socials" done={questFlags.socials} />
        <p className="mb-4 text-sm text-[color:var(--muted-on-light)]">
          Our influencer program looks for{" "}
          <strong className="text-ink">
            {siteConfig.influencerMinFollowers.toLocaleString()}+ followers
          </strong>{" "}
          on Instagram or TikTok — but ambassadors don&apos;t need a big following, so
          apply either way.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <FormField label="Instagram handle" htmlFor="instagram">
            <Input id="instagram" name="instagram" placeholder="@handle" />
          </FormField>
          <FormField label="TikTok handle" htmlFor="tiktok">
            <Input id="tiktok" name="tiktok" placeholder="@handle" />
          </FormField>
          <FormField label="Instagram followers" htmlFor="igFollowers">
            <Input
              id="igFollowers"
              name="igFollowers"
              inputMode="numeric"
              placeholder="e.g. 1200"
              value={followers.ig}
              onChange={(e) => setFollowers((f) => ({ ...f, ig: e.target.value }))}
            />
          </FormField>
          <FormField label="TikTok followers" htmlFor="ttFollowers">
            <Input
              id="ttFollowers"
              name="ttFollowers"
              inputMode="numeric"
              placeholder="e.g. 3400"
              value={followers.tt}
              onChange={(e) => setFollowers((f) => ({ ...f, tt: e.target.value }))}
            />
          </FormField>
          <FormField label="Content niche" htmlFor="niche" className="sm:col-span-2">
            <Select id="niche" name="niche" defaultValue="">
              <option value="" disabled>
                Select
              </option>
              {NICHES.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </FormField>
        </div>
        {showFollowerWarning && (
          <p className="mt-3 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-700" role="status">
            Heads up — that&apos;s below our {siteConfig.influencerMinFollowers.toLocaleString()}+
            follower guideline for paid influencer work. You can still apply to be a
            brand ambassador, which has no follower minimum.
          </p>
        )}
      </section>

      {/* More */}
      <section>
        <SectionTitle n={4} title="A little more" done={questFlags.more} />
        <div className="grid gap-5">
          <FormField label="Why do you want to join?" htmlFor="why" required error={errors.why}>
            <Textarea
              id="why"
              name="why"
              placeholder="What brands do you love? Why would you be a great campus rep?"
              error={errors.why}
            />
          </FormField>
        </div>
      </section>

      {/* Photo ID */}
      <section>
        <SectionTitle
          n={5}
          title="Verify your ID"
          done={!!idFront && !!idBack && !errors.idFront && !errors.idBack}
        />
        <p className="mb-4 text-sm text-[color:var(--muted-on-light)]">
          We verify identity and age so you can be matched to brand campaigns — including
          21+ campaigns. Upload a clear photo of the front and back of a government photo ID.
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          <IdUpload
            id="idFront"
            label="Government photo ID — front"
            file={idFront}
            onFile={setIdFront}
            error={errors.idFront}
            required
          />
          <IdUpload
            id="idBack"
            label="Government photo ID — back"
            file={idBack}
            onFile={setIdBack}
            error={errors.idBack}
            required
          />
        </div>
        <p className="mt-3 flex items-start gap-2 rounded-[3px] border-2 border-ink bg-surface-muted px-3 py-2 text-xs text-ink">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
          Your ID is encrypted, access-restricted, and used only for verification. It&apos;s
          never posted or shared, and it&apos;s deleted once you&apos;re verified.
        </p>
      </section>

      {/* Agreements */}
      <section>
        <SectionTitle n={6} title="Final boss: the agreements" done={questFlags.agreements} />
        <div className="space-y-4">
          <Checkbox
            checked={agreements.age}
            onChange={(v) => setAgreements((a) => ({ ...a, age: v }))}
            error={errors.age}
            label="I confirm I am 18 years of age or older."
          />
          <Checkbox
            checked={agreements.terms}
            onChange={(v) => setAgreements((a) => ({ ...a, terms: v }))}
            error={errors.terms}
            label={
              <>
                I agree to the{" "}
                <a href="/terms" className="text-accent underline underline-offset-2">
                  terms
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-accent underline underline-offset-2">
                  privacy policy
                </a>
                .
              </>
            }
          />
          <Checkbox
            checked={agreements.ftc}
            onChange={(v) => setAgreements((a) => ({ ...a, ftc: v }))}
            error={errors.ftc}
            label="I understand I'll tag paid posts #ad / #sponsored as instructed (FTC disclosure)."
          />
        </div>
      </section>

      {status === "error" && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600" role="alert">
          Something went wrong. Please check the highlighted fields and try again.
        </p>
      )}

      <Button type="submit" size="lg" className="w-full" disabled={status === "loading"}>
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Submitting…
          </>
        ) : (
          "Submit application"
        )}
      </Button>
      <p className="text-center text-xs text-[color:var(--muted-on-light)]">
        {/* TODO: connect to the student portal / marketplace for onboarding hand-off. */}
        We review on a rolling basis and reach out when there&apos;s a brand match.
      </p>
      </form>
    </div>
  );
}

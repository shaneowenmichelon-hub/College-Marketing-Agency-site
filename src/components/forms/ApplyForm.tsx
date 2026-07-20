"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { siteConfig } from "@/site.config";
import { ageFromDOB, isEduEmail } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { useAttribution, useElapsed } from "@/lib/client-forms";
import {
  FormField,
  Input,
  Select,
  Textarea,
  Checkbox,
  FileDrop,
} from "@/components/form/Fields";
import { Button } from "@/components/ui/Button";

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

function SectionTitle({ n, title }: { n: number; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">
        {n}
      </span>
      <h2 className="font-display text-lg font-bold text-ink">{title}</h2>
    </div>
  );
}

export function ApplyForm() {
  const [dob, setDob] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [agreements, setAgreements] = useState({ age: false, terms: false, ftc: false });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [followers, setFollowers] = useState({ ig: "", tt: "" });
  const attribution = useAttribution();
  const getElapsed = useElapsed();

  const age = ageFromDOB(dob);

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

    const payload = {
      kind: "student_application" as const,
      elapsedMs: getElapsed(),
      attribution,
      fullName: String(data.get("fullName") ?? "").trim(),
      dob,
      phone: String(data.get("phone") ?? ""),
      city: String(data.get("city") ?? ""),
      state: String(data.get("state") ?? ""),
      school: String(data.get("school") ?? "").trim(),
      schoolEmail: String(data.get("schoolEmail") ?? "").trim(),
      gradYear: String(data.get("gradYear") ?? ""),
      major: String(data.get("major") ?? ""),
      instagram: String(data.get("instagram") ?? ""),
      tiktok: String(data.get("tiktok") ?? ""),
      igFollowers: String(data.get("igFollowers") ?? ""),
      ttFollowers: String(data.get("ttFollowers") ?? ""),
      niche: String(data.get("niche") ?? ""),
      why: String(data.get("why") ?? ""),
      resumeName: file?.name ?? "",
      agreements,
      nickname: String(data.get("nickname") ?? ""), // honeypot
    };

    const next: Errors = {};
    if (!payload.fullName) next.fullName = "Your name is required.";
    if (!dob) next.dob = "Enter your date of birth.";
    else if (age !== null && age < 18) next.dob = "You must be 18 or older to apply.";
    if (!payload.school) next.school = "Your school is required.";
    if (!payload.schoolEmail) next.schoolEmail = "School email is required.";
    else if (!isEduEmail(payload.schoolEmail)) next.schoolEmail = "Use a valid .edu email.";
    if (!payload.why.trim()) next.why = "Tell us a little about why you want to join.";
    if (!agreements.age) next.age = "Please confirm you're 18 or older.";
    if (!agreements.terms) next.terms = "You must accept the terms.";
    if (!agreements.ftc) next.ftc = "Please acknowledge the disclosure requirement.";

    setErrors(next);
    if (Object.keys(next).length > 0) {
      // Scroll to first error for keyboard/mobile users.
      const firstKey = Object.keys(next)[0];
      document.getElementById(firstKey)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    setStatus("loading");
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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-10 text-center shadow-soft">
        <CheckCircle2 className="h-12 w-12 text-accent" aria-hidden />
        <h3 className="mt-4 font-display text-2xl font-bold text-ink">
          You&apos;re in the pipeline! 🎉
        </h3>
        <p className="mt-2 max-w-md text-sm text-[color:var(--muted-on-light)]">
          Thanks for applying to the ambassador network. We review applications on a
          rolling basis and reach out when there&apos;s a brand match on your campus.
          Keep an eye on your inbox.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-8 rounded-2xl border border-[color:var(--border-on-light)] bg-surface p-6 shadow-soft sm:p-8"
    >
      {/* Honeypot */}
      <div className="hidden" aria-hidden>
        <label htmlFor="nickname">Nickname</label>
        <input id="nickname" name="nickname" tabIndex={-1} autoComplete="off" />
      </div>

      {/* You */}
      <section>
        <SectionTitle n={1} title="You" />
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
        <SectionTitle n={2} title="Your school" />
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
        <SectionTitle n={3} title="Your socials" />
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
        <SectionTitle n={4} title="A little more" />
        <div className="grid gap-5">
          <FormField label="Why do you want to join?" htmlFor="why" required error={errors.why}>
            <Textarea
              id="why"
              name="why"
              placeholder="What brands do you love? Why would you be a great campus rep?"
              error={errors.why}
            />
          </FormField>
          <FormField label="Resume (optional)" htmlFor="resume">
            <FileDrop
              label="Drop a PDF or image, or choose a file"
              accept=".pdf,.doc,.docx,image/*"
              onFile={setFile}
              file={file}
            />
          </FormField>
        </div>
      </section>

      {/* Agreements */}
      <section>
        <SectionTitle n={5} title="Agreements" />
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
  );
}

# Collegiate Hospitality — Website

A modern, production-quality marketing site for **Collegiate Hospitality**, a college
marketing & events agency connecting **brands** with **college students** through three
services — **Events, Brand Ambassadors, and Influencers** — and recruiting **students**
as paid ambassadors.

Built with Next.js (App Router) + TypeScript, Tailwind CSS, Framer Motion, lucide-react,
and Resend for transactional email. All copy is original; all unverified numbers are
visible `[X]` placeholder tokens so nothing reads as fabricated proof.

> **Brand name** lives in `src/site.config.ts` as `companyName`. It's the single
> swappable token — change it once and the whole site (nav, hero, footer, meta, emails)
> updates. An alternative name ("Unreasonable Hospitality") is noted in that file with a
> trademark caveat.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Everything runs with **zero configuration** — forms validate and return success, email
no-ops with a logged warning, and analytics simply don't load until you add env vars.

```bash
npm run build    # production build (typecheck + lint)
npm run start    # serve the production build
npm run lint     # eslint
```

---

## How the forms + email work

Both forms (`/contact` brand lead, `/become-an-ambassador` student application, plus the
home-page lead magnet) POST to Next.js API routes (`/api/contact`, `/api/apply`) that:

1. **Validate** server-side (the student form enforces an **18+ gate** and a **`.edu`**
   check; both run client-side too).
2. **Rate-limit** per IP + reject honeypot / too-fast (bot) submissions.
3. **Log a structured `[lead]` record** (all fields + UTM attribution) so **no lead is
   ever lost**, even before email is configured. `// TODO` markers show where to also
   persist to a Sheet/CRM/DB and hand students off to the ambassador portal.
4. **Send two emails in parallel** — a branded confirmation to the submitter and an
   internal notification to the agency inbox.

**Email fails gracefully.** With `RESEND_API_KEY` unset, sending is a no-op: it logs
`[email] disabled — no RESEND_API_KEY set. Would have sent: …` and the form still
succeeds. Once you add the key + a verified domain, emails start flowing with **zero code
changes**. The provider is swappable in one place — `deliver()` in `src/lib/email.ts`
(swap Resend for Postmark / SendGrid / SES / Nodemailer there; nothing else changes).

---

## Environment variables

Copy `.env.example` → `.env.local` for local dev, and add the same keys in Vercel. **All
are optional to run** — set them to turn features on.

| Variable | Purpose | Required for launch? |
| --- | --- | --- |
| `RESEND_API_KEY` | Resend API key. Unset = email disabled (forms still work, sends logged). | **Yes** to send email |
| `EMAIL_FROM` | Verified sending identity, e.g. `Collegiate Hospitality <hello@collegiatehospitality.com>`. | **Yes** to send email |
| `AGENCY_INBOX` | Where internal new-lead notifications go. | **Yes** to send email |
| `NEXT_PUBLIC_GA_ID` | GA4 Measurement ID (`G-XXXXXXXXXX`). Loads only after cookie consent. | Optional |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager ID (`GTM-XXXXXXX`). Loads only after consent. | Optional |
| `NEXT_PUBLIC_LINKEDIN_PARTNER_ID` | LinkedIn Insight Tag id. | Optional |
| `NEXT_PUBLIC_META_PIXEL_ID` | Meta/Facebook Pixel id. | Optional |

`NEXT_PUBLIC_*` vars are exposed to the browser (that's required for analytics) — never
put secrets in them. `RESEND_API_KEY` is server-only.

---

## Project structure

```
src/
  app/
    page.tsx                       # Home
    services/{events,brand-ambassadors,influencers}/
    work/  work/[slug]/            # metric-led case studies + detail template
    about/  insights/  insights/[slug]/
    contact/  become-an-ambassador/
    terms/  privacy/  not-found.tsx
    api/contact/route.ts  api/apply/route.ts   # validate + email + log
    sitemap.ts  robots.ts  icon.svg  layout.tsx
  components/
    analytics/                     # Analytics (consent-gated) + CookieConsent banner
    forms/                         # ContactForm, ApplyForm
    seo/JsonLd.tsx                 # Organization / LocalBusiness / Breadcrumb / Article
    services/ServicePage.tsx       # shared service-page layout
    LeadMagnet.tsx, RelatedInsights.tsx, ...
  lib/
    email.ts                       # provider-swappable sender (graceful no-op)
    email-templates/               # studentConfirmation, brandConfirmation, internalNotification
    leads.ts                       # shared submission + attribution types
    rate-limit.ts, analytics.ts, client-forms.ts, content.ts, utils.ts
  site.config.ts                   # ⭐ SINGLE SOURCE OF TRUTH
  styles/globals.css
public/
  logos/                           # client marquee logos (polymarket.svg committed;
                                   #   ZMM sponsors fetched at build) + og.svg
  images/events/                   # real ZMM event photos (fetched at build)
```

---

## Editing pricing, stats, logos & sponsorships (all in `site.config.ts`)

Everything added for pricing/proof/logos/events is data-driven — edit the config, no
component changes needed:

| Export | What it controls |
| --- | --- |
| `pricing` | Per-service price ranges shown on service pages + homepage cards. |
| `stats` | The five homepage counters (`1,200` ambassadors, `20` campuses, `20+` brands, `1.44M+` social reach, `100K+` students). `getStat("campuses")` reuses them in service proof strips. |
| `sitePhotos` | Online photos (Unsplash) used across every image slot **and** the homepage photo carousel. Each is `{ src, alt, seed }`; if `src` fails it falls back to a guaranteed real photo (`photoFallback`, Picsum), then a gradient. Swap any `src` for your own `/images/events/x.jpg` anytime. |
| `clients` | Logo marquee data `{ name, file, remote?, url? }`. Not rendered on the homepage right now (the top strip is a photo carousel) but kept available — see note below. |
| `eventPhotos` | ZMM photo filenames for the optional self-hosting path (see `fetch-assets`). Superseded by `sitePhotos` for on-page rendering. |
| `eventSponsorships` | The "Sponsor an event or trip" directory on `/services/events`, grouped by category with `valuePerEvent` / `basePackage` / `presentingSponsor` (use `"[$ —]"` for unknowns). |

**Photos** render from online URLs in `sitePhotos` (rights-safe Unsplash), so they appear on
the live site with nothing to download. To self-host instead, drop files in
`/public/images/events/` and point each `src` at them.

**Logos:** the homepage top strip is currently a **photo carousel**. To show the brand-logo
strip instead, swap `<PhotoMarquee />` back to `<ClientMarquee clients={clients} />` in
`src/app/page.tsx` (both components exist). `scripts/fetch-assets.mjs` still self-hosts the
ZMM sponsor logos into `/public/logos` at build (non-fatal `prebuild` step). **Polymarket**
ships as a committed SVG wordmark at `public/logos/polymarket.svg`.

---

## 🚀 Launch runbook

### 1. Customize the content
- Confirm the final **name** (`companyName` in `src/site.config.ts`) and its trademark /
  domain availability. Set `companyLegalName` and `companyDomain` too.
- Fill the `[X]` **stat tokens** in `site.config.ts` and the case-study/service `proof`
  tokens — or leave them as tokens until you have verified numbers. Don't invent figures.
- Replace placeholder **offices**, **contact** info, and **social** links in config.
- Drop in real **logos**, **images** (`components/Placeholders.tsx`), **case studies**
  (`lib/content.ts`), and **insights** posts. Never reuse a competitor's clients/numbers.

### 2. Turn on email (Resend)
1. Create an account at **resend.com**.
2. **Verify your sending domain** — add the SPF, DKIM, and DMARC DNS records Resend gives
   you at your registrar. (Without this, confirmation emails land in spam or bounce.)
3. Set `RESEND_API_KEY`, `EMAIL_FROM` (on the verified domain), and `AGENCY_INBOX`.
4. Submit a **test student application and a test brand inquiry** → confirm that *both*
   the submitter confirmation **and** the internal notification arrive.

### 3. Turn on analytics
- Set `NEXT_PUBLIC_GA_ID` and/or `NEXT_PUBLIC_GTM_ID` (and optional pixels).
- Load the site, **click "Accept"** on the cookie banner, submit a form, and confirm the
  `generate_lead` (brand) / `student_application` (student) events fire. Nothing tracks
  before opt-in.

### 4. Legal
- Have counsel review `/privacy` (it describes real student-PII handling) and `/terms`.
  Both carry `// TODO: counsel review` markers.

### 5. Deploy to Vercel
> Your Vercel and GitHub are already connected, so this is quick.
1. Push this branch to GitHub (see below).
2. Vercel → **Add New… → Project** → import
   `shaneowenmichelon-hub/College-Marketing-Agency-site`. Framework auto-detects
   **Next.js** — no build settings to change.
3. Under **Environment Variables**, add every var from the table above (at minimum the
   three email vars for launch). Apply to Production (and Preview if you want).
4. Pick this branch (or merge it to your default branch first) and **Deploy**.

### 6. Custom domain
- Vercel → Project → **Settings → Domains** → add `collegiatehospitality.com`.
- Add the DNS records Vercel shows at your registrar; wait for verification + HTTPS.
- Update `url` and `companyDomain` in `site.config.ts` to the live domain and redeploy.

### 7. Post-launch checks
- Submit real test leads (brand + student + lead magnet) → confirm emails + `[lead]` logs.
- Confirm analytics events in GA/GTM real-time.
- Run **Lighthouse** on Home, a service page, and the ambassador form.

---

## Notes

- **Runtime:** API routes run on the Node runtime (`export const runtime = "nodejs"`) so
  the email SDK works — don't switch them to edge.
- **Node:** `>=18.18` (pinned in `package.json` `engines`), which Vercel satisfies by
  default.
- **Accessibility:** semantic landmarks, labeled fields, visible focus, skip link, cookie
  dialog, reduced-motion support, AA-minded contrast.
- **Attribution & privacy:** UTM/referrer are captured with submissions and shown in the
  internal email; PII is never placed in URLs or analytics events.

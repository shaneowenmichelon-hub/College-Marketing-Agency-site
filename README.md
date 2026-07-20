# Campus Marketing & Events Agency — Website

A modern, production-quality marketing site for a college marketing & events agency
that connects **brands** with **college students** through three services — **Events,
Brand Ambassadors, and Influencers** — and recruits **students** as paid ambassadors.

Built with Next.js (App Router) + TypeScript, Tailwind CSS, Framer Motion, and
lucide-react. All copy is original; all unverified numbers are visible `[X]`
placeholder tokens so nothing reads as fabricated proof.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
```

Other scripts:

```bash
npm run build    # production build (typecheck + lint)
npm run start    # serve the production build
npm run lint     # eslint
```

No secrets or paid services are required to run. The two forms validate, log to the
server console, and return success out of the box.

---

## Project structure

```
src/
  app/                       # routes (App Router)
    page.tsx                 # Home
    services/
      events/                # /services/events
      brand-ambassadors/     # /services/brand-ambassadors
      influencers/           # /services/influencers
    work/                    # /work — case-study placeholders
    about/                   # /about
    insights/                # /insights + /insights/[slug] article template
    contact/                 # /contact — brand lead form
    become-an-ambassador/    # /become-an-ambassador — student application
    terms/  privacy/         # legal placeholders
    api/
      contact/route.ts       # POST — validate + log + success (TODO: real endpoint)
      apply/route.ts         # POST — validate (18+, .edu) + log + success
    sitemap.ts  robots.ts  icon.svg  layout.tsx
  components/                # reusable UI, sections, forms, motion primitives
  lib/                       # utils (validation, dates) + placeholder content
  site.config.ts             # ⭐ SINGLE SOURCE OF TRUTH
  styles/globals.css         # design tokens (CSS vars), grain/mesh, base styles
public/                      # og.svg + place for real assets
```

### Design system

Color tokens live as CSS variables in `src/styles/globals.css` and are wired into
Tailwind in `tailwind.config.ts` — reference them as `bg-ink`, `text-accent`,
`bg-surface-muted`, etc. Never scatter raw hex in components.

| Token             | Value     | Use                                  |
| ----------------- | --------- | ------------------------------------ |
| `--ink`           | `#0B0B0F` | dark hero / CTA bands / footer       |
| `--surface`       | `#FFFFFF` | light content sections               |
| `--surface-muted` | `#F4F4F6` | alternating light band               |
| `--accent`        | `#5A4BFF` | electric indigo — CTAs / links       |
| `--accent-2`      | `#D4FF4F` | acid lime — highlights / badges      |

Fonts: **Space Grotesk** (display) + **Inter** (body), self-hosted via `next/font`.
Motion is Framer Motion, gated behind `prefers-reduced-motion` everywhere.

---

## Everything is driven by `site.config.ts`

Company name, contact info, stat tokens, the campus list, nav, socials, the budget
ranges, and the ZMM-credibility toggle all live in **`src/site.config.ts`**. Editing
that one file re-brands and re-configures the whole site — nothing is hard-coded in
components.

- `companyName` — currently the swappable token `"[ insert company name ]"`.
- `showCredibility` — toggle the "backed by the team behind ZMM Events & the Night
  School college tour" line on/off site-wide.
- `stats` — placeholder `[X]` tokens rendered literally.
- `campuses` — the real 20-market network.

---

## ✅ Customize before launch

1. **Name it.** Set `companyName` in `src/site.config.ts`. (Optionally swap the
   `<Logo />` wordmark in `src/components/Logo.tsx` for an SVG.)
2. **Fill the stat tokens.** Replace every `[X]` in `site.config.ts` `stats` and in the
   service-page `proof` strips / case studies with real, verified numbers — or leave
   them as tokens until you have them. Don't invent figures.
3. **Contact + socials.** Real email, phone, location, and social links in
   `site.config.ts`.
4. **Logos & testimonials.** Replace the "Client logo" marquee slots and the
   "Testimonial — to be added" cards with real, approved assets
   (`src/components/Placeholders.tsx`, home page).
5. **Imagery.** Swap the gradient `PlaceholderImage` blocks for real photography
   (`src/components/Placeholders.tsx`). Never hotlink or reuse a competitor's images.
6. **Wire the forms.** Set `CONTACT_ENDPOINT` and `APPLY_ENDPOINT` (see `.env.example`)
   and implement the forwarding in `src/app/api/contact/route.ts` and
   `src/app/api/apply/route.ts` (marked `// TODO`). The ambassador application also has
   a `// TODO: connect to the student portal / marketplace` hand-off.
7. **Insights.** Replace the 3 placeholder posts in `src/lib/content.ts` (or wire the
   `[slug]` template to MDX / a CMS).
8. **Legal.** Replace `/terms` and `/privacy` placeholder copy with counsel-reviewed text.
9. **SEO.** Set the production domain in `site.config.ts` `url` (drives metadata,
   sitemap, robots). Replace `public/og.svg` with a branded OG image if desired.
10. **Review copy** end to end in your final brand voice.

---

## Deploy to Vercel

1. Push this repo to GitHub (already on the working branch).
2. In Vercel → **New Project** → import the repo. Framework preset auto-detects
   **Next.js**; no build config changes needed.
3. (Optional) Add `CONTACT_ENDPOINT` and `APPLY_ENDPOINT` env vars in Project Settings
   once the forms are wired.
4. Deploy. Set your custom domain and update `url` in `site.config.ts`.

---

## Notes

- Accessibility: semantic landmarks, labeled fields, visible focus states, skip link,
  AA-minded contrast, and reduced-motion support.
- Forms are anti-spam'd with a honeypot field and validated both client- and
  server-side (the 18+ gate and `.edu` check run in both places).
- The ambassador resume upload is client-only (filename shown, no storage) — real
  uploads belong in the secure student portal, not this marketing site.

# SEO backlog

Ordered list. Checked items shipped in the 2026-10-20 technical SEO pass.
Anything still open needs a content pass or an owner decision; it is not a
code change this list can finish on its own.

## Done

- [x] Homepage title and meta description lead with college / campus marketing agency, campus events, and brand ambassador programs. Title is within 60 characters.
- [x] Title template is `%s | Collegiate Agency`. Titles that already include the brand are not suffixed again, and a title is left without the suffix when adding it would pass 60 characters. The 404 page has its own title.
- [x] Organization and ProfessionalService share one `@id`, with a logo and a city-level New York address (no street). A WebSite node is on every page. `/services/events` and `/services/brand-ambassadors` emit Service JSON-LD, and their breadcrumbs include Services.
- [x] Public pages emit their own `og:url`, `og:title`, `og:description`, and Twitter title and description, matching that page's canonical URL.
- [x] `sos-consultants-nola-campus-leasing-ambassadors` and `nutrl-night-school-tour-product-placement` live at `/work/<slug>`. The `/insights/` copies 301 there and are out of the sitemap and article listings.
- [x] Sample case studies (`sample: true`, currently Celsius) are `noindex` and excluded from the sitemap.
- [x] Sitemap `lastmod` uses each post's `dateModified` or `date`, case-study publish dates, and 2026-10-20 for the static routes updated in this pass.
- [x] `llms.txt` links to `/services/events` and `/services/brand-ambassadors`, points product placement at `/services` because it has no page, and opens with a one-line definition of Collegiate Agency.

## Remaining

- [ ] `www.collegiateagency.com` currently 302s to a Vercel login. Needs a Vercel domain change by the owner (attach `www` to the production project and redirect it to the apex).
- [ ] Collegiate-Agency-owned `sameAs` profiles and the public contact email. The site still publishes the ZMM Events Instagram, Night School Instagram, zmm.events, and `shane@zmmevents.com`. Owner decision; do not swap these in code until the owner confirms the replacements.
- [ ] Bing verification. Set `NEXT_PUBLIC_BING_SITE_VERIFICATION` to the HTML-tag token from Bing Webmaster Tools. The layout already emits `msvalidate.01` when the variable is present.
- [ ] Expand `/services/brand-ambassadors` and `/services/events` into primary ranking pages, with an on-page FAQ and FAQPage schema.
- [ ] FAQ blocks with FAQPage schema rendered from frontmatter on the commercial articles: `college-marketing-agency`, `campus-marketing-agency-rfp`, `campus-brand-activation-agency`, `college-brand-ambassador-program`.
- [ ] Consolidate cannibalizing article clusters so one URL is the canonical page for each topic and the others support it:
  - Ambassadors: `college-brand-ambassador-program`, `college-brand-ambassadors`, `student-ambassador-marketing`, `student-brand-reps`
  - Sampling: `campus-product-sampling-ideas`, `on-campus-product-sampling`
  - Gen Z: `gen-z-marketing`, `gen-z-experiential-marketing`
  - Influencers: `campus-influencers`, `student-influencer-marketing`
  - Activations: `campus-activation-ideas`, `university-activations`, `campus-brand-activation-agency`
  - Strategy: `college-marketing-strategy`, `how-to-market-to-college-students`
  - Sponsorship: `college-event-sponsorship`, `college-festival-sponsorship`
- [ ] Internal links for articles that currently have none in the body: `campus-ambassador-content-rights`, `campus-brand-activation-agency`, `campus-event-accessibility-checklist`, `campus-field-marketing-agency`. Add a body link to `/about` from editorial pages that should introduce the company.
- [ ] Person schema for the people on `/about`, and a stronger about page (bios, roles, and the same Person nodes).
- [ ] Thin pages: `/build-a-campaign`, `/contact`, and `/work` need more indexable copy than a form, a short pitch, or a card grid.
- [ ] Homepage mobile LCP was 4.2s on the 2026-10-20 audit (about 360 KB of HTML and 74 images). Lazy-load the marquees that are below the first view.
- [ ] Redirect the `*.vercel.app` host to `https://collegiateagency.com`.
- [ ] Off-site listings need owner approval before anyone creates or claims them: Clutch, DesignRush, Sortlist, a LinkedIn company page, Google Business Profile, Bing Places, and Flytedesk listicles.

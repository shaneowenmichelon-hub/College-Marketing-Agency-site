# SEO backlog

Ordered list. Checked items have shipped.
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
- [x] `llms.txt` links to `/services/events` and `/services/brand-ambassadors` and opens with a one-line definition of Collegiate Agency. Product placement now has its own page, linked below.
- [x] `/services/brand-ambassadors` and `/services/events` are expanded as primary ranking pages, with a visible FAQ and FAQPage JSON-LD generated from the same questions and answers.
- [x] Homepage mobile LCP: the hero H1 is plain server HTML, not a Framer Motion entrance that starts at opacity 0. Collage photos and logo marquees stay lazy and low priority.
- [x] `/pricing` publishes only the rates already in `pricing` (`$150` per ambassador per month, `$2,500` per campus, event packages from `$500` to `$500,000`). Visible FAQ and FAQPage JSON-LD match. Service/Offer schema is emitted only for those three rates. Nav, footer, and the service pages link to it.
- [x] `/services/product-placement` is a real service page (the old redirect to `/services` is gone). It uses the Greek-life placement copy and the `$2,500` rate already in the repo, with Service, FAQPage, and breadcrumb JSON-LD.
- [x] IndexNow: public key file at `/{key}.txt`, a postbuild ping, a startup ping, and a production cron. Submissions are sitemap URLs whose `lastmod` is inside 72 hours.
- [x] Generated text-only OG and Twitter images on the public routes that were missing them, including `/pricing` and `/services/product-placement`. The homepage hero collage duplicate now uses the same alt text as the first copy.
- [x] `llms.txt` and the sitemap list `/pricing` and `/services/product-placement`. `/feed.xml` is the insights RSS feed, and public pages link it with `rel="alternate"`.
- [x] Organization `sameAs` includes the live Clutch and Sortlist profiles, plus the existing LinkedIn page. The ZMM Events Instagram, Night School Instagram, and zmm.events links stay.
- [x] Organization `logo` is a 512×512 PNG rendered from `/logo.svg`.
- [x] `/rss.xml` permanently redirects to `/feed.xml`.
- [x] IndexNow startup ping reads the public production sitemap. The deployment hostname is behind Vercel SSO, so the previous fetch aborted or submitted nothing.
- [x] Homepage mobile accessibility: ink type on magenta and orange fills, full-strength text on the colored cards, solid caption chips, a named star graphic, and a coin control whose name includes the visible "CA".
- [x] FAQ blocks with FAQPage schema rendered from frontmatter on `college-marketing-agency`, `campus-marketing-agency-rfp`, `campus-brand-activation-agency`, and `college-brand-ambassador-program`. The visible questions and the FAQPage JSON-LD use the same answers.
- [x] Body links on `campus-ambassador-content-rights`, `campus-brand-activation-agency`, `campus-event-accessibility-checklist`, and `campus-field-marketing-agency`, including `/about` where the article names Collegiate Agency.
- [x] `/services` title, meta description, Open Graph, Twitter, and WebPage JSON-LD name campus marketing services for brands. The hero is brand-framed. Student recruiting stays lower on the page. The unsourced Celsius "45K cans sampled / month" stat and the placeholder metrics in that same block are no longer rendered.
- [x] Insight articles byline Shane Michelon, Founder, with Article/BlogPosting author as a Person (`https://collegiateagency.com/#shane-michelon`) that worksFor the organization. The LinkedIn profile is the only author URL. Publisher stays the organization. A non-default frontmatter `author` can still override the name.
- [x] Person schema on `/about` for the people shown there, with Shane Michelon reusing the shared Founder Person node, plus a stronger brand-framed about page.
- [x] `/work`, `/contact`, and `/build-a-campaign` now have server-rendered indexable copy (unique titles, descriptions, and breadcrumb JSON-LD). `/contact` adds a visible FAQ whose FAQPage JSON-LD uses the same answers. Sample case studies stay noindex.
- [x] Public production aliases `college-marketing-agency-site.vercel.app` and `college-marketing-agency-site-s8tw.vercel.app` permanently redirect to the same path and query on `https://collegiateagency.com`. `/api/*` stays on those hosts. Preview, per-deployment, and SSO-only team aliases are not redirected.

## Remaining

- [ ] `www.collegiateagency.com` was returning a Vercel login on 2026-10-20. The 2026-10-22 evening re-audit saw 308s to the apex. Leave the domain attachment to the owner if a project still needs it; do not treat this as a content change.
- [ ] The public contact email is still `shane@zmmevents.com`, and Organization `sameAs` still includes the ZMM Events Instagram, Night School Instagram, and zmm.events. Owner decision; do not swap these in code until the owner confirms the replacements. Clutch, Sortlist, and LinkedIn are already included.
- [ ] Bing verification. Set `NEXT_PUBLIC_BING_SITE_VERIFICATION` to the HTML-tag token from Bing Webmaster Tools. The layout already emits `msvalidate.01` when the variable is present.
- [ ] Consolidate cannibalizing article clusters so one URL is the canonical page for each topic and the others support it:
  - Ambassadors: `college-brand-ambassador-program`, `college-brand-ambassadors`, `student-ambassador-marketing`, `student-brand-reps`
  - Sampling: `campus-product-sampling-ideas`, `on-campus-product-sampling`
  - Gen Z: `gen-z-marketing`, `gen-z-experiential-marketing`
  - Influencers: `campus-influencers`, `student-influencer-marketing`
  - Activations: `campus-activation-ideas`, `university-activations`, `campus-brand-activation-agency`
  - Strategy: `college-marketing-strategy`, `how-to-market-to-college-students`
  - Sponsorship: `college-event-sponsorship`, `college-festival-sponsorship`
- [ ] Off-site listings still to confirm or finish: DesignRush, GoodFirms, Google Business Profile, Bing Places, and Apple Business. LinkedIn, Clutch, and Sortlist are already live and in `sameAs`. Do not invent a phone number or street address to match the directory NAP.

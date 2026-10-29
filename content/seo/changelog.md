# SEO changelog

## 2026-10-29 — Public vercel.app aliases redirect to the apex

Requests to the public production aliases now 308 to the same path and query on `https://collegiateagency.com`. No article bodies, photos, or the photo-usage ledger were edited. `scripts/collegiate_seo_autopublish.py`, `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited.

- The hosts are `college-marketing-agency-site.vercel.app` and `college-marketing-agency-site-s8tw.vercel.app`. The second is a separate Vercel project that deploys this same repo and was also serving the site with `index, follow` and a canonical on the apex. The match is the exact host. Preview URLs, per-deployment URLs, and the SSO-protected team aliases are not matched. Those already send `x-robots-tag: noindex`.
- `/api/*` is excluded. Vercel Cron GETs the production deployment URL (documented as `https://*.vercel.app/api/cron`) and does not follow a redirect. The three cron paths are `/api/cron/article-art`, `/api/cron/mail-sync`, and `/api/cron/indexnow`. Gmail OAuth and the other route handlers are under `/api` as well. IndexNow does not fetch the vercel.app host: the postbuild ping runs during the build, the startup hook reads `https://collegiateagency.com/sitemap.xml`, and the cron route builds the sitemap in-process.
- The rules live in `vercel.json` so the edge applies them before the cached HTML, and in `next.config.mjs` so the Next.js manifest matches. `www.collegiateagency.com` was already 308 to the apex and was left as it is.

## 2026-10-28 — Indexable copy on the thin pages

`/work`, `/contact`, and `/build-a-campaign` now have server-rendered copy a search engine or answer engine can quote. No article bodies, photos, or the photo-usage ledger were edited. The public contact email and the published location line were not changed. `scripts/collegiate_seo_autopublish.py`, `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited.

- `/work` title is `Campus marketing case studies | Collegiate Agency`. The page says Collegiate Agency is a college and campus marketing agency brands hire for campus events, brand ambassador programs, and product placement. Each card adds the challenge already stored on that case study. The Celsius card stays an industry example. Its detail URL stays `noindex` and out of the sitemap.
- `/contact` title is `Contact the college marketing agency | Collegiate Agency`. The copy names who the form is for (brands, in-house marketing teams, and agencies), the one-business-day reply already published on the pricing page, and what the form asks for. Four visible questions use that same material. FAQPage JSON-LD is built from those questions. Breadcrumb JSON-LD is Home → Contact. The email and office lines still come from `siteConfig`.
- `/build-a-campaign` title is `Build a college marketing campaign | Collegiate Agency`. The page explains the builder steps and the starting estimate, using the published ambassador, product-placement, and event rates, then links to the pricing page and the three service pages. The builder itself is unchanged except its step title is an `h2` under the page `h1`.
- Open Graph and Twitter title and description match each page's document title and meta description. Sitemap `lastmod` for the three URLs is 2026-10-28.

## 2026-10-27 — Person schema and a stronger about page

`/about` now names Collegiate Agency as a college marketing agency brands hire, and it emits Person JSON-LD for the people shown on the page. No article bodies, photos, or the photo-usage ledger were edited. `scripts/collegiate_seo_autopublish.py`, `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited.

- The document title is `About the college marketing agency | Collegiate Agency` (54 characters). The meta description, Open Graph, and Twitter text are the same brand-framed description: brands hire Collegiate Agency for campus events, brand ambassador programs, and product placement, and Shane Michelon is Founder.
- Shane Michelon on `/about` uses the shared Person node `https://collegiateagency.com/#shane-michelon`: name Shane Michelon, jobTitle Founder, worksFor the organization `@id`, and the LinkedIn URL in `sameAs` only. The visible founder section uses that same name, title, and LinkedIn URL. ZMM Events and SOS Consultants are not on his Person node or his bio. His team-card title is Founder.
- Zach Maitlin, AJ Deaugustine, and Ronan Rolstan each have a Person node built from the name, role, and headshot already on the team list, with worksFor the organization. No bios, credentials, or profile links were added for them.
- The AboutPage/WebPage node at `https://collegiateagency.com/about#webpage` sets mainEntity to the organization and those Person `@id`s. Organization `founder` points at Shane Michelon's Person `@id`.
- The page links to `/services`, `/services/brand-ambassadors`, `/services/events`, `/services/product-placement`, `/pricing`, `/work`, and `/contact`. The figures table repeats `siteConfig.stats` from the homepage and does not add a number. Ambassador recruiting stays as the secondary call to action.
- Sitemap `lastmod` for `/about` is 2026-10-27.

## 2026-10-26 — Insight bylines credit Shane Michelon

Visible bylines and Article JSON-LD on `/insights` credit Shane Michelon, Founder, instead of the organization. No article bodies, FAQs, photos, or the photo-usage ledger were edited. `scripts/collegiate_seo_autopublish.py`, `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited.

- The default author is `articleAuthor` in `site.config.ts`. The content loader, the insight template, and Article JSON-LD all use it. Omitting `author`, or setting it to `Collegiate Agency` or `Shane Michelon`, renders "By Shane Michelon" with "Founder, Collegiate Agency" beneath. The name links only to https://www.linkedin.com/in/shane-michelon-189549227 with `rel="author noopener"`.
- Existing articles keep `author: Collegiate Agency` in frontmatter. That legacy value is the old default, so the template resolves it to Shane. A different frontmatter name still overrides the byline. No biography, headshot, credentials, or other profiles were added.
- Article and BlogPosting JSON-LD author is one Person node, `https://collegiateagency.com/#shane-michelon`: name Shane Michelon, jobTitle Founder, worksFor the organization `@id`, and the LinkedIn URL in `sameAs` only. Publisher stays the organization.
- `/feed.xml` credits each item to that author. `/rss.xml` still redirects to `/feed.xml`. `llms.txt` and `llms-full.txt` name Shane Michelon, Founder, on the articles.
- `writing-rules.md`, `briefs/_template.md`, and `publisher-operations.md` state that bylines are Shane Michelon, Founder. The publisher script does not hard-code an article author. `author` is not in its required frontmatter list. The prompt says to follow the existing frontmatter schema. It does hard-code `imageCredit: Collegiate Agency` for owned photos, which is the photo credit, not the byline.

## 2026-10-26 — Student housing marketing agency article

Run 34. A buyer hiring guide for `student housing marketing agency`, published at `/insights/student-housing-marketing-agency`. No new prices, client results, or testimonials. The contact email and `sameAs` list were left as published.

- The article separates digital-only student housing work (search, paid media, websites, branding) from on-campus execution for pre-leasing and lease-up. It cites GTMA's August 17, 2026 article for the digital scope and the October-to-April search sequence. The only Collegiate result is the published SOS Consultants Nola case study: a $2,500 package, two shows, an on-site activation, ambassador posts, localized Meta ads, and an 11x return on ad spend. Competitor occupancy figures are omitted. The ambassador program is linked at `/services/brand-ambassadors` and is not restated.
- Rates in the article are the ones already on `/pricing`: $150 per ambassador per month, and event packages from $500 to $500,000. The case-study package is labeled as that case study, not as the rate card.
- Photo use: hero `dazed-branded-hats-activation.jpg`, inline `nutrl-attendees-sponsored-show.jpg` and `nutrl-crowd-campus-event.jpg`. Each was on six articles, so this is the seventh and last appearance under the cap. The hero is a third use because no agency-eligible photo was still under two hero uses. No setup frame remained under the cap. The premiere step-and-repeat stayed off this agency slug.
- Keyword map lockout, Run 34 research note, publish log, pre-article brief, and photo ledger are updated with the article. Sitemap `lastmod` follows the post date.
- Live check on 2026-10-26 at 16:11 CDT confirmed `https://collegiateagency.com/insights/student-housing-marketing-agency`. The repo autopublish receipt records that time, the hero image hash, word count 1614, and the next 36-hour eligibility (jitter 340 seconds). The scheduler's own copy still lives outside this repo.

## 2026-10-26 — Services page positioning and unsourced sampling stat

The `/services` search snippet framed Collegiate Agency as serving brands and students, and the homepage work teaser rendered an unsourced Celsius sampling figure. No article bodies were edited. The contact email and `sameAs` list were left as published.

- `/services` document title is `Campus Marketing Services for Brands | Collegiate Agency`. The lead is short enough that the brand suffix is added once, and the title is absolute so the root template does not add it again. The meta description, Open Graph, Twitter, and WebPage JSON-LD use the same brand-only description: campus marketing services for brands, covering brand ambassador programs, campus events and activations, and product placement, run end to end. Student opportunities are not in that snippet.
- The visible H1 is "Campus marketing services for brands." Events, ambassadors, and product placement are the page body. Ambassador recruiting remains below that, at `#for-students`.
- The Celsius industry example no longer publishes `45K cans sampled / month`, or the unsourced `120+` campuses, `18%` opt-in, and `32%` trial-to-repeat figures that sat in the same stat block. Homepage cards, `/work`, the case-study page, its metadata, and `llms.txt` no longer render them. No replacement number was added.
- Sitemap `lastmod` for `/` and `/services` is 2026-10-26.

## 2026-10-25 — Greek life marketing agency article

Run 33. A buyer hiring guide for `greek life marketing agency`, published at `/insights/greek-life-marketing-agency`. No new prices, client results, or testimonials. The contact email and `sameAs` list were left as published.

- The article is an evaluation guide: chapter versus council programs, the recruitment, philanthropy, and formal calendar, and alcohol and sponsorship rules from the NIC Alcohol and Drug Guidelines, the NPC campus-safety position statement (adopted 2019, amended 2025), and the University of Pittsburgh 2026-2027 fraternity and sorority manual. It points at `/services/product-placement` and uses only the rates already in `pricing`.
- New articles may link `/services/product-placement` as a service destination. The old publisher ban treated that URL as removed. The page has been live since 2026-10-22. `/services#product-placement` still counts.
- Photo use: hero `beatbox-stage-crowd-festival.jpg`, inline `bloom-sampling-campus-nightlife.jpg` and `beatbox-trio-venue-activation.jpg`. Each was already on six articles, so this is the seventh and last appearance under the cap. No setup frame remained under the cap. The premiere step-and-repeat stayed off this agency slug.
- Keyword map lockout, Run 33 research note, publish log, pre-article brief, and photo ledger are updated with the article. Sitemap `lastmod` follows the post date.
- Live check on 2026-10-25 at 03:56 CDT confirmed `https://collegiateagency.com/insights/greek-life-marketing-agency`. The repo autopublish receipt records that time, the hero image hash, word count 1698, and the next 36-hour eligibility. The scheduler's own copy still lives outside this repo.

## 2026-10-23 — Writing-quality gate, pre-article briefs, reserved keywords

No article bodies were edited. No article was published. Keyword-lockout timing and the 36-hour cadence were left as they were.

- New articles must follow `content/seo/writing-rules.md`. `scripts/writing_quality.py` rejects banned phrases, em dashes, and an opening paragraph longer than 3 sentences before commit. Existing articles are not checked by the build.
- Each new article needs `content/seo/briefs/<slug>.md`, copied from `content/seo/briefs/_template.md`, before drafting. The publisher commits that brief with the article.
- `content/seo/keyword-map.md` now has a permanent "Reserved for pillar pages, never target" section. A new article cannot target those terms or a close variation. `gen z experiential marketing` remains a separate keyword.

## 2026-10-20 — Technical SEO fixes

Metadata, structured data, canonicals, and the sitemap. No article bodies were edited, and the contact email and `sameAs` list were left as published.

- Homepage title is `College Marketing Agency | Collegiate Agency`. The meta description now leads with college and campus marketing for campus events and brand ambassador programs.
- Root title template is `%s | Collegiate Agency`. Page titles are absolute, so a title that already names Collegiate Agency is not suffixed again. The brand is omitted when adding it would push the title past 60 characters. `/404` uses `Page not found | Collegiate Agency` instead of the homepage title.
- Organization and ProfessionalService are one node at `https://collegiateagency.com/#organization`, with the existing mark at `/logo.svg` and a PostalAddress of New York, NY, US. The contact-page line "Brand partnerships and campus activations" is no longer emitted as `streetAddress`. A WebSite node points at that organization. `/services/events` and `/services/brand-ambassadors` emit Service JSON-LD (prices still come from `pricing` in `site.config.ts`) and their breadcrumbs are Home → Services → the service.
- Each public page sets `og:url`, `og:title`, `og:description`, and the matching Twitter tags from its own title, description, and canonical path. The root layout no longer forces the homepage values onto child routes.
- `/insights/sos-consultants-nola-campus-leasing-ambassadors` and `/insights/nutrl-night-school-tour-product-placement` 301 to the matching `/work/` URLs. They are removed from article listings, `llms.txt` articles, and the sitemap. `/work/` remains the canonical home.
- Case studies with `sample: true` (Celsius) are `noindex, follow` and are omitted from the sitemap. They stay on `/work` with the existing industry-example label.
- Sitemap `lastmod` uses post `dateModified` when frontmatter has it, otherwise `date`. The two real case studies use the publish dates already stored with those write-ups (2026-08-03 and 2026-08-02). Static routes updated here use 2026-10-20.
- `llms.txt` links Events and Brand Ambassadors to `/services/events` and `/services/brand-ambassadors`. Product placement links to `/services` because that channel has no standalone page. The file opens with a one-line definition of Collegiate Agency. The contact email is unchanged.

## 2026-10-21 — Service page FAQs

Visible FAQs on the two service detail pages, plus matching FAQPage JSON-LD. No article bodies were edited, and the contact email and `sameAs` list were left as published.

- `/services/brand-ambassadors` and `/services/events` each render six visible questions. FAQPage JSON-LD is built from that same list and sits beside the existing Service and Breadcrumb JSON-LD.
- Answers use the service-page copy, `pricing` and the campus count in `site.config.ts`, the campaign builder's one-business-day reply and monthly length, and the approach text already on the SOS Consultants Nola and NÜTRL case studies. No new stats, client results, or a fixed number of weeks to launch.
- A short section above each FAQ links to the matching `/work` case study, the closest `/insights` articles, `/build-a-campaign`, and `/contact`.
- Sitemap `lastmod` for those two URLs is 2026-10-21. Other static routes stay on 2026-10-20.

## 2026-10-22 — Homepage mobile LCP

The homepage H1 was in the server HTML at `opacity: 0`. The hero entrance started hidden in Framer Motion, so the headline stayed invisible until hydration. No article bodies were edited, and the contact email and `sameAs` list were left as published.

- Measured on a local production build with Lighthouse 12.8.2, mobile emulation, simulated throttling. Before (2026-10-22 10:11:49–10:12:43 EDT): LCP 4.5 s then 4.4 s, performance 0.83 then 0.85. After (2026-10-22 10:36:47–10:37:13 EDT): LCP 3.5 s then 3.6 s, performance 0.91 both runs. CLS stayed 0.
- In those same runs the trace LCP, without the throttling simulation, moved from 1,058 ms and 949 ms to 134 ms and 124 ms, the same timestamp as first contentful paint. The H1 in the server HTML no longer has an opacity style.
- The headline is a plain `h1`. The lines under it still rise 24px. That animation does not change opacity, and it is turned off under `prefers-reduced-motion`.
- Hero collage photos and the logo marquee already used `loading="lazy"`. They are now also `fetchpriority="low"`.

## 2026-10-22 — Pricing, product placement, IndexNow, social images, RSS

On-site items from the 2026-10-22 research. No new blog posts. No new prices, discounts, client results, or testimonials. The contact email and `sameAs` list were left as published. `scripts/collegiate_seo_autopublish.py`, `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited.

- `/pricing` states the three rates already in `pricing` in `site.config.ts`: `$150 / ambassador / month`, `$2,500 / campus`, and event packages from `$500` to `$500,000`. The `$500` floor is that published range, not a separate line item. Anything the table does not cover, including extra Greek-life organizations, is described as quoted per campaign. The page has a real rate table, a visible FAQ, FAQPage JSON-LD from that same FAQ, Service/Offer JSON-LD for the three priced services only (unit price for ambassadors and product placement, min and max for events), breadcrumb JSON-LD, a canonical URL, and a contact CTA. It is in the nav, the footer, and the service pages.
- `/services/product-placement` replaces the redirect to `/services`. Copy is the offer already on the services hub and in `pricing`: 5 of the top Greek-life organizations per campus, dedicated media deliverables, and `$2,500` per campus. The NÜTRL Night School Tour case study is linked. The page does not add a ZMM or SOS pitch. The services hub keeps the `#product-placement` anchor so older links still land.
- IndexNow key `077cf0942574515362847cbe85bfeb60` is served at `/077cf0942574515362847cbe85bfeb60.txt`. `scripts/indexnow-ping.cjs` runs after `npm run build` and POSTs to `https://api.indexnow.org/indexnow` when `VERCEL_ENV=production` or `INDEXNOW_PING=1`. It sends sitemap URLs whose `lastmod` is within 72 hours. During the build the new deployment is not aliased yet, so that call can return 403 or 202. `src/instrumentation.ts` fetches this deployment's `/sitemap.xml` and sends the same payload once per production server instance after the deployment is up. It does not import the sitemap module, because that module reads the blog from disk and cannot be bundled for the edge instrumentation runtime. `/api/cron/indexnow` repeats it every 6 hours so a static deploy, and a later article publish, still gets submitted once the key file is reachable. A network failure does not fail the build.
- Text-only Open Graph and Twitter images, via the `opengraph-image` / `twitter-image` convention, are on `/about`, `/services`, `/services/events`, `/services/brand-ambassadors`, `/services/product-placement`, `/work`, case studies, `/contact`, `/build-a-campaign`, `/become-an-ambassador`, `/insights`, and `/pricing`. They name Collegiate Agency and the page. They do not use client logos.
- The seven homepage hero photos already had alt text on the first collage copy. The seamless-loop duplicate rendered `alt=""`. Both copies now use the descriptive alt. The duplicate stays `aria-hidden`.
- `llms.txt` points product placement at `/services/product-placement` and links `/pricing` and `/feed.xml`. Sitemap `lastmod` for `/pricing` and `/services/product-placement` is 2026-10-22. Other static routes keep their previous dates.
- `/feed.xml` is an RSS 2.0 feed of the insights posts. Public pages emit `<link rel="alternate" type="application/rss+xml" href="https://collegiateagency.com/feed.xml">`.

## 2026-10-22 — Profiles, raster logo, RSS alias, accessibility, IndexNow

On-site items from the evening re-audit. No new blog posts. No new prices, client results, or testimonials. The contact email is still `shane@zmmevents.com`. The ZMM Events Instagram, Night School Instagram, and zmm.events `sameAs` entries are unchanged. `scripts/collegiate_seo_autopublish.py`, `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited.

- Organization `sameAs` now also lists `https://clutch.co/profile/collegiate-agency` and `https://www.sortlist.com/agency/collegiate-agency`. Both URLs returned the Collegiate Agency profile on 2026-10-22. They are not added to the footer. LinkedIn stays.
- `public/logo.png` is a 512×512 render of `public/logo.svg`. Organization `logo` and the article publisher logo point at `/logo.png`.
- `/rss.xml` is a permanent redirect (308) to `/feed.xml`.
- Homepage color contrast: magenta and orange fills use ink type, because white on those fills is under 4.5:1. Body copy on the service and journey cards is full strength instead of 80–90% opacity. Price chips and photo captions use a solid surface so the type does not sit on a translucent wash. The star row is an image with an accessible name. The campus coin's name includes the visible "CA". Placeholders use the existing muted ink instead of Tailwind's gray-400.
- IndexNow: on the 2026-10-22 batch 3 production deployment, `postbuild` logged `indexnow: status=202 urls=14`. The startup hook then logged `AbortError` or `status=0 urls=0` because it fetched `https://$VERCEL_URL/sitemap.xml`, and that deployment hostname is behind Vercel SSO. It now fetches `https://collegiateagency.com/sitemap.xml` and only marks the deployment done after a 200, a 202, or an empty window. `/api/cron/indexnow` is unchanged and, called on the apex at 2026-10-22 22:21:50 UTC, returned IndexNow status 200 for 14 URLs. Homepage `lastmod` is 2026-10-22.

## 2026-10-23 — Commercial article FAQs and body links

Visible FAQs on four commercial articles, plus matching FAQPage JSON-LD from the same frontmatter. Contextual body links on the four articles that still needed them. No new articles. No new prices, client results, or testimonials. The contact email and `sameAs` list were left as published. `content/seo/publish-log.md` and `content/seo/autopublish-state.json` were not edited.

- `college-marketing-agency`, `campus-marketing-agency-rfp`, `campus-brand-activation-agency`, and `college-brand-ambassador-program` each render five questions from a `faq` list in frontmatter. The visible block and the single FAQPage JSON-LD use the same question and answer text. Answers stay inside the article and the published rates: `$150 / ambassador / month`, `$2,500 / campus`, and event packages from `$500` to `$500,000`.
- `campus-ambassador-content-rights`, `campus-brand-activation-agency`, `campus-event-accessibility-checklist`, and `campus-field-marketing-agency` each gained body links to `/about`, `/pricing`, and a related existing article or service page. `campus-brand-activation-agency` now points product placement at `/services/product-placement`.
- `dateModified` on those articles is 2026-10-23, so the sitemap `lastmod` moves with the revision. Slugs and titles are unchanged.

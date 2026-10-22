# SEO changelog

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
- IndexNow key `077cf0942574515362847cbe85bfeb60` is served at `/077cf0942574515362847cbe85bfeb60.txt`. `scripts/indexnow-ping.cjs` runs after `npm run build` and POSTs to `https://api.indexnow.org/indexnow` when `VERCEL_ENV=production` or `INDEXNOW_PING=1`. It sends sitemap URLs whose `lastmod` is within 72 hours. During the build the new deployment is not aliased yet, so that call can return 403 or 202. `src/instrumentation.ts` sends the same payload once per production server instance after the deployment is up. `/api/cron/indexnow` repeats it every 6 hours so a static deploy, and a later article publish, still gets submitted once the key file is reachable. A network failure does not fail the build.
- Text-only Open Graph and Twitter images, via the `opengraph-image` / `twitter-image` convention, are on `/about`, `/services`, `/services/events`, `/services/brand-ambassadors`, `/services/product-placement`, `/work`, case studies, `/contact`, `/build-a-campaign`, `/become-an-ambassador`, `/insights`, and `/pricing`. They name Collegiate Agency and the page. They do not use client logos.
- The seven homepage hero photos already had alt text on the first collage copy. The seamless-loop duplicate rendered `alt=""`. Both copies now use the descriptive alt. The duplicate stays `aria-hidden`.
- `llms.txt` points product placement at `/services/product-placement` and links `/pricing` and `/feed.xml`. Sitemap `lastmod` for `/pricing` and `/services/product-placement` is 2026-10-22. Other static routes keep their previous dates.
- `/feed.xml` is an RSS 2.0 feed of the insights posts. Public pages emit `<link rel="alternate" type="application/rss+xml" href="https://collegiateagency.com/feed.xml">`.

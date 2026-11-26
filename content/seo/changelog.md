# SEO changelog

## 2026-11-26 — Money-page inlinks on six articles

No new article. No new page. No redirect. No layout change. Titles, meta titles, meta descriptions, H1s, slugs, FAQs, short answers, and canonicals are unchanged. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited. No new statistic, client, result, or review was added.

A live crawl on Nov 26, 2026 found no contextual link to `/insights/college-marketing-agency` on these six articles. Each now has exactly one body link to that URL. The link sits in a sentence about choosing a partner. No other anchor on these pages was edited.

- `/insights/university-activations` — `college marketing agency`
- `/insights/campus-pop-up-activation` — `college marketing agency`
- `/insights/college-tailgate-marketing-agency` — `college advertising agency`
- `/insights/college-sports-marketing-agency` — `college ad agency`
- `/insights/college-creator-marketing-agency` — `student marketing agency`
- `/insights/college-app-marketing-agency` — `how to choose a college marketing agency`

`dateModified` is `2026-11-26` on those six files. Publish dates stay the same, so those six sitemap `lastmod` values are `2026-11-26`. `/insights` follows the newest-revision rule, so its sitemap `lastmod` moves to `2026-11-26`. Its title, copy, and FAQ were not edited. `/insights/topics/campus-events-and-activations` includes the university-activations and campus-pop-up articles, and `/insights/topics/student-influencers` includes the creator article, so those two hubs follow the same rule to `2026-11-26`. Their titles, copy, and FAQs were not edited.

## 2026-11-25 — College marketing for fashion brands

New insight at `/insights/college-marketing-for-fashion-brands`. Primary keyword `college marketing for fashion brands`. Buyer is an apparel, sneaker, or accessories brand hiring a campus partner. The page requires a sized drop, a code or QR the brand already tracks, a written yes before a sale on campus, a chapter yes at the published Greek-life rate, and a disclosure on a paid or gifted post. It links to `/insights/college-marketing-for-beauty-brands`, `/insights/campus-pop-up-activation`, and `/insights/greek-life-marketing-agency` instead of restating those guides. The one link to `/insights/college-marketing-agency` uses the anchor `college marketing agency`. `campus marketing agency` links to `/services`. The ambassador link uses `college brand ambassador agency` and points at `/services/brand-ambassadors`. Dated sources re-opened the same day are RetailBoss (September 12, 2026), EMARKETER (September 25, 2026), Marketing Dive (October 28, 2026), the Pacsun PR Newswire release (October 7, 2026), and the FTC endorsement guides (July 26, 2023). EMARKETER, Marketing Dive, and PR Newswire are named with their URLs in the sentences. Those three hosts returned Cloudflare 403 to the live verifier's HTTP client, so they are not markdown links. RetailBoss and the FTC page stay linked. No competitor performance figure, client result, or redemption forecast was added. Hero and two inline photos are owned activation frames outside the previous four articles. `date` and `dateModified` are 2026-11-25, so the article sitemap `lastmod` is 2026-11-25. The article is not assigned to a topic hub.

## 2026-11-25 — Four unindexed topic hubs 301 to their article owners

Shane Michelon approved this on Nov 25, 2026. No new article. No new page. `/insights/topics/student-influencers` and `/insights/topics/campus-events-and-activations` stay. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited. No new statistic, client, result, or review was added. No owner title, meta, H1, FAQ, or body was edited, so no owner `dateModified` moved.

Google's state for the retired hubs, as approved with this change: `/insights/topics/brand-ambassador-programs` was Discovered, not indexed. `/insights/topics/product-sampling-and-placement` was not indexed. `/insights/topics/campus-sponsorship` was not indexed. `/insights/topics/campus-marketing-strategy` was indexed and had 0 impressions since Nov 13.

Each hub now has `permanent: true` in `next.config.mjs` for the path and the trailing-slash path. Next.js serves `permanent: true` as 308. The built-in trailing-slash strip normally runs before those rules, which would make `/hub/` hop to `/hub` and then to the owner. `skipTrailingSlashRedirect` is set, and the same slash strip is the last redirect, so a trailing-slash hub URL reaches its owner in one hop. Other trailing-slash URLs still strip the slash. The four hubs are gone from `insightTopics`, so they are not rendered, not in the sitemap, not in the `/insights` topic links, not in article breadcrumbs, not in CollectionPage or ItemList JSON-LD, and not in `llms.txt` or `llms-full.txt`. Articles that used to sit in those hubs stay published and are no longer assigned to a hub. Internal links point at the owner, not at the hub.

- `/insights/topics/brand-ambassador-programs` → `/insights/college-brand-ambassador-program`. The hub title was college brand ambassador programs. This is the keyword-map URL for `college brand ambassador program`, and the guide already covers campus ambassador programs. `/services/brand-ambassadors` stays the hire page and is already linked from the guide.
- `/insights/topics/product-sampling-and-placement` → `/insights/on-campus-product-sampling`. That URL is already the primary for campus product sampling and student product sampling. `/insights/campus-product-sampling-agency` stays the narrower agency page.
- `/insights/topics/campus-sponsorship` → `/insights/college-event-sponsorship`. Redirect only. That article's title and meta were not edited.
- `/insights/topics/campus-marketing-strategy` → `/insights/college-marketing-strategy`. That is the closest strategy article. It is not `/insights/college-marketing-agency` and not the homepage.

Hub intros were collection lines ("these articles cover…"). The owners already cover those topics, and the sibling guides stay published, so no sentence was added to an owner.

## 2026-11-25 — Exact "campus marketing agency" anchors to /services

No new article. No new page. No redirect. No layout change. Titles, meta titles, meta descriptions, H1s, FAQs, and short answers are unchanged. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited. No new statistic, client, result, or review was added.

Google Search Console, sc-domain:collegiateagency.com, pulled Nov 25, 2026 ~9:30–9:35 AM CT. Query "campus marketing agency": 28 days, Oct 27–Nov 23, 208 impressions, 0 clicks, position 32.8; 7 days, Nov 17–23, 58 impressions, 0 clicks, position 40.3 (an earlier 7-day window, Nov 14–20, was 48 impressions, 0 clicks, position 34.1). Page × query, 7 days Nov 17–23: the money page 23 impressions, position 13.0; `/services` 16 impressions, position 39.4; `/work` 14 impressions, position 92.2; `/campus-marketing` 10 impressions, position 81.2. Nov 19–23, `/services` had 14 impressions at position 43.5. `/services` as a page, 7 days Nov 17–23: 172 impressions, 6 clicks, position 21.6.

A live crawl of all 78 sitemap URLs on Nov 25 found zero contextual links with the anchor "campus marketing agency" pointing at `/services`. Each of these four articles now has exactly one body link with that anchor and that href:

- `/insights/campus-marketing-agency-rfp` appends one sentence to the first body paragraph.
- `/insights/switching-campus-marketing-agencies` appends one sentence to the first body paragraph. The existing `/services` link with the anchor "product placement" stays.
- `/insights/campus-field-marketing-agency` inserts one sentence after "before the new pilot starts."
- `/insights/college-experiential-marketing-agency` keeps the money-page link and the anchor "how to choose a college marketing agency" to `/insights/college-marketing-agency`, and adds the `/services` anchor in that same paragraph.

`dateModified` is `2026-11-25` on those four files. Publish dates stay the same, so those four sitemap `lastmod` values are `2026-11-25`. `/insights` was already `2026-11-25` from the HBCU article, and this edit does not move it. `/insights/topics/campus-marketing-strategy` was already `2026-11-25` from that article. `/insights/topics/campus-events-and-activations` follows the newest-revision rule, so its sitemap `lastmod` moves from `2026-11-24` to `2026-11-25`. Its title, copy, and FAQ were not edited.

## 2026-11-25 — HBCU marketing agency title, meta, and FAQ for click-through

No new article. No new page. No redirect. No layout change. The slug stays `/insights/hbcu-marketing-agency`. The existing body link to `/insights/college-marketing-agency` stays. Hub pages under `/insights/topics/` were not edited. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited. No new statistic, client, result, HBCU campus served, or review was added. The byline stays Shane Michelon, Founder. The inquiry path stays the form.

Google Search Console, sc-domain:collegiateagency.com, Web, Oct 26–Nov 22 2026, pulled Nov 25, 2026 9:31 AM CT. `/insights/hbcu-marketing-agency` had 59 impressions, 0 clicks, average position 4.9. Queries on that page: "which campus marketing companies specialize in reaching hbcu students?" 9 impressions, position 5.3, 0 clicks; "how do i measure an advertising campaign aimed at hbcu students?" 9, position 4.6; "how can brands advertise to hbcu students?" 4, position 6.5; "how do i advertise to black college students?" 3, position 3.7. Review date Dec 9, 2026.

The document title, Open Graph title, and Twitter title are `HBCU Marketing Agency: How Brands Reach HBCU Students` (53 characters). `resolveDocumentTitle` appends ` | Collegiate Agency` only when the result still fits. That suffix would make this lead 73 characters, which is past the shared 60-character cap, so the resolver publishes the lead without the brand. The H1 is `HBCU marketing agency: How Brands Reach HBCU Students`, so the exact phrase "HBCU marketing agency" is in the H1. The first sentence of the body still says "HBCU marketing agency" inside its first 40 words. The meta, Open Graph, and Twitter description is `How brands advertise to HBCU students: name the campus, staff the date, and measure the campaign with samples, sign-ups, or codes. Send a brief.` (144 characters). The description names no client, statistic, campus served, or result.

Three FAQ questions now use the Search Console wording. `Which campus marketing companies specialize in reaching HBCU students?`, `How can brands advertise to HBCU students?`, and `How do I measure an advertising campaign aimed at HBCU students?` were not already questions on another URL. The advertise answer also says "Black college students". The measure answer names redemptions or codes, sign-ups, sample counts, posts, and a recap, and it states no counts. `What does Collegiate Agency charge for campus work?` is unchanged. The page still has one visible FAQ and one FAQPage JSON-LD from that same list.

`dateModified` is `2026-11-25`. The publish `date` stays `2026-11-10`, so this URL's sitemap `lastmod` is `2026-11-25`. IndexNow submits sitemap URLs whose `lastmod` is inside 72 hours. `/insights` and `/insights/topics/campus-marketing-strategy` follow the existing newest-revision rule, so their sitemap `lastmod` is `2026-11-25`. Their titles, copy, and FAQs were not edited.

`STATIC_ROUTE_UPDATED` for `/`, `/services/events`, `/about`, and `/insights` was still behind `src/lib/seo.ts`, last committed on 2026-11-23. Those four dates are now `2026-11-23`. No copy on those pages was edited. `/insights` sitemap `lastmod` stays `2026-11-25` because the HBCU article is newer.

## 2026-11-24 — Campus activation title, meta, H1, and FAQ for click-through

No new article. No new page. No redirect. No layout change. The slug stays `/insights/campus-brand-activation-agency`. The existing body link to `/insights/college-marketing-agency` stays. `/insights/college-event-sponsorship`, `/insights/campus-product-launch`, hub pages under `/insights/topics/`, `/services/brand-ambassadors`, `/become-an-ambassador`, and the homepage were not edited. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited. No new statistic, client, result, or review was added. The byline stays Shane Michelon, Founder. The inquiry path stays the form.

Google Search Console, sc-domain:collegiateagency.com, Web, Oct 25–Nov 22 2026, pulled Nov 24, 2026 10:26 AM ET. `/insights/campus-brand-activation-agency` had 176 impressions, 2 clicks, average position 15.2. Queries on that page: "on-campus activation" 18 impressions, position 13.0, 0 clicks; "campus activations" 17, position 43.9; "campus activation" 16, position 6.6; "brand activation campaign checklist" 12, position 5.8; "campus brand activation" 9, position 19.8; "campus brand rollout" 4, position 6.5; "campus activation agency" 3, position 53.3. Sitewide, "campus activation agency" is scattered: `/contact` had 12 impressions at position 19.3, and many other URLs sat at positions 50–90.

The document title, Open Graph title, and Twitter title are `Campus Activation Agency: On-Campus Brand Activation Checklist` (62 characters). `resolveDocumentTitle` appends ` | Collegiate Agency` only when the result still fits. That suffix would make this lead 82 characters, which is past both the shared 60-character cap and the 65-character cap, so the resolver publishes the lead without the brand. The H1 is the same sentence. The first paragraph now says "campus activation agency" and "on-campus activation" inside its first 40 words. The meta, Open Graph, and Twitter description is `On-campus activations from a campus brand activation agency: events, sampling, ambassadors, and the recap a brand gets back. Send the schools and goal.` (151 characters). Events, sampling, ambassadors, and the recap are already described on this page. The description names no client, statistic, or result.

The second FAQ question is now `What does a campus activation agency do?` That wording was not already a question on another URL. `What is an on-campus activation?` was not used, because `/services/events` and `/insights/topics/campus-events-and-activations` already ask it. The answer is unchanged. The other four questions are unchanged. The page still has one visible FAQ and one FAQPage JSON-LD from that same list.

`dateModified` is `2026-11-24`. The publish `date` stays `2026-10-13`, so this URL's sitemap `lastmod` is `2026-11-24`. IndexNow submits sitemap URLs whose `lastmod` is inside 72 hours. `/insights/topics/campus-events-and-activations` follows the existing newest-revision rule, so its sitemap `lastmod` is `2026-11-24`. Its title, copy, and FAQ were not edited. `/insights` was already `2026-11-24` from another article, and this edit does not move it.

## 2026-11-23 — Student housing title, meta, and FAQ for click-through

No new article. No new page. No redirect. No layout change. The slug stays `/insights/student-housing-marketing-agency`. The H1 stays `Student Housing Marketing Agency: What to Hire for Lease-Up`. The first sentence still opens on "student housing marketing agency". `/insights/college-marketing-agency`, `/services`, `/services/brand-ambassadors`, `/about`, `/insights/campus-influencers`, and the topic hub copy were not edited. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited. No new statistic, client, result, or review was added. The byline stays Shane Michelon, Founder. The inquiry path stays the form.

Google Search Console, sc-domain:collegiateagency.com, Web, Oct 25–Nov 21 2026, pulled Nov 23, 2026 8:40 AM ET. `/insights/student-housing-marketing-agency` had 164 impressions, 0 clicks, average position 12.9. Queries on that page: "student housing marketing company" 54 impressions, position 5.3, 0 clicks; "student housing marketing services" 36, position 7.7; "student housing online marketing" 15, position 12.5; "best marketing agency for student housing" 13, position 11.2; "student housing marketing agency" 6, position 4.2. The page was missing from Bing's top keywords.

The document title, Open Graph title, and Twitter title are `Student Housing Marketing Company & Services | Collegiate Agency` (64 characters). `resolveDocumentTitle` still caps other titles at 60, which would drop the brand from this lead. 64 is inside the 65-character cap already used on `/pricing`, so this insight passes that cap through `insightTitleLead`. If a longer lead ever failed that cap, the fallback lead is `Student Housing Marketing Company`, which still renders with the brand. The meta, Open Graph, and Twitter description is `Student housing marketing services for lease-up: on-campus tabling, ambassador posts, and move-in events. Brands hire a student housing marketing agency.` (153 characters). Tabling, ambassador posts, and move-in events are services already described on this site. The description names no client, statistic, or result.

The first FAQ question is now `What services does a student housing marketing company offer?` That wording was not already a question on another URL. Its answer is unchanged. The other four questions are unchanged. The page still has one visible FAQ and one FAQPage JSON-LD from that same list.

`dateModified` is `2026-11-23`. The publish `date` stays `2026-10-26`, so this URL's sitemap `lastmod` is `2026-11-23`. IndexNow submits sitemap URLs whose `lastmod` is inside 72 hours. `/insights` and `/insights/topics/campus-marketing-strategy` follow the existing newest-revision rule, so their sitemap `lastmod` is `2026-11-23`. Their titles, copy, and FAQs were not edited.

## 2026-11-22 — /about document title names the founder

No new article. No new page. No redirect. `/insights/college-marketing-agency` stays the page for "college marketing agency". `/contact` and every other URL were not edited. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited.

The `/about` document title, Open Graph title, and Twitter title are `About Founder Shane Michelon | Collegiate Agency` (48 characters). The phrase "college marketing agency" is not in that title. The H1 stays `A college marketing agency for brands.` The meta description stays `Collegiate Agency is a college marketing agency brands hire to reach college students: events, ambassadors, and product placement. Founder Shane Michelon.` That description is not copied from another page. The AboutPage JSON-LD `name` stays `The College Marketing Agency for Brands | Collegiate Agency`. Its `description`, `@id`s, and Person nodes are unchanged.

Sitemap `lastmod` for `/about` is `2026-11-22` via `STATIC_ROUTE_UPDATED`. Other route dates were not moved.

## 2026-11-20 — /pricing query-led title, cost answer, and FAQ wording

No new article. No new page. No redirect. `/insights/college-marketing-agency` keeps the title and H1 `College Marketing Agency: How to Choose One`. That phrase was not added to the `/pricing` title, H1, or meta description. The existing body link from `/pricing` to that guide stays. The money page, city pages, `/services/brand-ambassadors`, and the product-sampling cluster were not edited. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited. No new statistic, client, result, review, or discount was added.

Baseline. Google Search Console URL Inspection, pulled Fri Nov 20, 2026 ~10:35 AM ET: `https://collegiateagency.com/pricing` was "Discovered - currently not indexed". It had not been crawled. It was already in `sitemap.xml`, with `index,follow`, a self canonical, and links from the nav and footer. Google Search Console, Oct 21–Nov 18 2026: `/pricing` had 12 impressions, 0 clicks, average position 3.2. Logged-out ChatGPT on Nov 19, 2026 did not name Collegiate Agency for "how much does a campus marketing campaign cost".

The document title, Open Graph title, and Twitter title are `Campus Marketing Campaign Cost and Pricing | Collegiate Agency` (62 characters). `pageMetadata` still resolves other titles at 60 characters, which would have dropped the brand from this lead. 62 is inside the 65-character cap, so this page sets the absolute title after that resolver. The meta, Open Graph, and Twitter description is `What a campus marketing campaign costs: $150 per ambassador per month, $1,500 per sorority (chapter) for product placement, event packages from $500 to $500,000` (160 characters). Those amounts are `pricing` in `src/site.config.ts`.

The H1 is `Campus marketing pricing: published rates, then a quote for the rest.` Directly under it, the page answers `How much does a campus marketing campaign cost?` in 40–70 words from the published rates: $150 per ambassador per month, including 2 dedicated social posts; $1,500 per sorority (chapter) for product placement; event packages from $500 to $500,000; anything else quoted per campaign; a reply with firm pricing within one business day. One labeled line is arithmetic on the published ambassador rate: 10 ambassadors for 3 months is 10 x 3 x $150 = $4,500 before add-ons. The table, the other sections, and the form-only inquiry path are unchanged. There is no calendar or booking link.

The first FAQ question is now `How much does a college marketing campaign cost?` That wording was not already a question on another page. Its answer uses the same published rates. The other five FAQ answers are unchanged. The visible FAQ and the single FAQPage JSON-LD still come from `pricingFaqs()`. `/pricing` has no WebPage JSON-LD, so no `dateModified` was added to one.

Sitemap `lastmod` for `/pricing` is `2026-11-20` via `STATIC_ROUTE_UPDATED`. IndexNow submits sitemap URLs whose `lastmod` is inside 72 hours. `scripts/indexnow-ping.cjs` runs after `npm run build` when `VERCEL_ENV=production` or `INDEXNOW_PING=1`. The production startup ping in `src/instrumentation.ts` and the cron at `/api/cron/indexnow` send the same set. `/pricing` is inside that window, so those pings include it.

## 2026-11-19 — City pages list only approved activations

No new article. `/insights/college-marketing-agency` keeps the title and H1 `College Marketing Agency: How to Choose One`. The city-hub sentence on that page stays. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited.

`/campus-marketing` lists five cities. A city page is published only when `activations` has at least one entry. The old 350-word gate and the fact-count gate are gone. Pages do not list the campus network, name schools a brief can name, or show service rates. FAQ blocks are omitted. City JSON-LD is a Service with `areaServed` set to the city, plus a BreadcrumbList. City pages do not add LocalBusiness or PostalAddress. The homepage Organization address stays `66 W Broadway, Suite 201`, and `numberOfEmployees` stays 6.

New Orleans names SOS Consultants Nola in one sentence, "SOS Consultants Nola ran a campus campaign with Collegiate Agency in New Orleans," and links `/work/sos-consultants-nola-campus-leasing-ambassadors`. That card does not repeat the case study's package, show count, paid ads, or result. The same page lists Night School show activations for BeatBox, NÜTRL, and Bumble. No show date was added for those Night School activations. Syracuse publishes BeatBox, Dazed, NÜTRL, and Red Bull at the Sep 4, 2026 Night School show, for a Syracuse University audience. Oxford publishes Bloom, NÜTRL, and BeatBox at the Sep 16, 2026 Night School show, for a University of Mississippi audience. Austin publishes a BeatBox bar takeover at CAMP on West 6th on Fri Oct 23, 2026, for a UT Austin audience. That page does not use the September 11, 2026 Night School listing. Dallas publishes a BeatBox activation at Tree Haus on Thu Nov 5, 2026, for an SMU audience. NÜTRL cards link `/work/nutrl-night-school-tour-product-placement` as "Night School tour case study" and do not copy that study's tour-wide figures. No other brands were added. No view counts, attendance, ticket numbers, fees, or other city-level results were added.

BeatBox and Bumble in New Orleans have no public event URL in this pass. Their `source` is `owner-approved`, and the cards do not link out. Syracuse and Oxford cite the Night School listings Shane supplied. Austin and Dallas cite the public listings that match the corrected date and venue. Those listing URLs are not printed on the page.

Sitemap `lastmod` for `/campus-marketing` and the five city URLs is `2026-11-19`. `llms.txt` lists the same five cities.

## 2026-11-19 — Brand ambassador service page buyer queries

No new article. Only `/services/brand-ambassadors` copy changed. The homepage title stays `College Marketing Agency for Brands | Collegiate Agency`. `/insights/college-marketing-agency` keeps the title and H1 `College Marketing Agency: How to Choose One`. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited. No new statistic, client, or price was added.

The document title lead is `College Brand Ambassador Agency`. `pageMetadata` resolves it to `College Brand Ambassador Agency | Collegiate Agency` (51 characters) and sets that string as the absolute title, so the root template does not add a second suffix. The meta description is `A college brand ambassador agency for brands: Collegiate Agency recruits, trains and manages campus ambassador programs at $150 per ambassador per month.` (153 characters). That rate is already published: `pricing["brand-ambassadors"]` in `src/site.config.ts` is `$150` with unit `/ ambassador / month`, shown on this page and on `/pricing`. The same rate is already written as `$150 per ambassador per month` in published articles, and this page's social card already says "Priced per ambassador per month."

Four existing FAQ questions were reworded. The other two questions stayed. Answers keep the same facts, with light wording so each still reads as a reply. The page still renders one FAQ from `servicePageSeo("brand-ambassadors")` and one FAQPage JSON-LD from that same list. The H1 is unchanged. The intro's first sentence now says "college brand ambassador agency" and "campus ambassador program". The inquiry path is still the form.

Sitemap `lastmod` for `/services/brand-ambassadors` is `2026-11-19`. `/services/events` and `/services/product-placement` use the same date because their visible FAQ is rendered from `src/lib/service-faqs.ts`, which this edit changes. Their questions, answers, titles, and page copy are unchanged.

## 2026-11-19 — Current pretune and HEVEBLUE campus campaigns

No new article. `/insights/college-marketing-agency` keeps the title and H1 `College Marketing Agency: How to Choose One`. The meta description, slug, and five FAQ questions are unchanged, and the page still has one FAQPage. `dateModified` is `2026-11-19` because one sentence was added in the campus-access section. Bylines stay Shane Michelon, Founder. The inquiry path stays the `/contact` form. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited.

Shane Michelon confirmed on Nov 18, 2026 that pretune and HEVEBLUE may be named publicly as clients. `/work#running-now` lists both as campus campaigns running now on multiple U.S. campuses. pretune makes targeted hydrogel Neck-Tune patches. HEVEBLUE is a Korean skincare brand sold in the U.S. through retailers including Sephora and Olive Young. No campuses, budgets, contract terms, results, quotes, or logos were added, and no `/work/<slug>` case study was created. The homepage and `/about` do not list clients by name in text, so those pages were left unchanged. `llms.txt` adds one line for the same campaigns, including `https://www.pretune.us/`. Sitemap `lastmod` for `/work` is `2026-11-19`, the newest git date of the files that render that route. The money page, `/insights`, and `/insights/topics/campus-marketing-strategy` follow the existing newest-revision rule, so their `lastmod` is `2026-11-19`.

## 2026-11-18 — Mobile LCP under 2.5 s on key pages

No article, title, H1, slug, meta, or schema changed by this pass. Wave 2 short answers, tables, Updated dates, question H2s, the JSON-LD abstract, and the new internal links stay. Alt texts on the sponsor logos are unchanged. The inquiry form is still server-rendered and is not deferred. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited.

Lighthouse 12.8.2, mobile emulation, simulated throttling, median of 3 runs. CLS stayed 0 on every run. Before is production `https://collegiateagency.com`. After is a local HTTP/2 production build.

| Page | Before LCP | Before score | After LCP | After score |
| --- | ---: | ---: | ---: | ---: |
| `/` | 3.03 s | 0.91 | 2.35 s | 0.95 |
| `/insights/college-marketing-agency` | 3.08 s | 0.94 | 2.34 s | 0.98 |
| `/contact` | 2.87 s | 0.95 | 2.41 s | 0.97 |
| `/services` | 3.16 s | 0.93 | 2.34 s | 0.98 |

Before runs, production. `/` 3.02 s, 3.03 s, 3.03 s. Article 3.05 s, 3.08 s, 3.32 s. `/contact` 2.87 s, 2.87 s, 2.88 s. `/services` 2.88 s, 3.16 s, 3.77 s. The homepage LCP element was the H1. The article LCP element was the raw hero JPEG (84 KB, low priority). The contact LCP element was the lead paragraph. The services LCP element was the Thaw Out photo with `loading="lazy"`.

After runs. `/` 2.33 s, 2.35 s, 2.56 s. Article 2.19 s, 2.34 s, 2.56 s. `/contact` 2.27 s, 2.41 s, 2.41 s. `/services` 2.26 s, 2.34 s, 2.41 s.

The first Thaw Out image on `/services` is `priority` and `fetchPriority="high"`, at quality 55 so the AVIF stays near 60 KB. The other service photos stay lazy. The article hero uses `next/image` with `priority`, `sizes="(max-width: 1024px) 100vw, 896px"`, and the file's width and height, so the page gets AVIF/WebP. Listing cards stay lazy. The live verifier still hashes the source file: a `/_next/image` URL is resolved back to that path. Sponsor logos `sponsor1.png` through `sponsor22.png` are committed at 320 px wide, each under 15 KB. The marquee still loads them lazy, and the alt text is still the client name. `fetch-assets` leaves a file alone once it is present, so a later build does not put the 140 KB remote PNGs back. Inter and Space Grotesk stay preloaded with `display: "swap"`. Space Mono and Instrument Serif also use `display: "swap"` and are not preloaded. Below-the-fold client pieces on `/` and `/contact` load with `next/dynamic` and still server-render. Lenis and GSAP load after idle and no longer wrap the page. The desktop coin reel loads only at the `lg` breakpoint, so a phone does not download that framer-motion chunk.

## 2026-11-18 — SEO Wave 2: short answers, real tables, visible dates

No new article. The money-page title and H1 stay `College Marketing Agency: How to Choose One`. Bylines stay Shane Michelon, Founder. The city-hub sentence and the anchor `campus marketing by city` stay on the money page. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited. No new statistic, client, or price was added. Rates in the short answers are the published `$150` per ambassador per month, `$1,500` per sorority (chapter), and event packages from `$500` to `$500,000`.

Optional frontmatter `shortAnswer` (40–70 words) renders once under the excerpt and byline as a plain paragraph with a left ink border, labeled "Short answer". The same string is Article/BlogPosting `abstract`. It is not added to FAQPage. The money-page answer is the definition and the three published rates. The same kind of definitional answer is on `campus-influencers`, `campus-brand-activation-agency`, `university-activations`, `college-experiential-marketing-agency`, `college-event-sponsorship`, `student-housing-marketing-agency`, `campus-product-launch`, `on-campus-product-sampling`, `college-tailgate-marketing-agency`, and `campus-marketing-agency-rfp`. Each opens on that page's primary term and names Collegiate Agency once.

The money-page buyer checklist under "Use this comparison table before you hire" is now a pipe table, caption `Questions to ask a college marketing agency, with strong answers and red flags`, columns Question, Strong answer, Red flag. The campus marketing agency RFP checklist is a pipe table, columns Section, What to ask for, Why it matters, using the existing checklist wording, including the cancellation-policy link. `how-to-market-to-college-students` turns its academic-calendar list into a Window / What to do table. `gen-z-experiential-marketing` turns its campus-moment list into a Moment / Why it fits table, and keeps the college festival sponsorship link. Other articles already had a table, or their lists were checklists rather than parallel options, timelines, or cost lines, so they were left as lists. Tables still scroll sideways on a narrow screen through the existing table scroller.

ArticleByline shows the published date, and "Updated Mon D, YYYY" in a `<time dateTime>` when `dateModified` is later than `date`. That `dateTime` is the JSON-LD `dateModified`. The same date line is on `/work/[slug]`, including the SOS case study now that its `dateModified` is `2026-11-18`. Real case studies keep their Article JSON-LD. The sample study still emits none.

Money-page H2s are now "How do you check whether a college marketing agency has real campus access?", "Which campus channel fits your goal: events, ambassadors or influencers?", and "How long does a campus campaign take to launch?". The section copy is unchanged, including the SOS and NÜTRL case-study links and the city-hub sentence. No in-page fragment pointed at the old headings.

Two new body links point at each of `multi-campus-brand-activation`, `college-event-marketing-agency`, `spring-break-marketing-agency`, `switching-campus-marketing-agencies`, and `how-to-market-to-college-students`. Anchors vary and include that page's primary term. The exact anchor "college marketing agency" still points only at the money page.

`dateModified` is `2026-11-18` on every article whose body or frontmatter changed in this pass. Articles that already carried `2026-11-18` stayed on that date. `multi-campus-brand-activation`, `college-event-marketing-agency`, `spring-break-marketing-agency`, and `switching-campus-marketing-agencies` were not edited, so their dates stayed.

## 2026-11-18 — Campus marketing city pages and the New York office

No new article. `/insights/college-marketing-agency` keeps the title and H1 `College Marketing Agency: How to Choose One`. One sentence on that page links the new hub with the anchor `campus marketing by city`. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited.

`/campus-marketing` is the city hub. `/campus-marketing/new-orleans` is the only published city page. Austin and Oxford stay in `src/lib/campus-markets.ts` with one public fact each, so they do not pass the fact gate and are not rendered, linked from the hub, or added to the sitemap. The New Orleans fact is the published SOS Consultants Nola case study: a $2,500 package, two shows, an on-site activation, one round of ambassador flyer and video posts, localized Meta ads using the same creative, and an 11x return on ad spend. Tulane, UT Austin, and Ole Miss are labeled only as schools in the campus network. The city page links `/contact` and does not add a calendar, a booking link, or a phone number.

The confirmed New York office is `66 W Broadway, Suite 201`, New York, NY `10007`. Organization JSON-LD now includes that street and postal code, and `numberOfEmployees` is exactly `{"@type":"QuantitativeValue","value":6}`, replacing the 6–10 range. `foundingDate` stays `2026`. There is still no telephone. The footer and the contact location line show the street. The contact email stays `shane@zmmevents.com`.

Sitemap `lastmod` for `/campus-marketing` is `2026-11-18` through `STATIC_ROUTE_UPDATED`. The New Orleans URL uses the same date constant. The SOS case study `dateModified` is `2026-11-18` because it gained one link to the city page.

## 2026-11-18 — SEO hygiene: lastmod, entity, broken links

No new article. The money-page title and H1 stay `College Marketing Agency: How to Choose One`. The sample Celsius case study stays `noindex` and is not linked from the new sentence. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited. No new statistic, client, review, or price was added. `foundingDate` and the employee range are the figures the owner supplied on Nov 11 2026, and they are in Organization JSON-LD only.

Static sitemap `lastmod` now comes from `STATIC_ROUTE_UPDATED` in `src/lib/route-updated.ts`. Each date is the newest `git log -1 --format=%cs` of the files that render that route, including `src/site.config.ts` where the page prints config values such as pricing. `/` , `/services`, `/services/events`, `/services/brand-ambassadors`, `/services/product-placement`, `/pricing`, `/build-a-campaign`, `/work`, `/about`, `/insights`, and `/contact` are `2026-11-18`. `/pricing` is `2026-11-18` because `src/site.config.ts` last changed that day; the pricing page file itself is `2026-11-17`. `/become-an-ambassador` is `2026-10-20`. `/insights` still uses the newer of that date and the newest article revision, which is already `2026-11-18`. Article and case-study URLs still use `dateModified` or `date`.

Organization `sameAs` keeps the existing Instagram, ZMM, LinkedIn, Clutch, and Sortlist URLs and adds Issuu, Substack, WordPress, Blogspot, and Tumblr. Each returned 200 with a browser user agent on 2026-11-18. Crunchbase returned 403 and was not added, because that profile is included only on a public 200. Organization JSON-LD adds `foundingDate` `2026` and `numberOfEmployees` min 6, max 10. Person `#shane-michelon` keeps the LinkedIn URL and adds about.me (200), Medium (403), and Quora (403). The node also sets `url` to that LinkedIn profile, `image` to `https://collegiateagency.com/team/shane-michelon.png`, and the founder description. The visible byline is still "Shane Michelon, Founder" linking to LinkedIn. Article and BlogPosting `author` is that same Person, so it carries the LinkedIn `url`.

Photo credits and licenses render as links only when the value starts with `http://` or `https://`. `Owned Collegiate Agency activation photography` on `/insights/campus-brand-activation-agency` is plain text.

Real case studies emit Article JSON-LD: headline, description, dates, Shane's Person `@id` with the LinkedIn `url`, the organization `@id` as publisher, the client name as `about`, and the hero image when the study has one. SOS Consultants Nola has no photograph, so that node omits `image`. The Celsius sample emits no Article node.

`/insights/college-marketing-agency` adds one sentence in "Check whether the agency has real campus access" linking "SOS Consultants Nola case study" and "NÜTRL Night School tour case study". Those facts are already on `/work`. `/services/brand-ambassadors` already linked the SOS study, and `/services/events` and `/services/product-placement` already linked the NÜTRL study, so those pages were not given a second link. `dateModified` on the money page and on `college-marketing-for-beauty-brands` is `2026-11-18`. The beauty meta description is frontmatter only and is 150 characters. The brand-ambassadors meta description is 148 characters and still leads with "A vetted student rep network".

Service cards say "Explore Events" where that fits. "Brand Ambassadors" and "Product Placement" on the three-up cards stay "Learn more" with an sr-only "about campus {name}". The services hub columns are wider, so those links read "Explore Events", "Explore Brand Ambassadors", and "Explore Product Placement". The article closing line on the accent block uses `text-white/95` (about 4.8:1 on `#2f5bff`). `text-white/85` was about 4.2:1.

## 2026-11-18 — Named quote beside brand inquiry submits

No article, title, H1, slug, meta, or schema changed. No Review or AggregateRating markup. Form fields, reply copy, and the Book a Call label are unchanged. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited. `/contact` and `/build-a-campaign` sitemap `lastmod` values stay as published.

`/contact` shows the homepage's lead quote once: Troy Osinoff, Founder, Zagged. It sits directly under the Book a Call button, in the form column. On a phone that is after the form and before the photo. The logo row stays. The old cycling review under that row is gone, so this line is not shown twice and the page does not add star counts. `/build-a-campaign` shows the same quote under Send my campaign, in the review step's side column. The quote, name, and title are the `testimonials` entry already rendered in "Don't just take our word for it." No new quote, rating, star count, stat, or client.

## 2026-11-18 — Brand inquiry CTA labels

No article, title, H1, meta description, slug, byline, schema, or nav item changed. `/contact` and `/build-a-campaign` page markup and the contact form were not edited. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited.

Brand buttons that said "Get Started" or "Get started" now name the next step. Href values stay the same, including any `?interest=` prefill, except the footer on `/insights/college-marketing-agency`, which now goes to `/contact?article=college-marketing-agency` and no longer sends `interest=Events`. The mid-page events card on that article still books a call with the events interest. "Get a custom quote", the header "Book a Call", and the `/pricing` closer are unchanged. Ambassador and student recruiting labels are unchanged.

- Homepage closer: "Get Started" -> "Tell us what you're launching" (`/contact`). "Explore services" now goes to `/services`.
- `/services` brand closer: "Get started" -> "Get a plan and pricing" (`/contact`).
- `/services/events` hero and closer: "Get a plan for your campus event".
- `/services/brand-ambassadors` hero and closer: "Get a plan for an ambassador program".
- `/services/product-placement` hero and closer: "Get a plan for product placement".
- `/work` and each case study closer: "Get a plan and pricing" (`/contact`).
- `/insights`, insight topic hubs, article footer bands, the homepage sticky bar, and the 404 contact button: "Tell us what you're launching" (`/contact`). Article footers other than `college-marketing-agency` still pass their service interest.

The homepage hero and the `/about` closer add one muted line under the brand buttons: "Send a short brief. Collegiate Agency replies within one business day with a tailored plan and firm pricing." A contact URL with no `interest` param still leaves the service choices unselected.

## 2026-11-18 — Sampling cluster primary URL

Search Console, URL-prefix property, Web, last 3 months (Oct 23 to Nov 14 2026), exported Nov 16 2026 ~8:40 AM ET. `/insights/on-campus-product-sampling` is the primary URL for the generic sampling queries. `/insights/campus-product-sampling-ideas` stays the ideas page and links to that primary. No new page. No redirect. The ideas slug, title, and H1 are unchanged. The primary slug and H1 stay `On-Campus Product Sampling: A Practical Guide`. The primary title stays `On-Campus Product Sampling for Brands | Collegiate Agency`. Gen Z articles were not edited. `/insights/campus-product-sampling-agency` was not edited. Articles dated after 2026-11-10 in frontmatter, other than the four articles named below, were not edited. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited. The byline stays Shane Michelon, Founder, with the LinkedIn profile as the only author URL.

Source: Google Search Console, Web, exported Nov 16 2026 ~8:40 AM ET. Re-check clicks and position in about 2-3 weeks, once Google and Bing have recrawled the pages. IndexNow submits a URL when its sitemap `lastmod` is inside 72 hours, so `dateModified` on the four edited articles is 2026-11-18, and `/services/product-placement` sitemap `lastmod` is 2026-11-18.

Baseline, last 3 months. Impressions, clicks, average position. GSC did not export which page each query landed on.

- `/insights/on-campus-product-sampling`: 85 impressions, 1 click, position 10.92.
- `/insights/campus-product-sampling-ideas`: 72 impressions, 1 click, position 21.38.
- `/insights/campus-product-sampling-agency`: 2 impressions, position 4.
- `/services/product-placement`: 7 impressions, position 6.29.
- Queries, all 0 clicks: "student product sampling" 28 impressions, position 17.21; "campus product sampling" 19, position 19.53; "student product samples" 16, position 23.69; "college campus sampling" 11, position 12.64.

The primary lede now uses "campus product sampling" and "student product sampling" in the first paragraph. Description, Open Graph description, and Twitter description: `Hire on-campus product sampling by student behavior, not school logos. Staff the handoff, set the follow-up, and judge whether the first test worked.` -> `Campus product sampling for brands that hire Collegiate Agency to market to college students. Staff the handoff, set the follow-up, and judge the first test.` The new description is 157 characters. The page still has one visible FAQ and one FAQPage JSON-LD from that same list. Two questions were reworded, and the other three stayed: "What is student product sampling?" -> "What is student product sampling and how do brands run it?"; "Who should hand students a product sample?" -> "How do brands do college campus sampling?". Answers use only facts already in the article and the published rates (`$150 / ambassador / month`, `$1,500 per sorority (chapter)`, event packages from `$500` to `$500,000`). No statistic, client, result, capacity, or new price was added.

One or two links were added inside existing copy on each supporting page. Anchors are not repeated more than twice, including links that were already published.

- `/insights/campus-product-sampling-ideas` — "student product sampling guide" and "campus product sampling". The opening, the staffing question, and the close now say "ideas". Slug, title, and H1 are unchanged.
- `/services/product-placement` — "on-campus product sampling". The other use of that anchor is already on `/insights/greek-life-marketing-agency`. The reading sentence keeps the ideas article link by its title.
- `/insights/campus-product-launch` — "student product samples".
- `/insights/university-activations` — "college campus sampling".

- `dateModified` is `2026-11-18` on `on-campus-product-sampling`, `campus-product-sampling-ideas`, `campus-product-launch`, and `university-activations`. Their `date` values stay 2026-07-31, 2026-08-26, 2026-08-18, and 2026-08-16, so each insight URL's sitemap `lastmod` is 2026-11-18 UTC midnight.
- `/services/product-placement` sitemap `lastmod` is 2026-11-18. `/pricing` stays 2026-10-22.
- `/insights` uses the newer of the newest article revision and `CTR_WAVE_LAST_MODIFIED`. The newest revision was already 2026-11-18, so `/insights` `lastmod` stays 2026-11-18.
- Topic hubs that include an edited article take that revision under the existing rule: `product-sampling-and-placement` and `campus-events-and-activations` are 2026-11-18. `campus-marketing-strategy` was already 2026-11-18. The other hubs stay on their previous dates.

## 2026-11-18 — Run 47, college marketing for beverage brands

New insight at `/insights/college-marketing-for-beverage-brands`. Primary keyword `college marketing for beverage brands`. Buyer is a beverage brand choosing a campus partner. The page requires a can count, cold storage, a written campus permission, a check for an exclusive pour, a 21-and-older rule when the drink contains alcohol, a lookalike check when it does not, approved caffeine sentences, a retailer code, and a disclosure on a paid or gifted post. It links to `/insights/campus-product-sampling-agency`, `/insights/college-tailgate-marketing-agency`, and `/insights/college-sports-marketing-agency` instead of restating those guides. It also links `/services/events`, `/services/product-placement`, `/services/brand-ambassadors`, `/pricing`, `/contact`, and `/build-a-campaign`. Dated sources in the body are EvolveZ (September 15, 2026), the Celsius Holdings Spring 2027 student marketing role (October 16, 2026), the Best Day Brewing press release on BevNET (September 18, 2026), Columbia Athletics on Lyre's (March 31, 2026), and the FTC endorsement guides (July 26, 2023). Undated competitor pages and competitor performance figures were left out of the article. Hero and two inline photos are the least-used legal owned frames outside the previous four articles: attendees toasting NUTRL cans under a tent, a Dazed merchandise table, and a performer holding a BEATBOX carton on stage. Three owned photos were free under the 4-article window, so the run carries a low-photo-supply warning. The article is grouped with campus marketing strategy. `date` and `dateModified` are 2026-11-18, so the article sitemap `lastmod` is 2026-11-18, `/insights` moves to 2026-11-18, and the strategy hub's newest article revision is 2026-11-18.

## 2026-11-17 — Money page links and snippet for "college marketing agency"

Search Console, URL-prefix property, Web, last 3 months (Oct 23 to Nov 14 2026), exported Nov 16 2026 ~8:40 AM ET, showed `/insights/college-marketing-agency` with impressions and no clicks, and `/insights/college-marketing-strategy` with impressions, no clicks, and no link to that page. This pass adds one contextual body link from eight existing pages and rewrites the money-page description. No article was created. The money-page slug and H1 stay `College Marketing Agency: How to Choose One`. The homepage title and the `/about` title were not changed. Gen Z articles were not edited. Articles dated after 2026-11-10 in `content/seo/publish-log.md` were not edited. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited. The byline stays Shane Michelon, Founder, with the LinkedIn profile as the only author URL.

Source: Google Search Console, Web, pulled Nov 16 2026 ~8:40 AM ET. Re-check clicks and position in about 2-3 weeks, once Google and Bing have recrawled the pages. IndexNow submits a URL when its sitemap `lastmod` is inside 72 hours, so `dateModified` on the six edited articles is 2026-11-17.

Baseline, last 3 months. Impressions, clicks, average position:

- `/insights/college-marketing-agency`: 235 impressions, 0 clicks, position 12.24. Queries: "college marketing agency" 186 impressions, 0 clicks, position 50.85; "campus marketing agency" 155, position 29.55; "agency college marketing" 29, position 21.1; "college ad agency" 20, position 10.85; "college marketing agency chicago" 7, position 30.43; "college marketing agencies" 3, position 51.67.
- `/insights/college-marketing-strategy`: 198 impressions, 0 clicks, position 60.42. The page did not mention `/insights/college-marketing-agency` and did not link to it. "college marketing strategies" had 24 impressions, position 78.

One link was added inside an existing sentence, or as one new short sentence, on each of these pages. Anchors are not repeated more than twice, including links that were already published.

- `/insights/college-marketing-strategy` — "choosing a college marketing agency". The first sentence now says "college marketing strategies". Slug, title, and H1 are unchanged.
- `/insights/how-to-market-to-college-students` — "college marketing agency".
- `/insights/campus-marketing-agency-rfp` — "college marketing agencies".
- `/insights/college-experiential-marketing-agency` — "how to choose a college marketing agency".
- `/insights/college-tour-marketing` — "agency for college marketing".
- `/about` — "college marketing agencies". Title and meta were not changed.
- `/pricing` — "choosing a college marketing agency". Title and meta were not changed.
- `/work` — "agency for college marketing". Title and meta were not changed.

Links already on `/services` (guides block, "college marketing agency guide"), the campus-marketing-strategy hub card, the homepage card, `/insights/campus-brand-activation-agency`, `/insights/campus-field-marketing-agency`, `/insights/student-housing-marketing-agency`, and `/insights/hbcu-marketing-agency` were left in place. The URL was not added to the nav, header, or footer.

`/insights/college-marketing-agency` title stays `College Marketing Agency: How to Choose | Collegiate Agency`. That rendered title is 59 characters. A cost cue such as "What It Costs" does not fit under 60 characters, and the page's pricing is the published rates already in the FAQ, so the title was not rewritten. Description, Open Graph description, and Twitter description: `How to choose a college marketing agency for events, ambassadors, and sampling. Compare campus access, the operating plan, and the proof you get back.` -> `College marketing agency comparison checklist: red flags, what to ask, a timeline, and pricing. Brands hire Collegiate Agency to market to college students.` The new description is 156 characters. It names the comparison checklist, red flags, what to ask, the timeline, and pricing already on the page. No statistic, client, result, or new price was added.

- `dateModified` is `2026-11-17` on `college-marketing-agency`, `college-marketing-strategy`, `how-to-market-to-college-students`, `campus-marketing-agency-rfp`, `college-experiential-marketing-agency`, and `college-tour-marketing`. Their `date` values stay 2026-07-29, 2026-08-20, 2026-09-01, 2026-09-08, 2026-10-20, and 2026-08-14, so each insight URL's sitemap `lastmod` is 2026-11-17 UTC midnight.
- `/insights` uses the newer of the newest article revision and `CTR_WAVE_LAST_MODIFIED`. The newest revision is now 2026-11-17, so `/insights` `lastmod` is 2026-11-17.
- Topic hubs that include an edited article take that revision under the existing rule: `campus-marketing-strategy`, `campus-events-and-activations`, and `campus-sponsorship` are 2026-11-17. The other hubs stay on the 2026-11-16 content floor. `/about` stays 2026-11-10. `/pricing` stays 2026-10-22. `/work` stays 2026-11-16. Each of those three pages gained one sentence and no title change.
- The money page still has one visible FAQ and one FAQPage JSON-LD from that same list.

## 2026-11-16 — Run 46, college marketing for beauty brands

New insight at `/insights/college-marketing-for-beauty-brands`. Primary keyword `college marketing for beauty brands`. Buyer is a beauty or skincare brand choosing a campus partner. The page requires a shade rule, single-use applicators, ingredient sentences the brand already approved, a separate yes for a beauty club that is not in the Greek-life rate, a retailer code, and a disclosure on a paid or gifted post. It links to `/insights/campus-product-sampling-agency`, `/insights/greek-life-marketing-agency`, and `/insights/college-creator-marketing-agency` instead of restating those guides. It also links `/services/events`, `/services/product-placement`, `/services/brand-ambassadors`, `/pricing`, `/contact`, and `/build-a-campaign`. Dated sources in the body are the National Student Clearinghouse Research Center (June 4, 2026), BeautyMatter (September 10, 2026), flytedesk (November 12, 2026), The Campus Agency's NARS case study (January 3, 2025), Guru Today on Anua (October 10, 2025), Pulse by Maeil Business on Dr. G (October 13, 2025), and the FTC endorsement guides (July 26, 2023). Undated competitor pages and competitor performance figures were left out of the article. Hero and two inline photos are the least-used legal owned frames outside the previous four articles: a Bloom can in hand, a NUTRL bar setup, and a BEATBOX carton raised toward a stage. The article is grouped with campus marketing strategy. `date` and `dateModified` are 2026-11-16, so the article sitemap `lastmod` is 2026-11-16, `/insights` moves to 2026-11-16, and the strategy hub's newest article revision is 2026-11-16. Hub sitemap `lastmod` stays 2026-11-16 because that is already the hub content date.

## 2026-11-16 — Brand inquiry path

No article, title, H1, slug, byline, or contact detail changed. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, `content/seo/keyword-map.md`, and `scripts/collegiate_seo_autopublish.py` were not edited. Schema, canonicals, FAQ blocks, and sitemap entries were not removed. `/contact` sitemap `lastmod` stays `2026-10-28`.

The contact form on a phone now follows the heading, ahead of the photo, logo marquee, and offices. Company and work email stay the only required fields. The form states that, and it repeats the reply already published on `/contact`: Collegiate Agency replies within one business day with a tailored plan and firm pricing. A failed check scrolls to the first invalid field and leaves what was typed. Service pages, event sponsorship inquiries, and insight CTAs pass the chosen service into `/contact` or `/build-a-campaign`. The campaign review step labels its fields and keeps them when email validation fails. Phones get a header Book a Call button on every page.

## 2026-11-16 — Hub and index FAQs for pages with impressions and weak rank

Search Console, URL-prefix property, Web, last 3 months (Oct 23 to Nov 14 2026), exported Nov 16 2026 ~8:40 AM ET, showed index and hub URLs with impressions and almost no clicks. This pass follows the thin-page pattern that moved `/contact`, `/work`, and `/insights` after the earlier server-rendered copy and FAQ work. No article was created. Slugs, article H1s, article bodies, and bylines were not edited. Gen Z articles were not edited, and no Gen Z hub was added. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited. The byline stays Shane Michelon, Founder, with the LinkedIn profile as the only author URL. The contact email and Organization `sameAs` were not changed.

Source: Google Search Console, Web, pulled Nov 16 2026 ~8:40 AM ET. Pages and queries below are from that export. Re-check clicks and position in about 2-3 weeks, once Google and Bing have recrawled the pages. IndexNow submits a URL when its sitemap `lastmod` is inside 72 hours, so the edited routes use `2026-11-16`.

Baseline, last 3 months. Impressions, clicks, average position:

- `/work`: 442 impressions, 2 clicks, position 43.24.
- `/insights/topics/campus-marketing-strategy`: 119 impressions, 0 clicks, position 27.62. The live title was `Strategy and agency selection | Collegiate Agency`, which did not contain the query.
- `/build-a-campaign`: 99 impressions, 0 clicks, position 55.03.
- `/insights/topics/student-influencers`: 10 impressions, 0 clicks, position 19.3.

Related queries with impressions: "college marketing agency" 186 impressions, position 50.85; "campus marketing agency" 155, 29.55; "college branding agency" 132, 27.38; "where can brands hire reliable campus marketing specialists?" 56, 6.54; "agency college marketing" 29, 21.1; "college ad agency" 20, 10.85; "campus marketing" 50, 60.16; "college marketing strategies" 24, 78; "campus activations" 25, 23.8; "campus influencers" 22, 8.41; "campus creators" 15, 14.07; "student influencer marketing" 17, 47.59.

Each topic hub now has one visible FAQ of five brand-buyer questions and one FAQPage JSON-LD from that same list. The document title, meta description, Open Graph title and description, Twitter title and description, and CollectionPage name and description match. Titles stay inside 60 characters and use the `%s | Collegiate Agency` suffix. Hub H1s were not changed. Intros stay two sentences and name the buyer as a brand hiring Collegiate Agency to reach college students.

- `/insights/topics/campus-marketing-strategy` title is `Campus Marketing Strategy for Brands | Collegiate Agency`. The description names campus marketing strategy, agency selection, college marketing strategies, and a campus marketing agency. Questions: what a campus marketing strategy is for brands, how a brand chooses a campus marketing agency, which college marketing strategies Collegiate Agency covers, where brands can hire reliable campus marketing specialists, and what a college ad agency runs on campus. The last answer also names a college branding agency and the published rates.
- `/insights/topics/student-influencers` title is `Campus Influencers for Brands | Collegiate Agency`. The description names campus influencers, student influencer marketing, and campus creators. Questions cover campus influencers, student influencer marketing, hiring campus creators, cost, and where the programs run. The cost answer says Collegiate Agency does not publish a separate student-influencer rate.
- `/insights/topics/brand-ambassador-programs` title is `College Brand Ambassador Programs | Collegiate Agency`. Questions cover a college brand ambassador program, campus ambassador programs, the ambassador rate, how a brand starts, and who hires the agency for student brand reps.
- `/insights/topics/campus-events-and-activations` title is `Campus Activations for Brands | Collegiate Agency`. Questions cover campus activations, an on-campus activation, college event marketing, cost, and how a brand starts. Timing follows the events page: Collegiate Agency does not publish a fixed number of weeks from the reply to event day. The 7-day line is not used on this hub.
- `/insights/topics/product-sampling-and-placement` title is `Campus Product Sampling for Brands | Collegiate Agency`. Questions cover campus product sampling, student product sampling, the product-placement rate, a sampling event, and how a brand starts. A sampling event uses the event packages and the same no-fixed-weeks line.
- `/insights/topics/campus-sponsorship` title is `Sponsorship for College Events | Collegiate Agency`. The description still leads with college event sponsorship. The article `college-event-sponsorship` already uses `College Event Sponsorship for Brands`, so the hub title uses the other query, "sponsorship for college events". Questions cover college event sponsorship, sponsorship for college events, festival sponsorship cost, timing, and where it runs. Timing follows the events page and does not add the 7-day line.

`/work` keeps `Campus Marketing Case Studies for Brands | Collegiate Agency`. Body copy other than the new FAQ was not rewritten. Five questions: what campus campaigns brands hire Collegiate Agency for, what a case study covers, how to start a similar campaign, where Collegiate Agency runs campus campaigns, and what a campaign like these costs. One FAQPage JSON-LD uses that same list. The start answer includes the one-business-day reply, 7 days from a signed SOW to boots on the ground, and the events-page line that Collegiate Agency does not publish a fixed number of weeks from that reply to event day.

`/build-a-campaign` title is `Build a campus marketing campaign | Collegiate Agency`. The meta, Open Graph, and Twitter description say the builder sends a starting estimate and firm pricing follows. The H1 is unchanged. Five questions: how Collegiate Agency prices a campus marketing campaign, how long one takes to start, what a brief should include, which services can be combined, and who the builder is for. The price answer uses the published rates and says the on-screen total is a starting estimate. The timeline answer includes the one-business-day reply, the 7-day signed-SOW line, and the events-page no-fixed-weeks line.

Answers use only facts already in the repo: `$150 / ambassador / month`, `$2,500 / campus`, event packages from `$500` to `$500,000`, a reply within one business day with a tailored plan and firm pricing, 7 days from a signed SOW to boots on the ground where that stat does not fight the events or product-placement pages, New York, and 21 campuses. A brief those rates do not cover stays quoted per campaign. No statistic, client, result, testimonial, review, phone number, or street address was added.

- Sitemap `lastmod` for `/work` is `WORK_FAQ_LAST_MODIFIED` (`2026-11-16`). `/build-a-campaign` is `BUILD_FAQ_LAST_MODIFIED` (`2026-11-16`). `/contact` stays `2026-10-28`.
- Each topic hub sitemap `lastmod` is the newer of the newest article revision and `2026-11-16`. Every hub's newest article is earlier than that day, so all six hubs are `2026-11-16`.
- `/insights` still uses the newer of the newest article revision and `CTR_WAVE_LAST_MODIFIED`. The newest revision is `2026-11-15`, so `/insights` stays `2026-11-15`. Article `dateModified` values were not changed.

## 2026-11-15 — Run 45, spring semester campus marketing

New insight at `/insights/spring-semester-campus-marketing`. Primary keyword `spring semester campus marketing`. Buyer is a brand planning and staffing a January 2027 return-to-campus program. The page says to group campuses by start date, to ask for an indoor hour where January is cold, and to require schools, the count, and separate event and ambassador lines before signing. It links to `/insights/back-to-school-campus-activation`, `/insights/finals-week-marketing`, and `/insights/campus-pop-up-activation` instead of restating those guides. It also links `/services/events`, `/services/brand-ambassadors`, `/pricing`, `/contact`, and `/build-a-campaign`. Dated sources in the body are Follett Media Network (November 5, 2026), College Marketing Co.'s 2026 campus calendar (June 25, 2026), Barnes & Noble College's brand partnerships page (modified October 21, 2026), American Guerrilla Marketing's university marketing article (August 10, 2026), and flytedesk's November 13, 2026 agency roundup. The undated College Marketing Co. January 2027 playbook was read and left out of the article. No competitor performance figure, client result, or attendance count was added. Hero and two inline photos are the least-used legal owned frames outside the previous four articles: a BEATBOX bar pour, an outdoor NUTRL can, and three attendees with BEATBOX cartons. The article is grouped with campus events and activations. `date` and `dateModified` are 2026-11-15, so the article sitemap `lastmod` is 2026-11-15, `/insights` moves to 2026-11-15, and the events-and-activations hub moves to 2026-11-15.

## 2026-11-13 — Run 44, college app marketing agency

New insight at `/insights/college-app-marketing-agency`. Primary keyword `college app marketing agency`. Buyer is an app, consumer-tech, fintech, or AI-tool growth lead hiring a campus partner for student installs or sign-ups. The page is a hiring guide: which published rate buys posts with a link, which rate buys a staffed hour, and what the brief has to name. It links to `/services/brand-ambassadors`, `/services/events`, `/pricing`, `/contact`, `/build-a-campaign`, and the pop-up, creator, and activation guides. It does not restate those guides. The disclosure passage cites the Federal Trade Commission's revised endorsement guides in the Federal Register, July 26, 2023. No competitor performance figure, client result, or install count was added. Hero and two inline photos are owned activation frames outside the previous four articles. The article is grouped with the strategy and agency-selection hub. `date` and `dateModified` are 2026-11-13, so the article sitemap `lastmod` is 2026-11-13 and that hub moves to 2026-11-13. `/insights` was already 2026-11-13.

## 2026-11-13 — Striking-distance FAQs

Search Console showed `/services/events` and six insight URLs with impressions and few or no clicks. This pass rewrites the existing FAQ on each of those pages so the visible questions match queries that fit the page. Each page already had one FAQ. The new questions replace that list. The page still renders one FAQ block, and it still emits one FAQPage JSON-LD from those same questions and answers. No second FAQ block was added. No article was created. Slugs, titles, meta descriptions, H1s, excerpts, and bodies are unchanged. Gen Z pages were not edited. Articles published on 2026-11-11, including every slug from PR #40 and every row dated 2026-11-11 in `content/seo/publish-log.md`, were not edited. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited. Bylines are unchanged.

Source: Google Search Console, Web, pulled Nov 11 2026 ~10:21 AM ET. Pages export comparing the last 28 days with the previous 28 days, and the Queries export for that same window. The Queries export does not attach a URL to each query. A query is used only when the page already supports the answer. Re-check clicks and position in about 2-3 weeks, once Google and Bing have recrawled the pages. IndexNow submits a URL when its sitemap `lastmod` is inside 72 hours, so `dateModified` on these six articles is 2026-11-13 and the static lastmod for `/services/events` is 2026-11-13.

Baseline, last 28 days. Clicks, impressions, CTR, average position. Previous 28 days in parentheses:

- `/services/events`: 1 click, 118 impressions, 0.85%, position 24.55 (previous: 2 clicks, 35 impressions, 5.71%, position 14.51). Queries: "campus activations" 0 clicks, 28 impressions, position 23.86; "on-campus activation" 0, 14, position 16.21; "college event marketing" 0, 8, position 89.75; "college activations" 0, 5, position 91.6; "university activation" 0, 2, position 3; "school activations" 0, 4, position 56.25; "sponsorship for college events" 0, 4, position 9.75; "who offers end-to-end brand activation programs for higher education institutions?" 0, 1, position 1.
- `/insights/campus-product-sampling-ideas`: 0, 61, 0%, 21.49 (previous: 0, 15, 0%, 31.8). Queries: "product sampling ideas" 0 clicks, 1 impression, position 3; "product sampling university" 0, 16, position 42.5; "campus product sampling" 0, 11, position 17.36; "college sampling programs" 0, 7, position 24.71; "campus sampling" 0, 4, position 6.75. Also the AI-answer gap "on-campus product sampling agency", which is not a row in this Queries export.
- `/insights/student-brand-reps`: 1, 50, 2%, 17.88 (previous: 0, 3, 0%, 31.33). The export has no query that contains "brand rep" or "student brand reps". The five questions use this article's own job, recruiting, brief, and 30-day language.
- `/insights/college-brand-ambassadors`: 0, 31, 0%, 11.77 (previous: 0, 6, 0%, 14.67). Queries: "campus brand ambassadors" 0 clicks, 0 impressions this window, 1 impression in the previous window, position 64; "brand ambassador for college students" 0, 0 this window, 1 previous, position 136. The page's own query is "college brand ambassadors".
- `/insights/campus-activation-ideas`: 0, 26, 0%, 16.31 (previous: 0, 1, 0%, 10). Queries: "college campus activation" 0 clicks, 2 impressions, position 83; "school activation campaigns" 0, 1, position 69; "campus activation meaning" 0, 1, position 11. The page's own query is "campus activation ideas".
- `/insights/college-festival-sponsorship`: 0, 24, 0%, 9.96 (previous: 0, 6, 0%, 43). Queries: "sponsors for college fest" 0 clicks, 1 impression, position 37; "agencies that do festival sponsorship activations" 0, 1, position 43; "college fest sponsorship" 0 clicks and 0 impressions this window, 1 impression in the previous window, position 136.
- `/insights/college-brand-ambassador-program`: 0, 26, 0%, 6.62 (previous: 0, 6, 0%, 7.33). The existing FAQ already asked about a college brand ambassador program, cost, recruiting, accountability, and roles, and it did not use the query phrases below, so the list was rewritten. Queries: "collegiate ambassador" 0 clicks, 12 impressions, position 5.42; "collegiate ambassador programs" 0, 9, position 54; "paid college ambassador programs" 0, 5, position 56.4; "campus ambassador programs" 0, 1, position 36; "paid ambassador programs" 0, 1, position 47.

Each article now has five questions, the top of the existing 3-to-5 FAQ gate. Article answers are 40 to 80 words, name Collegiate Agency, and say brands hire the agency to reach college students. The events FAQ is five questions inside the existing 5-to-7 service gate, and each answer is 1 to 3 sentences. They use only facts already on that page, in `site.config.ts`, or in the published rates: `$150 / ambassador / month`, `$2,500 / campus`, event packages from `$500` to `$500,000`, a reply within one business day with a tailored plan and firm pricing, New York, and 21 campuses. The 7-day signed-SOW line is not used on `/services/events`, because that page already says Collegiate Agency does not publish a fixed number of weeks from the reply to event day. It is not used on the reps page, because this guide's first test is 30 days. It is not used on the ambassador-program page, because that guide's cadence is a term. A brief those rates do not cover stays quoted per campaign. The festival answer states that Collegiate Agency does not publish a ranking of festival agencies. The end-to-end answer says brands hire Collegiate Agency to run the program at higher education institutions, with college students as the audience. Links in article answers go only to `/services/events`, `/services/brand-ambassadors`, `/services/product-placement`, `/pricing`, or `/contact`. No statistic, client, result, testimonial, or review was added.

Queries left unused because the page cannot support them, or because the five-question gate was already filled by a closer query: "set active college ambassador" (0 clicks, 2 impressions, position 50); "which agencies offer more scalable campus ambassador programs than invisible north for national tours?" (0, 1, position 6), which asks for a ranking this site does not publish; "student product sampling" and "student product samples", already matched on `/insights/on-campus-product-sampling` on 2026-11-11; higher-education agency queries that name New Orleans.

- `dateModified` is `2026-11-13` on `campus-product-sampling-ideas`, `student-brand-reps`, `college-brand-ambassadors`, `campus-activation-ideas`, `college-festival-sponsorship`, and `college-brand-ambassador-program`. Their `date` values stay 2026-08-26, 2026-08-03, 2026-08-12, 2026-09-03, 2026-08-30, and 2026-08-24, so each insight URL's sitemap `lastmod` is 2026-11-13 UTC midnight.
- `/services/events` uses `EVENTS_FAQ_LAST_MODIFIED` (`2026-11-13`) in `src/app/sitemap.ts`. `/work` stays on `CTR_WAVE_LAST_MODIFIED` (`2026-11-06`).
- `/insights` uses the newer of the newest article revision and `CTR_WAVE_LAST_MODIFIED`. The newest revision is now 2026-11-13, so `/insights` `lastmod` is 2026-11-13.
- Topic hubs that include an edited article take that revision under the existing rule: `brand-ambassador-programs`, `campus-events-and-activations`, `product-sampling-and-placement`, and `campus-sponsorship` are 2026-11-13. `campus-marketing-strategy` stays 2026-11-12. `student-influencers` stays 2026-11-11. `/`, `/services`, `/work`, and `/about` were not edited, so their sitemap dates stay put.

## 2026-11-12 — Striking-distance insight FAQs

Search Console showed six more insight URLs with impressions and few or no clicks. This pass rewrites the existing frontmatter `faq` on each of those articles so the visible questions match queries that fit the article. Each page already had one FAQ. The new questions replace that list. The page still renders one FAQ block, and it still emits one FAQPage JSON-LD from those same questions and answers. No second FAQ block was added. No article was created. Slugs, titles, meta descriptions, H1s, excerpts, and bodies are unchanged. Gen Z pages were not edited. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited. The byline stays Shane Michelon, Founder, with the LinkedIn profile as the only author URL.

Source: Google Search Console, Web, pulled Nov 11 2026 ~10:21 AM ET. Pages export comparing the last 28 days with the previous 28 days, and the Queries export for that same window. The Queries export does not attach a URL to each query. A query is used only when the article already supports the answer. Re-check clicks and position in about 2-3 weeks, once Google and Bing have recrawled the pages. IndexNow submits a URL when its sitemap `lastmod` is inside 72 hours, so `dateModified` on these six articles is 2026-11-12.

Baseline, last 28 days. Clicks, impressions, CTR, average position. Previous 28 days in parentheses:

- `/insights/college-marketing-agency`: 0 clicks, 213 impressions, 0%, position 11.5 (previous: 0 clicks, 38 impressions, 0%, position 11.66). Queries: "agency college marketing" 0 clicks, 30 impressions, position 14.67; "college marketing agency" 0, 123, position 62.07; "campus marketing agency" 0, 133, position 30.62; "college ad agency" 0, 20, position 25.45; "which campus marketing providers should brands compare for college campaigns?" 0, 8, position 9.25.
- `/insights/campus-brand-activation-agency`: 2, 122, 1.64%, 13.74 (previous: 0, 0, 0%, 0). Queries: "where to hire a brand activation agency that specializes in universities and colleges?" 0 clicks, 15 impressions, position 6.4; "campus activation" 0, 13, position 10.77; "on-campus activation" 0, 14, position 16.21; "who offers experiential brand activation for universities?" 0, 2, position 4.
- `/insights/college-experiential-marketing-agency`: 1, 89, 1.12%, 12.6 (previous: 0, 0, 0%, 0). Queries: "college experiential marketing" 0 clicks, 8 impressions, position 18.38; "experiential marketing in college campuses" 0, 12, position 74.75.
- `/insights/student-housing-marketing-agency`: 0, 65, 0%, 21.88 (previous: 0, 0, 0%, 0). Queries: "student housing marketing company" 0 clicks, 12 impressions, position 4.75; "student housing marketing agency" 0, 12, position 11.92; "student housing online marketing" 0, 15, position 12.47; "student housing digital marketing" 0, 7, position 9.
- `/insights/campus-field-marketing-agency`: 0, 62, 0%, 13.81 (previous: 0, 0, 0%, 0). Query: "where can brands hire reliable campus marketing specialists?" 0 clicks, 12 impressions, position 6.5. The export has no query that contains "field marketing". The other four questions use this article's pilot language.
- `/insights/college-tour-marketing`: 2, 88, 2.27%, 6.17 (previous: 0, 18, 0%, 7.67). Queries: "which agencies can run a 10-campus tour with 1,000 attendee daily capacity and localized creative?" 0 clicks, 11 impressions, position 3.36; "which creative agencies can produce campus tours and short-run retail activations like matt projects?" 0, 8, position 6.

Each article now has five questions, the top of the existing 3-to-5 FAQ gate. Answers are 40 to 80 words, name Collegiate Agency, and say brands, owners, or operators hire the agency to reach college students. They use only facts already in that article, `site.config.ts`, or the published rates: `$150 / ambassador / month`, `$2,500 / campus`, event packages from `$500` to `$500,000`, 7 days from a signed SOW to boots on the ground where that stat does not fight the article's own timeline, and a reply within one business day with a tailored plan and firm pricing. A brief those rates do not cover stays quoted per campaign. The college marketing agency page keeps its 30-day planning baseline and does not add the 7-day line. The tour page keeps the 6-to-8-week comparison timeline. The tour answer states that Collegiate Agency does not publish a 10-campus package or a daily attendee capacity, and it repeats this guide's first wave of four campuses. It also states that Collegiate Agency does not publish a separate short-run retail activation package. The housing answers keep search, the website, and paid media with the digital vendor. Links in answers go only to `/services/events`, `/services/brand-ambassadors`, `/services/product-placement`, `/pricing`, or `/contact`. No statistic, client, result, testimonial, or review was added.

Queries left unused because the article cannot support them, or because the five-question gate was already filled by a closer query: "college engagement marketing agency" (0 clicks, 20 impressions, position 47.3); "what are the best experiential agencies for national college tours?" (0, 4, position 4), which asks for a ranking this site does not publish; immersive pop-up bookstores, Invisible North comparisons, North Shore geography, community-college marketing, Gen Z help, academic-program strategy, and global product launches.

- `dateModified` is `2026-11-12` on `college-marketing-agency`, `campus-brand-activation-agency`, `college-experiential-marketing-agency`, `student-housing-marketing-agency`, `campus-field-marketing-agency`, and `college-tour-marketing`. Their `date` values stay 2026-07-29, 2026-10-13, 2026-10-20, 2026-10-26, 2026-10-15, and 2026-08-14, so each insight URL's sitemap `lastmod` is 2026-11-12 UTC midnight.
- `/insights` uses the newer of the newest article revision and `CTR_WAVE_LAST_MODIFIED`. The newest revision is now 2026-11-12, so `/insights` `lastmod` is 2026-11-12.
- Topic hubs that include an edited article take that revision under the existing rule: `campus-events-and-activations`, `campus-sponsorship`, and `campus-marketing-strategy` are 2026-11-12. `student-influencers` and `product-sampling-and-placement` stay 2026-11-11. `/`, `/services`, `/services/events`, `/work`, and `/about` were not edited, so their sitemap dates stay put.

## 2026-11-11 — Autopublisher repair and nine-article backfill

Runs 35 through 43 published on 2026-11-11. The October 28 attempt (HBCU marketing agency) had stopped because every owned photo was at the 7-appearance cap. The cap is now a rotation: a photo stays off the previous four articles, the hero does not repeat the previous article, and captions are rewritten for each use. A tight library warns and still publishes. A blocked keyword yields to the next keyword in `content/seo/keyword-queue.json` instead of freezing the cadence. A past or unreadable `next_run_at` is due. The committed status file is `content/seo/autopublish-status.json`. Dates are the publish date, not the missed slots. Photo supply after the backfill is three owned frames outside the four-article window, so the next runs should keep publishing, and new approved photos would restore headroom.

## 2026-11-11 — Striking-distance insight FAQs

Search Console showed five insight URLs in striking distance, roughly positions 8 to 15, with impressions and almost no clicks. This pass rewrites the existing frontmatter `faq` on each of those articles so the visible questions match the queries the pages already receive impressions for. Each page already had one FAQ. The new questions replace the earlier section-prompt questions in that same list. The page still renders one FAQ block, and it still emits one FAQPage JSON-LD from those same questions and answers. No second FAQ block was added. No article was created. Slugs, titles, meta descriptions, H1s, excerpts, and bodies are unchanged. Gen Z pages were not edited. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited. The byline stays Shane Michelon, Founder, with the LinkedIn profile as the only author URL.

Source: Google Search Console, Web, pulled Nov 9 2026 ~11:27 AM ET. Pages export comparing the last 28 days (Oct 11–Nov 7 2026) with the previous 28 days, and the Queries export for that same window. The Queries export does not attach a URL to each query. The queries below are the ones named for these pages from that export. Re-check clicks and position in about 2-3 weeks, once Google and Bing have recrawled the pages. IndexNow submits a URL when its sitemap `lastmod` is inside 72 hours, so `dateModified` on these five articles is 2026-11-11.

Baseline, last 28 days. Clicks, impressions, CTR, average position. Previous 28 days in parentheses:

- `/insights/campus-influencers`: 2 clicks, 394 impressions, 0.51%, position 12.79 (previous: 1 click, 66 impressions, 1.52%, position 14.35). Queries: "how to influencer marketing for college students" 0 clicks, 22 impressions, position 2.73; "campus influencers" 1 click, 17 impressions, position 10.24; "campus creators" 0 clicks, 13 impressions, position 14.15.
- `/insights/university-activations`: 1, 200, 0.5%, 13.44 (previous: 0, 37, 0%, 13.11). Queries: "campus activations" 0 clicks, 28 impressions, position 23.86; "on-campus activation" 0, 14, position 16.21; "campus activation" 0 clicks, 13 impressions, position 10.77.
- `/insights/college-event-sponsorship`: 2, 174, 1.15%, 8.37 (previous: 0, 57, 0%, 8.96). Queries: "college event sponsorship" 0 clicks, 4 impressions, position 5; "sponsorship for college events" 0, 4, position 9.75.
- `/insights/campus-product-launch`: 0, 142, 0%, 8.16 (previous: 0, 41, 0%, 6.71). Query: "campus launch" 0 clicks, 32 impressions, position 8.84.
- `/insights/on-campus-product-sampling`: 2, 114, 1.75%, 14.91 (previous: 1, 29, 3.45%, 11.55). Queries: "student product sampling" 0 clicks, 38 impressions, position 15.45; "student product samples" 0, 16, position 23.69.

Each article now has five questions. Answers are 40 to 80 words, name Collegiate Agency, and use only facts already in that article, `site.config.ts`, or the published rates: `$150 / ambassador / month`, `$2,500 / campus`, event packages from `$500` to `$500,000`, 7 days from a signed SOW to boots on the ground, and a reply within one business day with a tailored plan and firm pricing. A brief those rates do not cover stays quoted per campaign. Links in answers go only to `/services/events`, `/services/brand-ambassadors`, `/services/product-placement`, `/pricing`, or `/contact`. No statistic, client, result, testimonial, or review was added.

- `dateModified` is `2026-11-11` on `campus-influencers`, `university-activations`, `college-event-sponsorship`, `campus-product-launch`, and `on-campus-product-sampling`. Their `date` values stay 2026-08-07, 2026-08-16, 2026-08-05, 2026-08-18, and 2026-07-31, so each insight URL's sitemap `lastmod` is 2026-11-11 UTC midnight.
- `/insights` uses the newer of the newest article revision and `CTR_WAVE_LAST_MODIFIED`. The newest revision is now 2026-11-11, so `/insights` `lastmod` is 2026-11-11.
- Topic hubs that include an edited article take that revision under the existing rule: `student-influencers`, `campus-events-and-activations`, `campus-sponsorship`, and `product-sampling-and-placement` are 2026-11-11. `campus-marketing-strategy` stays 2026-11-10. `/`, `/services`, `/services/events`, `/work`, and `/about` were not edited, so their sitemap dates stay put.

## 2026-11-10 — Page-one CTR title and meta pass

Search Console showed four URLs already on page 1 with impressions and few or no clicks. None of them were in the 2026-11-02 or 2026-11-06 title passes. This pass rewrites the SEO title, the meta description, and the matching Open Graph and Twitter title and description. Article slugs, H1s, excerpts, and bodies are unchanged. The NÜTRL case-study headline is unchanged. No redirect was added, no article was merged or created, and no Gen Z page was edited. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited. The contact email and Organization `sameAs` were not changed. Article bylines stay Shane Michelon, Founder, with the LinkedIn profile as the only author URL.

Source: Google Search Console, Web, pulled Nov 9 2026 ~11:27 AM ET. Pages export for the last 3 months, Pages export comparing the last 28 days with the previous 28 days, and Queries export for the last 3 months. The query rows are hints only. Search Console does not say which URL ranks for each query. Re-check CTR in about 2-3 weeks, once Google has recrawled the snippets.

Baseline, last 3 months. Clicks, impressions, CTR, average position:

- `/about`: 4 clicks, 138 impressions, 2.9%, position 6.96
- `/insights/college-tailgate-marketing-agency`: 1, 62, 1.61%, 5.69
- `/insights/campus-marketing-agency-rfp`: 1, 10, 10%, 4.4
- `/work/nutrl-night-school-tour-product-placement`: 2, 12, 16.67%, 5.33

Same pull, last 28 days versus the previous 28 days. Clicks, impressions, CTR, position:

- `/about`: 2 clicks, 123 impressions, 1.63%, position 7.36. Previous 28 days: 2 clicks, 15 impressions, 13.33%, position 3.67.
- `/insights/college-tailgate-marketing-agency`: 1, 62, 1.61%, 5.69. Previous: 0, 0, 0%, 0.
- `/insights/campus-marketing-agency-rfp`: 1, 6, 16.67%, 4. Previous: 0, 4, 0%, 5.
- `/work/nutrl-night-school-tour-product-placement`: 1, 9, 11.11%, 5.56. Previous: 1, 3, 33.33%, 4.67.

Query hints from the 3-month Queries export, not tied to a URL: `college agency` 0 clicks, 183 impressions, position 5.2; `the college agency` 0, 128, position 5.84; `collegiate ambassador` 0, 14, position 5.29; `shane michelon` 0, 16, position 6.75.

Titles below are the rendered document titles. The root template is still `%s | Collegiate Agency`. A lead is left short enough that the suffix fits inside 60 characters. None of the new leads already end in Collegiate Agency, so the brand is not added twice. The description names the brand buyer. No statistic, client, result, or review was added. The NÜTRL figures in that description are the 425 cases and roughly 5M social insights already published on the case study.

- `/about` title: `About the college marketing agency | Collegiate Agency` -> `The College Marketing Agency for Brands | Collegiate Agency`. Adding "Shane Michelon" to that lead would push the rendered title past 60 characters, so the founder stays in the description. Description: `Collegiate Agency is a college marketing agency brands hire for campus events, brand ambassador programs, and product placement. Founder Shane Michelon.` -> `Collegiate Agency is a college marketing agency brands hire to reach college students: events, ambassadors, and product placement. Founder Shane Michelon.` The AboutPage JSON-LD already on this URL keeps the same `@id`s. Its `name` and `description` match the new title and meta. `about` still points at the existing Organization `@id`, and Shane Michelon is still the existing Person `@id` `https://collegiateagency.com/#shane-michelon`. No new entity was created.
- `/insights/college-tailgate-marketing-agency` title: `College Tailgate Marketing Agency Guide | Collegiate Agency` -> `College Tailgate Marketing Agency | Collegiate Agency`. Adding "for Brands" to the full query would drop the brand suffix. Description: `Hire a college tailgate marketing agency with a named permit path, lot rules, staffing, a weather call, and a recap you can audit.` -> `Brands hire a college tailgate marketing agency for a game-day lot. Collegiate Agency can staff it: permit path, lot rules, a shift, and a recap.` The H1 and the excerpt are unchanged. Article JSON-LD still describes the visible excerpt. The nested WebPage node has no description field.
- `/insights/campus-marketing-agency-rfp` title: `Campus Marketing Agency RFP: Buyer Checklist` -> `Campus Marketing Agency RFP for Brands | Collegiate Agency`. The old lead was 44 characters, so the brand suffix was omitted. Description: `Write a campus marketing agency RFP that compares access, staffing, permissions, measurement, and pilot deliverables before you choose a partner.` -> `Brands hire Collegiate Agency for events, brand ambassadors, and product placement. A campus marketing agency RFP compares access, staffing, and the pilot.` The H1 and the excerpt are unchanged.
- `/work/nutrl-night-school-tour-product-placement` title: `NÜTRL case study | Collegiate Agency` -> `NÜTRL Product Placement for Brands | Collegiate Agency`. Description: `Product Placement case study: How NÜTRL turned Night School Tour sponsorship into 425 cases and 5M social insights. 425 total cases moved.` -> `Brands hire Collegiate Agency for product placement. NÜTRL was presenting sponsor of the Night School Tour: 425 cases and roughly 5M social insights.` The headline, challenge, approach, results, and article body are unchanged. This URL has no WebPage JSON-LD node. Other case studies still use the generated `${brand} case study` title.

- `dateModified` is `2026-11-10` on `college-tailgate-marketing-agency` and `campus-marketing-agency-rfp`. Their `date` values stay 2026-10-22 and 2026-09-08, so each insight URL's sitemap `lastmod` is 2026-11-10 UTC midnight.
- The NÜTRL case study `date` stays `2026-08-02`. `dateModified` is `2026-11-10`, and the sitemap uses that for `/work/nutrl-night-school-tour-product-placement` only. The SOS Consultants case study stays on its publish date, 2026-08-03.
- `/about` uses `ABOUT_LAST_MODIFIED` (`2026-11-10`) in `src/app/sitemap.ts`. That date supersedes the 2026-10-27 stamp for `/about` only.
- `/insights` uses the newer of the newest article revision and `CTR_WAVE_LAST_MODIFIED`, which is now 2026-11-10. Topic hubs that include one of the edited articles take that same revision under the existing rule: `campus-sponsorship` includes the tailgate guide, and `campus-marketing-strategy` includes the RFP guide. `/`, `/services`, `/services/events`, `/work`, and the service detail pages were not edited, so their sitemap dates stay put.

## 2026-11-09 — Striking-distance internal links

Search Console showed nine insight URLs already on page 1-3, with impressions and almost no clicks. This pass adds contextual body links into those URLs from guides that already discuss the same job. No article was created. No slug, title, meta description, H1, or byline changed. Bylines stay Shane Michelon, Founder. Gen Z pages and the how-to-market-to-Gen-Z pillar were not edited. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited.

Source: GSC Pages.csv and Queries.csv, Web search, 28 days ending ~Oct 31 2026, pulled Nov 2 2026 ~6:15 AM ET.

Baseline, Pages.csv. Clicks, impressions, CTR, average position:

- `/insights/campus-influencers`: 2 clicks, 123 impressions, 1.63%, position 13.76. Queries: campus influencers, campus influencer, campus brand influencer, college influencers.
- `/insights/college-marketing-agency`: 0, 61, 0%, 11. Queries: college marketing agency, agency college marketing, college ad agency.
- `/insights/campus-product-launch`: 0, 53, 0%, 8.58. Queries: campus product launch, campus launch.
- `/insights/campus-brand-activation-agency`: 0, 41, 0%, 10.1. Query: campus brand activation agency.
- `/insights/college-experiential-marketing-agency`: 0, 44, 0%, 14.64. Queries: college experiential marketing agency, college experiential marketing.
- `/insights/university-activations`: 0, 42, 0%, 18.69. Queries: university activations, campus activations.
- `/insights/student-housing-marketing-agency`: 0, 55, 0%, 24.16. Queries: student housing marketing agency, student housing online marketing, student housing digital marketing.
- `/insights/on-campus-product-sampling`: 0, 29, 0%, 13.28.
- `/insights/campus-field-marketing-agency`: 0, 25, 0%, 10.92.

Inbound body links before this pass, counted from article prose only. Related-post cards, topic hubs, the homepage card list, `/services`, and service-detail reading blocks are unchanged.

- `/insights/campus-influencers`: 1 body link (student-influencer-marketing, anchor "a simple scorecard"). Related posts 0. Topic hub 1. Homepage 1. `/services` 0. Service detail 0. Total 3.
- `/insights/college-marketing-agency`: 0 body. Related 0. Topic hub 1. Homepage 1. `/services` 1 (guides block, "college marketing agency guide"). Service detail 0. Total 3.
- `/insights/campus-product-launch`: 0 body. Related 0. Topic hub 1. Homepage 1. `/services` 0. Service detail 0. Total 2.
- `/insights/campus-brand-activation-agency`: 6 body (student-housing, spring-break, college-tailgate, college-experiential, campus-field, campus-event-accessibility). Related 0. Topic hub 1. Homepage 1. `/services` 1. Service detail 1 (`/services/events` reading). Total 10.
- `/insights/college-experiential-marketing-agency`: 1 body (spring-break). Related 0. Topic hub 1. Homepage 1. `/services` 0. Service detail 0. Total 3.
- `/insights/university-activations`: 0 body. Related 0. Topic hub 1. Homepage 1. `/services` 0. Service detail 1 (`/services/events` reading). Total 3.
- `/insights/student-housing-marketing-agency`: 0 body. Related 2 (`/services/events` and `/services/brand-ambassadors`, the three newest posts tagged for those services). Topic hub 1. Homepage 1. `/services` 0. Service detail 0. Total 4.
- `/insights/on-campus-product-sampling`: 5 body (spring-break, college-tailgate, campus-bookstore-product-placement, college-welcome-bag-inserts, college-tour-marketing). Related 0. Topic hub 1. Homepage 1. `/services` 0. Service detail 1 (`/services/product-placement` reading). Total 8.
- `/insights/campus-field-marketing-agency`: 1 body (student-housing). Related 0. Topic hub 1. Homepage 1. `/services` 0. Service detail 0. Total 3.

New body links, source, anchor, target. Each target gained 2 to 4. Anchors are varied. No source links to the same target twice.

- `/insights/campus-ambassador-content-rights` — "campus influencers" — `/insights/campus-influencers`
- `/insights/campus-brand-activation-agency` — "campus brand influencer" — `/insights/campus-influencers`
- `/insights/campus-field-marketing-agency` — "College influencers" — `/insights/campus-influencers`
- `/insights/spring-break-marketing-agency` — "a campus influencer" — `/insights/campus-influencers`
- `/insights/campus-brand-activation-agency` — "college marketing agency" — `/insights/college-marketing-agency`
- `/insights/campus-field-marketing-agency` — "college ad agency" — `/insights/college-marketing-agency`
- `/insights/student-housing-marketing-agency` — "how to choose a college marketing agency" — `/insights/college-marketing-agency`
- `/insights/campus-brand-activation-agency` — "campus product launch" — `/insights/campus-product-launch`
- `/insights/college-experiential-marketing-agency` — "campus launch" — `/insights/campus-product-launch`
- `/insights/greek-life-marketing-agency` — "launching a product on campus" — `/insights/campus-product-launch`
- `/insights/greek-life-marketing-agency` — "campus brand activation agency" — `/insights/campus-brand-activation-agency`
- `/insights/campus-ambassador-content-rights` — "hiring a campus brand activation agency" — `/insights/campus-brand-activation-agency`
- `/insights/college-tailgate-marketing-agency` — "college experiential marketing" — `/insights/college-experiential-marketing-agency`
- `/insights/campus-field-marketing-agency` — "college experiential marketing agency" — `/insights/college-experiential-marketing-agency`
- `/insights/campus-event-accessibility-checklist` — "a college experiential marketing agency" — `/insights/college-experiential-marketing-agency`
- `/insights/college-experiential-marketing-agency` — "university activations" — `/insights/university-activations`
- `/insights/college-tailgate-marketing-agency` — "campus activations" — `/insights/university-activations`
- `/insights/campus-event-accessibility-checklist` — "activations on a university campus" — `/insights/university-activations`
- `/insights/campus-field-marketing-agency` — "student housing marketing agency" — `/insights/student-housing-marketing-agency`
- `/insights/campus-brand-activation-agency` — "student housing online marketing" — `/insights/student-housing-marketing-agency`
- `/insights/college-experiential-marketing-agency` — "student housing digital marketing" — `/insights/student-housing-marketing-agency`
- `/insights/greek-life-marketing-agency` — "on-campus product sampling" — `/insights/on-campus-product-sampling`
- `/insights/campus-brand-activation-agency` — "product sampling on campus" — `/insights/on-campus-product-sampling`
- `/insights/campus-field-marketing-agency` — "student product sampling" — `/insights/on-campus-product-sampling`
- `/insights/campus-brand-activation-agency` — "campus field marketing agency" — `/insights/campus-field-marketing-agency`
- `/insights/college-experiential-marketing-agency` — "campus field marketing" — `/insights/campus-field-marketing-agency`
- `/insights/college-tailgate-marketing-agency` — "college field marketing agency" — `/insights/campus-field-marketing-agency`

After this pass, body-link counts are 5, 3, 3, 8, 4, 3, 3, 8, and 4 in the same target order as the baseline list. The other inbound categories are unchanged, so totals are 7, 6, 5, 12, 6, 6, 7, 11, and 6.

Older articles in `content/seo/link-backfill-20260921.json` keep their frozen link counts. The new links sit in guides published after that inventory. No statistic, client, result, or review was added. The new sentences do not use SOS Consultants or ZMM figures.

- `dateModified` is `2026-11-09` on `campus-ambassador-content-rights`, `campus-brand-activation-agency`, `campus-event-accessibility-checklist`, `campus-field-marketing-agency`, `college-experiential-marketing-agency`, `college-tailgate-marketing-agency`, `greek-life-marketing-agency`, `spring-break-marketing-agency`, and `student-housing-marketing-agency`. Their `date` values are unchanged, so each of those insight URLs has sitemap `lastmod` 2026-11-09 UTC midnight.
- `/insights` uses the newer of the newest article revision and `CTR_WAVE_LAST_MODIFIED`, which is now 2026-11-09. Topic hubs that include one of the edited articles take that same revision under the existing rule. `/`, `/services`, `/services/events`, `/work`, and the service detail pages were not edited, so their sitemap dates stay put.

## 2026-11-06 — Second CTR title and meta pass

Search Console still showed impressions and no clicks on commercial pages that were not in the 2026-11-02 title pass. This pass rewrites the SEO title, the meta description, and the matching Open Graph and Twitter title and description. Article slugs, H1s, and bodies are unchanged. No redirect was added, no article was merged or created, and no Gen Z page was edited. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited.

Source: GSC Pages.csv, Web search, 28 days ending ~Oct 31 2026, pulled Nov 2 2026 ~6:15 AM ET. The same window is mirrored in the Oct 23–31 half of the Nov 4 compare export. A live check on Nov 6 2026, before this edit, confirmed the titles below were still the ones recorded at about 10:02 AM ET that day. Re-check CTR in about 2-3 weeks, once Google has recrawled the snippets. The 2026-11-02 titles on `/` and the six insight URLs from that pass were left alone.

Baseline, same export. Clicks, impressions, CTR, average position:

- `/insights/college-tour-marketing`: 0 clicks, 27 impressions, 0%, position 7.52
- `/insights/campus-field-marketing-agency`: 0, 25, 0%, 10.92
- `/insights/on-campus-product-sampling`: 0, 29, 0%, 13.28
- `/insights/university-activations`: 0, 42, 0%, 18.69. This URL had 1 click in the short Nov 1–2 window. The snippet was still rewritten.
- `/insights/campus-product-sampling-ideas`: 0, 29, 0%, 20.24
- `/insights/college-festival-sponsorship`: 0, 11, 0%, 9
- `/insights/college-brand-ambassador-program`: 0, 7, 0%, 9.14
- `/insights/student-housing-marketing-agency`: 0, 55, 0%, 24.16
- `/services/events`: 0, 47, 0%, 26.96
- `/work`: 0, 78, 0%, 48.49
- `/insights`: 0, 45, 0%, 48.07

Titles below are the rendered document titles. The root template is still `%s | Collegiate Agency`. A lead is left short enough that the suffix fits inside 60 characters. None of the new leads already end in Collegiate Agency, so the brand is not added twice. Where "for Brands" plus the full query would push the suffix past 60 characters, the lead keeps the query and the suffix carries the brand. The description names the brand buyer.

- `/insights/college-tour-marketing` title: `College Tour Marketing Field Plan | Collegiate Agency` -> `College Tour Marketing for Brands | Collegiate Agency`. Description: `Plan college tour marketing with smart campus selection, staffing, events, ambassadors, content, and a practical rollout timeline.` -> `Brands hire college tour marketing when the route has to hold. Pick the campuses, staff each stop, and connect the live event to ambassadors on the ground.`
- `/insights/campus-field-marketing-agency` title: `Campus Field Marketing Agency: Pilot Buying Guide` -> `Campus Field Marketing Agency | Collegiate Agency`. The old lead was 48 characters, so the brand suffix was omitted. Description: `Compare campus field marketing agency proposals by local coverage, inventory controls, reporting, and clear pilot acceptance criteria.` -> `Brands hire a campus field marketing agency for a defined pilot: local coverage, inventory records, comparable reporting, and a rule for expansion.`
- `/insights/on-campus-product-sampling` title: `On-Campus Product Sampling Guide | Collegiate Agency` -> `On-Campus Product Sampling for Brands | Collegiate Agency`. Description: `Plan on-campus product sampling with the right campuses, student reps, timing, proof of work, and follow-up for a cleaner first campaign.` -> `Hire on-campus product sampling by student behavior, not school logos. Staff the handoff, set the follow-up, and judge whether the first test worked.`
- `/insights/university-activations` title: `University Activations Field Guide | Collegiate Agency` -> `University Activations for Brands | Collegiate Agency`. Description: `Plan university activations with campus fit, student staffing, event formats, creator support, and a practical approval checklist.` -> `University activations for brands that hire the field team. Define the job, pick the format, staff the day, and lock the plan before launch day.`
- `/insights/campus-product-sampling-ideas` title stayed `Campus Product Sampling Ideas for Brands | Collegiate Agency`. That string is already 60 characters, leads with the query, names the buyer, and includes the brand. Description: `Campus product sampling ideas that go beyond handouts — where to sample, how to pick moments, staffing, follow-up, and measurement so trial turns into repeat.` -> `Campus product sampling ideas brands hire an agency to run. Pick the moment, staff the handoff, and set the follow-up that turns trial into repeat.`
- `/insights/college-festival-sponsorship` title stayed `College Festival Sponsorship for Brands | Collegiate Agency`. That string is 59 characters, leads with the query, names the buyer, and includes the brand. Description: `A brand guide to college festival sponsorship — choosing the right festivals, negotiating deliverables, activating on site, and measuring the return.` -> `College festival sponsorship for brands that want more than a banner. Choose the festival, name the deliverables, and measure the trial and the content.`
- `/insights/college-brand-ambassador-program` title: `College Brand Ambassador Program Guide | Collegiate Agency` -> `College Brand Ambassador Program | Collegiate Agency`. Adding "for Brands" to the full query would drop the brand suffix. Description: `Build a college brand ambassador program with clear roles, recruitment, training, proof-of-work, compensation, and reporting that brands can actually trust.` -> `Build a college brand ambassador program brands hire for: clear roles, recruiting, training, proof of work, pay, and reporting they can trust.`
- `/insights/student-housing-marketing-agency` title: `Student Housing Marketing Agency Guide | Collegiate Agency` -> `Student Housing Marketing Agency | Collegiate Agency`. Adding "for Brands" to the full query would drop the brand suffix. Description: `Hire a student housing marketing agency by separating search and websites from on-campus dates, peer posts, and local ads of the same creative.` -> `Hire a student housing marketing agency for lease-up. Brands keep search and websites separate from on-campus dates, peer posts, and local ads.`
- `/insights` title: `Campus marketing insights | Collegiate Agency` -> `Campus Marketing Insights for Brands | Collegiate Agency`. Description: `Practical, brand-facing perspective on campus marketing: product placement, ambassador campaigns, and winning welcome week.` -> `Campus marketing insights for brands and in-house teams hiring an agency. Events, ambassadors, sampling, and sponsorship from Collegiate Agency.` The page now emits CollectionPage, ItemList, and BreadcrumbList JSON-LD. The ItemList is the published posts already rendered on the page, in that order, using each post's visible title. Home and Insights are the breadcrumbs. No FAQ was added.
- `/services/events` title: `Campus event marketing | Collegiate Agency` -> `Campus Event Marketing for Brands | Collegiate Agency`. Description: `Custom campus activations planned, staffed, and executed end to end - Welcome Week takeovers, tailgates, sampling, and experiential moments students actually show up for.` -> `Campus event marketing for brands that hire Collegiate Agency to plan, staff, and run Welcome Week, tailgates, sampling, and other activations.` The H1 is unchanged.
- `/work` title: `Campus marketing case studies | Collegiate Agency` -> `Campus Marketing Case Studies for Brands | Collegiate Agency`. Description: `Collegiate Agency case studies of campus events, brand ambassador programs, and product placement that brands hire to reach college students.` -> `Campus marketing case studies for brands hiring Collegiate Agency. Published write-ups cover campus events, brand ambassador programs, and product placement.` The H1 and the case-study cards are unchanged.

- `dateModified` is `2026-11-06` on the eight insight articles above. Their `date` values are unchanged, so each insight URL's sitemap `lastmod` is 2026-11-06 UTC midnight.
- `/services/events` and `/work` use `CTR_WAVE_LAST_MODIFIED` (`2026-11-06`) in `src/app/sitemap.ts`. `/insights` uses the newer of that date and the newest article revision, which is 2026-11-06. Topic hubs that include one of these articles already take the newest article revision, so their sitemap `lastmod` moves to 2026-11-06 with the existing rule.
- `/` stays on `HOME_FAQ_LAST_MODIFIED` (`2026-11-04`). `/services` stays on `SERVICES_HUB_FAQ_LAST_MODIFIED` (`2026-11-05`). `/services/brand-ambassadors` stays on 2026-10-21. `/contact` and `/build-a-campaign` stay on 2026-10-28.

## 2026-11-05 — Services hub FAQ and campus marketing agency copy

Search Console (28 days ending ~Oct 31 2026, pulled Nov 2) showed the query "campus marketing agency" with 53 impressions, position about 35, and 0 clicks. A what's-working check pulled Nov 4 (data through Nov 2) showed `/services` lost its clicks after the Oct 26 retitle, with average position moving from about 8.2 to about 53. A live check at about 10:12 AM ET on Nov 5 2026 found `https://collegiateagency.com/services` titled `Campus Marketing Services for Brands | Collegiate Agency`, with a brand-only meta description, the H1 "Campus marketing services for brands.", no visible FAQ, and no FAQPage JSON-LD. The three service detail pages already publish both. Sitemap `lastmod` for `/services` was still 2026-10-26.

`/services` now has six questions for brands, in-house marketing teams, and agencies. One array in `src/lib/services-hub-faq.ts` feeds `ServiceFaq` and `FaqPageJsonLd`, so the visible questions and the FAQPage JSON-LD use the same words. An answer may contain a markdown link. The HTML renders that link, and `acceptedAnswer.text` is the same sentence with the URL removed. The block sits in the brands section, below the three channel blocks and a short guides block, and above the final brand call to action. It is not in the hero and not in `#for-students`.

The document title lead is `Campus Marketing Agency for Brands`, which renders as `Campus Marketing Agency for Brands | Collegiate Agency`. The brand suffix is added once, and the title stays within 60 characters. The meta description, Open Graph, Twitter, and WebPage JSON-LD use the same brand-only description: a campus marketing agency brands hire for campus events, brand ambassadors, and product placement at colleges nationwide, run end to end by Collegiate Agency. The H1 is "A campus marketing agency for brands." Student recruiting stays in `#for-students`.

A guides block on the brands section links to the existing insight pages `/insights/college-marketing-agency`, `/insights/campus-marketing-agency-rfp`, `/insights/campus-brand-activation-agency`, and `/insights/college-brand-ambassador-program`. Those slugs were checked with `getPost` before linking. The page still links to `/services/events`, `/services/brand-ambassadors`, `/services/product-placement`, `/pricing`, `/build-a-campaign`, and `/contact`.

Answers stay inside facts already published in `src/site.config.ts` and the pricing table: the rates `$150 / ambassador / month`, `$2,500 / campus`, and event packages from `$500` to `$500,000`, anything else quoted per campaign, `7 days` from a signed SOW to boots on the ground, the one-business-day reply, the New York base, and the published network of 21 campuses and 2,000 student ambassadors. College students are described as the audience. No intern claim, client, review, result, phone number, or street address was added. The contact email and Organization `sameAs` were not changed.

- Sitemap `lastmod` for `/services` is `SERVICES_HUB_FAQ_LAST_MODIFIED` (`2026-11-05`) in `src/app/sitemap.ts`. That date supersedes the 2026-10-26 brand-positioning stamp for `/services` only. `/` stays on `HOME_FAQ_LAST_MODIFIED` (`2026-11-04`). Other static route dates are unchanged. Insight `dateModified` values were not moved.
- No new article was written. Gen Z pillar pages were not edited. No article was merged or redirected.
- `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited.

## 2026-11-04 — Homepage FAQ for AI-answer readiness

A live check at about 10:05 AM ET on Nov 4 2026 found production healthy. Key pages returned 200, `www` returned 308 to the apex, the IndexNow key file returned 200, and the CTR pages already had sitemap `lastmod` of 2026-11-03. The homepage ranks for and targets "college marketing agency" and still had no visible FAQ and no FAQPage JSON-LD. The service detail pages, `/pricing`, `/contact`, and several commercial articles already publish both.

`/` now has six questions for brands, in-house marketing teams, and agencies. One array in `src/lib/home-faq.ts` feeds `ServiceFaq` and `FaqPageJsonLd`, so the visible questions and the FAQPage JSON-LD use the same words. An answer may contain a markdown link. The HTML renders that link, and `acceptedAnswer.text` is the same sentence with the URL removed. That is the article FAQ rule, applied here so the schema text is the text on the page.

Answers stay inside facts already published in `src/site.config.ts`, the pricing table, and pages already live: the college and campus marketing agency definition, campus events, brand ambassador programs, and product placement, the rates `$150 / ambassador / month`, `$2,500 / campus`, and event packages from `$500` to `$500,000`, anything else quoted per campaign, `7 days` from a signed SOW to boots on the ground, the one-business-day reply with a tailored plan and firm pricing, the New York base, and the published network of 21 campuses. Students are described as the audience, and the ambassador roster as the network a brand hires the agency to field, which is the wording already on `/about`. No intern claim, client, review, result, or new timeline was added. The contact email and Organization `sameAs` were not changed.

The block sits below the lead magnet and above the final call to action. It is not in the hero. The hero H1 is unchanged.

- Sitemap `lastmod` for `/` is `HOME_FAQ_LAST_MODIFIED` (`2026-11-04`) in `src/app/sitemap.ts`. `/services` stays on `BRAND_POSITIONING_LAST_MODIFIED` (`2026-10-26`). Other static route dates are unchanged. Insight `dateModified` values stay on 2026-11-03.
- Titles, meta descriptions, Open Graph, Twitter, article bodies, photos, and Gen Z pages were not edited. No new article was written.
- `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited.

## 2026-11-03 — IndexNow lastmod for CTR title/meta pages

PR #31, merged 2026-11-02, rewrote the SEO title, meta description, and matching Open Graph and Twitter title and description on the homepage and six insight URLs. Those titles were already live on production. The sitemap `lastmod` values and the article `dateModified` values were not moved. IndexNow (`scripts/indexnow-ping.cjs`, the startup ping, and `/api/cron/indexnow`) only submits sitemap URLs whose `lastmod` is inside 72 hours, so the snippet changes were never submitted. A live check of `https://collegiateagency.com/sitemap.xml` at about 10:08 AM ET on Nov 3 2026 still showed `/` at 2026-10-26 and the six insight URLs at 2026-10-23.

This change only moves those dates to 2026-11-03 so IndexNow and other crawlers see a fresh `lastmod`. No titles, descriptions, bodies, H1s, FAQs, images, slugs, or redirects were edited. No new article was written. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited.

- `/` uses `CTR_TITLE_META_LAST_MODIFIED` (`2026-11-03`) in `src/app/sitemap.ts`. `/services` stays on `BRAND_POSITIONING_LAST_MODIFIED` (`2026-10-26`). Other static route dates are unchanged.
- `dateModified` is `2026-11-03` on `campus-influencers`, `college-marketing-agency`, `campus-product-launch`, `college-event-sponsorship`, `college-experiential-marketing-agency`, and `campus-brand-activation-agency`. Their `date` values are unchanged, so the sitemap `lastmod` for each insight URL is 2026-11-03 UTC midnight.
- `/insights` and any topic hub that includes one of those articles already take the newest article revision, so their sitemap `lastmod` moves to 2026-11-03 with the existing rule.

The seven URLs:

- `https://collegiateagency.com/`
- `https://collegiateagency.com/insights/campus-influencers`
- `https://collegiateagency.com/insights/college-marketing-agency`
- `https://collegiateagency.com/insights/campus-product-launch`
- `https://collegiateagency.com/insights/college-event-sponsorship`
- `https://collegiateagency.com/insights/college-experiential-marketing-agency`
- `https://collegiateagency.com/insights/campus-brand-activation-agency`

## 2026-11-02 — Title and meta description CTR pass

Search Console showed impressions and almost no clicks on the homepage and six insight URLs. This pass rewrites only the SEO title, the meta description, and the matching Open Graph and Twitter title and description. Article slugs, H1s, and bodies are unchanged. No redirect was added, no article was merged or created, and no Gen Z page was edited. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited.

Source: GSC export, 28 days ending ~Oct 31 2026, pulled Nov 2 2026 ~6:15 AM ET. Web search. Re-check CTR in about 2-3 weeks, once Google has recrawled the snippets.

Baseline, same export. Clicks, impressions, CTR, average position:

- `/`: 6 clicks, 212 impressions, 2.83%, position 13.4
- `/insights/campus-influencers`: 2, 123, 1.63%, 13.76
- `/insights/college-marketing-agency`: 0, 61, 0%, 11
- `/insights/campus-product-launch`: 0, 53, 0%, 8.58
- `/insights/college-event-sponsorship`: 1, 57, 1.75%, 6.68
- `/insights/college-experiential-marketing-agency`: 0, 44, 0%, 14.64
- `/insights/campus-brand-activation-agency`: 0, 41, 0%, 10.1

Queries used to match the wording searchers type, same export: `college agency` 50 impressions, position 3.38, 0 clicks; `the college agency` 33 impressions, position 5.7, 0 clicks; `college branding agency` 75 impressions, position 32, 0 clicks; `campus marketing agency` 53 impressions, position 35, 0 clicks; `college marketing agency` 30 impressions, position 66, 0 clicks; `campus influencers` 6 impressions, position 10.7, 1 click; `campus launch` 13 impressions, position 9.9, 0 clicks.

Titles below are the rendered document titles. The root template is still `%s | Collegiate Agency`, and a lead is left short enough that the suffix fits inside 60 characters. None of the new leads already end in Collegiate Agency, so the brand is not added twice.

- `/` title: `College Marketing Agency | Collegiate Agency` -> `College Marketing Agency for Brands | Collegiate Agency`. Description: `A college and campus marketing agency for campus events and brand ambassador programs, connecting brands with students where they live, study, and go out.` -> `A college agency brands hire for campus marketing: events, ambassador programs, and product sampling, with 2,000 student ambassadors on 21 campuses.` The 2,000 and 21 figures are the homepage stats already in `site.config.ts`. The footer line and Organization description stay on `siteConfig.description`.
- `/insights/campus-influencers` title: `Campus Influencers: College Creator Program Guide` -> `Campus Influencers for Brand Campaigns | Collegiate Agency`. Description: `Build a campus influencers program with better creator selection, briefs, content rights, event tie-ins, and practical proof of work.` -> `Hire campus influencers for a brand campaign. Vet student creators for campus fit, set the brief and content rights, and tie each post to a live event.`
- `/insights/college-marketing-agency` title: `College Marketing Agency: How to Choose One` -> `College Marketing Agency: How to Choose | Collegiate Agency`. Description: `How to choose a college marketing agency for campus events, ambassadors, influencers, sampling, and Gen Z growth without wasting budget.` -> `How to choose a college marketing agency for events, ambassadors, and sampling. Compare campus access, the operating plan, and the proof you get back.`
- `/insights/campus-product-launch` title: `Campus Product Launch: Field Plan for Brands` -> `Campus Product Launch Plan for Brands | Collegiate Agency`. Description: `Plan a campus product launch with the right schools, student reps, events, sampling moments, content, and recap before budget gets wasted.` -> `A field plan for a campus product launch brands can run: choose the schools, line up sampling and events, and set what a campus launch recap must prove.`
- `/insights/college-event-sponsorship` title: `College Event Sponsorship Guide | Collegiate Agency` -> `College Event Sponsorship for Brands | Collegiate Agency`. Description: `Plan college event sponsorship with clear goals, campus fit, activation rights, staffing, timelines, and proof of work before you commit budget.` -> `Plan college event sponsorship before the budget is committed: fit the campus moment, name the activation rights, and require proof a brand can use.`
- `/insights/college-experiential-marketing-agency` title: `College Experiential Marketing Agency Guide` -> `College Experiential Marketing Agency | Collegiate Agency`. Description: `Compare a college experiential marketing agency on format, permission, guest action, product custody, staffing, and auditable proof.` -> `Hiring a college experiential marketing agency for a pop-up, sampling station, or tour stop? Compare permission, staffing, and proof before you sign.`
- `/insights/campus-brand-activation-agency` title stayed `Campus Brand Activation Agency Checklist | Collegiate Agency`. That string is already 60 characters, leads with the query, and includes the brand. Description: `How to choose a campus brand activation agency for events, sampling, ambassadors, proof of work, staffing, risk, and measurement.` -> `A buyer checklist for hiring a campus brand activation agency: events, sampling, ambassadors, day-of staffing, and the proof a brand gets back.`

## 2026-10-30 — Insight topic hubs

`/insights` now links to six server-rendered topic hubs. No article was merged, deleted, or redirected. No article bodies, photos, or the photo-usage ledger were edited. `scripts/collegiate_seo_autopublish.py` gained a reserved-slug check so a future article cannot take the slug `topics`. `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited.

- Hubs live at `/insights/topics/<slug>`, which cannot collide with an article URL. The slugs are `brand-ambassador-programs`, `campus-events-and-activations`, `product-sampling-and-placement`, `student-influencers`, `campus-sponsorship`, and `campus-marketing-strategy`.
- Assignment is the mapping in `src/lib/insight-topics.ts`. A known frontmatter `topic` overrides that mapping. A missing or unknown topic is ignored: the article still renders on `/insights` and on its own URL, so a later publish builds without a mapping edit. The article slug `topics` is rejected by the loader and by the publisher.
- There is no Gen Z hub. The Gen Z articles stay in the strategy hub. Hub titles, descriptions, and introductions do not use the reserved pillar phrase.
- Each hub has its own title within 60 characters, meta description, canonical, Open Graph and Twitter image (the existing text card), an H1, a brand-framed introduction, a link to the closest service or pricing page, and the article list. JSON-LD is CollectionPage, ItemList, and BreadcrumbList (Home, Insights, hub). Articles keep their own FAQPage. An article breadcrumb adds the hub when the article has one.
- Sitemap `lastmod` for each hub is the newer of 2026-10-30 and the newest article revision in that hub. `llms.txt` and `llms-full.txt` list the hubs.

## 2026-10-29 — Public vercel.app aliases redirect to the apex

Requests to the public production aliases now 308 to the same path and query on `https://collegiateagency.com`. No article bodies, photos, or the photo-usage ledger were edited. `scripts/collegiate_seo_autopublish.py`, `content/seo/publish-log.md`, `content/seo/autopublish-state.json`, and `content/seo/keyword-map.md` were not edited.

- The hosts are `college-marketing-agency-site.vercel.app`, `college-marketing-agency-site-s8tw.vercel.app`, and `college-marketing-agency-site-ksro.vercel.app`. The second and third are the other Vercel projects that deploy this same repo. Each was serving the site with `index, follow` and a canonical on the apex. The match is the exact host. Preview URLs, per-deployment URLs, and the SSO-protected team aliases are not matched. Those already send `x-robots-tag: noindex`.
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

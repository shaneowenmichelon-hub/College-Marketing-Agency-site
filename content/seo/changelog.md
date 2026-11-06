# SEO changelog

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

# SEO publisher operating contract

## Cadence and historical distinction

The original July implementation chose a random minute between 08:00 and 18:00 America/Chicago on the next day, and published only on odd-numbered daily runs. The September 2 request changed publication from approximately 48 hours to 36 hours; the September 8 committed wrapper (`166e9b3`) and preserved pre-repair backup implement a fixed 36-hour interval. There was no recovered historical randomized 36-hour formula.

The October 15 repair implements the current request as **36 elapsed hours plus one uniformly sampled integer delay of 0–1800 seconds**, anchored to independently verified publication. This is a newly explicit combination, not a claim that this exact formula existed before. The sample and anchor are persisted once in operational state. UTC arithmetic preserves elapsed time across daylight-saving transitions. The unchanged 30-minute watchdog attempts publication on its first check at or after eligibility, so a healthy scheduler normally begins 36–37 hours after the last verification. Generation/build/deployment time is additional. There is no daytime restriction, even-run skip, or catch-up burst.

Failure retains the same preparation/artifact and run number. First failure retries after 30 minutes; subsequent failures retry after 36 hours. A timeout with uncertain generation state requires operator review rather than minting another draft. Next normal eligibility advances only after article/photo/sitemap/body-link verification succeeds.

## Runtime and content gates

- The current scheduler resolves `collegiate_seo_autopublish.py` inside the active profile's scripts directory. For Nik that is `/Users/jamesmadison/.hermes/profiles/nik/scripts/`. A matching compatibility copy remains in `/Users/jamesmadison/.hermes/scripts/`.
- Install tested copies of the Python publisher, `writing_quality.py` (same directory), and `verify-seo-live.mjs`; compare SHA-256 values with the repository source. Back up first and install under the existing publisher lock.
- The generation subprocess explicitly selects `gpt-6-astra` / `openai-codex`, strips inherited Python virtual-environment variables, and does not change profile defaults.
- New publications require an existing approved owned photograph. Its exact asset must have an owned-rights entry in `public-photo-library.md`; use `imageRights: owned` and `imageCredit: Collegiate Agency`. Do not fabricate `imageSource` or `imageLicense` fields. Follow per-photo caption restrictions.
- From 2026-10-25 04:30 America/New_York, a new article also needs exactly two inline owned photos, authored as `![alt](/images/...)` with a `Caption:` line when a caption helps. The publisher reads `content/seo/photo-usage.json` and prefers the least-used suitable frame. Rules, also written in `public-photo-library.md`: one hero and two inline photos; no repeat inside an article; a photo is a hero on at most two articles (a third only when nothing under two remains; never a fourth); a photo appears on about six articles and not an eighth; mix one crowd/people shot, one setup/staffing shot, and one product-in-hand shot when the catalog still has each role under the cap. The premiere step-and-repeat stays off slugs that contain `agency`. Never caption attendees or bartenders as staff. Inline photos must be owned library assets, have alt text, and return HTTP 200 on the live site. The publisher records the hero and both inline uses in the ledger when it commits.
- Validation retains a strict licensed-photo path for existing artifacts. Source and license URLs must belong to that same photo's library entry. A licensed photo cannot be relabeled owned.
- Preserve buyer-intent, duplicate/keyword lockout, contextual-link, table, metadata, immutable-artifact, clean-worktree, atomic-state and lock gates.
- A new article must pass the writing-quality check and must have `content/seo/briefs/<slug>.md` before commit. Existing articles are outside that check. See below.
- A new article's primary keyword, title, and slug must stay off the permanent "Reserved for pillar pages, never target" list in `keyword-map.md`. The 60-day lockout and the 36-hour cadence are unchanged.

## Writing quality (new articles only)

New articles follow `content/seo/writing-rules.md`. `content/seo/banned-phrases.txt` adapts the MIT-licensed mentionstack blacklist (Dylan Ander; Toprank Contributors). See `THIRD_PARTY_NOTICES.md`. Ordinary connectors stay available, including however, therefore, additionally, also, and because. Obvious AI-cliché words and phrases stay banned.

`scripts/writing_quality.py` checks the article body, not the frontmatter. Before matching, it blanks inline code, fenced code, bare URLs, and markdown link targets with plain regular expressions. It flags a banned phrase (whole word or whole phrase, case-insensitive), an em dash, and a first prose paragraph longer than 3 sentences. `prepare()` runs this check on the new article and raises `writing-quality` before anything is committed. Articles already in `content/blog` are not passed through this gate, so they do not fail `npm run build`.

The phrase list is read from the worktree copy of `content/seo/banned-phrases.txt`. Install `writing_quality.py` beside `collegiate_seo_autopublish.py`.

## Pre-article brief

Each publisher run writes `content/seo/briefs/<slug>.md` from `content/seo/briefs/_template.md` before drafting. The brief records the primary query, the hypothesis (why this page should win the click), the target AI engines and prompts, the competitor pages to beat, the CTA path (`/contact` or `/build-a-campaign`), and the expected outcome. The 30-day and 60-day sections start blank. They are where a later check records GA4 sessions, `cta_click` and `generate_lead` events with `?article=<slug>` attribution, and Search Console clicks and impressions once Search Console is connected.

`prepare()` rejects a new article when that brief is missing, still has a blank TODO section, lacks the CTA path, or omits a check signal. `publish_prepared()` commits the brief with the article. The template file itself is not an article brief.

## Reserved pillar keywords

`content/seo/keyword-map.md` has a permanent section, "Reserved for pillar pages, never target". It is not a 60-day lockout and it does not change cadence or autopublish-state timing. New lockout rows are inserted above that section.

A new article fails with `reserved-keyword` when its primary keyword, title, or slug matches a reserved term or closely varies it. Comparison lowercases the text, strips stopwords, and treats `gen z`, `genz`, and `generation z` as the same token. The same content words in any order match. So do those words appearing in order inside a longer phrase. An extra word in the middle of the phrase does not match, which is why the existing article `gen z experiential marketing` stays valid. Existing articles are not sent through this check. The seeded terms are the Gen Z pillar (`/insights/how-to-market-to-gen-z`) and the homepage term `college marketing agency`.

## Verification and limits

Run `python3 -m unittest discover -s tests -p 'test_seo*.py' -v`, `node --test tests/*.test.cjs tests/*.test.mjs`, and `npm run build` with the supported Node environment. A silent not-due tick is not publication evidence.

The October 15 recovery article was manually authored, then exercised through the actual prepare, build, publish and independent live-verification functions. Direct CLI inference availability passed; a full unattended article-generation run was not exercised during that recovery. Receipts, script backups, hashes, live DOM/photo/table checks and model smoke evidence are under Nik's `state/seo-repair/`. No agent configuration, guardrails, skills or cron-job configuration were modified.

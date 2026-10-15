# SEO publisher operating contract

## Cadence and historical distinction

The original July implementation chose a random minute between 08:00 and 18:00 America/Chicago on the next day, and published only on odd-numbered daily runs. The September 2 request changed publication from approximately 48 hours to 36 hours; the September 8 committed wrapper (`166e9b3`) and preserved pre-repair backup implement a fixed 36-hour interval. There was no recovered historical randomized 36-hour formula.

The October 15 repair implements the current request as **36 elapsed hours plus one uniformly sampled integer delay of 0–1800 seconds**, anchored to independently verified publication. This is a newly explicit combination, not a claim that this exact formula existed before. The sample and anchor are persisted once in operational state. UTC arithmetic preserves elapsed time across daylight-saving transitions. The unchanged 30-minute watchdog attempts publication on its first check at or after eligibility, so a healthy scheduler normally begins 36–37 hours after the last verification. Generation/build/deployment time is additional. There is no daytime restriction, even-run skip, or catch-up burst.

Failure retains the same preparation/artifact and run number. First failure retries after 30 minutes; subsequent failures retry after 36 hours. A timeout with uncertain generation state requires operator review rather than minting another draft. Next normal eligibility advances only after article/photo/sitemap/body-link verification succeeds.

## Runtime and content gates

- The current scheduler resolves `collegiate_seo_autopublish.py` inside the active profile's scripts directory. For Nik that is `/Users/jamesmadison/.hermes/profiles/nik/scripts/`. A matching compatibility copy remains in `/Users/jamesmadison/.hermes/scripts/`.
- Install tested copies of both the Python publisher and `verify-seo-live.mjs`; compare SHA-256 values with the repository source. Back up first and install under the existing publisher lock.
- The generation subprocess explicitly selects `gpt-6-astra` / `openai-codex`, strips inherited Python virtual-environment variables, and does not change profile defaults.
- New publications require an existing approved owned photograph. Its exact asset must have an owned-rights entry in `public-photo-library.md`; use `imageRights: owned` and `imageCredit: Collegiate Agency`. Do not fabricate `imageSource` or `imageLicense` fields. Follow per-photo caption restrictions.
- Validation retains a strict licensed-photo path for existing artifacts. Source and license URLs must belong to that same photo's library entry. A licensed photo cannot be relabeled owned.
- Preserve buyer-intent, duplicate/keyword lockout, contextual-link, table, metadata, immutable-artifact, clean-worktree, atomic-state and lock gates.

## Verification and limits

Run `python3 -m unittest discover -s tests -p 'test_seo*.py' -v`, `node --test tests/*.test.cjs tests/*.test.mjs`, and `npm run build` with the supported Node environment. A silent not-due tick is not publication evidence.

The October 15 recovery article was manually authored, then exercised through the actual prepare, build, publish and independent live-verification functions. Direct CLI inference availability passed; a full unattended article-generation run was not exercised during that recovery. Receipts, script backups, hashes, live DOM/photo/table checks and model smoke evidence are under Nik's `state/seo-repair/`. No agent configuration, guardrails, skills or cron-job configuration were modified.

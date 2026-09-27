# Collegiate Agency — authoring iron laws

Rules for anything published to this site: blog posts under `content/blog/*.mdx`,
case-study articles in `src/lib/content.ts`, and service/landing copy.

These are enforced in code, not just written down. Where a law has an automated
gate, it is named. Breaking one should fail a test or the publisher, not
silently ship.

---

## 1. Tabular data ships as a real table

Any comparison, price list, timeline, checklist-with-columns or before/after
goes in a **table**. Not a paragraph of pipes, not a bulleted list pretending
to be columns, and **never an image**.

**Author it as a GitHub-flavoured markdown pipe table:**

```markdown
Table: What a run campaign looks like versus one left to chance

| Phase | Timing | Output |
| --- | --- | ---: |
| Strategy | 4-6 weeks out | One-page campus brief |
| Recruiting | 3-5 weeks out | Confirmed roster |
```

Requirements, all enforced:

- A **separator row** (`| --- |`) directly under the header. Without it the row
  is just a paragraph containing pipe characters — this is exactly the bug that
  broke every table on the site.
- **At least two columns** and **at least one body row**.
- **Every row the same width** as the header. Ragged rows are rejected.
- Alignment is optional, from the separator: `:---` left, `---:` right,
  `:---:` centre.
- `Table: ...` on its own line directly above becomes the `<caption>`. Optional
  but preferred — it is what names the table for a screen reader or a scraper
  that has no surrounding context.
- The first column is treated as the row label and rendered `<th scope="row">`,
  so put the thing being compared there.

**Never** hand-write `<table>` HTML in an MDX body. Raw HTML in article bodies
is rejected by the publisher (`unsafe-markup`), and for good reason: the
markdown goes through one renderer that guarantees consistent, correct markup.

**Never** ship a screenshot, PNG or `<img>` of a table. An image is unreadable
to screen readers, unsearchable, untranslatable, uncopyable, and invisible to
the agents and crawlers that increasingly read this site. If the data is worth
showing, it is worth marking up.

*Why it matters beyond looks:* the rendered output is `<table>` → `<caption>` →
`<thead>` with `<th scope="col">` → `<tbody>` with `<th scope="row">` and
`<td>`. That structure is what lets anything — a screen reader, an LLM, a
spreadsheet paste, Google — recover which value belongs to which row and
column. A grid of styled `<div>`s looks identical and carries none of it.

**Enforced by:**
- `validate_tables()` in `scripts/collegiate_seo_autopublish.py` — blocks
  publishing on `table-missing-separator`, `table-ragged-rows`,
  `table-no-rows`, `table-single-column`.
- `tests/article-tables.test.cjs` — asserts real tables parse out of live
  content, that the component emits semantic markup, that no paragraph still
  contains raw pipes, and that no table renders as an image.

**Implemented by:**
- Parser: `parseMarkdownBody()` in `src/lib/blog-files.ts`
- Type: `ArticleTableBlock` in `src/lib/content.ts`
- Renderer: `src/components/article/ArticleTable.tsx` (used by both
  `/insights/[slug]` and `/work/[slug]` — add any new article renderer here too)

---

## 2. No invented facts, numbers, or proof

Statistics, client results, testimonials, reviews, ratings and structured data
must be real. An illustrative example is marked `sample: true` and labelled on
the page. Do not write a number to fill a slot.

Photos of identifiable people are only published with a release. Article
photography is licensed and credited in `content/seo/public-photo-library.md`,
with source and licence URLs — enforced by the `photo-license-provenance` gate.

## 3. Every internal link must resolve

Links to `/services/influencers` or any other non-existent route are rejected
(`validate_contextual_links`). Changing a live slug requires a 301 in
`next.config.mjs`.

## 4. Brands are the conversion priority

The site sells to brands; students are supply. Brand CTAs (`/contact`,
`/build-a-campaign`) get primary weight. Ambassador recruiting stays reachable
but secondary — never remove it, the ambassador network is the inventory brands
are buying. Never put a modal or interstitial over `/contact` or
`/build-a-campaign`.

## 5. Accessibility and motion

Anything that animates is gated behind `prefers-reduced-motion` (the shared
`.art-*` classes and `useReducedMotion` already handle this). Scrollable
regions are focusable. Images have real alt text describing the activation, not
the product.

## 6. Verify before claiming

Run `npm run build`, `npm run lint`, and `node --test tests/*.test.cjs` before
pushing. Layout changes get checked in a real browser at several viewport sizes
— the hero has been broken twice by changes that looked right in the source.

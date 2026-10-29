const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const read = (p) => fs.readFileSync(path.join(root, p), "utf8");

/**
 * Guards against the phone-layout bug that shipped on /contact.
 *
 * A grid item defaults to `min-width: auto`, so a column cannot shrink below
 * the min-content width of its contents. The contact column holds a logo
 * marquee and a photo capped at `max-w-md`, and that 448px cap became the
 * column's floor — the column stayed 448px wide inside a ~350px phone and the
 * heading, lead copy, photo and the entire enquiry form were clipped by the
 * section's `overflow-hidden`, with no way to scroll to them. It is a silent
 * failure: the page reports no horizontal overflow, because the content is
 * cut off rather than scrollable.
 */

test("the contact grid lets its columns shrink below min-content", () => {
  const src = read("src/app/contact/page.tsx");
  const grid = src.match(/className="grid[^"]*lg:grid-cols-2"/);
  assert.ok(grid, "could not find the contact two-column grid");
  assert.match(
    grid[0],
    /\[&>\*\]:min-w-0|min-w-0/,
    "contact grid items must be allowed to shrink, or the column is pinned to its widest child and the form is clipped on phones",
  );
});

test("wide fixed-width containers on contact stay inside a shrinkable column", () => {
  // max-w-* is fine; it is max-w-* on an unshrinkable grid item that pins the
  // column. If this file ever stops using the escape hatch, the test above
  // fails first — this one documents why the caps are safe to keep.
  const src = read("src/app/contact/page.tsx");
  assert.ok(src.includes("max-w-md"), "contact still caps its left column content");
});

test("article tables keep their scroll affordance", () => {
  const table = read("src/components/article/ArticleTable.tsx");
  assert.match(table, /TableScroller/, "tables must render through TableScroller");

  const scroller = read("src/components/article/TableScroller.tsx");
  assert.match(scroller, /role="region"/, "scrollable region must stay a labelled region");
  assert.match(scroller, /tabIndex=\{0\}/, "scrollable region must stay keyboard reachable");
  assert.match(scroller, /pointer-events-none/, "the edge fade must never swallow a swipe");
  assert.match(scroller, /Swipe the table/, "an overflowing table needs a visible hint");
});

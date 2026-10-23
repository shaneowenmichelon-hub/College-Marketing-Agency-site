const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const ts = require("typescript");

function resolveSrc(p) {
  for (const ext of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
    if (fs.existsSync(p + ext) && fs.statSync(p + ext).isFile()) return p + ext;
  }
  throw new Error("cannot resolve: " + p);
}

function load(file) {
  const m = new module.constructor(file, module);
  m.filename = file;
  m.paths = module.paths;
  m.require = (id) =>
    id.startsWith("@/") ? load(resolveSrc(path.join(__dirname, "../src", id.slice(2)))) : require(id);
  const compiled = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  m._compile(compiled, file);
  return m.exports;
}

const PNG = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+a9XkAAAAASUVORK5CYII=",
  "base64",
);

test("markdown images become figure blocks with intrinsic pixels, not broken links", () => {
  const { readIntrinsicSize } = load(path.join(__dirname, "../src/lib/image-intrinsic.ts"));
  const bloom = readIntrinsicSize(path.join(__dirname, "../public/images/blog/bloom-sampling-campus-nightlife.jpg"));
  assert.equal(bloom.width, 1333);
  assert.equal(bloom.height, 750);

  const cwd = process.cwd();
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "seo-figure-"));
  try {
    fs.mkdirSync(path.join(dir, "content/blog"), { recursive: true });
    fs.mkdirSync(path.join(dir, "public/images/blog"), { recursive: true });
    fs.writeFileSync(path.join(dir, "public/images/blog/tiny.png"), PNG);
    fs.writeFileSync(
      path.join(dir, "content/blog/test.mdx"),
      `---
slug: test
title: Test
category: Events
services: [events]
excerpt: Test figure
date: 2026-10-23
ctaService: events
---
A campus sampling plan starts with the room.

![Attendee holding a can at a sampling table](/images/blog/tiny.png)
Caption: Attendee holding a can at a Collegiate Agency sampling table.

## Next step

More advice.
`,
    );
    process.chdir(dir);
    const posts = load(path.join(cwd, "src/lib/blog-files.ts")).loadMdxPosts();
    const figure = posts[0].body.find((block) => block.type === "figure");
    assert.ok(figure, "expected a figure block");
    assert.equal(figure.src, "/images/blog/tiny.png");
    assert.equal(figure.alt, "Attendee holding a can at a sampling table");
    assert.equal(figure.caption, "Attendee holding a can at a Collegiate Agency sampling table.");
    assert.equal(figure.width, 1);
    assert.equal(figure.height, 1);
    assert.equal(
      posts[0].body.some((block) => block.type === "p" && block.html.includes("<a ")),
      false,
    );

    fs.writeFileSync(
      path.join(dir, "content/blog/bad.mdx"),
      `---
slug: bad
title: Bad
category: Events
services: [events]
excerpt: Bad figure
date: 2026-10-23
ctaService: events
---
![ ](https://example.com/secret.jpg)
`,
    );
    assert.throws(() => load(path.join(cwd, "src/lib/blog-files.ts")).loadMdxPosts(), /figure/);
  } finally {
    process.chdir(cwd);
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("a figure renders alt, caption, and the file's width and height", () => {
  const { renderToStaticMarkup } = require("react-dom/server");
  const { createElement } = require("react");
  const { ArticleFigure } = load(path.join(__dirname, "../src/components/article/ArticleFigure.tsx"));
  const html = renderToStaticMarkup(
    createElement(ArticleFigure, {
      block: {
        type: "figure",
        src: "/images/blog/tiny.png",
        alt: "Attendee holding a can at a sampling table",
        caption: "Attendee holding a can at a sampling table.",
        width: 1333,
        height: 750,
      },
    }),
  );
  assert.match(html, /<figure/);
  assert.match(html, /<figcaption/);
  assert.match(html, /alt="Attendee holding a can at a sampling table"/);
  assert.match(html, /width="1333"/);
  assert.match(html, /height="750"/);
  assert.doesNotMatch(html, /<a /);
});

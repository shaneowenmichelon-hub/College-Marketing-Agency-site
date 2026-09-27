const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

/**
 * Tables are a hard requirement, not a nicety: article data must ship as real
 * <table> markup so it stays extractable by screen readers, scrapers and
 * agents. These tests fail the moment that regresses.
 */
/** Resolves a bare module path to a real file, trying .ts then .tsx. */
function resolveSrc(p) {
  for (const ext of ['', '.ts', '.tsx', '/index.ts', '/index.tsx']) {
    if (fs.existsSync(p + ext) && fs.statSync(p + ext).isFile()) return p + ext;
  }
  throw new Error('cannot resolve: ' + p);
}

function load(file) {
  const m = new module.constructor(file, module);
  m.filename = file;
  m.paths = module.paths;
  m.require = (id) =>
    id.startsWith('@/') ? load(resolveSrc(path.join(__dirname, '../src', id.slice(2)))) : require(id);
  const compiled = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
  }).outputText;
  m._compile(compiled, file);
  return m.exports;
}

function loadTs(rel) {
  return load(resolveSrc(path.join(__dirname, '../src', rel.replace(/\.tsx?$/, ''))));
}

test('markdown pipe tables parse into table blocks, not pipe-filled paragraphs', () => {
  const { loadMdxPosts } = loadTs('lib/blog-files.ts');
  const posts = loadMdxPosts();
  assert.ok(posts.length > 0, 'expected some posts');

  const tables = posts.flatMap((p) => p.body.filter((b) => b.type === 'table'));
  assert.ok(tables.length > 0, 'expected at least one table across the blog');

  for (const t of tables) {
    assert.ok(t.columns.length >= 2, 'a table needs at least two columns');
    assert.ok(t.rows.length >= 1, 'a table needs at least one body row');
    for (const row of t.rows) {
      assert.equal(row.length, t.columns.length, 'every row must match the header width');
    }
  }

  // The regression this guards: a table rendering as literal "| a | b |" text.
  for (const post of posts) {
    for (const block of post.body) {
      if (block.type !== 'p') continue;
      const pipes = (block.html.match(/\|/g) || []).length;
      assert.ok(pipes < 2, `${post.slug}: paragraph still contains raw table pipes`);
    }
  }
});

test('a table block renders as semantic HTML a machine can read', () => {
  const { renderToStaticMarkup } = require('react-dom/server');
  const { createElement } = require('react');
  const { ArticleTable } = loadTs('components/article/ArticleTable.tsx');

  const html = renderToStaticMarkup(
    createElement(ArticleTable, {
      block: {
        type: 'table',
        caption: 'Channel comparison',
        columns: ['Channel', 'Cost', 'Reach'],
        rows: [['Events', '$5,000', '3,000']],
        align: ['left', 'right', 'right'],
      },
    }),
  );

  assert.match(html, /<table/, 'must be a real table element');
  assert.match(html, /<caption[^>]*>Channel comparison<\/caption>/);
  assert.match(html, /<thead>/);
  assert.match(html, /<th[^>]+scope="col"[^>]*>/);
  assert.match(html, /<tbody>/);
  assert.match(html, /<th[^>]+scope="row"[^>]*>/, 'first column is the row label');
  assert.match(html, /<td/);
  assert.match(html, /Events/);
  assert.match(html, /\$5,000/);

  // Explicitly NOT an image of a table.
  assert.doesNotMatch(html, /<img/);
  assert.doesNotMatch(html, /background-image/);
});

test('every article renderer handles the table block type', () => {
  for (const rel of ['app/insights/[slug]/page.tsx', 'app/work/[slug]/page.tsx']) {
    const src = fs.readFileSync(path.join(__dirname, '../src', rel), 'utf8');
    assert.match(src, /ArticleTable/, `${rel} must render tables through ArticleTable`);
  }
});

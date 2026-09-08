const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const ts = require('typescript');
function load(file) {
  const m = new module.constructor(file, module);
  m.filename = file; m.paths = module.paths;
  m.require = id => id.startsWith('@/') ? load(path.join(__dirname,'../src',id.slice(2)+'.ts')) : require(id);
  m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText,file);
  return m.exports;
}
test('cover renders a photograph with alt text instead of SVG when supplied', () => {
  const {renderToStaticMarkup}=require('react-dom/server');
  const {createElement}=require('react');
  const {ArticleArt}=load(path.join(__dirname,'../src/components/insights/ArticleArt.tsx'));
  const html=renderToStaticMarkup(createElement(ArticleArt,{slug:'test',category:'Events',image:'/images/blog/test.jpg',imageAlt:'Campus lawn'}));
  assert.match(html,/<img /);
  assert.match(html,/alt="Campus lawn"/);
  assert.doesNotMatch(html,/<svg/);
  const legacy=renderToStaticMarkup(createElement(ArticleArt,{slug:'test',category:'Events'}));
  assert.match(legacy,/<svg/);
});
test('photo frontmatter survives the actual MDX loader', () => {
  const cwd=process.cwd(); const dir=fs.mkdtempSync(path.join(os.tmpdir(),'seo-photo-'));
  try {
    fs.mkdirSync(path.join(dir,'content/blog'),{recursive:true});
    fs.writeFileSync(path.join(dir,'content/blog/test.mdx'),`---
slug: test
title: Test
category: Events
services: [events]
excerpt: Test photo
date: 2026-09-08
ctaService: events
image: /images/blog/test.jpg
imageAlt: Campus lawn
imageCredit: Photographer / Unsplash
imageSource: https://unsplash.com/photos/example
imageLicense: https://unsplash.com/license
---
Body
`);
    process.chdir(dir);
    const posts=load(path.join(cwd,'src/lib/blog-files.ts')).loadMdxPosts();
    assert.equal(posts[0].image,'/images/blog/test.jpg');
    assert.equal(posts[0].imageAlt,'Campus lawn');
    assert.equal(posts[0].imageCredit,'Photographer / Unsplash');
    assert.equal(posts[0].imageSource,'https://unsplash.com/photos/example');
    assert.equal(posts[0].imageLicense,'https://unsplash.com/license');
  } finally {process.chdir(cwd); fs.rmSync(dir,{recursive:true});}
});

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const heroPath = path.join(__dirname, "../src/components/home/Hero.tsx");
const cssPath = path.join(__dirname, "../src/styles/globals.css");

test("homepage hero headline is not hidden until hydration", () => {
  const hero = fs.readFileSync(heroPath, "utf8");
  assert.doesNotMatch(hero, /motion\.h1/);
  assert.match(hero, /<h1[\s\S]*?Where brands meet/);
  assert.doesNotMatch(hero, /hidden:\s*\{[^}]*opacity:\s*0/);

  const h1 = hero.slice(hero.indexOf("<h1"), hero.indexOf("</h1>"));
  assert.doesNotMatch(h1, /hero-rise/);
  assert.doesNotMatch(h1, /opacity/);
  assert.doesNotMatch(h1, /motion/);
});

test("hero entrance animation never fades the copy out", () => {
  const css = fs.readFileSync(cssPath, "utf8");
  const start = css.indexOf("@keyframes hero-rise");
  assert.ok(start !== -1, "hero-rise keyframes missing");
  const frames = css.slice(start, css.indexOf("}", css.indexOf("}", start) + 1) + 1);
  assert.match(frames, /translateY/);
  assert.doesNotMatch(frames, /opacity/);
  assert.match(css, /prefers-reduced-motion:\s*reduce[\s\S]*\.hero-rise\s*\{[^}]*animation:\s*none/);
});

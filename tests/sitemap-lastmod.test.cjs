const test = require("node:test");
const assert = require("node:assert/strict");
const { execSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

const root = path.join(__dirname, "..");

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
    id.startsWith("@/") ? load(resolveSrc(path.join(root, "src", id.slice(2)))) : require(id);
  const compiled = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      jsx: ts.JsxEmit.ReactJSX,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  m._compile(compiled, file);
  return m.exports;
}

function git(command) {
  return execSync(command, { cwd: root, encoding: "utf8" }).trim();
}

function shallowCheckout() {
  try {
    return git("git rev-parse --is-shallow-repository") === "true";
  } catch (error) {
    console.warn(`sitemap lastmod: git unavailable (${error.message}); skipped source-date check. CI should checkout with fetch-depth: 0.`);
    return "unavailable";
  }
}

const shallow = shallowCheckout();

test(
  "static route lastmod is the newest git date of the files that render the route",
  { skip: shallow === true ? "shallow git checkout; skipped source-date check. Use fetch-depth: 0." : shallow === "unavailable" },
  () => {
    const { STATIC_ROUTE_SOURCES, STATIC_ROUTE_UPDATED } = load(resolveSrc(path.join(root, "src/lib/route-updated")));
    const { default: sitemap } = load(resolveSrc(path.join(root, "src/app/sitemap")));
    const { posts } = load(resolveSrc(path.join(root, "src/lib/content")));

    const routes = Object.keys(STATIC_ROUTE_UPDATED);
    assert.deepEqual(Object.keys(STATIC_ROUTE_SOURCES), routes);

    for (const route of routes) {
      const files = STATIC_ROUTE_SOURCES[route];
      assert.ok(files.length > 0, route);
      let newest = "";
      for (const file of files) {
        assert.equal(fs.existsSync(path.join(root, file)), true, file);
        const date = git(`git log -1 --format=%cs -- ${file}`);
        assert.match(date, /^\d{4}-\d{2}-\d{2}$/, `${file} ${date}`);
        if (date > newest) newest = date;
      }
      assert.ok(
        STATIC_ROUTE_UPDATED[route] >= newest,
        `${route} STATIC_ROUTE_UPDATED ${STATIC_ROUTE_UPDATED[route]} is older than ${newest} (${files.join(", ")})`,
      );
    }

    const byLoc = new Map(sitemap().map((entry) => [entry.url, entry]));
    const latestArticle = posts.reduce((latest, post) => {
      const stamp = post.dateModified ?? post.date;
      return stamp > latest ? stamp : latest;
    }, "");
    for (const route of routes) {
      const loc = route === "/" ? "https://collegiateagency.com" : `https://collegiateagency.com${route}`;
      const expected =
        route === "/insights" && latestArticle > STATIC_ROUTE_UPDATED[route]
          ? latestArticle
          : STATIC_ROUTE_UPDATED[route];
      assert.equal(byLoc.get(loc).lastModified.toISOString(), `${expected}T00:00:00.000Z`, route);
    }
  },
);

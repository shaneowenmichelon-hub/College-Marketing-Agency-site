/**
 * Build-step IndexNow ping.
 *
 * npm runs this after `next build`. It submits only when VERCEL_ENV=production
 * or INDEXNOW_PING=1. During the build the new deployment is not aliased yet,
 * so api.indexnow.org may answer 403 or 202 until /{key}.txt is reachable.
 * src/instrumentation.ts and /api/cron/indexnow send the same payload once the
 * deployment is live. A network failure does not fail the build.
 */
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

function load(file) {
  const m = new module.constructor(file, module);
  m.filename = file;
  m.paths = module.paths;
  m.require = (id) =>
    id.startsWith("@/") ? load(resolveSrc(path.join(__dirname, "../src", id.slice(2)))) : require(id);
  const compiled = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2022,
    },
  }).outputText;
  m._compile(compiled, file);
  return m.exports;
}

function resolveSrc(p) {
  for (const ext of ["", ".ts", ".tsx", "/index.ts", "/index.tsx"]) {
    if (fs.existsSync(p + ext) && fs.statSync(p + ext).isFile()) return p + ext;
  }
  throw new Error("cannot resolve: " + p);
}

async function main() {
  const production = process.env.VERCEL_ENV === "production";
  const forced = process.env.INDEXNOW_PING === "1";
  if (!production && !forced) {
    console.log("indexnow: skip (set VERCEL_ENV=production or INDEXNOW_PING=1 to submit)");
    return;
  }

  const { pingIndexNow } = load(path.join(__dirname, "../src/lib/indexnow.ts"));
  const { default: sitemap } = load(path.join(__dirname, "../src/app/sitemap.ts"));
  const result = await pingIndexNow(sitemap());
  console.log(
    `indexnow: status=${result.status} urls=${result.count} body=${String(result.body).slice(0, 180)}`,
  );
}

main().catch((error) => {
  console.error("indexnow: ping failed", error);
});

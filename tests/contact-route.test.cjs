const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const Module = require("node:module");
const ts = require("typescript");

/**
 * Hits the contact route handler directly. Email, the database, and blob
 * storage stay mocked or unconfigured so a test never sends a real message.
 */

delete process.env.RESEND_API_KEY;
delete process.env.DATABASE_URL;
delete process.env.POSTGRES_URL;
delete process.env.BLOB_READ_WRITE_TOKEN;

const sendCalls = [];
let sendBehavior = async (payload) => {
  sendCalls.push(payload);
  return { data: { id: "test_email" }, error: null };
};

const originalLoad = Module._load;
Module._load = function load(request, parent, isMain) {
  if (request === "resend") {
    return {
      Resend: class Resend {
        constructor() {
          this.emails = {
            send: (payload) => sendBehavior(payload),
          };
        }
      },
    };
  }
  return originalLoad.call(this, request, parent, isMain);
};

const realFetch = global.fetch;
global.fetch = async (input, init) => {
  const url =
    typeof input === "string" ? input : input instanceof URL ? input.href : input.url;
  if (/resend\.com|neon\.tech|blob\.vercel-storage\.com/i.test(String(url))) {
    throw new Error(`blocked outbound test request to ${url}`);
  }
  return realFetch(input, init);
};

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
  const localRequire = Module.createRequire(file);
  m.require = (id) => {
    if (id.startsWith("@/")) {
      return load(resolveSrc(path.join(__dirname, "../src", id.slice(2))));
    }
    if (id.startsWith(".")) {
      return load(resolveSrc(path.resolve(path.dirname(file), id)));
    }
    return localRequire(id);
  };
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

function loadTs(rel) {
  return load(resolveSrc(path.join(__dirname, "../src", rel.replace(/\.tsx?$/, ""))));
}

const { POST } = loadTs("app/api/contact/route.ts");
const { leadDeliveryError, siteConfig } = loadTs("site.config.ts");
const { serverFieldErrors } = loadTs("lib/form-errors.ts");

// next/server after() throws outside a request scope. The route looks it up
// at call time, so replacing the export keeps the handler runnable here.
require("next/server").after = (task) => {
  const run = typeof task === "function" ? task() : task;
  Promise.resolve(run).catch(() => {});
};

const chosenBudget = siteConfig.budgetRanges.find((range) => range !== "Not sure yet");

function submit(body, ip) {
  const logs = [];
  const errors = [];
  const origLog = console.log;
  const origError = console.error;
  console.log = (...args) => {
    logs.push(args.map(String).join(" "));
    origLog.apply(console, args);
  };
  console.error = (...args) => {
    errors.push(args.map(String).join(" "));
    origError.apply(console, args);
  };
  return POST(
    new Request("https://collegiateagency.com/api/contact", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-forwarded-for": ip,
      },
      body: JSON.stringify({ elapsedMs: 2500, ...body }),
    }),
  )
    .then(async (res) => ({ status: res.status, json: await res.json(), logs, errors }))
    .finally(() => {
      console.log = origLog;
      console.error = origError;
    });
}

function loggedLead(logs) {
  const line = logs.find((entry) => entry.startsWith("[lead] {"));
  assert.ok(line, "expected a [lead] capture log");
  return JSON.parse(line.slice("[lead] ".length));
}

test("contact route accepts a brand inquiry with only the required fields", async () => {
  const before = sendCalls.length;
  const { status, json, logs } = await submit(
    {
      kind: "brand_inquiry",
      company: "Northwind",
      email: "ada@northwind.example",
    },
    "10.1.0.1",
  );

  assert.equal(status, 200);
  assert.equal(json.ok, true);
  assert.equal(json.errors, undefined);
  const lead = loggedLead(logs);
  assert.equal(lead.company, "Northwind");
  assert.equal(lead.email, "ada@northwind.example");
  assert.equal(lead.budget, "Not sure yet");
  assert.equal(lead.howHeard, "");
  assert.equal(sendCalls.length, before);
});

test("contact route rejects a brand inquiry missing an email", async () => {
  const before = sendCalls.length;
  const { status, json, logs } = await submit(
    {
      kind: "brand_inquiry",
      company: "Northwind",
      budget: "Not sure yet",
    },
    "10.1.0.2",
  );

  assert.equal(status, 422);
  assert.equal(json.ok, false);
  assert.equal(json.errors.email, "Work email is required.");
  assert.equal(json.errors.budget, undefined);
  assert.equal(json.errors.howHeard, undefined);
  assert.equal(json.errors.company, undefined);
  assert.equal(JSON.stringify(json).includes("Please select a budget range"), false);
  assert.equal(
    logs.some((entry) => entry.startsWith("[lead] ")),
    false,
  );
  assert.equal(sendCalls.length, before);
});

test("contact route accepts the Not sure yet budget", async () => {
  const cases = [
    { budget: "Not sure yet", ip: "10.1.0.3", email: "ada.unsure@northwind.example" },
    // The form's default option is the label "Not sure yet" with value="".
    { budget: "", ip: "10.1.0.4", email: "ada.empty@northwind.example" },
    { budget: "  not sure yet  ", ip: "10.1.0.5", email: "ada.spaced@northwind.example" },
  ];

  for (const item of cases) {
    const { status, json, logs } = await submit(
      {
        kind: "brand_inquiry",
        company: "Northwind",
        email: item.email,
        budget: item.budget,
      },
      item.ip,
    );
    assert.equal(status, 200, JSON.stringify(json));
    assert.equal(json.ok, true);
    assert.equal(loggedLead(logs).budget, "Not sure yet");
    assert.equal(loggedLead(logs).howHeard, "");
  }

  const selected = await submit(
    {
      kind: "brand_inquiry",
      company: "Northwind",
      email: "ada.range@northwind.example",
      budget: chosenBudget,
      howHeard: "A referral",
    },
    "10.1.0.6",
  );
  assert.equal(selected.status, 200);
  assert.equal(loggedLead(selected.logs).budget, chosenBudget);
  assert.equal(loggedLead(selected.logs).howHeard, "A referral");
});

test("contact route returns an error when the notification email fails", async () => {
  const previousKey = process.env.RESEND_API_KEY;
  const previousBehavior = sendBehavior;
  process.env.RESEND_API_KEY = "re_test_invalid";
  sendBehavior = async (payload) => {
    sendCalls.push(payload);
    return {
      data: null,
      error: { message: "Invalid `to` field: secret.lead@example.com" },
    };
  };

  try {
    const { status, json, errors } = await submit(
      {
        kind: "brand_inquiry",
        company: "Acme Widgets",
        email: "secret.lead@example.com",
        budget: "Not sure yet",
      },
      "10.1.0.7",
    );

    assert.equal(status, 502);
    assert.equal(json.ok, false);
    assert.equal(json.errors, undefined);
    assert.match(json.error, /email us at /);
    assert.match(json.error, new RegExp(siteConfig.contact.email.replace(/[.]/g, "\\.")));
    assert.equal(json.error.includes("secret.lead@example.com"), false);
    assert.equal(json.error.includes("Acme Widgets"), false);

    const failure = errors.filter((entry) => entry.includes("[lead] send FAILED"));
    assert.equal(failure.length, 1);
    assert.match(failure[0], /\[lead\] send FAILED: Invalid `to` field: \[redacted\]/);
    assert.equal(failure[0].includes("secret.lead@example.com"), false);
    assert.equal(failure[0].includes("Acme Widgets"), false);

    const inbox = process.env.AGENCY_INBOX || "shane@zmmevents.com";
    const sent = sendCalls.at(-1);
    assert.deepEqual(sent.to, [inbox]);
    assert.equal(JSON.stringify(sent).includes("secret.lead@example.com"), true);
  } finally {
    sendBehavior = previousBehavior;
    if (previousKey === undefined) delete process.env.RESEND_API_KEY;
    else process.env.RESEND_API_KEY = previousKey;
  }
});

test("server field errors include only the fields that were rejected", () => {
  assert.deepEqual(
    serverFieldErrors({ email: "Work email is required.", budget: "", howHeard: "  " }),
    { email: "Work email is required." },
  );
  assert.deepEqual(serverFieldErrors(undefined), {});
  assert.deepEqual(serverFieldErrors({ budget: "Please select a budget range." }), {
    budget: "Please select a budget range.",
  });

  const form = fs.readFileSync(
    path.join(__dirname, "../src/components/forms/ContactForm.tsx"),
    "utf8",
  );
  assert.equal(form.includes("Please select a budget range"), false);
  assert.match(form, /serverFieldErrors\(json\?\.errors\)/);
  assert.match(form, /setErrors\(rejected\)/);
  assert.match(form, /leadDeliveryError\(\)/);
  assert.equal(leadDeliveryError(), `We couldn't deliver your message. Please email us at ${siteConfig.contact.email}.`);
});

import crypto from "node:crypto";
import { list, put } from "@vercel/blob";

export type AdminEventType =
  | "page_view"
  | "brand_inquiry"
  | "student_application"
  | "lead_magnet"
  | "portal_signup"
  | "portal_submission"
  | "portal_login"
  | "admin_login"
  | "upload_token";

export type AdminEvent = {
  id: string;
  at: string;
  type: AdminEventType;
  path?: string;
  title?: string;
  referrer?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  term?: string;
  content?: string;
  landingPage?: string;
  llmSource?: string;
  country?: string;
  city?: string;
  region?: string;
  userAgent?: string;
  ipHash?: string;
  data?: Record<string, unknown>;
};

export type DashboardSummary = {
  generatedAt: string;
  storageConfigured: boolean;
  totalEvents: number;
  pageViews: number;
  uniqueVisitorsEstimate: number;
  submissions: number;
  llmLandings: number;
  topPages: { label: string; count: number }[];
  topSources: { label: string; count: number }[];
  topLlmSources: { label: string; count: number }[];
  recentSubmissions: AdminEvent[];
  recentEvents: AdminEvent[];
  daily: { date: string; pageViews: number; submissions: number; llmLandings: number }[];
};

const PREFIX = "admin-analytics/events/";

function dataSecret(): Buffer | null {
  const secret = process.env.ADMIN_DATA_SECRET;
  if (!secret?.trim()) return null;
  return crypto.createHash("sha256").update(secret).digest();
}

function storageConfigured(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim() && process.env.ADMIN_DATA_SECRET?.trim());
}

function encryptJson(event: AdminEvent): string {
  const secret = dataSecret();
  if (!secret) throw new Error("ADMIN_DATA_SECRET is required to persist admin analytics.");
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", secret, iv);
  const ciphertext = Buffer.concat([
    cipher.update(JSON.stringify(event), "utf8"),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();
  return Buffer.concat([iv, tag, ciphertext]).toString("base64");
}

function decryptJson(payload: string): AdminEvent | null {
  const secret = dataSecret();
  if (!secret) return null;
  try {
    const raw = Buffer.from(payload, "base64");
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const ciphertext = raw.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", secret, iv);
    decipher.setAuthTag(tag);
    const json = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString("utf8");
    return JSON.parse(json) as AdminEvent;
  } catch (error) {
    console.warn("[admin-analytics] failed to decrypt event", error);
    return null;
  }
}

export function hashIp(ip: string): string {
  const secret = dataSecret() || crypto.createHash("sha256").update("nonpersistent-ip-hash").digest();
  return crypto.createHmac("sha256", secret).update(ip).digest("hex").slice(0, 24);
}

export function clientIp(request: Request): string {
  const h = request.headers;
  return (
    h.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    h.get("x-real-ip") ||
    h.get("cf-connecting-ip") ||
    "unknown"
  );
}

export function classifySource(referrer?: string, explicitSource?: string): { source: string; medium: string; llmSource?: string } {
  const ref = (referrer || "").toLowerCase();
  const src = (explicitSource || "").toLowerCase();
  const haystack = `${ref} ${src}`;

  const llmMap: [string, string][] = [
    ["chatgpt", "ChatGPT"],
    ["openai", "OpenAI / ChatGPT"],
    ["perplexity", "Perplexity"],
    ["claude", "Claude"],
    ["anthropic", "Claude"],
    ["gemini", "Gemini"],
    ["bard", "Gemini"],
    ["copilot", "Microsoft Copilot"],
    ["you.com", "You.com"],
    ["poe.com", "Poe"],
  ];
  for (const [needle, label] of llmMap) {
    if (haystack.includes(needle)) return { source: label, medium: "llm", llmSource: label };
  }

  if (!referrer) return { source: explicitSource || "Direct / unknown", medium: explicitSource ? "campaign" : "direct" };
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "");
    if (host.includes("google.")) return { source: "Google", medium: "organic" };
    if (host.includes("bing.")) return { source: "Bing", medium: "organic" };
    if (host.includes("yahoo.")) return { source: "Yahoo", medium: "organic" };
    if (host.includes("duckduckgo.")) return { source: "DuckDuckGo", medium: "organic" };
    if (host.includes("instagram.")) return { source: "Instagram", medium: "social" };
    if (host.includes("tiktok.")) return { source: "TikTok", medium: "social" };
    if (host.includes("facebook.") || host.includes("fb.")) return { source: "Facebook", medium: "social" };
    if (host.includes("linkedin.")) return { source: "LinkedIn", medium: "social" };
    if (host.includes("x.com") || host.includes("twitter.")) return { source: "X / Twitter", medium: "social" };
    return { source: host, medium: "referral" };
  } catch {
    return { source: "Unknown referrer", medium: "referral" };
  }
}

export async function recordAdminEvent(input: Omit<AdminEvent, "id" | "at">): Promise<{ ok: boolean; skipped?: boolean; error?: string }> {
  const event: AdminEvent = {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    ...input,
  };

  if (!storageConfigured()) {
    console.warn("[admin-analytics] BLOB_READ_WRITE_TOKEN missing; event not persisted", JSON.stringify(event));
    return { ok: true, skipped: true };
  }

  const day = event.at.slice(0, 10);
  const key = `${PREFIX}${day}/${event.at.replace(/[:.]/g, "-")}-${event.id}.json.enc`;
  try {
    await put(key, encryptJson(event), {
      access: "public",
      allowOverwrite: false,
      contentType: "text/plain; charset=utf-8",
    });
    return { ok: true };
  } catch (error) {
    console.error("[admin-analytics] persist failed", error);
    return { ok: false, error: error instanceof Error ? error.message : "persist failed" };
  }
}

async function fetchBlobText(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.text();
  } catch {
    return null;
  }
}

export async function readAdminEvents(days = 30): Promise<{ storageConfigured: boolean; events: AdminEvent[] }> {
  if (!storageConfigured()) return { storageConfigured: false, events: [] };
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  const events: AdminEvent[] = [];
  let cursor: string | undefined;

  do {
    const page = await list({ prefix: PREFIX, limit: 1000, cursor });
    cursor = page.cursor;
    for (const blob of page.blobs) {
      const text = await fetchBlobText(blob.url);
      if (!text) continue;
      const event = decryptJson(text);
      if (!event) continue;
      if (Date.parse(event.at) >= since) events.push(event);
    }
  } while (cursor);

  events.sort((a, b) => b.at.localeCompare(a.at));
  return { storageConfigured: true, events };
}

function top(events: AdminEvent[], getLabel: (event: AdminEvent) => string | undefined, limit = 8) {
  const counts = new Map<string, number>();
  for (const event of events) {
    const label = getLabel(event)?.trim() || "Unknown";
    counts.set(label, (counts.get(label) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }));
}

export function summarizeEvents(events: AdminEvent[], configured: boolean): DashboardSummary {
  const pageViews = events.filter((event) => event.type === "page_view");
  const submissions = events.filter((event) => event.type !== "page_view");
  const visitors = new Set(pageViews.map((event) => event.ipHash).filter(Boolean));
  const days = new Map<string, { date: string; pageViews: number; submissions: number; llmLandings: number }>();

  for (let i = 13; i >= 0; i--) {
    const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    days.set(d, { date: d, pageViews: 0, submissions: 0, llmLandings: 0 });
  }

  for (const event of events) {
    const day = event.at.slice(0, 10);
    if (!days.has(day)) continue;
    const row = days.get(day)!;
    if (event.type === "page_view") row.pageViews += 1;
    else row.submissions += 1;
    if (event.llmSource) row.llmLandings += 1;
  }

  return {
    generatedAt: new Date().toISOString(),
    storageConfigured: configured,
    totalEvents: events.length,
    pageViews: pageViews.length,
    uniqueVisitorsEstimate: visitors.size,
    submissions: submissions.length,
    llmLandings: events.filter((event) => Boolean(event.llmSource)).length,
    topPages: top(pageViews, (event) => event.path),
    topSources: top(pageViews, (event) => event.source),
    topLlmSources: top(events.filter((event) => event.llmSource), (event) => event.llmSource),
    recentSubmissions: submissions.slice(0, 20),
    recentEvents: events.slice(0, 40),
    daily: [...days.values()],
  };
}

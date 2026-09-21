/**
 * Minimal Gmail REST client — only the four endpoints the pipeline sync needs.
 *
 * Hand-rolled rather than using `googleapis`, which is a ~100MB dependency for
 * four GETs and would land in every serverless bundle.
 *
 * SCOPE: this is built against `gmail.metadata`, which returns headers and
 * labels but NEVER message bodies or attachments. That is a deliberate ceiling:
 * the app is given no way to read the contents of anyone's mail, only who wrote
 * to whom and when. Two consequences fall out of it, and the sync is designed
 * around both:
 *   1. `messages.list` rejects the `q` search parameter under this scope, so we
 *      drive everything off the History API and label IDs instead.
 *   2. Subject lines ARE available as headers, which is enough to label a card.
 */

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const API = "https://gmail.googleapis.com/gmail/v1/users/me";

export type GmailMessageMeta = {
  id: string;
  threadId: string;
  labelIds: string[];
  /** Epoch ms, from Gmail's internalDate — the authoritative receive time. */
  internalDate: number;
  headers: Record<string, string>;
};

export type HistoryPage = {
  messageIds: { id: string; threadId: string }[];
  /** Threads that gained a label, for the label-driven stage moves. */
  labelAdds: { messageId: string; threadId: string; labelIds: string[] }[];
  historyId: string | null;
  /** Gmail expired the watermark — the caller must re-baseline. */
  expired: boolean;
};

/** The OAuth client exists; the mailbox may or may not be connected yet. */
export function gmailAppConfigured(): boolean {
  return Boolean(process.env.GOOGLE_CLIENT_ID?.trim() && process.env.GOOGLE_CLIENT_SECRET?.trim());
}

export const REFRESH_TOKEN_KEY = "gmail:refreshToken";

/**
 * The refresh token, from the environment if set, otherwise from the database.
 *
 * Storing it in the database is what lets the connect flow work without a
 * redeploy, and lets a revoked token be replaced by visiting one URL. An env
 * var still wins so the value can be pinned in Vercel if preferred.
 */
export async function getRefreshToken(): Promise<string | null> {
  const fromEnv = process.env.GOOGLE_REFRESH_TOKEN?.trim();
  if (fromEnv) return fromEnv;
  const { getSyncState } = await import("@/lib/crm/db");
  const stored = await getSyncState<{ token: string }>(REFRESH_TOKEN_KEY);
  return stored?.token?.trim() || null;
}

export async function gmailConfigured(): Promise<boolean> {
  if (!gmailAppConfigured()) return false;
  try {
    return (await getRefreshToken()) !== null;
  } catch {
    return false;
  }
}

/** Cached across invocations on a warm instance; tokens last ~1h. */
let cached: { token: string; expiresAt: number } | null = null;

/** Drops the cached access token. Call after reconnecting a different mailbox. */
export function resetTokenCache(): void {
  cached = null;
}

async function accessToken(): Promise<string> {
  if (cached && Date.now() < cached.expiresAt - 60_000) return cached.token;

  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new Error("Gmail is not connected yet — open /api/gmail/connect to authorise the mailbox.");
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!.trim(),
      client_secret: process.env.GOOGLE_CLIENT_SECRET!.trim(),
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    // invalid_grant means the refresh token was revoked or expired — the one
    // failure mode that silently stops the whole sync, so name it explicitly.
    throw new Error(
      `Gmail token refresh failed (${res.status}). ${
        body.includes("invalid_grant")
          ? "The refresh token is no longer valid — re-run the connect flow at /api/gmail/connect."
          : body.slice(0, 300)
      }`,
    );
  }

  const json = (await res.json()) as { access_token: string; expires_in: number };
  cached = { token: json.access_token, expiresAt: Date.now() + json.expires_in * 1000 };
  return cached.token;
}

async function api<T>(path: string, params?: Record<string, string | string[]>): Promise<T> {
  const url = new URL(API + path);
  for (const [k, v] of Object.entries(params ?? {})) {
    if (Array.isArray(v)) v.forEach((item) => url.searchParams.append(k, item));
    else url.searchParams.set(k, v);
  }
  const res = await fetch(url, { headers: { authorization: `Bearer ${await accessToken()}` } });
  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Gmail ${path} failed (${res.status}): ${body.slice(0, 300)}`);
    (err as Error & { status?: number }).status = res.status;
    throw err;
  }
  return (await res.json()) as T;
}

/** The mailbox we're watching, plus its current history watermark. */
export async function getProfile(): Promise<{ emailAddress: string; historyId: string }> {
  return api("/profile");
}

export async function listLabels(): Promise<{ id: string; name: string }[]> {
  const json = await api<{ labels?: { id: string; name: string }[] }>("/labels");
  return json.labels ?? [];
}

/**
 * Everything that changed since `startHistoryId`, following pagination.
 *
 * Gmail keeps history for a limited window and 404s a watermark that has aged
 * out. That is expected after a quiet spell, not an error — it comes back as
 * `expired: true` so the caller can re-baseline instead of failing the run.
 */
export async function listHistory(startHistoryId: string, maxPages = 10): Promise<HistoryPage> {
  const messageIds: HistoryPage["messageIds"] = [];
  const labelAdds: HistoryPage["labelAdds"] = [];
  let pageToken: string | undefined;
  let historyId: string | null = null;

  try {
    for (let page = 0; page < maxPages; page++) {
      const json: {
        history?: {
          messagesAdded?: { message: { id: string; threadId: string } }[];
          labelsAdded?: { message: { id: string; threadId: string }; labelIds: string[] }[];
        }[];
        historyId?: string;
        nextPageToken?: string;
      } = await api("/history", {
        startHistoryId,
        historyTypes: ["messageAdded", "labelAdded"],
        ...(pageToken ? { pageToken } : {}),
      });

      for (const h of json.history ?? []) {
        for (const m of h.messagesAdded ?? []) {
          messageIds.push({ id: m.message.id, threadId: m.message.threadId });
        }
        for (const l of h.labelsAdded ?? []) {
          labelAdds.push({
            messageId: l.message.id,
            threadId: l.message.threadId,
            labelIds: l.labelIds,
          });
        }
      }

      if (json.historyId) historyId = json.historyId;
      if (!json.nextPageToken) break;
      pageToken = json.nextPageToken;
    }
  } catch (err) {
    if ((err as { status?: number }).status === 404) {
      return { messageIds: [], labelAdds: [], historyId: null, expired: true };
    }
    throw err;
  }

  return { messageIds, labelAdds, historyId, expired: false };
}

/**
 * Recent message IDs carrying a label, newest first. Used only for the one-off
 * backfill — `labelIds` is the filter because `q` is off-limits at this scope.
 */
export async function listMessageIds(
  labelIds: string[],
  limit: number,
): Promise<{ id: string; threadId: string }[]> {
  const out: { id: string; threadId: string }[] = [];
  let pageToken: string | undefined;

  while (out.length < limit) {
    const json: {
      messages?: { id: string; threadId: string }[];
      nextPageToken?: string;
    } = await api("/messages", {
      labelIds,
      maxResults: String(Math.min(500, limit - out.length)),
      ...(pageToken ? { pageToken } : {}),
    });
    out.push(...(json.messages ?? []));
    if (!json.nextPageToken || !json.messages?.length) break;
    pageToken = json.nextPageToken;
  }
  return out.slice(0, limit);
}

const WANTED_HEADERS = ["From", "To", "Cc", "Date", "Subject"];

/** Headers + labels for one message. Never returns body content. */
export async function getMessageMeta(id: string): Promise<GmailMessageMeta> {
  const json = await api<{
    id: string;
    threadId: string;
    labelIds?: string[];
    internalDate?: string;
    payload?: { headers?: { name: string; value: string }[] };
  }>(`/messages/${id}`, { format: "metadata", metadataHeaders: WANTED_HEADERS });

  const headers: Record<string, string> = {};
  for (const h of json.payload?.headers ?? []) headers[h.name.toLowerCase()] = h.value;

  return {
    id: json.id,
    threadId: json.threadId,
    labelIds: json.labelIds ?? [],
    internalDate: Number(json.internalDate ?? 0),
    headers,
  };
}

/**
 * Pulls every email address out of a header value.
 *
 * Handles the shapes Gmail actually emits — `Name <a@b.com>`, bare addresses,
 * comma-separated lists, and display names containing commas or an @.
 */
export function parseAddresses(headerValue: string | undefined): string[] {
  if (!headerValue) return [];
  const found = headerValue.match(/[^\s<>,;"]+@[^\s<>,;"]+/g) ?? [];
  return found.map((a) => a.replace(/^mailto:/i, "").toLowerCase());
}

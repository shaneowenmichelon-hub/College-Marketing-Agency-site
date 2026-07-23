"use client";

import { upload } from "@vercel/blob/client";

export type ClientUpload = { url: string | null; note?: string };

/**
 * Upload a file straight from the browser to Vercel Blob (client-direct upload),
 * bypassing the serverless request-body limit — so files of any size work.
 * Never throws: if storage isn't configured or the upload fails, returns
 * { url: null, note } so the caller can still submit and flag it in the email.
 *
 * NOTE: the client necessarily receives the (unguessable, random-suffixed) URL —
 * that's inherent to client-direct uploads. Keep it in memory only; never render
 * it, log it, or put it in analytics. For fully server-mediated uploads instead,
 * use src/lib/storage.ts (subject to the 4.5MB function-body limit).
 */
export async function uploadToBlob(pathname: string, file: File): Promise<ClientUpload> {
  try {
    const res = await upload(pathname, file, {
      access: "public", // unguessable via addRandomSuffix (set server-side)
      handleUploadUrl: "/api/blob/upload",
      contentType: file.type || undefined,
    });
    return { url: res.url };
  } catch {
    return { url: null, note: "not uploaded — storage not configured" };
  }
}

/** Short random id to group a submission's files under one folder. */
export function newSubmissionId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.floor(Math.random() * 1e9).toString(36)}`;
  }
}

function safeName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60) || "file";
}

export function idPath(submissionId: string, side: "front" | "back", name: string): string {
  return `ambassador-ids/${submissionId}/${side}-${safeName(name)}`;
}

export function proofPath(submissionId: string, index: number, name: string): string {
  return `ambassador-proof/${submissionId}/${index}-${safeName(name)}`;
}

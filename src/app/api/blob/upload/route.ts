import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export const runtime = "nodejs";

/**
 * Issues short-lived client-upload tokens so the browser uploads ID / proof files
 * DIRECTLY to Vercel Blob — bypassing the ~4.5MB serverless request-body limit
 * (files never pass through this function). Type + size are validated here
 * (server side) via onBeforeGenerateToken, and pathnames are locked to the two
 * allowed prefixes with unguessable random suffixes.
 *
 * If BLOB_READ_WRITE_TOKEN is unset the route 501s; the client treats that as
 * "storage not configured" and the form still submits (ID flagged in the email).
 */
const ID_TYPES = ["image/jpeg", "image/png", "image/heic", "image/heif", "image/webp", "application/pdf"];
const PROOF_TYPES = [...ID_TYPES, "image/gif", "video/mp4", "video/quicktime", "video/webm"];

export async function POST(request: Request): Promise<NextResponse> {
  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return NextResponse.json({ error: "storage not configured" }, { status: 501 });
  }

  let body: HandleUploadBody;
  try {
    body = (await request.json()) as HandleUploadBody;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  try {
    const json = await handleUpload({
      request,
      body,
      onBeforeGenerateToken: async (pathname) => {
        const isId = pathname.startsWith("ambassador-ids/");
        const isProof = pathname.startsWith("ambassador-proof/");
        if (!isId && !isProof) throw new Error("Upload path not allowed.");
        return {
          addRandomSuffix: true,
          allowedContentTypes: isProof ? PROOF_TYPES : ID_TYPES,
          // IDs stay small (images are compressed client-side); proof allows video.
          maximumSizeInBytes: isProof ? 200 * 1024 * 1024 : 25 * 1024 * 1024,
        };
      },
      // Fires server-to-server after upload (only on deployed URLs). We rely on
      // the URL returned to the client instead, so this is a no-op.
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload token error." },
      { status: 400 },
    );
  }
}

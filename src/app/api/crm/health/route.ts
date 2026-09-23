import { NextResponse } from "next/server";
import { dbConfigured, sql } from "@/lib/crm/db";
import { gmailAppConfigured, getRefreshToken } from "@/lib/gmail/client";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Setup diagnostics for the pipeline board.
 *
 * Deliberately UNAUTHENTICATED, because the failure it most needs to explain is
 * "nobody can sign in" — an admin-only check would be useless in exactly the
 * situation it exists for.
 *
 * It returns booleans and never values, counts or names. It also does NOT
 * report whether the access code is still the default: that would tell a passer
 * by which code to try. Everything here is either already inferable from the
 * outside (the login page works or it doesn't) or harmless.
 */
export async function GET() {
  const checks: Record<string, unknown> = {
    adminSessionSecret: Boolean(process.env.ADMIN_SESSION_SECRET?.trim()),
    cronSecret: Boolean(process.env.CRON_SECRET?.trim()),
    databaseUrl: dbConfigured(),
    googleOAuthClient: gmailAppConfigured(),
  };

  // Prove the database is actually reachable and migrated, not just that a
  // connection string exists — a wrong string looks identical until it is used.
  if (dbConfigured()) {
    try {
      const q = sql()!;
      const rows = (await q`select to_regclass('public.deals') is not null as ready`) as {
        ready: boolean;
      }[];
      checks.databaseReachable = true;
      checks.schemaReady = rows[0]?.ready === true;
    } catch {
      checks.databaseReachable = false;
      checks.schemaReady = false;
    }
  } else {
    checks.databaseReachable = false;
    checks.schemaReady = false;
  }

  try {
    checks.gmailConnected = (await getRefreshToken()) !== null;
  } catch {
    checks.gmailConnected = false;
  }

  // The first unmet prerequisite, in the order they have to be done.
  const steps: [boolean, string][] = [
    [checks.adminSessionSecret === true, "Set ADMIN_SESSION_SECRET in Vercel, then redeploy. Nobody can sign in until this exists."],
    [checks.databaseUrl === true, "Connect a Postgres store in Vercel → Storage and make sure the variable is named DATABASE_URL."],
    [checks.databaseReachable === true, "DATABASE_URL is set but the database refused the connection. Check the value was copied whole."],
    [checks.schemaReady === true, "Database is reachable but empty. Open the pipeline board once and the tables create themselves."],
    [checks.cronSecret === true, "Set CRON_SECRET in Vercel, then redeploy. The 10-minute sync refuses to run without it."],
    [checks.googleOAuthClient === true, "Add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from Google Cloud Console, then redeploy."],
    [checks.gmailConnected === true, "Visit /api/gmail/connect while signed in to authorise the mailbox."],
  ];
  const pending = steps.find(([done]) => !done);

  return NextResponse.json({
    ok: !pending,
    checks,
    nextStep: pending ? pending[1] : "Everything is configured. The board is live.",
  });
}

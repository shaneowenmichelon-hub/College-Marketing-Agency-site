# Private Admin Analytics Setup

The private admin dashboard is deployed at `/private-ops-7f3a` and requires Vercel environment variables before login/storage are active.

## Required Vercel setup

1. Open the Vercel project dashboard.
2. Connect Vercel Blob to the project if it is not already connected:
   - Storage → Create / Connect Blob Store → connect to this project.
   - This creates `BLOB_READ_WRITE_TOKEN`.
3. Add these environment variables for Production and Preview:

```txt
ADMIN_SESSION_SECRET=<random 64+ char secret>
ADMIN_DATA_SECRET=<random 64+ char secret>
ADMIN_ACCESS_CODE_SHA256=<sha256 hash of the private dashboard access code>
```

Generate values locally:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
node -e "const c='YOUR-PRIVATE-CODE-HERE'; console.log(require('crypto').createHash('sha256').update(c).digest('hex'))"
```

4. Redeploy the latest commit after the env vars are saved.

## What it tracks

- Page views via `/api/admin/collect`
- Top pages
- Traffic source/referrer/UTM
- LLM landings from sources such as ChatGPT, Perplexity, Claude, Gemini, Copilot, Poe, You.com
- Brand inquiries from `/api/contact`
- Student applications from `/api/apply`
- Ambassador portal logins/signups/proof submissions
- Recent website events and submissions

## Security notes

- No plaintext access code is committed.
- Admin sessions require `ADMIN_SESSION_SECRET`; login returns 503 until configured.
- Stored event payloads require `ADMIN_DATA_SECRET` and are encrypted before being written to Blob.
- IPs are hashed; raw IPs are not stored in the dashboard event payload.

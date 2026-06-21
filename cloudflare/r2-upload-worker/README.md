# Cloudflare R2 upload worker

Uploads files from the browser into R2 without Vercel TLS/CORS issues.

## One-time setup

1. Install Wrangler and log in:

```bash
npm install -g wrangler
wrangler login
```

2. Set the upload secret (same value on Worker + Vercel):

```bash
wrangler secret put UPLOAD_SECRET
```

3. Apply bucket CORS (for presigned fallback):

```bash
wrangler r2 bucket cors set clashanime-media --file cloudflare/r2-upload-worker/r2-cors.json
```

4. Deploy the worker:

```bash
cd cloudflare/r2-upload-worker
wrangler deploy
```

5. Copy the worker URL: `https://upload.clashanime.com` (custom domain; no workers.dev needed).

If workers.dev onboarding returns 404, this custom domain route is used instead.

6. In Vercel → Environment Variables add:

- `R2_UPLOAD_SECRET` = same secret from step 2
- `NEXT_PUBLIC_R2_UPLOAD_URL` = `https://upload.clashanime.com`

7. Redeploy Vercel.

## Fix public media domain

`media.clashanime.com` must point to the R2 bucket (Cloudflare → R2 → clashanime-media → Settings → Custom Domains).

Remove `media.clashanime.com` from the Vercel project domains if it is attached there.

import { NextRequest, NextResponse } from "next/server";
import { notifyIndexNow, submitIndexNow } from "@/lib/indexnow";
import { buildSitemapEntries } from "@/lib/sitemapUrls";
import { SITE_URL } from "@/lib/siteSeo";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest): boolean {
  if (req.headers.get("x-vercel-cron")) return true;
  const secret = process.env.CRON_SECRET?.trim();
  if (!secret) return true;
  return (req.headers.get("authorization") ?? "") === `Bearer ${secret}`;
}

/** Daily: submit Clash Anime content URLs (blog / news / stories / watch-now) to IndexNow. */
export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let urls: string[] = [];
  try {
    const entries = await buildSitemapEntries();
    urls = entries.map((entry) => entry.url).filter((url) => typeof url === "string");
  } catch {
    urls = [SITE_URL];
  }

  const result = await submitIndexNow(urls);
  // Also ping the sitemap itself so engines re-fetch the urlset.
  await notifyIndexNow(`${SITE_URL}/sitemap.xml`);

  return NextResponse.json({
    ok: result.ok,
    submitted: result.submitted,
    sitemap: `${SITE_URL}/sitemap.xml`,
  });
}

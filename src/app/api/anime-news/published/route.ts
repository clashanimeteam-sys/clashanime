import { NextResponse } from "next/server";
import { listPublishedAnimeNews } from "@/lib/animeNews.server";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const limit = Math.min(Math.max(Number(url.searchParams.get("limit") ?? 24), 1), 48);
  const offset = Math.max(Number(url.searchParams.get("offset") ?? 0), 0);

  const articles = await listPublishedAnimeNews(limit, offset);
  return NextResponse.json({ articles });
}

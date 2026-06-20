import { getGlobalRankMap } from "@/lib/videos";

export const dynamic = "force-dynamic";

export async function GET() {
  const ranks = await getGlobalRankMap();
  return Response.json(ranks);
}

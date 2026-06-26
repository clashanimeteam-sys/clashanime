import { getApprovedVideoPool, getVideosCatalog } from "@/lib/videos";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const mode = new URL(request.url).searchParams.get("mode");
  const videos = mode === "clash" ? await getApprovedVideoPool() : await getVideosCatalog();
  return Response.json(videos);
}

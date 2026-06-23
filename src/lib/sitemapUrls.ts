import type { MetadataRoute } from "next";
import { getActiveAnimeReleaseClashes } from "@/lib/animeTracker.server";
import { createServerClient } from "@/lib/supabase/server";
import { absoluteSiteUrl, PUBLIC_STATIC_PATHS } from "@/lib/siteSeo";

const MAX_VIDEO_URLS = 500;
const MAX_POST_URLS = 300;
const MAX_CHANNEL_URLS = 200;

function staticEntries(now: Date): MetadataRoute.Sitemap {
  return PUBLIC_STATIC_PATHS.map((path) => ({
    url: absoluteSiteUrl(path),
    lastModified: now,
    changeFrequency: path === "/" ? "hourly" : "daily",
    priority: path === "/" ? 1 : path === "/videos" || path === "/tracker" ? 0.9 : 0.6,
  }));
}

const MAX_HASHTAG_URLS = 100;

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [...staticEntries(now)];
  const seen = new Set(entries.map((entry) => entry.url));

  const addEntry = (path: string, lastModified?: string | Date | null, priority = 0.5) => {
    const url = absoluteSiteUrl(path);
    if (seen.has(url)) return;
    seen.add(url);
    entries.push({
      url,
      lastModified: lastModified ? new Date(lastModified) : now,
      changeFrequency: "weekly",
      priority,
    });
  };

  const supabase = await createServerClient();
  if (supabase) {
    const [{ data: videos }, { data: posts }, { data: profiles }] = await Promise.all([
      supabase
        .from("videos")
        .select("id, created_at")
        .eq("moderation_status", "approved")
        .order("created_at", { ascending: false })
        .limit(MAX_VIDEO_URLS),
      supabase
        .from("community_posts")
        .select("id, created_at")
        .order("created_at", { ascending: false })
        .limit(MAX_POST_URLS),
      supabase
        .from("profiles")
        .select("username, updated_at")
        .not("username", "is", null)
        .order("updated_at", { ascending: false })
        .limit(MAX_CHANNEL_URLS),
    ]);

    for (const video of videos ?? []) {
      addEntry(`/video/${video.id}`, video.created_at, 0.7);
    }

    for (const post of posts ?? []) {
      addEntry(`/community/post/${post.id}`, post.created_at, 0.55);
    }

    for (const profile of profiles ?? []) {
      if (!profile.username?.trim()) continue;
      addEntry(`/channel/${encodeURIComponent(profile.username.trim())}`, profile.updated_at, 0.5);
    }

    const { data: hashtagRows } = await supabase.rpc("list_top_hashtags", {
      p_limit: MAX_HASHTAG_URLS,
    });

    for (const row of hashtagRows ?? []) {
      const tag = (row as { tag?: string }).tag?.trim();
      if (!tag) continue;
      addEntry(`/hashtag/${encodeURIComponent(tag)}`, null, 0.75);
    }
  }

  try {
    const clashes = await getActiveAnimeReleaseClashes();
    for (const clash of clashes) {
      addEntry(`/tracker/clash/${clash.clashId}`, clash.opensAt, 0.85);
    }
  } catch {
    // Sitemap should still publish static URLs if tracker RPC is unavailable.
  }

  return entries;
}

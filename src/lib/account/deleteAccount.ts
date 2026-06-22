import { sendAccountDeletedEmail } from "@/lib/email/accountDeletedEmail";
import { deleteR2Objects } from "@/lib/r2/client";
import { getR2Config, isMediaFolder } from "@/lib/r2/config";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import type { Locale } from "@/lib/types";

function extractR2KeyFromUrl(url: string | null | undefined): string | null {
  if (!url) return null;

  const config = getR2Config();
  if (config) {
    const prefix = `${config.publicUrl}/`;
    if (url.startsWith(prefix)) {
      return url.slice(prefix.length).replace(/^\//, "");
    }
  }

  try {
    const path = new URL(url).pathname.replace(/^\//, "");
    const folder = path.split("/")[0] ?? "";
    if (isMediaFolder(folder)) {
      return path;
    }
  } catch {
    return null;
  }

  return null;
}

function extractSupabaseStoragePath(
  url: string | null | undefined,
  bucket: string,
  supabaseUrl: string,
): string | null {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${bucket}/`;
  const base = supabaseUrl.replace(/\/$/, "");
  const index = url.indexOf(marker);
  if (index === -1) return null;
  if (!url.startsWith(base)) return null;
  return url.slice(index + marker.length);
}

async function deleteSupabaseStorageFolder(
  supabase: NonNullable<ReturnType<typeof createServiceRoleClient>>,
  bucket: string,
  prefix: string,
) {
  const { data: entries, error } = await supabase.storage.from(bucket).list(prefix, {
    limit: 100,
  });

  if (error || !entries?.length) return;

  const paths = entries
    .filter((entry) => entry.name && !entry.id?.includes("/"))
    .map((entry) => `${prefix}/${entry.name}`.replace(/^\//, ""));

  if (paths.length > 0) {
    await supabase.storage.from(bucket).remove(paths);
  }
}

export async function deleteUserAccount(input: {
  userId: string;
  locale?: Locale;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = createServiceRoleClient();
  if (!supabase) {
    return { ok: false, error: "Service role not configured" };
  }

  const { data: authData, error: authError } = await supabase.auth.admin.getUserById(input.userId);
  if (authError || !authData.user) {
    return { ok: false, error: authError?.message ?? "User not found" };
  }

  const email = authData.user.email?.trim().toLowerCase() ?? "";
  const locale: Locale = "en";

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, display_name, avatar_url, banner_url")
    .eq("id", input.userId)
    .maybeSingle();

  const displayName =
    profile?.display_name?.trim() || profile?.username?.trim() || email.split("@")[0] || "Hero";

  const { data: videos } = await supabase
    .from("videos")
    .select("id, video_url, thumbnail_url")
    .eq("user_id", input.userId);

  const mediaKeys = new Set<string>();

  for (const video of videos ?? []) {
    const videoKey = extractR2KeyFromUrl(video.video_url);
    const thumbKey = extractR2KeyFromUrl(video.thumbnail_url);
    if (videoKey) mediaKeys.add(videoKey);
    if (thumbKey) mediaKeys.add(thumbKey);
  }

  for (const url of [profile?.avatar_url, profile?.banner_url]) {
    const key = extractR2KeyFromUrl(url);
    if (key) mediaKeys.add(key);
  }

  let farewellStatus: "sent" | "failed" | "skipped" = "skipped";
  let farewellResendId: string | null = null;
  let farewellError: string | null = null;

  if (email) {
    const farewellResult = await sendAccountDeletedEmail({
      to: email,
      userName: displayName,
      locale,
    });

    if (farewellResult.ok) {
      farewellStatus = "sent";
      farewellResendId = farewellResult.id;
    } else {
      farewellStatus = "failed";
      farewellError = farewellResult.error;
    }
  }

  if (mediaKeys.size > 0) {
    await deleteR2Objects([...mediaKeys]).catch(() => undefined);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? "";
  if (supabaseUrl) {
    for (const bucket of ["avatars", "banners", "clips", "thumbnails"] as const) {
      await deleteSupabaseStorageFolder(supabase, bucket, input.userId);

      for (const url of [
        profile?.avatar_url,
        profile?.banner_url,
        ...(videos ?? []).flatMap((video) => [video.video_url, video.thumbnail_url]),
      ]) {
        const path = extractSupabaseStoragePath(url, bucket, supabaseUrl);
        if (path) {
          await supabase.storage.from(bucket).remove([path]).catch(() => undefined);
        }
      }
    }
  }

  await supabase.from("videos").delete().eq("user_id", input.userId);
  await supabase.from("community_posts").delete().eq("user_id", input.userId);

  const { error: deleteUserError } = await supabase.auth.admin.deleteUser(input.userId);
  if (deleteUserError) {
    return { ok: false, error: deleteUserError.message };
  }

  await supabase.from("account_deletion_log").insert({
    user_id: input.userId,
    email: email || "unknown",
    display_name: displayName,
    locale,
    farewell_resend_id: farewellResendId,
    farewell_status: farewellStatus,
    error_message: farewellError,
  });

  return { ok: true };
}

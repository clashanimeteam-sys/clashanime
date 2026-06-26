import type { Dictionary } from "@/lib/i18n/dictionaries";

export type NotificationRowLike = {
  type: string;
  title: string;
  body: string;
  metadata?: Record<string, unknown> | null;
};

function metaString(metadata: Record<string, unknown> | null | undefined, key: string): string {
  const value = metadata?.[key];
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  if (typeof value === "number") {
    return String(value);
  }
  return "";
}

function applyTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

function typeField(
  types: Dictionary["notifications"]["types"] | undefined,
  type: string,
  field: string,
  fallback: string,
): string {
  const entry = types?.[type as keyof Dictionary["notifications"]["types"]];
  if (entry && typeof entry === "object" && field in entry) {
    const value = (entry as Record<string, string>)[field];
    if (typeof value === "string" && value.length > 0) {
      return value;
    }
  }
  return fallback;
}

export function formatNotificationText(
  row: NotificationRowLike,
  t: Dictionary["notifications"],
): { title: string; body: string; typeLabel: string } {
  const metadata = (row.metadata ?? {}) as Record<string, unknown>;
  const types = t.types;
  const typeLabel = typeField(types, row.type, "label", row.type);

  try {
    switch (row.type) {
      case "follow": {
        const name = metaString(metadata, "actor_display_name") || metaString(metadata, "actor_username") || "Someone";
        return {
          title: typeField(types, "follow", "title", row.title),
          body: applyTemplate(typeField(types, "follow", "body", row.body), { name }),
          typeLabel,
        };
      }
      case "new_video": {
        const channel = metaString(metadata, "channel_display_name") || metaString(metadata, "channel_username") || "A channel";
        const title = metaString(metadata, "video_title") || "";
        return {
          title: typeField(types, "new_video", "title", row.title),
          body: applyTemplate(typeField(types, "new_video", "body", row.body), { channel, title }),
          typeLabel,
        };
      }
      case "admin_video_review": {
        const channel = metaString(metadata, "channel_display_name") || metaString(metadata, "channel_username") || "A creator";
        const title = metaString(metadata, "video_title") || "";
        return {
          title: typeField(types, "admin_video_review", "title", row.title),
          body: applyTemplate(typeField(types, "admin_video_review", "body", row.body), { channel, title }),
          typeLabel,
        };
      }
      case "new_music": {
        const channel = metaString(metadata, "channel_display_name") || metaString(metadata, "channel_username") || "A channel";
        const title = metaString(metadata, "track_title") || "";
        return {
          title: typeField(types, "new_music", "title", row.title),
          body: applyTemplate(typeField(types, "new_music", "body", row.body), { channel, title }),
          typeLabel,
        };
      }
      case "community_post": {
        const channel = metaString(metadata, "channel_display_name") || metaString(metadata, "channel_username") || "A channel";
        const preview = metaString(metadata, "preview");
        const template = preview
          ? typeField(types, "community_post", "bodyWithPreview", row.body)
          : typeField(types, "community_post", "body", row.body);
        return {
          title: typeField(types, "community_post", "title", row.title),
          body: applyTemplate(template, preview ? { channel, preview } : { channel }),
          typeLabel,
        };
      }
      case "video_duel": {
        const name = metaString(metadata, "challenger_display_name") || metaString(metadata, "challenger_username") || "Someone";
        return {
          title: typeField(types, "video_duel", "title", row.title),
          body: applyTemplate(typeField(types, "video_duel", "body", row.body), { name }),
          typeLabel,
        };
      }
      case "points_duel": {
        const name = metaString(metadata, "creator_display_name") || metaString(metadata, "creator_username") || "Someone";
        const points = metaString(metadata, "wager_points") || "0";
        return {
          title: typeField(types, "points_duel", "title", row.title),
          body: applyTemplate(typeField(types, "points_duel", "body", row.body), { name, points }),
          typeLabel,
        };
      }
      case "points_duel_accepted": {
        const name = metaString(metadata, "opponent_display_name") || metaString(metadata, "opponent_username") || "Someone";
        return {
          title: typeField(types, "points_duel_accepted", "title", row.title),
          body: applyTemplate(typeField(types, "points_duel_accepted", "body", row.body), { name }),
          typeLabel,
        };
      }
      case "season_start": {
        const season = metaString(metadata, "season_name") || "Season";
        return {
          title: typeField(types, "season_start", "title", row.title),
          body: applyTemplate(typeField(types, "season_start", "body", row.body), { season }),
          typeLabel,
        };
      }
      case "season_end": {
        const season = metaString(metadata, "season_name") || "Season";
        return {
          title: typeField(types, "season_end", "title", row.title),
          body: applyTemplate(typeField(types, "season_end", "body", row.body), { season }),
          typeLabel,
        };
      }
      case "anime_release_clash": {
        const anime = metaString(metadata, "anime_title") || "A new anime";
        const hashtagHint =
          metaString(metadata, "hashtag_hint") ||
          (Array.isArray(metadata.match_tags)
            ? (metadata.match_tags as string[])
                .slice(0, 4)
                .map((tag) => `#${String(tag).replace(/^#+/, "")}`)
                .join(" ")
            : "#clashanime");
        return {
          title: typeField(types, "anime_release_clash", "title", row.title),
          body: applyTemplate(typeField(types, "anime_release_clash", "body", row.body), {
            anime,
            hashtags: hashtagHint,
          }),
          typeLabel,
        };
      }
      case "episode_clash_winner": {
        const anime = metaString(metadata, "anime_title") || "";
        const episode = metaString(metadata, "episode_number") || "";
        const points = metaString(metadata, "points_awarded") || "2000";
        const coins = metaString(metadata, "coins_awarded") || "5000";
        return {
          title: typeField(types, "episode_clash_winner", "title", row.title),
          body: applyTemplate(typeField(types, "episode_clash_winner", "body", row.body), {
            anime,
            episode,
            points,
            coins,
          }),
          typeLabel,
        };
      }
      case "episode_clash_crowned": {
        const name = metaString(metadata, "winner_display_name") || "A hunter";
        const anime = metaString(metadata, "anime_title") || "";
        const episode = metaString(metadata, "episode_number") || "";
        return {
          title: typeField(types, "episode_clash_crowned", "title", row.title),
          body: applyTemplate(typeField(types, "episode_clash_crowned", "body", row.body), {
            name,
            anime,
            episode,
          }),
          typeLabel,
        };
      }
      case "video_like": {
        const name = metaString(metadata, "actor_display_name") || metaString(metadata, "actor_username") || "Someone";
        const title = metaString(metadata, "video_title") || "";
        const template = title
          ? typeField(types, "video_like", "bodyWithTitle", row.body)
          : typeField(types, "video_like", "body", row.body);
        return {
          title: typeField(types, "video_like", "title", row.title),
          body: applyTemplate(template, title ? { name, title } : { name }),
          typeLabel,
        };
      }
      case "video_comment": {
        const name = metaString(metadata, "actor_display_name") || metaString(metadata, "actor_username") || "Someone";
        const preview = metaString(metadata, "preview");
        const template = preview
          ? typeField(types, "video_comment", "bodyWithPreview", row.body)
          : typeField(types, "video_comment", "body", row.body);
        return {
          title: typeField(types, "video_comment", "title", row.title),
          body: applyTemplate(template, preview ? { name, preview } : { name }),
          typeLabel,
        };
      }
      case "comment_reply": {
        const name = metaString(metadata, "actor_display_name") || metaString(metadata, "actor_username") || "Someone";
        const preview = metaString(metadata, "preview");
        const template = preview
          ? typeField(types, "comment_reply", "bodyWithPreview", row.body)
          : typeField(types, "comment_reply", "body", row.body);
        return {
          title: typeField(types, "comment_reply", "title", row.title),
          body: applyTemplate(template, preview ? { name, preview } : { name }),
          typeLabel,
        };
      }
      case "comment_like": {
        const name = metaString(metadata, "actor_display_name") || metaString(metadata, "actor_username") || "Someone";
        return {
          title: typeField(types, "comment_like", "title", row.title),
          body: applyTemplate(typeField(types, "comment_like", "body", row.body), { name }),
          typeLabel,
        };
      }
      case "mention":
        return {
          title: row.title || t.mentionTitle,
          body: row.body,
          typeLabel,
        };
      case "broadcast":
        return {
          title: row.title,
          body: row.body,
          typeLabel,
        };
      case "referral_signup": {
        const name = metaString(metadata, "referred_display_name") || "A friend";
        const points = metaString(metadata, "points") || "0";
        return {
          title: typeField(types, "referral_signup", "title", row.title),
          body: applyTemplate(typeField(types, "referral_signup", "body", row.body), { name, points }),
          typeLabel,
        };
      }
      case "referral_welcome": {
        const username = metaString(metadata, "referrer_username") || "friend";
        const points = metaString(metadata, "points") || "0";
        return {
          title: typeField(types, "referral_welcome", "title", row.title),
          body: applyTemplate(typeField(types, "referral_welcome", "body", row.body), { username, points }),
          typeLabel,
        };
      }
      case "signup_welcome": {
        const points = metaString(metadata, "points") || "25";
        return {
          title: typeField(types, "signup_welcome", "title", row.title),
          body: applyTemplate(typeField(types, "signup_welcome", "body", row.body), { points }),
          typeLabel,
        };
      }
      case "referral_milestone": {
        const name = metaString(metadata, "referred_display_name") || metaString(metadata, "referred_username") || "Friend";
        const milestone = metaString(metadata, "milestone_label") || metaString(metadata, "milestone");
        const points = metaString(metadata, "points") || "0";
        return {
          title: typeField(types, "referral_milestone", "title", row.title),
          body: applyTemplate(typeField(types, "referral_milestone", "body", row.body), { name, milestone, points }),
          typeLabel,
        };
      }
      case "referral_tier_up": {
        const tier = metaString(metadata, "tier_key") || metaString(metadata, "tier");
        const count = metaString(metadata, "signup_count") || "0";
        return {
          title: typeField(types, "referral_tier_up", "title", row.title),
          body: applyTemplate(typeField(types, "referral_tier_up", "body", row.body), { tier, count }),
          typeLabel,
        };
      }
      default:
        return {
          title: row.title,
          body: row.body,
          typeLabel,
        };
    }
  } catch {
    return {
      title: row.title,
      body: row.body,
      typeLabel,
    };
  }
}

export const NOTIFICATION_TYPE_KEYS = [
  "follow",
  "new_video",
  "admin_video_review",
  "new_music",
  "community_post",
  "video_duel",
  "points_duel",
  "points_duel_accepted",
  "season_start",
  "season_end",
  "anime_release_clash",
  "episode_clash_winner",
  "episode_clash_crowned",
  "video_like",
  "video_comment",
  "comment_reply",
  "comment_like",
  "mention",
  "broadcast",
  "referral_signup",
  "referral_welcome",
  "signup_welcome",
  "referral_milestone",
  "referral_tier_up",
  "system",
] as const;

export type NotificationTypeKey = (typeof NOTIFICATION_TYPE_KEYS)[number];

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
        return {
          title: typeField(types, "anime_release_clash", "title", row.title),
          body: applyTemplate(typeField(types, "anime_release_clash", "body", row.body), { anime }),
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
  "new_music",
  "community_post",
  "video_duel",
  "points_duel",
  "points_duel_accepted",
  "season_start",
  "season_end",
  "video_like",
  "video_comment",
  "comment_reply",
  "comment_like",
  "mention",
  "broadcast",
  "system",
] as const;

export type NotificationTypeKey = (typeof NOTIFICATION_TYPE_KEYS)[number];

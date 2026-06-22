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

export function formatNotificationText(
  row: NotificationRowLike,
  t: Dictionary["notifications"],
): { title: string; body: string; typeLabel: string } {
  const metadata = (row.metadata ?? {}) as Record<string, unknown>;
  const types = t.types;
  const typeLabel = types[row.type as keyof typeof types]?.label ?? row.type;

  switch (row.type) {
    case "follow": {
      const name = metaString(metadata, "actor_display_name") || metaString(metadata, "actor_username") || "Someone";
      return {
        title: types.follow.title,
        body: applyTemplate(types.follow.body, { name }),
        typeLabel,
      };
    }
    case "new_video": {
      const channel = metaString(metadata, "channel_display_name") || metaString(metadata, "channel_username") || "A channel";
      const title = metaString(metadata, "video_title") || "";
      return {
        title: types.new_video.title,
        body: applyTemplate(types.new_video.body, { channel, title }),
        typeLabel,
      };
    }
    case "new_music": {
      const channel = metaString(metadata, "channel_display_name") || metaString(metadata, "channel_username") || "A channel";
      const title = metaString(metadata, "track_title") || "";
      return {
        title: types.new_music.title,
        body: applyTemplate(types.new_music.body, { channel, title }),
        typeLabel,
      };
    }
    case "community_post": {
      const channel = metaString(metadata, "channel_display_name") || metaString(metadata, "channel_username") || "A channel";
      const preview = metaString(metadata, "preview");
      return {
        title: types.community_post.title,
        body: preview
          ? applyTemplate(types.community_post.bodyWithPreview, { channel, preview })
          : applyTemplate(types.community_post.body, { channel }),
        typeLabel,
      };
    }
    case "video_duel": {
      const name = metaString(metadata, "challenger_display_name") || metaString(metadata, "challenger_username") || "Someone";
      return {
        title: types.video_duel.title,
        body: applyTemplate(types.video_duel.body, { name }),
        typeLabel,
      };
    }
    case "points_duel": {
      const name = metaString(metadata, "creator_display_name") || metaString(metadata, "creator_username") || "Someone";
      const points = metaString(metadata, "wager_points") || "0";
      return {
        title: types.points_duel.title,
        body: applyTemplate(types.points_duel.body, { name, points }),
        typeLabel,
      };
    }
    case "points_duel_accepted": {
      const name = metaString(metadata, "opponent_display_name") || metaString(metadata, "opponent_username") || "Someone";
      return {
        title: types.points_duel_accepted.title,
        body: applyTemplate(types.points_duel_accepted.body, { name }),
        typeLabel,
      };
    }
    case "season_start": {
      const season = metaString(metadata, "season_name") || "Season";
      return {
        title: types.season_start.title,
        body: applyTemplate(types.season_start.body, { season }),
        typeLabel,
      };
    }
    case "season_end": {
      const season = metaString(metadata, "season_name") || "Season";
      return {
        title: types.season_end.title,
        body: applyTemplate(types.season_end.body, { season }),
        typeLabel,
      };
    }
    case "video_like": {
      const name = metaString(metadata, "actor_display_name") || metaString(metadata, "actor_username") || "Someone";
      const title = metaString(metadata, "video_title") || "";
      return {
        title: types.video_like.title,
        body: title
          ? applyTemplate(types.video_like.bodyWithTitle, { name, title })
          : applyTemplate(types.video_like.body, { name }),
        typeLabel,
      };
    }
    case "video_comment": {
      const name = metaString(metadata, "actor_display_name") || metaString(metadata, "actor_username") || "Someone";
      const preview = metaString(metadata, "preview");
      return {
        title: types.video_comment.title,
        body: preview
          ? applyTemplate(types.video_comment.bodyWithPreview, { name, preview })
          : applyTemplate(types.video_comment.body, { name }),
        typeLabel,
      };
    }
    case "comment_reply": {
      const name = metaString(metadata, "actor_display_name") || metaString(metadata, "actor_username") || "Someone";
      const preview = metaString(metadata, "preview");
      return {
        title: types.comment_reply.title,
        body: preview
          ? applyTemplate(types.comment_reply.bodyWithPreview, { name, preview })
          : applyTemplate(types.comment_reply.body, { name }),
        typeLabel,
      };
    }
    case "comment_like": {
      const name = metaString(metadata, "actor_display_name") || metaString(metadata, "actor_username") || "Someone";
      return {
        title: types.comment_like.title,
        body: applyTemplate(types.comment_like.body, { name }),
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

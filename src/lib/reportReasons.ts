export type CommunityReportReason =
  | "off_topic"
  | "adult"
  | "spam"
  | "harassment"
  | "other";

export type ReportReason = "copyright" | "reupload" | "spam" | "other";

export function requiresOriginalSource(reason: ReportReason): boolean {
  return reason === "copyright" || reason === "reupload";
}

export function parseVideoId(input: string): string {
  const trimmed = input.trim();
  const fromPath = trimmed.match(/\/video\/([0-9a-f-]+)/i);
  if (fromPath?.[1]) return fromPath[1];

  const uuidMatch = trimmed.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i,
  );
  if (uuidMatch?.[1]) return uuidMatch[1];

  return trimmed;
}

export function parsePostId(input: string): string {
  const trimmed = input.trim();
  const fromHash = trimmed.match(/#post-([0-9a-f-]+)/i);
  if (fromHash?.[1]) return fromHash[1];

  const uuidMatch = trimmed.match(
    /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i,
  );
  if (uuidMatch?.[1]) return uuidMatch[1];

  return trimmed;
}

export function isValidHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

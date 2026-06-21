export type MediaFolder = "clips" | "thumbnails" | "avatars" | "banners" | "kyc";

export type R2Config = {
  accountId: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketName: string;
  publicUrl: string;
};

export function isR2Configured(): boolean {
  return Boolean(getR2Config());
}

export function getR2Config(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID?.trim();
  const accessKeyId = process.env.R2_ACCESS_KEY_ID?.trim();
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucketName = process.env.R2_BUCKET_NAME?.trim();
  const publicUrl = process.env.R2_PUBLIC_URL?.trim().replace(/\/$/, "");

  if (!accountId || !accessKeyId || !secretAccessKey || !bucketName || !publicUrl) {
    return null;
  }

  return {
    accountId,
    accessKeyId,
    secretAccessKey,
    bucketName,
    publicUrl,
  };
}

export function getR2PublicUrl(key: string): string | null {
  const config = getR2Config();
  if (!config) return null;
  return `${config.publicUrl}/${key.replace(/^\//, "")}`;
}

const FOLDER_MAX_BYTES: Record<MediaFolder, number> = {
  clips: 200 * 1024 * 1024,
  thumbnails: 8 * 1024 * 1024,
  avatars: 8 * 1024 * 1024,
  banners: 12 * 1024 * 1024,
  kyc: 10 * 1024 * 1024,
};

const FOLDER_CONTENT_TYPES: Record<MediaFolder, readonly string[]> = {
  clips: ["video/mp4", "video/webm", "video/quicktime"],
  thumbnails: ["image/jpeg", "image/png", "image/webp"],
  avatars: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  banners: ["image/jpeg", "image/png", "image/webp", "image/gif"],
  kyc: ["image/jpeg", "image/png", "image/webp"],
};

export function isMediaFolder(value: string): value is MediaFolder {
  return (
    value === "clips" ||
    value === "thumbnails" ||
    value === "avatars" ||
    value === "banners" ||
    value === "kyc"
  );
}

export function validateMediaUploadInput(
  folder: MediaFolder,
  filename: string,
  contentType: string,
  contentLength: number,
): string | null {
  if (!/^[a-zA-Z0-9._-]+$/.test(filename)) {
    return "invalid filename";
  }

  if (!Number.isFinite(contentLength) || contentLength <= 0) {
    return "invalid content length";
  }

  if (contentLength > FOLDER_MAX_BYTES[folder]) {
    return "file too large";
  }

  const normalizedType = contentType.split(";")[0]?.trim().toLowerCase() ?? "";
  if (!FOLDER_CONTENT_TYPES[folder].includes(normalizedType)) {
    return "unsupported content type";
  }

  return null;
}

export function buildMediaObjectKey(folder: MediaFolder, userId: string, filename: string): string {
  return `${folder}/${userId}/${filename}`;
}

export function isUserOwnedObjectKey(key: string, userId: string): boolean {
  const parts = key.replace(/^\//, "").split("/");
  if (parts.length !== 3) return false;
  if (!isMediaFolder(parts[0] ?? "")) return false;
  return parts[1] === userId;
}

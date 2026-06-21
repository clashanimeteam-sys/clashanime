export function parseHashtags(input: string): string[] {
  const tags = input
    .split(/[\s,#]+/)
    .map((tag) => tag.trim().replace(/^#/, ""))
    .filter(Boolean)
    .map((tag) => tag.toLowerCase());

  return [...new Set(tags)].slice(0, 12);
}

export function formatHashtags(tags: string[]): string {
  return tags.map((tag) => `#${tag}`).join(" ");
}

export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("invalid-video"));
    };

    video.src = url;
  });
}

export function getPublicStorageUrl(
  supabaseUrl: string,
  bucket: string,
  path: string,
): string {
  const base = supabaseUrl.replace(/\/$/, "");
  return `${base}/storage/v1/object/public/${bucket}/${path}`;
}

type StorageUploadParams = {
  supabase: {
    storage: {
      from: (bucket: string) => {
        upload: (
          path: string,
          file: File,
          options: { upsert?: boolean; contentType?: string },
        ) => Promise<{ error: { message: string } | null }>;
      };
    };
  };
  config: { url: string };
  folder: "clips" | "thumbnails" | "avatars" | "banners";
  bucket: string;
  storagePath: string;
  filename: string;
  file: File;
  upsert?: boolean;
};

export type StorageUploadResult = {
  publicUrl: string;
  objectKey: string | null;
  backend: "r2" | "supabase";
};

export async function uploadToStorageWithFallback({
  supabase,
  config,
  folder,
  bucket,
  storagePath,
  filename,
  file,
  upsert = false,
}: StorageUploadParams): Promise<StorageUploadResult> {
  const health = await fetch("/api/health/media").catch(() => null);
  const healthPayload = health?.ok
    ? ((await health.json()) as { r2Configured?: boolean })
    : null;

  if (healthPayload?.r2Configured) {
    try {
      const { uploadMediaFile } = await import("@/lib/mediaUpload");
      const uploaded = await uploadMediaFile({ folder, filename, file });
      return {
        publicUrl: uploaded.publicUrl,
        objectKey: uploaded.key,
        backend: "r2",
      };
    } catch {
      // Fall back to Supabase Storage if R2 upload fails (SSL/CORS/network).
    }
  }

  const { error: uploadError } = await supabase.storage.from(bucket).upload(storagePath, file, {
    upsert,
    contentType: file.type || undefined,
  });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  return {
    publicUrl: getPublicStorageUrl(config.url, bucket, storagePath),
    objectKey: null,
    backend: "supabase",
  };
}

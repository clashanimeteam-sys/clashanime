import type { MediaFolder } from "@/lib/r2/config";

type PresignResponse = {
  uploadUrl: string;
  publicUrl: string;
  key: string;
};

type UploadMediaFileParams = {
  folder: MediaFolder;
  filename: string;
  file: File;
};

export async function uploadMediaFile({
  folder,
  filename,
  file,
}: UploadMediaFileParams): Promise<PresignResponse> {
  const presignResponse = await fetch("/api/media/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      folder,
      filename,
      contentType: file.type || guessContentType(folder, filename),
      contentLength: file.size,
    }),
  });

  const presignPayload = (await presignResponse.json()) as PresignResponse & { error?: string };

  if (!presignResponse.ok) {
    throw new Error(presignPayload.error ?? "presign failed");
  }

  const uploadResponse = await fetch(presignPayload.uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-Type": file.type || guessContentType(folder, filename),
    },
  });

  if (!uploadResponse.ok) {
    await deleteMediaObjects([presignPayload.key]).catch(() => undefined);
    throw new Error("upload failed");
  }

  return presignPayload;
}

export async function deleteMediaObjects(keys: string[]): Promise<void> {
  if (keys.length === 0) return;

  const response = await fetch("/api/media/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ keys }),
  });

  if (!response.ok) {
    const payload = (await response.json()) as { error?: string };
    throw new Error(payload.error ?? "delete failed");
  }
}

function guessContentType(folder: MediaFolder, filename: string): string {
  const extension = filename.split(".").pop()?.toLowerCase();

  if (folder === "clips") {
    if (extension === "webm") return "video/webm";
    if (extension === "mov") return "video/quicktime";
    return "video/mp4";
  }

  if (extension === "png") return "image/png";
  if (extension === "webp") return "image/webp";
  if (extension === "gif") return "image/gif";
  return "image/jpeg";
}

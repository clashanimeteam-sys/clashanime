import type { MediaFolder } from "@/lib/r2/config";

type UploadResponse = {
  publicUrl: string;
  key: string;
};

type UploadMediaFileParams = {
  folder: MediaFolder;
  filename: string;
  file: File;
};

const SERVER_UPLOAD_MAX_BYTES = 45 * 1024 * 1024;

function resolveContentType(folder: MediaFolder, filename: string, file: File): string {
  return file.type || guessContentType(folder, filename);
}

export async function uploadMediaFile({
  folder,
  filename,
  file,
}: UploadMediaFileParams): Promise<UploadResponse> {
  const contentType = resolveContentType(folder, filename, file);

  // Browser → R2 avoids Vercel server TLS issues with *.r2.cloudflarestorage.com.
  try {
    return await uploadViaPresignedUrl({ folder, filename, file, contentType });
  } catch (presignError) {
    if (file.size > SERVER_UPLOAD_MAX_BYTES) {
      throw presignError;
    }

    try {
      return await uploadViaServer({ folder, filename, file });
    } catch {
      throw presignError;
    }
  }
}

async function uploadViaServer({
  folder,
  filename,
  file,
}: UploadMediaFileParams): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append("folder", folder);
  formData.append("filename", filename);
  formData.append("file", file);

  let response: Response;
  try {
    response = await fetch("/api/media/upload", {
      method: "POST",
      body: formData,
      credentials: "include",
    });
  } catch {
    throw new Error("server upload network error");
  }

  const payload = (await response.json()) as UploadResponse & { error?: string };
  if (!response.ok) {
    throw new Error(payload.error ?? "server upload failed");
  }

  return payload;
}

async function uploadViaPresignedUrl({
  folder,
  filename,
  file,
  contentType,
}: UploadMediaFileParams & { contentType: string }): Promise<UploadResponse> {
  let presignResponse: Response;
  try {
    presignResponse = await fetch("/api/media/presign", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        folder,
        filename,
        contentType,
        contentLength: file.size,
      }),
    });
  } catch {
    throw new Error("presign network error");
  }

  const presignPayload = (await presignResponse.json()) as UploadResponse & { uploadUrl?: string; error?: string };

  if (!presignResponse.ok || !presignPayload.uploadUrl) {
    throw new Error(presignPayload.error ?? "presign failed");
  }

  let uploadResponse: Response;
  try {
    uploadResponse = await fetch(presignPayload.uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch {
    await deleteMediaObjects([presignPayload.key]).catch(() => undefined);
    throw new Error("r2 direct upload blocked");
  }

  if (!uploadResponse.ok) {
    await deleteMediaObjects([presignPayload.key]).catch(() => undefined);
    throw new Error(`upload failed (${uploadResponse.status})`);
  }

  return {
    publicUrl: presignPayload.publicUrl,
    key: presignPayload.key,
  };
}

export async function deleteMediaObjects(keys: string[]): Promise<void> {
  if (keys.length === 0) return;

  const response = await fetch("/api/media/delete", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
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

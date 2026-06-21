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

type UploadSessionResponse = UploadResponse & {
  uploadUrl?: string;
  token?: string;
  error?: string;
};

const SERVER_UPLOAD_MAX_BYTES = 45 * 1024 * 1024;
const WORKER_UPLOAD_URL = process.env.NEXT_PUBLIC_R2_UPLOAD_URL?.trim().replace(/\/$/, "");

function resolveContentType(folder: MediaFolder, filename: string, file: File): string {
  return file.type || guessContentType(folder, filename);
}

export async function uploadMediaFile({
  folder,
  filename,
  file,
}: UploadMediaFileParams): Promise<UploadResponse> {
  const contentType = resolveContentType(folder, filename, file);

  if (WORKER_UPLOAD_URL) {
    try {
      return await uploadViaWorker({ folder, filename, file, contentType });
    } catch (workerError) {
      if (file.size > SERVER_UPLOAD_MAX_BYTES) {
        throw workerError;
      }
    }
  }

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

async function uploadViaWorker({
  folder,
  filename,
  file,
  contentType,
}: UploadMediaFileParams & { contentType: string }): Promise<UploadResponse> {
  const workerUploadUrl = WORKER_UPLOAD_URL;
  if (!workerUploadUrl) {
    throw new Error("upload worker not configured");
  }

  let sessionResponse: Response;
  try {
    sessionResponse = await fetch("/api/media/upload-session", {
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
    throw new Error("upload session network error");
  }

  const session = (await sessionResponse.json()) as UploadSessionResponse;
  if (!sessionResponse.ok || !session.token) {
    throw new Error(session.error ?? "upload session failed");
  }

  let uploadResponse: Response;
  try {
    uploadResponse = await fetch(session.uploadUrl ?? workerUploadUrl, {
      method: "POST",
      headers: {
        "Content-Type": contentType,
        "X-Upload-Token": session.token,
      },
      body: file,
    });
  } catch {
    throw new Error("r2 worker upload blocked (check upload.clashanime.com DNS and worker domain)");
  }

  const payload = (await uploadResponse.json()) as UploadResponse & { error?: string };
  if (!uploadResponse.ok) {
    throw new Error(payload.error ?? `upload failed (${uploadResponse.status})`);
  }

  return {
    publicUrl: payload.publicUrl,
    key: payload.key,
  };
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
    });
  } catch {
    await deleteMediaObjects([presignPayload.key]).catch(() => undefined);
    throw new Error("r2 direct upload blocked");
  }

  if (!uploadResponse.ok) {
    await deleteMediaObjects([presignPayload.key]).catch(() => undefined);
    if (uploadResponse.status === 403) {
      throw new Error("r2 upload forbidden (check CORS on clashanime-media bucket)");
    }
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

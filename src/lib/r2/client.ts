import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  buildMediaObjectKey,
  getR2Config,
  getR2PublicUrl,
  type MediaFolder,
} from "@/lib/r2/config";
import { getR2S3Client } from "@/lib/r2/s3Client";

export async function createPresignedMediaUploadUrl(params: {
  folder: MediaFolder;
  userId: string;
  filename: string;
  contentType: string;
}): Promise<{ uploadUrl: string; publicUrl: string; key: string } | null> {
  const config = getR2Config();
  const client = getR2S3Client();
  if (!config || !client) return null;

  const key = buildMediaObjectKey(params.folder, params.userId, params.filename);
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 * 10 });
  const publicUrl = getR2PublicUrl(key);
  if (!publicUrl) return null;

  return { uploadUrl, publicUrl, key };
}

export async function uploadMediaObject(params: {
  folder: MediaFolder;
  userId: string;
  filename: string;
  contentType: string;
  body: Buffer | Uint8Array;
}): Promise<{ publicUrl: string; key: string } | null> {
  const signed = await createPresignedMediaUploadUrl({
    folder: params.folder,
    userId: params.userId,
    filename: params.filename,
    contentType: params.contentType,
  });

  if (!signed) return null;

  const response = await fetch(signed.uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": params.contentType,
      "Content-Length": String(params.body.byteLength),
    },
    body: params.body as unknown as BodyInit,
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`R2 upload failed (${response.status})${detail ? `: ${detail.slice(0, 120)}` : ""}`);
  }

  return {
    publicUrl: signed.publicUrl,
    key: signed.key,
  };
}

export { deleteR2Objects } from "@/lib/r2/delete";

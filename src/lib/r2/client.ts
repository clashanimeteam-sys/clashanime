import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  buildMediaObjectKey,
  getR2Config,
  getR2PublicUrl,
  type MediaFolder,
} from "@/lib/r2/config";

let cachedClient: S3Client | null = null;

function getR2Client(): S3Client | null {
  const config = getR2Config();
  if (!config) return null;

  if (!cachedClient) {
    cachedClient = new S3Client({
      region: "auto",
      endpoint: `https://${config.accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: config.accessKeyId,
        secretAccessKey: config.secretAccessKey,
      },
      forcePathStyle: true,
      requestChecksumCalculation: "WHEN_REQUIRED",
      responseChecksumValidation: "WHEN_REQUIRED",
    });
  }

  return cachedClient;
}

export async function uploadMediaObject(params: {
  folder: MediaFolder;
  userId: string;
  filename: string;
  contentType: string;
  body: Buffer | Uint8Array;
}): Promise<{ publicUrl: string; key: string } | null> {
  const config = getR2Config();
  const client = getR2Client();
  if (!config || !client) return null;

  const key = buildMediaObjectKey(params.folder, params.userId, params.filename);

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: params.body,
      ContentType: params.contentType,
    }),
  );

  const publicUrl = getR2PublicUrl(key);
  if (!publicUrl) return null;

  return { publicUrl, key };
}

export async function createPresignedMediaUploadUrl(params: {
  folder: MediaFolder;
  userId: string;
  filename: string;
  contentType: string;
}): Promise<{ uploadUrl: string; publicUrl: string; key: string } | null> {
  const config = getR2Config();
  const client = getR2Client();
  if (!config || !client) return null;

  const key = buildMediaObjectKey(params.folder, params.userId, params.filename);
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    ContentType: params.contentType,
  });

  const uploadUrl = await getSignedUrl(client, command, {
    expiresIn: 60 * 10,
    signableHeaders: new Set(["content-type"]),
  });
  const publicUrl = getR2PublicUrl(key);
  if (!publicUrl) return null;

  return { uploadUrl, publicUrl, key };
}

export { deleteR2Objects } from "@/lib/r2/delete";

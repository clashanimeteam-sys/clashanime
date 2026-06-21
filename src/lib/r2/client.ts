import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
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
    });
  }

  return cachedClient;
}

export async function createPresignedMediaUploadUrl(params: {
  folder: MediaFolder;
  userId: string;
  filename: string;
  contentType: string;
  contentLength: number;
}): Promise<{ uploadUrl: string; publicUrl: string; key: string } | null> {
  const config = getR2Config();
  const client = getR2Client();
  if (!config || !client) return null;

  const key = buildMediaObjectKey(params.folder, params.userId, params.filename);
  const command = new PutObjectCommand({
    Bucket: config.bucketName,
    Key: key,
    ContentType: params.contentType,
    ContentLength: params.contentLength,
  });

  const uploadUrl = await getSignedUrl(client, command, { expiresIn: 60 * 10 });
  const publicUrl = getR2PublicUrl(key);
  if (!publicUrl) return null;

  return { uploadUrl, publicUrl, key };
}

export async function deleteR2Objects(keys: string[]): Promise<void> {
  const config = getR2Config();
  const client = getR2Client();
  if (!config || !client || keys.length === 0) return;

  await Promise.all(
    keys.map((key) =>
      client.send(
        new DeleteObjectCommand({
          Bucket: config.bucketName,
          Key: key.replace(/^\//, ""),
        }),
      ),
    ),
  );
}

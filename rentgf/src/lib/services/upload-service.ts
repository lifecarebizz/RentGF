import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET = process.env.R2_BUCKET_NAME || "rentgf-uploads";
const PUBLIC_URL = process.env.R2_PUBLIC_URL || "";

export async function uploadFile(file: Buffer, mimeType: string, folder: string): Promise<string> {
  const ext = mimeType.split("/")[1] || "bin";
  const key = `${folder}/${crypto.randomBytes(16).toString("hex")}.${ext}`;

  await s3.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: file,
      ContentType: mimeType,
    })
  );

  return `${PUBLIC_URL}/${key}`;
}

export async function deleteFile(url: string): Promise<void> {
  try {
    const key = url.replace(`${PUBLIC_URL}/`, "");
    await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }));
  } catch {
    // Ignore delete errors
  }
}

export async function getPresignedUploadUrl(folder: string, mimeType: string): Promise<{ uploadUrl: string; publicUrl: string }> {
  const ext = mimeType.split("/")[1] || "bin";
  const key = `${folder}/${crypto.randomBytes(16).toString("hex")}.${ext}`;

  const uploadUrl = await getSignedUrl(
    s3,
    new PutObjectCommand({ Bucket: BUCKET, Key: key, ContentType: mimeType }),
    { expiresIn: 300 }
  );

  return { uploadUrl, publicUrl: `${PUBLIC_URL}/${key}` };
}

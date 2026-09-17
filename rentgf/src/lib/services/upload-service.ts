import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function uploadFile(file: Buffer, mimeType: string, folder: string): Promise<string> {
  const ext = mimeType.split("/")[1] || "bin";
  const key = `${crypto.randomBytes(16).toString("hex")}.${ext}`;

  const { error } = await supabase.storage
    .from(folder)
    .upload(key, file, { contentType: mimeType, upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(folder).getPublicUrl(key);
  return data.publicUrl;
}

export async function deleteFile(url: string, folder: string): Promise<void> {
  try {
    const key = url.split(`/${folder}/`)[1];
    if (key) await supabase.storage.from(folder).remove([key]);
  } catch {
    // Ignore delete errors
  }
}

export async function getPresignedUploadUrl(
  folder: string,
  mimeType: string
): Promise<{ uploadUrl: string; publicUrl: string }> {
  const ext = mimeType.split("/")[1] || "bin";
  const key = `${crypto.randomBytes(16).toString("hex")}.${ext}`;

  const { data, error } = await supabase.storage
    .from(folder)
    .createSignedUploadUrl(key);

  if (error || !data) throw new Error(error?.message || "Failed to create upload URL");

  const { data: publicData } = supabase.storage.from(folder).getPublicUrl(key);

  return { uploadUrl: data.signedUrl, publicUrl: publicData.publicUrl };
}

import { NextRequest, NextResponse } from "next/server";
import { getPresignedUploadUrl } from "@/lib/services/upload-service";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-key-change-in-production-min-32-chars";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
const ALLOWED_FOLDERS = ["avatars", "companion-photos", "verification-docs"];

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    jwt.verify(authHeader.substring(7), JWT_SECRET);

    const { mimeType, folder } = await req.json();

    if (!ALLOWED_TYPES.includes(mimeType)) {
      return NextResponse.json({ error: "File type not allowed" }, { status: 400 });
    }
    if (!ALLOWED_FOLDERS.includes(folder)) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
    }

    const { uploadUrl, publicUrl } = await getPresignedUploadUrl(folder, mimeType);
    return NextResponse.json({ uploadUrl, publicUrl });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

import { prisma } from "@/lib/db/prisma-client";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return NextResponse.json({ user: null });

  try {
    // JWT decode (simplified)
    const payload = JSON.parse(Buffer.from(token.split(".")[1] || "", "base64").toString());
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true, email: true, displayName: true, fullName: true, role: true,
        status: true, avatarUrl: true, emailVerified: true,
      },
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}

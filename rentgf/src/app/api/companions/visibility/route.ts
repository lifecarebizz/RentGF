import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-key-change-in-production-min-32-chars";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = jwt.verify(token, JWT_SECRET) as any;

    if (payload.role !== "COMPANION") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const profile = await prisma.companionProfile.findUnique({
      where: { userId: payload.id },
    });

    if (!profile) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    return NextResponse.json({ profile });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = authHeader.substring(7);
    const payload = jwt.verify(token, JWT_SECRET) as any;

    if (payload.role !== "COMPANION") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const profile = await prisma.companionProfile.update({
      where: { userId: payload.id },
      data: {
        isPublic: body.isPublic ?? undefined,
        isDiscoverable: body.isDiscoverable ?? undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

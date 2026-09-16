import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-change-me";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const profile = await prisma.profile.findUnique({
      where: { id: params.id },
      include: { companionProfile: true, city: true },
    });
    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ user: { ...profile, avatarUrl: profile.profilePhotoUrl } });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const payload = jwt.verify(authHeader.substring(7), JWT_SECRET) as { role: string };
    if (payload.role !== "ADMIN") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const body = await req.json();
    const allowed = ["accountStatus", "role", "isAdmin"] as const;
    const data: Record<string, unknown> = {};
    for (const key of allowed) { if (key in body) data[key] = body[key]; }

    const updated = await prisma.profile.update({ where: { id: params.id }, data });
    return NextResponse.json({ user: updated });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

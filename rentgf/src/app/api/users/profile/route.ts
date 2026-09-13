import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-key-change-in-production-min-32-chars";

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const payload = jwt.verify(token, JWT_SECRET) as any;

    const { fullName, displayName, phone, city, languages, interests, bio } = await req.json();

    const user = await prisma.user.update({
      where: { id: payload.id },
      data: {
        displayName: displayName || undefined,
        fullName: fullName || undefined,
        phone: phone !== undefined ? phone : undefined,
        city: city !== undefined ? city : undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

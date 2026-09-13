import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-key-change-in-production-min-32-chars";

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();
    const payload = jwt.verify(token, JWT_SECRET) as any;
    return NextResponse.json({ user: payload });
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}

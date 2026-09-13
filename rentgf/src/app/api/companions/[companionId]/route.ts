import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const companionId = searchParams.get("companionId");

    if (!companionId) return NextResponse.json({ error: "companionId required" }, { status: 400 });

    const profile = await prisma.companionProfile.findUnique({
      where: { userId: companionId },
      include: { user: true },
    });

    if (!profile) return NextResponse.json({ error: "Not found" }, { status: 404 });

    return NextResponse.json({ profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

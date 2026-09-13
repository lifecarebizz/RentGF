import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const profile = await prisma.companionProfile.findUnique({
        where: { userId: id },
        include: { user: true },
      });
      return NextResponse.json({ profile });
    }

    const top = await prisma.companionProfile.findMany({
      where: { isDiscoverable: true, verificationStatus: "APPROVED" },
      take: 10,
      orderBy: { averageRating: "desc" },
      include: { user: true },
    });

    return NextResponse.json({ companions: top });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

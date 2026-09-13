import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";

    let results: any[] = [];

    if (q.length >= 2) {
      const users = await prisma.user.findMany({
        where: { OR: [{ displayName: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }], status: "ACTIVE" },
        take: 10,
      });

      const companions = await prisma.companionProfile.findMany({
        where: { isDiscoverable: true, user: { displayName: { contains: q, mode: "insensitive" } } },
        take: 10,
        include: { user: true },
      });

      results = [
        ...users.map((u) => ({ type: "user", id: u.id, name: u.displayName, email: u.email, avatarUrl: u.avatarUrl })),
        ...companions.map((c) => ({ type: "companion", id: c.id, name: c.user.displayName, avatarUrl: c.user.avatarUrl })),
      ];
    }

    return NextResponse.json({ results });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

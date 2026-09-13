import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";


export async function GET(req: NextRequest) {
  try {
    const cities = await prisma.city.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    const interests = await prisma.interest.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" },
    });
    const platformSettings = await prisma.platformSetting.findMany();

    return NextResponse.json({ cities, categories, interests, platformSettings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

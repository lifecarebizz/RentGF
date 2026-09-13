import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma-client";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "rentgf-secret-key-change-in-production-min-32-chars";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const city = searchParams.get("city") || "";
    const category = searchParams.get("category") || "";
    const sort = searchParams.get("sort") || "RECOMMENDED";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const skip = (page - 1) * limit;
    const where: any = { isDiscoverable: true, isPublic: true, verificationStatus: "APPROVED" };

    if (q) {
      where.OR = [
        { user: { displayName: { contains: q, mode: "insensitive" } } },
        { user: { fullName: { contains: q, mode: "insensitive" } } },
      ];
    }
    if (city) where.city = city;
    if (category) where.categories = { has: category };

    const orderBy: any = {};
    switch (sort) {
      case "PRICE_ASC": orderBy.startingPrice = "asc"; break;
      case "PRICE_DESC": orderBy.startingPrice = "desc"; break;
      case "RATING": orderBy.averageRating = "desc"; break;
      default: orderBy.createdAt = "desc";
    }

    const [companions, total] = await Promise.all([
      prisma.companionProfile.findMany({ where, skip, take: limit, orderBy, include: { user: true } }),
      prisma.companionProfile.count({ where }),
    ]);

    return NextResponse.json({
      companions, total, page, totalPages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

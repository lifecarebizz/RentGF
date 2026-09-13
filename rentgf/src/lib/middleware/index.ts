import { NextRequest, NextResponse } from "next/server";

export function withApiHandler(handler: (req: NextRequest, context: { params: Record<string, string> }) => Promise<NextResponse>) {
  return async (req: NextRequest, { params }: { params: Record<string, string> }) => {
    try {
      return await handler(req, { params });
    } catch (error: any) {
      const message = error?.message || "Internal server error";
      const status = error?.status || 500;
      console.error("API Error:", message);
      return NextResponse.json({ error: message }, { status });
    }
  };
}

export function withAuth(handler: (req: NextRequest, context: { params: Record<string, string>; user: any }) => Promise<NextResponse>) {
  return async (req: NextRequest, { params }: { params: Record<string, string> }) => {
    try {
      const authHeader = req.headers.get("authorization");
      if (!authHeader?.startsWith("Bearer ")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const token = authHeader.substring(7);
      // In production, verify JWT token here
      // For now, decode payload (placeholder)
      let user: any = {};
      try {
        const payload = JSON.parse(Buffer.from(token.split(".")[1] || "", "base64").toString());
        user = payload;
      } catch {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }

      return await handler(req, { params, user });
    } catch (error: any) {
      return NextResponse.json({ error: error?.message || "Internal server error" }, { status: 500 });
    }
  };
}

export function withRole(...roles: string[]) {
  return async (req: NextRequest, context: any) => {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const token = authHeader.substring(7);
    let user: any = {};
    try {
      const payload = JSON.parse(Buffer.from(token.split(".")[1] || "", "base64").toString());
      user = payload;
    } catch {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    if (!roles.includes(user.role)) {
      return NextResponse.json({ error: "Forbidden: Insufficient permissions" }, { status: 403 });
    }

    return null; // Authorization passed
  };
}

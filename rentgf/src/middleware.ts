import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/api/")) return NextResponse.next();

  if (pathname.startsWith("/login") || pathname.startsWith("/register") ||
      pathname.startsWith("/forgot") || pathname.startsWith("/reset") ||
      pathname.startsWith("/verify-email") || pathname.startsWith("/legal") ||
      pathname.startsWith("/discover") || pathname.startsWith("/cities") ||
      pathname.startsWith("/categories") || pathname.startsWith("/book") ||
      pathname.startsWith("/sitemap") || pathname.startsWith("/robots")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|ico)$).*)"],
};

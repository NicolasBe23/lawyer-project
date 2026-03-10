import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("strapi_token")?.value || null;
  const { pathname } = req.nextUrl;
  const isStaticAsset = /\.[^/]+$/.test(pathname);

  if (isStaticAsset) {
    return NextResponse.next();
  }

  const isPublicPath =
    pathname === "/" || pathname === "/login" || pathname === "/register";

  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const SESSION_COOKIE_NAME = "jt_session";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public paths (login, api login, Next static stuff)
  const publicPaths = ["/login", "/api/login"];
  const isPublic = publicPaths.some((p) => pathname.startsWith(p));

  if (
    isPublic ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/assets")
  ) {
    return NextResponse.next();
  }

  const session = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (session === "ok") {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", req.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

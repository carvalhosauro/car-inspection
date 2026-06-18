import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";
import { decideRedirect } from "@/lib/middleware-logic";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  const target = decideRedirect(request.nextUrl.pathname, cookie);
  if (target) {
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/dashboard/:path*",
    "/vehicles/:path*",
    "/checklists/:path*",
    "/inspections/:path*",
    "/audit/:path*",
    "/reports/:path*",
    "/users/:path*",
  ],
};

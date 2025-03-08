import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // Now req is of type NextRequest, which has nextUrl, cookies, etc.
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET! });
  const { pathname } = req.nextUrl;

  // Skip Next.js internals, static files, and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static")
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users away from protected routes
  if (!token && (pathname === "/" || pathname === "/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // If the user is authenticated and trying to access the login page, redirect them to dashboard
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login", "/dashboard"],
};
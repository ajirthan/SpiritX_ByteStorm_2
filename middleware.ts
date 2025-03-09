import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip certain routes from authentication checks
  // e.g., /login, /signup, /api/auth, static files, etc.
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // Attempt to retrieve token (null if not authenticated)
  const token = await getToken({ req });

  // If no token, redirect to login
  if (!token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = "/login";
    return NextResponse.redirect(loginUrl);
  }

  // If token exists, let the request continue
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Protect all routes except the ones we skip above
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

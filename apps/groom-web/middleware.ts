import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-this-in-production",
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page and API routes
  if (pathname === "/admin/login" || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Protect all other admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Check for admin-token cookie
  const token = request.cookies.get("admin-token")?.value;

  if (!token) {
    // Redirect to login if no token
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  try {
    // Verify token
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);
    // Redirect to login if token is invalid
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};

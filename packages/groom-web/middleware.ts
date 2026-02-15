import { jwtVerify } from "jose";
import { type NextRequest, NextResponse } from "next/server";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "5b340ec7-2437-4a0c-b451-0f3e7867bbad",
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Paths to protect
  const isAdminPath = pathname.startsWith("/admin");
  const isProtectedPath = pathname.startsWith("/my-bookings");

  if (!isAdminPath && !isProtectedPath) {
    return NextResponse.next();
  }

  // Check for session cookie
  const token = request.cookies.get("session")?.value;

  if (!token) {
    // Redirect to home (which has login button) or show login param
    const url = new URL("/", request.url);
    url.searchParams.set("login", "true"); // Hint to open login modal?
    return NextResponse.redirect(url);
  }

  try {
    // Verify token
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    // Check Admin Access
    if (isAdminPath) {
      const roles = (payload.roles as string[]) || [];
      const isAdmin = roles.includes("ADMIN") || roles.includes("SUPER_ADMIN");
      
      if (!isAdmin) {
        // Logged in but not admin -> Home
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Token verification failed:", error);
    const url = new URL("/", request.url);
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/my-bookings/:path*",
  ],
};

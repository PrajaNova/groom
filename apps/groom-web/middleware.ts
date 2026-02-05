import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// Using the same secret as backend
const JWT_SECRET =
  process.env.JWT_SECRET || "5b340ec7-2437-4a0c-b451-0f3e7867bbad"; // Should ideally matching backend env

export async function middleware(request: NextRequest) {
  // Check specifically for admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Allow access to login page
    if (request.nextUrl.pathname === "/admin/login") {
      const session = request.cookies.get("session");
      if (session) {
        return NextResponse.redirect(new URL("/admin", request.url));
      }
      return NextResponse.next();
    }

    const session = request.cookies.get("session");

    // 1. Check if session cookie exists
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // 2. Verify JWT and check roles
    try {
      const secret = new TextEncoder().encode(JWT_SECRET);
      const { payload } = await jwtVerify(session.value, secret);

      const user = payload.user as any;
      const roles = user?.roles || [];
      const hasAdminRole = roles.some((r: any) =>
        ["ADMIN", "SUPER_ADMIN"].includes(r.name),
      );

      if (!hasAdminRole) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch (e) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

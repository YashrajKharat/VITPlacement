import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("next-auth.session-token")?.value;
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    if (!token) {
      // Redirect to login if not authenticated
      const url = new URL("/login", request.url);
      return NextResponse.redirect(url);
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname === "/login" || pathname === "/register") {
    if (token) {
      // Direct base redirect; dashboard layout will route to specific role dashboards
      const url = new URL("/dashboard", request.url);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register"
  ]
};

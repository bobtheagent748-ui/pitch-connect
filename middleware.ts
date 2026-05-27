import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes — no auth required
  if (pathname === "/" || pathname === "/signin") {
    return NextResponse.next()
  }

  // Allow API routes
  if (pathname.startsWith("/api/") || pathname.startsWith("/_next/")) {
    return NextResponse.next()
  }

  // Check for NextAuth session cookie
  const sessionCookie =
    request.cookies.get("authjs.session-token") ||
    request.cookies.get("__Secure-authjs.session-token")

  if (!sessionCookie) {
    const signInUrl = new URL("/signin", request.url)
    signInUrl.searchParams.set("callbackUrl", request.url)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

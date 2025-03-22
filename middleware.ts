import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  
  // Public paths that don't require authentication
  const isPublicPath = path === "/" || path === "/login" || path === "/register" || path.startsWith("/api/auth")
  
  // Get the session token
  const sessionToken = request.cookies.get("session_token")?.value
  const isAuthenticated = !!sessionToken
  
  // If user is on public path, allow access
  if (isPublicPath) {
    // Optional: redirect authenticated users away from login/register pages
    if (isAuthenticated && (path === "/login" || path === "/register")) {
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    return NextResponse.next()
  }
  
  // If user is not authenticated and trying to access protected route
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public).*)"],
}


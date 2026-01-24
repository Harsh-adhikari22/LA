import { updateSession } from "@/lib/supabase/middleware"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Redirect malformed /search&category=... (missing ?) to /search?category=...
  const path = request.nextUrl.pathname
  if (path.startsWith("/search&")) {
    const fixed = "/search?" + path.slice("/search&".length)
    return NextResponse.redirect(new URL(fixed, request.url))
  }
  return await updateSession(request)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
}

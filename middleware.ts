import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Just pass through all requests for now to fix the routing issue
  return NextResponse.next()
}

export const config = {
  matcher: [],
}

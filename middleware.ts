import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Marketing site middleware - no authentication required
// All routes are public
export function middleware(request: NextRequest) {
  // Simply allow all requests to proceed
  return NextResponse.next()
}

// Configure matcher - run on all routes except static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

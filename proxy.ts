import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Marketing site proxy - no authentication required
// All routes are public
export function proxy(_request: NextRequest) {
  return NextResponse.next()
}

// Configure matcher - run on all routes except static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}


import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl
  
  // 1. Allow access to the "Coming Soon" page, blog, and static assets
  if (
    pathname === '/coming-soon' || 
    pathname.startsWith('/blog') ||
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.') // matches images, favicons, etc.
  ) {
    return NextResponse.next()
  }

  // 2. Check for the "Secret" access via URL: forhemit.com/?preview=true
  const hasPreviewParam = searchParams.get('preview') === 'true'
  const hasPreviewCookie = request.cookies.has('preview_access')

  // 3. If they have the secret param, set a cookie and let them in
  if (hasPreviewParam) {
    const response = NextResponse.redirect(new URL('/', request.url))
    response.cookies.set('preview_access', 'true', { 
      maxAge: 60 * 60 * 24, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
    return response
  }

  // 4. If no cookie, redirect everything else to Coming Soon
  if (!hasPreviewCookie) {
    return NextResponse.redirect(new URL('/coming-soon', request.url))
  }

  return NextResponse.next()
}

// Configure matcher to run on all routes except static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

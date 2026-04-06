import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { isAllowedEmail, isSuperAdmin } from './lib/clerk';
import { NextResponse } from 'next/server';

// Define public routes that don't require authentication
const isPublicRoute = createRouteMatcher([
  '/sign-in(.*)',
  '/sign-up(.*)',
  '/api/webhooks/clerk(.*)',
  '/api/webhooks/(.*)',
]);

// Define API routes that need email verification
const isApiRoute = createRouteMatcher([
  '/api/(.*)',
]);

export default clerkMiddleware(async (auth, request) => {
  const authObject = await auth();
  const { userId, sessionClaims } = authObject;
  
  // Allow public routes
  if (isPublicRoute(request)) {
    return;
  }

  // If no user, redirect to sign-in
  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // Get user email from session claims
  const email = sessionClaims?.email as string | undefined;

  // For API routes - strict checking required
  if (isApiRoute(request)) {
    if (!email) {
      return NextResponse.json(
        { 
          error: 'Configuration Error',
          message: 'Email not found in session claims. Configure Clerk Dashboard → Sessions → Customize session token with: { "email": "{{user.primary_email_address}}" }'
        },
        { status: 500 }
      );
    }

    if (!isAllowedEmail(email)) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Email domain not allowed' },
        { status: 403 }
      );
    }

    // Check super admin for user management APIs
    if (request.nextUrl.pathname.startsWith('/api/admin/users') && !isSuperAdmin(email)) {
      return NextResponse.json(
        { error: 'Forbidden', message: 'Super admin access required' },
        { status: 403 }
      );
    }

    return;
  }

  // For UI routes - let the client handle email verification
  // The AdminClientLayout will check useUser() and show error if needed
  return;
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files
    '/((?!_next/static|_next/image|manifest.webmanifest|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};

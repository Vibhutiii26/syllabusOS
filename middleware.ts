import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Clerk middleware (installed Clerk v7 integration for Next.js).
//
// This file only establishes Clerk request/auth context. Route protection
// happens server-side in the protected layout (app/(app)/layout.tsx) and in
// every API route handler via lib/server/auth.ts — never from a
// client-supplied user id.
//
// When Clerk keys are absent, the app runs in demo mode and this middleware
// is a no-op so the rest of the backend keeps working without key errors.
// ---------------------------------------------------------------------------

const clerkEnabled = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
);

export default clerkEnabled
  ? clerkMiddleware()
  : function noOpProxyMiddleware() {
      return NextResponse.next();
    };

export const config = {
  exclude: [
    '/_next/static',
    '/_next/image',
    '/favicon.ico',
    '/~static/:path*',
  ],
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

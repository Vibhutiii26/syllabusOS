'use client';

import { ClerkProvider } from '@clerk/nextjs';
import type { ReactNode } from 'react';

// Auth provider seam. With Clerk keys present this is the real provider.
// Without them the backend runs in demo mode (see lib/server/auth.ts) and we
// mount the app without Clerk so the demo still works — surfaces as
// `demoMode: true` on /api/auth-status.
export default function Providers({ children }: { children: ReactNode }) {
  const publishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  if (publishableKey) {
    return <ClerkProvider>{children}</ClerkProvider>;
  }
  return <>{children}</>;
}

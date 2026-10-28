import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server/auth';

/**
 * GET /api/auth-status
 * Lets the frontend render sign-in prompts, demo banners and loading states
 * without touching Clerk internals.
 */
export async function GET() {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) {
    // 401 from the auth seam — surface as structured status instead.
    return NextResponse.json(
      { authenticated: false, demoMode: false },
      { status: 401 },
    );
  }
  return NextResponse.json({
    authenticated: true,
    demoMode: auth.demoMode,
    user: { id: auth.userId, displayName: auth.displayName },
  });
}

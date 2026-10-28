import 'server-only';
import { NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Auth seam.
//
// With Clerk keys configured this is real Clerk auth: the user id is derived
// from the verified server-side Clerk session — NEVER from the request body.
// Without keys the backend runs in DEMO MODE with one fixed local identity so
// the app stays demoable. Demo mode is always flagged in responses so the
// frontend can surface a banner and we never fake real auth.
// ---------------------------------------------------------------------------

export const DEMO_USER_ID = 'demo-local-student';

export function clerkConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY,
  );
}

export interface AuthContext {
  userId: string;
  displayName: string | null;
  demoMode: boolean;
}

export async function getAuth(): Promise<
  { ok: true; ctx: AuthContext } | { ok: false; response: NextResponse }
> {
  if (clerkConfigured()) {
    const { auth, currentUser } = await import('@clerk/nextjs/server');
    const { userId } = await auth();
    if (!userId) {
      return {
        ok: false,
        response: NextResponse.json(
          {
            error: 'unauthenticated',
            message: 'Sign in to access SyllabusOS.',
          },
          { status: 401 },
        ),
      };
    }
    const user = await currentUser();
    return {
      ok: true,
      ctx: {
        userId,
        displayName: user
          ? [user.firstName, user.lastName].filter(Boolean).join(' ') || null
          : null,
        demoMode: false,
      },
    };
  }

  return {
    ok: true,
    ctx: {
      userId: DEMO_USER_ID,
      displayName: 'Demo Student',
      demoMode: true,
    },
  };
}

export async function requireAuth(): Promise<
  AuthContext | NextResponse
> {
  const result = await getAuth();
  return result.ok ? result.ctx : result.response;
}

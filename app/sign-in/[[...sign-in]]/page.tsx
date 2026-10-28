import { SignIn } from '@clerk/nextjs';
import { Suspense } from 'react';
import Link from 'next/link';

// Minimal Clerk sign-in route (auth plumbing). Style freely — keep the
// component and route path so Clerk redirects keep working.
export const instant = false; // Clerk mounts client-only UI
export default function SignInPage() {
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8">
        <div className="max-w-md rounded-xl border border-zinc-200 p-6 text-center">
          <h1 className="text-lg font-semibold">Sign in</h1>
          <p className="mt-2 text-sm text-zinc-600">
            Clerk is not configured on this deployment, so SyllabusOS is running
            in <strong>demo mode</strong> with a single local student identity.
            Add <code>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY</code> and{' '}
            <code>CLERK_SECRET_KEY</code> to enable real accounts.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white"
          >
            Continue in demo mode
          </Link>
        </div>
      </main>
    );
  }
  return (
    <main className="flex min-h-screen items-center justify-center p-8">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading sign-in…</p>}>
        <SignIn />
      </Suspense>
    </main>
  );
}

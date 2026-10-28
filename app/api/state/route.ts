import { NextResponse } from 'next/server';
import { z } from 'zod';
import { requireAuth } from '@/lib/server/auth';
import {
  loadLearnerState,
  markStudied,
  saveCurriculumSelection,
} from '@/lib/server/state';

const postSchema = z.discriminatedUnion('action', [
  z.object({
    action: z.literal('select_curriculum'),
    curriculumId: z.string().min(1).max(64),
  }),
  z.object({
    action: z.literal('mark_studied'),
    conceptId: z.string().min(1).max(64),
    completed: z.boolean().optional(),
  }),
]);

/**
 * POST /api/state
 *   { action: 'select_curriculum', curriculumId }
 *   { action: 'mark_studied', conceptId, completed? }
 * The university/degree/branch etc. are filled from the server-side
 * curriculum registry — the browser cannot assert identity or curriculum.
 */
export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: 'invalid_json', message: 'Request body must be valid JSON.' },
      { status: 400 },
    );
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'validation_failed',
        message: 'Invalid action payload.',
        issues: parsed.error.issues,
      },
      { status: 422 },
    );
  }

  try {
    const data = parsed.data;
    if (data.action === 'select_curriculum') {
      const result = await saveCurriculumSelection(auth, data.curriculumId);
      if ('error' in result && result.error === 'unknown_curriculum') {
        return NextResponse.json(
          { error: 'unknown_curriculum', message: result.message },
          { status: 404 },
        );
      }
    } else {
      const result = await markStudied(auth, data.conceptId, data.completed);
      if ('error' in result && result.error === 'unknown_concept') {
        return NextResponse.json(
          { error: 'unknown_concept', message: 'Unknown concept id.' },
          { status: 404 },
        );
      }
    }
    const state = await loadLearnerState(auth);
    return NextResponse.json(state);
  } catch (err) {
    console.error('[/api/state] write failed', err);
    return NextResponse.json(
      {
        error: 'write_failed',
        message:
          'Could not persist learning state. Check the database connection and try again.',
      },
      { status: 503 },
    );
  }
}

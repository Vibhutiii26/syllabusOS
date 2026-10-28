import { NextResponse } from 'next/server';
import { answerBodySchema } from '@/lib/schemas';
import { requireAuth } from '@/lib/server/auth';
import { applyAnswer } from '@/lib/server/state';

/**
 * POST /api/assessment/answer
 * body: { questionId, selectedOptionId }
 *
 * Deterministic flow (no AI involved in scoring):
 *  1. verify the authenticated student
 *  2. check the answer against the server-only answer key
 *  3. persist the assessment attempt
 *  4. update that student's concept mastery from the evidence
 *  5. advance the prerequisite-aware diagnosis FSM (hypothesis -> evidence)
 *  6. return only this student's updated learning state + result
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

  const parsed = answerBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'validation_failed',
        message: 'Expected { questionId, selectedOptionId }.',
        issues: parsed.error.issues,
      },
      { status: 422 },
    );
  }

  try {
    const result = await applyAnswer(
      auth,
      parsed.data.questionId,
      parsed.data.selectedOptionId,
    );
    if ('error' in result && result.error === 'unknown_question') {
      return NextResponse.json(
        { error: 'unknown_question', message: 'Unknown question id.' },
        { status: 404 },
      );
    }
    if ('error' in result && result.error === 'unknown_option') {
      return NextResponse.json(
        { error: 'unknown_option', message: 'Unknown option id for that question.' },
        { status: 422 },
      );
    }
    if ('ok' in result) {
      return NextResponse.json(result.ok);
    }
    // Unreachable guard — keeps the handler total for future error kinds.
    return NextResponse.json(
      { error: 'internal', message: 'Unexpected result.' },
      { status: 500 },
    );
  } catch (err) {
    console.error('[/api/assessment/answer] failed', err);
    return NextResponse.json(
      {
        error: 'write_failed',
        message:
          'Could not record the answer. Check the database connection and try again.',
      },
      { status: 503 },
    );
  }
}

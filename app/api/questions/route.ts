import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server/auth';
import {
  getDiagnosticQuestions,
  stripQuestion,
} from '@/lib/server/questions';
import { conceptOrder } from '@/lib/graph';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';

/**
 * GET /api/questions?conceptId=<id>
 * Returns client-safe questions (no answer keys) for one concept, or the
 * full initial diagnostic set when no conceptId is given. Scope hint is
 * included so the frontend can render question sets without importing the
 * answer-keyed data.
 */
export async function GET(request: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const url = new URL(request.url);
  const conceptId = url.searchParams.get('conceptId');

  if (conceptId) {
    const concept = conceptOrder().find((c) => c.id === conceptId);
    if (!concept) {
      return NextResponse.json(
        { error: 'unknown_concept', message: 'Unknown concept id.' },
        { status: 404 },
      );
    }
    return NextResponse.json({
      conceptId,
      questions: concept.practiceQuestions.map((q) =>
        stripQuestion({ ...q, correctOptionId: q.correctOptionId ?? '', source: 'practice' }),
      ),
    });
  }

  return NextResponse.json({
    curriculumId: SAMPLE_CURRICULUM.id,
    curriculumLabel: `${SAMPLE_CURRICULUM.subjectName} — Unit ${SAMPLE_CURRICULUM.unit.number}: ${SAMPLE_CURRICULUM.unit.title}`,
    isSample: true,
    questions: getDiagnosticQuestions().map(stripQuestion),
  });
}

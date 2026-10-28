import 'server-only';
import {
  INITIAL_DIAGNOSTIC_ASSESSMENT,
  SAMPLE_CURRICULUM,
} from '@/lib/curriculum';
import type { ServerDiagnosticQuestion } from '@/types/learning';

// ---------------------------------------------------------------------------
// Server-controlled answer key.
//
// The shared curriculum (lib/curriculum.ts) ships to the browser WITHOUT
// correctOptionId. Only this server-only module may attach the keys, and only
// API route handlers run the deterministic check. Never import this file from
// a client component.
// ---------------------------------------------------------------------------

const ANSWER_KEY: Record<string, string> = {
  // Unit I — laser and fiber optics practice
  'q-tqp-1': 'c',
  'q-ec-1': 'b',
  'q-pi-1': 'b',
  'q-lc-1': 'b',
  'q-rl-1': 'b',
  'q-hn-1': 'b',
  'q-lp-1': 'b',
  'q-of-1': 'b',
  'q-na-1': 'b',
  'q-fc-1': 'b',
  // Practice questions (embedded per concept)
  'q-wf-1': 'b',
  'q-wp-1': 'b',
  'q-sup-1': 'c',
  'q-pp-1': 'b',
  'q-ci-1': 'b',
  'q-di-1': 'c',
  'q-si-1': 'b',
  'q-yd-1': 'a',
  'q-fw-1': 'b',
  'q-ia-1': 'a',
  // Initial diagnostic assessment
  'diag-1': 'b',
  'diag-2': 'c',
  'diag-3': 'b',
  'diag-4': 'a',
  'diag-5': 'b',
};

function withKeys(
  questions: Array<
    (typeof SAMPLE_CURRICULUM.concepts)[number]['practiceQuestions'][number] | (typeof INITIAL_DIAGNOSTIC_ASSESSMENT)[number]
  >,
  source: ServerDiagnosticQuestion['source'],
): ServerDiagnosticQuestion[] {
  const out: ServerDiagnosticQuestion[] = [];
  for (const q of questions) {
    const correctOptionId = ANSWER_KEY[q.id];
    out.push({
      ...q,
      source,
      correctOptionId,
    });
  }
  return out;
}

const ALL_QUESTIONS: ServerDiagnosticQuestion[] = [
  ...SAMPLE_CURRICULUM.concepts.flatMap((c) =>
    withKeys(c.practiceQuestions, 'practice'),
  ),
  ...withKeys(
    INITIAL_DIAGNOSTIC_ASSESSMENT as unknown as Array<
      (typeof SAMPLE_CURRICULUM.concepts)[number]['practiceQuestions'][number]
    >,
    'diagnostic',
  ),
];

const BY_ID = new Map(ALL_QUESTIONS.map((q) => [q.id, q]));

export function getQuestionById(id: string): ServerDiagnosticQuestion | null {
  return BY_ID.get(id) ?? null;
}

export function getDiagnosticQuestions(): ServerDiagnosticQuestion[] {
  return ALL_QUESTIONS.filter((q) => q.source === 'diagnostic');
}

/** Strips the answer key before any question leaves the server. */
export function stripQuestion(q: ServerDiagnosticQuestion): Omit<
  ServerDiagnosticQuestion,
  'correctOptionId'
> {
  const { correctOptionId: _correctOptionId, ...rest } = q;
  return rest;
}

export function checkAnswer(
  question: ServerDiagnosticQuestion,
  selectedOptionId: string,
): boolean {
  return (
    question.options.some((o) => o.id === selectedOptionId) &&
    selectedOptionId === question.correctOptionId
  );
}

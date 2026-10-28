import { NextResponse } from 'next/server';
import { tutorBodySchema } from '@/lib/schemas';
import { requireAuth } from '@/lib/server/auth';
import { prisma } from '@/lib/server/db';
import {
  GEMINI_MODEL,
  geminiKeyConfigured,
  generateTutorReply,
  type TutorContext,
} from '@/lib/server/gemini';
import { getConceptById, getDependents, getPrerequisites } from '@/lib/graph';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import { loadLearnerState } from '@/lib/server/state';

const CURRICULUM_ID = SAMPLE_CURRICULUM.id;
const GENERAL_KEY = 'general';
const MAX_STORED_MESSAGES = 20;
const MAX_SENT_TO_GEMINI = 14;

function statusWords(s: string): string {
  switch (s) {
    case 'demonstrated':
      return 'solid';
    case 'developing':
      return 'partially confident';
    case 'needs_review':
      return 'needs review';
    default:
      return 'not yet assessed';
  }
}

async function buildContext(
  conceptId: string | undefined,
  userId: string,
): Promise<TutorContext> {
  const concept = conceptId ? getConceptById(conceptId) : undefined;

  if (!concept) {
    const unit = SAMPLE_CURRICULUM.unit;
    return {
      conceptTitle: 'General waves & wave-optics tutoring',
      conceptSummary: unit.description,
      learningObjective:
        'Help the student navigate the unit and choose a starting concept.',
      prerequisites: [],
      dependents: [],
      masterySummary:
        'No specific concept selected — the student is browsing the unit.',
      applicationNote:
        'Engineering physics unit covering wave mechanics and interference.',
    };
  }

  const state = await loadLearnerState({
    userId,
    displayName: null,
    demoMode: false,
  });
  const mastery = state.mastery[concept.id]?.status ?? 'not_assessed';

  return {
    conceptTitle: concept.title,
    conceptSummary: concept.shortSummary,
    learningObjective: concept.learningObjective,
    formula: concept.formula?.explanation,
    prerequisites: getPrerequisites(concept.id).map((p) => ({
      title: p.title,
      summary: p.shortSummary,
    })),
    dependents: getDependents(concept.id).map((d) => ({
      title: d.title,
      summary: d.shortSummary,
    })),
    masterySummary: `${concept.title}: ${statusWords(mastery)}`,
    applicationNote: concept.realWorldApplication
      ? `${concept.realWorldApplication.title} — ${concept.realWorldApplication.description}`
      : 'n/a',
  };
}

/**
 * GET /api/tutor?conceptId=<id> — the authenticated student's stored
 * conversation for that concept (empty array if none).
 */
export async function GET(request: Request) {
  const auth = await requireAuth();
  if (auth instanceof NextResponse) return auth;

  const url = new URL(request.url);
  const key = url.searchParams.get('conceptId') ?? GENERAL_KEY;

  const conversation = await prisma.tutorConversation.findUnique({
    where: {
      userId_curriculumId_conceptId: {
        userId: auth.userId,
        curriculumId: CURRICULUM_ID,
        conceptId: key,
      },
    },
    include: {
      messages: { orderBy: { createdAt: 'asc' }, take: MAX_STORED_MESSAGES },
    },
  });

  return NextResponse.json({
    messages:
      conversation?.messages.map((m) => ({
        id: m.id,
        role: m.role === 'USER' ? 'user' : 'assistant',
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      })) ?? [],
  });
}

/**
 * POST /api/tutor
 * body: { message, conceptId?, mode?, reset? }
 * Gemini powers explanations only — correctness/scoring is never delegated.
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

  const parsed = tutorBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'validation_failed',
        message: 'Expected { message, conceptId?, mode?, reset? }.',
        issues: parsed.error.issues,
      },
      { status: 422 },
    );
  }
  const { conceptId, message, mode, reset } = parsed.data;
  const key = conceptId ?? GENERAL_KEY;

  if (!conceptId || getConceptById(conceptId) === undefined) {
    if (conceptId) {
      return NextResponse.json(
        { error: 'unknown_concept', message: 'Unknown concept id.' },
        { status: 404 },
      );
    }
  }

  // Reset clears the student's own conversation only.
  if (reset) {
    await prisma.tutorConversation.deleteMany({
      where: { userId: auth.userId, curriculumId: CURRICULUM_ID, conceptId: key },
    });
    return NextResponse.json({ messages: [], reset: true });
  }

  if (!geminiKeyConfigured()) {
    return NextResponse.json(
      {
        error: 'tutor_unavailable',
        message:
          'Gemini is not configured on the server (GEMINI_API_KEY missing). Lessons, assessment and the knowledge graph still work.',
      },
      { status: 503 },
    );
  }

  const existing = await prisma.tutorConversation.findUnique({
    where: {
      userId_curriculumId_conceptId: {
        userId: auth.userId,
        curriculumId: CURRICULUM_ID,
        conceptId: key,
      },
    },
    include: {
      messages: { orderBy: { createdAt: 'desc' }, take: MAX_SENT_TO_GEMINI },
    },
  });

  const storedMessages = (existing?.messages ?? []).reverse();

  // Keep the per-user conversation table bounded.
  if (storedMessages.length >= MAX_STORED_MESSAGES) {
    const overflow = await prisma.tutorMessage.findMany({
      where: { conversationId: existing!.id },
      orderBy: { createdAt: 'desc' },
      skip: MAX_STORED_MESSAGES,
    });
    if (overflow.length > 0) {
      await prisma.tutorMessage.deleteMany({
        where: { id: { in: overflow.map((m) => m.id) } },
      });
    }
  }

  const userMessage = await prisma.tutorMessage.create({
    data: {
      conversationId:
        existing?.id ??
        (
          await prisma.tutorConversation.create({
            data: {
              userId: auth.userId,
              curriculumId: CURRICULUM_ID,
              conceptId: key,
            },
          })
        ).id,
      role: 'USER',
      content: message,
    },
  });

  try {
    const context = await buildContext(conceptId, auth.userId);
    const upstream = [
      ...storedMessages.map((m) => ({
        role: m.role === 'USER' ? ('user' as const) : ('assistant' as const),
        content: m.content,
      })),
      { role: 'user' as const, content: message },
    ];
    const { text } = await generateTutorReply(upstream, mode, context);

    if (!text) {
      return NextResponse.json(
        {
          error: 'tutor_empty_reply',
          message: 'The tutor did not return a reply. Try rephrasing the question.',
        },
        { status: 502 },
      );
    }

    const assistantMessage = await prisma.tutorMessage.create({
      data: {
        conversationId: userMessage.conversationId,
        role: 'ASSISTANT',
        content: text,
      },
    });

    return NextResponse.json({
      reply: text,
      message: {
        id: assistantMessage.id,
        role: 'assistant',
        content: text,
        createdAt: assistantMessage.createdAt.toISOString(),
      },
      userMessage: {
        id: userMessage.id,
        role: 'user',
        content: message,
        createdAt: userMessage.createdAt.toISOString(),
      },
      model: GEMINI_MODEL,
    });
  } catch (err) {
    console.error('[/api/tutor] Gemini call failed', err);
    return NextResponse.json(
      {
        error: 'tutor_unavailable',
        message:
          'The AI teacher is temporarily unavailable. Lessons, assessment and the knowledge graph still work — try again shortly.',
      },
      { status: 502 },
    );
  }
}

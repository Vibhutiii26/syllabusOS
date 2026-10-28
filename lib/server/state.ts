import 'server-only';
import { Prisma } from '@prisma/client';
import type {
  AnswerResultDTO,
  AttemptDTO,
  LearnerStateDTO,
  SavedCurriculumDTO,
} from '@/types/backend';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';
import {
  computeLearningPath,
  computeRecommendations,
} from '@/lib/recommendations';
import { applyAttempt, statusFrom } from '@/lib/learner-state';
import type { MasteryRecord } from '@/lib/learner-state';
import type { Investigation } from '@/lib/diagnosis';
import { advanceInvestigation, openInvestigation } from '@/lib/diagnosis';
import {
  checkAnswer,
  getDiagnosticQuestions,
  getQuestionById,
} from '@/lib/server/questions';
import { prisma } from '@/lib/server/db';
import type { AuthContext } from '@/lib/server/auth';

const CURRICULUM_ID = SAMPLE_CURRICULUM.id;

/** Prisma JSON columns require index-signature-compatible values. */
function toInvestigationJson(inv: Investigation): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(inv)) as Prisma.InputJsonValue;
}

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------

export async function ensureProfile(ctx: AuthContext) {
  return prisma.userProfile.upsert({
    where: { clerkUserId: ctx.userId },
    update: ctx.displayName ? { displayName: ctx.displayName } : {},
    create: {
      clerkUserId: ctx.userId,
      displayName: ctx.displayName,
    },
  });
}

// ---------------------------------------------------------------------------
// Curriculum selection
// ---------------------------------------------------------------------------

export async function saveCurriculumSelection(ctx: AuthContext, curriculumId: string) {
  if (curriculumId !== CURRICULUM_ID) {
    return {
      error: 'unknown_curriculum' as const,
      message:
        'This curriculum id is not offered yet. SyllabusOS currently ships one sample (clearly labeled): ' +
        CURRICULUM_ID,
    };
  }
  const profile = await ensureProfile(ctx);
  const unit = SAMPLE_CURRICULUM.unit;
  await prisma.studentCurriculum.upsert({
    where: { userId: profile.id },
    update: { updatedAt: new Date() },
    create: {
      userId: profile.id,
      curriculumId: CURRICULUM_ID,
      university: SAMPLE_CURRICULUM.university,
      degree: SAMPLE_CURRICULUM.degree,
      branch: SAMPLE_CURRICULUM.branch,
      academicYear: SAMPLE_CURRICULUM.academicYear,
      semester: SAMPLE_CURRICULUM.semester,
      subject: `${SAMPLE_CURRICULUM.subjectCode} ${SAMPLE_CURRICULUM.subjectName}`,
      unitId: unit.id,
      unitTitle: `Unit ${unit.number}: ${unit.title}`,
    },
  });
  return { ok: true as const };
}

function toCurriculumDTO(row: {
  curriculumId: string;
  university: string;
  degree: string;
  branch: string;
  academicYear: string;
  semester: string;
  subject: string;
  unitId: string;
  unitTitle: string;
}): SavedCurriculumDTO {
  return {
    curriculumId: row.curriculumId,
    university: row.university,
    degree: row.degree,
    branch: row.branch,
    academicYear: row.academicYear,
    semester: row.semester,
    subject: row.subject,
    unitId: row.unitId,
    unitTitle: row.unitTitle,
  };
}

// ---------------------------------------------------------------------------
// Reading state
// ---------------------------------------------------------------------------

export async function loadLearnerState(ctx: AuthContext): Promise<LearnerStateDTO> {
  const profile = await ensureProfile(ctx);
  const uid = profile.id;
  const [curriculumRow, masteryRows, attemptRows, progressRows] =
    await Promise.all([
      prisma.studentCurriculum.findUnique({ where: { userId: uid } }),
      prisma.conceptMastery.findMany({
        where: { userId: uid, curriculumId: CURRICULUM_ID },
      }),
      prisma.assessmentAttempt.findMany({
        where: { userId: uid, curriculumId: CURRICULUM_ID },
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
      prisma.learningProgress.findMany({
        where: { userId: uid, curriculumId: CURRICULUM_ID },
        orderBy: { lastStudiedAt: 'desc' },
        take: 8,
      }),
    ]);

  const mastery: LearnerStateDTO['mastery'] = {};
  for (const row of masteryRows) {
    mastery[row.conceptId] = {
      // status is always DERIVED from evidence, never trusted from storage
      status: statusFrom(row),
      evidenceScore: row.evidenceScore,
      questionsAttempted: row.questionsAttempted,
      questionsCorrect: row.questionsCorrect,
      lastAssessedAt: row.lastAssessedAt?.toISOString() ?? null,
    };
  }
  const masteryForEngine: Record<string, MasteryRecord> = {};
  for (const [id, m] of Object.entries(mastery)) {
    masteryForEngine[id] = {
      status: m.status,
      evidenceScore: m.evidenceScore,
      questionsAttempted: m.questionsAttempted,
      questionsCorrect: m.questionsCorrect,
      lastUpdated: m.lastAssessedAt,
    };
  }

  const diagnosticIds = new Set(getDiagnosticQuestions().map((q) => q.id));
  const answeredDiagnostic = new Set(
    attemptRows
      .filter((a) => diagnosticIds.has(a.questionId))
      .map((a) => a.questionId),
  );

  const investigation: Investigation | null =
    (profile.activeInvestigation as unknown as Investigation | null) ?? null;

  const recommendations = computeRecommendations({
    mastery: masteryForEngine,
    investigation,
    hasCurriculum: Boolean(curriculumRow),
  });

  // While an investigation is diagnosing/remediating, the next question the
  // student should answer is the suspected prerequisite's own question.
  let nextQuestionId: string | null = null;
  if (investigation && investigation.stage !== 'resolved') {
    const prereq = SAMPLE_CURRICULUM.concepts.find(
      (c) => c.id === investigation.suspectedPrerequisiteId,
    );
    nextQuestionId = prereq?.practiceQuestions[0]?.id ?? null;
  }

  return {
    user: {
      id: ctx.userId,
      displayName: ctx.displayName,
      demoMode: ctx.demoMode,
    },
    curriculum: curriculumRow ? toCurriculumDTO(curriculumRow) : null,
    diagnosticCompleted:
      diagnosticIds.size > 0 && answeredDiagnostic.size === diagnosticIds.size,
    mastery,
    history: attemptRows.map((a) => ({
      id: a.id,
      questionId: a.questionId,
      conceptId: a.conceptId,
      selectedOptionId: a.selectedOptionId,
      isCorrect: a.isCorrect,
      source: a.source.toLowerCase() as AttemptDTO['source'],
      createdAt: a.createdAt.toISOString(),
    })),
    investigation,
    nextQuestionId,
    recommendations,
    learningPath: computeLearningPath(mastery),
    recentStudied: progressRows.map((p) => ({
      conceptId: p.conceptId,
      completed: p.completed,
      lastStudiedAt: p.lastStudiedAt.toISOString(),
    })),
  };
}

// ---------------------------------------------------------------------------
// Answering questions (deterministic check + persistence + FSM)
// ---------------------------------------------------------------------------

const DIAGNOSIS_MESSAGES = {
  opened: (p: { suspected: string; target: string }) =>
    `Answer saved — incorrect. Not enough to conclude anything yet: this is only a hypothesis. Before retrying the ${p.target} question, take one quick check on the prerequisite (${p.suspected}). Only your answer there confirms or rules it out.`,
  remediate: (p: { suspected: string; target: string }) =>
    `Both ${p.target} and its prerequisite ${p.suspected} were missed. Review ${p.suspected} first — when you can answer its check correctly, come back to ${p.target}.`,
  prereqOk: (p: { suspected: string; target: string }) =>
    `The ${p.suspected} check passed, so the wrong answer on ${p.target} looks like a concept-specific gap rather than a missing prerequisite. Re-read that lesson's explanation, then retry its question.`,
  resolvedPractice: (p: { target: string }) =>
    `Correct — that closes the loop on ${p.target}. Your learner graph has been updated.`,
  targetFixed: (p: { target: string }) =>
    `Correct on ${p.target} — the flagged prerequisite investigation is now closed. Your learner graph has been updated.`,
};

export async function applyAnswer(
  ctx: AuthContext,
  questionId: string,
  selectedOptionId: string,
): Promise<
  | { error: 'unknown_question' }
  | { error: 'unknown_option' }
  | { ok: AnswerResultDTO }
> {
  const question = getQuestionById(questionId);
  if (!question) return { error: 'unknown_question' };
  if (!question.options.some((o) => o.id === selectedOptionId)) {
    return { error: 'unknown_option' };
  }
  const profile = await ensureProfile(ctx);
  const owner = profile.id;

  // Deterministic check — the server owns the key, never the client.
  const isCorrect = checkAnswer(question, selectedOptionId);
  const chosen = question.options.find((o) => o.id === selectedOptionId);
  const chosenExplanation =
    chosen?.explanation ?? question.explanation ?? 'Answer recorded.';

  // 1. Persist the attempt (scoped to this user only).
  await prisma.assessmentAttempt.create({
    data: {
      userId: owner,
      curriculumId: CURRICULUM_ID,
      questionId: question.id,
      conceptId: question.conceptId,
      selectedOptionId,
      isCorrect,
      source:
        question.source === 'diagnostic'
          ? 'DIAGNOSTIC'
          : question.source === 'practice'
            ? 'PRACTICE'
            : 'REMEDIATION',
    },
  });

  // 2. Update mastery evidence for that concept.
  const prevRow = await prisma.conceptMastery.findUnique({
    where: {
      userId_curriculumId_conceptId: {
        userId: owner,
        curriculumId: CURRICULUM_ID,
        conceptId: question.conceptId,
      },
    },
  });

  const updated = applyAttempt(
    prevRow
      ? {
          status: statusFrom(prevRow),
          evidenceScore: prevRow.evidenceScore,
          questionsAttempted: prevRow.questionsAttempted,
          questionsCorrect: prevRow.questionsCorrect,
          lastUpdated: prevRow.lastAssessedAt?.toISOString() ?? null,
        }
      : undefined,
    question,
    isCorrect,
  );

  const statusEnum =
    updated.status === 'not_assessed'
      ? 'NOT_ASSESSED'
      : updated.status === 'needs_review'
        ? 'NEEDS_REVIEW'
        : updated.status === 'developing'
          ? 'DEVELOPING'
          : 'DEMONSTRATED';
  const lastEvidence = {
    questionId: question.id,
    isCorrect,
    difficulty: question.difficulty,
    source: question.source,
    at: updated.lastUpdated,
  };

  await prisma.conceptMastery.upsert({
    where: {
      userId_curriculumId_conceptId: {
        userId: owner,
        curriculumId: CURRICULUM_ID,
        conceptId: question.conceptId,
      },
    },
    update: {
      status: statusEnum,
      evidenceScore: updated.evidenceScore,
      questionsAttempted: updated.questionsAttempted,
      questionsCorrect: updated.questionsCorrect,
      lastEvidenceJson: lastEvidence,
      lastAssessedAt: updated.lastUpdated ? new Date(updated.lastUpdated) : new Date(),
    },
    create: {
      userId: owner,
      curriculumId: CURRICULUM_ID,
      conceptId: question.conceptId,
      status: statusEnum,
      evidenceScore: updated.evidenceScore,
      questionsAttempted: updated.questionsAttempted,
      questionsCorrect: updated.questionsCorrect,
      lastEvidenceJson: lastEvidence,
      lastAssessedAt: updated.lastUpdated ? new Date(updated.lastUpdated) : new Date(),
    },
  });

  await prisma.learningProgress.upsert({
    where: {
      userId_curriculumId_conceptId: {
        userId: owner,
        curriculumId: CURRICULUM_ID,
        conceptId: question.conceptId,
      },
    },
    update: { lastStudiedAt: new Date() },
    create: {
      userId: owner,
      curriculumId: CURRICULUM_ID,
      conceptId: question.conceptId,
    },
  });

  // 3. Prerequisite-aware diagnosis FSM.
  const active = (profile.activeInvestigation as unknown as Investigation | null) ?? null;
  let diagnosis: AnswerResultDTO['diagnosis'] = null;

  if (
    active &&
    question.conceptId === active.suspectedPrerequisiteId &&
    question.source !== 'diagnostic'
  ) {
    // Student is answering the suspected prerequisite's targeted check.
    const advanced = advanceInvestigation(
      active,
      question.id,
      question.conceptId,
      isCorrect,
    );
    if (advanced.stage === 'resolved') {
      await prisma.userProfile.update({
        where: { id: profile.id },
        data: { activeInvestigation: Prisma.JsonNull },
      });
      if (advanced.outcome === 'prerequisite_ok') {
        diagnosis = {
          opened: false,
          stage: 'resolved',
          message: DIAGNOSIS_MESSAGES.prereqOk({
            suspected: active.suspectedPrerequisiteId,
            target: active.targetConceptId,
          }),
        };
      } else if (advanced.outcome === 'prerequisite_gap_remediated') {
        diagnosis = {
          opened: false,
          stage: 'resolved',
          message: `Gap in ${active.suspectedPrerequisiteId} confirmed and now remediated — retry ${active.targetConceptId} to rebuild the full chain.`,
        };
      }
    } else {
      await prisma.userProfile.update({
        where: { id: profile.id },
        data: { activeInvestigation: toInvestigationJson(advanced) },
      });
      diagnosis = {
        opened: false,
        stage: advanced.stage,
        message: DIAGNOSIS_MESSAGES.remediate({
          suspected: active.suspectedPrerequisiteId,
          target: active.targetConceptId,
        }),
        suggestedPrerequisiteId: active.suspectedPrerequisiteId,
      };
    }
  } else if (
    !active &&
    !isCorrect &&
    question.prerequisiteHintId &&
    question.source !== 'diagnostic'
  ) {
    // Wrong answer on a concept with a prereq → open a HYPOTHESIS only.
    const inv = openInvestigation(question, null);
    if (inv && inv.stage !== 'resolved') {
      await prisma.userProfile.update({
        where: { id: profile.id },
        data: { activeInvestigation: toInvestigationJson(inv) },
      });
      diagnosis = {
        opened: true,
        stage: inv.stage,
        message: DIAGNOSIS_MESSAGES.opened({
          suspected: inv.suspectedPrerequisiteId,
          target: inv.targetConceptId,
        }),
        suggestedPrerequisiteId: inv.suspectedPrerequisiteId,
      };
    }
  } else if (
    active &&
    question.conceptId === active.targetConceptId &&
    isCorrect
  ) {
    // Student fixed the original concept — close the investigation.
    await prisma.userProfile.update({
      where: { id: profile.id },
      data: { activeInvestigation: Prisma.JsonNull },
    });
    diagnosis = {
      opened: false,
      stage: 'resolved',
      message: DIAGNOSIS_MESSAGES.targetFixed({ target: active.targetConceptId }),
    };
  }

  const state = await loadLearnerState(ctx);
  return {
    ok: {
      isCorrect,
      explanation: chosenExplanation,
      diagnosis,
      state,
    },
  };
}

// ---------------------------------------------------------------------------
// Study tracking
// ---------------------------------------------------------------------------

export async function markStudied(
  ctx: AuthContext,
  conceptId: string,
  completed?: boolean,
): Promise<{ error: 'unknown_concept' } | { ok: true }> {
  if (!SAMPLE_CURRICULUM.concepts.some((c) => c.id === conceptId)) {
    return { error: 'unknown_concept' };
  }
  const profile = await ensureProfile(ctx);
  await prisma.learningProgress.upsert({
    where: {
      userId_curriculumId_conceptId: {
        userId: profile.id,
        curriculumId: CURRICULUM_ID,
        conceptId,
      },
    },
    update: {
      lastStudiedAt: new Date(),
      ...(completed === undefined ? {} : { completed }),
    },
    create: {
      userId: profile.id,
      curriculumId: CURRICULUM_ID,
      conceptId,
      completed: completed ?? false,
    },
  });
  return { ok: true };
}

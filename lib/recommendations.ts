// ---------------------------------------------------------------------------
// Personalized learning path (deterministic, DB/AI independent).
// Every recommendation carries the WHY, derived from graph + learner evidence.
// ---------------------------------------------------------------------------

import { conceptOrder, getConceptById, getPrerequisites } from '@/lib/graph';
import type { Investigation } from '@/lib/diagnosis';
import type { MasteryStatus, LearnerState, LearningRecommendation } from '@/types/learning';
import type { MasteryRecord } from '@/lib/learner-state';

export interface Recommendation {
  conceptId: string;
  priority: 'high' | 'medium' | 'low';
  badge:
    | 'Prerequisite Gap'
    | 'Recommended Next'
    | 'Review Foundation'
    | 'Deepen Practice'
    | 'Ready to Master';
  reason: string;
}

export function computeRecommendations(args: {
  mastery: Record<string, MasteryRecord>;
  investigation: Investigation | null;
  hasCurriculum: boolean;
}): Recommendation[] {
  const { mastery, investigation, hasCurriculum } = args;
  if (!hasCurriculum) return [];

  const recs: Recommendation[] = [];

  // 1 — An open prerequisite investigation always wins.
  if (investigation && investigation.stage !== 'resolved') {
    const prereq = getConceptById(investigation.suspectedPrerequisiteId);
    const target = getConceptById(investigation.targetConceptId);
    recs.push({
      conceptId: investigation.suspectedPrerequisiteId,
      priority: 'high',
      badge: 'Prerequisite Gap',
      reason:
        investigation.stage === 'diagnosing'
          ? `Answer a quick check on ${prereq?.title ?? investigation.suspectedPrerequisiteId} — we suspect it blocks ${target?.title ?? investigation.targetConceptId}.`
          : `Review ${prereq?.title ?? investigation.suspectedPrerequisiteId} first because it is a prerequisite for ${target?.title ?? investigation.targetConceptId}.`,
    });
  }

  // 2 — Concepts flagged needs_review.
  for (const c of conceptOrder()) {
    const m = mastery[c.id];
    if (m?.status === 'needs_review') {
      recs.push({
        conceptId: c.id,
        priority: 'high',
        badge: 'Review Foundation',
        reason: `Recent answers on ${c.title} were incorrect (evidence ${m.evidenceScore}/100). Review the lesson, then retry.`,
      });
    }
  }

  // 3 — Recommended next: the earliest unassessed concept whose prerequisites
  // are all demonstrated (or developing >= 65).
  for (const c of conceptOrder()) {
    const m = mastery[c.id];
    if (m && m.status === 'demonstrated') continue;

    const prereqs = getPrerequisites(c.id);
    const prereqsMet = prereqs.every((p) => {
      const pm = mastery[p.id];
      return pm && (pm.status === 'demonstrated' || pm.evidenceScore >= 65);
    });

    if (prereqsMet) {
      if (!m || m.status === 'not_assessed') {
        const prereqNames = prereqs.map((p) => p.title).join(', ');
        recs.push({
          conceptId: c.id,
          priority: recs.length === 0 ? 'high' : 'medium',
          badge: 'Recommended Next',
          reason:
            prereqs.length > 0
              ? `You demonstrated the foundations (${prereqNames}). You are ready to unlock ${c.title}.`
              : `Foundational starting point for the syllabus: explore ${c.title}.`,
        });
        break;
      }
      if (m.status === 'developing') {
        recs.push({
          conceptId: c.id,
          priority: 'medium',
          badge: 'Deepen Practice',
          reason: `You're developing understanding in ${c.title} (${m.evidenceScore}% evidence). Try another question to solidify.`,
        });
      }
    }
  }

  // 4 — Fallback: first unassessed concept anywhere.
  if (recs.length === 0) {
    const firstUnassessed = conceptOrder().find(
      (c) => (mastery[c.id]?.status ?? 'not_assessed') === 'not_assessed',
    );
    if (firstUnassessed) {
      recs.push({
        conceptId: firstUnassessed.id,
        priority: 'medium',
        badge: 'Recommended Next',
        reason: `Continue your syllabus progression with ${firstUnassessed.title}.`,
      });
    } else {
      const anyDeveloping = conceptOrder().find(
        (c) => mastery[c.id]?.status === 'developing',
      );
      if (anyDeveloping) {
        recs.push({
          conceptId: anyDeveloping.id,
          priority: 'low',
          badge: 'Deepen Practice',
          reason: `Solid start on ${anyDeveloping.title}. Try the next check to sharpen it.`,
        });
      } else {
        recs.push({
          conceptId: conceptOrder()[0]?.id ?? 'wave-fundamentals',
          priority: 'low',
          badge: 'Ready to Master',
          reason: 'Outstanding work! All concepts demonstrated. Keep practicing to maintain fluency.',
        });
      }
    }
  }

  const rank = { high: 0, medium: 1, low: 2 } as const;
  return recs.sort(
    (a, b) => rank[a.priority] - rank[b.priority],
  ).slice(0, 6);
}

/** The full curriculum walk order, annotated with mastery status. */
export function computeLearningPath(
  mastery: Record<
    string,
    { status?: MasteryStatus } | undefined
  >,
): Array<{ conceptId: string; status: MasteryStatus }> {
  return conceptOrder().map((c) => ({
    conceptId: c.id,
    status: mastery[c.id]?.status ?? 'not_assessed',
  }));
}

export function generateRecommendations(state: LearnerState): LearningRecommendation[] {
  const convertedMastery: Record<string, MasteryRecord> = {};
  for (const [id, m] of Object.entries(state.mastery)) {
    convertedMastery[id] = {
      status: m.status,
      evidenceScore: m.evidenceScore,
      questionsAttempted: m.questionsAttempted,
      questionsCorrect: m.questionsCorrect,
      lastUpdated: m.lastUpdated,
    };
  }

  const investigation: Investigation | null = state.activeInvestigation
    ? {
        targetConceptId: state.activeInvestigation.targetConceptId,
        suspectedPrerequisiteId: state.activeInvestigation.suspectedPrerequisiteId,
        hypothesis: state.activeInvestigation.hypothesis,
        stage: state.activeInvestigation.stage === 'practice' ? 'remediating' : state.activeInvestigation.stage,
        openedAt: new Date().toISOString(),
      }
    : null;

  const recs = computeRecommendations({
    mastery: convertedMastery,
    investigation,
    hasCurriculum: true,
  });

  return recs as LearningRecommendation[];
}

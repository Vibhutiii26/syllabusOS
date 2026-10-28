// ---------------------------------------------------------------------------
// Prerequisite-aware diagnosis (deterministic FSM, DB/AI independent).
//
// A wrong answer creates a *hypothesis* about a prerequisite gap. Only
// further answers close it. Never assume a gap from a single wrong answer.
// ---------------------------------------------------------------------------

import type {
  ServerDiagnosticQuestion,
  DiagnosticQuestion,
  LearnerState,
} from '@/types/learning';
import { getConceptById, getPrerequisites } from '@/lib/graph';
import { SAMPLE_CURRICULUM } from '@/lib/curriculum';

export type InvestigationStage = 'diagnosing' | 'remediating' | 'resolved';

const concept = (id: string) => getConceptById(id);

export interface Investigation {
  targetConceptId: string;
  suspectedPrerequisiteId: string;
  hypothesis: string;
  stage: InvestigationStage;
  outcome?: 'prerequisite_ok' | 'prerequisite_gap_remediated' | 'targeted_rereview';
  openedAt: string;
}

/** True if the concept is a prerequisite of <code>targetId</code>. */
export function isAnyPrerequisiteOf(
  maybePrerequisiteId: string,
  targetId: string,
): boolean {
  return getPrerequisites(targetId).some((p) => p.id === maybePrerequisiteId);
}

/**
 * A wrong answer for the target concept should trigger a *hypothesis*, not a
 * verdict. Only investigate an actual flagged prerequisite; otherwise treat
 * it as a concept-level misunderstanding.
 */
export function shouldOpenInvestigation(
  question: ServerDiagnosticQuestion,
): boolean {
  return Boolean(question.prerequisiteHintId);
}

export function openInvestigation(
  question: ServerDiagnosticQuestion,
  suspectedPrerequisiteMasteryStatus: string | null,
): Investigation | null {
  if (!question.prerequisiteHintId) return null;
  // If the prerequisite is already demonstrated, don't blame it — the miss is
  // more likely a misunderstanding of the target concept itself.
  if (suspectedPrerequisiteMasteryStatus === 'demonstrated') {
    return {
      targetConceptId: question.conceptId,
      suspectedPrerequisiteId: question.prerequisiteHintId,
      hypothesis: `Answering ${question.conceptId} incorrectly while ${question.prerequisiteHintId} looks solid — suspect a concept-level gap, not the prerequisite.`,
      stage: 'resolved',
      outcome: 'targeted_rereview',
      openedAt: new Date().toISOString(),
    };
  }
  const prereq = getConceptById(question.prerequisiteHintId);
  const target = getConceptById(question.conceptId);
  return {
    targetConceptId: question.conceptId,
    suspectedPrerequisiteId: question.prerequisiteHintId,
    hypothesis: `Missing answer on ${
      target?.title ?? question.conceptId
    } may stem from a weaker prerequisite: ${
      prereq?.title ?? question.prerequisiteHintId
    }.`,
    stage: 'diagnosing',
    openedAt: new Date().toISOString(),
  };
}

/**
 * After answering the suspected prerequisite's question, decide the next
 * stage of the investigation.
 */
export function advanceInvestigation(
  inv: Investigation,
  prereqQuestionId: string,
  prereqConceptId: string,
  isCorrect: boolean,
): Investigation {
  if (inv.stage === 'resolved') return inv;
  // Only the suspected prerequisite's own question advances the FSM.
  if (prereqConceptId !== inv.suspectedPrerequisiteId) return inv;
  if (isCorrect) {
    return {
      ...inv,
      stage: 'resolved',
      outcome:
        inv.stage === 'remediating' ? 'prerequisite_gap_remediated' : 'prerequisite_ok',
      hypothesis:
        inv.hypothesis +
        ` The ${inv.suspectedPrerequisiteId} check passed — treat the ${inv.targetConceptId} miss as a concept-specific gap instead.`,
    };
  }
  return {
    ...inv,
    stage: 'remediating',
    hypothesis:
      inv.hypothesis +
      ` The ${inv.suspectedPrerequisiteId} check also failed — review ${inv.suspectedPrerequisiteId} before returning to ${inv.targetConceptId}.`,
  };
}

// ---------------------------------------------------------------------------
// Client-side Prerequisite Diagnostic Detective & Remediation Helpers
// ---------------------------------------------------------------------------

export const PREREQUISITE_TREE: Record<string, string[]> = {
  'wave-parameters': ['wave-fundamentals'],
  'superposition': ['wave-parameters'],
  'phase-path-difference': ['wave-parameters'],
  'constructive-interference': ['superposition', 'phase-path-difference'],
  'destructive-interference': ['superposition', 'phase-path-difference'],
  'sustained-interference': ['constructive-interference', 'destructive-interference'],
  'young-double-slit': ['phase-path-difference', 'sustained-interference'],
  'fringe-width': ['young-double-slit', 'wave-parameters'],
  'interference-applications': ['destructive-interference', 'constructive-interference', 'fringe-width']
};

export interface PrerequisiteDiagnosticResult {
  hasPrerequisiteGap: boolean;
  suspectedConceptId?: string;
  diagnosticQuestion?: DiagnosticQuestion;
  hypothesis?: string;
  rationale?: string;
}

export function analyzeFailureForPrerequisites(
  conceptId: string,
  question: DiagnosticQuestion,
  learnerState: LearnerState
): PrerequisiteDiagnosticResult {
  let candidatePrereqId = question.prerequisiteHintId;

  if (!candidatePrereqId) {
    const prereqs = PREREQUISITE_TREE[conceptId] || [];
    candidatePrereqId = prereqs.find((id) => {
      const rec = learnerState.mastery[id];
      return !rec || rec.status === 'needs_review' || rec.status === 'not_assessed' || rec.evidenceScore < 70;
    }) || prereqs[0];
  }

  if (!candidatePrereqId) {
    return {
      hasPrerequisiteGap: false,
      rationale: 'Concept is fundamental with no immediate unverified prerequisites.'
    };
  }

  const prereqConcept = concept(candidatePrereqId);
  const targetConcept = concept(conceptId);

  if (!prereqConcept || !targetConcept) {
    return { hasPrerequisiteGap: false };
  }

  const diagnosticQ = prereqConcept.practiceQuestions[0] || {
    id: `diag-check-${prereqConcept.id}`,
    conceptId: prereqConcept.id,
    prompt: `To diagnose your understanding of ${targetConcept.title}, let's verify ${prereqConcept.title}: What is the core condition?`,
    options: [
      { id: 'opt-a', text: prereqConcept.shortSummary, explanation: 'Correct foundational understanding.' },
      { id: 'opt-b', text: 'An arbitrary assumption with no physical basis', explanation: 'Incorrect.' }
    ],
    explanation: prereqConcept.shortSummary,
    difficulty: 'beginner' as const
  };

  const hypothesis = `Struggle with "${targetConcept.title}" is likely caused by an unverified foundation in "${prereqConcept.title}".`;

  return {
    hasPrerequisiteGap: true,
    suspectedConceptId: candidatePrereqId,
    diagnosticQuestion: diagnosticQ,
    hypothesis,
    rationale: `"${prereqConcept.title}" is a direct prerequisite of "${targetConcept.title}". Verifying this prevents struggling with advanced formulas without foundational intuition.`
  };
}

export function getRemediationContent(prereqId: string, targetId: string) {
  const prereq = concept(prereqId);
  const target = concept(targetId);

  if (!prereq || !target) return null;

  return {
    prerequisiteTitle: prereq.title,
    targetTitle: target.title,
    analogy: prereq.storyAnalogy,
    keyTakeaway: prereq.shortSummary,
    formulaSnippet: prereq.formula ? prereq.formula.latex : undefined,
    stepByStepAdvice: [
      `Step 1: Re-anchor the foundational concept (${prereq.title}) using the physical analogy.`,
      `Step 2: Understand why ${target.title} directly builds upon this principle.`,
      `Step 3: Try a targeted practice problem to build confidence before returning.`
    ]
  };
}

import {
  Concept,
  DiagnosticQuestion,
  LearnerState,
  ActivePrerequisiteInvestigation
} from '@/types/learning';
import { SAMPLE_CURRICULUM } from './curriculum';

export interface PrerequisiteDiagnosticResult {
  hasPrerequisiteGap: boolean;
  suspectedConceptId?: string;
  diagnosticQuestion?: DiagnosticQuestion;
  hypothesis?: string;
  rationale?: string;
}

/**
 * Maps concepts to their primary foundational prerequisites for diagnostic branching.
 */
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

/**
 * Analyzes an incorrect answer and determines if a prerequisite diagnostic check should be launched.
 */
export function analyzeFailureForPrerequisites(
  conceptId: string,
  question: DiagnosticQuestion,
  learnerState: LearnerState
): PrerequisiteDiagnosticResult {
  // If the question explicitly has a prerequisite hint, prioritize it
  let candidatePrereqId = question.prerequisiteHintId;

  // Otherwise, inspect the prerequisite tree
  if (!candidatePrereqId) {
    const prereqs = PREREQUISITE_TREE[conceptId] || [];
    // Pick the prerequisite with the weakest demonstrated evidence
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

  const prereqConcept = SAMPLE_CURRICULUM.concepts.find((c) => c.id === candidatePrereqId);
  const targetConcept = SAMPLE_CURRICULUM.concepts.find((c) => c.id === conceptId);

  if (!prereqConcept || !targetConcept) {
    return { hasPrerequisiteGap: false };
  }

  // Find a diagnostic question for the prerequisite
  const diagnosticQ = prereqConcept.practiceQuestions[0] || {
    id: `diag-check-${prereqConcept.id}`,
    conceptId: prereqConcept.id,
    prompt: `To diagnose your understanding of ${targetConcept.title}, let's verify ${prereqConcept.title}: What is the core condition for this concept?`,
    options: [
      { id: 'opt-a', text: prereqConcept.shortSummary, explanation: 'Correct foundational understanding.' },
      { id: 'opt-b', text: 'An arbitrary assumption with no physical basis', explanation: 'Incorrect.' }
    ],
    correctOptionId: 'opt-a',
    explanation: prereqConcept.shortSummary,
    difficulty: 'beginner'
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

/**
 * Creates a remediation plan when a prerequisite gap is confirmed.
 */
export function getRemediationContent(prereqId: string, targetId: string) {
  const prereq = SAMPLE_CURRICULUM.concepts.find((c) => c.id === prereqId);
  const target = SAMPLE_CURRICULUM.concepts.find((c) => c.id === targetId);

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

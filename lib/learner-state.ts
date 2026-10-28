import {
  LearnerState,
  ConceptMasteryRecord,
  MasteryStatus,
  AssessmentRecord,
  ActivePrerequisiteInvestigation,
  LearningRecommendation
} from '@/types/learning';
import { SAMPLE_CURRICULUM } from './curriculum';

export const STORAGE_KEY = 'syllabus_os_learner_state_v1';
export const CHAT_STORAGE_KEY = 'syllabus_os_chat_history_v1';

export function getDefaultLearnerState(): LearnerState {
  const mastery: Record<string, ConceptMasteryRecord> = {};
  const now = new Date().toISOString();

  SAMPLE_CURRICULUM.concepts.forEach((concept) => {
    mastery[concept.id] = {
      status: 'not_assessed',
      evidenceScore: 0,
      questionsAttempted: 0,
      questionsCorrect: 0,
      lastUpdated: now
    };
  });

  return {
    curriculumId: SAMPLE_CURRICULUM.id,
    mastery,
    assessmentHistory: [],
    activeInvestigation: null,
    recentStudiedConceptIds: ['wave-fundamentals'],
    activeConceptId: 'wave-fundamentals',
    activeNavTab: 'learning'
  };
}

export function loadLearnerState(): LearnerState {
  if (typeof window === 'undefined') {
    return getDefaultLearnerState();
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return getDefaultLearnerState();

    const parsed = JSON.parse(raw) as LearnerState;
    // Merge in any missing concepts from the curriculum
    const defaultState = getDefaultLearnerState();
    const mergedMastery = { ...defaultState.mastery, ...(parsed.mastery || {}) };

    return {
      ...defaultState,
      ...parsed,
      mastery: mergedMastery,
      recentStudiedConceptIds: parsed.recentStudiedConceptIds || ['wave-fundamentals'],
      activeConceptId: parsed.activeConceptId || 'wave-fundamentals',
      activeNavTab: parsed.activeNavTab || 'learning'
    };
  } catch (err) {
    console.warn('Failed to parse saved learner state, falling back to defaults:', err);
    return getDefaultLearnerState();
  }
}

export function saveLearnerState(state: LearnerState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    console.error('Failed to save learner state to localStorage:', err);
  }
}

/**
 * Calculates new mastery status and evidence score.
 * Never labels "demonstrated" on a single lucky guess;
 * Requires consistent correct evidence.
 */
export function calculateMasteryUpdate(
  current: ConceptMasteryRecord,
  isCorrect: boolean
): ConceptMasteryRecord {
  const newAttempted = current.questionsAttempted + 1;
  const newCorrect = current.questionsCorrect + (isCorrect ? 1 : 0);
  const accuracy = newCorrect / newAttempted;

  // Evidence score scales with accuracy and volume of attempts (confidence)
  // 1 attempt correct = 60 (developing)
  // 2 attempts, 2 correct = 85 (developing/demonstrated)
  // 3+ attempts, >80% correct = 90+ (demonstrated)
  // 0 correct = 20 (needs_review)
  let evidenceScore = Math.round(accuracy * 100);
  let status: MasteryStatus = 'developing';

  if (newAttempted === 1) {
    if (isCorrect) {
      evidenceScore = 65;
      status = 'developing';
    } else {
      evidenceScore = 25;
      status = 'needs_review';
    }
  } else if (newAttempted >= 2) {
    if (accuracy >= 0.75 && newCorrect >= 2) {
      status = 'demonstrated';
      evidenceScore = Math.min(100, Math.round(accuracy * 100));
    } else if (accuracy >= 0.4) {
      status = 'developing';
      evidenceScore = Math.round(accuracy * 100);
    } else {
      status = 'needs_review';
      evidenceScore = Math.max(10, Math.round(accuracy * 100));
    }
  }

  return {
    status,
    evidenceScore,
    questionsAttempted: newAttempted,
    questionsCorrect: newCorrect,
    lastUpdated: new Date().toISOString()
  };
}
